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
  /*------------------ AI --------------------*/
  this.directionToArray = function () {
    let args = [ ...arguments ];
    console.log(args);
    return;
  }
  this.updateInput = function () {
    let args = [...arguments];
    console.log(args);
    return;
  }
  this.init = (input, hiddens, output) => {
    let inputNodes = input?.nodeCount ?? 17;
    let hiddenNodes = 18;
    let outputNodes = output?.nodeCount ?? 4;
    
    let model = {
      inputLayer: {
        nodeCount: inputNodes,
        values:    input?.values  ?? this.genFilledArray(inputNodes, 2, 2),
        weights:   input?.weights ?? this.genFilledArray(inputNodes, 0.25, 0),
        baises:    input?.baises  ?? this.genFilledArray(inputNodes, 0.25, 0)
      },
      hiddenLayers: [/*
        {
          nodeCount: 18,
          weights: [],
          baises: []
        },
        {
          nodeCount: 18,
          weights: [],
          baises: []
        }
      */],
      outputNodes: {
        nodeCount: outputNodes
      }
    }
    
    if (!hiddens?.length) {
      model.hiddenLayers.push({
        nodeCount: hiddenNodes,
        weights: this.genFilledArray(hiddenNodes, 0.25, 0),
        baises:  this.genFilledArray(hiddenNodes, 0.25, 0)
      });
    }
    
    for (let hidden of hiddens ?? []) {
      let temp = hidden?.nodeCount ?? hiddenNodes;
      model.hiddenLayers.push({
        nodeCount: temp,
        weights:   hidden?.weights ?? this.genFilledArray(temp, 0.25, 0),
        baises:    hidden?.baises  ?? this.genFilledArray(temp, 0.25, 0)
      });
    }
    
    // for (let keys in model) {
    //   console.log(keys, model[keys]);
    // }
    
    return {
      model: model,
      updateInput: this.updateInput
    };
  }
  this.genFilledArray = function (quantity, max, min) {
    return Array.from({ length: quantity }).map(function (v) {
      return Math.round(Math.random() * 100 * (max - min)) / 100 + min;
    });
  }
  
}