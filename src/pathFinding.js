const aStar = {
  Initial: { FOOD: -1, WALL: 1, HEAD: 2, AIR: 0 },
  mapGrid: null,
  mapArray: null,
  safetyBrake: 0,
  init: true,
  
  proto: {
    parent: null,
    isSameCoordinate: function (startPos, endPos) {
      if (!endPos || !startPos) {
        console.error("Missing end/start position"); 
        return false;
      }
      
      let endX = endPos[ endPos.hasOwnProperty("x") ? "x": "row" ];
      let endY = endPos[ endPos.hasOwnProperty("y") ? "y": "column" ];
      let startX = startPos[ startPos.hasOwnProperty("x") ? "x": "row" ];
      let startY = startPos[ startPos.hasOwnProperty("y") ? "y": "column" ];
      
      return startX === endX && startY === endY;
    },
    compareValues: function (firstValue, array) {
      if (firstValue == undefined) { return false; }
      for (let value of array) { if (firstValue === value) { return true; }}
      return false;
    },
    convertGridToArray: function (list, walls, foods) {
      let grid = [];
      let last = null;
      outer: for (let current of list) {
        if (!last || current.x !== last.x) {
          last = current;
          grid.push([]);
        }
        for (let food of foods) {
          if (food.x === current.x && food.y === current.y) {
            grid[grid.length - 1].push(this.getObjectArray({ isFood: true }, current));
            continue outer;
          }
        }
        for (let [j, wall] of walls.entries()) {
          if (this.isSameCoordinate(wall, current)) {
            grid[grid.length - 1].push(
              this.getObjectArray(
                j === 0 ? { isHead: true }: { isWall: true }, current
              )
            );
            continue outer;
          }
        }
        grid[grid.length - 1].push(this.getObjectArray(current));
      }
      return grid;
    },
    createGridFromArray: function(lists) {
      let grid = [], last;
      for (let current of lists) {
        for (let obj of current) {
          if (!last || last.x !== obj.x) { last = obj; grid.push([]); }
          grid[grid.length - 1].push(this.getInitialValues(obj));
        }
      }
      return grid;
    },
    getOpposite: function (direction) {
      return direction === "w"
              ? "s" : direction === "s"
                ? "w" : direction === "a"
                  ? "d" : direction === "d"
                    ? "a" : undefined;
    },
    getObjectArray: function(options, defaultValue) {
      return Object.assign({
        isWall: false, isFood: false, isHead: false 
      }, options, defaultValue);
    },
    getInitialValues: function (obj) {
      let it = this.parent.Initial;
      return obj.isHead ? it.HEAD : obj.isWall ? it.WALL : obj.isFood ? it.FOOD : it.AIR
    },
    getNearestFood: function ( foods, head ) {
      let temp = [];
      for (let food of foods) temp.push(this.heuristic(food, head));
      return foods[this.getIndexWithLowestValue(temp)];
    },
    getAllObjectLocation: function (direction) {
      let obj = { head: [], food: [] };
      for (let [i, x] of this.parent.mapGrid.entries()) {
        for (let [j, y] of x.entries()) {
          if (y === this.parent.Initial.HEAD) {
            obj.head = { row: i, column: j, direction: direction.letter };
          }
          if (y === this.parent.Initial.FOOD) {
            obj.food.push({ row: i, column: j });
          }
        }
      }
      return obj;
    },
    translate: function (instructions, startPos) {
      let keyPressOrder = [];
      let last = startPos;
      for (let instruction of instructions) {
        if (0 > last.row - instruction.row) { keyPressOrder.push("d"); }
        else if (0 < last.row - instruction.row) { keyPressOrder.push("a"); }
        else if (0 > last.column - instruction.column) { keyPressOrder.push("s"); }
        else if (0 < last.column - instruction.column) { keyPressOrder.push("w"); }
        last = instruction;
      }
      return keyPressOrder;
    },
    validateNumber: function (value) {
      let number = parseInt(value);
      return !Number.isNaN(number) && 1 <= number ? number: 0;
    },
    heuristic: function (start, end) {
      if (!end) { return 0; }
      return Math.abs(end.row - start.row) + Math.abs(end.column - start.column);
    },
    getIndexWithLowestValue: function (array) {
      let i = 0, lowest = 0;
      while (i++ < array.length) if (array[lowest] > array[i]) lowest = i;
      return lowest;
    },
    getLowestCostTile: function (array, endPos) {
      let temp = [];
      for (let middle of array) temp.push(this.heuristic(middle, endPos));
      return array[this.getIndexWithLowestValue(temp)];
    }
  },
  getWalkableNeighbours: function (head, walked) {
    walked = walked || [];
    let walkableNodes = [];
    let compareValues = [ this.Initial.AIR, this.Initial.FOOD ];
    
    let middleRow = this.mapGrid[head.row] || [];
    let leftRow = this.mapGrid[head.row - 1] || [];
    let rightRow = this.mapGrid[head.row + 1] || [];
    
    let top = leftRow[head.column];
    let bottom = rightRow[head.column];
    let left = middleRow[head.column - 1];
    let right = middleRow[head.column + 1];
    
    if (this.proto.compareValues(top, compareValues)){
      walkableNodes.push({ row: head.row - 1, column: head.column });
    }
    if (this.proto.compareValues(bottom, compareValues)){
      walkableNodes.push({ row: head.row + 1, column: head.column });
    }
    if (this.proto.compareValues(left, compareValues)) {
      walkableNodes.push({ row: head.row, column: head.column - 1 });
    }
    if (this.proto.compareValues(right, compareValues)) {
      walkableNodes.push({ row: head.row, column: head.column + 1 });
    }
    for (let [i, node] of walkableNodes.entries()) {
      for (let j = 0; j < walked.length; j++) {
        if (this.proto.isSameCoordinate(walked[j], node)) {
          walkableNodes.splice(i, 1);
          break;
        }
      }
    }
    // console.log(walkableNodes);
    return walkableNodes;
  },
  findPathFromTo: function (head, food) {
    let closedNode = [];
    let openNode = [head];
    
    let currentNode;
    let totalLoop = 0;
    let direction;
    
    while (openNode.length) {
      currentNode = this.proto.getLowestCostTile(openNode, food);
      if (this.proto.isSameCoordinate(currentNode, food)) {
        console.log("PATH FOUND");
        let ret = [], curr = currentNode;
        while (curr.parent) ret.push(curr = curr.parent);
        // this.proto.colourize(ret.map(v => Object.assign({}, v)).reverse());
        this.container = ret;
        return ret.map(v => delete v.parent ? v : v).reverse();
      }
      closedNode.push(...openNode.splice(openNode.indexOf(currentNode), 1));
      for (let neighbour of this.getWalkableNeighbours(currentNode, closedNode)) {
        direction = this.proto.translate([neighbour], currentNode)[0];
        if (currentNode.direction === this.proto.getOpposite(direction)) { continue; }
        if (-1 === openNode.indexOf(neighbour)) {
          neighbour.parent = currentNode;
          neighbour.direction = direction;
          openNode.push(neighbour);
        }
      }
      // Safety Brake, do not comment this
      if (++totalLoop >= this.safetyBrake ) {
        console.log("PATH NOT FOUND!");
        // this.proto.colourize(closedNode, { speed: 50 });
        this.container = closedNode;
        break;
      }
    }
    return [];
  },
  container: [],
  search: function (obj, map, brake) {
    if (this.init) {
      this.safetyBrake = this.proto.validateNumber(brake);
      this.proto.parent = this;
      this.init = false;
    }
    
    this.container.length = 0;
    let mapArray = this.proto.convertGridToArray(map, obj.bodies, obj.foods);
    this.mapGrid = this.proto.createGridFromArray(mapArray);
    
    let { food, head } = this.proto.getAllObjectLocation(obj.direction);
    
    let foundPath = this.findPathFromTo(head, this.proto.getNearestFood(food, head));
    
    return [ this.proto.translate(foundPath, head), foundPath ];
  }
}