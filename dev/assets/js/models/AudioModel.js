define(["backbone",
    "jquery",
    "underscore"
  ], function(Backbone, $, _) {
    "use strict";

    /**
    *
    * AudioModel data
    * 
    * ------------------------------------------------- */
    
    var AudioModel  = Backbone.Model.extend({
            idAttribute: "id",
            url: '/'
        });

    return AudioModel;

  
});