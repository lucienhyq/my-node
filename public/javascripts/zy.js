$(function() {
	$("#xg").click(function() {
	
		if(mytools.isLogin().success){
			console.log(mytools.isLogin())
			$("#passwordMask").show()
		}else{
			alert("请先登录")
			location.href="yzm.html"
		}
	})
	$("#close_mask").click(function() {
		$("#passwordMask").hide()
	})
	
	//修改密码
	$("#submit").click(function(){
		if($("#newpass").val()==$("#confirmpass").val()){
			$.ajax({
				type:"post",
				url:"/users/editPassword",
				async:true,
				dataType:"json",
				data:{
					oldpassword:$("#oldpass").val(),
					newPwd:$("#newpass").val()
				}
			}).done(function(res){
				console.log(res);
			})
			
		}else{
			alert("两次密码不一致")
		}
	})
})