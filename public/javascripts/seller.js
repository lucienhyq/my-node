var QJB = {}
$(function() {
	download()
	
	//使前段传过去后端的action为add
	$(".addbtn").click(function() {
		$('.modal-title').html("添加商品");
		$('.confirm').html("确认添加")
		$('.confirm').attr("action", "addd")
	})

	

//添加，修改操作
	$(".confirm").click(function() {
		//先把后端需要的数据列名出来
		//下面ajax那里data中直接填写selldata变量
		var selldata = {}
		//		selldata.action = "add";
		//获取按钮的自定义属性  action  --add或edit --走不同的逻辑
		selldata.action = $(this).attr("action")
		console.log(selldata.action)
		//清空数据
		selldata.pid=$(".pid").attr("pid");
		console.log($(".pid"))
		selldata.pname = $('.pname').val();
		selldata.price = $('.price').val();
		selldata.imgsrc = $(".imgsrc").val();
		selldata.kucun = $(".kucun").val();
		selldata.color = $(".color").val();
		selldata.bigimg = $(".bigimg").val();
		selldata.fenlei = $(".fenlei").val();
		selldata.gonglv = $(".gonglv").val();

		//size需要传一个数组过去
		var siezearr = [];

//       用foreach循环.size_warp里面的input
		$.each($(".size_warp input"), function(index, ele) {
//			ele  当前元素   
			if(ele.checked) {
				siezearr.push($(ele).next().text());
			}
		});
		selldata.size = JSON.stringify(siezearr)

		$.ajax({
			type: "post",
			url: "/order/Update_order",
			async: true,
			data: selldata,
			dataType: "json"
		}).done(function(res) {
			console.log(res)
			if(res.success) {
				alert("添加商品成功")
				//bootstrap中的隐藏模态框指令
				$('#myModal').modal('hide');
				download()
			}
			if(res.err) {
				alert("添加失败")
			}
		}).fail(function(err) {
			console.log(err)
		})
	})
	
	//点击编辑时渲染编辑框
	//用时间委托进行绑定	
	 $(".tbdy").delegate(".edit","click",function(){
//	$(".edit").click(function() {
		
		//modal 是bootstrap显示模态框的方法
		//使前段传过去后端的action为deit
		//console.log($(this).parent().parent())	parent 可以找到上一级的第一个父元素
		var tr = $(this).parent().parent()
		var sizearr = JSON.parse(tr.children().eq(5).text());
		$.each(sizearr, function(index, ele) {
			$.each($(".size_warp input"), function(ind, elecheck) {
				if(elecheck.nextElementSibling.innerHTML == ele) {
					elecheck.checked = true;
				}
			});
		});
//		为全局变量的var QJB={
//			quanbu:{}
//		}    赋值
		console.log(QJB.quanbu)
		var index = $(this).index(".edit");
		$(".pname").val(QJB.quanbu[index].pname);
		$(".price").val(QJB.quanbu[index].price);
		$(".imgsrc").val(QJB.quanbu[index].imgsrc)
		$(".color").val(QJB.quanbu[index].color);
		$(".kucun").val(QJB.quanbu[index].kucun)
		$(".gonglv").val(QJB.quanbu[index].info.gonglv);
		$(".bigimg").val(QJB.quanbu[index].info.bigimg);
		$(".pid").val(QJB.quanbu[index].pid);
		console.log(QJB.quanbu[index].pid)
			
		$("#myModal").modal("show");
		$('.modal-title').html("编辑商品");
		$('.confirm').html("确认编辑")
		$('.confirm').attr("action", "deit")
	})
	
//删除方法
	$(".tbdy").delegate(".del","click",function(){
		$.ajax({
			type:"post",
			url:"/order/dele",
			async:false,
			dataType:"json",
			data:{pid:$(this).parent().parent().attr("pid")}
		}).done(function(res){
			if(res.success){
				alert("删除成功")
				download();
			}
			if(res.err){
				alert("删除失败")
			}
		})
		
	})

})

//渲染数据     动态字符串拼接渲染
function download() {
	$.ajax({
		type: "post",
		url: "/order/onlod",
		async: false,
		data: {},
		dataType: "json"
	}).done(function(res) {
		console.log(res)
//		先把res拿到全局变量中，方便调用pid
		QJB.quanbu = res
		var str = '';
		if(res.err){
			$(".tbdy").html('')
		}else{
			$.each(res, function(index, ele) {
			str += '<tr class="pid" pid="' + ele.pid + '"  gonglv="' + ele.info.gonglv + '"  bigimg="' + ele.info.bigimg + '">' +
				'<th scope="row"><input type="checkbox" name="" id="" value="" /></th>' +
				'<td><img style="width: 100px; height: 100px;" src="' + ele.imgsrc + '"/></td>' +
				'<td>' + ele.pname + '</td>' +
				'<td>￥' + ele.price + '</td>' +
				'<td style="background: ' + ele.color + ';"></td>' +
				'<td>' + ele.size + '</td>' +
				'<td>' + ele.kucun + '</td>' +
				'<td><button  class="btn btn-primary edit" >编辑</button><button class="btn btn-danger del">删除</button></td>' +
				'</tr>'
				console.log(ele.pid)
		})
		$(".tbdy").html(str)
		}
		
		

	})

}