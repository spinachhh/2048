var board = new Array();
var score = 0;
var hasConflicted = new Array();

//移动端触控位置坐标变量
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
	prepareMobile();
	newGame();
});

function prepareMobile(){

	if(documentWidth>500){
		gridContainerWidth = 500;
		cellSideLength = 100;
		cellSpace = 20;
	}

	$('#header').css('width',gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('padding',cellSpace);

	$('.grid-cell').css('width',cellSideLength);
	$('.grid-cell').css('height',cellSideLength);
}

function newGame(){
	//初始化
	init();
	//随机在两个格子生成数字
	generateNumber();
	generateNumber();
}

function init(){
	for( var i=0 ; i<4 ; i++)
		for(var j=0 ; j<4 ; j++){

			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css('top', getPosTop(i,j));
			gridCell.css('left', getPosLeft(i,j)); 
		}

	for( var i=0 ; i<4 ; i++){
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for(var j=0 ; j<4 ; j++)
			board[i][j] = 0;
		    hasConflicted[i][j] = false;
	}

	updateBoardView();
	score = 0;
}

function updateBoardView(){

	$(".number-cell").remove();
	for( var i=0 ; i<4 ; i++)
		for(var j=0 ; j<4 ; j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell = $('#number-cell-'+i+'-'+j);

			if( board[i][j] == 0){
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
				theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
			}
			else{
				theNumberCell.css('width',cellSideLength);
				theNumberCell.css('height',cellSideLength);
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}

			hasConflicted[i][j] = false;
		}

	$('.number-cell').css('line-height',cellSideLength + 'px');
	$('.number-cell').css('font-size',0.6*cellSideLength + 'px');
}

function generateNumber(){

	 if(nospace(board))
	 	return false;

	 //随机位置
	 var randx = parseInt(Math.floor(Math.random()*4));
	 var randy = parseInt(Math.floor(Math.random()*4));
	 while(true){
	 	if(board[randx][randy] == 0)
	 		break;

	 	randx = parseInt(Math.floor(Math.random()*4));
	 	randy = parseInt(Math.floor(Math.random()*4));
	 }
	 //随机数字
	 var randNumber = Math.random() < 0.5 ? 2 : 4;

	 //随机位置显示随机数
	 board[randx][randy] = randNumber;
	 showNumberWithAnimation(randx,randy,randNumber);

	 return true;
}

$(document).keydown(function(event){
	event.preventDefault(); //禁止浏览器滚动条滚动
	switch(event.keyCode){
		case 37: //left
			if(moveLeft()){
				setTimeout("generateNumber()",200);
				setTimeout("isgameover()",300);
			}
			break;  
		case 38: //up
			if(moveUp()){
				setTimeout("generateNumber()",200);
				setTimeout("isgameover()",300);
			}
			break;  
		case 39: //right
			if(moveRight()){
				setTimeout("generateNumber()",200);
				setTimeout("isgameover()",300);
			}
			break;  
		case 40: //down
			if(moveDown()){
				setTimeout("generateNumber()",200);
				setTimeout("isgameover()",300);
			}
			break;  
		default: break;
	}
});

//监听触控
document.addEventListener('touchstart',function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});
document.addEventListener('touchmove',function(event){
	event.preventDefault();
});
document.addEventListener('touchend',function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var deltax = endx - startx;
	var deltay = endy - starty;

	if(Math.abs(deltax)<0.3*documentWidth && Math.abs(deltay)<0.3*documentWidth)
		return;

	//x
	if(Math.abs( deltax ) >= Math.abs( deltay )){
		if(deltax>0){
			//move right
			if(moveRight()){
				setTimeout("generateNumber()",200);
				setTimeout("isgameover()",300);
			}
		}else{
			//move left
			if(moveLeft()){
				setTimeout("generateNumber()",200);
				setTimeout("isgameover()",300);
			}
		}
	}else{  //y
		if(deltay>0){
			//move down
			if(moveDown()){
				setTimeout("generateNumber()",200);
				setTimeout("isgameover()",300);
			}
		}else{
			//move up
			if(moveUp()){
				setTimeout("generateNumber()",200);
				setTimeout("isgameover()",300);
			}
		}

	}
});

function isgameover(){
	if( nospace(board) && nomove(board)){
		gameover();
	}
}

function gameover(){
	alert('Game Over!');
	updateHscore(score);
}

function moveLeft(){

	if(!canMoveLeft(board))
		return false;

	//moveleft 
	for(var i=0 ; i<4 ; i++)
		for(var j=1 ; j<4 ; j++)
			if (board[i][j] != 0){

				for(var k=0 ; k<j ; k++){
					if( board[i][k] == 0 && noBlockH(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if( board[i][k] == board[i][j] && noBlockH(i,k,j,board) && hasConflicted[i][k] == false){
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
	setTimeout("updateBoardView()",400);
	return true;
}

function moveUp(){

	if(!canMoveUp(board))
		return false;

	//moveup
	for(var i=1 ; i<4 ; i++)
		for(var j=0 ; j<4 ; j++)
			if(board[i][j] != 0){
	
					for(var k=0 ; k<i ; k++){
						if( board[k][j] == 0 && noBlockV(k,i,j,board)){
							//move
							showMoveAnimation(i,j,k,j);
							board[k][j] = board[i][j];
							board[i][j] = 0;
							continue;
						}
						else if( board[k][j] == board[i][j] && noBlockV(k,i,j,board) && hasConflicted[k][j] == false){
							//move
							showMoveAnimation(i,j,k,j);
							board[k][j] += board[i][j];
							board[i][j] = 0;
							//add score
						    score += board[k][j];
						    updateScore(score);
						    hasConflicted[k][j] = true;
							continue;
						}
					}
			}
	setTimeout("updateBoardView()",400);
	return true;
}

function moveRight(){
	if(!canMoveRight(board))
		return false;

	//moveright
	for(var i=0 ; i<4 ; i++)
		for(var j=2 ; j>=0 ; j--)
			if(board[i][j] != 0){
	
					for(var k=3 ; k>j ; k--){
						if( board[i][k] == 0 && noBlockH(i,j,k,board)){
							//move
							showMoveAnimation(i,j,i,k);
							board[i][k] = board[i][j];
							board[i][j] = 0;
							continue;
						}
						else if( board[i][k] == board[i][j] && noBlockH(i,j,k,board) && hasConflicted[i][k] == false){
							//move
							showMoveAnimation(i,j,i,k);
							board[i][k] += board[i][j];
							board[i][j] = 0;
							//add score
							score += board[i][k];
							updateScore(score);
							hasConflicted[i][k] = true;
							continue;
						}
					}
			}
	setTimeout("updateBoardView()",400);
	return true;
}

function moveDown(){
	if(!canMoveDown(board))
		return false;

	//movedown
	for(var i=2 ; i>=0 ; i--)
		for(var j=0 ; j<4 ; j++)
			if(board[i][j] != 0){
	
					for(var k=3 ; k>i ; k--){
						if( board[k][j] == 0 && noBlockV(i,k,j,board)){
							//move
							showMoveAnimation(i,j,k,j);
							board[k][j] = board[i][j];
							board[i][j] = 0;
							continue;
						}
						else if( board[k][j] == board[i][j] && noBlockV(i,k,j,board) && hasConflicted[k][j] == false){
							//move
							showMoveAnimation(i,j,k,j);
							board[k][j] += board[i][j];
							board[i][j] = 0;
							//add score
							score += board[k][j];
							updateScore(score);
							hasConflicted[k][j] = true;
							continue;
						}
					}
			}
	setTimeout("updateBoardView()",400);
	return true;
}
