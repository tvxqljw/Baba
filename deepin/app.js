"use strict";

/**
 * 游戏显示尺寸
 * @type {{Width: number, Height: number}}
 */
var DisPlay = {
  Width: window.innerWidth,
  Height: window.innerHeight
};


/**
 * 显示所有色块
 */
var con = $('#con');

var Con_Size = {
  Width: DisPlay.Width,
  Height: DisPlay.Height - 60
};

$(con).height(Con_Size.Height);

/**
 * 色块方正的个数,和每个色块的长宽
 */
var ZenMapPar = {
  hang: 20,
  lie: 15
};

/**
 * 存储着颜色方正的值
 * @type {*[]}
 */
var ColorMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

/**
 * 存储着所有的小方块
 * @type {*[]}
 */
var ZenMap = [];
for (var i = 0; i < ZenMapPar.hang; i++) {
  ZenMap[i] = [];
  for (var j = 0; j < ZenMapPar.lie; j++) {
    ZenMap[i][j] = null;
  }
}

/**
 * 颜色映射表
 */
function ColorTable(int) {
  if (int == 0) {
    return 'red';
  } else if (int == 1) {
    return 'yellow';
  } else if (int == 2) {
    return 'blue';
  }
}

//一个小色块的模板
var ZenTmp = $('<div class="zen"></div>');
$(ZenTmp).width(Con_Size.Width / ZenMapPar.lie);
$(ZenTmp).height(Con_Size.Height / ZenMapPar.hang);

for (var i = 0; i < ZenMapPar.hang; i++) {
  for (var j = 0; j < ZenMapPar.lie; j++) {
    var zen = $(ZenTmp).clone();
    $(zen).css('backgroundColor', ColorTable(ColorMap[i][j]));
    $(zen).data('hang', i);
    $(zen).data('lie', j);
    $(zen).click(function () {
      falseLookMap();
      var hang = $(this).data('hang');
      var lie = $(this).data('lie');
      colorDeepin(hang, lie, ColorMap[hang][lie]);
    });
    ZenMap[i][j] = zen;
    $(con).append(zen);
  }
}

/**
 * 下面的工具条
 */
var tool = $('#tool');

/**
 * 目前选中的颜色
 */
var nowChooseColorInt;

/**
 * 选择颜色
 * @param int 颜色对应的int值
 */
function chooseColor(int) {
  nowChooseColorInt = int;
  var color = ColorTable(int);
  $(tool).css('borderColor', color);
}

var LookMap = [];
function falseLookMap() {
  for (var i = 0; i < ZenMapPar.hang; i++) {
    LookMap[i] = [];
    for (var j = 0; j < ZenMapPar.lie; j++) {
      LookMap[i][j] = false;
    }
  }
}
falseLookMap();

/**
 * 颜色清透
 * @param hang 现在的点的第几行
 * @param lie 现在的点的第几列
 * @param toColorInt
 */
function colorDeepin(hang, lie, toColorInt) {
  if (LookMap[hang][lie] || hang < 0 || hang >= ZenMapPar.hang || lie < 0 || lie >= ZenMapPar.lie) {//如果已经检查过这个就退出递归
    return;
  }
  LookMap[hang][lie] = true;
  var oldColorInt = ColorMap[hang][lie];
  if (oldColorInt == toColorInt) {//颜色一样
    $(ZenMap[hang][lie]).css('backgroundColor', ColorTable(nowChooseColorInt));
    $(ZenMap[hang][lie]).text(0);
    ColorMap[hang][lie] = toColorInt;
    console.log(hang + "," + lie);
  } else {
    return;
  }
  if (lie > 0) {
    colorDeepin(lie - 1, hang, oldColorInt);//向左
  }
  if (hang > 0) {
    colorDeepin(lie, hang - 1, oldColorInt);//向上
  }
  if (lie < ZenMapPar.lie) {
    colorDeepin(lie + 1, hang, oldColorInt);//向右
  }
  if (hang < ZenMapPar.hang) {
    colorDeepin(lie, hang + 1, oldColorInt);//向下
  }
}
