//报错文件
//var createError = require('http-errors');
var express = require('express');
var path = require('path');
//cookie处理模块
var cookieParser = require('cookie-parser');
//引入路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var orderRouter = require('./routes/order');
var viadanteRouter = require('./routes/viadante');
var test = require('./routes/test');
var wx = require('./routes/wx');
//引入session模块

var session = require("express-session");

var app = express();
app.use(session({
	    name:'tianmao',
	    secret:'tianmao',
	    cookie:{
	    	maxAge:80000000000 //
	    },
	    resave:false, //每次请求是否重新设置session
//	指每次请求重新设置 session cookie ,假如你设置的 cookie有效 10分钟    
	    saveUninitialized:false //每次请求是否初始化session	    
}))


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//匹配静态资源路径
app.use(express.static(path.join(__dirname, 'public')));
//引用路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/order',orderRouter);
app.use('/viadante',viadanteRouter);
app.use('/test',test);
app.use('/wx',wx);
module.exports = app;
