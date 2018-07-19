var games = [];

var highestScore = 0;
var curHighestScore = 0;

var isPersonPlaying = false,
  isAIPlaying = false;

var ballSpeed = 6;
var randomBounceRate = 0.2;

var populationSize = 500;

var remainingAlive = populationSize;

var ballSpeedP, ballSpeedSlider;
var populationSizeP, populationSizeSlider;

var previousPopulation;

var endEvalButton;

var baseFrame = 0;

var END_FRAME_COUNT = 1000;

var configChanged = function() {
  ballSpeed = ballSpeedSlider.value();
  ballSpeedP.html('Ball Speed: ' + ballSpeed);
  if (populationSize != populationSizeSlider.value()) {
    populationSize = populationSizeSlider.value();
    populationSizeP.html('Population Size: ' + populationSize);
    initNeat(true);
    endEvaluation();
  }
}

function beginHumanPlay() {
  endEvalButton.html('Begin AI Training (Stop AI/Player Game)');
  isAIPlaying = false;
  isPersonPlaying = true;
  if (!USE_TRAINED_POP) {
    getPopulationFromFile();
  }
  neat.sort();
  games = [new Game(neat.population[0])];
}

function beginAIPlay() {
  endEvalButton.html('Begin AI Training (Stop AI/Player Game)');
  isPersonPlaying = false;
  isAIPlaying = true;
  // load my trained population (defined in trainedpop.js)
  getPopulationFromFile();
  neat.sort();
  games = [new Game(neat.population[0])];
}

function infoPHTML() {
  return `Generation: ${neat.generation}<br>Highest Score: ${highestScore}<br>Current Highest Score: ${curHighestScore}<br>Remaining Alive: ${remainingAlive}`;
}

function setup() {
  var canvas = createCanvas(500, 500);
  canvas.parent('sketch');
  rectMode(CENTER);
  initNeat();

  infoP = createP(infoPHTML());

  // config
  ballSpeedP = createP('Ball Speed: ' + ballSpeed);
  ballSpeedSlider = createSlider(1, 20, ballSpeed);
  ballSpeedSlider.changed(configChanged);

  populationSizeP = createP('Population Size: ' + populationSize);
  populationSizeSlider = createSlider(2, 10000, populationSize);
  populationSizeSlider.changed(configChanged);

  endEvalButton = createButton('Next Generation');
  endEvalButton.mousePressed(endEvaluation);

  createButton('Save Current Population').mousePressed(saveCurrentPopulation);
  createButton('Watch AI vs. AI').mousePressed(beginAIPlay);
  createButton('Play Trained AI').mousePressed(beginHumanPlay);

  startEvaluation();
}

function draw() {
  background(51);

  curHighestScore = 0;
  remainingAlive = 0;
  var allHaveFinished = true;
  for (var i = 0; i < games.length; i++) {
    var score = Math.round(games[i].brain.score);
    if (score > curHighestScore) {
      curHighestScore = score;
    }
    if (curHighestScore > highestScore) {
      highestScore = curHighestScore;
    }
    if (!games[i].done) {
      remainingAlive++;
      allHaveFinished = false;
    }
  }

  infoP.html(infoPHTML());

  if (!isPersonPlaying && !isAIPlaying && (allHaveFinished || (frameCount - baseFrame) >= END_FRAME_COUNT)) {
    endEvaluation();
    return;
  }

  for (var i = 0; i < games.length; i++) {
    for (var j = 0; j < ballSpeed; j++) {
      games[i].update();
    }
    games[i].show();
  }
}

