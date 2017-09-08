/**
 * Created by Administrator on 2017/7/1.
 */
$(function () {
    var goodsId = getUrlParam("goodsId");
    var size = getUrlParam("size");
    var number = getUrlParam("number");
    var color = getUrlParam("color");
    var showImage = getUrlParam("showImage");
    var goodsName = getUrlParam("goodsName");
    color = decodeURI(color);//decodeURI解码
    goodsId = decodeURI(goodsId);
    size = decodeURI(size);
    number = decodeURI(number);
    showImage = decodeURI(showImage);
    goodsName = decodeURI(goodsName);
    var userId = sessionStorage.userId;
    //如果没登陆，重定向回到首页
    if(userId == undefined){
        location.href = "index.html";
    }
    if(showImage != ''){
        $(".productsCartImg").attr("src",showImage);
    }
    if(goodsName != ''){
        $(".productsCartDesc").html("<a href='goodsDetail.html?goodsId="+goodsId+"'>"+goodsName+"</a>");
    }

    $(".productsCartColr").html("颜色分类："+color+"  数量："+number);

    //查看商品详情
    $(".seeCart").click(function () {
        location.href = "goodsDetail.html?goodsId="+goodsId;
    });
    //去购物车结算
    $(".goSettlement").click(function () {

        location.href = "cart.html"
    })

});





















