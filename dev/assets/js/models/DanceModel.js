define(["backbone",
    "config/urlConfig",
    "jquery",
    "underscore"
  ], function(Backbone, UrlConfig, $, _) {
    "use strict";

    /**
    *
    * Model for a single Dance Move
    * 
    * ------------------------------------------------- */
    
    var DanceModel  = Backbone.Model.extend({
        idAttribute: "guid",
        url: function() {

            var urlConfig   = new UrlConfig();

            if (this.isNew()){

                return urlConfig.get('url') + "/api/index.php/dances/dance/";

            } else {

                return urlConfig.get('url') + "/api/index.php/dances/dance/" + this.id;

            }
        },
        defaults: {
            "guid": null,
            "masterTempo": 1,
            "neck_tempoMultiplier": 1,
            "neck_upDown" : 10,
            "neck_leftRight": 20,
            "rightForearm_reverse": true,
            "rightForearm_tempoMultiplier" : 1,
            "rightForearm_amount" : 0,
            "rightForearm_angle" : 0,
            "rightUpperArm_reverse": true,
            "rightUpperArm_tempoMultiplier" : 1,
            "rightUpperArm_amount": 0,
            "rightUpperArm_angle" : 0,
            "leftForearm_reverse" : 1,
            "leftForearm_tempoMultiplier" : 0.25,
            "leftForearm_amount": 0,
            "leftForearm_angle" : 0,
            "leftUpperArm_reverse": true,
            "leftUpperArm_tempoMultiplier" : 1,
            "leftUpperArm_amount" : 0,
            "leftUpperArm_angle" : 0,
            "hips_tempoMultiplier": 1,
            "hips_upDown" : 20,
            "hips_leftRight": 20
        }
        // ,sync: function () {

        //      Disable regular syncing as the save method is being called every time 
        //     a variable is changed with will quickly become very expensive resources wise. 
        //     Instead call this.model.sync manually when clicking the share and save button

        //     http://stackoverflow.com/a/10589033

        //      ------------------------------------------------- 
            
        //     return false;

        // }
     });


    return DanceModel;

  
});