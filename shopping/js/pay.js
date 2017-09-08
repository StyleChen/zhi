/**
 * Created by Administrator on 2017/7/13.
 */
$(function () {
    var userId = sessionStorage.userId;
    //如果没登陆，重定向回到首页
    if(userId == undefined){
        location.href = "index.html";
    }
    $(".btn").click(function () {
        var dealId = getUrlParam("dealId");
        shopAjax("post","alipay/buildRequest",{dealId:dealId,lang:"cn"},function (res) {

        },function (res) {
            console.log(res);
            $("body").html(res);
        })
    });
});












