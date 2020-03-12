// console.log('hey seba');

window.onload = () => {
  const startgame = document.getElementById('startgame');
  document.getElementById('start-button').onclick = () => {
    // image.drawImage();
    myGameArea.start();
    startgame.style.display = 'none';
  }
}

// let imageBackground = new Image();
// imageBackground.src = './images/deepsea.jpg';

let imageCharacter = new Image();
imageCharacter.src = './images/sebastian.png';

let imageObstacle = new Image();
imageObstacle.src = './images/trashbagTwo.png';

let soundGameOver = new Audio();
soundGameOver.src = './images/gameoversound.mp3';
soundGameOver.volume = 0.3;

let soundGame = new Audio();
soundGame.src = './images/sebastiao.mp3';


let myObstacles = [];

let requestID = null;

let myGameArea = {
  canvas: document.createElement("canvas"),
  frames: 0,

  points: 0,

  x: 0,
  y: 0,
  width: 1250,
  height: 638,
  speed: -2,

  imageBackground: new Image(),

  move: function () {
    this.x += this.speed;
    this.x %= this.width;
  },

  drawBackground: function () {
    this.context = this.canvas.getContext("2d");
    this.imageBackground.src = './images/deepsea.jpg';
    this.context.drawImage(this.imageBackground, this.x, this.y, this.width, this.height);

    if (this.speed < 0) {
      this.context.drawImage(this.imageBackground, this.x + this.width, this.y, this.width, this.height);
    }
  },

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
    // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(this.imageBackground, 0, 0, this.canvas.width, this.canvas.height);
  },

  //   clearInterval(this.interval);
  stop: function () {
    this.context.clearRect(0, 0, 1250, 800);

  let img = new Image();
  img.src = './images/gameover.png'
  img.onload = function () {
    this.context.drawImage(img, 280, -50, 700, 700);
  }.bind(this);
    window.cancelAnimationFrame(requestID);
  },

  score: function () {
    // let points = Math.floor(this.frames / 10);
    this.points = Math.floor(this.frames / 10);
    this.context.font = "30px serif";
    this.context.fillStyle = "black";
    this.context.fillText(this.points, 100, 50);
    this.context.drawImage(imageCharacter, 30, 13, 50, 50);
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
    if (this.x >= 0 && this.x <= 1170) {
      this.x += this.speedX;
    } else if (this.x < 0) {
      this.x = 0;
      this.speedX = 0;
    } else if (this.x > 1170) {
      this.x = 1170;
      this.speedX = 0;
    }
    if (this.y >= 0 && this.y <= 560) {
      this.y += this.speedY;
    } else if (this.y < 0) {
      this.y = 0;
      this.speedY = 0;
    } else if (this.y > 560) {
      this.y = 560;
      this.speedY = 0;
    }
  }

  update(image) {
    let ctx = myGameArea.context;
    ctx.fillStyle = this.color;
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(image, this.x, this.y, 80, 80);
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
  myGameArea.drawBackground();
  myGameArea.move();
  character.newPos();
  character.update(imageCharacter);
  faster();
  soundGame.play();

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
      character.speedY = -2.5;
      break;
    case 40: // down arrow
      character.speedY = 2.5;
      break;
    case 37: // left arrow
      character.speedX = -2.5;
      break;
    case 39: // right arrow
      character.speedX = 2.5;
      break;
  }
};

// stop adding speed to the character
document.onkeyup = function (e) {
  character.speedX = 0;
  character.speedY = 0;
};

// update obstacles

let fast = 120;
// console.log(points);

function faster () {
  if (myGameArea.points >= 50 && myGameArea.points < 99) {
    fast = 100;
  } else if (myGameArea.points >= 100 && myGameArea.points < 149) {
    fast = 80;
  } else if (myGameArea.points >= 149 && myGameArea.points < 199) {
    fast = 60;
  } else if (myGameArea.points >= 200 && myGameArea.points < 249) {
    fast = 40;
  } else if (myGameArea.points > 249) {
    fast = 20;
  }
}

function updateObstacles() {
  for (i = 0; i < myObstacles.length; i++) {
    myObstacles[i].y += 1;
    myObstacles[i].update(imageObstacle);
  }
  myGameArea.frames += 1;
  if (myGameArea.frames % fast === 0) {
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
    soundGame.pause();
    soundGameOver.play();
    // function reload
    setInterval(() => {
      window.location.reload();
    }, 1500);
  }
}

