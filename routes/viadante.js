var express = require('express');
var router = express.Router();
var mongo = require("./shujukufangfafengzhuang.js");
var ObjectId=require('mongodb').ObjectID; 

//加密模块
var crypto = require("crypto");
// 处理 mongodb里面的 _id格式 _id:Object("asdsad")
var ObjectId=require('mongodb').ObjectID; 
	router.get("/isLogin",function(req,res){
		//判断session中是否有值
		if(req.session.user){
//			console.log(88888)
			console.log(req.session.user);
			if(req.session.user.userName){
				res.send('{"success":"已登录"}');
			}else{
				res.send('{"err":"未登录"}');
			}
		}else{
			
			var newUser=new User({
				name:'',
				veri:'',
				password:'',
				id:''
			})
			req.session.user=newUser;
			res.send('{"err":"未登录"}');
		}
	})
	
	
	router.post('/uplist',function(req,res){
		var viaids={}
		viaids.id = Number(req.body.viaid)
		viaids.sell_in=req.body.sell_in
		viaids.order_num=req.body.order_num
		viaids.money=req.body.money
		viaids.imgs=req.body.imgs
		viaids.name=req.body.name
//		viaids.userName=req.body.userName
		
		var order_num=0;
		var tmoney=0;
		if(req.body.action=='addd'){
				mongo("find","via",{id:req.body.viaid},function(data){
					console.log(data)
					if(data.length==0){
						order_num=req.body.order_num
						pid=1
						mongo("add","via",viaids,function(data){
							if(data.result.n==1){
								res.send('{"success":"添加成功"}');
								
							}else{
								res.send('{"err":"添加失败"}');
							}
						})
					}else{
						tmoney=Number(viaids.money)*Number(data[0].order_num);
						order_num=Number(data[0].order_num)+Number(viaids.order_num);
						pid=Number(data[data.length-1].pid)+1;
						
						mongo("updates","via",[{id:viaids.id},{order_num:order_num}],function(date){
							if(date.result.n==1){
								res.send('{"success":"修改成功"}');
							}else{
								res.send('{"err":"修改失败"}');
							}
						})
					}
					
					viaids.pid=pid
					
					
				})
			}
		})
	
	
	router.post('/chakan',function(req,res){
		mongo('find','via',{},function(data){
				res.send(data)
		})
	})

module.exports = router;