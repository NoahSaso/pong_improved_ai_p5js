function Game(leftGenome, rightGenome) {
  this.done = false;

  this.leftBrain = leftGenome;
  this.leftBrain.score = 0;

  if (rightGenome) {
    this.rightBrain = rightGenome;
    this.rightBrain.score = 0;
  }

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
