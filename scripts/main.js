const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const PI = 3.141592653589793;
// global variables
var rotationAngle = PI / 4;
var reRender = false;
var interval;
var parentToChildRatio = 0.75;
var autoRotateOn = false;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
// helper function
function deepCopy(x) {
  return JSON.parse(JSON.stringify(x));
}
class Vector {
  constructor(start, end) {
    //   deep copy because things get fucked up otherwise
    this.start = deepCopy(start);
    this.end = deepCopy(end);
    this.x = deepCopy(end.x - start.x);
    this.y = deepCopy(end.y - start.y);
    // polar coordinates
    this.magnitude = Math.pow(this.x ** 2 + this.y ** 2, 1 / 2);
    // angle calculated clockwise from x axis
    this.angle = Math.atan(this.y / this.x);
  }
  //   changing the magnitude of the vector keeping start fixed
  changeHeight = (newHeight) => {
    this.x = (this.x / this.magnitude) * newHeight;
    this.y = (this.y / this.magnitude) * newHeight;
    this.magnitude = deepCopy(newHeight);

    this.end.x = this.start.x + this.x;
    this.end.y = this.start.y + this.y;
  };

  //   changing the angle of the vector keeping the start fixed
  changeAngle = (newAngle) => {
    //   NOTE: sin and cos are in radians
    this.angle = deepCopy(newAngle);
    this.x = this.magnitude * Math.cos(this.angle);
    this.y = this.magnitude * Math.sin(this.angle);
    this.end.x = this.start.x + this.x;
    this.end.y = this.start.y + this.y;
  };

  graph = () => {
    stroke(255);
    line(this.start.x, this.start.y, this.end.x, this.end.y);
  };
}

// recursive functions to be called
branch = (parent, pcRatio, count = 5) => {
  let end = parent.end;
  let start = parent.start;
  let angle = parent.angle;
  let height = parent.magnitude;

  let child1 = new Vector(end, start);
  let childHeight = height * pcRatio;
  child1.changeHeight(childHeight);

  child1.changeAngle(angle - rotationAngle);
  child1.graph();
  let child2 = new Vector(end, start);
  child2.changeHeight(childHeight);

  child2.changeAngle(angle + rotationAngle);
  child2.graph();

  if (childHeight > 10) {
    branch(child1, pcRatio, count - 1);
    branch(child2, pcRatio, count - 1);
  }
};

// rendering the entire tree
render = (pcRatio) => {
  var bottomMiddle = new Point(WIDTH / 2, HEIGHT);
  var middle = new Point(WIDTH / 2, (3 * HEIGHT) / 4);
  let a = new Vector(bottomMiddle, middle);
  a.graph();
  branch(a, pcRatio);
};

// main p5js functions
setup = () => {
  createCanvas(WIDTH, HEIGHT);
  background(0, 0, 0);
  render(parentToChildRatio);
  createButton("Auto Rotate")
    .position(50, 50)
    .mousePressed(autoRotate)
    .style("width", "100px")
    .style("height", "20px")
    .style("background", "green")
    .style("color", "white");
  createButton("Stop")
    .position(50, 70)
    .mousePressed(stop)
    .style("width", "100px")
    .style("height", "20px")
    .style("background", "red")
    .style("color", "white");
};
draw = () => {
  if (reRender) {
    fill(0);
    rect(0, 0, WIDTH, HEIGHT);
    render(parentToChildRatio);
    reRender = false;
  }
};

// Event Listeners

autoRotate = () => {
  if (!autoRotateOn) {
    interval = setInterval(() => {
      rotationAngle += PI / 1080;
      reRender = true;
    }, 5);
    autoRotateOn = true;
  }
};
stop = () => {
  clearInterval(interval);
  autoRotateOn = false;
};
