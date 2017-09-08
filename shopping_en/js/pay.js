/**
 * Created by Administrator on 2017/7/13.
 */
$(function () {
    $(".btn").click(function () {
        var dealId = getUrlParam("dealId");
        shopAjax("post","alipay/buildRequest",{dealId:dealId,lang:"en"},function (res) {

        },function (res) {
            console.log(res);
            $("body").html(res);
        })
    });
});












