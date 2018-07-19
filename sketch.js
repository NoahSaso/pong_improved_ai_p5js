var games = [];

var highestScore = 0;
var curHighestScore = 0;

var isPersonPlaying = false,
  isAIPlaying = false;

var ballSpeed = 6;
var randomBounceRate = 0.2;

var populationSize = 750;

var ballSpeedP, ballSpeedSlider;
var populationSizeP, populationSizeSlider;

var previousPopulation;

var endEvalButton;

var baseFrame = 0;

var END_FRAME_COUNT = 500;

var loadingFile = false;

var alreadyTrainedBrain;

function updateHighestScore(newScore) {
  if (newScore > curHighestScore) {
    curHighestScore = newScore;
  }
  if (curHighestScore > highestScore) {
    highestScore = curHighestScore;
  }
}

function configChanged() {
  ballSpeed = ballSpeedSlider.value();
  ballSpeedP.html('Ball Speed: ' + ballSpeed);
  if (populationSize != populationSizeSlider.value()) {
    populationSize = populationSizeSlider.value();
    populationSizeP.html('Population Size: ' + populationSize);
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

  populationSizeP = createP('Population Size: ' + populationSize);
  populationSizeSlider = createSlider(2, 10000, populationSize);
  populationSizeSlider.changed(configChanged);

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
    games = [new Game(neat.population[0])];
  });

  createButton('Watch AI vs. AI').mousePressed(() => {
    endEvalButton.html('Resume AI Training (Stop AI/Player Game)');
    isPersonPlaying = false;
    isAIPlaying = true;
    neat.sort();
    games = [new Game(neat.population[0])];
  });

  createButton('Save This AI').mousePressed(saveCurrentPopulation);

  createButton('Play This AI').mousePressed(() => {
    endEvalButton.html('Resume AI Training (Stop AI/Player Game)');
    isAIPlaying = false;
    isPersonPlaying = true;
    neat.sort();
    games = [new Game(neat.population[0])];
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

  alreadyTrainedBrain = neataptic.Network.fromJSON(trainedPongAIPop.data[0]);

  startEvaluation();
}

function draw() {
  background(51);

  if (loadingFile) {
    return;
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

