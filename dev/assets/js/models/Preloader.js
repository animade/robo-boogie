define(["backbone",
        "jquery",
        'hbars!templates/loading',
        'hbars!templates/loading_robot',
        'modernizr',
        'preload',
        'transit',
        "underscore",
    ], function(Backbone, $, loading_template, loading_robot_template, Modernizr, preload, transition, _) {
        "use strict";


    /**
    *
    * UI
    * 
    * ------------------------------------------------- */
    
    var UI          = {
        loading: '.js-loading',
        percentage: '.js-percentage',
        robotLoadingIcon: '.js-robot-loding-icon'
    };


    /**
    *
    * STATES
    * 
    * ------------------------------------------------- */
    
    var STATES      = {
        assetsLoaded: 'roboboogie_assets_loaded'
    };
    
    
    var Preloader = Backbone.Model.extend({
        
        /**
        *
        * Initialize
        * 
        * ------------------------------------------------- */
        
        initialize: function () {

        },


        /**
        *
        * Load all assets
        * 
        * ------------------------------------------------- */
        
        all: function (callback, options) {
       

            /* Have the assets already been loaded? If so, call the whole thing off
             ------------------------------------------------- */

            if (sessionStorage.getItem(STATES.assetsLoaded) == 'true') {

                // Run the callback
                callback(options);

                return false;

            }

            
            /* Show the loading template
            ------------------------------------------------- */
        
            $('#container').html(loading_template());
                

            /* Image loading
             ------------------------------------------------- */
            
            var images      = [
                "assets/img/sprites@2x.png",
                "assets/img/robots/cat/body.png", // Cat robot
                "assets/img/robots/cat/head.png",
                "assets/img/robots/cat/neck.png",
                "assets/img/robots/cat/left-foot.png",
                "assets/img/robots/cat/lower-arm.png",
                "assets/img/robots/cat/lower-leg.png",
                "assets/img/robots/cat/preview@1x.png",
                "assets/img/robots/cat/right-foot.png",
                "assets/img/robots/cat/upper-arm.png",
                "assets/img/robots/cat/upper-leg.png",
                "assets/img/robots/hair/body.png", // Hair robot
                "assets/img/robots/hair/head.png",
                "assets/img/robots/hair/neck.png",
                "assets/img/robots/hair/left-foot.png",
                "assets/img/robots/hair/lower-arm.png",
                "assets/img/robots/hair/lower-leg.png",
                "assets/img/robots/hair/preview@1x.png",
                "assets/img/robots/hair/right-foot.png",
                "assets/img/robots/hair/upper-arm.png",
                "assets/img/robots/hair/upper-leg.png",
                "assets/img/robots/jester/body.png", // Jester robot
                "assets/img/robots/jester/head.png",
                "assets/img/robots/jester/neck.png",
                "assets/img/robots/jester/left-foot.png",
                "assets/img/robots/jester/lower-arm.png",
                "assets/img/robots/jester/lower-leg.png",
                "assets/img/robots/jester/preview@1x.png",
                "assets/img/robots/jester/right-foot.png",
                "assets/img/robots/jester/upper-arm.png",
                "assets/img/robots/jester/upper-leg.png",
                "assets/img/robots/tv/body.png", // TV robot
                "assets/img/robots/tv/head.png",
                "assets/img/robots/tv/neck.png",
                "assets/img/robots/tv/left-foot.png",
                "assets/img/robots/tv/lower-arm.png",
                "assets/img/robots/tv/lower-leg.png",
                "assets/img/robots/tv/preview@1x.png",
                "assets/img/robots/tv/right-foot.png",
                "assets/img/robots/tv/upper-arm.png",
                "assets/img/robots/tv/upper-leg.png",
                "assets/img/robots/lightning/body.png", // Lightning
                "assets/img/robots/lightning/head.png",
                "assets/img/robots/lightning/neck.png",
                "assets/img/robots/lightning/left-foot.png",
                "assets/img/robots/lightning/lower-arm.png",
                "assets/img/robots/lightning/lower-leg.png",
                "assets/img/robots/lightning/preview@1x.png",
                "assets/img/robots/lightning/right-foot.png",
                "assets/img/robots/lightning/upper-arm.png",
                "assets/img/robots/lightning/upper-leg.png",
            ];


            /**
            *
            * Audio loading
            * 
            * ------------------------------------------------- */
            
            var ext;

            if (Modernizr.audio.mp3) {

                ext     = '.mp3';

            } else if (Modernizr.audio.ogg) {

                ext     = '.ogg';

            } else {
                
                ext     = '.wav';

            }
            
            
            var audio       = [
                "assets/music/loops/electro" + ext, 
                "assets/music/loops/funk" + ext,
                "assets/music/loops/pop" + ext,
                "assets/music/loops/rock" + ext
            ];

            /**
            *
            * Start the loading
            * 
            * ------------------------------------------------- */
        
            var queue       = new createjs.LoadQueue();
            
            var finalAssets         = _.union(audio, images);

            queue.loadManifest(finalAssets);
            
            /* Load progress
             ------------------------------------------------- */
            
            queue.addEventListener("progress", function (event) {

                var loadedPercentage    = parseInt(event.loaded * 100, 10);

                $(UI.percentage).html(loadedPercentage + '%');

            });
    
            /* Load complete
             ------------------------------------------------- */
                
            queue.addEventListener("complete", function () {
                
                /* Fade out loading div
                ------------------------------------------------- */
                
                $(UI.loading).transition({
                    delay: 300,
                    opacity: 0
                }, 500, function () {
        
                    // empty the container
                    $('#container').empty();
            
                    // Run the callback
                    callback(options);

                    // Set the session storage variable to signify it's loaded
                    sessionStorage.setItem(STATES.assetsLoaded, true);
    
                });
    
            });

        },


        /**
        *
        * Load assets for one specific robot
        * 
        * ------------------------------------------------- */
        
        robot: function (options) {
          
            var self        = this;

            self.app_state  = options.app_state;

            $('#container').append(loading_robot_template());

            if (options.viewType == "edit") {
                
                $(UI.robotLoadingIcon).addClass('loading--robot--edit');

            } else if (options.viewType == 'iframe') {
                
                $(UI.robotLoadingIcon).addClass('loading--robot--iframe');

                self.hide($(UI.robotLoadingIcon));

            }

            /* Show the loader everywhere but the iframe
             ------------------------------------------------- */
            
            if (options.viewType !== 'iframe') {

                self.listenTo(self.app_state, 'startDance', function () {
    
                    /* Hide the loader - note: other parts are shown in their respective views
                     ------------------------------------------------- */
    
                    self.hide($(UI.robotLoadingIcon));
    
                });

            }

        },



        /**
        *
        * Reveal element after it's safe to do so
        * 
        * ------------------------------------------------- */
        
        reveal: function (el) {

            var self        = this;
            
            $(el).transition({
                'opacity': 1
            }, 500);
          
        },


        /**
        *
        * Hide an element immediately
        * 
        * ------------------------------------------------- */
        
        hide: function (el) {

            var self        = this;
            
            $(el).transition({
                'opacity': 0
            }, 0);
          
        },


        /**
        *
        * Disappear
        * 
        * ------------------------------------------------- */
        
        fadeOut: function (el) {

            var self        = this;
            
            $(el).transition({
                'opacity': 0
            }, 500);
          
        }
        

        
    });

    return Preloader;
  
});