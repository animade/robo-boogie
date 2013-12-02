define(["backbone",
    "jquery",
    "hbars!templates/sharing",
    'models/Preloader',
    "underscore"
  ], function(Backbone, $, sharing_template, Preloader, _) {
    "use strict";

    /**
    *
    * UI
    * 
    * ------------------------------------------------- */
    
    var UI          = {
        fbWindowWidth: 626,
        fbWindowHeight: 436,
        twitterWindowWidth: 550,
        twitterWindowHeight: 450
    };
   

    /**
    *
    * SharingView
    * 
    * ------------------------------------------------- */

    var SharingView = Backbone.View.extend({
    
        tagName: 'div',
        className: 'sharing stage__sharing',

        events : {
            'click .js-tweet': 'onTweet',
            'click .js-share': 'onShare'
        },

        initialize: function(options) {

            var self            = this;
    
            self.app_state      = options.app_state;
            self.router         = options.router;
            self.robots         = options.robots;
            self.model          = options.model;

            self.preloader      = new Preloader();

            /* Append the view to the DOM
            ------------------------------------------------- */
        
            $('#container').append(self.el);


            /* Show
             ------------------------------------------------- */
            
            self.listenTo(self.app_state, 'startDance', function () { 

                self.preloader.reveal(self.el);

            });
        
        },


        /**
        *
        * Tweet
        *
        * http://gpiot.s1.cotidia.com/twitter-share-demo/
        *
        * 
        * ------------------------------------------------- */
        
        onTweet: function(event) {
                
            var self        = this;

            event.preventDefault();

            var $elem       = $(event.currentTarget);

            /* Open the popup
             ------------------------------------------------- */
            
            window.open($elem.attr('href'), 'twitterwindow', 'height=' + UI.twitterWindowHeight + ', width=' + UI.twitterWindowWidth + ', top='+($(window).height()/2 - parseInt(UI.twitterWindowHeight/2, 10)) +', left='+$(window).width()/2 +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');

        },


        /**
        *
        * Share on Facebook
        *
        * http://gpiot.s1.cotidia.com/twitter-share-demo/
        *
        * 
        * ------------------------------------------------- */
        
        onShare: function(event) {
                
            var self        = this;

            event.preventDefault();

            var $elem       = $(event.currentTarget);

            // open the ppopup
            window.open($elem.attr('href'), 'facebookwindow', 'height=' + UI.fbWindowHeight + ', width=' + UI.fbWindowWidth + ', top='+($(window).height()/2 - parseInt(UI.fbWindowHeight/2, 10)) +', left='+$(window).width()/2 +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');

        },
        

        /**
        *
        * Gets the full current url for sharing
        * 
        * ------------------------------------------------- */
        
        getUrl: function() {
          
            var pathArray       = window.location.href.split( '/' );
            var protocol        = pathArray[0];
            var host            = pathArray[2];

            return 'http://' + host;

        },

        render: function() {          
    
            var self        = this;
            var output      = '';

            /* Get the still image from the robot ID
             ------------------------------------------------- */
    
            var puppet      = self.robots.get(self.model.get('robot_id'));           
            var image       = self.getUrl() + puppet.get('preview_image');

            /* Set the sharing template vars
             ------------------------------------------------- */
            
            var templateVars    = {
                title: 'ROBO BOOGIE / ' + self.model.get('robot_name'),
                image: encodeURIComponent(image),
                url: encodeURIComponent(self.getUrl() + '/#watch/' + self.model.get('guid')),
                description: encodeURIComponent('Check out ' + self.model.get('robot_name') + '\'s dance on Code Club\'s Robo-Boogie App! ')
            };
        
            output          += sharing_template(templateVars);

            self.$el.html(output);

            // Hide before load
            self.preloader.hide(self.el);
        
            return self;
    
        }

    });

    return SharingView;

  
});