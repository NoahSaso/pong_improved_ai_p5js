var games = [];

var highestScore = 0;
var curHighestScore = 0;

var isPersonPlaying = false,
  isAIPlaying = false;

var ballSpeed = 6;
var randomBounceRate = 0.2;

// divide by 2 everywhere because that is the game count
// populationSize must always be even, so let user set game count and then double it
var populationSize = 700;

function gameCount() {
  return populationSize / 2;
}

var ballSpeedP, ballSpeedSlider;
var gameCountP, gameCountSlider;

var previousPopulation;

var endEvalButton;

var baseFrame = 0;

var END_FRAME_COUNT = 750;

var loadingFile = false;

function configChanged() {
  ballSpeed = ballSpeedSlider.value();
  ballSpeedP.html('Ball Speed: ' + ballSpeed);
  if (gameCount() != gameCountSlider.value()) {
    populationSize = gameCountSlider.value() * 2;
    gameCountP.html('Game Count: ' + gameCount());
    initNeat(true);
    endEvaluation();
  }
}

function loadUserAI(event) {
  let file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = (e) => {
    eval(e.target.result.replace('trainedPop', 'loadedTrainedPop'));
    isPersonPlaying = false;
    isAIPlaying = false;
    getPopulationFromFile(loadedTrainedPop);
    infoP.html(infoPHTML());
    startEvaluation();
    loadingFile = false;
  }
  loadingFile = true;
  reader.readAsText(file);
}

function infoPHTML() {
  return `Generation: ${neat.generation}<br>Highest Score: ${highestScore}<br>Current Highest Score: ${curHighestScore}<br>Remaining Frames: ${END_FRAME_COUNT - (frameCount - baseFrame)}`;
}

function setup() {
  var canvas = createCanvas(500, 500);
  canvas.parent('sketch');
  rectMode(CENTER);
  initNeat();

  infoP = createP(infoPHTML());

  // config
  endEvalButton = createButton('Next Generation');
  endEvalButton.mousePressed(endEvaluation);

  ballSpeedP = createP('Ball Speed: ' + ballSpeed);
  ballSpeedSlider = createSlider(1, 20, ballSpeed);
  ballSpeedSlider.changed(configChanged);

  gameCountP = createP('Game Count: ' + gameCount());
  gameCountSlider = createSlider(2, 10000, gameCount());
  gameCountSlider.changed(configChanged);

  createButton('Load Premade Trained AI (Will Delete Current AI)').mousePressed(() => {
    isPersonPlaying = false;
    isAIPlaying = false;
    getPopulationFromFile();
    infoP.html(infoPHTML());
    startEvaluation();
  });

  createButton('Play Premade Trained AI (Will Delete Current AI)').mousePressed(() => {
    endEvalButton.html('Reset AI Training (Stop AI/Player Game)');
    isAIPlaying = false;
    isPersonPlaying = true;
    getPopulationFromFile();
    infoP.html(infoPHTML());
    neat.sort();
    games = [new Game(neat.population[0], neat.population[1])];
  });

  createButton('Watch AI vs. AI').mousePressed(() => {
    endEvalButton.html('Resume AI Training (Stop AI/Player Game)');
    isPersonPlaying = false;
    isAIPlaying = true;
    neat.sort();
    games = [new Game(neat.population[0], neat.population[1])];
  });

  createButton('Save This AI').mousePressed(saveCurrentPopulation);

  createButton('Play This AI').mousePressed(() => {
    endEvalButton.html('Resume AI Training (Stop AI/Player Game)');
    isAIPlaying = false;
    isPersonPlaying = true;
    neat.sort();
    games = [new Game(neat.population[0], neat.population[1])];
  });

  // createP('Load Your Own Trained AI:');
  // createFileInput((file) => {
  //   // let fr = new FileReader();
  //   // fr.onload = (event) => {
  //   //   console.log(event.target.results);
  //   // };
  //   console.log(file);
  //   // fr.readAsText(file.data);
  // });

  startEvaluation();
}

function draw() {
  background(51);

  if (loadingFile) {
    return;
  }

  curHighestScore = 0;
  for (var i = 0; i < games.length; i++) {
    var leftScore = Math.round(games[i].leftBrain.score);
    var rightScore = Math.round(games[i].rightBrain.score);
    if (leftScore > curHighestScore) {
      curHighestScore = leftScore;
    }
    if (rightScore > curHighestScore) {
      curHighestScore = rightScore;
    }
    if (curHighestScore > highestScore) {
      highestScore = curHighestScore;
    }
  }

  infoP.html(infoPHTML());

  if (!isPersonPlaying && !isAIPlaying && (frameCount - baseFrame) >= END_FRAME_COUNT) {
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

