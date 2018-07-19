function Paddle(x, side, game) {
  this.x = x;
  this.width = 10;
  this.height = 85;
  this.y = height / 2;
  this.vy = 0;
  this.side = side; // 1 = left, 2 = right

  this.game = game;

  this.hasHit = false;

  this.distanceTraveled = 0;

  this.stoppedFor = 0;

  this.update = function () {
    if (isPersonPlaying && this.side == 2) {
      var newY = constrain(mouseY, this.height / 2, height - this.height / 2);
    } else {
      var input = this.detect();
      var output = (this.side == 1 ? this.game.leftBrain : (isAIPlaying ? this.game.rightBrain : alreadyTrainedBrain)).activate(input);

      this.vy = output[0];

      var newY = constrain(this.y + this.vy, this.height / 2, height - this.height / 2);

      var diff = Math.abs(newY - this.y);
      this.distanceTraveled += diff;

      if (diff < 1) {
        this.stoppedFor += 1;
      } else {
        this.stoppedFor = 0;
      }

      // reduce points for moving a lot but add points for making other paddle move a lot
      this.game.leftBrain.score += (this.side == 1 ? -1 : 1) * diff / 1000.0;
      updateHighestScore(this.game.leftBrain.score);
    }

    this.y = newY;
  }

  this.show = function () {
    fill(255);
    rect(this.x, this.y, this.width, this.height);
  }

  this.detect = function () {
    // multiply some by negative if left so that the ai does not depend on the side to learn (e.g. a ball in between the paddles is a positive number to the ai all the time)
    if (!isAIPlaying && !isPersonPlaying && this.side == 2) {
      // pretrained ai takes different inputs
      var inputs = [
        this.game.ball.y - this.y, // vertical displacement of ball from center of paddle
        (this.side == 1 ? -1 : 1) * (this.x - this.game.ball.x), // horizontal displacement of ball from center of paddle
        (this.side == 1 ? -1 : 1) * this.game.ball.vx, // ball horizontal velocity
        (this.side == 1 ? -1 : 1) * this.game.ball.vy, // ball vertical velocity
        this.vy // paddle velocity
      ];
    } else {
      var inputs = [
        this.game.ball.y, // distance of ball from top of screen
        height - this.game.ball.y, // distance of ball from bottom of screen
        this.y, // distance of paddle from top of screen
        height - this.y, // distance of paddle from bottom of screen
        (this.side == 1 ? -1 : 1) * (this.x - this.game.ball.x), // horizontal displacement of ball from center of paddle
        (this.side == 1 ? -1 : 1) * this.game.ball.vx, // ball horizontal velocity
        (this.side == 1 ? -1 : 1) * this.game.ball.vy, // ball vertical velocity
        this.vy, // paddle velocity
        (this.side == 1 ? this.game.rightPaddle : this.game.leftPaddle).y, // other paddle distance from top of screen
        height - (this.side == 1 ? this.game.rightPaddle : this.game.leftPaddle).y // other paddle distance from bottom of screen
      ];
    }
    return inputs;
  }

}
