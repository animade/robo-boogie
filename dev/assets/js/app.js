requirejs.config({
    urlArgs: 'v=' + (new Date()).getTime(), // Cache busintg
    baseUrl: 'assets/js',
    waitSeconds: 100,
    enforceDefine: false,
    paths: {
        'ace': 'libs/ace/src-min-noconflict/ace',
        'backbone': 'libs/backbone',
        'fixtures': 'libs/backbone-fixtures',
        'jquery': 'libs/jquery-1.8.3.min',
        'keymaster': 'libs/keymaster',
        'Mustache': 'libs/mustache',
        'modernizr': 'libs/modernizr-latest',
        'Handlebars': 'libs/handlebars',
        'hbars': 'libs/hbars',
        'howler': 'libs/howler',
        'howl': 'libs/howler',
        'preload': 'libs/preloadjs-NEXT.min',
        'segment': 'libs/segment',
        'ball': 'libs/ball',
        'socialite': 'libs/socialite',
        'square': 'libs/square',
        'stache': 'libs/stache',
        'sketch': 'libs/sketch',
        'swiper': 'libs/idangerous.swiper-2.2.min',
        'transit': 'libs/jquery.transit.min',
        'text': 'libs/text',
        'underscore': 'libs/underscore'
    },
    shim: {
        'ace': {
            exports: 'ace'
        },
        'jQuery': {
            exports: 'jQuery'
        },
        'keymaster': {
            exports: 'key'
        },
        'modernizr': {
            exports: 'Modernizr'
        },
        'Handlebars': {
            exports: 'Handlebars'
        },
        'preload': {
            exports: 'createjs.PreloadJS'
        },
        'segment': {
            exports: 'Segment'
        },
        'swiper': {
            exports: 'Swiper'
        },
        'ball': {
            exports: 'Ball'
        },
        'socialite': {
          exports: 'Socialite'
        },
        'square': {
            exports: 'Square'
        },
        'sketch': {
            exports: 'Sketch'
        },
        'transit': {
            deps: ['jquery']
        }
    }
});



define(['backbone',
    'hbars!templates/loading_robot',
    'hbars!templates/messages/mobile',
    'hbars!templates/messages/oldie',
    'jquery',
    'modernizr',
    'router',
    'underscore'
    ], function(Backbone, loading_robot_template, mobile_template, oldie_template, $, Modernizr, Router, _) {


    /* Get the necessary requirements
     ------------------------------------------------- */
    
    var requirements    = [
        Modernizr.backgroundsize,
        Modernizr.borderradius,
        Modernizr.cssanimations,
        Modernizr.canvas,
        Modernizr.history,
        Modernizr.localstorage,
        Modernizr.sessionstorage
    ];

    if (_.indexOf(requirements, false) > -1) {

        /* Unsupported browser
         ------------------------------------------------- */

        $('#container').html(oldie_template());
        
    
    } else if ((Modernizr.mq('only all and (max-width: 700px)')) && (Modernizr.touch)) {

        /* Is mobile
        ------------------------------------------------- */

        $('#container').html(mobile_template());
        

    } else {

        /* Iframe add loading robot text
         ------------------------------------------------- */

        if (window.self !== window.top) {

            $('#container').html(loading_robot_template());

        }

        
        /* Regular router
         ------------------------------------------------- */

        $(document).ready(function () {
            
            new Router();

        });

    }
  
});

  
  
