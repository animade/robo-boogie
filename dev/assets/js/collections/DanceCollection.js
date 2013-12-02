define(["backbone",
    "config/urlConfig",
    "jquery",
    "models/DanceModel",
    "underscore"
  ], function(Backbone, UrlConfig, $, DanceModel, _) {
    "use strict";

    /**
    *
    * Collection to hold multiple moves - this will come from the DB
    * 
    * ------------------------------------------------- */
    
    var DanceCollection = Backbone.Collection.extend({
        model: DanceModel,
        url: function () {

            var urlConfig   = new UrlConfig();

            return urlConfig.get('url') + '/api/index.php/dances/dance';

        }
    });

    return DanceCollection;
  
});