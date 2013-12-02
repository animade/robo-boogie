define(["backbone",
    "jquery",
    "underscore"
  ], function(Backbone, $, _) {
    "use strict";

    /**
    *
    * Models slider data
    * 
    * ------------------------------------------------- */
    
    var SliderModel  = Backbone.Model.extend({
        idAttribute: "id",
        url: '/',
        defaults: {
              "neck": {
                "min": 0,
                "max": 30,
                "step": 0.1
              },
              "arms": {
                "min": 0,
                "max": 360,
                "step": 1
              },
              "hips": {
                "min": 0,
                "max": 20,
                "step": 0.1
              }
            }
        });

    return SliderModel;

  
});