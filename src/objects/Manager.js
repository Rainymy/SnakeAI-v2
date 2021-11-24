function Manager(boxes, canvasSize) {
  this.aliveSnakes = 0;
  this.totalBoxes = Math.floor(boxes) || 10;
  this.boxPixel = Math.round(canvasSize / this.totalBoxes);
  this.wholeMap = null;
  this.borders = [
    {
      x: this.boxPixel * (this.totalBoxes - 1),
      y: this.boxPixel * (this.totalBoxes - 1),
    },
    {
      x: 0,
      y: 0,
    }
  ]
  this.boarders = [
    { width:  this.boxPixel * this.totalBoxes, start: 0 },
    { height: this.boxPixel * this.totalBoxes, start: 0 }
  ];
  /*-------------------- General ----------------------*/
  this.calculateDistance = function (pointA, pointB) {
    if (!Array.isArray(pointB)) {
      console.warn("Second argument needs to be an ARRAY");
      return; 
    }
    else if (pointB.length > 2) {
      console.warn("Max length 2");
      return; 
    }
    
    let direction = { up: 0, right: 0, down: 0, left: 0, }
    
    for (let point of pointB) {
      let deltaX = (pointA.x - point.x) / this.boxPixel;
      let deltaY = (pointA.y - point.y) / this.boxPixel;
      
      if (deltaY < 0) { direction.down = Math.abs(deltaY); }
                 else { direction.up   = Math.abs(deltaY); }
      
      if (deltaX < 0) { direction.right = Math.abs(deltaX); }
                 else { direction.left  = Math.abs(deltaX); }
    }
    
    return direction;
  }
  this.getDirection = function (currentDirection, availableDirection) {
    let direction = { up: 0, right: 0, down: 0, left: 0, }
    for (let item in availableDirection) {
      if (currentDirection === availableDirection[item]) {
        direction[item] = 1;
        
        return direction;
      }
    }
    return direction;
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
    if (!available.length) {
      return { x: -this.boxPixel, y: -this.boxPixel }
    }
    return available[Math.floor(Math.random() * available.length)];
  }
  this.isMapAvaible = function () {
    return this.wholeMap && Array.isArray(this.wholeMap) ? true : false;
  }
  this.getFullMap = function () {
    let wholeMap = [];
    for (let i = 0; i < this.totalBoxes; i++) {
      for (let j = 0; j < this.totalBoxes; j++) {
        wholeMap.push({ x: i * this.boxPixel, y: j * this.boxPixel });
      }
    }
    return wholeMap;
  }
  /*------------------ Spawn Food --------------------*/
  this.getRandomLocations = function (bodies, total=1) {
    let locations = [];
    for (let i = 0; i < total; i++) {
      locations.push(this.getRandomAvailableLocation(bodies));
    }
    return locations;
  }
  
}