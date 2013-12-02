define(["backbone",
    "jquery",
    'config/urlConfig',
    'config/sidebarConfig',
    "hbars!templates/audio_player",
    'models/Preloader',
    'modernizr',
    "underscore"
  ], function(Backbone, $, UrlConfig, SidebarConfig, audio_player_template, Preloader, Modernizr, _) {
    "use strict";


    /**
    *
    * UI
    * 
    * ------------------------------------------------- */
    
    var UI          = {
        audio: '.sidebar__audio-player',
        currentTrack: '.js-current-track',
        playlist: '.js-playlist',
        track: '.js-track'
    };


    /**
    *
    * States
    * 
    * ------------------------------------------------- */
    
    var STATES      = {
        isInitialized: false
    };
    

    /**
    *
    * AudioPlayerView
    * 
    * ------------------------------------------------- */

    var AudioPlayerView = Backbone.View.extend({
    
        tagName: 'div',
        className: 'audio-player',

        events : {
            'change .js-audio-select' : 'onAudioSelect',
            'click .js-current-track': 'onCurrentTrackClick',
            'click .js-track': 'onTrackSelect'
        },

        initialize: function(options) {

            var self            = this;
            
            self.options        = options;
            self.audio          = options.audio;
            self.app_state      = options.app_state;
            self.router         = options.router;

            self.sidebarConfig  = new SidebarConfig();
            self.urlConfig      = new UrlConfig();

            self.preloader      = new Preloader();


            /* Append the view to the DOM
            ------------------------------------------------- */
        
            $('#container').append(self.el);

            self.listenTo(self.app_state, 'startDance', function () {

                self.preloader.reveal(self.el);

            });


            /* Optionally requrie howler
             ------------------------------------------------- */
            
            if (self.options.viewType == 'iframe') {

            }


            /* playSongInIframe 
             ------------------------------------------------- */
            
            self.listenTo(self.app_state, 'playSongInIframe', function () {

                // Initialize if necessary

                if (STATES.isInitialized === false) {

                    self.render();

                    $(self.el).addClass('is-hidden');

                } 

                // else {

                //     

                //         Backbone.currentTrack.play();

                //     }

                // }

            });


            /* stopSongInIframe 
            ------------------------------------------------- */

            self.listenTo(self.app_state, 'stopSongInIframe', function () {

                // if (!_.isUndefined(Howler)) {

                //     Backbone.currentTrack.stop();

                // }

            });

            

        },


        /**
        *
        * onCurrentTrackClick
        * 
        * ------------------------------------------------- */
        
        onCurrentTrackClick: function (event) {
            
            var self    = this;

            event.preventDefault();

            $(UI.currentTrack).hide();
            $(UI.playlist).show();

        },


        /**
        *
        * onClickAway - fired when clicking again anywhere, used to choose a new track
        * 
        * ------------------------------------------------- */
        
        onTrackSelect: function (event) {
            

            var self     = this;

            event.preventDefault();

            var $elem    = $(event.currentTarget);

            // Toggle the UI
            $(UI.currentTrack).show();
            $(UI.playlist).hide();


            /* Switch the active track
             ------------------------------------------------- */
            
            $(UI.track).removeClass('is-active');
            $elem.addClass('is-active');

            // Update the current track value

            $('.js-current-track-title', UI.currentTrack).html($elem.text());

            // Get the sound associated with this dropdown 

            var sound       = self.audio.get($elem.attr('data-value'));

            /* For iFrame views just start the track 'silently' - this is owning to the max number of audio players
             ------------------------------------------------- */
            
            if (self.options.viewType == 'iframe') {

                console.log('iframin');

                self.app_state.trigger('startDance', sound);

            } else {
                
                require(["howler"], function (Howler) {

                    /* Unloads the track if needs be
                     ------------------------------------------------- */
                    
                    if (!_.isUndefined(Backbone.currentTrack)) {
        
                        Backbone.currentTrack.unload();
        
                    }
                    
                    /* Load the corresponding audio player
                     ------------------------------------------------- */
        
                    var ext;
        
                    if (Modernizr.audio.mp3) {
        
                        ext     = 'mp3';
        
                    } else if (Modernizr.audio.ogg) {
        
                        ext     = 'ogg';
        
                    } else {
                        
                        ext     = 'wav';
        
                    }
        
                    var volume  = (self.urlConfig.get('env') !== 'development') ? 1 : 0.1;
        
                    /* Only autoplay for non-iframe views
                     ------------------------------------------------- */
        
                    Backbone.currentTrack      = new Howler.Howl({
                        urls: [sound.get(ext)],
                        loop: true,
                        volume: volume,
                        onplay: function () {
        
                        },
                        onload: function (event) {
        
                            Backbone.currentTrack.play();
        
                            // Kicks the dance off
                            self.app_state.trigger('startDance', sound);
        
                        },
                        onloaderror: function (error) {
        
                            console.error(error);
        
                        }
                    });

                });

            }

        },
        

        /**
        *
        * Hidden version
        * 
        * ------------------------------------------------- */
        
        hidden: function() {
        
            var self            = this;

            self.render();

            $(self.el).addClass('is-hidden');

        },
        

        /**
        *
        * Iframe render view
        * 
        * ------------------------------------------------- */
        
        iframe: function () {
            
            var self            = this;

            // self.render();

            // $(self.el).addClass('is-hidden');

            // Immediately pause it

            // Backbone.currentTrack.pause();

        },
        

        /**
        *
        * Render
        * 
        * ------------------------------------------------- */
        
        render: function() {          
        
            var self            = this;
            var output          = '';

            // Update the application state

            STATES.isInitialized    = true;

            // Get the initial sound_id
            var sound_id        = _.isUndefined(self.model.get('sound_id')) ? 1 : self.model.get('sound_id');

            output              += audio_player_template(self.audio.toJSON());
            
            self.$el.html(output);
            
            self.preloader.hide(self.el);
                
            /* This starts the audio
             ------------------------------------------------- */

            $('.js-track[data-value="' + sound_id + '"]').trigger('click');

            return self;
    
        }

    });

    return AudioPlayerView;

  
});