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

        events : {},

        initialize: function(options) {

            var self        = this;

            self.app_state  = options.app_state;
            self.router     = options.router;

            /* Append the view to the DOM
            ------------------------------------------------- */
        
            $('#container').append(self.el);
        
        },

        render: function() {          
    
            var self        = this;
            var output      = '';
        
            output          += home_template();
        
            self.$el.html(output);
        
            return self;
    
        }

    });

    return HomeView;

  
});