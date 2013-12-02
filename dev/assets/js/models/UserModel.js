define(["backbone",
    "config/urlConfig",
    "underscore"], function(Backbone, UrlConfig, _) {
    "use strict";

    /**
    *
    * User Model
    * 
    * ------------------------------------------------- */
    
    var UserModel  = Backbone.Model.extend({
        idAttribute: "uuid",
        url: function () {

            var urlConfig   = new UrlConfig();

            if (this.isNew()){

                return urlConfig.get('url') + "/api/index.php/users/user/";

            } else {

                return urlConfig.get('url') + "/api/index.php/users/user/" + this.id;

            }

        }
    });

    return UserModel;

  
});