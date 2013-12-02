module.exports = function(grunt) {
 
      
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({
 
        pkg: grunt.file.readJSON('package.json'),

        // Metadata.
        meta: {
            basePath: './dev/',
            srcPath: 'assets/sass/',
            deployPath: 'assets/css/'
        },
 
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> ',
 
        // Task configuration.
        sass: {
            dist: {
                files: {
                    '<%= meta.deployPath %>main.css': '<%= meta.srcPath %>main.scss'
                }
            }
        },
 
        watch: {
            options: {
                livereload: true
            },
            styles: {
                files: [
                    '<%= meta.srcPath %>/**/*.scss'
                ],
                tasks: ['sass']
            }
        },

        // grunt-express will serve the files from the folders listed in `bases`
        // on specified `port` and `hostname`
        express: {
            all: {
                options: {
                    port: 8000,
                    hostname: "0.0.0.0",
                    bases: ['./dev/'],
                    livereload: true
                }
            }
        },
   
        // grunt-open will open your browser at the project's URL
        open: {
            all: {
                // Gets the port from the connect configuration
                path: 'http://0.0.0.0:<%= express.all.options.port%>'
            }
        },


        /**
        *
        * r.js build
        * 
        * ------------------------------------------------- */
        
        requirejs: {
            compile: {
                options: {
                    baseUrl: "dev/assets/js/",
                    name: 'libs/almond',
                    include: ['app'],
                    insertRequire: ['app'],
                    out: "build/assets/js/roboboogie.min.js",
                    preserveLicenseComments: false,
                    findNestedDependencies: true,
                    paths: {
                        'ace': 'libs/ace/src-min-noconflict/ace',
                        'backbone': 'libs/backbone',
                        'fixtures': 'libs/backbone-fixtures',
                        'jquery': 'libs/jquery-1.8.3.min',
                        'keymaster': 'libs/keymaster',
                        'Mustache': 'libs/mustache',
                        'modernizr': 'libs/modernizr-latest',
                        'Handlebars': 'libs/handlebars',
                        'hbars': 'libs/hbars',
                        'howler': 'libs/howler',
                        'howl': 'libs/howler',
                        'preload': 'libs/preloadjs-NEXT.min',
                        'segment': 'libs/segment',
                        'ball': 'libs/ball',
                        'socialite': 'libs/socialite',
                        'square': 'libs/square',
                        'stache': 'libs/stache',
                        'sketch': 'libs/sketch',
                        'swiper': 'libs/idangerous.swiper-2.2.min',
                        'transit': 'libs/jquery.transit.min',
                        'text': 'libs/text',
                        'underscore': 'libs/underscore'
                    },
                    shim: {
                        'ace': {
                            exports: 'ace'
                        },
                        'jQuery': {
                            exports: 'jQuery'
                        },
                        'keymaster': {
                            exports: 'key'
                        },
                        'modernizr': {
                            exports: 'Modernizr'
                        },
                        'Handlebars': {
                            exports: 'Handlebars'
                        },
                        'preload': {
                            exports: 'createjs.PreloadJS'
                        },
                        'segment': {
                            exports: 'Segment'
                        },
                        'swiper': {
                            exports: 'Swiper'
                        },
                        'ball': {
                            exports: 'Ball'
                        },
                        'socialite': {
                          exports: 'Socialite'
                        },
                        'square': {
                            exports: 'Square'
                        },
                        'sketch': {
                            exports: 'Sketch'
                        },
                        'transit': {
                            deps: ['jquery']
                        }
                    }
                }
            }
        },

        /**
        *
        * Copy files and folders to new dir
        * 
        * ------------------------------------------------- */
        
        copy: {
            // js : {
            //     expand: true, 
            //     cwd: 'dev/assets/js/libs/',
            //     src: '**',
            //     dest: 'build/assets/js/libs/'
            // },
            api : {
                expand: true, 
                cwd: 'dev/api/',
                src: '**',
                dest: 'build/api/'
            },
            css : {
                expand: true, 
                cwd: 'dev/assets/css/',
                src: '**',
                dest: 'build/assets/css/'
            },
            data : {
                expand: true, 
                cwd: 'dev/assets/data/',
                src: '**',
                dest: 'build/assets/data/'
            },
            font : {
                expand: true, 
                cwd: 'dev/assets/font/',
                src: '**',
                dest: 'build/assets/font/'
            },
            music : {
                expand: true, 
                cwd: 'dev/assets/music/',
                src: '**',
                dest: 'build/assets/music/'
            }
        },


        /**
        *
        * Replace timestamps for versioning
        * 
        * ------------------------------------------------- */
        
        replace: {
            dist: {
            options: {
                patterns: [
                    {
                        match: 'timestamp',
                        replacement: '<%= new Date().getTime() %>'
                    }
                ]
            },
            files: [
                    {
                        src: ['build/index.html'], 
                        dest: 'build/index.html'
                    }
                ]
            }
        },



        /**
        *
        * Process html - swaps out the dev script tag for the build one
        * 
        * ------------------------------------------------- */
        
        processhtml: {
            options: {
                data: {
                    message: 'Hello world!'
                }
            },
            dist: {
            files: {
                'build/index.html': ['dev/index.html']
            }
        }
        },


        /**
        *
        * Minified CSS
        * 
        * ------------------------------------------------- */
        
        cssmin: {
            minify: {
                files: {
                    'build/assets/css/main.css': ['build/assets/css/main.css']
                }
            }
        },


        /**
        *
        * Image minification
        * 
        * ------------------------------------------------- */
        
        imagemin: {                        
            dynamic: {                         
                files: [{
                    expand: true,                 
                    cwd: 'dev/assets/img/',         
                    src: ['**/*.{png,jpg,gif}'],  
                    dest: 'build/assets/img/'         
                }]
            }
        }
 
    });
 

    /**
    *
    * Load the neccesary tasks
    * 
    * ------------------------------------------------- */
    
    
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    /**
    *
    * Build task
    * 
    * ------------------------------------------------- */

    var buildTasks      = [
        'copy', 
        'processhtml', 
        'replace', 
        'cssmin',
        'imagemin',
        'requirejs'
    ];

    grunt.registerTask('build', buildTasks);

    /* Server
     ------------------------------------------------- */
    
    grunt.registerTask('server', [
      'express',
      'open',
      'watch'
    ]);
 
};