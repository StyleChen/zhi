/**
 * Created by Administrator on 2017/6/26.
 */
$(function () {
    var userId = sessionStorage.userId;

    //加载页头
    if($(".headerContainer").length > 0){
        $(".headerContainer").load("headerIndex.html",function () {

            //获取分类商品列表
            var goodsType = [
                {
                    type:"life",
                    name:"Home Decor",
                    enName:"LIFE HOME SERISE",
                    img:"images/productClass1_03.png"
                },
                {
                    type:"storage",
                    name:"Storage Series",
                    enName:"LIFE HOME SERISE",
                    img:"images/productClass1_03.png"
                },
                {
                    type:"office",
                    name:"Office Series",
                    enName:"LIFE HOME SERISE",
                    img:"images/productClass1_03.png"
                },
                {
                    type:"toy",
                    name:"Jigsaw Puzzle Toys Series",
                    enName:"LIFE HOME SERISE",
                    img:"images/productClass1_03.png"
                }
            ];
            var series = getUrlParam("series");
            var navs = '<li><a href="index.html">Home</a></li>';
            var active = '';
            for(var s=0;s<goodsType.length;s++){

                if(series == goodsType[s].type){
                    navs += '<li class="nav-active"><a href="goods.html?series='+goodsType[s].type+'">'+goodsType[s].name+'</a></li>';
                }else{
                    navs += '<li><a href="goods.html?series='+goodsType[s].type+'">'+goodsType[s].name+'</a></li>';
                }
            }
            $("#nav").prepend(navs);
            if($(".nav-active").length == 0){
                $("#nav li").eq(0).addClass("nav-active")
            }


            // 导航hover
            var nav = {
                parent:$("#nav"),
                children:$("#nav li"),
                navActiveWidth:$(".nav-active").width(),
                navActiveLeft:$(".nav-active").position().left,
                hoverBefore:function (el) {
                    $(".hover-active").css({
                        left:nav.navActiveLeft,
                        width:nav.navActiveWidth
                    })
                },
                hoverEnterAction:function (el) {
                    nav.children.removeClass("nav-active");
                    el.addClass("nav-active");
                    /*nav.navActiveLeft = $(".nav-active").position().left;
                     nav.navActiveWidth = $(".nav-active").width();*/
                    $(".hover-active").css({
                        left:$(".nav-active").position().left,
                        width:$(".nav-active").width()
                    })
                },
                hoverOverAction:function (el) {

                }
            };
            nav.hoverBefore();
            $("#nav li").hover(function () {
                nav.hoverEnterAction($(this));
            },function () {
                nav.hoverBefore();
            });
            // 全部商品导航hover
            $(".allProduct").hover(function () {
                $(".navAll").slideDown(200)
            },function () {
                $(".navAll").stop().slideUp(200);
            });
            header();
        });
    }else if($(".headerOrderContainer").length > 0){
        $(".headerOrderContainer").load("headerOrder.html",function () {
            var pathname = window.location.pathname;
            if(pathname.indexOf("pay.html") !== -1){
                $(".pageTitle ").html("Checkout Counter");
            }else if(pathname.indexOf("callback.html") !== -1){
                $(".pageTitle ").html("Check Out");
            }else if(pathname.indexOf("order.html") !== -1){
                $(".pageTitle ").html("Check Out");
            }
            header()
        });
    }
    $("footer").load("footer.html");//加载页尾

    //头部加载完的一些操作
    function header() {
        if(userId != undefined){
            $(".userLogin").html("<span>"+sessionStorage.userName+"</span>|<a class='out' href='#'>Log Out</a>");
            shopAjax("post","cart/load",{userId:userId},function (res) {
                var data = res.data.length;
                $(".cartNumber").html(data);
            },function (res) {
                console.log(res);
            });
            $(".out").click(function () {
                sessionStorage.removeItem("userName");
                sessionStorage.removeItem("userId");
                location.reload();
            });
        }
        // 登录
        $(".showLogin").click(function (event) {
            event.preventDefault();
            login();
        });
        // 注册
        $(".showRegister").click(function (event) {
            event.preventDefault();
            register()
        });
        //去购物车
        $(".order,.shoppingCart").click(function (event) {
            //请先登录
            userId = sessionStorage.userId;
            if(userId == undefined){
                event.preventDefault();
                loginBefore();
                return;
            }
        });
        //搜索
        $("#searchClick").click(function (event) {
            event.preventDefault();
            var key = $("#search").val();
            location.href = "goods.html?key="+key;
        });
        $("#search").focus(function () {
            $(document).keydown(function (event) {
                if(event.keyCode == 13){
                    event.preventDefault();
                    $("#searchClick").trigger("click")
                }
            })
        })
    }

    //登录
    function login() {
        $(".login").fadeIn(200).load("login.html",function () {
            $(".remaked").show();
            //历史登录用户名
            if(localStorage.userName != undefined){
                $(".userName").val(localStorage.userName)
            }
            //关闭登录框
            $(".closeL").click(function () {
                $(".login").fadeOut(200);
            });
            //enter 键盘enter建触发登录/注册
            $(document).keydown(function (event) {
                if(event.keyCode == 13){
                    event.preventDefault();
                    $(".submit").trigger("click")
                }
            });
            //去注册
            $(".register").click(function (event) {
                event.preventDefault();
                register();
            });
            // 验证码生成
            var regcodes = 0;
            function nums() {
                function number(min, max) {
                    regcodes = Math.floor(Math.random() * (max - min)) + min;
                }
                number(10000, 99999);
                $('.registered li p span').html(regcodes);
            }
            nums();
            //刷新二维码
            $('.registered li p em').on('click', function () {
                nums();
            });

            // 登录操作
            $(".submit").click(function () {
                var userName = $(".userName").val();
                var password = $(".password").val();
                var regCode = $(".regcode").val();
                if(regcodes == regCode){
                    shopAjax("post","user/login",{loginName:userName,password:password},function (res) {
                        if(res.code == 0){
                            $(".closeL").trigger("click");
                            localStorage.userName = userName;//保存用户名
                            sessionStorage.userName = userName;
                            $(".userLogin").html("【"+userName+"】");
                            sessionStorage.userId = res.data.userId;//保存userid在本次浏览
                            location.reload();
                        }
                    },function (res) {
                        console.log(res);
                        alert(res.data)
                    })
                }else {
                    alert("Verification code error");
                    nums();
                }
            });

        });
    }

    //注册
    function register() {
        $(".login").fadeIn(200).load("registered.html",function () {
            //如果验证码倒计时还在倒计时，清楚倒计时
            //关闭注册框
            $(".closeL").click(function () {
                $(".login").fadeOut(200);
            });
            //enter 键盘enter建触发登录/注册
            $(document).keydown(function (event) {
                if(event.keyCode == 13){
                    event.preventDefault();
                    $(".submit").trigger("click")
                }
            });
            //发送验证码
            $(".byCode").bind("click",getCode);
            var serverCode;//系统验证码
            var time;//验证码倒计时
            function getCode() {
                var phone = $(".phone").val();
                if(isPhone(phone)){
                    shopAjax("post","sms/code","phone="+phone,function (res) {
                        if(res.code == 0){
                            serverCode = res.data.code;
                            $(".byCode").css("color","rgba(0,0,0,0.26)");
                            $(".byCode").unbind("click");
                            var number = 60;
                            time = setInterval(function () {
                                number--;
                                $(".byCode").html("已发送 "+number + "s");
                                if(number == 0){
                                    clearInterval(time);
                                    number =60;
                                    $(".byCode").html("发送验证码");
                                    $(".byCode").css("color","#ae846c");
                                    $(".byCode").bind("click",getCode);
                                }
                            },1000)
                        }
                    },function (res) {
                        $(".loading").fadeOut(100);
                        alert(res.data);//失败弹窗
                    })
                }else{
                    alert("请正确填写您的手机号码")
                }
            }


            // 注册操作
            $(".submit").click(function () {

                var firstName = $(".firstName").val();
                var lastName = $(".lastName").val();
                var password = $(".password").val();//密码
                var passwords = $(".passwords").val();//密码
                var userEamil = $(".userEamil").val();//邮箱
                if(!isEmail(userEamil)){
                 alert("E-mail format is incorrect!");
                    return;
                }
                if(password !== passwords){
                    alert("Password is not consistent, please be careful operation!");
                    return;
                }
                shopAjax("post","user/register",{firstName:firstName,lastName:lastName,password:password,code:serverCode,email:userEamil},function (res) {
                    if(res.code == 0){
                        $(".closeL").trigger("click");
                        login();//登录
                        localStorage.userName = userEamil;//保存用户名
                    }
                },function (res) {
                    console.log(res);
                    alert(res.data)
                })


            });
        });
    }


});
    //AJAX公用函数
var shopAjax = function (type, url, data, callback,error) {

    var loading = '<div class="loading"><img src="../images/oval.svg" alt="纸匠" width="50" style="position:absolute;top: calc(50vh - 25px); left:calc(50vw - 25px);width: 50px;"> </div>'
    // $("footer").append(loading);
    if($.isFunction(data)){
        callback = data;
    }else if(data == undefined || data == null){
        data = '';
    }
    var path = "https://papermaker.cn:8443/mall/";
    // var path = "http://papermaker.cn:8080/mall/";
    var protocol = location.protocol;
   if(protocol == 'http:'){
        // path = "http://papermaker.cn:8080/mall/";
   }
   console.log(path+url);
    $.ajax({
        type: type,
        url: path + url,
        data: data,
        success: function (res) {
            $(".loading").fadeOut(100);
            if(res.code == 0){
                callback(res);

            }else{
                console.log("code : ",res);
                if($.isFunction(error)){
                    error(res);
                }
            }
        },
        error:function (res) {
            console.log("error : ",res);
        }
    });
};


//如未登录进入需登录页面前 需先登录
function loginBefore() {
    $(".showLogin").trigger("click");
    return;
}


//收藏网站
function addFavorite(obj, opts){
    var _t, _u;
    var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd': 'CTRL';
    if(typeof opts != 'object'){
        _t = document.title;
        _u = location.href;
    }else{
        _t = opts.title || document.title;
        _u = opts.url || location.href;
    }
    try{
        window.external.addFavorite(_u, _t);
    }catch(e){
        if(window.sidebar){
            obj.href = _u;
            obj.title = _t;
            obj.rel = 'sidebar';
        }else{
            alert('Sorry, the browser you are using cannot complete this operation. Please use the \n\n '+ ctrl + '+ D to this page to your favorites!');
        }
    }
}

//邮箱正则验证
function isEmail(str){
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return reg.test(str);
}
//手机正则验证
// function isPhone(str){
//     var reg = /^1[34578]\d{9}$/;
//     return reg.test(str);
// }
// 时间格式化 yyyy-mm-dd
var FormatDate = function(strTime) {
    var date = new Date(strTime);
    var Month = date.getMonth()+1 < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1);
    var day = date.getDate() < 10 ? "0"+date.getDate() : date.getDate();
    var hours = date.getHours() < 10 ? "0"+date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds();
    return date.getFullYear()+"-"+Month+"-"+day + "  " + hours + ":" + minute + ":" + second;
};

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}


























































