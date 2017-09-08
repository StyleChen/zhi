/**
 * Created by Administrator on 2017/7/5.
 */
$(function () {
    var userId = sessionStorage.userId;
    //如果没登陆，重定向回到首页
    if(userId == undefined){
        location.href = "index.html";
    }
    var sun = true;
    $('.more').on('click',function () {
        if(sun) {
            $('.more').css({'background':'url("images/shou.png") no-repeat 1136px 10px'});
            $('.track-rcol').show();
            $(".wraps p:nth-child(4)").css("margin-bottom","0");
            sun = false
        } else {
            $('.track-rcol').hide();
            $('.more').css({'background':'url("images/more.png") no-repeat 1136px 10px'});
            $(".wraps p:nth-child(4)").css("margin-bottom","20px");
            sun = true;
        }
    });
    var dealId = getUrlParam("dealId");

    shopAjax("post","deal/info",{dealId:dealId,userId:userId},function (res) {
        console.log(res);
    },function (res) {
        console.log(res);
        var date = new Date(res.orderTime);
        var Month = date.getMonth()+1 < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1);
        var day = date.getDate() < 10 ? "0"+date.getDate() : date.getDate();
        var hour = date.getHours() < 10 ? "0"+date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds();
        var goodsList = res.goodsList;
        var dealStatus = "去付款";
        if(res.dealStatus == "待发货"){
            dealStatus = "取消";
        }else if(res.dealStatus == "待收货"){
            dealStatus = "确认收货";
        }else if(res.dealStatus == "已收货"){
            dealStatus = "查看";
        }else {

        }
        $(".btn").html(dealStatus);
        $(".orderNumber").html(res.dealNumber);//订单号
        $(".orderTime").html(date.getFullYear()+"-"+Month+"-"+day+"  "+hour+":"+minutes+":"+seconds);//下单时间
        $(".addressDetail").html(res.address);//收货地址
        $(".num").html(goodsList.length + "件");//商品件数
        $(".total").html("￥" + res.chinaTotalPrice);//商品总金额
        $(".sureMoney").html("￥"+res.chinaTotalPrice);//应付总金额
        var content = "";
        for(var i=0;i<goodsList.length;i++){
            content += '<li> ' +
                '<dl> ' +
                '<dt><img src="'+goodsList[i].showImage+'" alt=""></dt> ' +
                '<dd> ' +
                '<h2><a href="goodsDetail.html?goods='+goodsList[i].goodsId+'">'+goodsList[i].goodsName+'</a></h2> ' +
                '<strong>颜色分类：</strong><em>'+goodsList[i].color+'</em> ' +
                '<strong>规格：</strong><em>'+goodsList[i].size+'</em> ' +
                '</dd> ' +
                '</dl> ' +
                '<span>￥'+goodsList[i].chinaNewPrice+'</span> ' +
                '<span>'+goodsList[i].count+'</span> ' +
                '<span>'+parseFloat(goodsList[i].chinaNewPrice)*+parseFloat(goodsList[i].count)+'</span> ' +
                '</li>'
        }
        $(".orderList").html(content);
    })
});












