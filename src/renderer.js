let totalRowBoxes = 18;
let gameBoard;
let snakes = [];
let manager = null;
let currentSnake = null;

function update(loopIndex) {
  let { bodies, foods, canvas } = currentSnake = snakes[loopIndex];
  
  let isEnded = gameBoard.isGameEnded(bodies, loopIndex);
  let hasRemainingMove = currentSnake.hasMoveLeft();
  let isAlive = currentSnake.isAlive;
  
  if (!isAlive || isEnded || !hasRemainingMove) {
    manager.displayGameEnded(canvas);
    currentSnake.isAlive = false;
    return currentSnake.endGame();
  }
  
  manager.updateFPS(canvas, currentSnake.fpsCount());
  
  let foodIndex = currentSnake.isEating();
  if (typeof foodIndex === "number") {
    manager.updateScore(canvas, ++currentSnake.score);
    currentSnake.eatFood();
  
    let newFood = manager.getRandomAvailableLocation(bodies);
  
    currentSnake.replaceFood(newFood, foodIndex);
    currentSnake.resetRemainingMoves();
  }
  let snakeTail = currentSnake.moveSnake();
  
  gameBoard.redrawMapPart(snakeTail, loopIndex);
  gameBoard.drawFoods(foods, loopIndex);
  gameBoard.snakeHead(bodies[0], loopIndex, currentSnake.color);
  
  if (!currentSnake.isPlayer) {
    if (!currentSnake.pressQueue.length) {
      let pathes = aStar.search(currentSnake, manager.wholeMap, totalRowBoxes);
      for (let move of pathes[0]) {
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