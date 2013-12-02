define(["backbone",
    "jquery",
    "underscore"
  ], function(Backbone, $, _) {
    "use strict";

    /**
    *
    * Model for a Robot Names
    * 
    * ------------------------------------------------- */
    
    var RobotNameModel  = Backbone.Model.extend({
        idAttribute: "id",
        url: '/',
        defaults: {
            "prefix": [
                "Miss",
                "Ms",
                "Mr",
                "Sir",
                "Lord",
                "General",
                "Major",
                "Lieutenant",
                "Commander",
                "Reverend",
                "Madam",
                "Viscount",
                "Private",
                "Corporal",
                "Sergeant",
                "Captain",
                "Marshal",
                "Lieutenant",
                "Brigadier",
                "Officer",
                "Staff Sergeant",
                "Detective",
                "Constable",
                "Inspector",
                "Superintendent",
                "Commissioner",
                "Lady",
                "Duke",
                "Earl",
                "Baron"
            ],
            "firstname": [
                "Boogie",
                "Supershuffle",
                "Quickstep",
                "Dubstep",
                "Foxtrot",
                "TapStar",
                "Arabesquely",
                "ChaChaCha",
                "Jigalot",
                "Salsatastic",
                "Macarena",
                "Polka",
                "Salsatron",
                "Bachata",
                "Jumpin",
                "Jivin",
                "Breakin’",
                "Rhumba",
                "BBoy",
                "Lambada",
                "Cakewalking",
                "Charlestonia",
                "PopLock",
                "Tango",
                "Rhythm",
                "Moshington",
                "Merengue",
                "JitterBug",
                "SuperStylin’",
                "TwoStep",
                "Grapevine",
                "Gancho",
                "Mambodacious",
                "Lunge",
                "Pirouette"
            ],
            "surname": [
                "Robo",
                "Processor",
                "Hardware",
                "Gizmo",
                "Software",
                "WYSIWYG",
                "Benchmark",
                "Mechanoid",
                "Droid",
                "Apparatus",
                "Code",
                "Computer",
                "Muthaboard",
                "RAM",
                "Byte",
                "Googol",
                "Calculus",
                "Resistor",
                "Variable",
                "Ohm",
                "Engine",
                "Flux",
                "Alternator",
                "Chip",
                "Algorithm",
                "Cog",
                "Pinion",
                "Ratchet",
                "Defrag",
                "Node",
                "Bandwidth",
                "Wiki",
                "Disk"
            ]
        }
     });


    return RobotNameModel;

  
});