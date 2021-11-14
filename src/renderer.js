let totalRowBoxes = 18;
let gameBoard;
let snakes = [];
let manager = null;
let currentSnake = null;

function update(loopIndex) {
  let { bodies, foods, canvas, color } = currentSnake = snakes[loopIndex];
  console.log(`Snake: %c${currentSnake.frames}`, `color: ${color}`);
  
  if (gameBoard.isGameEnded(bodies, loopIndex) || !currentSnake.hasMoveLeft()) {
    console.log("%cGame ended", `color: ${color}`);
    canvas.parentNode.querySelector("#gameEnded").style.display = "";
    return currentSnake.endGame();
  }
  
  let fpsElement = canvas.parentNode.querySelector(".fps-count");
  fpsElement.textContent = `FPS: ${currentSnake.fpsCount()} - `;
  
  for (let [ index, food ] of foods.entries()) {
    if (food.x === bodies[0].x && food.y === bodies[0].y) {
      let score = canvas.parentNode.querySelector(".score-count");
      score.textContent = `Score: ${++currentSnake.score}`;
      
      bodies.unshift({ x: bodies[0].x, y: bodies[0].y });
      let newFood = manager.getRandomAvailableLocation(bodies);
      
      if (!newFood) {
        newFood = { x: -gameBoard.boxPixel, y: -gameBoard.boxPixel }
      }
      foods.splice(index, 1, { x: newFood.x, y: newFood.y });
      
      currentSnake.resetRemainingMoves();
    }
  }
  let snakeTail = currentSnake.moveSnake();
  
  gameBoard.redrawMapPart(snakeTail, loopIndex);
  gameBoard.drawFoods(foods, loopIndex);
  gameBoard.snakeHead(bodies[0], loopIndex);
  
  if (!currentSnake.isPlayer) {
    if (!currentSnake.pressQueue.length) {
      let pathes = aStar.search(currentSnake, manager.wholeMap, totalRowBoxes);
      // pathes.shift();
      pathes.pop();
      for (let move of pathes) {
        currentSnake.pressQueue.push(currentSnake.pressHandler( move ));
      }
    }
    
    // When snake gets near the walls. Activates with threshold
    gameBoard.checkNearBorder(
      manager.boarders, currentSnake, currentSnake.threshold
    );
  }
  
  currentSnake.direction = currentSnake.getNextDirection();
}