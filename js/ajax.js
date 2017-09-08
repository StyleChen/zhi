/**
 * Created by Administrator on 2017/5/20.
 */

$("footer").load("footer.html");//加载公共页尾
var ajax = function (type, url, data, callback,error) {


    var loading = '<div class="loading"> <img src="images/oval.svg" alt="纸匠" width="50" style="position:absolute;top: calc(50vh - 25px); left:calc(50vw - 25px);"> </div>'
    $("footer").append(loading);
    if($.isFunction(data)){
        callback = data;
    }else if(data == undefined){
        data = '';
    }
    var path = "http://papermaker.cn:8080/papermaker/";
    var protocol = location.protocol;
    if(protocol == 'https:'){
        path = "https://papermaker.cn:8443/papermaker/"
    }
    $.ajax({
        type:type,
        url: path+url,
        data:data,
        success: function (res) {
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

// 图片上覆盖动画
var slideRight = function(el,cla) {
    if(cla == undefined){
        cla = "translate"
    }
    for(var i=0;i<el.length;i++){
        if( jQuery(window).height()>(el[i].getBoundingClientRect().top+(el.eq(i).outerHeight() / 2)) ){
            if(!el.eq(i).hasClass(cla)){
                el.eq(i).addClass(cla);
            }
        }
    }
};

//		图片覆盖层滑动动画
$(function () {
    //		图片覆盖层滑动动画
    slideRight($('.translatePos'));
    $(window).scroll(function () {
        slideRight($('.translatePos'));
    })
});

    // 时间格式化 yyyy-mm-dd
var FormatDate = function(strTime) {
    var date = new Date(strTime);
    Month = date.getMonth()+1 < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1);
    day = date.getDate() < 10 ? "0"+date.getDate() : date.getDate();
    return date.getFullYear()+"-"+Month+"-"+day;
};

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

//                图片预览
var images = function () {
    //                图片预览
    var groups = {};
    $('.galleryItem').each(function() {
        var id = parseInt($(this).attr('data-group'), 10);

        if(!groups[id]) {
            groups[id] = [];
        }

        groups[id].push( this );
    });

    $.each(groups, function() {

        $(this).magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            closeBtnInside: false,
            gallery: { enabled:true }
        })

    });
};
$(function () {
    $(".nav-p").hover(function () {
        $(".nav-ul").stop().slideDown();
    },function () {
        $(".nav-ul").stop().slideUp();
    });
});
