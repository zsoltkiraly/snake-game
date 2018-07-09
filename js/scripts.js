'use scrict';
/*
Snake - Code by Zsolt Király
v1.0.2 - 2018-07-07
*/

let snakeSection = document.querySelector('#snake');
let rowAndColumn = 20;
let pixelWidthAndHeight = 32;
let borderWidth = 15;

let game;
let snake = [];


/*
Snake default position
*/
snake[0] = {
    x : rowAndColumn / 2,
    y : rowAndColumn / 2
};



/*
Load audio file
*/

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

/*
Speed
*/
let speed = 100;


/*
Score
*/
let score = 0;


/*
Pause
*/
let isPaused = false;


/*
Time
*/
let time = 0;
let timer;
let timerElement = document.querySelector('#game-info .time span');

/*
Direction
*/
let d;
let directionChange = true;


/*
Audio
*/
let audio = document.querySelector('#snake-music');
let audioControl = document.querySelector('#audio-control');


/*
Start & restart & pause
*/
let start = true;
let restart = false;
let pause = false;

/*
Game area
*/
function gameArea(sS, rAC) {
    sS.setAttribute('style', 'border-width: ' + borderWidth + 'px; width: ' + (pixelWidthAndHeight * rowAndColumn + borderWidth * 2) +'px;')
    
    for(let i = 0; i < rAC; i++) {
        let row = '<div style="height:' + pixelWidthAndHeight + 'px;" class="row" data-y="' + (i + 1) + '">';

        let j = 0;
        for(let j = 0; j < rAC; j++) {
            row += '<div style="height:' + pixelWidthAndHeight + 'px; width:' + pixelWidthAndHeight + 'px;" class="pixel" data-x="' + (j + 1) + '"></div>';
        }
        row +='</div>';

        sS.innerHTML += row;
    }

    let pixel = sS.querySelectorAll('.pixel');

    if(pixel.length > 0) {
        for(let p = 0; p < pixel.length; p++) {
            pixel[p].setAttribute('data-id', p + 1);
        }
    }
}


/*
Food
*/
function apple(sS) {
    let pixel = sS.querySelectorAll('.pixel:not(.snake)');

    let appleCoordinate = [];

    if(pixel.length >0) {
        for(let i = 0; i < pixel.length; i++) {
            appleCoordinate.push(parseFloat(pixel[i].getAttribute('data-id')));
        }

        let randomNumber = appleCoordinate[Math.floor(Math.random() * appleCoordinate.length)];

        if(sS.querySelectorAll('.apple').length > 0) {
            sS.querySelector('.apple').classList.remove('apple', 'cherry');

        } else {
            for(let p = 0; p < pixel.length; p++) {
                if(parseFloat(pixel[p].getAttribute('data-id')) == randomNumber) {
                    var randomBoolean = Math.random() >= .5;

                    if(randomBoolean) {
                        pixel[p].classList.add('apple');
                    } else {
                        pixel[p].classList.add('apple', 'cherry');
                    }
                }
            }
        }
    }
}


/*
Key down
*/
document.addEventListener('keydown', function(e) {
    switch(e.keyCode) {
        case 13: if(start) {            
            startGame();
            start = false;
        }
        break;

        case 32: if(!start) {          
            pause = !pause;

            if(pause) {
                isPaused = true;

            } else {
                isPaused = false;
            }
        }
        break;

        case 37: if (d !== 'right' && directionChange) {
            d = 'left';
            left.play();
            directionChange  = false;
        }
        break;

        case 38: if (d !== 'down' && directionChange) {
            d = 'up';
            up.play();
            directionChange  = false;
        }
        break;

        case 39: if (d !== 'left' && directionChange) {
            d = 'right';
            right.play();
            directionChange  = false;
        }
        break;

        case 40: if (d !== 'up' && directionChange) {
            d = 'down';
            down.play();
            directionChange  = false;
        }
        break;
    }
}, false);


/*
Collision
*/
function selfCollision(head, array){
    if(array.length > 3) {
        for(let i = 0; i < array.length; i++) {
            if(head.x == array[i].x && head.y == array[i].y) {
                return true;
            }
        }
    }
    return false;
}


/*
Draw
*/

let drawSnake = true;

function draw(sS, rAC) {
    /*
    Restart set default
    */
    if(restart) {
        sS.classList.remove('restart');


        /*
        Remove snake
        */
        while(snake.length > 0) {
            snake.pop();
        }

        snake[0] = {
            x : rowAndColumn / 2,
            y : rowAndColumn / 2
        };

        score = 0;
        time = 0;
        apple(sS);

        drawSnake = true;
    }


    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    let oldHeadX = snakeX;
    let oldHeadY = snakeY;

    if(d == 'left') {
        snakeX -= 1;

    } else if(d == 'up'){
        snakeY -= 1 ;

    } else if(d == 'right') {
        snakeX += 1;

    } else if(d == 'down') {
        snakeY += 1;
    }

    let newHead = {
        x : snakeX,
        y : snakeY
    }


    /*
    Dead
    */
    if(snakeX < 1 || snakeX > rowAndColumn || snakeY < 1 || snakeY > rowAndColumn || selfCollision(newHead,snake)){
        dead.play();

        clearInterval(game);
        clearInterval(timer);

        start = true;
        restart = true;

        audio.load();

        sS.classList.add('restart');

        drawSnake = false;
    }

    /*
    Set array
    */
    snake.unshift(newHead);


    if(drawSnake ) {
        /*
        Draw snake
        */
        let allSnake = sS.querySelectorAll('.snake');

        if(allSnake.length > 0) {
            for( let j = 0; j < allSnake.length; j++){
                allSnake[j].classList.remove('snake');
            }
        }


        if(snake.length > 0) {
            for( let i = 0; i < snake.length ; i++){
                let snakeDraw = sS.querySelectorAll('.row')[snake[i].y - 1].querySelectorAll('.pixel')[snake[i].x - 1];

                if(snakeDraw) {
                    snakeDraw.classList.add('snake');
                }
            }
        }


        /*
        Remove all snake head and set new snake head
        */
        let pixel = sS.querySelectorAll('.pixel');

        if(pixel.length > 0) {
            for( let p = 0; p < pixel.length; p++){
                pixel[p].classList.remove('snake-head', 'left', 'right', 'up', 'down');
            }
        }


        /*
        Default start direction
        */
        if(d == undefined){
            d = 'up';
        }
        
        let snakeHead = sS.querySelectorAll('.row')[newHead.y - 1].querySelectorAll('.pixel')[newHead.x - 1];

        if(snakeHead) {
            snakeHead.classList.add('snake-head', d);
        }


        /*
        Eat food
        */
        if(sS.querySelector('.snake-head').classList.contains('apple')) {
            if(sS.querySelector('.snake-head').classList.contains('cherry')) {
                score += 1;

            } else {
                score += 2;
            }

            eat.play();

            let appleRemove = sS.querySelector('.apple');

            if(appleRemove) {
                appleRemove.classList.remove('apple', 'cherry');
            }

            apple(sS);
        }else {
            snake.pop();
        }

        restart = false;

    }

    /*
    Change direction
    */
    directionChange = true;


    /*
    Score
    */
    document.querySelector('#game-info .score span').innerHTML = String(score).padStart(3,0);
}

/*
Audio
*/

function music() {
    if(audioControl && audio) {
        audio.autoplay = true;
        audio.loop = true;
        audio.load();

        let volumeUp = audioControl.querySelector('.volume-up');
        let volumeDown = audioControl.querySelector('.volume-down');
        let playAndPause = audioControl.querySelector('.play-and-pause');

        playAndPause.addEventListener('click', function() {
            if(playAndPause.classList.contains('pause')) {
                audio.play();

                playAndPause.classList.remove('pause');
                playAndPause.querySelector('img').setAttribute('src', 'images/music_pause.png');

            } else {
                audio.pause();

                playAndPause.classList.add('pause');
                playAndPause.querySelector('img').setAttribute('src', 'images/music_play.png');
            }
        }, false);

        audio.volume = .5;
    }
}

function volume() {
    if(audioControl && audio) {
        let volumeUp = audioControl.querySelector('.volume-up');
        let volumeDown = audioControl.querySelector('.volume-down');

        volumeDown.addEventListener('click', function() {
            if(audio.volume > 0.001) {
                audio.volume /= 2;
            }
        }, false);

        volumeUp.addEventListener('click', function() {
            if(audio.volume < 1) {
                audio.volume *= 2;
            }
        }, false);
    }
}

if (window.matchMedia('only screen and (min-width:1600px)').matches) {
    music();
    volume();

    gameArea(snakeSection, rowAndColumn);
    draw(snakeSection, rowAndColumn)

    let startBody = snakeSection.querySelectorAll('.row')[rowAndColumn / 2].querySelectorAll('.pixel')[rowAndColumn / 2 - 1];
    startBody.classList.add('snake');
}

function startGame() {
    if (window.matchMedia('only screen and (min-width:1600px)').matches) {
        if(start){

            apple(snakeSection);

            game = setInterval(function() {
                if(!isPaused) {
                    draw(snakeSection, rowAndColumn);
                }
            }, speed)

            snakeSection.classList.remove('start-screen');
            timerElement.innerHTML = '000';

            timer = setInterval(function() {
                if(!isPaused) {
                    time++
                    timerElement.innerHTML = String(time).padStart(3,0);
                }
            }, 1000)
        }
    }
}