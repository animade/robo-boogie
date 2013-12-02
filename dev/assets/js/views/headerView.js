/*global alert: false, confirm: false, console: false, Debug: false, $*/
define(["backbone",
    "jquery",
    "hbars!templates/header",
    "underscore"
  ], function(Backbone, $, header_template, _) {
    "use strict";


    /**
    *
    * HeaderView
    * 
    * ------------------------------------------------- */

    var HeaderView = Backbone.View.extend({
      
        tagName: 'header',
        className: 'header',
  
        events: {
            'click .js-title-link' : 'onTitleClick'
        },

        initialize: function(options) {

            var self            = this;

            self.app_state      = options.app_state;
            self.router         = options.router;
        
            $('#container').append(self.el);

        },

        /**
        *
        * Handles the title link click
        * 
        * ------------------------------------------------- */
        
        onTitleClick: function (event) {
            
            var self    = this;

            event.preventDefault();

            self.router.navigate('/', {trigger: true});

        },
        

        render: function() {          

            var self        = this;
    
            var output      = '';
    
            output          += header_template();
    
            self.$el.html(output);
    
            return self;

        }

    });

    return HeaderView;

  
});