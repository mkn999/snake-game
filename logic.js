const config = {
  type: Phaser.AUTO,
  width: window.outerWidth,
  height: window.outerHeight,
  backgroundColor: '#000000',
  parent: 'game-container',
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

const game = new Phaser.Game(config);

let snake=[]; //snakes head+body
let positionHistory = [];
let direction = 'right'; //init direction
let moveTimer = 0;
let moveInterval = 100; 
let food;
let space = 1;
let foodcolor = 0xf9f5f5;
let bodycolor = 0xffd700;
let headcolor = 0xdb1020;
let swipeStartX = 0;
let swipeStartY = 0;
let width = window.outerWidth;
let height = window.outerHeight;
const gameOverText = "GAMEOVER"
let score = 0;

function preload(){

}

function create(){
    let head = this.add.circle(250,250,10,bodycolor);
    this.physics.add.existing(head);
    snake.push(head);
    console.log(snake[0]);
     this.input.keyboard.on('keydown', (event) => {
    if (event.key === "ArrowLeft" && direction !== 'right') direction = 'left';
    else if (event.key === "ArrowRight" && direction !== 'left') direction = 'right';
    else if (event.key === "ArrowUp" && direction !== 'down') direction = 'up';
    else if (event.key === "ArrowDown" && direction !== 'up') direction = 'down';
  });

  this.input.keyboard.on('keydown-X', () => {
    game.destroy(true); 
    document.getElementById("game-over-message").style.display = "block"; 
    for (let k = 0; k < gameOverText.length; k++) {
      setTimeout(() => {
      document.getElementById("game-over-message").innerText += gameOverText[k];
      }, k * 500); 
    } 
  });

  spawnFood(this);


  //swipe controls
  this.input.on('pointerdown', function (pointer) {
    swipeStartX = pointer.x;
    swipeStartY = pointer.y;
}, this);

this.input.on('pointerup', function (pointer) {
    const deltaX = pointer.x - swipeStartX;
    const deltaY = pointer.y - swipeStartY;

    // Check which axis had the bigger move
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0 && direction !== 'left') {
        direction = 'right';
    } else if (deltaX < 0 && direction !== 'right') {
        direction = 'left';
    }
    } else {
          if (deltaY > 0 && direction !== 'up') {
        direction = 'down';
    } else if (deltaY < 0 && direction !== 'down') {
        direction = 'up';
    }

    }
}, this);


}

function spawnFood(scene){
    if (food) food.destroy();

    let x = Phaser.Math.Snap.To(Phaser.Math.Between(0,width-50),20);
    let y = Phaser.Math.Snap.To(Phaser.Math.Between(0,height-50),20);
    
    food = scene.add.circle(x,y,8,foodcolor);
    scene.physics.add.existing(food);

    scene.physics.add.overlap(snake[0],food,()=>{
        food.destroy;
        spawnFood(scene);
        growSnake(scene);
        score++;
        document.getElementById("score").innerText = "Score: " + score;

        
    })
}

function growSnake(scene) {
  let newPart = scene.add.circle(-100, -100, 8, headcolor); // start offscreen
  scene.physics.add.existing(newPart);
  snake.push(newPart);

}



function update(time){
  if (time > moveTimer) {
    moveTimer = time + moveInterval;

    let head = snake[0];

    // Store the head's position *before* it moves in this frame
    positionHistory.unshift({ x: head.x, y: head.y });

    if (direction === 'left') head.x -= 20;
    else if (direction === 'right') head.x += 20;
    else if (direction === 'up') head.y -= 20;
    else if (direction === 'down') head.y += 20;

    const halfSize = head.radius || head.width / 2;

    if (head.x < 0 - halfSize) {
      head.x = width + halfSize;
    }
    else if (head.x > width + halfSize) {
      head.x = 0 - halfSize;
    }

    if (head.y < 0 - halfSize) {
      head.y = height + halfSize;
    }
    else if (head.y > height + halfSize) {
      head.y = 0 - halfSize;
    }

    // Update body segments
    for (let i = 1; i < snake.length; i++) {
      const pos = positionHistory[i - 1];
      if (pos) {
        snake[i].x = pos.x;
        snake[i].y = pos.y;
      }
    }

      //game Over !

     for (let i = 1; i < snake.length; i++) {
     this.physics.world.overlap(snake[0], snake[i], () => {
       document.getElementById("game-over-message").style.display = "block"; 
    for (let k = 0; k < gameOverText.length; k++) {
      setTimeout(() => {
      document.getElementById("game-over-message").innerText += gameOverText[k];
      }, k * 500); 
    } 
       this.scene.pause();
     });

   } 

    if (positionHistory.length > 1000) {
      positionHistory.length = 1000;
    }
  }
}