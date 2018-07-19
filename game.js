function Game(genome) {
  this.brain = genome;
  this.brain.score = 0;

  this.done = false;

  this.ball = new Ball(this);
  this.leftPaddle = new Paddle(30, 1, this);
  this.rightPaddle = new Paddle(470, 2, this);

  // show all (square)
  this.show = function () {
    if (this.done) {
      return;
    }

    this.ball.show();
    this.leftPaddle.show();
    this.rightPaddle.show();
  }

  // update physics and check if dead
  this.update = function () {
    if (this.done) {
      return;
    }

    this.ball.update();
    this.leftPaddle.update();
    this.rightPaddle.update();
    this.ball.checkCollide(this.leftPaddle);
    this.ball.checkCollide(this.rightPaddle);
  }

}
