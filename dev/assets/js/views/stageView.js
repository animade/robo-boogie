/*global alert: false, confirm: false, console: false, Debug: false, $*/
define(["backbone",
    "jquery",
    "hbars!templates/stage",
    'models/Preloader',
    'views/sharingView',
    "underscore"
  ], function(Backbone, $, stage_template, Preloader, SharingView, _) {
    "use strict";


    /**
    *
    * StageView
    * 
    * ------------------------------------------------- */

    var StageView = Backbone.View.extend({
      
        tagName: 'div',

        className: 'stage',
        
        events : {
            'click .js-edit' : 'onEditClick',
            'click .js-submit' : 'onSubmitClick',
            'click .js-vote' : 'onVote'
        },

        /* Initialize
         ------------------------------------------------- */

        initialize: function(options) {

            var self            = this;

            self.options        = options;
            self.danceMove      = options.model;
            self.app_state      = options.app_state;
            self.router         = options.router;
            self.user           = options.user;
            self.preloader      = new Preloader();
         
            $('#container').append(self.el);


            /* Sub views
             ------------------------------------------------- */

            self.sharingView    = new SharingView(options);

            /* Show
             ------------------------------------------------- */
            
            self.listenTo(self.app_state, 'startDance', function () { 

                self.preloader.reveal(self.el);

            });


        },



        /**
        *
        * onVote
        * 
        * ------------------------------------------------- */
        
        onVote: function (event) {
            
            var self            = this;

            event.preventDefault();

            window.location     = "http://roboboogie.codeclub.org.uk/competition/vote?robot_id=" + self.danceMove.get("guid");

        },
        
        /**
        *
        * Goes back to edit a dance
        * 
        * ------------------------------------------------- */
        
        onEditClick: function (event) {
                
            var self            = this;

            event.preventDefault();

            var $link           = $(event.currentTarget);

            var guid            = $link.attr('data-robot-id');

            self.router.navigate('dance/' + guid, {trigger: true});

        },



        /**
        *
        * Submits a dance to the competition
        * 
        * ------------------------------------------------- */
        
        onSubmitClick: function (event) {

            var self        = this;

            event.preventDefault();

            var $btn        =  $(event.currentTarget);

            if ($btn.hasClass('is-entered')) {

                alert('This dance has already been entered!');

                return false;

            }

            // Enable model sync
            self.model.sync     = Backbone.sync;

            self.danceMove.set('is_entered_into_comp', 1);

            self.danceMove.save(null, {
                wait: true,
                success: function (model, response) {

                    // Disable sync again 
                    self.model.sync     = function () {

                        return false;

                    };

                    $(event.currentTarget).addClass('is-entered');

                    // Push to the new location
                    window.location     = "http://roboboogie.codeclub.org.uk/competition/enter?robot_id=" + self.danceMove.get('guid');

                },
                error: function (model, response) {

                    console.error(model);
                    console.error(response);

                    // alert('Sorry, we couldn\'t save your dance :-(');

                }
            });
            // conso

            // alert('Will submit link to competition');

        },
        

        render: function() {          

            var self        = this;
    
            var output      = '';

            /* Set the url (for the sharing field)
            ------------------------------------------------- */

            // var sharingUrl  = encodeURIComponent(self.getUrl() + '/#watch/' + self.danceMove.get('guid'));

            // self.danceMove.set('sharing_url', sharingUrl);  

            /* Show an edit url or a vote url?
            ------------------------------------------------- */
            
            var isEditable                  = (self.user.id == self.danceMove.get('uuid')) ? true : false;

            self.danceMove.set('isEditable', isEditable);

            var templateVars                = self.danceMove.attributes;

            /* Is it entered into the competition?
             ------------------------------------------------- */
            
            templateVars.entryClass         = (self.danceMove.get('is_entered_into_comp') == '1') ? 'is-entered' : '';

            output              += stage_template(templateVars);
    
            self.$el.html(output);
            

            /* Render the sharing view
             ------------------------------------------------- */
    
            self.sharingView.setElement(self.$el.find('.js-sharing-container')).render();


            self.preloader.hide(self.el);

            return self;

        }

    });

    return StageView;

  
});