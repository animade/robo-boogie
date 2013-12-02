/*global alert: false, confirm: false, console: false, Debug: false, $*/
define(["backbone",
    "jquery",
    "stache!templates/soundtrack",
    "underscore"
  ], function(Backbone, $, soundtrack_template, _) {
    "use strict";


    /**
    *
    * SoundtrackView
    * 
    * ------------------------------------------------- */

    var SoundtrackView = Backbone.View.extend({
      
      initialize: function(options) {

        this.app_state    = options.app_state;
        this.router       = options.router;
        
      },

      render: function() {          

        var self = this;

        var output = '';

        output += soundtrack_template();

        this.$el.html(output);

        return this;

      }

    });

    return SoundtrackView;

  
});