/*global alert: false, confirm: false, console: false, Debug: false, $*/
define(["backbone",
    "jquery",
    "hbars!templates/robots",
    "views/robotNameView",
    'swiper',
    'transit',
    "underscore",
  ], function(Backbone, $, robots_template, RobotNameView, Swiper, transition, _) {
    "use strict";


    /**
    *
    * UI
    * 
    * ------------------------------------------------- */
    
    var UI      = {
        button: '.js-choose-robot',
        buttonContainer: '.js-button-container',
        easing:'easeInOutBack',
        hideMargin: 0, // Set dynamically on init
        hideOnSlide: '.js-hide-on-slide',
        robotName: '.js-robot-name',
        nameField: '.js-name-select',
        slider: '.swiper-container',
        prefix: '.js-prefix',
        firstname: '.js-firstname',
        surname: '.js-surname'
    };
    

    /**
    *
    * States, timeouts etc
    * 
    * ------------------------------------------------- */
    
    var STATES  = {
        slideHideSpeed: 500,
        slideHideOffset: 50 // Difference between the first and second element hiding
    };
    

    /**
    *
    * ChooseRobotView
    * 
    * ------------------------------------------------- */

    var ChooseRobotView = Backbone.View.extend({
        
        tagName: 'div',

        className: 'choose-robot-container',
        

        /* Events
         ------------------------------------------------- */
        
        events: {
            'click .js-choose-robot' : 'onChooseRobot',
            'click .js-swiper-action': 'onSwiperAction'
        },


        /**
        *
        * Kickoff
        * 
        * ------------------------------------------------- */

        initialize: function(options) {
    
            var self            = this;
                
            self.app_state      = options.app_state;
            self.router         = options.router;
            self.robots         = options.robots;
            self.user           = options.user;

            /* Sub views
             ------------------------------------------------- */

            self.robotNameView  = new RobotNameView(options);

            /* Append the view to the DOM
            ------------------------------------------------- */
        
            $('#container').append(self.el);

            /* Set the amount to animate the buttons on slide move
             ------------------------------------------------- */

            UI.hideMargin       = $(document).height() / 2;


        },


        /**
        *
        * Choose a robot
        * 
        * ------------------------------------------------- */
        
        onChooseRobot: function (event) {
            
            event.preventDefault();

            var self                        = this;

            var $button                     = $(event.currentTarget);
            var guid                        = ($button.attr('data-guid').length < 1) ? 'new' : $button.attr('data-guid');

            /* Get the robot name
             ------------------------------------------------- */
            
            var prefix                      = $(UI.prefix).text();
            var firstname                   = $(UI.firstname).text();
            var surname                     = $(UI.surname).text();
            var robot_name                  = prefix + ' ' + firstname + ' ' + surname;

            // Set the robot & dance selection
            sessionStorage.puppetID         = $button.attr('data-robot-id');
            sessionStorage.guid             = guid
            sessionStorage.robot_name       = robot_name;

            /* Go to the dance page
             ------------------------------------------------- */

            self.router.navigate('dance/' + guid, {trigger: true});

        },


        /**
        *
        * Next or Previous slideshow link
        * 
        * ------------------------------------------------- */
        
        onSwiperAction: function(event) {
            
            var self    = this;

            event.preventDefault();

            var $elem   = $(event.currentTarget);

            /* Hide the name and button
             ------------------------------------------------- */
            
            $(UI.buttonContainer).transition({
                'margin-top': UI.hideMargin
            }, STATES.slideHideSpeed, UI.easing);

            $(UI.robotName).transition({
                'delay': STATES.slideHideOffset,
                'margin-top': UI.hideMargin
            }, STATES.slideHideSpeed, UI.easing);

            /* Do the sliding
            ------------------------------------------------- */

            setTimeout(function () {

                if ($elem.hasClass('js-next')) {

                    self.slider.swipeNext();

                } else {

                    self.slider.swipePrev();

                }

            }, STATES.slideHideSpeed + STATES.slideHideOffset);

        },
        

        /**
        *
        * Custom keyboard events for previous / next 
        * 
        * ------------------------------------------------- */
        
        keyboardEvents: function (event) {
    
            var self        = this;

            $(document).bind('keydown', function (event) {

                if (event.keyCode == 39) {

                    event.preventDefault();

                    $('.js-next').trigger('click');

                } else if (event.keyCode == 37) {

                    event.preventDefault();

                    $('.js-prev').trigger('click');

                }

            });

        },
        

        /**
        *
        * Slider
        * 
        * ------------------------------------------------- */
        
        buildSlider: function() {
            
            var self        = this;

            /* Set the height of the slider to 100% window height
             ------------------------------------------------- */


            $(UI.slider).css({
                'height': $(document).height() - $(UI.slider).offset().top
            });

            
            /* Build the slider itself
             ------------------------------------------------- */
            
            self.slider     = $(UI.slider).swiper({
                keyboardControl: false,
                mode:'horizontal',
                loop: true,
                slidesPerView: 1,
                onInit: function (swiper) {

                    // Trigger the initial nameplate load
                    
                    // Get the button
                    var $btn     = $(UI.button, $(swiper.activeSlide()));
                    
                    // Update the name
                    self.loadName($btn.attr('data-robot-name'), $btn.attr('data-is-named'));


                },
                onSlideChangeStart: function (swiper) {

                },
                onSlideChangeEnd: function (swiper) {

                    // Show the nameplate and button

                    // Get the button
                    var $btn     = $(UI.button, $(swiper.activeSlide()));
                    
                    // Update the name
                    self.loadName($btn.attr('data-robot-name'), $btn.attr('data-is-named'));

                    // Show the name and button again
                    $(UI.buttonContainer).transition({
                        'delay': STATES.slideHideOffset,
                        'margin-top': 0
                    }, STATES.slideHideSpeed, UI.easing);

                    $(UI.robotName).transition({
                        'margin-top': 0
                    }, STATES.slideHideSpeed, UI.easing);

                }
            });  

            return self;
        },
        


        /**
        *
        * Load's a robot name
        * 
        * ------------------------------------------------- */
        
        loadName: function (name, isNamed) {
                
            var self    = this;

            /* Render the robot name
             ------------------------------------------------- */

            var className       = 'robot-slide__selector';
            var $nameContainer  = self.$el.find('.robot-name--container');

            self.robotNameView.setElement($nameContainer).render(className, name);

            /* Add the relevat positioning class
             ------------------------------------------------- */
            
            $nameContainer.addClass('robot-slide__robot-name--container');
            

            /* Has this name been chosen before? If so, add a class
             ------------------------------------------------- */
            
            // if (isNamed == 'true') {

            //     $nameContainer.addClass('is--named');

            // }


            return self;

        },

        

        /**
        *
        * Render 
        * 
        * ------------------------------------------------- */
        
        render: function() {          
    
            var self            = this;
            var output          = '';

            /* Figure out if this user has a dance with this robot
             ------------------------------------------------- */

            if (_.has(self.user.attributes, 'dances')) {

                // There be dances!

                _.each(self.user.attributes.dances, function (user_dance) {

                    _.each(self.robots.models, function (robot) {

                        if (robot.id === user_dance.robot_id) {
                            
                            robot.set('robot_name', user_dance.robot_name);

                            robot.set('is_named', true);

                            // Set the dance guid
                            robot.set('guid', user_dance.guid);

                        }

                    });

                });

            }

            /* Set the output
             ------------------------------------------------- */

            output              += robots_template(self.robots.toJSON());
        
            self.$el.html(output);


            /* Build the slider
             ------------------------------------------------- */
            
            self.buildSlider();

            /* Keyboard events
             ------------------------------------------------- */
            
            self.keyboardEvents();

            return self;
    
        }

    });

    return ChooseRobotView;

  
});