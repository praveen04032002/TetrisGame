// document.addEventListener('DOMContentLoaded',() => {
    
    const grid = document.querySelector('.grid');

    for(let i=0;i<200;++i){
        var newDiv = document.createElement('div');
        grid.append(newDiv);
    }

    for(let i=0;i<10;++i){
        var newDiv = document.createElement('div');
        newDiv.className = "taken";
        grid.append(newDiv);
    }

    let squares = Array.from(document.querySelectorAll('.grid div'));

    const startBtn = document.getElementById('startbtn');
    
    const scoreDisplay = document.getElementById('score');

    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;

    const colors = ['orange','red','purple','pink','blue'];

    // console.log(squares);

    const lTetromino = [
        [1,width+1,width*2+1,2],
        [width,width+1,width+2,width*2+2],
        [1,width+1,width*2+1,width*2],
        [width,width*2,width*2+1,width*2+2]
    ]

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1]
    ]

    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const theTetrominoes = [lTetromino,zTetromino ,tTetromino, oTetromino ,iTetromino ]

    // console.log(theTetrominoes)

    let currentPosition = 4;
    let currentRotation = 0;

    let random = Math.floor(Math.random()*theTetrominoes.length);

    let current = theTetrominoes[random][currentRotation];


    //Drawing the tetromino
    function draw(){
        current.forEach(index => {
            squares[currentPosition+index].classList.add('tetromino');
            squares[currentPosition+index].style.backgroundColor = colors[random];
        });
    }

    
    //undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition+index].style.backgroundColor = '';
        } );
    }

    //Move down the tetromino
    // timerId = setInterval(moveDown,400);

    //Assign function to keyCodes
    function control(e){
        if(e.keyCode === 37)  moveLeft();
        else if(e.keyCode === 38)  rotate();
        else if(e.keyCode === 39)  moveRight();
        else if(e.keyCode === 40)  moveDown();
    }
    if(timerId){
        document.addEventListener('keyup',control);
    }

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    //freeze
    function  freeze() {
        if(current.some(index => squares[currentPosition+index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            //start a new tetromino
            random = nextRandom;
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            current = theTetrominoes[random][currentRotation]; 
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    //Move tetromino to left end
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if(!isAtLeftEdge){
            currentPosition -= 1;
        }

        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            currentPosition +=1;
        }

        draw();
    }

    //Move tetromino to right end
    function moveRight() {
        undraw();

        const isAtRightEdge = current.some(index => (currentPosition+index)%width === width-1);

        if(!isAtRightEdge){  
            currentPosition += 1;
        }
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            currentPosition -=1;
        }

        draw();
    }

    //Rotate the Tetromino
    function rotate() {
        undraw();
        currentRotation++;
        if(currentRotation === current.length)
            currentRotation=0;
        current = theTetrominoes[random][currentRotation];
        draw();
    }


    //Adding div's in miniGrid
    const minigrid = document.querySelector('.miniGrid');
    for(let i=0;i<16;++i){
        var newDiv=document.createElement('div');
        minigrid.appendChild(newDiv);
    }

    //Up next block
    const displaySquares = document.querySelectorAll('.miniGrid div');
    const displayWidth = 4;
    let displayIndex = 0;

    const upNextTetrominoes = [
        [1, displayWidth+1,displayWidth*2+1,2], //l
        [0, displayWidth,displayWidth+1,displayWidth*2+1], //z
        [1, displayWidth,displayWidth+1,displayWidth+2], //t
        [0, 1,displayWidth,displayWidth+1], //o
        [1, displayWidth+1,displayWidth*2+1,displayWidth*3+1] //i
    ]

    //display the shape in miniGrid
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor="";
        });
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex+index].classList.add('tetromino');
            displaySquares[displayIndex+index].style.backgroundColor = colors[nextRandom];
        });
    }
    
    //Start/Pause btn
    startBtn.addEventListener('click',() => {
        if(timerId){
            clearInterval(timerId);
            timerId = null;
        }
        else{
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            displayShape();
        }
    });

    //Add score
    function addScore() {
        for(let i=0;i<199;i+=width){
            const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = "";
                });
                const squaresRemoved = squares.splice(i,width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    //GameOver
    function gameOver(){
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
        }
    }
    
// });



