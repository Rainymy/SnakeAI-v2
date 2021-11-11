function boardProps(boxes) {
  // Genenal
  this.canvas = document.getElementsByTagName('canvas');
  this.ctx = (() => {
    let ctx = [];
    for (let context of this.canvas) ctx.push(context.getContext('2d'));
    return ctx;
  })();
  this.totalBoxes = Math.floor(boxes) || 10;
  this.boxPixel = Math.round(this.canvas[0].width / this.totalBoxes);
  
  this.isGameEnded = function (bodies, loop_Index) {
    for (let [ i, body ] of bodies.entries()) {
      // if head is outside of the box 
      if (
          this.canvas[loop_Index].width  <= body.x || 0 > body.x ||
          this.canvas[loop_Index].height <= body.y || 0 > body.y
        ) {
        return true;
      }
      // if body has invisbale property
      if (i === 0 || body.invisible) { continue; }
      // if head crashed with body part
      if (body.x === bodies[0].x  && body.y === bodies[0].y) {
        console.log("Suicide");
        return true;
      }
    }
    return false;
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
              console.log("Go Up");
              currentSnake.pressQueue.push({ x: 0, y: -1, letter: "w" });
            }
            else {
              console.log("Go Down");
              currentSnake.pressQueue.push({ x: 0, y: 1, letter: "s" });
            }
          }
        }
        if ((head.x / this.boxPixel) === threshold - 1) {
          if (nextDirection && direction === "a" || !nextDirection) {
            currentSnake.pressQueue.length = 0;
            if (border.width / 2 < head.y) {
              console.log("Go Up");
              currentSnake.pressQueue.push({ x: 0, y: -1, letter: "w" });
            }
            else {
              console.log("Go Down");
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
              console.log("Go Right");
              currentSnake.pressQueue.push({ x: -1, y: 0, letter: "a" });
            }
            else {
              console.log("Go Left");
              currentSnake.pressQueue.push({ x: 1, y: 0, letter: "d" });
            }
          }
        }
        if ((head.y / this.boxPixel) === threshold - 1) {
          if (nextDirection && direction === "w" || !nextDirection) {
            currentSnake.pressQueue.length = 0;
            if (border.height / 2 < head.x) {
              console.log("Go Left");
              currentSnake.pressQueue.push({ x: -1, y: 0, letter: "a" });
            }
            else {
              console.log("Go Right");
              currentSnake.pressQueue.push({ x: 1, y: 0, letter: "d" });
            }
          }
        }
      }
    }
  }
  // Entities/Structure
  this.clearScreen = (loop_Index) => {
    let context = this.canvas[loop_Index];
    context.getContext('2d').clearRect(0, 0, context.width, context.height);
  }
  this.clearPixel = (x, y, loop_Index) => {
    let context = this.canvas[loop_Index];
    context.getContext('2d').clearRect(x, y, this.boxPixel, this.boxPixel);
  }
  this.drawSolidRect = (x, y, index, colour) => {
    this.ctx[index].beginPath();
    this.ctx[index].fillStyle = colour || "black";
    this.ctx[index].fillRect(x, y, this.boxPixel, this.boxPixel);
  }
  this.drawFoods = (foods, loop_Index) => {
    for (let food of foods) {
      this.drawSolidRect(food.x, food.y, loop_Index, "green");
    }
  }
  this.character = (bodies, loop_Index) => {
    this.drawSolidRect(bodies[0].x, bodies[0].y, loop_Index, "red");
  }
  this.container = [];
  this.colourize = (position, visualize, speed) => {
    let location;
    if (position.hasOwnProperty("row")) {
      location = { x: position.row * this.boxPixel, y: position.column * this.boxPixel }
    }
    this.container.push(location);
    if (visualize) {
      let id = setInterval(() => {
        if (this.container.length <= 0) return clearInterval(id);
        let { x, y } = this.container.shift();
        this.drawSolidRect(x, y, 0, "white");
      }, parseInt(speed) || 250);
    }
  }
  this.drawSqure = (x, y, index) => {
    this.ctx[index].beginPath();
    this.ctx[index].rect(x, y, this.boxPixel, this.boxPixel);
    this.ctx[index].stroke();
  };
  this.drawMap = (loop_Index) => {
    for (let canvas of this.canvas) {
      for (let i = 0; i < canvas.width/this.boxPixel; i++) {
        for (let j = 0; j < canvas.height/this.boxPixel; j++) {
          this.drawSqure(i * this.boxPixel, j * this.boxPixel, loop_Index);
        }
      }
    }
  }
  this.drawMapPart = (parts, loop_Index) => {
    for (let [index, part] of parts.entries()) {
      this.clearPixel(part.x, part.y, loop_Index);
      this.drawSqure(part.x ,part.y, loop_Index);
    }
  }
}