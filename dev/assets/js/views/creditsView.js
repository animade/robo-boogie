define(["backbone",
    "jquery",
    "hbars!templates/credits",
    "underscore",
    "transit",
  ], function(Backbone, $, credits_template, _) {
    "use strict";

    /**
    *
    * UI
    * 
    * ------------------------------------------------- */
    
    var UI          = {
        trigger: '.js-credits-reveal',
        proper: '.js-credits-proper'
    };
   

    /**
    *
    * CreditsView
    * 
    * ------------------------------------------------- */

    var CreditsView = Backbone.View.extend({
    
        tagName: 'div',
        className: 'credits',

        events : {
            'mouseover .js-credits-reveal' : 'onCreditsMouseover',
            'mouseleave' : 'onCreditsMouseleave'
        },

        initialize: function(options) {

            var self        = this;

            self.app_state  = options.app_state;
            self.router     = options.router;

            /* Append the view to the DOM
            ------------------------------------------------- */
        
            $('#container').append(self.el);
        
        },


        /**
        *
        * Mouse over credits
        * 
        * ------------------------------------------------- */
        
        onCreditsMouseover: function (event) {
            
            var self        = this;

            event.preventDefault();

            $(UI.trigger).transition({
                'opacity': '0'
            }, 100, function () {

                $(UI.proper).transition({
                    'delay': 100,
                    'opacity': '1'
                }, 100);

            });

            

            // $(UI.proper).show();

        },


        /**
        *
        * Mouse leave credits
        * 
        * ------------------------------------------------- */
        
        onCreditsMouseleave: function (event) {
            
            var self        = this;

            event.preventDefault();

            $(UI.proper).transition({
                'opacity': '0'
            }, 100, function () {

                $(UI.trigger).transition({
                    'opacity': '1'
                }, 100);

            });

        },
        

        render: function() {          
    
            var self        = this;
            var output      = '';
            
            output          += credits_template();
        
            self.$el.html(output);

            /* Get the current segment to add or remove a class
             ------------------------------------------------- */
            
            var fragments       = Backbone.history.fragment.split('/');

            var className       = (fragments[0] == 'dance') ? 'dance__credits' : '';

            $(self.el).addClass(className);
                    
            return self;
    
        }

    });

    return CreditsView;

  
});