/**
 * Created by Administrator on 2017/6/28.
 */
$(function () {
    //排序筛选
    $('.wraps > h2 em').on('click',function  () {
        $(this).css({'color' : '#ae846c','backGround': ' url("images/up.png") no-repeat 50px 1px;'}).siblings('em').css({'color':'#000'});
    });

    var series = getUrlParam("series");
    var key = getUrlParam("key");
    var goodsData = {series:series};
        //默认排序
        defaultSort(goodsData);

    var pageBefor=1;
    //导航
    var nav = '';
    if(series == "life"){
        nav= " / 生活家居系列"
    }else if(series == "storage"){
        nav= " / 收纳系列"
    }else if(series == "office"){
        nav= " / 办公系列"
    }else if(series == "toy"){
        nav= " / 益智玩具系列"
    }
    $(".navT").html('<a href="goods.html?series='+series+'">'+nav+'</a>');
  //商品请求函数
    function defaultSort(goodsData) {
        shopAjax("get","goods/all",goodsData,function (res) {
            console.log(res);
            if(res.code == 0){
                var html = "";
                var arr = res.data.goodsList;
                for(var i=0;i<arr.length;i++){
                    var sums = arr[i].chinaNewPrice.split('|');
                    var olds = arr[i].chinaFakePrice.split('|');
                    html += '<li><input type="hidden" class="goodsId" value="'+arr[i].id+'"> <img src="'+arr[i].showImage+'" alt=""> <h2>'+arr[i].name+'</h2> <div class="goodsMoney"> <strong>￥'+sums[0]+'</strong> <em>￥'+olds[0]+'</em> <span>销量'+arr[i].sellCount+'件</span> </div> </li>'
                }
                $(".goodsLists").html(html);
                $(".goodsLists li").click(function () {
                    var goodsId = $(this).find(".goodsId").val();
                    location.href = "goodsDetail.html?goodsId="+goodsId+"&series="+series;
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
            }
        },function () {

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


    //默认排序
    $(".defaultSort").click(function () {
        defaultSort(goodsData)
    });
    //新品排序
    $(".newSort").click(function () {
        var data = {sort:"new",series:series,order:"asc"};
        defaultSort(data)
    });
    //热销排序
    $(".hotSort").click(function () {
        var data = {sort:"sell",series:series,order:"asc"};
        defaultSort(data);
/*        shopAjax("get","goods/all",{sort:"sell",series:series,order:"asc"},function (res) {
            console.log(res);
            if(res.code == 0){
                var html = "";
                var arr = res.data.goodsList;
                for(var i=0;i<arr.length;i++){
                    var sums = arr[i].chinaNewPrice.split('|');
                    var olds = arr[i].chinaFakePrice.split('|');
                    html += '<li><input type="hidden" class="goodsId" value="'+arr[i].id+'"> <img src="'+arr[i].showImage+'" alt=""> <h2>'+arr[i].name+'</h2> <div class="goodsMoney"> <strong>￥'+sums[0]+'</strong> <em>￥'+olds[0]+'</em> <span>销量'+arr[i].sellCount+'件</span> </div> </li>'
                }
                $(".goodsLists").html(html);
                $(".goodsLists li").click(function () {
                    var goodsId = $(this).find(".goodsId").val();
                    location.href = "goodsDetail.html?goodsId="+goodsId+"&series="+series;
                })
            }
        },function () {

        })*/
    });
    //价格排序
    var sortString = true;
    $(".totalSort").click(function () {
        if(sortString){
            //升序
            var data = {sort:"price",series:series,order:"asc"};
            defaultSort(data);
            sortString = !sortString;
        }else {
            //降序
            var data2 = {sort:"price",series:series,order:"desc"};
            defaultSort(data2);
            sortString = !sortString;
        }
    })


});
