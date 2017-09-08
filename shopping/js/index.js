/**
 * Created by Administrator on 2017/6/24.
 */
$(function () {


    // banner轮播
    bannerFn();
    function bannerFn() {
        function bannerAction() {
            if(index < $('.bannerUrl li').length - 1){
                index++;
            }else {
                index = 0;
            }
            changTo(index)

        }
        var index = 0;
        var banner = setInterval(bannerAction,5000);

        function changTo(num) {
            $('.bannerUrl li').fadeOut(1000).eq(num).fadeIn();
            $(".numList li").removeClass("numActive").eq(num).addClass("numActive");
        }

        $(".numList li").each(function (item) {
            $(this).hover(function () {
                clearInterval(banner);
                changTo(item);
                index = item;
            },function () {
                banner = setInterval(bannerAction,5000);
            })
        })
    }

    // 产品轮播
    productFn($(".salesProductsContainerChild"));
    function productFn(el) {

        var proLength = el.children().length;
        var width = el.children().width() + 20;
        var proWidth = (proLength * 2)  * width;
        el.children().clone().appendTo(el);
        el.css("width",proWidth+"px");
        var item = 0;
        //无缝轮播
        function translate() {
            item++;
            el.animate({
                left:item * (-width) + "px"
            },500,function () {
                if(item == proLength){
                    item = 0;
                    el.css("left",0)
                }
            });

        }
        var proInterval = setInterval(translate,3000);

        // li元素
        el.children().hover(function () {
            clearInterval(proInterval);
        },function () {
            proInterval = setInterval(translate,3000);
        });
        // 鼠标进入上一个
        $(".pre").hover(function () {
            clearInterval(proInterval);
        },function () {
            proInterval = setInterval(translate,3000);
        });
        // 鼠标进入下一个
        $(".next").hover(function () {
            clearInterval(proInterval);
        },function () {
            proInterval = setInterval(translate,3000);
        });
        // 上一个
        $(".pre").click(function () {
            item--;
            if(item == -1){
                item = proLength - 1;
                el.css("left",-proLength * width);
            }
            el.stop().animate({left:-item * width + "px"},500);
        });
        // 下一个
        var tirgger = true;
        $(".next").click(function () {

            if(tirgger){
                item++;
                tirgger = !tirgger;
                el.stop().animate({left:-item * width + "px"},500,function () {
                    if(item == proLength ){
                        item = 0;
                        el.css("left",0);
                    }
                    setTimeout(function () {
                        tirgger = !tirgger;
                    },400)
                });
            }

           /* if(item == proLength ){
                item = 0;
                el.css("left",0);
            }*/

        })

    }

    //限时抢购倒计时
    activityTime();
    function activityTime() {
        var hour = parseInt($(".hours").html());
        var minute = parseInt($(".minute").html());
        var second = parseInt($(".second").html());
        function countDown() {
            second--;
            if(parseInt(second) < 0){
                second = 59;
                $(".second").html(second);
                minute--;
                if(parseInt(minute) < 0){
                    minute = 59;
                    $(".minute").html(minute);
                    hour--;
                    if(parseInt(hour) < 0){
                        clearInterval(countDownTime);
                    }else {
                        hour = hour < 10 ? "0" + hour : hour;
                        $(".hours").html(hour);
                    }
                }else {
                    minute = minute < 10 ? "0" + minute : minute;
                    $(".minute").html(minute);
                }
            }else {
                second = second < 10 ? "0" + second : second;
                $(".second").html(second);
            }


            if(second == 0 && minute ==0 && hour == 0){
                clearInterval(countDownTime)
            }
        }
        var countDownTime = setInterval(countDown,1000)
    }
    //获取分类商品列表
    var goodsType = [
        {
            type:"life",
            name:"生活家居系列",
            enName:"LIFE HOME SERISE",
            img:"images/productClass1_03.png"
        },
        {
            type:"storage",
            name:"收纳系列",
            enName:"LIFE HOME SERISE",
            img:"images/productClass1_03.png"
        },
        {
            type:"office",
            name:"办公系列",
            enName:"LIFE HOME SERISE",
            img:"images/productClass1_03.png"
        },
        {
            type:"toy",
            name:"益智玩具系列",
            enName:"LIFE HOME SERISE",
            img:"images/productClass1_03.png"
        }
    ];
    var wrap  = "";
    var orderBy = 0;
    for(var j=0;j<goodsType.length;j++){

        shopAjax("get","goods/all",{sort:"sell",order:"asc",series:goodsType[j].type},function (res) {
            console.log(res);
            if(res.code == 0){

                var list = res.data.goodsList;
                var length = list.length > 6 ? 6 : list.length;

                var content = "";
                for(var i=0;i<length;i++){
                    var nums = list[i].chinaNewPrice.split('|');
                    var olds = list[i].chinaFakePrice.split('|');
                    console.log(nums);
                    content += '<li> ' +
                        '<a href="goodsDetail.html?goodsId='+list[i].id+'" class="salesProductItem"> ' +
                        '<dl> ' +
                        '<dt><img src="'+list[i].showImage+'" alt=""></dt> ' +
                        '<dd> ' +
                        '<span>'+list[i].name+'</span> ' +
                        '<p> ' +
                        '<span>￥<em>' +nums[0]+
                        '</em></span> ' +
                        '<s>￥'+olds[0]+'</s> ' +
                        '</p> ' +
                        '</dd> ' +
                        '</dl> ' +
                        '</a> ' +
                        '</li>'
                }
                orderBy++;
                orderBy = orderBy < 10 ? "0" + orderBy : orderBy;
                wrap += '<div class="productClass wrap"> ' +
                    '<div class="productBg"></div> ' +
                    '<div class="productDetail"> ' +
                    '<a href="goods.html?series='+goodsType[orderBy-1].type+'" class="locationGoods"> ' +
                    '<div class="productLeft left"> ' +
                    '<div class="productOrder">'+orderBy+'</div> ' +
                    '<div class="productTitle"> ' +
                    '<h1 class="productTitleCh">'+goodsType[orderBy-1].name+'</h1> ' +
                    '<h3 class="productTitleEn">'+goodsType[orderBy-1].enName+'</h3> ' +
                    '</div> ' +
                    '<p class="more"><span>MORE</span><i></i></p> ' +
                    '</div> ' +
                    '</a> ' +
                    '<div class="productRight right"> ' +
                    '<ul class="productRightDetail"> ' +content +
                    '</ul> ' +
                    '</div> ' +
                    '</div> ' +
                    '<div class="productBgimg"><img src="'+goodsType[orderBy-1].img+'" alt="纸匠商城"></div> ' +
                    '</div>';
                $(".products").html(wrap)
            }
        },function (res) {
            console.log("error",res)
        })
    }



});























