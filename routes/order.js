var express = require('express');
var router = express.Router();
var mongo = require("./dbDAO");


//添加商品信息到数据库
router.post('/Update_order',function(req,res){
	//		商品信息为sell  整理为一个对象
	var sell={};
	sell.pid=Number(req.body.pid);
	sell.pname=req.body.pname;
	sell.price=req.body.price;
	sell.imgsrc=req.body.imgsrc;
	sell.color=req.body.color;
	sell.kucun=req.body.kucun;
	sell.fenlei=req.body.fenlei;
	sell.size=req.body.size;
	sell.info={};
	sell.info.gonglv=req.body.gonglv;
	sell.info.bigimg=req.body.bigimg;
	console.log(typeof sell.pid)
	//前段发来的数据整理成json插入数据库
	//如果传过来的命令是add那么开始执行
	if(req.body.action=='addd'){
//		console.log(req.body)

		//查找数据库里面所有的内容，根据返回的data进行判断
		mongo("find","car",{},function(data){
			//如果data的长度是0，那么他的id是1
			if(data.length==0){
				pid=1
			}else{
				//如果数据库内已经有数据了，那么取他的下标+1
				pid=Number(data[data.length-1].pid)+1;
			}
			sell.pid=pid
			mongo("add","car",sell,function(data){
				if(data.result.n==1){
					res.send('{"success":"添加成功"}');
				}else{
					res.send('{"err":"添加失败"}');
				}
			})
		})
	}
	//如果前段传来的action是deit，那么这就是编辑接口
	if(req.body.action=='deit'){
		console.log(sell)
		mongo("updates","car",[{"pid":Number(req.body.pid)},sell],function(data){
//			console.log(data)
			if(data.result.n==1){
				res.send('{"success":"修改成功"}');
			}else{
				res.send('{"err":"修改失败"}');
			}
		})
	}
	
})

//请求渲染数据接口
router.post("/onlod",function(req,res){
	mongo("find","car",{},function(data){
		if(data.length!=0){
			res.send(data);
		}else{
			res.send('{"err":"失败"}');
		}
	})
})

router.post("/dele",function(req,res){
	console.log({pid:Number(req.body.pid)})
	mongo("del","car",{pid:Number(req.body.pid)},function(data){
		if(data.result.n==1){
			res.send('{"success":"修改成功"}');
		}else{
			res.send('{"err":"修改失败"}');
		}
	})
})




module.exports = router;
			//列名后端需要前段提供的JSON数据
//					{
//						pid:"10",
//						pname:"奔驰",
//						price:"88",
//						imgsrc:"1.png",
//						color:"#ff0",
//						kuncun:888,
//						fenlei:"跑车",
//						size:["A级","B级"],
//						info:{
//							gonglv:"2.8T",
//							bigimg:"2.png"
//						}
//					}