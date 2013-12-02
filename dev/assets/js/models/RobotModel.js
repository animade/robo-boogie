define(["backbone",
    "config/urlConfig",
    "jquery",
    "underscore"
  ], function(Backbone, UrlConfig, $, _) {
    "use strict";

    /**
    *
    * Model for a Robot
    * 
    * ------------------------------------------------- */
    
    var RobotModel  = Backbone.Model.extend({
        idAttribute: "id",
        url: function () {
             
            var urlConfig   = new UrlConfig();

            return urlConfig.get('url') + '/api/index.php/robots/robot';

        },
        defaults: {
            "name": '',
            'sound_id': 1
        }
    });

    return RobotModel;

  
});