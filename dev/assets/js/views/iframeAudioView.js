define(["backbone",
    "jquery",
    "underscore"
  ], function(Backbone, $, _) {
    "use strict";

    /**
    *
    * UI
    * 
    * ------------------------------------------------- */
    
    var UI          = {

    };

    var STATES      = {
        isInitialized: false
    };
   

    /**
    *
    * iFrameAudioView
    * 
    * ------------------------------------------------- */

    var iFrameAudioView = Backbone.View.extend({
    
        tagName: 'div',
        className: 'iframe-audio',

        events : {},

        initialize: function(options) {

            var self        = this;

            self.audio      = options.audio;
            self.options    = options;
            self.app_state  = options.app_state;
            self.router     = options.router;


            self.listenTo(self.app_state, 'playSongInIframe', function () {

                if (STATES.isInitialized === false) {

                    var sound       = self.audio.get(self.model.get('sound_id'));

                    self.app_state.trigger('startDance', sound);

                    STATES.isInitialized    = true;

                }

            });

        }


    });

    return iFrameAudioView;

  
});