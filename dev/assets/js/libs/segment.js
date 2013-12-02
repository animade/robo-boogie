/**
*
* Robot Body segments
* 
* ------------------------------------------------- */
  
function Segment (PUPPET_SEGMENT) {


    /* References
     ------------------------------------------------- */
    
    var self                    = this;
    
    self.PUPPET_SEGMENT         = PUPPET_SEGMENT;


    /* Altert the length (height) of the segment to allow for pivot points
     ------------------------------------------------- */

    self.l  = parseInt(self.PUPPET_SEGMENT.length - (self.PUPPET_SEGMENT.topPin + self.PUPPET_SEGMENT.bottomPin), 10);

    /* Variables
     ------------------------------------------------- */
    
    self.x                      = 0;
                
    self.y                      = 0;
                
    self.width                  = self.l;
                
    self.height                 = self.PUPPET_SEGMENT.width;
                
    self.pattern                = self.PUPPET_SEGMENT.pattern;
                
    self.rotation               = 0;
                
    self.cr                     = self.height / 2;


}


/**
*
* Draw method 
* 
* ------------------------------------------------- */


Segment.prototype.draw = function (context) {

    var self        = this;
    
    var h = self.height,
        d = self.width + h, //top-right diagonal
        cr = self.cr;         //corner radius


    /* Initial Setup
     ------------------------------------------------- */
    
    context.save();
    
    context.translate(self.x, self.y);
    
    context.rotate(self.rotation);

    
    /* Draw the main body of the limb
     ------------------------------------------------- */

    // Begin the path
    context.beginPath();
    
    // Apply the pattern
    context.fillStyle       = self.pattern;
    
    var offset_x            = 0;
    var offset_y            = self.cr;

    context.save();
    
    context.translate(offset_x - self.PUPPET_SEGMENT.topPin, offset_y);
    
    // Top, Left, limb length, limb width
    context.fillRect(0 - offset_x, -self.cr - offset_y, self.width + (self.PUPPET_SEGMENT.topPin + self.PUPPET_SEGMENT.bottomPin), self.height);

    context.restore();

    context.save();
    
    context.translate(-self.cr, 0);

    context.restore();

    // Close the path
    context.closePath();

  
    /* Draw pins (dev only)
    ------------------------------------------------- */
    
    // context.beginPath();
    // context.arc(0, 0, 2, 0, (Math.PI * 2), true);
    // context.closePath();
    // context.fillStyle   = '#09f';
    // context.fill();
    
    // context.beginPath();
    // context.arc(self.width, 0, 2, 0, (Math.PI * 2), true);
    // context.closePath();
    // context.fillStyle   = '#f00';
    // context.fill();

    
    /* Restore the canvas 
     ------------------------------------------------- */
    
    context.restore();


};


/**
*
* Get Pin utility function
* 
* ------------------------------------------------- */

Segment.prototype.getPin = function () {

    var self = this;

    return {
        x: self.x + Math.cos(self.rotation) * (self.width),
        y: self.y + Math.sin(self.rotation) * (self.width)
    };

};