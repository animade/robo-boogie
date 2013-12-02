define(["backbone",
    "jquery",
    "hbars!templates/home",
    "underscore"
  ], function(Backbone, $, home_template, _) {
    "use strict";

    /**
    *
    * UI
    * 
    * ------------------------------------------------- */
    
    var UI          = {

    };
   

    /**
    *
    * HomeView
    * 
    * ------------------------------------------------- */

    var HomeView = Backbone.View.extend({
    
        tagName: 'div',
        className: 'home',

        events : {
            'click .js-new-dance' : 'onNewDance'
        },

        initialize: function(options) {

            var self        = this;

            self.app_state  = options.app_state;
            self.router     = options.router;

            $('#container').append(self.el);
        
        },

        onNewDance: function (event) {

            var self        = this;

            event.preventDefault();

            self.router.navigate('robots', {trigger: true});

        },

        render: function() {          
    
            var self        = this;
            var output      = '';
            
            /* Set the variables
             ------------------------------------------------- */
            
            var templateVars    = {
                'isLoggedIn': true
            };              

            /* Render the template
             ------------------------------------------------- */
            
            output          += home_template(templateVars);

            self.$el.html(output);
        
            return self;
    
        }

    });

    return HomeView;

  
});