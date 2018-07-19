function Paddle(x, side, game) {
  this.x = x;
  this.width = 10;
  this.height = 85;
  this.y = height / 2;
  this.vy = 0;
  this.side = side; // 1 = left, 2 = right

  this.game = game;

  this.stoppedFor = 0;

  this.update = function () {
    // W S for left, up down for right
    // let down = keyIsDown(this.side == 1 ? 83 : DOWN_ARROW);
    if (isPersonPlaying && this.side == 2) {
      var newY = constrain(mouseY, this.height / 2, height - this.height / 2);
    } else {
      var input = this.detect();
      var output = this.game.brain.activate(input);

      this.vy = output[0];

      var newY = constrain(this.y + this.vy, this.height / 2, height - this.height / 2);

      var diff = Math.abs(newY - this.y);

      if (diff < 1) {
        this.stoppedFor++;
      } else {
        this.stoppedFor = 0;
      }

      // take away points the longer it travels -- we want it to be very efficient
      // divide to reduce the effect of 1 pixel (traveling 500 pixels, which is the height of the screen, reduces 1/4 point)
      this.game.brain.score -= diff / 2000.0;
    }

    this.y = newY;
  }

  this.show = function () {
    fill(255);
    rect(this.x, this.y, this.width, this.height);
  }

  // inputs: vertical displacement of ball from center of paddle, horizontal displacement of ball from center of paddle, ball horizontal velocity, ball vertical velocity, paddle velocity, other paddle vertical displacement (6)

  this.detect = function () {
    // multiply some by negative if left so that the ai does not depend on the side to learn (e.g. a ball in between the paddles is a positive number to the ai all the time)
    var inputs = [
      this.game.ball.y - this.y, // vertical displacement of ball from center of paddle
      (this.side == 1 ? -1 : 1) * (this.x - this.game.ball.x), // horizontal displacement of ball from center of paddle
      (this.side == 1 ? -1 : 1) * this.game.ball.vx, // ball horizontal velocity
      (this.side == 1 ? -1 : 1) * this.game.ball.vy, // ball vertical velocity
      this.vy, // paddle velocity,
      (this.side == 1 ? this.game.rightPaddle : this.game.leftPaddle).y - this.y // other paddle vertical displacement
    ];
    return inputs;
  }

}
