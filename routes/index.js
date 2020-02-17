var express = require('express');
var router = express.Router();
var app = express();
const path = require('path');
var Crawler = require("crawler");
var mongo = require("./shujukufangfafengzhuang.js");



/* GET home page. */

router.get('/', function(req, res, next) {
		res.redirect("testvue.html");
		var setImg ={}

		var c = new Crawler({
				maxConnections : 10,
				// This will be called for each crawled page
				callback : function (error, res, done) {
						if(error){
								console.log(error);
						}else{
								var $ = res.$;
								// $ is Cheerio by default
								//a lean implementation of core jQuery designed specifically for the server
								console.log($("title").text());
						}
						done();
				}
		});

		c.queue([{
				uri: 'https://www.lanqiuba.com/lanqiu/',
				jQuery: true,

				// The global callback won't be called
				callback: function (error, res, done) {
						if(error){
								console.log(error);
						}else{
								// console.log('Grabbed', res.body, 'bytes');
								var $ = res.$;
								$('.video_table td ').each(function(index,item){
									let href = $(item).children('div').children('a').attr('href');
									let src = $(item).children('div').children('a').children('img')[0].attribs.src;
									let title = $(item).children('div').children('a')[0].attribs.title;
									let time = $(item).children('div').children('dl').children('dd')[0].children[0].data;
									var regexp = /[0-9]+/g;
									let activer_id = href.match(regexp)[0]
									var list = {
										link : href,
										src : src,
										title:title,
										time:time,
										activer_id:activer_id
									}
									mongo("find","img",{activer_id:list.activer_id},function(data){
										console.log(data)
										console.log(data[0])
										if(data[0] == undefined){
											console.log('无数据')
											mongo("add","img",list,function(result){
												if(result.length!=0){
													console.log('{"success":"插入成功"}')
												}else{
													console.log('{"success":"插入失败"}')
												}
											})
										}else{
											console.log('已存在数据');
										}
										// if(data.lenth !=0){
										// 	console.log('已存在数据');
										// 	// mongo("add","img",list,function(result){
										// 	// 	if(result.length!=0){
										// 	// 		console.log('{"success":"插入成功"}')
										// 	// 	}else{
										// 	// 		console.log('{"success":"插入失败"}')
										// 	// 	}
										// 	// })
										// }else{
										// 	console.log('无数据')
										// }
									})
									
								})
						}
						done();
				}
		}]);
});

module.exports = router;
