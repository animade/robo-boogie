define(["backbone",
    "underscore"
  ], function(Backbone, _) {
    "use strict";


    /**
    *
    * Sets the URL depending on location
    * 
    * ------------------------------------------------- */
    
    var urlConfig   = Backbone.Model.extend({
        initialize: function () {

            if (window.location.host == '0.0.0.0:8000') {

                this.set('url', 'http://jc.code-club.dev');
                this.set('env', 'development');

            } else {

                this.set('url', 'http://' + window.location.host);
                this.set('env', 'production');

            }

        }
    });

    return urlConfig;
  
});