define(["backbone",
    "underscore"
  ], function(Backbone, _) {
    "use strict";

    var SidebarConfig = Backbone.Model.extend({
      defaults: {
      'startDelay': 50,
      'slidePause': 500
      }
    });

    return SidebarConfig;
  
});