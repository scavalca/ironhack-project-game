// console.log('hey seba');





// function draw() {
//     let canvas = document.getElementById('example');
//     let ctx = canvas.getContext('2d');

//     // creating
//     ctx.fillStyle = "red";
//     ctx.fillRect(70, 315, 50, 50);

// }





// function obstacles() {
//     let canvas = document.getElementById('example');
//     let ctx = canvas.getContext('2d');

//     // draw obstacles
//     ctx.fillStyle = 'black';
//     ctx.fillRect(670, 100, 60, 60);

//     ctx.fillStyle = 'black';
//     ctx.fillRect(890, 250, 60, 60);

//     ctx.fillStyle = 'black';
//     ctx.fillRect(1100, 400, 60, 60);

//     ctx.fillStyle = 'black';
//     ctx.fillRect(890, 550, 60, 60);


//     ctx.beginPath();
//     ctx.arc(190, 100, 35, 0, Math.PI * 2);
//     ctx.fillStyle = 'green';
//     ctx.stroke();
//     ctx.fill();
//     ctx.closePath();

//     ctx.beginPath();
//     ctx.arc(310, 250, 35, 0, Math.PI * 2);
//     ctx.fillStyle = 'green';
//     ctx.stroke();
//     ctx.fill();
//     ctx.closePath();

//     ctx.beginPath();
//     ctx.arc(430, 400, 35, 0, Math.PI * 2);
//     ctx.fillStyle = 'green';
//     ctx.stroke();
//     ctx.fill();
//     ctx.closePath();

//     ctx.beginPath();
//     ctx.arc(550, 550, 35, 0, Math.PI * 2);
//     ctx.fillStyle = 'green';
//     ctx.stroke();
//     ctx.fill();
//     ctx.closePath();

// }



// draw();
// obstacles();



// let imageCharacter = document.getElementById('character'),
// context = canvas.getContext('2d');

// make_base();

// function make_base() {
//   image = new Image();
//   image.src = 'img/fireball.png';
//   image.onload = function(){
//     context.drawImage(image, 0, 0);
//   }
// }

window.onload = () => {
  const startgame = document.getElementById('startgame');
  document.getElementById('start-button').onclick = () => {
    // image.drawImage();
    myGameArea.start();
    startgame.style.display = 'none';
  }
}

let image = new Image();
image.src = './exampleSite/images/fireball.png';

let myObstacles = [];

let requestID = null;

let myGameArea = {
  canvas: document.createElement("canvas"),
  frames: 0,

  start: function () {
    //canvas size
    this.canvas.width = 1250;
    this.canvas.height = 638;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);

    // this.interval = setInterval(updateGameArea, 10);

    requestID = window.requestAnimationFrame(updateGameArea);


  },

  // it will clear the game area before drawing again
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  //   clearInterval(this.interval);
  stop: function () {
    this.context.clearRect(0, 0, 1200, 800);

  let img = new Image();
  img.src = './images/gameover.png'
  img.onload = function () {
    this.context.drawImage(img, 280, -50, 700, 700);
  }.bind(this);
    window.cancelAnimationFrame(requestID);
  },

  score: function () {
    var points = Math.floor(this.frames / 10);
    this.context.font = "30px serif";
    this.context.fillStyle = "green";
    this.context.fillText("Score: " + points, 50, 50);
  }
}


class Character {
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;

    // new speed properties
    this.speedX = 0;
    this.speedY = 0;

  }



  newPos() {
    if (this.x >= 0 && this.x <= 1185) {
      this.x += this.speedX;
    } else if (this.x < 0) {
      this.x += 1;
    } else if (this.x > 1185) {
      this.x -= 1;
    }
    if (this.y >= 0 && this.y <= 580) {
      this.y += this.speedY;
    } else if (this.y < 0) {
      this.y += 1;
    } else if (this.y > 580) {
      this.y -= 1;
    }
  }

  update() {
    let ctx = myGameArea.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // // let canvas = document.getElementById('canvas');
    // // let context = canvas.getContext('2d');

    // // image.onload = function () {
    //   ctx.drawImage(image, 500, 500);
    // // }
  }

  left() {
    return this.x;
  }

  right() {
    return this.x + this.width;
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y + this.height;
  }

  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );
  }
}


//new component


let character = new Character(60, 60, 'red', 70, 315);



function updateGameArea() {
  myGameArea.clear();
  character.newPos();
  character.update();

  // update the obstacles array
  updateObstacles();

  requestID = window.requestAnimationFrame(updateGameArea);
  checkGameOver();
  myGameArea.score();
}

//play begins

// myGameArea.start();


// press keys to move up, down, left and right
document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 38: // up arrow
      character.speedY -= 1;
      break;
    case 40: // down arrow
      character.speedY += 1;
      break;
    case 37: // left arrow
      character.speedX -= 1;
      break;
    case 39: // right arrow
      character.speedX += 1;
      break;
  }

  // if (e.keyCode == 39) {
  //   // console.log((character.x + 60), myGameArea.canvas.width);
  //   if (character.x < myGameArea.canvas.width) {

  //     character.speedX += 1;
  //   } 
  // }
};

// stop adding speed to the character
document.onkeyup = function (e) {
  character.speedX = 0;
  character.speedY = 0;
};

// update obstacles

function updateObstacles() {
  for (i = 0; i < myObstacles.length; i++) {
    myObstacles[i].y += 1;
    myObstacles[i].update();
  }
  myGameArea.frames += 1;
  if (myGameArea.frames % 180 === 0) {
    let minWidth = 60;
    let maxWidth = 1190;
    let width = Math.floor(
      Math.random() * (maxWidth - minWidth + 1) + minWidth);
    myObstacles.push(new Character(60, 60, "black", width, 0));
  }
}

function checkGameOver() {
  let crashed = myObstacles.some(function (obstacle) {
    return character.crashWith(obstacle);
  });
  if (crashed) {
    myGameArea.stop();
  }
  // this.context.clearRect(0, 0, 1200, 800);
  // let img = new Image();
  // img.src = './images/exampleSite/fireball.png';
  // img.onload = function () {
  //   this.context.drawImage(img, 330, 280);
  // }.bind(this);

}

