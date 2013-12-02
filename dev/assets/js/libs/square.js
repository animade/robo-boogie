/**
*
* Draws a canvas square with a background image
* 
* ------------------------------------------------- */

function Square (width, height, xOffset, yOffset, pattern) {

    var self        = this;

    self.w          = width;
    self.h          = height;
    self.pattern    = pattern;
    self.xOffset    = xOffset;
    self.yOffset    = yOffset;

    self.x          = 0;
    self.y          = 0;
    self.vx         = 0;
    self.vy         = 0;
    self.rotation   = 0;
    self.scaleX     = 1;
    self.scaleY     = 1;
    self.color      = '#ccc';
    self.lineWidth  = 0;

}


/**
*
* Draw function
* 
* ------------------------------------------------- */

Square.prototype.draw = function (context) {

    var self        = this;

    context.save();
    
    context.translate((self.x - (self.w / 2)) + self.xOffset, (self.y - (self.h / 2)) + self.yOffset);
    
    context.rotate(self.rotation);
    
    context.scale(self.scaleX, self.scaleY);
    
    context.fillStyle   = self.pattern;
    
    context.fillRect(0, 0, self.w, self.h);
    
    context.fill();
    
    context.restore();

};

Square.prototype.getBounds = function () {
  return {
    x: this.x - this.radius,
    y: this.y - this.radius,
    width: this.radius * 2,
    height: this.radius * 2
  };
};
