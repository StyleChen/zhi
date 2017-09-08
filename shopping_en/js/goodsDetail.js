/**
 * Created by Administrator on 2017/6/29.
 */
$(document).ready(function(){
    var $miaobian=$('.Xcontent08>div');




    $(".Xcontent33").click(function(){
        var value=parseInt($('.input').val())+1;
        $('.input').val(value);
    });

    $(".Xcontent32").click(function(){
        var num = $(".input").val();
        if(num>1){
            $(".input").val(num-1);
        }

    });



    var goodsId = getUrlParam("goodsId");
    var series = getUrlParam("series");
    var userId = sessionStorage.userId;
    var showImage = '';
    //导航
    var nav = 'New Product';
    if(series == "life"){
        nav= "Home Decor"
    }else if(series == "storage"){
        nav= "Storage Series"
    }else if(series == "office"){
        nav= "Office Series"
    }else if(series == "toy"){
        nav= "Jigsaw Puzzle Toys Series"
    }

    $(".navT").html('<a href="goods.html?series='+series+'">  / '+nav+'</a>');
   shopAjax("get","goods/info",{goodsId:goodsId},function (res) {
       console.log(res);
       if(res.code == 0){
           var data = res.data;
           var Size = data.productSize.split('|');
           showImage = data.showImage;
           //颜色
           var color = res.data.color.split("|");
           var colorImage = res.data.colorImage.split("|");
           for(var c=0;c<colorImage.length;c++){
               if(color[c] != ""){
                   var colorValue = '<div class="Xcontent28"><img src="'+colorImage[c]+'" alt="'+color[c]+'" title="'+color[c]+'"></div>';
                   $(".Xcontent26").append(colorValue);
               }
           }
           //商品详情
           var goodsDetailImg = data.goodsDetail.replace(/src="/g,'src="http://papermaker.cn:8080');//富文本图片地址加前缀
           $(".imgBox").html(goodsDetailImg);


           if(data.name != '') $(".goodsName").html(data.name);
           if(data.intro != '') $(".goodsDesc").html(data.intro);
           var price = data.usNewPrice.split('|');
           var olds = data.usFakePrice.split('|');
           console.log(price);
           if(data.chinaNewPrice != '') $(".goodsTotal").html(price[0]);
           if(data.chinaFakePrice != '') $(".old").html(olds[0]);

           if(data.showImage != '') $('.Xcontent06').append('<img src="'+data.showImage+'" alt="纸匠商城">');
           if(data.fullImage != '') $('.Xcontent07').append('<img src="'+data.fullImage+'" alt="纸匠商城">');
           if(data.backImage != '') $('.Xcontent09').append('<img src="'+data.backImage+'" alt="纸匠商城">');
           if(data.frontImage != '') $('.Xcontent10').append('<img src="'+data.frontImage+'" alt="纸匠商城">');
           if(data.back45Image != '') $('.Xcontent11').append('<img src="'+data.back45Image+'" alt="纸匠商城">');
           if(data.front45Image != '') $('.Xcontent12').append('<img src="'+data.front45Image+'" alt="纸匠商城">');
           //商品详情 图片切换
           var $huantu=$('.Xcontent06>img');
           $miaobian.mousemove(function(){miaobian($(this));});
           $('.Xcontent26>div').click(function(){miaobian1($(this));});
           function miaobian(thisMb){
               for(var i=0; i<$miaobian.length; i++){
                   $miaobian.eq(i).removeClass("borderColor-active");
                   $miaobian.eq(i).addClass("borderColor");
               }
               thisMb.addClass("borderColor-active");
               var imgSrc = thisMb.find("img").attr("src");
               $huantu.eq(0).attr("src",imgSrc);
           }
           function miaobian1(thisMb1){
               for(var i=0; i<$('.Xcontent26>div').length; i++){
                   $('.Xcontent26>div').eq(i).addClass("borderColor");
                   $('.Xcontent26>div').eq(i).removeClass("borderColor-active");
               }
               $(".Xcontent26").removeClass("alert");
               $miaobian.removeClass("borderColor-active");
               thisMb1.addClass("borderColor-active");
               var imgSrc = thisMb1.find("img").attr("src");
               $huantu.eq(0).attr("src",imgSrc)
           }
           $('.brand').html(data.brand);
           $('.style').html(data.style);
           $('.materia').html(data.materia);
           $('.goodsNumber').html(data.goodsNumber);
           $('.color').html(data.color);
           $('.productplace').html(data.productplace);
           $('.productSize').html(data.productSize);
           $('.weight').html(data.weight);
           $('.warning').html(data.warning);
           $('.ageRange').html(data.ageRange);
           //尺寸
           for(var i=0; i<Size.length;i++){
               var $div = $("<div>"+Size[i]+"</div>");
               $(".size").append($div);
           }
           $('.size div').on('click',function () {
               var sizeNum = $(this).index();
               $(".Xcontent53").removeClass("alert");
               $(".goodsTotal").html(price[sizeNum]);
               $(".old").html(olds[sizeNum]);
               $(this).addClass("borderColor-active").siblings().removeClass("borderColor-active");
           });


       }
   },function (res) {
       console.log("error",res)

   });

   //立即购买
    $(".buy").click(function (event) {
        event.preventDefault();
        //请先登录
        userId = sessionStorage.userId;
        if(userId == undefined){
            loginBefore();
            return;
        }

        var colorV = $(".Xcontent26 .borderColor-active img").attr("alt");//颜色
        var size = $(".Xcontent53 .borderColor-active").html();//尺寸
        var num = $(".input").val();//数量
        var goodsName = $(".goodsName").html();//产品名称
        var goodsTotal = $(".goodsTotal").html();//产品价钱
        if(colorV == undefined){
            $(".Xcontent26").addClass("alert");
            return;
        }
        if(size == undefined){
            $(".Xcontent53").addClass("alert");
            return;
        }
        var cartArray = new Object;
        cartArray.cartObject = {
            productName:goodsName,//产品名称
            productSize:size,//尺寸
            productColor:colorV,//颜色
            productPrice:goodsTotal,//单价
            productSubtotalMoney:(goodsTotal*num).toFixed(2),//金额小计
            productGoods:goodsId,//商品ID
            productCartImg :showImage,//图片地址
            productNumber:num//数量
        };

        sessionStorage.productCart = JSON.stringify(cartArray); //将storage转变为字符串存储
        location.href = "order.html?fromCart=false";
    });
    //加入购物车
    $(".addCart").click(function (event) {
        event.preventDefault();
        //请先登录
        userId = sessionStorage.userId;
        if(userId == undefined){
            loginBefore();
            return;
        }
        var colorV = $(".Xcontent26 .borderColor-active img").attr("alt");//颜色
        var size = $(".Xcontent53 .borderColor-active").html();//尺寸
        var num = parseInt($(".input").val());//数量
        var goodsName = $(".goodsName").html();//产品名称
        var goodsTotal = $(".goodsTotal").html();//产品价钱
        if(colorV == undefined){
            $(".Xcontent26").addClass("alert");
            return;
        }
        if(size == undefined){
            $(".Xcontent53").addClass("alert");
            return;
        }
        var cartData = {
            goodsId:goodsId,
            color:colorV,
            size:size,
            number:num,
            userId:userId
        };
        console.log(cartData);
        shopAjax("post","cart/add",cartData,function (res) {
            console.log(res);
            if(res.code == 0){
                var url = "addCart.html?goodsId="+goodsId+"&color="+colorV+"&size="+size+"&number="+num+"&showImage="+showImage+"&goodsName="+goodsName+"&goodsTotal="+goodsTotal;
                url = encodeURI(url);//url含有中文，需进行两次encodeURI转码
                url = encodeURI(url);
                location.href = url;
            }
        },function (res) {
            console.log("error",res)
        });
    });


});















