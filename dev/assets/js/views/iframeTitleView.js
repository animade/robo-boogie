define(["backbone",
    "jquery",
    "hbars!templates/iframe_title",
    "underscore"
  ], function(Backbone, $, iframe_title_template, _) {
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
    * IFrameTitle
    * 
    * ------------------------------------------------- */

    var IFrameTitle = Backbone.View.extend({
    
        tagName: 'div',
        className: 'iframe-title',

        events : {
            'mouseenter': 'onMouseOver'
        },

        initialize: function(options) {

            var self        = this;

            self.app_state  = options.app_state;
            self.router     = options.router;
            self.model      = options.model;
            
            /* Append the view to the DOM
            ------------------------------------------------- */
        
            $('#container').append(self.el);

        },

        onMouseOver: function (event) {

            var self        = this;

        },

        render: function() {          
    
            var self        = this;
            var output      = '';

            output          += iframe_title_template(self.model.toJSON());
        
            self.$el.html(output);
        
            return self;
    
        }

    });

    return IFrameTitle;

  
});