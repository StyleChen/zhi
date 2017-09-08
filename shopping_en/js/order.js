/**
 * Created by Administrator on 2017/6/28.
 */
$(function () {
    var userId = sessionStorage.userId;
    //如果没登陆，重定向回到首页
    if(userId == undefined){
        location.href = "index.html";
    }
    var fromCart = getUrlParam("fromCart");
    var productContent = JSON.parse(sessionStorage.productCart);
    var goodsContents = "";
    var subtotal = 0;//初始小计
    var arr = Object.keys(productContent);
    $.each(productContent,function (key, value) {

            goodsContents += '<div class="clearfix goodsList"><input type="hidden" class="hidden" value="'+value.productGoods+'"><dl> ' +
                '<dt><img src="'+value.productCartImg+'" alt=""></dt> ' +
                '<dd> ' +
                '<h2><a href="goodsDetail.html?goodsId='+value.productGoods+'">'+value.productColor+'</a></h2> ' +
                '<strong>颜色分类：</strong> ' +
                '<em class="productColor">'+value.productColor+'</em> <br>' +
                '<strong>规格：</strong> ' +
                '<em class="productSize">'+value.productSize+'</em> ' +
                '</dd> ' +
                '</dl> ' +
                '<span>$'+value.productPrice+'</span> ' +
                '<span class="productNumber">'+value.productNumber+'</span> ' +
                '<span>'+value.productSubtotalMoney+'</span></div>';
            subtotal += parseFloat(parseFloat(value.productSubtotalMoney).toFixed(2));

    });
    $(".goodsShow").html(goodsContents);//商品列表
    $(".goodsNum").html(arr.length + "件");//商品小计  商品件数
    $(".goodsMoney").html(subtotal.toFixed(2));//商品小计  商品总计金额
    $(".lastTotal").html("$" + subtotal.toFixed(2));//商品小计  最后商品应付总计金额



    //新增地址
    $('.addAddress').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(".form")[0].reset();
        $(".country").html("China").css("color","rgba(0,0,0,0.27)");
        $('.remak').show();
        if($('.update').length>0){
            $(".update").addClass("submit").removeClass("update");
        }
        // 新增地址
        $(".submit").click(function (event) {
            event.preventDefault();
            event.stopPropagation();
            var telHtml = '<span class="warn"><span class="x">x</span><strong>Your phone number is incorrect!</strong></span>';
            var userName = $(".name1").val();
            var userName2 = $(".name2").val();
            var phone = $(".phone").val();
            var city = $(".City").val();
            var detailedAddress = $(".stAddress").val();
            var zipCode = $(".zipCode").val();
            var country = $(".country").html();
            var province = $(".province").val();
            console.log(userName,userName2);
            if($.trim(userName) == ''|| $.trim(userName2) == ''){
                alert("Please type in your name!");
                return;
            }
            var userId = sessionStorage.userId;
            var addData = {
                userId:userId,
                firstName:userName,
                lastName: userName2,
                phone:phone,
                city: city,
                address:detailedAddress,
                zipCode:zipCode,
                country: country,
                province: province
            };
            console.log(addData);
            shopAjax("post","address/add",addData,function (res) {
                console.log("add"+res);
                if(res.code == 0){
                    $('.remak').hide();
                    loadAddress();
                }
            },function (res) {
                console.log(res);
            })
        });
    });
    $('.remak h2 strong').on('click', function () {
        $('.remak').hide();
    });

    //地址操作
    function checkedAddress(event) {
        $(".addressconfirm").html($(".address-active h2").html());//收货地址更新
        //地址选中
        $('.addressList li em,.addressList li h2').on('click', function () {
            $(this).parent().addClass("address-active").siblings('li').removeClass("address-active");
            $(".addressconfirm").html($(".address-active h2").html());//收货地址更新
        });
        //地址删除
        $('.deleteAddress').on('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            $(this).parent().remove();
            var userId = sessionStorage.userId;
            var addressId = $(this).parent().find(".hiddenAdd").val();
            console.log(userId,addressId);
            shopAjax("post","address/del",{userId:userId,addressId:addressId},function (res) {
                if(res.code != 0){
                    console.log("code",res)
                }
            },function (res) {
                console.log("error",res)
            })
        });
        //设置默认地址
        $(".setAddress").click(function () {
            var addressId = $(this).parent().find(".hiddenAdd").val();
            var userId = sessionStorage.userId;
            var addressData = {
                addressId:addressId,
                userId:userId
            };
            defaultAddress(addressData);
        });
        //修改地址
        $(".updateAddress").click(function (event) {
            event.preventDefault();
            event.stopPropagation();
            var addressId = $(this).parent().find(".hiddenAdd").val();
            var addressD= $(this).parent().find("h2").html().split(" ");
            console.log(addressD);
            $(".name1").val(addressD[0]);
            $(".name2").val(addressD[1]);
            $(".phone").val(addressD[7]);
            $(".City").val(addressD[3]);
            $(".stAddress").val(addressD[5]);
            $(".zipCode").val(addressD[6]);
            $(".country").html(addressD[2]);
            $(".province").val(addressD[4]);
            $('.remak').show();
            $(".submit").addClass("update").removeClass("submit");
            $(".update").click(function (event) {
                event.preventDefault();
                event.stopPropagation();
                var telHtml = '<span class="warn"><span class="x">x</span><strong>Your phone number is incorrect!</strong></span>';
                var userName = $(".name1").val();
                var userName2 = $(".name2").val();
                var country = $(".country").html();
                var city = $(".City").val();
                var province = $(".province").val();
                var phone = $(".phone").val();
                var detailedAddress = $(".stAddress").val();
                var zipCode = $(".zipCode").val();
                if(zipCode == ''){
                    zipCode = "000000"
                }
                if($.trim(userName) == ''){
                    alert("Please type in your name!");
                    return;
                }
                var userId = sessionStorage.userId;
                var addData = {
                    userId:userId,
                    firstName:userName,
                    lastName: userName2,
                    phone:phone,
                    city: city,
                    address:detailedAddress,
                    zipCode:zipCode,
                    country: country,
                    province: province,
                    addressId:addressId
                };
                shopAjax("post","address/update",addData,function (res) {
                    console.log("update"+res);
                    if(res.code == 0){
                        $('.remak').hide();
                        loadAddress();
                    }
                },function (res) {
                    console.log("error",res);
                })
            })
        });
    }

    //加载地址列表
    loadAddress();
    function loadAddress() {
        var userId = sessionStorage.userId;
        shopAjax("post","address/load",{userId:userId},function (res) {
            console.log(res);
            if(res.code == 0){
                var address = "";
                var active = "";
                var city = "";
                var addressList = res.data.addressList;
                for(var i=0;i<addressList.length;i++){
                    //默认地址
                    if(res.data.defaultAddressId == addressList[i].id){
                        active = "address-active"; 
                        address += '<li class="'+active+'"> <em></em> <h2>' +
                            addressList[i].firstName + " " + addressList[i].lastName + " "  + addressList[i].country +" " + addressList[i].city + " "+ addressList[i].province  + addressList[i].address + " " + addressList[i].zipCode  + " " +  addressList[i].phone +
                        ' <span style="color:#ae846c">【default address】</span></h2><strong class="deleteAddress">delet</strong><strong class="updateAddress">Change address</strong><strong class="setAddress">set as the default address</strong><input class="hiddenAdd" type="hidden" value="'+addressList[i].id +'"></li>';
                    }else{
                        address += '<li class="'+active+'"> <em></em> <h2>' +
                            addressList[i].firstName + " " + addressList[i].lastName + " " + addressList[i].country +" " + addressList[i].city + " " + addressList[i].province + " " +  addressList[i].address + " " + addressList[i].zipCode  + " " +  addressList[i].phone +
                        '</h2><strong class="deleteAddress">delet</strong><strong class="updateAddress">Change address</strong><strong class="setAddress">set as the default address</strong><input class="hiddenAdd" type="hidden" value="'+addressList[i].id +'"></li>';
                    }
                    console.log(addressList[i].id );
                }
                $(".addressList").html(address);
                if(res.data.defaultAddressId == ''){
                    if($(".addressList li").length > 0){
                        $(".addressList li:eq(0)").addClass("address-active");
                    }
                }
                checkedAddress()
            }
        },function (res) {
            console.log(res)
        })
    }


    //设置默认地址
    function defaultAddress(addressData) {
        shopAjax("post","address/default",addressData,function (res) {
            console.log(res);
            if(res.code == 0){
                location.reload();
            }
        },function (res) {
            console.log("error",res)
        })
    }


    //支付方式
    $(".payment li").click(function () {
        $(".payment li").removeClass("payment-active");
        $(this).addClass("payment-active");
    });

    //提交订单
    $(".btn").click(function () {
        if($(".address-active").length == 0){
            alert("请选择收件地址");
            return;
        }
        var addressId = $(".address-active .hiddenAdd").val();
        var leaveMessage = $("#leaveMessage").val();
        var goodsIds='',number='',color='',size='';
        var goodsList = $(".goodsList");
        for(var g=0;g<goodsList.length;g++){
            goodsIds += ("|" + goodsList.eq(g).find(".hidden").val());
            number += ("|" + goodsList.eq(g).find(".productNumber").html());
            color += ("|" + goodsList.eq(g).find(".productColor").html());
            size += ("|" + goodsList.eq(g).find(".productSize").html());
        }
        var orderData = {
            userId:userId,
            addressId:addressId,
            goodsIds:goodsIds,
            goodsCounts:number,
            goodsColors:color,
            goodsSizes:size,
            leaveMessage:leaveMessage,
            fromCart:fromCart
        };
        console.log(orderData);
        shopAjax("post","deal/order",orderData,function (res) {
            console.log(res);
            shopAjax("post","alipay/buildRequest",{dealId:res.data.dealId,lang:"en"},function (res) {

            },function (res) {
                console.log(res);
               $("body").html(res);
            })
        },function (res) {
            console.log("error",res)
        })
    })
});




































































