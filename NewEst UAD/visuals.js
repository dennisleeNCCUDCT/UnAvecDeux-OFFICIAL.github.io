window.onload = function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d"); // CTX MEANS CONTEXT
  const container = document.getElementsByClassName("container");
  let strokeColor = "rgb(255,255,255)";
  let strokeClear = "rgb(255,255,255)";
  ctx.canvas.width = container[0].clientWidth - 25;
  ctx.canvas.height = container[0].clientHeight - 25;

  // initial values
  let radius = canvas.width / 2 - 20;
  let numberOfPoints = 200;
  let factor = 41;
  let centerX = canvas.width / 2;
  let centerY = canvas.height / 2;
  let directionFactor = 0.005;

  let colors = [
    "rgb(170 ,152 ,191)",
    "rgb(77  ,228 ,114)",
    "rgb(121 ,189 ,93)",
    "rgb(159 ,187 ,244)",
    "rgb(182 ,242 ,82)",
    "rgb(27  ,252 ,241)",
    "rgb(248 ,225 ,246)",
    "rgb(118 ,246 ,19)",
    "rgb(215 ,108 ,23)",
    "rgb(178 ,242 ,192)",
    "rgb(117 ,193 ,132)",
    "rgb(222 ,232 ,104)",
  ];

  // Buttons
  let playPauseButton = document.getElementById("play-pause");
  playPauseButton.addEventListener("click", playAnimation, false);

  let randomButton = document.getElementById("random");
  randomButton.addEventListener("click", generateRandom, false);

  let colorButton = document.getElementById("change-color");
  colorButton.addEventListener("click", changeColor, false);

  let downloadButton = document.getElementById("download-canvas");
  downloadButton.addEventListener("click", downloadCanvas, false);

  let addFactorButton = document.getElementById("add-factor");
  addFactorButton.addEventListener(
    "click",
    () => {
      addFactor(1);
    },
    false
  );

  let subtractFactorButton = document.getElementById("subtract-factor");
  subtractFactorButton.addEventListener(
    "click",
    () => {
      addFactor(-1);
    },
    false
  );

  let addPointsButton = document.getElementById("add-points");
  addPointsButton.addEventListener(
    "click",
    () => {
      addPoints(1);
    },
    false
  );

  let subtractPointsButton = document.getElementById("subtract-points");
  subtractPointsButton.addEventListener(
    "click",
    () => {
      addPoints(-1);
    },
    false
  );

  // slider input
  let factor_slider = document.getElementById("factor-range");
  let factor_slider_val = document.getElementById("factor-value");
  factor_slider.value = factor;
  factor_slider_val.innerHTML = factor_slider.value;

  let points_slider = document.getElementById("points-range");
  let points_slider_val = document.getElementById("points-value");
  points_slider.value = numberOfPoints;
  points_slider_val.innerHTML = points_slider.value;

  // variable that controls the animation.
  let isPaused = true;

  // class for Point
  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }

  // Function that draws the boundary circle.
  function drawReferenceCircle() {
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2, false);
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }

  // function that calculates the angle to get the next point using index.
  function getAngle(index) {
    // 2 * MATH.PI => denotes the whole circle
    // so here we divide the circle by number of points
    // multiply the smallest part by index to get the point.
    let angle = index * ((2 * Math.PI) / numberOfPoints);
    return angle + 2 * Math.PI;
  }

  // function that draws all the reference points on the boundary circle.
  function drawReferencePoints(index) {
    for (let i = 0; i < numberOfPoints; i++) {
      let angle = getAngle(i);
      let x = centerX + radius * Math.cos(angle);
      let y = centerY + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2, false);
      ctx.fillStyle = strokeColor;
      ctx.fill();
    }
  }

  // function that returns the point, given angle.
  // this point is calculated wrt center of the circle.
  function getPoint(angle) {
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);
    return new Point(x, y);
  }

  // function that draws the time table lines.
  // watch the video using in the html to get more context on this.
  function drawTimeTableLines(index) {
    for (let i = 0; i < numberOfPoints; i++) {
      let i2 = i * factor;
      let angle1 = getAngle(i);
      let angle2 = getAngle(i2);
      let point1 = getPoint(angle1);
      let point2 = getPoint(angle2);

      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.radius;
      ctx.moveTo(point1.x, point1.y);
      ctx.lineTo(point2.x, point2.y);
      ctx.stroke();
      ctx.closePath();
    }
  }

  // updating slider html and factor value on slider change.
  factor_slider.oninput = function () {
    factor_slider_val.innerHTML = this.value;
    factor = parseInt(this.value);
  };

  // updating points html and numberOfPoints value on slider change.
  points_slider.oninput = function () {
    points_slider_val.innerHTML = this.value;
    numberOfPoints = parseInt(this.value);
  };

  // add value to the factor.
  function addFactor(value) {
    factor += value;
    factor = parseInt(factor);
    factor_slider.value = factor;
    factor_slider_val.innerHTML = factor.toFixed(2);
  }

  // add value to the numberOfPoints.
  function addPoints(value) {
    numberOfPoints += value;
    numberOfPoints = parseInt(numberOfPoints);
    points_slider.value = numberOfPoints;
    points_slider_val.innerHTML = numberOfPoints.toFixed(2);
  }

  // create animation loop
  function animate() {
    requestAnimationFrame(animate);
    drawReferenceCircle();
    // drawReferencePoints();
    drawTimeTableLines();

    if (isPaused === false) {
      if (factor <= 1) {
        directionFactor = 0.005;
      } else if (factor >= 200) {
        directionFactor = -0.005;
      }

      factor += directionFactor;
      factor_slider_val.innerHTML = factor.toFixed(2);
      factor_slider.value = factor;
    }
    ctx.fillStyle = "rgb(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // start canvas animation.
  // STARTING POINT / ENTRY FUNCTION
  animate();

  // function that toggles the animation.
  function playAnimation() {
    if (isPaused === false) {
      isPaused = true;
      playPauseButton.textContent = "Play";
    } else {
      isPaused = false;
      playPauseButton.textContent = "Pause";
    }
  }

  // function to pause the animation, called on button clicks.
  function pauseAnimation() {
    isPaused = true;
    playPauseButton.textContent = "Play";
  }

  // function to generate random time table curves.
  function generateRandom() {
    pauseAnimation();
    factor = parseInt(randomNumber(1, 200));
    factor_slider.value = factor;
    factor_slider_val.innerHTML = factor;

    numberOfPoints = parseInt(randomNumber(50, 500));
    points_slider.value = numberOfPoints;
    points_slider_val.innerHTML = numberOfPoints;
  }

  // function to get random number in the range min, max.
  function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  // function to change the color.
  function changeColor() {
    let index = parseInt(randomNumber(1, colors.length));
    strokeColor = colors[index];
    console.log(strokeColor);
  }

  // function to download and save the image.
  function downloadCanvas() {
    // get canvas data
    var image = canvas.toDataURL();

    // create temporary link
    var tmpLink = document.createElement("a");
    tmpLink.download = "image.png"; // set the name of the download file
    tmpLink.href = image;

    // temporarily add link to body and initiate the download
    document.body.appendChild(tmpLink);
    tmpLink.click();
    document.body.removeChild(tmpLink);
  }
};
