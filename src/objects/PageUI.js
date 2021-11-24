function PageUI() {
  this.boardIds = [];
  this.canvasIds = [];
  /*-------------------- General ----------------------*/
  this.createUniqueId = function () {
    return Math.random().toString(36).substring(2);
  }
  /*------------------ Update UI ---------------------*/
  this.updateScore = function (canvas, score) {
    let scoreElement = canvas.parentNode.querySelector(".score-count");
    scoreElement.textContent = ` Score: ${score}`;
    return;
  }
  this.displayGameEnded = function (canvas) {
    canvas.parentNode.querySelector("#gameEnded").style.display = "";
    return;
  }
  this.updateFPS = function (canvas, fps) {
    let fpsElement = canvas.parentNode.querySelector(".fps-count");
    fpsElement.textContent = `[FPS: ${fps}] -`;
    return;
  }
  this.updateRemainingLife = function (canvas, life) {
    let lifeRemaining = canvas.parentNode.querySelector(".remaining-life-count");
    lifeRemaining.textContent = `[Life: ${life}]`;
    return lifeRemaining;
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
  this.createLifeCounter = function () {
    let life = this.createElement("span");
    life.classList.add("remaining-life-count");
    return life;
  }
  this.createScoreCounter = function () {
    let score = this.createElement("span", "");
    score.classList.add("score-count");
    score.textContent = "Score: 0";
    return score;
  }
  this.createScoreElement = function (text) {
    let textElem = this.createElement("span", "");
    textElem.classList.add("score");
    textElem.appendChild(this.createLifeCounter());
    textElem.appendChild(this.createFPSCounter());
    textElem.appendChild(this.createScoreCounter());
    textElem.appendChild(this.createGamerOverElement());
    return textElem;
  }
  this.createGameGround = function (elem, canvasSize=500, totalCanvases=1) {
    let div, itemInIndex;
    
    for (let i = 0; i < totalCanvases; i++) {
      div = this.createElement("div", this.createUniqueId());
      div.style.position = "relative";
      div.style.margin = "auto";
      div.appendChild(this.createScoreElement());
      
      this.canvasIds.push(this.createUniqueId());
      itemInIndex = this.canvasIds[this.canvasIds.length - 1];
      
      div.appendChild(this.createCanvas(canvasSize, canvasSize, itemInIndex));
      elem.appendChild(div);
      
      this.boardIds.push(div.id);
    }
    return this.boardIds;
  }
  this.resetScore = function () {
    for (let board of this.boardIds) {
      let parent = document.querySelector(`[id="${board}"]`);
      parent.replaceChild(this.createScoreElement(), parent.firstChild);
    }
  }
}