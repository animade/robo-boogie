define(["backbone",
    "jquery",
    "models/RobotModel",
    "underscore"
  ], function(Backbone, $, RobotModel, _) {
    "use strict";

    /**
    *
    * Collection to hold Robot Puppets
    * 
    * ------------------------------------------------- */
    
    var RobotCollection = Backbone.Collection.extend({
        model: RobotModel,
        initialize: function (options) {

            // console.log(options);
            
        },
        url: function () {

            return '/assets/data/robots.json';

        }
    });

    return RobotCollection;
  
});