define(["backbone",
    "jquery",
    'transit',
    "hbars!templates/robot_name",
    "hbars!templates/click_prompt",
    'models/Preloader',
    "models/RobotNameModel",
    "underscore"
  ], function(Backbone, $, transition, robot_name_template, click_prompt_template, Preloader, RobotNameModel, _) {
    "use strict";

    /**
    *
    * UI
    * 
    * ------------------------------------------------- */
    
    var UI          = {
        name: '.js-name',
        prompt: '.js-prompt',
        robotNameMargin: 10,
        robotNameSpeed: 150,
        robotNameDelay: 50

    };
   

    /**
    *
    * RobotNameView
    * 
    * ------------------------------------------------- */

    var RobotNameView = Backbone.View.extend({
    
        tagName: 'div',
        className: 'robot-name--container',

        events : {},

        initialize: function(options) {

            var self        = this;

            self.app_state  = options.app_state;
            self.router     = options.router;
            self.viewType   = options.viewType;

            self.preloader  = new Preloader();

            /* Get the robot names 
             ------------------------------------------------- */
            
            self.robotNames     = new RobotNameModel();

            /* Append the view to the DOM
            ------------------------------------------------- */
        
            $('#container').append(self.el);

            /* Reveal it if necessary
             ------------------------------------------------- */
            
            if (self.viewType == 'watch' || self.viewType == 'iframe') {

                self.listenTo(self.app_state, 'startDance', function () {

                    self.preloader.reveal(self.el);

                });

            }



        
        },

        render: function(className, robotName) {          
        
            var self        = this;
            var output      = '';
                
            /* Is there a name set on the robot already?
            ------------------------------------------------- */

            robotName       = (_.isUndefined(robotName)) ? '' : robotName;

            if (robotName.length > 1) {

                // Break the name up
                var words           = robotName.split(' ');
                
                var templateVars    = {
                    prefix: words[0],
                    firstname: words[1],
                    surname: words[2]
                };

            } else {

                /* If not get a random name
                ------------------------------------------------- */

                var templateVars    = {
                    prefix: _.shuffle(self.robotNames.get('prefix'))[0],
                    firstname: _.shuffle(self.robotNames.get('firstname'))[0],
                    surname: _.shuffle(self.robotNames.get('surname'))[0]
                };

            }

            /* Helper to break up letters
             ------------------------------------------------- */

            Handlebars.registerHelper('word_to_letters', function(word) {

                // Break the word up into letters
                var letters      = word.split('');
                var finalWord   = "";

                _.each(letters, function (letter) {

                    finalWord += '<span class="l">' + letter + '</span>';

                });

                return new Handlebars.SafeString(word);

            });

            output          += robot_name_template(templateVars);

            /* Also add the name prompt on iframes
             ------------------------------------------------- */

            if (self.viewType  == 'iframe') {

                // output      += click_prompt_template();

            }
            
            
            self.$el.html(output);
            
            /* Append the className
             ------------------------------------------------- */

            $(self.el).addClass(className);

            /* Hide it on relevant view types
             ------------------------------------------------- */
            
            if (self.viewType == 'watch') {

                self.preloader.hide(self.el);

            } else if (self.viewType == 'iframe') {

                /* Add the necessary class to the robot name
                 ------------------------------------------------- */
                
                // $(UI.name).addClass('robot-name__iframe');

                // $(UI.prompt).css({
                //     'margin-top': UI.robotNameMargin,
                //     'opacity': 0
                // });

    
                // /* Showing/hiding for name badge and CTA when hovering over iFrame
                //  ------------------------------------------------- */
                
                // self.listenTo(self.app_state, 'playSongInIframe', function () {
    
                //     $(UI.name).transition({
                //         'margin-top': UI.robotNameMargin,
                //         'opacity': 0
                //     }, UI.robotNameSpeed, function () {
    
                //         $(UI.prompt).transition({
                //             'margin-top': 0,
                //             'opacity': 1
                //         }, UI.robotNameSpeed);
    
                //     });
    
                // });
    
                // self.listenTo(self.app_state, 'stopSongInIframe', function () {
                    
                //     $(UI.prompt).transition({
                //         'margin-top': UI.robotNameMargin,
                //         'opacity': 0
                //     }, UI.robotNameSpeed, function () {
    
                //         $(UI.name).transition({
                //             'margin-top': 0,
                //             'opacity': 1
                //         }, UI.robotNameSpeed);
    
                //     });
                    
                // });

            }

            
            


            
            return self;
    
        }

    });

    return RobotNameView;

  
});