
//添加商品的操作
		$(".addBtn").click(function(){
					$("#myModal .modal-title").html("添加商品");
					$("#myModal .sureadd").html("确认添加");
					$(".sureadd").attr("action","add");
					
					
		})


		$(".sureadd").click(function(){
	
			var sendData={}
//			if($(this).html()=="确认添加"){
//				sendData.action="add";
//			}
//			if($(this).html()=="确认编辑"){
//				sendData.action="edit";
//			}		
		
			sendData.action=$(this).attr("action");
			console.log(sendData.action)
			
			
			sendData.pname=$(".pname").val();
			sendData.price=$(".price").val();
			sendData.imgsrc=$(".imgsrc").val();
			sendData.kucun=$(".kucun").val();
			sendData.color=$(".pcolor").val();
			sendData.bigimg=$(".bigimg").val();
			sendData.fenlei=$("#fenlei").val();
			sendData.gonglv=$(".gonglv").val();
//			sendData.size=["A级","C级"];
			var sizearr=[];
			$.each($(".size_warp input"), function(index,ele) {	
//						ele--当前元素--元素元素
					if(ele.checked){
						sizearr.push(ele.nextElementSibling.innerText);	
					}
			});
			sendData.size= JSON.stringify(sizearr);
			console.log(sendData);
			
			$.ajax({
				type:"post",
				url:"/product/productHandler",
				async:false,
				data:sendData,
				dataType:"json"
			}).done(function(res){
				console.log(res);
				if(res.success){
					alert("添加商品成功");
					//隐藏模态
					$('#myModal').modal('hide');
					loadProductList();
				}
				if(res.err){
					alert("添加失败");
				}
				
			}).fail(function(err){
				console.log(err);
			})
			
			
			
			
		})
	function loadProductList(){
		// 加载商品信息---请求后台数据----接口
	//		产生跨域  同源策略    同协议  同ip  同端口
			$.ajax({
				url:"/product/productList",
				type:"post",
				data:{},
				dataType:"json",
				async:false
	
			}).done(function(res){
					console.log(res);
					var str="";
					$.each(res,function(index,ele){
						
						str+='<tr>'
						      +'<th scope="row"><input type="checkbox" name="" id="" value="" /></th>'
						      +'<td><img style="width: 100px; height: 100px;" src="../images/'+ele.imgsrc+'"/></td>'
						       +'<td>'+ele.pname+'</td>'
						       +'<td>￥'+ele.price+'</td>'
						       +'<td style="background: '+ele.color+';"></td>'
						       +'<td>'+ele.size+'</td>'
						       +'<td>'+ele.kucun+'</td>'
						       +'<td><button  class="btn btn-primary edit" >编辑</button><button class="btn btn-danger del">删除</button></td>'
						     +'</tr>'	
					})
					$(".prolist").html(str)	
			})
	
	}
	loadProductList();
//编辑点击
//颜色转换方法
function zero_fill_hex(num, digits) {
  var s = num.toString(16);
  while (s.length < digits)
    s = "0" + s;
  return s;
}
function rgb2hex(rgb) {
  if (rgb.charAt(0) == '#')
    return rgb; 
  var ds = rgb.split(/\D+/);
  var decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]);
  return "#" + zero_fill_hex(decimal, 6);
  
}
		$(".edit").click(function(){
				//把输入框赋值
					var tr=$(this).parent();
					$(".pname").val(tr.children().eq(2).text());
					
					$(".price").val(tr.children().eq(3).text().substr(1));
				
					$(".imgsrc").val(tr.children().eq(1).find("img").attr("src").replace(/..\/images\//,"") )
					
//					$(".price").val(tr.children().eq(1).find("img").attr("src").replace(/..\/images\/(.*)/,"$1") );
				
//					$(".price").val(tr.children().eq(1).find("img").attr("src").substr(10) );
				console.log(tr.children().eq(4).css("background-color"))
				
					console.log(rgb2hex(tr.children().eq(4).css("background-color")))
					
					$(".color").val(rgb2hex(tr.children().eq(4).css("background-color")) )
						var sizearr=JSON.parse(tr.children().eq(5).text());
						$.each(sizearr, function(index,ele) {
								$.each($(".size_warp input"), function(ind,elecheck) {
									if(elecheck.nextElementSibling.innerHTML==ele){
										elecheck.checked=true;
									}
								});
						});
					
						
		
				//隐藏模态
					$('#myModal').modal('show');
					$("#myModal .modal-title").html("编辑商品");
					$("#myModal .sureadd").html("确认编辑");
					$(".sureadd").attr("action","edit");
		})
