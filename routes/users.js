var express = require('express');
var router = express.Router();
var mongo = require("./shujukufangfafengzhuang.js");
var app = express();
//加密模块
var crypto = require("crypto");
// 处理 mongodb里面的 _id格式 _id:Object("asdsad")
var ObjectId=require('mongodb').ObjectID; 
//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});
function User(users){
	this.name=users.name;//登录人账号
	this.veri=users.veri;
	this.password=users.password;
	this.id=users.id;
}
	

	//验证码接口
	router.get('/admin', function(req, res, next) {
		//req。query前段get方式传来的数据
			if(req.query.action=="veri"){
				var v="";
				var codearr="ASDFGHJKLQWERTYUIOPZXCVBNMasdfghjklpiuytrewq123456789"
				for(var i=0;i<4;i++){
					v+=codearr[Math.floor(Math.random()*codearr.length)]
				}
				var newUser=new User({
					name:"",
					veri:v,
					password:'',
					id:""
				})
				req.session.user=newUser
				console.log(req.session.user)
				res.send('{"veri":"'+v+'"}')
			}
			
			if(req.query.action=="checkVeri"){
				console.log(req.query.veri)
				console.log(req.session.user.veri);
				console.log(req.query.veri==req.session.user.veri);
				if(req.query.veri==req.session.user.veri){
					res.send('{"success":"验证码正确"}')
				}else{	
					res.send('{"err":"验证码错误"}')
				}
			}
	});
	
	//登录接口
	router.post('/login',function(req,res){
		
		//先寻找前段传过来的userName
		mongo("find","user",{phone:req.body.userName},function(data){
			if(data.length!=0){
				console.log(req.body.userName)
				console.log(req.body.password)
				var MD51s=crypto.createHash('md5')
				var password=MD51s.update(req.body.password).digest('base64');
				if(password==data[0].password){
					req.session.user={
						userName:req.body.userName,
						password:req.body.password
					};
					console.log(req.session.user)
					res.send(data);
					
				}else{
					res.send('{"err":"密码错误"}');
					
				}
			} else {
				res.send('{"err":"用户不存在"}')
			}
		})
		
	})
	
	
	//vid注册接口
	router.post('/inmin',function(req,res){
		mongo("find","user",{phone:req.body.userName},function(data){
			console.log(data)
			if(data.length==0){
				var viauser={}
				viauser.phone=req.body.userName
				var MD5 = crypto.createHash('md5');
				viauser.password=MD5.update(req.body.password).digest('base64');
				mongo("add","user",viauser,function(result){
						if(result.length!=0){
						res.send('{"success":"注册成功"}')
					}else{
						res.send('{"success":"注册失败"}')
					}
				})
			}else{
				res.send('{"err":"用户名已被注册"}')
			}
		
		})
	})

	//注册接口
	router.post('/min',function(req,res){
		//把前段传的用户名 密码 手机号 存到数据库
		//需要用到封装的db  
		//判断用户名是否注册过
		mongo("find","user",{userName:req.body.userName},function(data){
				if(data.length==0){
					//用户名可以使用，注册操作
					var userInfo={};
					//账号
					userInfo.userName=req.body.userName==""?false:req.body.userName;
					userInfo.trueName=req.body.trueName==""?false:req.body.trueName;
					//手机号
					userInfo.phone=req.body.phone==""?false:req.body.phone;
					//密码  -----需要用加密模块
					var MD5 = crypto.createHash('md5');
					userInfo.password=MD5.update(req.body.password).digest('base64');
					//邮箱
					userInfo.email=req.body.email;
					//注册时间
					userInfo.creatTime=new Date().toLocaleString();
					//权限
					userInfo.powerCode=req.body.powerCode;	
					//权限名称	
					userInfo.power=req.body.powerCode=="1"?"会员":"普通用户";
						//开始判断					
							if(userInfo.userName&&userInfo.trueName){
								if(userInfo.phone){
									//添加到数据操作
									mongo("add","user",userInfo,function(result){
											if(result.length!=0){
											res.send('{"success":"注册成功"}')
										}else{
											res.send('{"success":"注册失败"}')
										}
									})
								}else{
									res.send('{"err":"手机格式错误"}')
								}
							}else{
								res.send('{"err":"参数不能为空"}')
							}
				}else{
					res.send('{"err":"用户名已被注册"}')
				}
		})
	})
	
	//用户信息和编辑用户
	router.post("/userInfo",function(req,res){
//			如果前段传过来的指令是getUser就执行下面的判断
		if(req.body.action=="getUser"){
//			console.log(req.body.userId)
		//            使用mongoDB里面处理id的方法处理前段传过来的ID值
		console.log(req.body.userId	)
			mongo("find","user",{_id:ObjectId(req.body.userId)},function(data){
				console.log(data);
				if(data.length!=0){
					res.send(data)
				}else{
					res.send('{"err":"用户信息获取失败"}');
				}
			})
		}
		if(req.body.action=="editUser"){
			console.log("修改中...")
			//修改信息
			var newUserInfo={}
			newUserInfo.phone=req.body.phone;
			newUserInfo.powerCode=req.body.powerCode;
			newUserInfo.power=req.body.powerCode=="1"?"会员":"非会员";
			newUserInfo.email=req.body.email;
			newUserInfo.trueName=req.body.trueName;
			newUserInfo.createTime=req.body.createTime;
			
			mongo("updates","user",[{userName:req.body.userName},newUserInfo],function(data){
				if(data.result.n==1){
					console.log("修改成功")
					res.send("<div><p>修改成功</p><a href='http//localhost:3000/refister.html'>返回用户信息页</a></div>")
				}else{
					console.log("修改失败");
					res.send('{"err":"修改失败"}');
				}
			})
			
		}
		
	})
	
	//c
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
	
	//修改密码
	router.post("/editPassword",function(req,res){
		//				        找到前段传过来的userName
		mongo("find","user",{userName:req.session.user.userName},function(data){
			if(data.length!=0){
				var MD5=crypto.createHash('md5');
				//原密码
				var oldpassword=MD5.update(req.body.oldpassword).digest('base64');
				//新密码
				var MD5s=crypto.createHash('md5');
				var newpassword=MD5s.update(req.body.newPwd).digest('base64');
				if(oldpassword==data[0].password){
					console.log(req.body.oldpassword)
					console.log(req.body.newPwd)
					mongo("updates","user",[{userName:req.session.user.userName},{password:newpassword}],function(date){
						if(date.result.n==1){
							res.send('{"success":"修改成功"}');
						}else{
							res.send('{"err":"修改失败"}');
						}
					})
				}else{
					res.send('{"err":"原密码错误"}');
				}
			}else{
				res.send('{"err":"修改失败"}');
			}
		})
		
		
	})
	
//退出登录  清空session中的值
	router.get("/quit",function(req,res){
			if(req.session.user){
				req.session.user.name="";
				req.session.user.password="";
				res.send('{"success":"退出成功"}');
			}else{
				res.send('{"err":"未登录"}');
			}
		
		
	})
	
	
	//这是用来查看后台session是否存了内容的接口
	router.post("/session",function(req,res){
		var data=req.session.user;
		res.send(data);	
	})


module.exports = router;
