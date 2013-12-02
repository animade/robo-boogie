/*global alert: false, confirm: false, console: false, Debug: false, $*/
define(['backbone',
    'jquery',
    'preload',
    'underscore',
    'collections/AudioCollection',
    'collections/DanceCollection',
    'collections/PresetCollection',
    'collections/RobotCollection',
    'models/DanceModel',
    'models/Preloader',
    'models/UserModel',
    "views/audioPlayerView",
    'views/chooseRobotView',
    'views/codeView',
    'views/creditsView',
    'views/headerView',
    'views/iframeAudioView',
    'views/robotView',
    'views/saveDanceView',
    'views/sliderView',
    'views/stageView'
], function(
    Backbone, 
    $,
    Preload,
    _,
    AudioCollection,
    DanceCollection,
    PresetCollection,
    RobotCollection,
    DanceModel,
    Preloader,
    UserModel,
    AudioPlayerView,
    ChooseRobotView,
    CodeView,
    CreditsView,
    HeaderView,
    IframeAudioView,
    RobotView,
    SaveDanceView,
    SliderView,
    StageView) {
    'use strict';


    /**
    *
    * UI
    * 
    * ------------------------------------------------- */
  
    var UI = {
        container: '#container'
    };

    /**
    *
    * STATES
    * 
    * ------------------------------------------------- */
  
    var STATES = {
        collectionLoadCount: 0,
        collectionsToLoad: 3
    };



    /**
    *
    * Router
    * 
    * ------------------------------------------------- */
    
    var Router = Backbone.Router.extend({

        /**
        *
        * Initialize
        * 
        * ------------------------------------------------- */
    
        el: $(UI.container),
    
        initialize: function() {
    
            var self = this;
            
            /* Events pub/sub to hold the app state
             ------------------------------------------------- */
        
            self.app_state      = _.extend({}, Backbone.Events);
            

            /* Bind updates of page title
             ------------------------------------------------- */
            
            self.listenTo(self.app_state, 'changeTitle', function (title) {

                $(document).attr('title', 'ROBO BOOGIE / ' + title);

            });


            /* Generate a user ID - possibly replace with full user registration
             ------------------------------------------------- */

            self.user           = new UserModel();

            // Remove item for dev...
            // localStorage.removeItem('codeclub_userID');

            if (localStorage.getItem("codeclub_userID") === null) {

                /* Generate

                http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript

                ------------------------------------------------- */
                
                var userID          = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {

                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);

                    return v.toString(16);

                });

                // Create a new user

                self.user.set({'uuid': userID});

                self.user.save(null, {

                    success: function (model, response) {

                        // Set the ID
                        localStorage.setItem('codeclub_userID', userID);

                        self.startHistory();

                    },
                    error: function (error, resp) {

                        console.error(error);
                        console.log(resp);

                        alert("Unable to save you as a user");

                    }

                });

            } else {
                
                /* Get's an existing user
                 ------------------------------------------------- */
                
                self.user.set({'uuid': localStorage.getItem("codeclub_userID")});

                self.user.fetch({
                    cache: false,
                    data: {
                        'uuid': localStorage.getItem("codeclub_userID")
                    },
                    success: function (model, response) {

                        /* If the response is false, the user has an ID locally but it's not in the database
                         ------------------------------------------------- */

                        if (response.uuid == false) {

                            alert("Unable to save you as a user");

                        } 

                        self.startHistory();

                    }
                });

            }

            /* Get the list of all robots
             ------------------------------------------------- */
        
            self.robots         = new RobotCollection();
        
            self.robots.fetch().done(function () {
        
                self.startHistory();
        
            });


            /* Get the sounds
             ------------------------------------------------- */
        
            self.audio         = new AudioCollection();
        
            self.audio.fetch().done(function () {
        
                self.startHistory();
        
            });

            
        },
        

        /**
        *
        * Starts the app after X times of being called (to allow collections to be loaded)
        * 
        * ------------------------------------------------- */
        
        startHistory: function() {
            
            STATES.collectionLoadCount++;

            if (STATES.collectionLoadCount === STATES.collectionsToLoad) {

                Backbone.history.start({
                    pushState: false
                });
                
            }

        },



        /**
        *
        * Scene transition which also cleans up views as needed
        * 
        * ------------------------------------------------- */
        
        transition: function (url) {
                
            var self    = this;

            self.app_state.trigger('views:close');

            self.navigate(url, {trigger:true});

        },
        
        /**
        *
        * Creates a user
        * 
        * ------------------------------------------------- */
        
        createUser: function (uuid) {
            
            var self    = this;

        },
        


        /**
        *
        * Scene setup method 
        * 
        * ------------------------------------------------- */
        
        sceneSetup: function () {
            
            var self        = this;

            /* Unbind any events hanging around
             ------------------------------------------------- */
            
            self.stopListening();

            /* Remove all non-persistent elements
             ------------------------------------------------- */
            
            $(UI.container).empty();

            // var $persist  = $('.js-persist');

            // $('*', UI.container).not($persist).remove();

            /* Brind persistent elements to the front - these need to be removed in the new view
             ------------------------------------------------- */
            
            // $persist.css({
            //     'z-index': 1000000000
            // });

            /* Unloads any current audio if needs be
             ------------------------------------------------- */


            if (!_.isUndefined(Backbone.currentTrack)) {

                Backbone.currentTrack.unload();

            }

        },


        /**
        *
        * Set the Routes
        * 
        * ------------------------------------------------- */
    
        routes: {
            '': 'robots',
            'dance/:guid': 'dance',
            'watch/:guid': 'watch',
            'iframe/:guid': 'watch'
        },



        /**
        *
        * On robot selection page load function
        * 
        * ------------------------------------------------- */
        
        onRobotsLoad: function (options) {

            /* Render the views
             ------------------------------------------------- */
            
            var creditsView          = new CreditsView(options);
            creditsView.render();
                    
            var headerView          = new HeaderView(options);
            headerView.render();

            var chooseRobotView     = new ChooseRobotView(options);
            chooseRobotView.render();

        },
        

        /**
        *
        * Choose your robots
        * 
        * ------------------------------------------------- */

        robots: function () {

            var self            = this;

            /* Run the scene setup method
             ------------------------------------------------- */
            
            self.sceneSetup();


             /* Set the options hash
             ------------------------------------------------- */
            
            var options         = {
                app_state: self.app_state,
                robots: self.robots,
                router: self,
                user: self.user
            };

            /* Preloader
             ------------------------------------------------- */
            
            var preloader       = new Preloader();
            preloader.all(self.onRobotsLoad, options);

        },
        

        /**
        *
        * Main robot dancing views
        * 
        * ------------------------------------------------- */
      
        dance: function (guid) {
    
            var self            = this;

            /* Run the scene setup method
            ------------------------------------------------- */
                    
            self.sceneSetup();
            
            /* Get the dance move ID if we're editing an existing one
             ------------------------------------------------- */
            
            self.danceModel     = (guid == 'new') ? new DanceModel() : new DanceModel({guid: guid});

            
            /* If it's a new dance load in one of the default dances
             ------------------------------------------------- */
            
            if (guid == 'new') {

                self.presetCollection         = new PresetCollection();

                self.presetCollection.fetch().done(function () {
                    
                    var randomDance             = _.shuffle(self.presetCollection.models)[0].attributes;

                    self.danceModel.set(randomDance);

                });

            }
                    
            /* Init the dance move 
             ------------------------------------------------- */

            self.danceModel.fetch({
                wait: true,
                success: function (model, response) {


                    /* Update the model with the response from the server
                     ------------------------------------------------- */
                    
                    self.danceModel.set(_.first(response));
                    
                    
                    /* Update the robot name to the new one
                     ------------------------------------------------- */
                    
                    self.danceModel.set('robot_name', sessionStorage.robot_name);


                    /* Check this is the current users dance move and that they can edit it
                     ------------------------------------------------- */

                    if ((self.danceModel.get('uuid') !== self.user.get('uuid')) && (guid !== 'new')) {
                        
                        alert('Sorry, this isn\'t your dance!');

                        self.navigate('/', {trigger: true});

                        return false;

                    }
                    
                    
                    /* Disable model/server syncing (re-enabled on model save)
                     ------------------------------------------------- */
                    
                    self.danceModel.sync     = function () {

                        return false;

                    };

                    
                    /* Set the puppet (robot) - puppetID set when choosing a robot in the first stage
                     ------------------------------------------------- */
                    
                    self.PUPPET                 = self.robots.get(sessionStorage.puppetID).attributes;     

                    // Add the container class
                    self.PUPPET.containerClass  = 'robot--edit';
                    

                    /* Set the options hash
                     ------------------------------------------------- */
                
                    var options         = {
                        audio: self.audio,
                        app_state: self.app_state,
                        model: self.danceModel,
                        puppet: self.PUPPET,
                        robots: self.robots,
                        routine: self.routine,
                        router: self,
                        user: self.user,
                        viewType: 'edit'
                    };

                    /* Render the loading icon
                    ------------------------------------------------- */
                        
                    var preloader           = new Preloader();
                    preloader.robot(options);


                    /* Init the robot puppet view - rendered via audio trigger 
                     ------------------------------------------------- */

                    var robotView      = new RobotView(options);


                    /* Render the views
                     ------------------------------------------------- */
                    
                    options.robotView       = robotView;
         
                    var creditsView         = new CreditsView(options);
                    creditsView.render();

                    var saveDanceView       = new SaveDanceView(options);
                    saveDanceView.render();
                
                    var headerView          = new HeaderView(options);
                    headerView.render();

                    var audioPlayerView     = new AudioPlayerView(options);
                    audioPlayerView.render();

                    /* Sidebar
                     ------------------------------------------------- */

                    self.listenTo(self.app_state, 'sidebar:showCode', function () {

                        if (self.codeView) {
                                
                            self.codeView.dispose();

                        }

                        sessionStorage.isEditingCode    = true;

                        self.codeView            = new CodeView(options);

                        $(self.el).append(self.codeView.render().el);

                    });


                    self.listenTo(self.app_state, 'sidebar:showSliders', function () {

                        if (self.sliderView) {
                                
                            self.sliderView.remove();

                        }

                        sessionStorage.isEditingCode    = false;

                        self.sliderView          = new SliderView(options);
                        
                        $(self.el).append(self.sliderView.render().el);

                    });


                    /* Trigger the initial view render
                     ------------------------------------------------- */
                    
                    var initialTrigger      = (sessionStorage.isEditingCode) ? 'sidebar:showCode' : 'sidebar:showSliders';

                    self.app_state.trigger('sidebar:showSliders');


                }, 
                error: function (error) {

                    console.error(error);

                }

            });

          
        },


        /**
        *
        * Stage for viewing shared dances
        * 
        * ------------------------------------------------- */
        
        watch: function (guid) {

            var self            = this;


            /* Run the scene setup method
             ------------------------------------------------- */
            
            self.sceneSetup();


            /* Set the dance move model based on the key
             ------------------------------------------------- */
            
            self.danceModel         = new DanceModel({guid: guid});


            /* Find out what type of view this is (iframe or stage)
            Returns watch or iframe
             ------------------------------------------------- */

            var viewType            = _.first(Backbone.history.fragment.split('/'));


            
            /* Fetch the model
             ------------------------------------------------- */

            self.danceModel.fetch({
                wait: true,
                success: function (model, response) {

                    /* Update the model with the response from the server
                     ------------------------------------------------- */
                    
                    self.danceModel.set(_.first(response));
                        
                       
                    /* Set the puppet (robot) - puppetID set when choosing a robot in the first stage
                     ------------------------------------------------- */
                    
                    self.PUPPET             = self.robots.get(self.danceModel.get('robot_id')).attributes;     

                    // Add the container class
                    self.PUPPET.containerClass  = 'robot--view';

                    
                    /* Set the options hash
                     ------------------------------------------------- */
                
                    var options         = {
                        audio: self.audio,
                        app_state: self.app_state,
                        model: self.danceModel,
                        puppet: self.PUPPET,
                        robots: self.robots,
                        routine: self.routine,
                        router: self,
                        user: self.user,
                        viewType: viewType
                    };


                    /* Render the header and stuff only on the stage version not iframe
                     ------------------------------------------------- */
                    
                    if (options.viewType == 'watch') {

                        /* Set the page title
                         ------------------------------------------------- */
                        
                        self.app_state.trigger("changeTitle", self.danceModel.get('robot_name'));


                        /* Load the credits and header
                         ------------------------------------------------- */
                        
                        var creditsView          = new CreditsView(options);
                        creditsView.render();

                        var headerView          = new HeaderView(options);
                        headerView.render();
            

                        /* Render the loading icon
                         ------------------------------------------------- */
                        
                        var preloader           = new Preloader();
                        preloader.robot(options);


                        /* Render the stage view (buttons etc)
                         ------------------------------------------------- */

                        var stageView           = new StageView(options);
                        stageView.render();


                        /* Init the robot puppet view - trigger to start via audio trigger 
                        ------------------------------------------------- */
    
                        var robotView           = new RobotView(options);

                        
                        /* Render an audio-only version of the sidebar
                         ------------------------------------------------- */
                        
                        var audioPlayerView     = new AudioPlayerView(options);
                        audioPlayerView.hidden();


                       

                    } else if (options.viewType == 'iframe') {

                        
                        /* Show the robot with a placeholder image
                         ------------------------------------------------- */
                        
                        options.puppet.containerClass  = 'robot--iframe';

            
                        /* Render the loading icon
                         ------------------------------------------------- */
                        
                        var preloader           = new Preloader();
                        preloader.robot(options);


                        /* Render an audio-only version of the sidebar
                         ------------------------------------------------- */
                        
                        var iframeAudioView     = new IframeAudioView(options);


                        /* Init the robot puppet view - rendered via audio trigger 
                        ------------------------------------------------- */
    
                        var robotView           = new RobotView(options);
                        

                    }


                },
                error: function (response) {

                    console.log(response);

                }
            });

        }
              
    
    });

    return Router;

});