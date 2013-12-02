define(["backbone",
    "config/urlConfig",
    "jquery",
    "models/PresetModel",
    "underscore"
  ], function(Backbone, UrlConfig, $, PresetModel, _) {
    "use strict";

    /**
    *
    * Collection to hold multiple presets
    * 
    * ------------------------------------------------- */
    
    var PresetCollection = Backbone.Collection.extend({
        model: PresetModel,
        initialize: function () {

          
        },
        url: function () {

            return '/assets/data/presets.json';

        }
    });

    return PresetCollection;
  
});