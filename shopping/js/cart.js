/**
 * Created by Administrator on 2017/6/26.
 */
$(function () {
    var userId = sessionStorage.userId;
    //如果没登陆，重定向回到首页
    if(userId == undefined){
        location.href = "index.html";
    }
    console.log(userId);
    shopAjax("post","cart/load",{userId:userId},function (res) {
        console.log(res);
        if(res.code == 0){
            var data = res.data;
            var content = "";
            for(var arr=0;arr<data.length;arr++){
                content += '<div class="cartItem"><input type="hidden" class="hidden" value="'+data[arr].goodsId+'"> ' +
                    '<input type="checkbox" name="checkedAll" id="checkedItem'+arr+'"><label for="checkedItem'+arr+'"><i class="check"></i></label> ' +
                    '<img src="'+data[arr].showImage+'" alt="纸匠" class="cartImg left"> ' +
                    '<div class="left productName"> ' +
                    '<h6 class="productDesc"><a href="goodsDetail.html?goodsId='+data[arr].goodsId+'">'+data[arr].goodsName+'</a></h6> ' +
                    '<p class="productSize">规格：<span>'+data[arr].size+'</span></p> ' +
                    '<p class="productColor">颜色分类：<span>'+data[arr].color+'</span></p> ' +
                    '</div> ' +
                    '<div class="left productPrice">￥<span class="price">'+parseFloat(data[arr].chinaNewPrice)+'</span></div> ' +
                    '<div class="left productNumber"> ' +
                    '<span class="minus">-</span> ' +
                    '<input type="number" name="productNumber" value="'+data[arr].count+'"> ' +
                    '<span class="plus">+</span> ' +
                    '</div> ' +
                    '<div class="left productSubtotal">￥<span class="productSubtotalMoney">'+(parseFloat(data[arr].chinaNewPrice) * data[arr].count).toFixed(2)+'</span></div> ' +
                    '<div class="left productOperation">删除</div> ' +
                    '</div>';
            }
            $(".cartDetails").html(content);
            //购物车 加
            $(".plus").click(function () {
                singleTotal($(this),true);
                total();
            });
            //购物车 减
            $(".minus").click(function () {
                var nums = $(this).siblings('input').val();
                if(nums < 2 ){
                    return;
                }
                singleTotal($(this),false);
                total();
            });

            //单个商品选中
            $("input[name='checkedAll'] + label").click(function () {
                setTimeout(total,100)
            });
            //单个商品删除
            $(".productOperation").click(function () {
                var goodsId = $(this).parents(".cartItem").find(".hidden").val();
                var productSize = $(this).parents(".cartItem").find(".productSize span").html();
                var productColor = $(this).parents(".cartItem").find(".productColor span").html();
                console.log(goodsId);
                shopAjax("post","cart/del",{userId:userId,goodsIds:goodsId,colors:productColor,sizes:productSize},function (res) {
                    console.log(res);
                    if(res.code == 0){
                       location.reload();
                    }
                },function (res) {

                })
            })
        }
    },function (res) {
        console.log(res);
        if (res.code == 1){
            $(".cartDetails").html("<p style='margin-top: 30px;margin-left: 30px;'>购物车空空如也，赶快去挑选喜爱的商品吧</p>");
            console.log(1553)
        }
    });


    //删除选中
    $(".deleteAll").click(function () {
        var checkedNumber = $("input[name='checkedAll']:checked");
        var goodsIds = '';
        var colors='';
        var sizes='';
        for(var i=0;i<checkedNumber.length;i++){
            var par = $("input[name='checkedAll']:checked").eq(i);
            var ele = "|" + par.parents(".cartItem").find(".hidden").val();
            var productSize = "|" + par.parents(".cartItem").find(".productSize span").html();
            var productColor = "|" + par.parents(".cartItem").find(".productColor span").html();
            goodsIds += ele;
            colors +=productColor;
            sizes+=productSize;
        }
        shopAjax("post","cart/del",{userId:userId,goodsIds:goodsIds,colors:colors,sizes:sizes},function (res) {
            console.log(res);
            if(res.code == 0){
                location.reload();
            }
        },function (res) {

        })
    });
    
    //计算总价
    function total() {
        var checkedNumber = $("input[name='checkedAll']:checked");
        var productMoney = 0;
        var cartArray = new Object;
        for(var i=0;i<checkedNumber.length;i++){
            var ele = $("input[name='checkedAll']:checked").eq(i).parents(".cartItem");
            var node = ele.find(".productSubtotalMoney").html();
            productMoney = productMoney + parseFloat(node);
            var cartObject = {
                productName:ele.find(".productDesc").html(),//产品名称
                productSize:ele.find(".productSize span").html(),//尺寸
                productColor:ele.find(".productColor span").html(),//颜色
                productPrice:ele.find(".price").html(),//单价
                productSubtotalMoney:ele.find(".productSubtotalMoney").html(),//金额小计
                productGoods:ele.find(".hidden").val(),//商品ID
                productCartImg :ele.find(".cartImg").attr("src"),//图片地址
                productNumber:ele.find(".productNumber input").val()//数量
            };
            var product = "product";
            product = product + i;
            cartArray[product] = cartObject;
        }
        $(".totalMoney").html(productMoney.toFixed(2));
        $(".number").html(checkedNumber.length);
        cartArray = JSON.stringify(cartArray); //将storage转变为字符串存储
        sessionStorage.productCart = cartArray;
    }

    
    //全选
    $("input[name='checkedAlls'] + label").click(function (event) {
        if(!$(this).siblings('input').is(':checked')){
            $("input[name='checkedAll']").prop('checked',true);
            $("input[name='checkedAlls']").prop('checked',true);
            event.preventDefault();
            setTimeout(total,100)
        }else{
            $("input[name='checkedAll']").prop('checked',false);
            $("input[name='checkedAlls']").prop('checked',false);
            event.preventDefault();
            setTimeout(total,100)
        }
    });
    
    //单个商品计算价格
    function singleTotal(el,condition) {
        var num = el.siblings('input').val();
        if(condition){
            num++;
        }else {
            num--;
        }
        el.siblings('input').val(num);
        var price = el.parents(".cartItem").find(".price").html();
        var priceTotal = num * parseFloat(price);
        el.parents(".cartItem").find(".productSubtotalMoney").html(priceTotal.toFixed(2))
    }

    //去结算
    $(".goToPay").click(function (event) {
        event.preventDefault();
        if($(".number").html() == 0){
            return;
        }else {
            location.href = "order.html?fromCart=true";
        }

    })




});




















