var MAX_BOUNCE_ANGLE;

function Ball(game) {
  this.x = width / 2;
  this.y = height / 2;
  // random direction
  this.vx = random([-1, 1]) * ballSpeed;
  this.vy = random([-1, 1]) * random(2);
  this.size = 8;

  // put here because PI is defined by p5js, not available at top of file outside of function
  MAX_BOUNCE_ANGLE = 7 * PI / 18; // 70 degrees

  this.game = game;

  this.update = function() {
    this.x += this.vx;
    this.x = constrain(this.x, this.size / 2, width - this.size / 2);
    this.y += this.vy;
    this.y = constrain(this.y, this.size / 2, height - this.size / 2);
    // if within 1 pixel of bottom or top of screen, flip y velocity
    if (this.y - this.size / 2 <= 1 || this.y + this.size / 2 >= height - 1) {
      this.vy *= -1;
    }
    // if ball left barrier 10 pixels to the left of left paddle left barrier or ball right barrier 10 pixels to the right of right paddle right barrier
    if (this.x - this.size / 2 <= this.game.leftPaddle.x - this.game.leftPaddle.width / 2 - 10 || this.x + this.size / 2 >= this.game.rightPaddle.x + this.game.rightPaddle.width / 2 + 10) {
      if (isPersonPlaying) {
        this.game.brain.score = 0;
        this.reset();
      } else {
        // this.reset();
        this.game.done = true;
        // take away points the longer it travels -- we want it to be very efficient
        // the divide by 2 is just to wait it a little from the actual score idk lol
        this.game.brain.score -= this.game.paddleDistanceTraveled / 2;
      }
    }
  }

  this.reset = function() {
    this.x = width / 2;
    this.y = height / 2;
    this.vx = random([-1, 1]) * ballSpeed;
    this.vy = random([-1, 1]) * random(2);
    this.game.leftPaddle.y = height / 2;
    this.game.leftPaddle.vy = 0;
    this.game.rightPaddle.y = height / 2;
    this.game.rightPaddle.vy = 0;
  }

  this.show = function () {
    fill(255);
    rect(this.x, this.y, this.size, this.size);
  }

  this.checkCollide = function (paddle) {
    if (paddle.side == 1) {
      // check if left ball barrier less than paddle right barrier and right ball barrier greater than paddle left barrier (in case it gets stuck behind for some unexplainable reason)
      var withinPaddleX = this.x - this.size / 2 <= paddle.x + paddle.width / 2 && this.x - this.size / 2 >= paddle.x - paddle.width / 2;
    } else {
      // check if right ball barrier greater than paddle left barrier and left ball barrier less than paddle right barrier (in case it gets stuck behind for some unexplainable reason)
      var withinPaddleX = this.x + this.size / 2 >= paddle.x - paddle.width / 2 && this.x + this.size / 2 <= paddle.x + paddle.width / 2;
    }
    // check ball bottom barrier greater than paddle top barrier and ball top barrier less than paddle bottom barrier
    let withinPaddleY = this.y + this.size / 2 > paddle.y - paddle.height / 2 && this.y - this.size / 2 < paddle.y + paddle.height / 2;
    if (withinPaddleX && withinPaddleY) {
      // // switch x direction and increase ball y velocity by a factor of the paddle's y velocity
      // this.vx *= -1;
      // if (paddle.vy != 0) {
      //   this.vy += paddle.vy * 0.4;
      // }

      // some ball logic I found online: https://gamedev.stackexchange.com/questions/4253/in-pong-how-do-you-calculate-the-balls-direction-when-it-bounces-off-the-paddl
      var relativeIntersectY = paddle.y - this.y;
      var normalizedRelativeIntersectionY = relativeIntersectY / (paddle.height / 2);
      var bounceAngle = normalizedRelativeIntersectionY * MAX_BOUNCE_ANGLE;
      this.vx = (paddle.side == 1 ? 1 : -1) * ballSpeed * Math.cos(bounceAngle);
      this.vy = ballSpeed * -Math.sin(bounceAngle);
      // my own logic to introduce some randomness occasionally
      if (random(1) < randomBounceRate) {
        this.bounceAngle += random([-1, 1]) * random(10);
        this.bounceAngle = constrain(this.bounceAngle, -MAX_BOUNCE_ANGLE, MAX_BOUNCE_ANGLE);
      }
    }
  }
}
