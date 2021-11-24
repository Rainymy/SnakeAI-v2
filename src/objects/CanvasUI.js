function CanvasUI(boxes, canvasSize) {
  // Genenal
  this.totalBoxes = Math.floor(boxes) || 10;
  this.boxPixel = Math.round(canvasSize / this.totalBoxes);
  
  this.populate = function (snakeObj, boardsId) {
    let players = [];
    let canvas;
    
    for (let board of boardsId) {
      canvas = document.getElementById(`${board}`);
      if (canvas === null) { continue; }
      
      players.push( new snakeObj( this.boxPixel, this.totalBoxes, canvas ) );
      
      this.clearScreen(canvas);
      this.drawMap(canvas);
    }
    return players;
  }
  
  this.checkNearBorder = function (borders, currentSnake, threshold) {
    let head = currentSnake.bodies[0];
    let nextDirection = currentSnake.pressQueue[1];
    let direction = currentSnake.pressQueue[0] && currentSnake.pressQueue[0].letter;
    
    for (let border of borders) {
      if (border.hasOwnProperty("width")) {
        if ((border.width - head.x) / this.boxPixel === threshold) {
          if (nextDirection && direction === "d" || !nextDirection) {
            currentSnake.pressQueue.length = 0;
            if (border.width / 2 < head.y) {
              // console.log("Go Up");
              currentSnake.pressQueue.push({ x: 0, y: -1, letter: "w" });
            }
            else {
              // console.log("Go Down");
              currentSnake.pressQueue.push({ x: 0, y: 1, letter: "s" });
            }
          }
        }
        if ((head.x / this.boxPixel) === threshold - 1) {
          if (nextDirection && direction === "a" || !nextDirection) {
            currentSnake.pressQueue.length = 0;
            if (border.width / 2 < head.y) {
              // console.log("Go Up");
              currentSnake.pressQueue.push({ x: 0, y: -1, letter: "w" });
            }
            else {
              // console.log("Go Down");
              currentSnake.pressQueue.push({ x: 0, y: 1, letter: "s" });
            }
          }
        }
      }
      else {
        if ((border.height - head.y)/ this.boxPixel === threshold) {
          if (nextDirection && direction === "s" || !nextDirection) {
            currentSnake.pressQueue.length = 0;
            if (border.height / 2 < head.x) {
              // console.log("Go Right");
              currentSnake.pressQueue.push({ x: -1, y: 0, letter: "a" });
            }
            else {
              // console.log("Go Left");
              currentSnake.pressQueue.push({ x: 1, y: 0, letter: "d" });
            }
          }
        }
        if ((head.y / this.boxPixel) === threshold - 1) {
          if (nextDirection && direction === "w" || !nextDirection) {
            currentSnake.pressQueue.length = 0;
            if (border.height / 2 < head.x) {
              // console.log("Go Left");
              currentSnake.pressQueue.push({ x: -1, y: 0, letter: "a" });
            }
            else {
              // console.log("Go Right");
              currentSnake.pressQueue.push({ x: 1, y: 0, letter: "d" });
            }
          }
        }
      }
    }
  }
  // Entities/Structure
  this.clearScreen = (canvas) => {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }
  this.clearPixel = (x, y, canvas) => {
    canvas.getContext('2d').clearRect(x, y, this.boxPixel, this.boxPixel);
  }
  this.drawSolidRect = (x, y, canvas, colour) => {
    let context = canvas.getContext('2d');
    context.beginPath();
    context.fillStyle = colour || "black";
    context.fillRect(x, y, this.boxPixel, this.boxPixel);
  }
  this.drawFoods = (foods, canvas) => {
    for (let food of foods) {
      this.drawSolidRect(food.x, food.y, canvas, "green");
    }
  }
  this.snakeHead = (body, canvas, color) => {
    this.drawSolidRect(body.x, body.y, canvas, color || "red");
  }
  this.character = (bodies, canvas, color) => {
    for (let body of bodies) {
      this.drawSolidRect(body.x, body.y, canvas, color || "red");
    }
  }
  this.drawSqure = (x, y, canvas) => {
    let context = canvas.getContext('2d');
    context.beginPath();
    context.rect(x, y, this.boxPixel, this.boxPixel);
    context.stroke();
  }
  this.drawLineTo = (x, y, g, d, canvas) => {
    let context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(g, d);
    context.lineTo(x, y);
    context.stroke();
  }
  this.drawMap = (canvas) => {
    for (let i = 0; i < canvas.width/this.boxPixel; i++) {
      this.drawLineTo(
        0, i * this.boxPixel, canvas.width, i * this.boxPixel, canvas
      );
      this.drawLineTo(
        i * this.boxPixel, 0, i * this.boxPixel, canvas.height, canvas
      );
    }
  }
  this.redrawMapPart = (parts, canvas) => {
    for (let part of parts) {
      this.clearPixel(part.x, part.y, canvas);
      this.drawSqure(part.x ,part.y, canvas);
    }
  }
}