/*global alert: false, confirm: false, console: false, Debug: false, $*/
// http://stackoverflow.com/questions/11042898/calling-view-function-from-another-view-backbone
define(["backbone",
    "jquery",
    'keymaster',
    'ball',
    'models/Preloader',
    'square',
    'segment',
    'sketch',
    'stache!templates/robot',
    'stache!templates/robot_nameplate',
    'stache!templates/robot_placeholder',
    "views/robotNameView",
    "underscore"
  ], function(Backbone, 
    $, 
    key,
    Ball, 
    Preloader,
    Square,
    Segment, 
    sketch, 
    robot_template, 
    robot_nameplate_template,
    robot_placeholder_template,
    RobotNameView,
    _) {
    "use strict";
    


    /**
    *
    * UI
    * 
    * ------------------------------------------------- */
    
    var UI = {
      placeholder: '.js-placeholder',
      robot: '.sketch'
    };
    
    /**
    *
    * States
    * 
    * ------------------------------------------------- */
    
    var STATES = {
        increment: 0
    };


    /**
    *
    * RobotView
    * 
    * ------------------------------------------------- */

    var RobotView = Backbone.View.extend({
      
        tagName: 'div',

        className: 'robot',

        /**
        *
        * Initialize
        * 
        * ------------------------------------------------- */

        initialize: function(options) {

            var self            = this;
    
            self.app_state      = options.app_state;
            self.model          = options.model;
            self.options        = options;
            self.router         = options.router;
            self.routine        = options.routine;
            self.PUPPET         = options.puppet;
            self.viewType       = options.viewType;

            self.preloader      = new Preloader();

            self.ctx            = Sketch.create({
                'container': self.el,
                'fullscreen': true,
                'width': 600,
                'height': 600
            });


            /* Add the necessary class for position
             ------------------------------------------------- */
            
            $(self.el).addClass(self.PUPPET.containerClass);
            

            /* Head
             ------------------------------------------------- */
            
            self.headImage          = new Image();
            self.headImage.src      = self.PUPPET.head.image;

            self.headImage.onload   = function() {

                self.PUPPET.head.pattern    = self.ctx.createPattern(self.headImage, "repeat");
                self.head                   = new Square(self.PUPPET.head.width, self.PUPPET.head.height, 0, -20, self.PUPPET.head.pattern);

            }


            /* Neck
             ------------------------------------------------- */
            
            self.neckImage          = new Image();
            self.neckImage.src      = self.PUPPET.neck.image;

            self.neckImage.onload   = function() {

                self.PUPPET.neck.pattern    = self.ctx.createPattern(self.neckImage, "repeat");
                self.neck                   = new Segment(self.PUPPET.neck);
                self.neck.x                 = self.PUPPET.hips.x;
                self.neck.y                 = self.PUPPET.hips.y - self.PUPPET.spine.length;

            }
           
    
            /* Left Upper Arm
             ------------------------------------------------- */
            
            self.leftUpperArmImage          = new Image();
            self.leftUpperArmImage.src      = self.PUPPET.arms.leftUpperArm.image;

            self.leftUpperArmImage.onload   = function() {

                self.PUPPET.arms.leftUpperArm.pattern       = self.ctx.createPattern(self.leftUpperArmImage, "repeat");
                self.leftUpperArm                           = new Segment(self.PUPPET.arms.leftUpperArm);

            }


            /* Left Lower Arm
             ------------------------------------------------- */
            
            self.leftForearmImage          = new Image();
            self.leftForearmImage.src      = self.PUPPET.arms.leftForearm.image;

            self.leftForearmImage.onload   = function() {

                self.PUPPET.arms.leftForearm.pattern       = self.ctx.createPattern(self.leftForearmImage, "repeat");
                self.leftForearm                           = new Segment(self.PUPPET.arms.leftForearm);

            }

    
            /* Right Arm
             ------------------------------------------------- */
            
            self.rightUpperArmImage          = new Image();
            self.rightUpperArmImage.src      = self.PUPPET.arms.rightUpperArm.image;

            self.rightUpperArmImage.onload   = function() {

                self.PUPPET.arms.rightUpperArm.pattern       = self.ctx.createPattern(self.rightUpperArmImage, "repeat");
                self.rightUpperArm                           = new Segment(self.PUPPET.arms.rightUpperArm);

            }

            /* Right Lower Arm
             ------------------------------------------------- */

            self.rightForearmImage          = new Image();
            self.rightForearmImage.src      = self.PUPPET.arms.rightForearm.image;

            self.rightForearmImage.onload   = function() {

                self.PUPPET.arms.rightForearm.pattern       = self.ctx.createPattern(self.rightForearmImage, "repeat");
                self.rightForearm                           = new Segment(self.PUPPET.arms.rightForearm);

            }
            
    
            /* Spine
             ------------------------------------------------- */
            
            self.spineImage          = new Image();
            self.spineImage.src      = self.PUPPET.spine.image;

            self.spineImage.onload   = function() {

                self.PUPPET.spine.pattern       = self.ctx.createPattern(self.spineImage, "repeat");
                self.spine                      = new Segment(self.PUPPET.spine);
                self.spine.x                    = self.PUPPET.hips.x;
                self.spine.y                    = self.PUPPET.hips.y - self.PUPPET.spine.length;

            }

    
            /* Hips
             ------------------------------------------------- */
            
            self.hips                       = new Ball();

    
            /* Left Upper leg
             ------------------------------------------------- */
            
            self.leftUpperLegImage          = new Image();
            self.leftUpperLegImage.src      = self.PUPPET.legs.left.upperLeg.image;

            self.leftUpperLegImage.onload   = function() {

                self.PUPPET.legs.left.upperLeg.pattern           = self.ctx.createPattern(self.leftUpperLegImage, "repeat");
                self.leftUpperLeg                           = new Segment(self.PUPPET.legs.left.upperLeg); // Seg 0

            }


            /* Left Lower leg
             ------------------------------------------------- */

            self.leftLowerLegImage          = new Image();
            self.leftLowerLegImage.src      = self.PUPPET.legs.left.lowerLeg.image;

            self.leftLowerLegImage.onload   = function() {

                self.PUPPET.legs.left.lowerLeg.pattern           = self.ctx.createPattern(self.leftLowerLegImage, "repeat");
                self.leftLowerLeg                           = new Segment(self.PUPPET.legs.left.lowerLeg); // Seg 0
                self.leftLowerLeg.x                         = self.PUPPET.hips.x - (self.PUPPET.stance.width / 2);
                self.leftLowerLeg.y                         = self.PUPPET.hips.y + self.PUPPET.stance.height; // TODO - move to settings
            
                /* Left Foot
                 ------------------------------------------------- */
            
                self.leftFootImage             = new Image();
                self.leftFootImage.src         = self.PUPPET.feet.left.image;
        
                self.leftFootImage.onload      = function() {
    
                    self.PUPPET.feet.left.pattern                  = self.ctx.createPattern(self.leftFootImage, "repeat");
                    self.leftFoot                                  = new Segment(self.PUPPET.feet.left);
                    self.leftFoot.x                                = self.leftLowerLeg.x + self.PUPPET.feet.left.offset;
                    self.leftFoot.y                                = self.leftLowerLeg.y; 
                
                }

            }

            
            /* Right Upper leg
             ------------------------------------------------- */
            
            self.rightUpperLegImage          = new Image();
            self.rightUpperLegImage.src      = self.PUPPET.legs.right.upperLeg.image;

            self.rightUpperLegImage.onload   = function() {

                self.PUPPET.legs.right.upperLeg.pattern     = self.ctx.createPattern(self.rightUpperLegImage, "repeat");
                self.rightUpperLeg                          = new Segment(self.PUPPET.legs.right.upperLeg); // Seg 0


            }

             /* Right Lower leg
             ------------------------------------------------- */
            
            self.rightLowerLegImage          = new Image();
            self.rightLowerLegImage.src      = self.PUPPET.legs.right.lowerLeg.image;

            self.rightLowerLegImage.onload   = function() {

                self.PUPPET.legs.right.lowerLeg.pattern           = self.ctx.createPattern(self.rightLowerLegImage, "repeat");
                self.rightLowerLeg                          = new Segment(self.PUPPET.legs.right.lowerLeg); // Seg 0
                self.rightLowerLeg.x                        = self.PUPPET.hips.x + (self.PUPPET.stance.width / 2);
                self.rightLowerLeg.y                        = self.PUPPET.hips.y + self.PUPPET.stance.height; // TODO - move to settings

                /* Right Foot
                 ------------------------------------------------- */
                
                self.rightFootImage             = new Image();
                self.rightFootImage.src         = self.PUPPET.feet.right.image;
        
                self.rightFootImage.onload      = function() {
    
                    self.PUPPET.feet.right.pattern                  = self.ctx.createPattern(self.rightFootImage, "repeat");
                    self.rightFoot                                  = new Segment(self.PUPPET.feet.right);
                    self.rightFoot.x                                = self.rightLowerLeg.x + self.PUPPET.feet.right.offset;
                    self.rightFoot.y                                = self.rightLowerLeg.y; 
                
                }

            }

            

            /* Bind render event
             ------------------------------------------------- */
    
            $('#container').append(self.el);


            /* Save the Dance Move and Update the model
             ------------------------------------------------- */
            
            self.listenTo(self.app_state, "onVariableUpdate", function (newModel) {
                
                // Saves the dance move model
                self.model.save(newModel);
    
            });


            /* Triggers the start of the dance on Audio Change
             ------------------------------------------------- */
            
            self.listenTo(self.app_state, "startDance", function (sound) {

                // Show it
                
                self.preloader.reveal(self.el);

                self.model.set('sound_id', sound.get('id'));
                self.model.set('tempo', sound.get('bpm'));

                self.animate();


            });


            /* Load the image if needs be
             ------------------------------------------------- */
            
            if (self.viewType == 'iframe') {


                self.renderPlaceholderImage();

                // Delegate hover events
                self.delegateEvents({
                    'mouseenter .js-placeholder' : 'onPlaceholderEnter',
                    'mousemove': 'onPlaceholderHover',
                    'mouseleave' : 'onPlaceholderLeave',
                    'click': 'onPlaceholderClick'
                });

                /* Immediately trigger mouseleave to display the placeholder image
                 ------------------------------------------------- */

                $(UI.placeholder).show();
                $(UI.robot).hide();

            } else {

                /* Hide this view everywhere but the iframe
                 ------------------------------------------------- */

                self.preloader.hide(self.el);

            }


            /* Show the robot name
             ------------------------------------------------- */
            
            self.renderRobotName();


            /* Load the shadow
             ------------------------------------------------- */
            
            self.renderShadow();
                
            // self.cheats();

        },



        /**
        *
        * Keyboard shortcuts aka Cheats!
        * 
        * ------------------------------------------------- */
        
        cheats: function () {
                
            // var self        = this;

            // key('⌘+s', function (event) {

            //     event.preventDefault();

            //     /* Open a new window and put the JSON in there!
            //      ------------------------------------------------- */
                
            //     var JSONwin = open('url','windowName','height=600,width=800');

            //     var output      = "";

            //     output          += '<pre>';

            //     output          += '{' + '\n';

                
            //     /* Whitelist of variables to save out
            //      ------------------------------------------------- */
            //      var whitelist      = ["masterTempo",
            //         "neck_tempoMultiplier",
            //         "neck_upDown" ,
            //         "neck_leftRight",
            //         "rightForearm_reverse",
            //         "rightForearm_tempoMultiplier" ,
            //         "rightForearm_amount" ,
            //         "rightForearm_angle" ,
            //         "rightUpperArm_reverse",
            //         "rightUpperArm_tempoMultiplier" ,
            //         "rightUpperArm_amount",
            //         "rightUpperArm_angle" ,
            //         "leftForearm_reverse" ,
            //         "leftForearm_tempoMultiplier",
            //         "leftForearm_amount",
            //         "leftForearm_angle" ,
            //         "leftUpperArm_reverse",
            //         "leftUpperArm_tempoMultiplier" ,
            //         "leftUpperArm_amount" ,
            //         "leftUpperArm_angle" ,
            //         "hips_tempoMultiplier",
            //         "hips_upDown"
            //      ];

                
            //     output          += '\t"masterTempo": ' + self.model.get('masterTempo') + ', '+ '\n';
            //     /* Loop through the object attrs
            //      ------------------------------------------------- */
                
            //     _.each(self.model.attributes, function (value, key) {

            //         // Add whitelisted array items
            //         if (_.indexOf(whitelist, key) > 0) {

            //             output          += '\t"' + key + '": ' + value + ', '+ '\n';

            //         }

            //     });

            //     // output          += '\ttesticles' + '\n';

            //     output          += '}' + '\n';

            //     output          += '</pre>';

            //     JSONwin.document.write(output);

            //     // console.log(self.model.toJSON());

            //     return false;

            // });

        },
            

        /**
        *
        * Placeholder hovering
        * 
        * ------------------------------------------------- */
        
        onPlaceholderHover: function () {

            var self        = this;

        },


        /**
        *
        * Placeholder image mouseenter
        * 
        * ------------------------------------------------- */
        
        onPlaceholderEnter: function () {
                
            var self        = this;

            self.app_state.trigger('playSongInIframe');

            $(UI.placeholder).hide();
            $(UI.robot).show();

            /* Show the navigate prompt
             ------------------------------------------------- */
            

        },


        /**
        *
        * Placeholder image mouseleave
        * 
        * ------------------------------------------------- */
        
        onPlaceholderLeave: function () {
                
            var self        = this;

            self.app_state.trigger('stopSongInIframe');

            $(UI.placeholder).show();
            $(UI.robot).hide();

            /* Hide the navigate prompt
             ------------------------------------------------- */

        },



        /**
        *
        * Placeholder image click
        * 
        * ------------------------------------------------- */
        
        onPlaceholderClick: function (event) {
            
            var self        = this;

            event.preventDefault();

            window.open('http://' + window.location.host + '/#watch/' + self.model.get('guid'));

        },
        
        
        

        /**
        *
        * Reach a segment to a point
        * 
        * ------------------------------------------------- */

        reach: function(segment, xpos, ypos, type) {
    
            var dx = xpos - segment.x,
                dy = ypos - segment.y;
        
            segment.rotation = Math.atan2(dy, dx);
        
            if (segment.rotation < 0) {
               segment.rotation += 2 * Math.PI;
            }
        
            var w = segment.getPin().x - segment.x,
                h = segment.getPin().y - segment.y;
            return {
              x: xpos - w,
              y: ypos - h
            };
    
        },


        /**
        *
        * Position a segment
        * 
        * ------------------------------------------------- */

        position: function(segmentA, segmentB) {
    
            segmentA.x = segmentB.getPin().x;
            segmentA.y = segmentB.getPin().y;
    
        },

       

        /**
        *
        * Pin Length - gets the inner length of a segment for use in positioning it's children
        * 
        * ------------------------------------------------- */
        
        pinLength: function (segment) {
            
            return segment.length - segment.topPin - segment.bottomPin;

        },

        
        /**
        *
        * Upper Arm
        * 
        * ------------------------------------------------- */
        
        moveUpperArm: function (type) {
      

            var self = this;
            
            var arm                     = (type == 'left') ? self.leftUpperArm : self.rightUpperArm;
            var amount                  = (type == 'left') ? self.model.attributes.leftUpperArm_amount : self.model.attributes.rightUpperArm_amount;
            var angle                   = (type == 'left') ? self.model.attributes.leftUpperArm_angle : self.model.attributes.rightUpperArm_angle;
            var multiplier              = (type == 'left') ? self.model.attributes.leftUpperArm_tempoMultiplier : self.model.attributes.rightUpperArm_tempoMultiplier;

            var spineAngle              = Math.atan2((self.spine.y - self.hips.y), (self.spine.x - self.hips.x));
            var perpendicularAngle      = spineAngle + Math.PI / 2;
            
            if (type == 'left') {

                arm.x  = (self.spine.x + self.PUPPET.shoulders.xOffset) - ((self.PUPPET.shoulders.width / 2) * (Math.cos(perpendicularAngle)));
                arm.y  = (self.spine.y + self.PUPPET.shoulders.yOffset) - ((self.PUPPET.shoulders.width / 2) * (Math.sin(perpendicularAngle)));
    
            } else {

                arm.x  = (self.spine.x - self.PUPPET.shoulders.xOffset) + ((self.PUPPET.shoulders.width / 2) * (Math.cos(perpendicularAngle)));
                arm.y  = (self.spine.y + self.PUPPET.shoulders.yOffset) + ((self.PUPPET.shoulders.width / 2) * (Math.sin(perpendicularAngle)));

            }   


            /* Reach
            ------------------------------------------------- */
        
            var amplitude           = ((amount) * (Math.PI / 180)) / 2;

            var startPoint          = (type == 'left') ? (90 + parseInt(angle, 10)) : (90 - parseInt(angle, 10));


            /* Reverse or regular direction?
             ------------------------------------------------- */
            
            var is_reversed         = (type == 'left') ? self.model.attributes.leftUpperArm_reverse : self.model.attributes.rightUpperArm_reverse;
            
            var amp                 = (String(is_reversed) == "false") ? (amplitude * Math.sin(STATES.increment * multiplier)) : -(amplitude * Math.sin(STATES.increment * multiplier));
            

            /* Set the Angle & End Point
             ------------------------------------------------- */
            
            var thetaAngle          = (startPoint * (Math.PI / 180)) + amp;
            
            var endPointX           = arm.x + (self.pinLength(self.PUPPET.arms.leftUpperArm) * Math.cos(thetaAngle));
            
            var endPointY           = arm.y + (self.pinLength(self.PUPPET.arms.leftUpperArm) * Math.sin(thetaAngle));

            var destinationPos      = self.reach(arm, endPointX, endPointY);
        
            // Draw
            arm.draw(self.ctx);

            return {
                theta: thetaAngle,
                x: endPointX,
                y: endPointY
            };
    
        },
        

        /**
        *
        * Lower Arm
        * 
        * ------------------------------------------------- */
        
        moveLowerArm: function (armPos, type) {
            
            var self = this;

            var arm                 = (type == 'left') ? self.leftForearm : self.rightForearm;
            var amount              = (type == 'left') ? self.model.attributes.leftForearm_amount : self.model.attributes.rightForearm_amount;
            var angle               = (type == 'left') ? self.model.attributes.leftForearm_angle : self.model.attributes.rightForearm_angle;
            var multiplier          = (type == 'left') ? self.model.attributes.leftForearm_tempoMultiplier : self.model.attributes.rightForearm_tempoMultiplier;


            /* Reverse or regular direction?
             ------------------------------------------------- */

            var amplitude           = (amount * (Math.PI / 180)) / 2;

            var startPoint          = (type == 'left') ? (90 - parseInt(angle, 10)) : (90 + parseInt(angle, 10));


            /* Reverse or regular direction?
             ------------------------------------------------- */

            var is_reversed         = (type == 'left') ? self.model.attributes.leftForearm_reverse : self.model.attributes.rightForearm_reverse;
            
            /* Set the Angle & End Point
             ------------------------------------------------- */


            if (String(is_reversed) == "false") {
                
                var thetaAngle          = (startPoint * (Math.PI / 180)) + (amplitude * Math.sin(STATES.increment * multiplier));

            } else {

                var thetaAngle          = (startPoint * (Math.PI / 180)) - (amplitude * Math.sin(STATES.increment * multiplier));

            }
            
            /* Add the parented angle
             ------------------------------------------------- */
            
            thetaAngle                  = (thetaAngle + armPos.theta) - (90 * (Math.PI / 180));

            arm.x                   = armPos.x;
            arm.y                   = armPos.y;

            var endPointX           = arm.x + (self.PUPPET.arms.lowerLength * Math.cos(thetaAngle));
            var endPointY           = arm.y + (self.PUPPET.arms.lowerLength * Math.sin(thetaAngle));
            
            self.reach(arm, endPointX, endPointY);

            arm.draw(self.ctx);

        },
        
    
        /**
        *
        * Head & Neck
        * 
        * ------------------------------------------------- */
        
        moveHeadAndNeck: function () {
      
            var self = this;
        
            /* Neck
             ------------------------------------------------- */
            
            self.neck.x             = self.spine.x;
            self.neck.y             = self.spine.y;
            
            var neckReachX          = self.spine.x + Math.sin(STATES.increment * self.model.attributes.neck_tempoMultiplier) * (self.model.attributes.neck_leftRight);
            var neckReachY          = self.spine.y + Math.cos(STATES.increment * self.model.attributes.neck_tempoMultiplier) * (self.model.attributes.neck_upDown);
        
            // Reach the next to the new value
            self.reach(self.neck, neckReachX, neckReachY - self.PUPPET.neck.length);
        
            // Draw
            self.neck.draw(self.ctx);
        
            /* Head
             ------------------------------------------------- */
            
            self.head.x   = neckReachX;
            self.head.y   = neckReachY - (self.PUPPET.neck.length + self.PUPPET.head.yOffset);

            // Draw
            self.head.draw(self.ctx);

        },


        /**
        *
        * Spine
        * 
        * ------------------------------------------------- */
        
        moveSpine: function () {
        
            var self = this;
    
            self.spine.y        = self.hips.y - self.PUPPET.spine.length;
        
            var pelvisDiff      = self.PUPPET.hips.x - self.hips.x;
            var neckX           = (pelvisDiff < 0) ? -Math.abs(pelvisDiff) : Math.abs(pelvisDiff);
            self.spine.x        = neckX + self.PUPPET.hips.x;
    
            // Spine/Hips connection
            self.reach(self.spine, self.hips.x, self.hips.y);
    
            // Draw
            self.spine.draw(self.ctx);
    
        },
    
    
        /**
        *
        * Legs
        * 
        * ------------------------------------------------- */
        
        moveLeg: function (type) {
        
            var self        = this;

            var upperLeg    = (type == 'left') ? self.leftUpperLeg : self.rightUpperLeg;
            var lowerLeg    = (type == 'left') ? self.leftLowerLeg : self.rightLowerLeg;
        
            /* Move the legs individually to the relevant position
             ------------------------------------------------- */
            
            var spineAngle              = Math.atan2((self.spine.y - self.hips.y), (self.spine.x - self.hips.x));
            var perpendicularAngle      = spineAngle + Math.PI / 2;
            
            if (type == 'left') {

                var newX        = (self.hips.x + self.PUPPET.hips.xOffset) - ((self.PUPPET.shoulders.width / 2) * (Math.cos(perpendicularAngle)));
                var newY        = (self.hips.y - self.PUPPET.hips.yOffset) - ((self.PUPPET.shoulders.width / 2) * (Math.sin(perpendicularAngle)));
                
                var target      = self.reach(upperLeg, newX, newY);

            } else {

                var newX        = (self.hips.x - self.PUPPET.hips.xOffset) + ((self.PUPPET.shoulders.width / 2) * (Math.cos(perpendicularAngle)));
                var newY        = (self.hips.y - self.PUPPET.hips.yOffset) + ((self.PUPPET.shoulders.width / 2) * (Math.sin(perpendicularAngle)));
                
                var target      = self.reach(upperLeg, newX, newY);

                // Offsets the right left to make them go to different sides
                // target.x        = target.x + 0.1;

            }   

            self.reach(lowerLeg, target.x, target.y);
            self.position(upperLeg, lowerLeg);
        
            /* Draw the legs
             ------------------------------------------------- */
            
            upperLeg.draw(self.ctx);
            lowerLeg.draw(self.ctx);
    
        },
    
    
        /**
        *
        * Hips
        * 
        * ------------------------------------------------- */
        
        moveHips: function () {
        
            var self            = this;

            self.hips.x         = self.PUPPET.hips.x + Math.sin(STATES.increment * self.model.attributes.hips_tempoMultiplier) * (self.model.attributes.hips_leftRight);
            self.hips.y         = self.PUPPET.hips.y + Math.cos(STATES.increment * self.model.attributes.hips_tempoMultiplier) * (self.model.attributes.hips_upDown);
    
            // self.hips.draw(self.ctx);
    
        },
    
        

        /**
        *
        * Renders robot Nameplate
        * 
        * ------------------------------------------------- */
        
        renderRobotName: function() {
                
            var self    = this;

            var robotNameView   = new RobotNameView(self.options);

            if (self.options.viewType == 'watch') {
                
                var nameClass    = 'stage__robot-name--container';

            } else if (self.options.viewType == 'iframe') {

                var nameClass    = 'robot--iframe__robot-name--container';

            } else { 

                var nameClass    = 'robot--edit__robot-name--container';
            }
            
            // Render the robot name and add the edit class
            robotNameView.render(nameClass, self.model.get('robot_name'), self.options.viewType);

        },
        

        /**
        *
        * Load placeholder Image
        * 
        * ------------------------------------------------- */
        
        renderPlaceholderImage: function() {
                
            var self            = this;

            var templateVars    = {
                image : self.PUPPET.preview_image
            };

            var output          = robot_placeholder_template(templateVars);

            $(self.el).append(output);

            return self;

        },


        /**
        *
        * Load the shadow
        * 
        * ------------------------------------------------- */
        
        renderShadow: function () {
            
            var self        = this;

            /* Append the shadow
             ------------------------------------------------- */
            
            $(self.el).append('<div class="robot--shadow robot--edit__robot--shadow"></div>');

        },
        

        /**
        *
        * Render the Draw loop
        * 
        * ------------------------------------------------- */
    
        animate: function(type) {          
    
            var self            = this;
            
            STATES.increment   = 0;

            self.ctx.draw       = function() {
                    
                /* Hack to clear the canvas on iframe embeds
                ------------------------------------------------- */
                        
                if (self.options.viewType == 'iframe') {
    
                    self.ctx.clearRect(0, 0, 600, 600);

                }


                /* Set the master increment
                 ------------------------------------------------- */
        
                STATES.increment   = new Date().getTime() * (self.model.get('tempo') * self.model.get('masterTempo'));
            
                /* Feet
                ------------------------------------------------- */
                    
                self.leftFoot.draw(self.ctx);
                self.rightFoot.draw(self.ctx);


                /* Left Leg
                 ------------------------------------------------- */
                
                self.moveLeg('left');
        
        
                /* Right Leg
                 ------------------------------------------------- */
                
                self.moveLeg('right');

                /* Head & Neck
                 ------------------------------------------------- */
                
                self.moveHeadAndNeck();


                /* Spine
                ------------------------------------------------- */
        
                self.moveSpine();
                

                 /* Hips (invisible)
                ------------------------------------------------- */
            
                self.moveHips();
                
                
                /* Left Arm
                 ------------------------------------------------- */
                
                var leftUpperPos   = self.moveUpperArm('left');

                self.moveLowerArm(leftUpperPos, 'left');

                /* Right Arm
                 ------------------------------------------------- */
                
                var rightUpperPos   = self.moveUpperArm('right');

                self.moveLowerArm(rightUpperPos, 'right');

            
    
            }

            return self;
    
        }

    });

    return RobotView;

  
});