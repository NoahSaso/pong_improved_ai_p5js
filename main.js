var Neat = neataptic.Neat;
var Methods = neataptic.methods;
var Architect = neataptic.architect;

var neat, network;

var MUTATION_RATE = 0.3;
var ELITISM_RATE = 0.1;

var USE_TRAINED_POP = false; // use already trained population

// inputs: vertical displacement of ball from center of paddle, horizontal displacement of ball from center of paddle, ball horizontal velocity, ball vertical velocity, paddle velocity (5)
// outputs: vertical paddle velocity (1)

function initNeat(isResetting) {
  if (isResetting) {
    var oldPop = neat.population;
  }
  // hidden layer nodes rule of thumb: inputs + outputs = 5 + 1 = 6
  network = new Architect.Perceptron(5, 6, 1);
  neat = new Neat(
    5,
    1,
    null,
    {
      mutation: [
        Methods.mutation.ADD_NODE,
        Methods.mutation.SUB_NODE,
        Methods.mutation.ADD_CONN,
        Methods.mutation.SUB_CONN,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_BIAS,
        Methods.mutation.MOD_ACTIVATION,
        Methods.mutation.ADD_GATE,
        Methods.mutation.SUB_GATE,
        Methods.mutation.ADD_SELF_CONN,
        Methods.mutation.SUB_SELF_CONN,
        Methods.mutation.ADD_BACK_CONN,
        Methods.mutation.SUB_BACK_CONN
      ],
      popsize: populationSize,
      mutationRate: MUTATION_RATE,
      elitism: Math.round(ELITISM_RATE * populationSize),
      network: network
    }
  );
  neat.generation = 1;
  if (isResetting) {
    // copy previous population into new population
    var smallerSize = populationSize < oldPop.length ? populationSize : oldPop.length;
    for (var i = 0; i < smallerSize; i++) {
      neat.population[i] = oldPop[i];
    }
  } else if (USE_TRAINED_POP) {
    getPopulationFromFile();
  }
}

function getPopulationFromFile(newPopArray) {
  // Convert the json to an array of networks
  var popArray = newPopArray || trainedPop;
  var newPop = [];
  for (var i = 0; i < populationSize; i++) {
    var json = popArray.data[i % popArray.data.length]; // use modulo to loop back to beginning of array in case population size is too big
    newPop[i] = neataptic.Network.fromJSON(json);
  }
  neat.population = newPop;
  neat.generation = popArray.gen;
}

function startEvaluation() {
  games = [];
  for (var genome in neat.population) {
    genome = neat.population[genome];
    games.push(new Game(genome));
  }
  remainingAlive = games.length;
  baseFrame = frameCount;
}

function endEvaluation() {
  if (isPersonPlaying || isAIPlaying) {
    isPersonPlaying = false;
    isAIPlaying = false;
    endEvalButton.html('Next Generation');
    startEvaluation();
  } else {
    neat.sort();
    var newGames = [];

    for (var i = 0; i < neat.elitism; i++) {
      newGames.push(neat.population[i]);
    }

    for (var i = 0; i < neat.popsize - neat.elitism; i++) {
      newGames.push(neat.getOffspring());
    }

    neat.population = newGames;
    neat.mutate();

    neat.generation++;
    startEvaluation();
  }
}

function saveCurrentPopulation() {
  neat.sort();
  var fileName = `trained_population-${Math.floor(new Date() / 1000)}.js`;
  var blob = new Blob([`var trainedPop = JSON.parse('${JSON.stringify({ gen: neat.generation, data: neat.population })}');`], { type: 'text/json' }),
    e = document.createEvent('MouseEvents'),
    a = document.createElement('a');
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  a.dispatchEvent(e);
}
