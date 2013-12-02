define(["backbone",
    "jquery",
    "models/AudioModel",
    "underscore"
  ], function(Backbone, $, AudioModel, _) {
    "use strict";

    /**
    *
    * Collection to hold multiple moves - this will come from the DB
    * 
    * ------------------------------------------------- */
    
    var AudioCollection = Backbone.Collection.extend({
        model: AudioModel,
        url: '/assets/data/soundtracks.json'
    });

    return AudioCollection;
  
});