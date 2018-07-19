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

  this.update = function () {
    if (isPersonPlaying && this.side == 2) {
      var newY = constrain(mouseY, this.height / 2, height - this.height / 2);
    } else {
      var input = this.detect();
      var output = (this.side == 1 ? this.game.leftBrain : alreadyTrainedBrain).activate(input);

      this.vy = output[0];

      var newY = constrain(this.y + this.vy, this.height / 2, height - this.height / 2);

      var diff = Math.abs(newY - this.y);
      this.distanceTraveled += diff;

      // reduce points for moving a lot but add points for making other paddle move a lot
      this.game.leftBrain.score += (this.side == 1 ? -1 : 1) * diff / 500.0;
      updateHighestScore(this.game.leftBrain.score);
    }

    this.y = newY;
  }

  this.show = function () {
    fill(255);
    rect(this.x, this.y, this.width, this.height);
  }

  // inputs: vertical displacement of ball from center of paddle, horizontal displacement of ball from center of paddle, ball horizontal velocity, ball vertical velocity, paddle velocity (5)

  this.detect = function () {
    // multiply some by negative if left so that the ai does not depend on the side to learn (e.g. a ball in between the paddles is a positive number to the ai all the time)
    var inputs = [
      this.game.ball.y - this.y, // vertical displacement of ball from center of paddle
      (this.side == 1 ? -1 : 1) * (this.x - this.game.ball.x), // horizontal displacement of ball from center of paddle
      (this.side == 1 ? -1 : 1) * this.game.ball.vx, // ball horizontal velocity
      (this.side == 1 ? -1 : 1) * this.game.ball.vy, // ball vertical velocity
      this.vy // paddle velocity
    ];
    return inputs;
  }

}
