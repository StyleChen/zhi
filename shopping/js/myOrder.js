/**
 * Created by Administrator on 2017/7/4.
 */
$(function () {
    var userId = sessionStorage.userId;
    //如果没登陆，重定向回到首页
    if(userId == undefined){
        location.href = "index.html";
    }

    var goodsDatas = {userId:userId};
    //商品请求函数
    var pageBefor=1;
    defaultSort(goodsDatas);
    function defaultSort(goodsData) {
        shopAjax("post","deal/load",goodsData,function (res) {
            console.log(res);
            var orderContent = "";
            var data = res.data.list;
            for(var i=0;i<data.length;i++){
                var dealStatus = "去付款";
                var goodsDetail = "";
                var goods = data[i].goodsList;
                for(var v=0;v<goods.length;v++){
                    goodsDetail +=
                        '<li> ' +
                        '<dl> ' +
                        '<dt><img src="'+goods[v].showImage+'" alt=""></dt> ' +
                        '<dd> ' +
                        '<h2><a href="goodsDetail.html?goodsId='+goods[v].goodsId+'">'+goods[v].goodsName+'</a></h2> ' +
                        '<p> ' +
                        '<strong>颜色分类:</strong><em>'+goods[v].color+'</em> ' +
                        '<strong>规格:</strong><em>'+goods[v].size+'</em> ' +
                        '</p> ' +
                        '</dd> ' +
                        '</dl> ' +
                        '<span>￥'+goods[v].chinaNewPrice+'</span> ' +
                        '<span>'+goods[v].count+'</span> ' +
                        '</li>'
                }
                if(data[i].dealStatus == "待发货"){
                    dealStatus = "取消";
                }else if(data[i].dealStatus == "待收货"){
                    dealStatus = "确认收货";
                }else if(data[i].dealStatus == "已收货"){
                    dealStatus = "查看";
                }
                var dealTime = FormatDate(data[i].dealTime);//下单时间
                orderContent += '<li class="clearfix"> ' +
                    '<h2><sup>下单时间：'+dealTime+'</sup><sup style="margin-left: 10px;">订单编号：'+data[i].dealNumber+'</sup></h2> <input class="hidden" type="hidden" value="'+data[i].dealId+'">' +
                    '<ul class="orderGoodsList"> ' + goodsDetail +
                    '</ul> ' +
                    '<span class="payAction"><a href="#">退款</a>/<a href="#">退货</a><br> <a href="orderDetail.html?dealId='+data[i].dealId+'">订单详情</a></span> ' +
                    '<span>'+data[i].dealStatus+'</span> ' +
                    '<em class="userAction">'+dealStatus+'</em></li>'
            }
            $(".orderLists").html(orderContent);
            $(".userAction").click(function () {
                var html = $(this).html();
                var dealId = $(this).parents(".clearfix").find(".hidden").val();
                if(html == "查看"){
                    location.href = "orderDetail.html?dealId="+dealId;
                }else if(html == "去付款"){
                    location.href = "pay.html?dealId="+dealId;
                }
            });

            //总共页数
            var totalPage = res.data.totalPage;
            $(".allOrder").html(totalPage);
            //当前第几页
            $(".nowPage").html(res.data.pageNo);
            //页码
            var pageNumber = "";

            for(var p=pageBefor;p<=totalPage;p++){
                if(p == res.data.pageNo){
                    pageNumber += "<li class='pageActive'>"+p+"</li>";
                }else if(p == (parseInt(pageBefor) + 5)){
                    pageNumber += "<li>...</li>";
                    break;
                }else {
                    pageNumber += "<li>"+p+"</li>";
                }
            }
            $(".orderByList").html(pageNumber);
            //选择页码
            $(".orderByList li").click(function () {
                var pageNums = $(this).html();
                if(pageNums == "..."){
                    return;
                }
                goodsData.pageNo = pageNums;
                defaultSort(goodsData);
            });
        },function (res) {
            console.log(res)
        })
    }
    //下一页
    $(".nextPage").click(function (event) {
        event.stopPropagation();
        event.preventDefault();
        var now = $(".pageActive").html();//现在的页数
        if(now == parseInt($(".allOrder").html())){
            return;
        }else if(now == parseInt($(".allOrder").html()) - 1){
            pageBefor = parseInt($(".allOrder").html()) - 4;
        }
        now = parseInt(now) + 1;
        var one = $(".orderByList li:eq(0)").html();//页码第一位
        if(pageBefor < parseInt($(".allOrder").html()) - 5){
            pageBefor = parseInt(one) + 1;
        }
        goodsData.pageNo = now;
        defaultSort(goodsData);
    });
    //上一页
    $(".prePage").click(function (event) {
        event.stopPropagation();
        event.preventDefault();
        var now = $(".pageActive").html();//现在的页数
        if(now == 1){
            return;
        }
        now = parseInt(now) - 1;
        var one = $(".orderByList li:eq(0)").html();//页码第一位
        if(pageBefor > 1){
            pageBefor = parseInt(one) - 1;
        }
        goodsData.pageNo = now;
        defaultSort(goodsData);
    });

});



























