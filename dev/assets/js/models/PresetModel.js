define(["backbone",
    "jquery",
    "underscore"
  ], function(Backbone, $, _) {
    "use strict";

    /**
    *
    * Model for a single Dance Move
    * 
    * ------------------------------------------------- */
    
    var PresetModel  = Backbone.Model.extend({
        idAttribute: "id",
        url: '/'
     });


    return PresetModel;

  
});