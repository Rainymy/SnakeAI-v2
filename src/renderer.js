let totalRowBoxes = 20;
let canvasSize = 500;

let canvasUI, pageUI, manager, currentSnake;
let snakes = [];

function update(currentSnake) {
  let { bodies, foods, canvas, compass } = currentSnake;
  
  pageUI.updateFPS(canvas, currentSnake.fpsCount());
  pageUI.updateRemainingLife(canvas, currentSnake.remainingMoves);
  
  let isEnded = currentSnake.isGameEnded();
  let hasRemainingMove = currentSnake.hasMoveLeft();
  let isAlive = currentSnake.isAlive;
  
  if (!isAlive || isEnded || !hasRemainingMove) {
    pageUI.displayGameEnded(canvas);
    currentSnake.isAlive = false;
    return currentSnake.endGame();
  }
  
  let foodIndex = currentSnake.isEating();
  if (typeof foodIndex === "number") {
    pageUI.updateScore(canvas, ++currentSnake.score);
    currentSnake.eatFood();
    
    currentSnake.fitnessScore += currentSnake.points.eat;
    
    let newFood = manager.getRandomAvailableLocation(bodies);
  
    currentSnake.replaceFood(newFood, foodIndex);
    currentSnake.resetRemainingMoves();
  }
  let [ head, ghostTail, tail ] = currentSnake.moveSnake();
    
  canvasUI.redrawMapPart(ghostTail, canvas);
  canvasUI.drawFoods(foods, canvas);
  canvasUI.snakeHead(bodies[0], canvas, currentSnake.color);
  
  currentSnake.fitnessScore += currentSnake.points.frame;
  
  
  if (!currentSnake.isPlayer) {
    
    // Distance 4(Array) * 3 = 12 input.
    let foodDistance = manager.calculateDistance( head, [ foods[0] ] );
    let tailDistance = manager.calculateDistance( head, [ tail ] );
    let wallDistance = manager.calculateDistance( head, manager.borders );
    
    // Additional info. 1 + 4(Array) = 5
    let size = bodies.length;
    let direction = manager.getDirection( currentSnake.direction, compass );
    
    // 12 + 5 = 17 input
    // console.log("----------------------------------------");
    // console.log(foodDistance);
    // console.log(tailDistance);
    // console.log(wallDistance);
    // 
    // console.log(size);
    // console.log(direction);
    // console.log("----------------------------------------");
    
    let test = manager.directionToArray(
      foodDistance, tailDistance, wallDistance, size, direction
    );
    
    // console.log(test);
    // currentSnake.model.updateInput(test);
    // console.log(currentSnake.model.model);
    
    if (!currentSnake.pressQueue.length) {
      let pathes = aStar.search(currentSnake, manager.wholeMap, totalRowBoxes);
      for (let move of pathes[0]) {
        currentSnake.pressQueue.push(currentSnake.pressHandler( move ));
      }
    }
    
    // When snake gets near the walls. Activates with threshold
    canvasUI.checkNearBorder(
      manager.boarders, currentSnake, currentSnake.threshold
    );
  }
  
  currentSnake.direction = currentSnake.getNextDirection();
}