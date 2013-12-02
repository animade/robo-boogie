/*global alert: false, confirm: false, console: false, Debug: false, $*/
// http://stackoverflow.com/questions/11042898/calling-view-function-from-another-view-backbone
define(["backbone",
    "jquery",
    'config/sidebarConfig',
    "models/SliderModel",
    "stache!templates/sliders",
    "underscore"
  ], function(Backbone, $, SidebarConfig, SliderModel, sliders_template, _) {
    "use strict";

    /**
    *
    * UI
    * 
    * ------------------------------------------------- */
    
    var UI      = {
        code: '.code',
        editor: '.js-editor',
        sliders: '.sliders',
        inputToggle: '.js-input-toggle',
        textfield: '.js-code-editor',
        errorMessage: '.js-code-error',
        submitButton: '.js-code-save'
    };


    /**
    *
    * SliderView
    * 
    * ------------------------------------------------- */

    var SliderView = Backbone.View.extend({
      
        tagName: 'div',
        
        className: 'sliders sidebar__sliders js-sidebar-sliders',

        events: {
            'mouseup .js-variable-update': 'onVariableUpdate',
            'click .js-input-toggle': 'onInputToggle'
        },

        /**
        *
        * Switches between code and slider view
        * 
        * ------------------------------------------------- */
        
        onInputToggle: function (event) {

            var self        = this;

            event.preventDefault();

            setTimeout(function () {

                $(UI.sliders).removeClass('is-active');

                setTimeout(function () {

                    self.app_state.trigger('sidebar:showCode');

                }, self.sidebarConfig.get('slidePause'))

            }, self.sidebarConfig.get('startDelay'));

        },
 
        initialize: function(options) {
    
            var self                = this;
            
            self.app_state          = options.app_state;
            self.model              = options.model;
            self.router             = options.router;
            self.routine            = options.routine;
            self.sidebarConfig      = new SidebarConfig();
            
            /* Slider basics
             ------------------------------------------------- */
            
            self.sliderModel        = new SliderModel();
        
        },

        onVariableUpdate: function (e) {

            var self                = this;
        
            var elem                = $(e.currentTarget);
                
            var newDanceMove        = {};

            newDanceMove[elem.attr('data-attribute')] = elem.val();

            self.app_state.trigger('onVariableUpdate', newDanceMove);

        },

        render: function() {          

            var self            = this;
            var output          = '';

            var templateData    = {
                sliderDefault : self.sliderModel.attributes,
                danceMove : self.model.attributes
            };

            output                      += sliders_template(templateData);

            self.$el.html(output);

            setTimeout(function () {
    
                $(self.el).addClass('is-active');

            }, self.sidebarConfig.get('startDelay'));           
           
            return self;

       }

    });

    return SliderView;

  
});