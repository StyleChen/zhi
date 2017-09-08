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
                '<span>￥'+value.productPrice+'</span> ' +
                '<span class="productNumber">'+value.productNumber+'</span> ' +
                '<span>'+value.productSubtotalMoney+'</span></div>';
            subtotal += parseFloat(parseFloat(value.productSubtotalMoney).toFixed(2));

    });
    $(".goodsShow").html(goodsContents);//商品列表
    $(".goodsNum").html(arr.length + "件");//商品小计  商品件数
    $(".goodsMoney").html(subtotal.toFixed(2));//商品小计  商品总计金额
    $(".lastTotal").html("￥" + subtotal.toFixed(2));//商品小计  最后商品应付总计金额



    //新增地址
    $('.addAddress').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(".form")[0].reset();
        $(".provis").html("请选择（省）").css("color","rgba(0,0,0,0.27)");
        $(".citys").html("请选择（市）").css("color","rgba(0,0,0,0.27)");
        $(".areas").html("请选择（区/县）").css("color","rgba(0,0,0,0.27)");
        $('.remak').show();
        if($('.update').length>0){
            $(".update").addClass("submit").removeClass("update");
        }
        // 新增地址
        $(".submit").click(function (event) {
            event.preventDefault();
            event.stopPropagation();
            var telHtml = '<span class="warn"><span class="x">x</span><strong>您输入的手机号有误！</strong></span>';
            var userName = $(".userName").val();
            var phone = $(".phone").val();
            var provis = $(".provis").html();
            var citys = $(".citys").html();
            var areas = $(".areas").html();
            var detailedAddress = $(".detailedAddress").val();
            var zipCode = $(".zipCode").val();
            if($.trim(userName) == ''){
                alert("请输入姓名");
                return;
            }
            if(!isPhone(phone)){
                if($(".x").length <= 0){
                    $(".tel").append(telHtml);
                }
                return;
            }else if($(".x").length > 0){
                $(".warn").remove();
            }
            if($.trim(provis) == "请选择（省）" || $.trim(citys) == "请选择（市）" || $.trim(areas) == "请选择（区/县）"){
                $(".loca").append('<span class="warn"><span class="x">x</span><strong>请选择完整地址！</strong></span>')
                return;
            }else {
                $(".loca .warn").remove();
            }
            if($.trim(detailedAddress) == ''){
                $(".detailedAddressInput").append('<span class="warn"><span class="x">x</span><strong>请填写详细地址！</strong></span>')
                return;
            }else {
                $(".detailedAddressInput .warn").remove();
            }
            var userId = sessionStorage.userId;
            var address = provis + "|" + citys + "|" + areas;
            var addData = {
                userId:userId,
                personName:userName,
                phone:phone,
                area:address,
                address:detailedAddress,
                zipCode:zipCode
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
    function checkedAddress() {
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
            $(".userName").val(addressD[0]);
            $(".phone").val(addressD[5]);
            $(".detailedAddress").val(addressD[4]);
            $(".provis").html(addressD[1]).css("color","#000");
            $(".citys").html(addressD[2]).css("color","#000");
            $(".areas").html(addressD[3]).css("color","#000");
            $('.remak').show();
            $(".submit").addClass("update").removeClass("submit");
            $(".update").click(function (event) {
                event.preventDefault();
                event.stopPropagation();
                var telHtml = '<span class="warn"><span class="x">x</span><strong>您输入的手机号有误！</strong></span>';
                var userName = $(".userName").val();
                var phone = $(".phone").val();
                var provis = $(".provis").html();
                var citys = $(".citys").html();
                var areas = $(".areas").html();
                var detailedAddress = $(".detailedAddress").val();
                var zipCode = $(".zipCode").val();
                if(zipCode == ''){
                    zipCode = "000000"
                }
                if($.trim(userName) == ''){
                    alert("请输入姓名");
                    return;
                }
                if(!isPhone(phone)){
                    if($(".x").length <= 0){
                        $(".tel").append(telHtml);
                    }
                    return;
                }else if($(".x").length > 0){
                    $(".tel .warn").remove();
                }
                if($.trim(provis) == "请选择（省）" || $.trim(citys) == "请选择（市）" || $.trim(areas) == "请选择（区/县）"){
                    $(".loca").append('<span class="warn"><span class="x">x</span><strong>请选择完整地址！</strong></span>')
                    return;
                }else {
                    $(".loca .warn").remove();
                }
                if($.trim(detailedAddress) == ''){
                    $(".detailedAddressInput").append('<span class="warn"><span class="x">x</span><strong>请填写详细地址！</strong></span>')
                    return;
                }else {
                    $(".detailedAddressInput .warn").remove();
                }
                var userId = sessionStorage.userId;
                var address = provis + "|" + citys + "|" + areas;
                var addData = {
                    userId:userId,
                    personName:userName,
                    phone:phone,
                    area:address,
                    address:detailedAddress,
                    zipCode:zipCode,
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
                var addressList = res.data.addressList;
                for(var i=0;i<addressList.length;i++){
                    var area = addressList[i].area.split("|");
                    var city = "";
                    var active = "";
                    for(var j=0;j<area.length;j++){
                        city += area[j] + " "
                    }
                    //默认地址
                    if(res.data.defaultAddressId == addressList[i].id){
                        active = "address-active";
                        address += '<li class="'+active+'"> <em></em> <h2>' +
                            addressList[i].personName + " " + city + addressList[i].address + " " + addressList[i].phone +
                            ' <span style="color:#ae846c">【默认地址】</span></h2><strong class="deleteAddress">删除</strong><strong class="updateAddress">修改地址</strong><strong class="setAddress">设为默认地址</strong><input class="hiddenAdd" type="hidden" value="'+addressList[i].id +'"></li>';
                    }else{
                        address += '<li class="'+active+'"> <em></em> <h2>' +
                            addressList[i].personName + " " + city + addressList[i].address + " " + addressList[i].phone +
                            '</h2><strong class="deleteAddress">删除</strong><strong class="updateAddress">修改地址</strong><strong class="setAddress">设为默认地址</strong><input class="hiddenAdd" type="hidden" value="'+addressList[i].id +'"></li>';
                    }
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

            shopAjax("post","alipay/buildRequest",{dealId:res.data.dealId,lang:"cn"},function (res) {
                console.log(res)
            },function (res) {
                console.log(res)
            })
/*            $.ajax({
                type:"post",
                url: "http://papermaker.cn:8080/mall/alipay/buildRequest",
                data:{dealId:res.data.dealId,lang:"cn"},
                success: function (res) {
                        $("body").html(res);

                },
                error:function (res) {
                    console.log("error : ",res);
                }
            });*/
        },function (res) {
            console.log("error",res)
        })
    })
});




































































