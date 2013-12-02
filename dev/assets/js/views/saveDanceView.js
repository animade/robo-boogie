/*global alert: false, confirm: false, console: false, Debug: false, $*/
define(["backbone",
    "jquery",
    "hbars!templates/save_dance",
    'models/Preloader',
    "views/soundtrackView",
    "underscore"
  ], function(Backbone, $, save_dance_template, Preloader, SoundtrackView, _) {
    "use strict";


    /**
    *
    * UI
    * 
    * ------------------------------------------------- */
    
    var UI = {
        button: '.js-save-and-share'
    };
    

    /**
    *
    * SaveDanceView
    * 
    * ------------------------------------------------- */

    var SaveDanceView = Backbone.View.extend({
      
        tagName: 'div',

        className: 'save-dance',
        

        /**
        *
        * Events
        * 
        * ------------------------------------------------- */
        
        events: {
            'click .js-save-and-share': 'onSaveShare'
        },


        /**
        *
        * On click share and save - move to next screen
        * 
        * ------------------------------------------------- */
        
        onSaveShare: function(event) {
            
            event.preventDefault();

            var self            = this;

            var $elem           = $(event.currentTarget);

            /* Prevent people going to the watch view twice
             ------------------------------------------------- */
            
            if ($elem.hasClass('is-clicked')) {

                return false;

            } else {

                // Update the text
                $(UI.button).text('Saving...');

                $elem.addClass('is-clicked');

            }

            // Re-enable sync - http://stackoverflow.com/a/10589033
            self.model.sync     = Backbone.sync;

            self.model.set('uuid', self.user.id);
            self.model.set('robot_id', sessionStorage.puppetID);
            self.model.set('robot_name', sessionStorage.robot_name);

            /* Get a still image of the robot 
             ------------------------------------------------- */
            
            // var robot_still      = $('.sketch')[0].toDataURL();
            // Disable robot still for now - just using default robot image now

            self.model.set('robot_still', '');

            /* Save the robot to the server
             ------------------------------------------------- */
            
            self.model.save(null, {
                wait: true,
                success: function (model, response) {

                    // Disable sync again 
                    self.model.sync     = function () {

                        return false;

                    };

                    /* Navigate to the new location
                     ------------------------------------------------- */

                    self.router.transition('watch/' + response);

                },
                error: function (e) {

                    console.log(e);

                    alert('Sorry, we couldn\'t save your dance :-(');

                }
            });


        },


        /**
        *
        * Initialize
        * 
        * ------------------------------------------------- */

        initialize: function(options) {

            var self            = this;

            self.audio          = options.audio;
            self.options        = options;
            self.app_state      = options.app_state;
            self.model          = options.model;
            self.robotView      = options.robotView;
            self.router         = options.router;
            self.user           = options.user;
            self.preloader      = new Preloader();
              
            /* Nested views
             ------------------------------------------------- */
            
            // self.soundtrackView   = new SoundtrackView(self.options);
            // this.timelineView     = new TimelineView(this.options);
    
            $('#container').append(self.el);

            self.listenTo(self.app_state, 'startDance', function () {

                self.preloader.reveal(self.el);

            })

        },

        /**
        *
        * Render
        * 
        * ------------------------------------------------- */

        render: function() {          
            
            var self        = this;
    
            var output      = '';
    
            output          += save_dance_template();
    
            self.$el.html(output);
        
            self.preloader.hide(self.el);
          
            return self;

        }

    });

    return SaveDanceView;

  
});