function boardManager() {
  this.gameBoard = null;
  this.wholeMap = null;
  this.boarders = [];
  this.boardIds = [];
  this.current = 0;
  /*-------------------- General ----------------------*/
  this.createUniqueId = function () {
    return Math.random().toString(36).substring(2);
  }
  this.populate = function (snakeObj) {
    let players = [];
    let board = this.gameBoard;
    for (let i = 0; i < board.canvas.length; i++) {
      players.push(
        new snakeObj(
          board.boxPixel, board.totalBoxes, board.canvas[i], this.current
        )
      );
      board.clearScreen(this.current);
      board.drawMap(this.current);
      this.current++;
    }
    return players;
  }
  this.reInit = function (snakes, snakeObj) {
    this.current = 0;
    for (let snake of snakes) { snake.endGame(); }
    snakes.length = 0;
    // snakes.push(...this.populate(snakeObj));
    // this.resetScore();
  }
  /*---------------------- Map ------------------------*/
  this.getRandomAvailableLocation = function (bodies) {
    if (!this.isMapAvaible()) { this.wholeMap = this.getFullMap(); }
    let available = this.wholeMap.filter((item, i) => {
      return bodies.every((body) => {
        if (body.x !== item.x) { return true; } 
        else if (body.y !== item.y) { return true; } 
        else if (body.x === item.x && body.y === item.y) { return false; }
        return true;
      });
    });
    return available[Math.floor(Math.random() * available.length)];
  }
  this.isMapAvaible = function () {
    return this.wholeMap && Array.isArray(this.wholeMap) ? true: false;
  }
  this.getFullMap = function () {
    let wholeMap = [];
    for (let i = 0; i < this.gameBoard.totalBoxes; i++) {
      for (let j = 0; j < this.gameBoard.totalBoxes; j++) {
        wholeMap.push({
          x: i * this.gameBoard.boxPixel,
          y: j * this.gameBoard.boxPixel
        });
      }
    }
    // HARD coded part, please replace it 
    // START - Side effect
    let y = wholeMap[this.gameBoard.totalBoxes - 1].y;
    let temp = y + this.gameBoard.boxPixel;
    for (let i = 0; i < 2; i++) {
      this.boarders.push(
        i % 2 === 0 ? { width: temp, start: 0 }: { height: temp,  start: 0 }
      );
    }
    // END
    return wholeMap;
  }
  /*------------------ Spawn Food --------------------*/
  this.getRandomLocations = function (bodies, total=1) {
    let locations = [];
    for (let i = 0; i < total; i++) {
      locations.push(
        this.getRandomAvailableLocation(bodies, this.gameBoard.boxSize)
      );
    }
    return locations;
  }
  /*---------------------- UI ------------------------*/
  this.createElement = function (tag, id) {
    let element = document.createElement(tag);
    element.id = id ?? "";
    return element; 
  }
  this.createCanvas = function (width, height, id) {
    let canvas = this.createElement("canvas", id);
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  this.createGamerOverElement = function () {
    let over = this.createElement("span", "gameEnded");
    over.textContent = " - Game Over: ";
    over.style.display = "none";
    return over;
  }
  this.createFPSCounter = function () {
    let fps = this.createElement("span");
    fps.classList.add("fps-count");
    return fps;
  }
  this.createScoreCounter = function () {
    let score = this.createElement("span", "");
    score.classList.add("score-count");
    score.textContent = "Score: 0";
    return score;
  }
  this.createScoreElement = function (text) {
    let textElem = this.createElement("span", "");
    // textElem.textContent = text || "Score: 0";
    textElem.classList.add("score");
    textElem.appendChild(this.createFPSCounter());
    textElem.appendChild(this.createScoreCounter());
    textElem.appendChild(this.createGamerOverElement());
    return textElem;
  }
  this.createGameGround = function (elem, totalCanvases) {
    let div = null;
    for (let i = 0; i < totalCanvases; i++) {
      div = this.createElement("div", this.createUniqueId());
      div.style.position = "relative";
      div.appendChild(this.createScoreElement());
      div.appendChild(this.createCanvas(500, 500, this.createUniqueId()));
      elem.appendChild(div);
      
      this.boardIds.push(div.id);
    }
  }
  this.resetScore = function () {
    for (let board of this.boardIds) {
      let parent = document.querySelector(`[id="${board}"]`);
      parent.replaceChild(this.createScoreElement(), parent.firstChild);
    }
  }
}