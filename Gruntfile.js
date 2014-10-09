module.exports = function(grunt) {
    grunt.registerTask('default', ['build']);
    grunt.registerTask('dev', ['build', 'concurrent']);

    grunt.registerTask('build', ['clean', 'copy', 'styles', 'scripts']);

    grunt.registerTask('styles', ['compass']);
    grunt.registerTask('scripts', [/*'shell:bower',*/ 'jshint', 'concat', 'uglify']);


    grunt.initConfig({
        shell: {
            // install bower packages
            bower: {
                command: 'node_modules/bower/bin/bower install'
            },
            server: {
                command: 'cd build; php -S localhost:3005'
            }
        },

        clean: {
            build: {
                src: ['build']
            }
        },
        
        copy: {
            images: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/img/',
                        src: ['**/*'],
                        dest: 'build/img/'
                    }
                ]
            },
            php: {
                files: [{
                    expand: true,
                    cwd: 'src/php',
                    src: ['**/*.php'],
                    dest: 'build/'
                }]
            }
        },

        // Styles
        compass: {
            build: {
                options: {
                    sassDir: 'src/scss/',
                    specify: 'src/scss/style.scss',
                    cssDir: 'build/',
                    outputStyle: 'compressed'
                }
            }
        },

        // Scripts
        jshint: {
            options: {
                camelcase: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                freeze: false,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonbsp: true,
                nonew: true,
                plusplus: false,
                quotmark: 'single',
                undef: true,
                unused: true,
                strict: false,
                maxparams: 4,
                maxdepth: 4,
                maxlen: 120,
                trailing: true,
                globals: {
                    $: false,
                    jQuery: false,
                    google: false
                }
            },
            grunt: {
                options: {
                    node: true
                },
                src: ['Gruntfile.js']
            },
            build: {
                options: {
                    browser: true
                },
                src: [
                    'src/js/**/*.js'
                ]
            }
        },
        concat: {
            build: {
                options: {
                    separator: ';\n'
                },
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/bpopup/jquery.bpopup.js',

                    'src/js/scripts.js'
                ],
                dest: 'build/scripts.js'
            }
        },
        uglify: {
            static: {
                src: 'build/scripts.js',
                dest: 'build/scripts.js'
            }
        },

        concurrent: {
            dev: {
                tasks: ['shell:server', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        // Watch
        watch: {
            css: {
                files: ['src/scss/**/*.scss'],
                tasks: ['styles'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['scripts'],
                options: {
                    livereload: true
                }
            },
            php: {
                files: ['src/php/**/*.php'],
                tasks: ['copy:php'],
                options: {
                    livereload: true
                }
            },
            images: {
                files: ['src/img/**/*'],
                tasks: ['copy:images'],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.loadNpmTasks('grunt-contrib-compass');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
};