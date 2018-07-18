var games = [];

var remainingAlive = GAME_COUNT;

var highestScore = 0;
var curHighestScore = 0;

var isPersonPlaying = false;

var ballSpeed = 6;
var randomBounceRate = 0.2;

var ballSpeedP, ballSpeedSlider;

var configChanged = function() {
  ballSpeed = ballSpeedSlider.value();
  ballSpeedP.html('Ball Speed: ' + ballSpeed);
}

function beginHumanPlay() {
  isPersonPlaying = true;
  if (!USE_TRAINED_POP) {
    // load my trained population (defined in trainedpop.js)
    var newPop = [];
    for (var i = 0; i < GAME_COUNT; i++) {
      var json = trainedPop[i % trainedPop.length];
      newPop[i] = neataptic.Network.fromJSON(json);
    }
    neat.population = newPop;
  }
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

  button = createButton('Save Current Population');
  button.mousePressed(saveCurrentPopulation);

  button = createButton('Play Trained AI');
  button.mousePressed(beginHumanPlay);

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

  if (!isPersonPlaying && (allHaveFinished || curHighestScore >= 300)) {
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

