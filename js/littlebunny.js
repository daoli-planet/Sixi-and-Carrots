// JavaScript Document
var screenW = $(window).get(0).innerWidth;
var screenH = $(window).get(0).innerHeight-30;
var backgH = parseInt(screenW*5/3);
var c = document.getElementById("bunny");
c.setAttribute('width', screenW);
c.setAttribute('height', screenH);
var ctx = c.getContext("2d");
var img = newImg("img/bg.png");
img.onload = function() {
	ctx.drawImage(img, 0, 0, screenW, backgH);
}
var ups; //循环计数


$(window).resize(function() {
	resizeCanvas();
});
 function resizeCanvas() { 
 	 screenW = $(window).get(0).innerWidth;
	 screenH = $(window).get(0).innerHeight-30;
	 backgH = parseInt(screenW*5/3);
 	 c.setAttribute('width', screenW);
  	 c.setAttribute('height', screenH); 
 };  
   

// 记录游戏的时间
var time1 = 0;
var time2 = 80;
var carrotsLog = 0;
//三种胡萝卜
var carrots1 = newImg("img/carrot0.png");
var carrots2 = newImg("img/carrot1.png");
var carrots3 = newImg("img/carrot2.png");

// 得分
var jifen = 0;

function getSudu() {
		var number = parseInt(Math.random() * 10);
		if (number < 5 && number > 0) {
			return number;
		}
		return 1;
	}
	// 飞机的对象

function carrotsObj(hp, ewidth, eheight,escore, eimg, esudu) {
	// 随机的X
	this.x = parseInt(Math.random() * (screenW-20) + 1);
	this.y = 0;
	// 血量
	this.hp = hp;
	// 挨打
	this.hit = 0;
	// 是否死亡
	this.over = 0;
	this.score = escore;

	this.width = ewidth;
	this.height = eheight;
	this.img = eimg;
	this.sudu = esudu;
}

function getCarrots(type) {
	switch (type) {
		case 1:
			return new carrotsObj(100, 52, 120,1, carrots1, getSudu());
		case 2:
			return new carrotsObj(500, 52, 120,2, carrots2, getSudu());
		case 3:
			return new carrotsObj(1000, 52, 120,3, carrots3, getSudu());
	}
}

function cartridge(x, y) {
		this.x = x;
		this.y = y;
	}
(function(cxt) {
	var bunny = {
		nums: 0
	};
	//	胡萝卜们
	var carrots = new Array();
	var carrotsImg = newImg("img/carrot1.png");
	//四喜
	var sixi = {
		x: screenW/2-42,
		y: screenH-126
	};
	var sixiImg = newImg('img/sixi.png');
	//	子弹
	var cartridges = new Array();
	var cartridgeImg = newImg('img/bullet2.png');

	var boo1 = newImg('img/hurt.png');
	var over = newImg('img/over.png');
	var score = newImg('img/score.png');

	bunny.update = function() {
		//		时间设置
		bunny.setTimes();
		// 设置背景
		bunny.setBg();
		//		四喜的位置
		bunny.setSixi();
		//		设置胡萝卜
		bunny.setCarrots();
		//		设置子弹
		bunny.cartridge();
		//		游戏数据

	}

	bunny.setTimes = function() {
		time1++;
		// 100 秒 
		if (time1 == 1000) {
			time1 = 0;
			time2 = (time2 == 20) ? 20 : time2 - 20;
		}

	}


	//背景移动
	bunny.setBg = function() {
			bunny.nums++;
			if (bunny.nums == backgH) {
				bunny.nums = 0;
			}
			// 画布的背景
			cxt.drawImage(img, 0, bunny.nums, screenW, backgH);
			cxt.drawImage(img, 0, bunny.nums - backgH, screenW, backgH);
		}
		//	四喜初始位置
	bunny.setSixi = function() {
			cxt.drawImage(sixiImg, sixi.x, sixi.y, 83, 126);
		}
		//	扔胡萝卜
	bunny.setCarrots = function() {
		if (bunny.nums % time2 == 0) {
			carrotsLog++;
			if (carrotsLog % 6 == 0) {
				carrots.push(getCarrots(2));
			} else if (carrotsLog % 13 == 0) {
				carrots.push(getCarrots(3));
			} else {
				carrots.push(getCarrots(1));
			}

		}

		for (a in carrots) {


			//			胡萝卜移动
			carrots[a].y += carrots[a].sudu;
			// 如果超出屏幕 删除
			if (carrots[a].y > (screenH-20)) {
				carrots.splice(a, 1);
			}


			// 胡萝卜死亡
			if (carrots[a].over > 0) {
				carrots[a].over--;
				if (carrots[a].over > 20) {
					cxt.drawImage(boo1, carrots[a].x, carrots[a].y, 52, 120);
				} else if (carrots[a].over > 2) {
					cxt.drawImage(over, carrots[a].x, carrots[a].y, 52, 120);
				}else {
					carrots.splice(a, 1);
				}

			} else {
				cxt.drawImage(carrots[a].img, carrots[a].x, carrots[a].y, carrots[a].width, carrots[a].height);
				// 判断自己是否死亡
				if (sixi.x > (carrots[a].x - 83) && (sixi.x) < (carrots[a].x + 52) && (sixi.y) < (carrots[a].y + 120) && (sixi.y + 126) > (carrots[a].y)) {
					window.clearTimeout(ups);
					$(".finalScore").html(jifen);
					$("#replay").fadeIn(300);
					$(".reply_btn").on("click",function(){
						 location.reload();
					});
				}
				if (carrots[a].hit > 0) {
					cxt.drawImage(boo1, carrots[a].x, carrots[a].y, 52, 120);
					carrots[a].hit--; //受伤后100毫秒恢复
				}
			}

		}
	}

	// 更新子弹方法
	bunny.cartridge = function() {
		if (bunny.nums % 5 == 0) {
			cartridges.push(new cartridge(sixi.x + 45, sixi.y));
		}

		for (i in cartridges) {
			// 飞到顶部就将子弹删除掉
			if (cartridges[i].y < 0) {
				cartridges.splice(i, 1);
				continue;
			}

			//子弹移动
			cartridges[i].y -= 20;
			cxt.drawImage(cartridgeImg, cartridges[i].x, cartridges[i].y, 12, 16);

			// 子弹碰到胡萝卜的情况
			for (j in carrots) {
				if (carrots[j].over > 0) {
					continue;
				}
				if (cartridges[i].x > carrots[j].x && cartridges[i].x < carrots[j].x + carrots[j].width && cartridges[i].y > carrots[j].y && cartridges[i].y - carrots[j].height < carrots[j].y) {

					carrots[j].hit = 10;

					if (carrots[j].hp > 1) {
						carrots[j].hp -= 80;
					} else {
						carrots[j].over = 40; //400毫秒内记一次攻击
						jifen += carrots[j].score;
						$('#carrots').html(jifen);
						$("#score").attr("class","score"+carrots[j].score);
						$("#score").stop().fadeIn(100).fadeOut(500);
					}
					// 子弹消失
					cartridges.splice(i, 1);
					break;
				}
			}
		}
	}

	//鼠标操作
	c.addEventListener('touchmove', function onMouseMove(event) {
		sixi.x = event.changedTouches[0].clientX - $('#bunny').offset().left - 41;
		sixi.y = event.changedTouches[0].clientY - 65;
		$('#sxX').html(sixi.x); //定位数据
		$('#sxY').html(sixi.y);
	});
	ups = setInterval(bunny.update, 10);
}(ctx));

function newImg(src) {
	var obj = new Image();
	obj.src = src;
	return obj;
}