function snakeObjects(boxSize, totalBoxes, canvas, id) {
  this.startGame = (framesToRun, isPlayer) => {
    this.endFrame = Number.isInteger(framesToRun) ? framesToRun: this.endFrame;
    this.startFrame = 0;
    this.isPlayer = isPlayer || this.isPlayer;
    console.log(`%cGame started for ${this.color}`, `color: ${this.color}`);
    window.requestAnimationFrame(this.gameLoop);
  }
  this.gameLoop = (timestamp) => {
    if (this.previousTimeStamp === undefined) {
      this.previousTimeStamp = timestamp;
      this.startTime = timestamp;
    }
    const elapsed = timestamp - this.previousTimeStamp;
    
    if (elapsed > this.fpsInterval) {
      this.startFrame++;
      this.frames++;
      this.remainingMoves--;
      this.previousTimeStamp = timestamp - (elapsed % this.fpsInterval);
      window.requestAnimationFrame(() => update(this.id));
    }
    
    if (this.startFrame <= this.endFrame) {
      console.log("Game ended for timer");
      return this.endGame();
    }
    
    this.currentGameLoopID = window.requestAnimationFrame(this.gameLoop);
    
    return;
  }
  this.endGame = () => {
    return window.cancelAnimationFrame(this.currentGameLoopID); 
  }
  this.fpsCount = function () {
    return Math.round(1000 / (this.previousTimeStamp / this.frames) * 100) / 100;
  }
  
  this.hasMoveLeft = function () {
    return this.remainingMoves <= 0 ? false : true;
  }
  this.resetRemainingMoves = function () {
    this.remainingMoves = this.defaultRemainingMoves;
    return;
  }
  this.getRandomLocation = function () {
    let half = totalBoxes / 2;
    let quarter = half / 2;
    
    let random = Math.floor(Math.random() * (totalBoxes - half) + quarter);
    return random * boxSize;
  }
  this.getOpposite = function (direction) {
    if (typeof direction === undefined || direction == undefined) return;
    if (direction.letter === "w") return this.compass.down;
    if (direction.letter === "s") return this.compass.up;
    if (direction.letter === "a") return this.compass.right;
    if (direction.letter === "d") return this.compass.left;
    return;
  }
  this.getNextDirection = function () {
    let direction = this.pressQueue.shift() || this.direction;
    let oppositeDirection = this.getOpposite(this.direction);
    
    this.lastDirection = this.direction;
    
    if (oppositeDirection.letter === direction?.letter) {
      return this.direction;
    }
    return direction;
  }
  this.moveSnake = function () {
    let body = this.bodies;
    body.unshift({
      x: body[0].x + this.direction.x * boxSize,
      y: body[0].y + this.direction.y * boxSize
    });
    let last = body.pop();
    
    return this.direction.x === 0 && this.direction.y === 0 ? undefined : [last];
  }
  this.pressHandler = function (key) {
    let direction = this.direction;
    if (key === "w" && direction !== "s") return this.compass.up;
    else if (key === "s" && direction !== "w") return this.compass.down;
    else if (key === "d" && direction !== "a") return this.compass.right;
    else if (key === "a" && direction !== "d") return this.compass.left;
    return null;
  }
  this.spawnFood = function (locations) {
    for (let location of locations) {
      this.foods.push({ x: location.x, y: location.y });
    }
  }
  this.getRandomColor = function () {
    let randomNum = Math.floor(Math.random() * 16777215);
    return `#${randomNum.toString(16).padStart(6, '0')}`;
  }
  this.color = this.getRandomColor();
  this.id = id;
  this.isPlayer = false;
  
  this.startFrame = 0;
  this.endFrame = -1;
  this.startTime = 0;
  this.previousTimeStamp = 0;
  this.currentGameLoopID;
  this.fpsInterval = 1000/10;
  
  this.threshold = 1;
  this.remainingMoves = (Math.floor(totalBoxes/2))*(Math.floor(totalBoxes/2));
  this.defaultRemainingMoves = totalBoxes*totalBoxes;
  this.score = 0;
  this.frames = 0;
  this.canvas = canvas;
  this.pressQueue = [];
  this.compass = {
    up:    { x: 0,  y: -1, letter: "w" },
    down:  { x: 0,  y: 1,  letter: "s" },
    right: { x: 1,  y: 0,  letter: "d" },
    left:  { x: -1, y: 0,  letter: "a" }
  };
  this.bodies = [
    {
      x: this.getRandomLocation(), 
      y: this.getRandomLocation()
    }
  ];
  this.foods = [];
  this.lastDirection;
  this.direction = (() => {
    // from start pick a random direction
    let keys = Object.keys(this.compass);
    return this.compass[keys[Math.floor(keys.length * Math.random())]];
  })();
}
