(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var utils = require('./utils.js');
var consts = require('./consts.js');


var lineColor =  consts.GRID_LINE_COLOR;

var boxBorderColor = consts.BOX_BORDER_COLOR;


var drawLine = function(ctx,p1,p2,color){
	  	    ctx.beginPath();
			ctx.moveTo(p1.x,p1.y);
			ctx.lineTo(p2.x,p2.y);
			
			ctx.lineWidth=1;
			ctx.strokeStyle= color;
			
			ctx.stroke();
			ctx.closePath();
};



var drawGrids = function(el,gridSize,colCount,rowCount,color1,color2){

	  

	  var ctx = el.getContext('2d');
	  var width = el.width;
	  var height = el.height;

	  ctx.rect(0, 0, width, height);

      var grd = ctx.createLinearGradient(0, 0, 0, height);
      grd.addColorStop(0, color1);   
      grd.addColorStop(1, color2);
      ctx.fillStyle = grd;
      ctx.fill();
      

	  for (var i = 1; i < colCount; i++) {
	  		var x = gridSize*i+0.5;
			drawLine(ctx,{x:x,y:0},{x:x,y:height},lineColor);
	  };
	  for (var i = 1; i < rowCount; i++) {
			var y = gridSize*i+0.5;
			drawLine(ctx,{x:0,y:y},{x:width,y:y},lineColor);
	  };
};

var drawBox = function(ctx,color,x,y,gridSize){
			if (y<0){
				return;
			}

			ctx.beginPath();
			ctx.rect(x,y,gridSize,gridSize);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.strokeStyle= boxBorderColor;
			ctx.lineWidth=1;
			ctx.stroke();
			ctx.closePath();
}


var tetrisCanvas = {

	init:function(scene,preview){
		this.scene = scene;
		this.preview = preview;
		this.sceneContext = scene.getContext('2d');
		this.previewContext = preview.getContext('2d');
		this.gridSize = scene.width / consts.COLUMN_COUNT;

		this.previewGridSize = preview.width / consts.PREVIEW_COUNT;

		this.drawScene();
		
	},

	
	clearScene:function(){
		this.sceneContext.clearRect(0, 0, this.scene.width, this.scene.height);
	},
	
	clearPreview:function(){
		this.previewContext.clearRect(0,0,this.preview.width,this.preview.height);
	},

	drawScene:function(){
		this.clearScene();
		drawGrids(this.scene,this.gridSize,
			consts.COLUMN_COUNT,consts.ROW_COUNT,
			consts.SCENE_BG_START,consts.SCENE_BG_END);
	},
	
	drawMatrix:function(matrix){
		for(var i = 0;i<matrix.length;i++){
			var row = matrix[i];
			for(var j = 0;j<row.length;j++){
				if (row[j]!==0){
					drawBox(this.sceneContext,row[j],j*this.gridSize,i*this.gridSize,this.gridSize);
				}
			}
		}	
	},
	
	drawPreview:function(){
		drawGrids(this.preview,this.previewGridSize,
			consts.PREVIEW_COUNT,consts.PREVIEW_COUNT,
			consts.PREVIEW_BG,consts.PREVIEW_BG);
	},

	drawShape:function(shape){
		if (!shape){
			return;
		}
		var matrix = shape.matrix();
		var gsize = this.gridSize;
		for(var i = 0;i<matrix.length;i++){
			for(var j = 0;j<matrix[i].length;j++){
				var value = matrix[i][j];
				if (value === 1){
					var x = gsize *(shape.x + j);
					var y = gsize *(shape.y + i);
					drawBox(this.sceneContext,shape.color,x,y,gsize);
				}
			}
		}
	},
	
	drawPreviewShape:function(shape){
		if (!shape){
			return;
		}
		this.clearPreview();
		var matrix = shape.matrix();
		var gsize = this.previewGridSize;
		var startX = (this.preview.width - gsize*shape.getColumnCount()) / 2;
		var startY = (this.preview.height - gsize*shape.getRowCount()) / 2;
		for(var i = 0;i<matrix.length;i++){
			for(var j = 0;j<matrix[i].length;j++){
				var value = matrix[i][j];
				if (value === 1){
					var x = startX + gsize * j;
					var y = startY + gsize * i;
					drawBox(this.previewContext,shape.color,x,y,gsize);
				}
			}
		}
	}

};



module.exports = tetrisCanvas;
},{"./consts.js":2,"./utils.js":5}],2:[function(require,module,exports){


var colors = ['#00af9d','#ffb652','#cd66cc','#66bc29','#0096db','#3a7dda','#ffe100'];


var sideWidth = 120;



var columnCount = 10;


var rowCount = 20;


var previewCount = 6;


var sceneBgStart = '#8e9ba6';


var sceneBgEnd = '#5c6975';


var previewBg = '#2f2f2f';


var gridLineColor = 'rgba(255,255,255,0.2)';


var boxBorderColor = 'rgba(255,255,255,0.5)';



var defaultInterval = 600;



var levelInterval = 120 * 1000; 



var exports = module.exports = {};

exports.COLORS =  colors;

exports.SIDE_WIDTH = sideWidth;

exports.ROW_COUNT = rowCount;

exports.COLUMN_COUNT = columnCount;

exports.SCENE_BG_START = sceneBgStart;

exports.SCENE_BG_END = sceneBgEnd;

exports.PREVIEW_BG = previewBg;

exports.PREVIEW_COUNT = previewCount;

exports.GRID_LINE_COLOR = gridLineColor;

exports.BOX_BORDER_COLOR = boxBorderColor;

exports.DEFAULT_INTERVAL = defaultInterval;

exports.LEVEL_INTERVAL = levelInterval;

},{}],3:[function(require,module,exports){
var utils = require('./utils.js');
var consts = require('./consts.js');
var shapes = require('./shapes.js');
var views = require('./views.js');
var canvas = require('./canvas.js');





var initMatrix = function(rowCount,columnCount){
	var result = [];
	for (var i = 0; i<rowCount;i++){
		var row = [];
		result.push(row);
		for(var j = 0;j<columnCount;j++){
			row.push(0);
		}
	}

	return result;
};


var clearMatrix = function(matrix){
	for(var i = 0;i<matrix.length;i++){
		for(var j = 0;j<matrix[i].length;j++){
			matrix[i][j] = 0;
		}
	}
};



var checkFullRows = function(matrix){
	var rowNumbers = [];
  	for(var i = 0;i<matrix.length;i++){
  		var row = matrix[i];
  		var full = true;
  		for(var j = 0;j<row.length;j++){
  			full = full&&row[j]!==0;
  		}
  		if (full){
  			rowNumbers.push(i);
  		}
  	}

  	return rowNumbers;	
};


var removeOneRow = function(matrix,row){
	var colCount = matrix[0].length;
	for(var i = row;i>=0;i--){
		for(var j = 0;j<colCount;j++){
			if (i>0){
				matrix[i][j] = matrix[i-1][j];
			}else{
				matrix[i][j] = 0 ;
			}	
		}
	}	
};

var removeRows = function(matrix,rows){
	for(var i in rows){
		removeOneRow(matrix,rows[i]);
	}
};


var checkGameOver = function(matrix){
	var firstRow = matrix[0];
	for(var i = 0;i<firstRow.length;i++){
		if (firstRow[i]!==0){
			return true;
		};
	}
	return false;
};



var calcRewards = function(rows){
	if (rows&&rows.length>1){
		return Math.pow(2,rows.length - 1)*100;	
	}
	return 0;
};


var calcScore = function(rows){
	if (rows&&rows.length){
		return rows.length*100;
	}
	return 0;
};


var calcIntervalByLevel = function(level){
	return consts.DEFAULT_INTERVAL  - (level-1)*60;
};



var defaults = {
	maxHeight:700,
	maxWidth:600
};


function Tetris(id){
	this.id = id;
	this.init();
}

Tetris.prototype = {

	init:function(options){
		
		var cfg = this.config = utils.extend(options,defaults);
		this.interval = consts.DEFAULT_INTERVAL;
		
		
		views.init(this.id, cfg.maxWidth,cfg.maxHeight);

		canvas.init(views.scene,views.preview);

		this.matrix = initMatrix(consts.ROW_COUNT,consts.COLUMN_COUNT);
		this.reset();

		this._initEvents();
		this._fireShape();


	},
	
	reset:function(){
		this.running = false;
		this.isGameOver = false;
		this.level = 1;
		this.score = 0;
		this.startTime = new Date().getTime();
		this.currentTime = this.startTime;
		this.prevTime = this.startTime;
		this.levelTime = this.startTime;
		clearMatrix(this.matrix);
		views.setLevel(this.level);
		views.setScore(this.score);
		views.setGameOver(this.isGameOver);
		this._draw();
	},
	
	start:function(){
		this.running = true;
		window.requestAnimationFrame(utils.proxy(this._refresh,this));
	},
	
	pause:function(){
		this.running = false;
		this.currentTime = new Date().getTime();
		this.prevTime = this.currentTime;
	},
	
	gamveOver:function(){

	},
	
	_keydownHandler:function(e){
		
		var matrix = this.matrix;

		if(!e) { 
			var e = window.event;
		}
		if (this.isGameOver||!this.shape){
			return;
		}

		switch(e.keyCode){
			case 37:{this.shape.goLeft(matrix);this._draw();}
			break;
			
			case 39:{this.shape.goRight(matrix);this._draw();}
			break;
			
			case 38:{this.shape.rotate(matrix);this._draw();}
			break;

			case 40:{this.shape.goDown(matrix);this._draw();}
			break;

			case 32:{this.shape.goBottom(matrix);this._update();}
			break;
		}
	},
	
	_restartHandler:function(){
		this.reset();
		this.start();
	},
	
	_initEvents:function(){
		window.addEventListener('keydown',utils.proxy(this._keydownHandler,this),false);
		views.btnRestart.addEventListener('click',utils.proxy(this._restartHandler,this),false);
	},

	
	_fireShape:function(){
		this.shape = this.preparedShape||shapes.randomShape();
		this.preparedShape = shapes.randomShape();
		this._draw();
		canvas.drawPreviewShape(this.preparedShape);
	},
	
	
	_draw:function(){
		canvas.drawScene(); 
		canvas.drawShape(this.shape);
		canvas.drawMatrix(this.matrix);
	},
	
	_refresh:function(){
		if (!this.running){
			return;
		}
		this.currentTime = new Date().getTime();
		if (this.currentTime - this.prevTime > this.interval ){
			this._update();
			this.prevTime = this.currentTime;
			this._checkLevel();
		}
		if (!this.isGameOver){
			window.requestAnimationFrame(utils.proxy(this._refresh,this));	
		}
	},
	
	_update:function(){
		if (this.shape.canDown(this.matrix)){
			this.shape.goDown(this.matrix);
		}else{
			this.shape.copyTo(this.matrix);
			this._check();
			this._fireShape();
		}
		this._draw();
		this.isGameOver = checkGameOver(this.matrix);
		views.setGameOver(this.isGameOver);
		if (this.isGameOver){
			views.setFinalScore(this.score);
		}
	},
	
	_check:function(){
		var rows = checkFullRows(this.matrix);
		if (rows.length){
			removeRows(this.matrix,rows);
			
			var score = calcScore(rows);
			var reward = calcRewards(rows);
			this.score += score + reward;

			views.setScore(this.score);
			views.setReward(reward);

		}
	},
	
	_checkLevel:function(){
		var currentTime = new Date().getTime();
		if (currentTime - this.levelTime > consts.LEVEL_INTERVAL){
			this.level+=1;
			this.interval = calcIntervalByLevel(this.level);
			views.setLevel(this.level);
			this.levelTime = currentTime;
		}
	}
}


window.Tetris = Tetris;






},{"./canvas.js":1,"./consts.js":2,"./shapes.js":4,"./utils.js":5,"./views.js":6}],4:[function(require,module,exports){
var consts = require('./consts.js');
var COLORS =  consts.COLORS;
var COLUMN_COUNT = consts.COLUMN_COUNT;



function ShapeL(){
	var state1 = [  [1, 0],
					[1, 0],
					[1, 1] ];

	var state2 = [  [0, 0, 1],
					[1, 1, 1] ];

	var state3 = [  [1, 1],
					[0, 1],
					[0, 1] ];

	var state4 = [  [1, 1, 1],
					[1, 0, 0] ];


	this.states = [ state1, state2, state3, state4 ];
	this.x = 4;
	this.y = -3;
	this.flag = 'L';
}

function ShapeLR()
{
	var state1 = [  [0, 1],
					[0, 1],
					[1, 1] ];

	var state2 = [  [1, 1, 1],
					[0, 0, 1] ];

	var state3 = [  [1, 1],
					[1, 0],
					[1, 0] ];

	var state4 = [  [1, 0, 0],
					[1, 1, 1] ];


	this.states = [ state1, state2, state3, state4 ];
	this.x = 4;
	this.y = -3;
	this.flag = 'LR';
}

function ShapeO()
{

	var state1 = [  [1, 1],
					[1, 1] ];


	this.states = [ state1 ];
	this.x = 4;
	this.y = -2;
	this.flag = 'O';
}

function ShapeI()
{
	var state1 = [  [1],
					[1],
					[1],
					[1] ];

	var state2 = [  [1,1,1,1] ];

	this.states = [ state1, state2 ];

	this.x = 5;
	this.y = -4;
	this.flag = 'I';
}

function ShapeT()
{
	var state1 = [  [1, 1, 1],
					[0, 1, 0] ];

	var state2 = [  [1, 0],
					[1, 1],
					[1, 0] ];

	var state3 = [  [0, 1, 0],
					[1, 1, 1] ];

	var state4 = [  [0, 1],
					[1, 1],
					[0, 1] ];

	this.states = [ state1, state2, state3, state4 ];
	this.x = 4;
	this.y = -2;
	this.flag = 'T';
}

function ShapeZ()
{
	var state1 = [  [1, 1, 0],
					[0, 1, 1] ];

	var state2 = [  [0, 1],
					[1, 1],
					[1, 0] ];

	this.states = [ state1, state2 ];
	this.x = 4;
	this.y = -2;
	this.flag = 'Z';
}

function ShapeZR()
{
	var state1 = [  [0, 1, 1],
					[1, 1, 0] ];

	var state2 = [  [1, 0],
					[1, 1],
					[0, 1] ];

	this.states = [ state1, state2 ];
	this.x = 4;
	this.y = -2;
	this.flag = 'ZR';
}

/**
Las formas se pueden mover
@param shape: tetris formas
@param matrix: game matrix
@param action:  'izquierda','derecha','abajo','rotar'
*/
var isShapeCanMove = function(shape,matrix,action){
	var rows = matrix.length;
	var cols = matrix[0].length;

	var isBoxCanMove = function(box){

		var x = shape.x + box.x;
		var y = shape.y + box.y;
		if (y<0){
			return true;
		}
		if (action === 'left'){
			x -= 1;
			return x>=0 && x<cols && matrix[y][x]==0;
		}else if (action === 'right'){
			x += 1;
			return x>=0 && x<cols && matrix[y][x]==0;
		}else if (action === 'down'){
			y += 1;
			return y<rows && matrix[y][x]==0;
		}else if (action === 'rotate'){
			return y<rows && !matrix[y][x];
		}
	};

	var boxes =  action === 'rotate'?shape.getBoxes(shape.nextState()) : shape.getBoxes(shape.state);

	for(var i in boxes){
		if (!isBoxCanMove(boxes[i])){
			return false;
		}
	}
	return true;
};


ShapeL.prototype =
ShapeLR.prototype =
ShapeO.prototype =
ShapeI.prototype =
ShapeT.prototype =
ShapeZ.prototype =
ShapeZR.prototype = {

	init:function(){
		this.color = COLORS[Math.floor(Math.random() * 7)];
		this.state = 0;
		this.allBoxes = {};
		this.y = 0;
	},
	
	getBoxes:function(state){

		var boxes = this.allBoxes[state]||[];
		if (boxes.length){
			return boxes;
		}

		var matrix = this.matrix(state);
		for(var i = 0; i<matrix.length;i++){
			var row = matrix[i];
			for(var j = 0; j<row.length;j++){
				if (row[j] === 1){
					boxes.push({x:j,y:i});
				}
			}
		}
		this.allBoxes[state] = boxes;
		return boxes;
	},
	
	matrix:function(state){
		var st = state!==undefined?state:this.state;
		return this.states[st];
	},
	
	rotate:function(matrix){
		if (isShapeCanMove(this,matrix,'rotate')){
			this.state = this.nextState();
			
			var right = this.getRight();
			if ( right >= COLUMN_COUNT){
				this.x -= right - COLUMN_COUNT + 1;
			}
		}
	},
	
	getColumnCount:function(){
		var mtx = this.matrix();
		var colCount = 0;
		for(var i=0;i<mtx.length;i++){
			colCount = Math.max(colCount,mtx[i].length);
		}
		return colCount;
	},
	
	getRowCount:function(){
		return this.matrix().length;
	},
	
	getRight:function(){
		var boxes = this.getBoxes(this.state);
		var right = 0;

		for	(var i in boxes){
			right = Math.max(boxes[i].x,right);
		}
		return this.x + right;
	},
	
	nextState:function(){
		return (this.state + 1) % this.states.length;
	},
	
	canDown:function(matrix){
		return isShapeCanMove(this,matrix,'down');
	},
	
	goDown:function(matrix){
		if (isShapeCanMove(this,matrix,'down')){
			this.y+=1;
		}
	},
	
	goBottom:function(matrix){
		while (isShapeCanMove(this,matrix,'down')){
			this.y+=1;
		}
	},
	
	goLeft:function(matrix){
		if (isShapeCanMove(this,matrix,'left')){
			this.x-=1;
		}
	},
	
	goRight:function(matrix){
		if (isShapeCanMove(this,matrix,'right')){
			this.x+=1;
		}
	},
	
	copyTo:function(matrix){
		var smatrix = this.matrix();
		for(var i = 0;i<smatrix.length;i++){
			var row = smatrix[i];
			for(var j = 0;j<row.length;j++){
				if (row[j] === 1){
					var x = this.x + j;
					var y = this.y + i;
					if (x>=0&&x<matrix[0].length&&y>=0&&y<matrix.length){
						matrix[y][x] = this.color;
					}
				}
			}
		}
	}
}


function randomShape()
{
	var result = Math.floor( Math.random() * 7 );
	var shape;

	switch(result)
	{
		case 0: shape = new ShapeL();			break;
		case 1: shape = new ShapeO();			break;
		case 2: shape = new ShapeZ();			break;
		case 3: shape = new ShapeT();			break;
		case 4: shape = new ShapeLR();			break;
		case 5: shape = new ShapeZR();			break;
		case 6: shape = new ShapeI();			break;
	}
	shape.init();
	return shape;
}

module.exports.randomShape = randomShape;

},{"./consts.js":2}],5:[function(require,module,exports){

var exports = module.exports = {};

var $ = function(id){
	return document.getElementById(id);
};

var _isPlainObject = function(obj) {

    if (typeof obj !== 'object') {
        return false;
    }


    if (obj.constructor &&
        !hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
        return false;
    }


    return true;
};

var extend = function() {
    var src, copyIsArray, copy, name, options, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = true;

    
    if (typeof target === 'boolean') {
        deep = target;
        
        target = arguments[i] || {};
        i++;
    }

    
    if (typeof target !== 'object' && typeof obj !== 'function') {
        target = {};
    }


    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {
        
        if ((options = arguments[i]) != null) {
            
            for (name in options) {
                src = target[name];
                copy = options[name];

                
                if (target === copy) {
                    continue;
                }
                
                if (deep && copy && (_isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];

                    } else {
                        clone = src && _isPlainObject(src) ? src : {};
                    }

                    

                    target[name] = extend(deep, clone, copy);

                    
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    
    return target;
};


var proxy = function(fn,context){
    var args = [].slice.call( arguments, 2 );
    proxy = function() {
            return fn.apply( context || this, args.concat( [].slice.call( arguments ) ) );
    };
    return proxy;
};

var aniFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = aniFrame;


exports.$ = $;
exports.extend = extend;
exports.proxy = proxy;

},{}],6:[function(require,module,exports){

var utils = require('./utils.js');
var consts = require('./consts.js');

var $ = utils.$;


var scene = $('scene');
var side = $('side');
var info = $('info');
var preview = $('preview');
var level = $('level');
var score = $('score');
var rewardInfo = $('rewardInfo');
var reward = $('reward');
var gameOver = $('gameOver');
var btnRestart = $('restart');
var finalScore = $('finalScore');



var SIDE_WIDTH = consts.SIDE_WIDTH;



var getContainerSize = function(maxW,maxH){

	var dw = document.documentElement.clientWidth;
	var dh = document.documentElement.clientHeight;

	var size = {};
	if (dw>dh){
		size.height = Math.min(maxH,dh);
		size.width = Math.min(size.height /2 + SIDE_WIDTH,maxW);
	}else{
		size.width = Math.min(maxW,dw);
		size.height =  Math.min(maxH,dh);
	}
	return size;

};



var layoutView = function(container,maxW,maxH){
	var size = getContainerSize(maxW,maxH);
	var st = container.style;
	st.height = size.height + 'px';
	st.width = size.width + 'px';
	st.marginTop = (-(size.height/2)) + 'px';
	st.marginLeft = (-(size.width/2)) + 'px';

	
	scene.height = size.height;
	scene.width = scene.height / 2;

	var sideW = size.width - scene.width;
	side.style.width = sideW+ 'px';
	if (sideW< SIDE_WIDTH ){
		info.style.width = side.style.width;
	}
	preview.width = 80;
	preview.height = 80;

	gameOver.style.width = scene.width +'px';

}


var tetrisView = {


	init:function(id, maxW,maxH){
	  this.container = $(id);
	  this.scene = scene;
	  this.preview = preview;
	  this.btnRestart = btnRestart;
	  layoutView(this.container,maxW,maxH);
	  this.scene.focus();

	  rewardInfo.addEventListener('animationEnd',function(e){
		 rewardInfo.className = 'invisible';
	  });
	},
	 
	setScore:function(scoreNumber){
		score.innerHTML = scoreNumber;	
	},
	
	setFinalScore:function(scoreNumber){
		finalScore.innerHTML = scoreNumber;
	},
	
	setLevel:function(levelNumber){
		level.innerHTML = levelNumber;
	},
	
	setReward:function(rewardScore){
		if (rewardScore>0){
			reward.innerHTML = rewardScore;
			rewardInfo.className = 'fadeOutUp animated';	
		}else{
			rewardInfo.className = 'invisible';
		}
	},
	
	setGameOver:function(isGameOver){
		gameOver.style.display = isGameOver?'block':'none';
	}
};

module.exports = tetrisView;
},{"./consts.js":2,"./utils.js":5}]},{},[3]);
