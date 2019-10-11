documentWidth = window.screen.availWidth;
gridContainerWidth = 0.92*documentWidth;
cellSideLength = 0.18*documentWidth;
cellSpace = 0.04*documentWidth;

function getPosTop(i,j){
	return cellSpace+i*(cellSideLength+cellSpace);
}

function getPosLeft(i,j){
	return cellSpace+j*(cellSideLength+cellSpace);
}

function getNumberBackgroundColor(number){
	switch(number){
		case 2:return "#EEC900";break;
		case 4:return "#EE8262";break;
		case 8:return "#EE6363";break;
		case 16:return "#EE0000";break;
		case 32:return "#009ACD";break;
		case 64:return "#008B8B";break;
		case 128:return "#008B00";break;
		case 256:return "#7A67EE";break;
		case 512:return "#787878";break;
		case 1024:return "#8B1A1A";break;
		case 2048:return "#030303";break;
		case 4096:return "#EEE8CD";break;
		case 8192:return "#EEE0E5";break;
	}
	return "#EE00EE";
}

function getNumberColor(number){
	if (number<5)
		return "black";
	return "white";
}

function nospace(board){
	for( var i=0 ; i<4 ; i++)
		for(var j=0 ; j<4 ; j++)
			if(board[i][j]==0)
				return false;
	return true;

}

function nomove(board){
	if( canMoveLeft(board) ||
		canMoveUp(board) ||
		canMoveRight(board) ||
		canMoveDown(board)
	)
		return false;
	return true;
}

function canMoveLeft(board){
	for( var i=0 ; i<4 ; i++)
		for(var j=1 ; j<4 ; j++)
			if(board[i][j] != 0)
				if(board[i][j-1] == 0 || board[i][j-1] == board[i][j])
					return true;
	return false;
}

function canMoveUp(board){
	for( var i=1 ; i<4 ; i++)
		for(var j=0 ; j<4 ; j++)
			if(board[i][j] != 0)
				if(board[i-1][j] == 0 || board[i-1][j] == board[i][j])
					return true;
	return false;
}

function canMoveRight(board){
	for( var i=0 ; i<4 ; i++)
		for(var j=2 ; j>=0 ; j--)
			if(board[i][j] != 0)
				if(board[i][j+1] == 0 || board[i][j+1] == board[i][j])
					return true;
	return false;
}

function canMoveDown(board){
	for( var i=2 ; i>=0 ; i--)
		for(var j=0 ; j<4 ; j++)
			if(board[i][j] != 0)
				if(board[i+1][j] == 0 || board[i+1][j] == board[i][j])
					return true;
	return false;
}

function noBlockH( row, col1, col2, board){
	for( var i=col1 + 1; i<col2; i++)
		if(board[row][i] != 0)
			return false;
	return true;
}

function noBlockV( row1, row2, col, board){
	for( var i=row1 + 1; i<row2; i++)
		if(board[i][col] != 0)
			return false;
	return true;
}

