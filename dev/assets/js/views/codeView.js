/*global alert: false, confirm: false, console: false, Debug: false, $*/
define(["ace",
    "backbone",
    "jquery",
    'config/sidebarConfig',
    "hbars!templates/code",
    "underscore"
  ], function(Ace, Backbone, $, SidebarConfig, code_template, _) {
    "use strict";


    /**
    *
    * UI
    * 
    * ------------------------------------------------- */
    
    var UI      = {
        code: '.code',
        editor: '.js-editor',
        sliders: '.sliders',
        inputToggle: '.js-input-toggle',
        textfield: '.js-code-editor',
        errorMessage: '.js-code-error',
        submitButton: '.js-code-save'
    };
    

    /**
    *
    * States, timeouts etc
    * 
    * ------------------------------------------------- */
    
    var STATES  = {
        isSaving: false
    };
    

    /**
    *
    * CodeView
    * 
    * ------------------------------------------------- */

    var CodeView = Backbone.View.extend({
        
        tagName: 'div',

        className: 'code sidebar__code js-sidebar-code',

        events: {
            'click .js-code-save': 'onCodeSave',
            'click .js-input-toggle': 'onInputToggle'
        },

        
        /**
        *
        * Switches between code and slider view
        * 
        * ------------------------------------------------- */
        
        onInputToggle: function (event) {
            
            var self        = this;

            event.preventDefault();

            setTimeout(function () {

                $(UI.code).removeClass('is-active');

                setTimeout(function () {

                    self.app_state.trigger('sidebar:showSliders');

                }, self.sidebarConfig.get('slidePause'))
                // self.remove();

            }, self.sidebarConfig.get('startDelay'));

        },


        /**
        *
        * Kickoff
        * 
        * ------------------------------------------------- */

        initialize: function(options) {
    
            var self                = this;
                    
            self.app_state          = options.app_state;
            self.model              = options.model;
            self.router             = options.router;
            self.routine            = options.routine;
            self.robots             = options.robots;
            self.sidebarConfig      = new SidebarConfig();

            /* Register the Handlebars helper
             ------------------------------------------------- */

            self.handlebarsHelper();
            
            
            /* Append the view to the DOM
              ------------------------------------------------- */
            
            // $('#container').append(self.el);


            /* Listen for the close view event
             ------------------------------------------------- */
            
            self.listenTo(self.app_state, 'views:close', function () {

                self.dispose();

            });

    
        },

        /**
        *
        * Listens for changes in the text area and shows an error message or disables the run button
        * 
        * ------------------------------------------------- */
        
        onChangeAnnotation: function (event) {
            
            var self = this;
            
            self.editor.getSession().on("changeAnnotation", function(event) {

                if (STATES.isSaving === true) {

                    return false;

                } 

                /* Get the annotations
                 ------------------------------------------------- */
                
                var annotations     = self.editor.getSession().getAnnotations();

                /* Validation A-OK
                 ------------------------------------------------- */
                
                if (annotations.length < 1) {

                    /* Hide output annotations
                     ------------------------------------------------- */

                    $(UI.errorMessage).html('').removeClass('is-error').addClass('is-ok');

                    /* Enable the form button
                     ------------------------------------------------- */

                    $(UI.submitButton).removeClass('is-disabled');


                } else {

                    /* Code error!
                     ------------------------------------------------- */
                    
                    var errorOutput     = "";
                    
                    _.each(annotations, function (error) {

                        // console.log(error);
                        errorOutput += 'Line ' + (parseInt(error.row, 10) + 1) + ': ';

                        if (error.type == 'info') {

                            errorOutput += error.text + '<br />';

                        } else if (error.type == 'error') {

                            errorOutput += error.text + '<br />';

                        }

                    });

                    /* Show output annotations
                     ------------------------------------------------- */
                    
                    $(UI.errorMessage).html(errorOutput).addClass('is-error').removeClass('is-ok');


                    /* Disable the form button
                     ------------------------------------------------- */
                    
                    $(UI.submitButton).addClass('is-disabled');

                }

            });

        },
        

        /**
        *
        * Runs the code when clicking the button
        * 
        * ------------------------------------------------- */

        onCodeSave: function(event) {

            event.preventDefault();

            var self            = this;

            /* Does the code validate?
             ------------------------------------------------- */
            
            if ($(UI.submitButton).hasClass('is-disabled')) {

                return false;

            }

            /* Variables
             ------------------------------------------------- */

            var moveId          = $(UI.textfield).attr('data-move-id');
            var userCode        = self.editor.getValue();
            

            /* Update the error output field
             ------------------------------------------------- */
            
            STATES.isSaving     = true;

            // Fade it out
            setTimeout(function () {

                $(UI.errorMessage).html('Dance updated!').css('opacity', 1);
                
                setTimeout(function () {

                    $(UI.errorMessage).animate({
                        'opacity': 0
                    }, 200, function () {

                        $(UI.errorMessage).html('').css('opacity', 1);

                        STATES.isSaving     = false;

                    });

                }, 2000);

            }, 0);


            /* Set up a new object for the dance move
             ------------------------------------------------- */
            
            var newDanceMove    = {};


            /* Break the code into lines  
             ------------------------------------------------- */
            
            var userCodeLines   = userCode.split('\n');

            _.each(userCodeLines, function (line) {

                // Break the lines code up into the variable and the value

                if ($.trim(line).substring(0, 3) == 'var') {

                    var lineParts       = line.split('=');

                    // Format the variable name
                    var attrKey         = lineParts[0].replace('var', '');
    
                    // Format the variable iself 
                    var attrValue       = lineParts[1].replace(';', '');
                    
                    // If there isn't a value, make it false
                    // attrValue           = (attrValue.length < 1) ? "false" : attrValue;

                    // Deal with the true/false values
                    switch (attrKey) {
                        case 'rightUpperArm_reverse':
                        case 'rightForearm_reverse':
                        case 'leftUpperArm_reverse':
                        case 'leftForearm_reverse':

                            if (attrValue.length < 1) {

                                attrValue   = "false";

                            } else if (attrValue == '1') {

                                attrValue   = "true";

                            } else if (attrValue == '0') {

                                attrValue   = "false";

                            }

                        break;
                    }

                    // Get rid of any white space
                    attrKey             = $.trim(attrKey);
                    attrValue           = $.trim(attrValue);

                    // Add the key/value to the new dance move object
                    newDanceMove[attrKey]      = attrValue;

                }

            });

            /* Save the move (this happens in PuppetView)
             ------------------------------------------------- */
            
            self.app_state.trigger('onVariableUpdate', newDanceMove);
            
        },
        

        /**
        *
        * Handlebars helper to display code with comments
        * 
        * ------------------------------------------------- */
        
        handlebarsHelper: function () {
          
            var self = this;

            Handlebars.registerHelper('variables', function(variables, options) {

                var output      = "";

                _.each(variables, function (value, key) {


                    /* Decide on Line Breaks
                     ------------------------------------------------- */

                    var comment     = "";
                    var lineBreak   = '\n';
                    var tabs        = '';

                    switch (key) {

                        case 'masterTempo':
                            comment     = "// How fast the robot dances\n";
                            lineBreak   = '\n';
                            tabs        = '\t\t\t\t\t\t';
                        break;

                        case 'neck_tempoMultiplier':
                            comment     = "// Neck & head movement\n";
                            lineBreak   = '\n\n';
                            tabs        = '\t\t\t';
                        break;

                        case 'neck_upDown':
                            tabs        = '\t\t\t\t\t\t';
                        break;

                        case 'neck_leftRight':
                            tabs        = '\t\t\t\t\t';
                        break;
                        
                        /* Right forearm
                         ------------------------------------------------- */
                        
                        case 'rightForearm_reverse':
                            comment     = "// Right forearm movement\n";
                            lineBreak   = '\n\n';
                            tabs        = '\t\t\t';
                        break;

                        case 'rightForearm_tempoMultiplier': 
                            tabs        = '\t';
                        break;

                        case 'rightForearm_amount': 
                            tabs        = '\t\t\t\t';
                        break;

                        case 'rightForearm_angle': 
                            tabs        = '\t\t\t\t';
                        break;

                        case 'rightUpperArm_reverse':
                            comment     = "// Right upper arm movement\n";
                            lineBreak   = '\n\n';
                            tabs        = '\t\t\t';
                        break;

                        case 'rightUpperArm_tempoMultiplier': 
                            tabs        = '\t';
                        break;

                        case 'rightUpperArm_amount': 
                            tabs        = '\t\t\t';
                        break;

                        case 'rightUpperArm_angle': 
                            tabs        = '\t\t\t\t';
                        break;


                        /* Right arm
                         ------------------------------------------------- */

                        case 'leftForearm_reverse':
                            comment     = "// Left forearm movement\n";
                            lineBreak   = '\n\n';
                            tabs        = '\t\t\t\t';
                        break;

                        case 'leftForearm_tempoMultiplier': 
                            tabs        = '\t\t';
                        break;

                        case 'leftForearm_amount': 
                            tabs        = '\t\t\t\t';
                        break;

                        case 'leftForearm_angle': 
                            tabs        = '\t\t\t\t';
                        break;

                        case 'leftUpperArm_reverse':
                            comment     = "// Left upper arm movement\n";
                            lineBreak   = '\n\n';
                            tabs        = '\t\t\t';
                        break;

                        case 'leftUpperArm_tempoMultiplier': 
                            tabs        = '\t';
                        break;

                        case 'leftUpperArm_amount': 
                            tabs        = '\t\t\t\t';
                        break;

                        case 'leftUpperArm_angle': 
                            tabs        = '\t\t\t\t';
                        break;

                        
                        case 'hips_tempoMultiplier':
                            comment     = "// Hips & legs \n";
                            lineBreak   = '\n\n';
                            tabs        = '\t\t\t';
                        break;

                        case 'hips_upDown': 
                            tabs        = '\t\t\t\t\t\t';
                        break;

                        case 'hips_leftRight': 
                            tabs        = '\t\t\t\t\t';
                        break;


                    }
                    
                    output += lineBreak + comment + 'var ' + key + tabs +'= ' + value + ';';

                });

                return output;

            });


        },



        /**
        *
        * Destory this view and code editor
        * 
        * ------------------------------------------------- */
        
        dispose: function () {
                
            var self            = this;

            if (self.editor) {
                self.editor.destroy();
            }

            self.stopListening();

            self.remove();

        },
        

        /**
        *
        * Render the text field initially
        * 
        * ------------------------------------------------- */
        
        render: function(className) {          
        
            var self            = this;
            var output          = '';
        
            // Variables to omit from saved model
            var omitVars        = ['0', 'danceFound', 'guid', 'id', 'is_entered_into_comp', 'name', 'robot_id', 'robot_name', 'robot_still', 'soundtrack', 'sound_id', 'tempo', 'uuid'];

            // Set up the model for display in the text field
            var filteredMove    = _.omit(self.model.attributes, omitVars);

            // convert everything to strings (allows booleans to be passed)
            _.map(filteredMove, function (val, key) {

                filteredMove[key] = String(val);

            });


            /* Set the variables
             ------------------------------------------------- */
            
            var templateVars    = {
                introComment: "/****************************************** \n Edit the variable numbers on the right \n to change the way your robot dances! \n *****************************************/",
                moveId : self.model.attributes.id,
                move: filteredMove
            };
        
            output += code_template(templateVars);
        
            self.$el.html(output);

            setTimeout(function () {
    
                $(self.el).addClass('is-active');
            
                /* Syntax Highlighter
                 ------------------------------------------------- */
                
                // Set the height of the code editor before 
    
                $("#code-editor").css({
                    height: $(document).height() - 300
                });

                self.editor         = Ace.edit("code-editor");

                self.editor.setTheme("ace/theme/xcode");
                self.editor.getSession().setMode("ace/mode/javascript");

                /* Check for errors
                 ------------------------------------------------- */
                
                self.onChangeAnnotation(); 

            }, self.sidebarConfig.get('startDelay'));

            
        
            return self;
    
        }

    });

    return CodeView;

  
});