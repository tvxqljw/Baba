/**
 * Created by wuhaolin on 8/17/14.
 */
"use strict";

/**
 * 一行中的一个按钮模版
 */
var oneBtnTemp = $('<div class="one" data-color></div>');

/**
 * 初始化时矩阵的大小
 * @type {number}
 */
var initSize = 2;

/**
 * 目前按钮矩阵的大小的边长
 * @type {number}
 */
var nowSize = initSize;

/**
 * 初始化时目前剩余的时间，秒
 * @type {number}
 */
var initReTime = 60;

/**
 * 目前剩余的时间，秒
 */
var nowReTime = initReTime;

/**
 * 显示分数的html
 */
var nowScoreCon = $('#scoreCon');

/**
 * 显示剩余时间的html
 */
var nowTimeCon = $('#timeCon');

/**
 * 存放所有按钮的容器
 */
var main = $('#mainCon');

/**
 * 颜色仓库
 */
var colorLib = [
	{color: '#23d10f', count: 0},
	{color: '#ff525c', count: 0}
];

/**
 * 存储矩阵里所有的正方形
 * @type {Array}
 */
var btnList = [];

/**
 * 游戏是否已经结束
 */
var isGameOver = false;

/**
 * 构造一个正方形按钮
 * @param size 按钮的高度
 * @param backgroundColor 按钮的颜色
 */
function makeOneBtn(size, backgroundColor) {
	var newBtn = $(oneBtnTemp).clone();
	$(newBtn).css('height', size - 2);
	$(newBtn).css('width', size - 2);
	$(newBtn).css('backgroundColor', backgroundColor);
	$(newBtn).data('color', backgroundColor);
	$(newBtn).click(function () {
		//如果游戏已经结束就不处理
		if (isGameOver) {
			return;
		}
		if (checkNow(this)) {//正确
			randomMain(++nowSize);
		} else {//错误
			$(main).hide();
			randomMain(--nowSize);
			$(main).fadeIn();
		}
	});
	return newBtn;
}

/**
 * 检验选择的按钮是否是颜色最多的按钮
 * @param btn
 * @returns {boolean}
 */
function checkNow(btn) {
	var color = $(btn).data('color');
	var count = 0;
	for (var i = 0; i < colorLib.length; i++) {
		if (colorLib[i].color == color) {
			count = colorLib[i].count;
			break;
		}
	}
	for (var i = 0; i < colorLib.length; i++) {
		if (count < colorLib[i].count) {
			return false;
		}
	}
	return true;
}

/**
 * 从colorLib里面随机产生一个颜色值，并且对应的颜色值加一
 */
function randomColor() {
	var index = Math.floor(Math.random() * colorLib.length);
	colorLib[index].count++;
	return colorLib[index].color;
}

/**
 * 重新设置中间的正方形矩阵
 * @param count 这个矩阵一行包含多少个小正方形
 */
function randomMain(count) {

	//更新显示分数
	$(nowScoreCon).html(nowSize - 2);

	var conHeight = window.innerHeight - 100;
	var conWidth = $(main).width();
	if (conWidth > conHeight) {
		conWidth = conHeight;
		$(main).width(conWidth);
	}
	var conSize = conWidth;
	var oneSize = conSize / count;

	var btnSumCount = count * count;
	var shouldAddCount = btnSumCount - btnList.length;

	//如果现有的不够就增加
	if (shouldAddCount >= 0) {
		for (var i = 0; i < shouldAddCount; i++) {
			var oneBtn = makeOneBtn(oneSize, randomColor());
			btnList.push(oneBtn);
			$(main).append(oneBtn);
		}

	} else {//还有多的就删除掉
		shouldAddCount = -shouldAddCount;
		for (var i = 0; i < shouldAddCount; i++) {
			var one = btnList.pop();
			$(one).remove();
		}
	}

	//重新所有按钮的大小
	$(btnList).each(function () {
		$(this).css('height', oneSize - 2);
		$(this).css('width', oneSize - 2);
	});

	//计数清0
	for (var i = 0; i < colorLib.length; i++) {
		colorLib[i].count = 0;
	}
	//对所有的按钮重新设置颜色
	$(btnList).each(function () {
		var backgroundColor = randomColor();
		$(this).css('backgroundColor', backgroundColor);
		$(this).data('color', backgroundColor);
	});

}

/**
 * 倒计时
 */
function timer() {
	nowReTime--;
	//更新到html
	$(nowTimeCon).html(nowReTime);

	//时间到,游戏结束
	if (nowReTime <= 0) {
		gameOver();
		return;
	}
	setTimeout(timer, 1000);
}

/**
 * 游戏结束时调用
 */
function gameOver() {
	isGameOver = true;
	$('#timer').removeClass('error');
	var score = nowSize - 2;
	var say = '你凭直觉闯过了' + score + '关';
	shareTitle = '我凭直觉闯过了' + score + '关! 来挑战你的直觉.';
	var gameOver = $('#gameOver');
	$(gameOver).find('.say').first().text(say);
	$(gameOver).slideDown();
}

/**
 * 开始游戏
 */
function startGame() {
	isGameOver = false;
	nowReTime = initReTime;
	nowSize = initSize;
	$('#beforeGame').slideUp();
	$('#gameOver').slideUp();
	$('#timer').addClass('error');
	randomMain(initSize);
	timer();
}


////////////////微信接口/////////////////
var imgUrl = 'http://gwuhaolin.github.io/Game-5/duoduo/duoduo.png';
var lineLink = 'http://gwuhaolin.github.io/Game-5/duoduo/index.html';
var descContent = "挑战你的直觉,找出颜色最大的方块";
var shareTitle = '挑战你的直觉,找出颜色最大的方块';
var appid = 'wx5c6c73bc34fc424e';

function shareFriend() {
	WeixinJSBridge.invoke('sendAppMessage', {
		"appid": appid,
		"img_url": imgUrl,
		"img_width": "200",
		"img_height": "200",
		"link": lineLink,
		"desc": descContent,
		"title": shareTitle
	}, function (res) {
	})
}
function shareTimeline() {
	WeixinJSBridge.invoke('shareTimeline', {
		"img_url": imgUrl,
		"img_width": "200",
		"img_height": "200",
		"link": lineLink,
		"desc": descContent,
		"title": shareTitle
	}, function (res) {
	});
}
function shareWeibo() {
	WeixinJSBridge.invoke('shareWeibo', {
		"content": descContent,
		"url": lineLink
	}, function (res) {
	});
}
// 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
	// 发送给好友
	WeixinJSBridge.on('menu:share:appmessage', function (argv) {
		shareFriend();
	});
	// 分享到朋友圈
	WeixinJSBridge.on('menu:share:timeline', function (argv) {
		shareTimeline();
	});
	// 分享到微博
	WeixinJSBridge.on('menu:share:weibo', function (argv) {
		shareWeibo();
	});
}, false);