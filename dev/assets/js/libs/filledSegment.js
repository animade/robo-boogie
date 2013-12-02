function FilledSegment (options) {

    var self        = this;

    self.length         = options.length;
    self.width          = options.width;
    self.pattern        = options.pattern;
    self.xOffset        = options.xOffset;
    self.yOffset        = options.yOffset;

    self.x              = 0;
    self.y              = 0;
    
    self.rotation       = 0;

    // console.log(self.length);
    // console.log(self.width);
   
}

FilledSegment.prototype.draw = function (context) {

    var self = this;
     var h = this.height,
      d = this.width + h, //top-right diagonal
      cr = h / 2;         //
    
    context.save();

    context.translate((self.x + (self.width/2)) + self.xOffset, self.y + self.yOffset);

    context.rotate(self.rotation);

    context.fillStyle       = self.pattern;

    context.fillRect(0, 0, self.length, self.width);
    context.beginPath();
  context.moveTo(0, -cr);
  context.lineTo(d-2*cr, -cr);
  context.quadraticCurveTo(-cr+d, -cr, -cr+d, 0);
  context.lineTo(-cr+d, h-2*cr);
  context.quadraticCurveTo(-cr+d, -cr+h, d-2*cr, -cr+h);
  context.lineTo(0, -cr+h);
  context.quadraticCurveTo(-cr, -cr+h, -cr, h-2*cr);
  context.lineTo(-cr, 0);
  context.quadraticCurveTo(-cr, -cr, 0, -cr);
  context.closePath();

    context.fill();
    

    //draw the 2 "pins"
  context.beginPath();
  context.arc(0, 0, 2, 0, (Math.PI * 2), true);
  context.closePath();
  context.fillStyle   = '#09f';
  context.fill();

  context.beginPath();
  context.arc(this.width, 0, 2, 0, (Math.PI * 2), true);
  context.closePath();
  context.fillStyle   = '#f00';
  context.fill();
  
  context.restore();

};

FilledSegment.prototype.getPin = function () {
  return {
    x: this.x + Math.cos(this.rotation) * this.width,
    y: this.y + Math.sin(this.rotation) * this.width
  };
};