function snakeObjects(boxSize, totalBoxes, canvas) {
  /*------------------------- Game loop -------------------------*/
  this.startGame = (framesToRun, isPlayer) => {
    // console.log(`%cGame started for ${this.color}`, `color: ${this.color}`);
    this.endFrame = framesToRun ?? this.endFrame;
    this.startFrame = 0;
    this.isAlive = true;
    this.isPlayer = isPlayer || this.isPlayer;
    return window.requestAnimationFrame(this.gameLoop);
  }
  this.gameLoop = (timestamp) => {
    if (this.previousTimeStamp === undefined) {
      this.previousTimeStamp = timestamp;
      this.startTime = timestamp;
    }
    
    const elapsed = timestamp - this.previousTimeStamp;
    
    if (elapsed > this.fpsInterval) {
      // console.log(`Snake: %c${this.frames}`, `color: ${this.color}`);
      this.startFrame++;
      this.frames++;
      this.remainingMoves--;
      this.previousTimeStamp = timestamp - (elapsed % this.fpsInterval);
      window.requestAnimationFrame(() => update(this));
    }
    
    if (this.startFrame <= this.endFrame) {
      console.log("Game ended for timer");
      return this.endGame();
    }
    
    this.currentGameLoopID = window.requestAnimationFrame(this.gameLoop);
    return;
  }
  this.endGame = () => {
    // console.log("%cGame ended", `color: ${this.color}`);
    return window.cancelAnimationFrame(this.currentGameLoopID); 
  }
  this.isGameEnded = function () {
    for (let [ i, body ] of this.bodies.entries()) {
      // if head is outside of the box 
      if (
          this.canvas.width  <= body.x || 0 > body.x ||
          this.canvas.height <= body.y || 0 > body.y
        ) {
        return true;
      }
      // first element is the snake head
      if (i === 0) { continue; }
      // if head crashed with body part
      if (body.x === this.bodies[0].x  && body.y === this.bodies[0].y) {
        console.log("Suicide");
        return true;
      }
    }
    return false;
  }
  /*------------------------- Movement --------------------------*/
  this.getOpposite = function (direction) {
    if (typeof direction === undefined || direction == undefined) return;
    if (direction.letter === "w") return this.compass.down;
    if (direction.letter === "s") return this.compass.up;
    if (direction.letter === "a") return this.compass.right;
    if (direction.letter === "d") return this.compass.left;
    return;
  }
  this.getNextDirection = () => {
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
    let last = [ body.pop() ];
    
    if (this.direction.x === 0 && this.direction.y === 0) {
      return;
    }
    return [ body[0], last , body[body.length - 1] ];
  }
  this.pressHandler = function (key) {
    let direction = this.direction;
    if (key === "w" && direction !== "s") return this.compass.up;
    else if (key === "s" && direction !== "w") return this.compass.down;
    else if (key === "d" && direction !== "a") return this.compass.right;
    else if (key === "a" && direction !== "d") return this.compass.left;
    return null;
  }
  /*------------------------- Food -----------------------------*/
  this.isEating = function () {
    for (let [ index, food ] of this.foods.entries()) {
      if (food.x === this.bodies[0].x && food.y === this.bodies[0].y) {
        return index;
      }
    }
    return;
  }
  this.eatFood = function () {
    this.bodies.unshift({ x: this.bodies[0].x, y: this.bodies[0].y });
    return this.bodies; 
  }
  this.replaceFood = function (location, index) {
    this.foods.splice(index, 1, { x: location.x, y: location.y });
    return this.foods;
  }
  this.spawnFood = function (locations) {
    for (let location of locations) {
      this.foods.push({ x: location.x, y: location.y });
    }
  }
  /*------------------------- General ---------------------------*/
  this.getRandomColor = function () {
    let randomNum = Math.floor(Math.random() * 16777215);
    return `#${randomNum.toString(16).padStart(6, '0')}`;
  }
  this.fpsCount = function () {
    return Math.round(1000 / (this.previousTimeStamp / this.frames) * 100) / 100;
  }
  this.hasMoveLeft = function () {
    return this.remainingMoves > 0;
  }
  this.resetRemainingMoves = function () {
    return this.remainingMoves = this.defaultRemainingMoves;
  }
  this.getRandomLocation = function () {
    let half = totalBoxes / 2;
    let quarter = half / 2;
    
    let random = Math.floor(Math.random() * (totalBoxes - half) + quarter);
    return random * boxSize;
  }
  /*-------------------------- Event ---------------------------*/
  this.on = async (inputEvent, callback) => {
    if (!callback && typeof callback !== "function") {
      return console.warn(new Error("Require a Callback"));
    }
    let event = this.events[inputEvent.toLowerCase()];
    if (typeof event === "function") {
      return event(callback);
    }
  }
  this.death = async (callback) => {
    return await new Promise((resolve, reject) => {
      let loop = setInterval(() => {
        if (this.isAlive) { return; }
        clearInterval(loop);
        
        resolve(callback({ isAlive: this.isAlive, id: this.id }));
      }, this.eventResponseTime);
    });
  }
  /*------------------------------------------------------------*/
  
  this.color = this.getRandomColor();
  
  this.canvas = canvas;
  this.id = this.canvas.id;
  
  this.isPlayer = false;
  this.isAlive = true;
  
  this.points = {
    frame: 0.5,
    eat: 10
  }
  this.fitnessScore = 0;
  
  this.eventResponseTime = 200;
  this.events = {
    death: this.death,
    frame: () => { return; },
    start: () => { return; }
  }
  
  this.model;
  
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
