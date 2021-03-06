module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dir: {
            src: 'src',
            dist: 'dist',
            styles: '<%= dir.src %>/styles'
        },
        banner: '/*!\n' +
        ' * University of Alabama Libraries Styles v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
        ' * Copyright 2014-<%= grunt.template.today("yyyy") %>\n' +
        ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
        ' */\n',
        clean: {
            dist: '<%= dir.dist %>',
            styleguide: 'styleguide',
            less: '<%= dir.styles %>/ualib-styles.less'
        },
        concat: {
          gh_pages_index: {
              src: 'src/index.html',
              dest: 'index.html',
              options: {
                  process: true
              }
          },
          less: {
              src: ['<%= dir.styles %>/*.less'],
              dest: '<%= dir.styles %>/<%= pkg.name %>.less'
          }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'dist',
                src: ['*.css', '!*.min.css'],
                dest: 'dist',
                ext: '.min.css'
            }
        },
        usebanner:{
            options: {
                position: 'top',
                banner: '<%= banner %>'
            },
            files: {
                src: 'dist/*.css'
            }
        },
        customizeBootstrap: {
            build:{
                options: {
                    src: 'src/styles/bootstrap/',
                    dest: 'src/styles'
                }
            }
        },
        less: {
            ualib: {
                options: {
                    paths: ["src/styles/"],
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: '<%= pkg.name %>.css.map',
                    sourceMapFilename: 'dist/<%= pkg.name %>.css.map'
                },
                files: {
                    "dist/<%= pkg.name %>.css": "src/styles/<%= pkg.name %>.less"
                }
            },
            styleguide: {
                options: {
                    paths: ["src/styleguide-template/public"]
                },
                files: {
                    "styleguide/public/ualib-styleguide.css": "src/styleguide-template/public/ualib-styleguide.less"
                }
            }
        },
        exec: {
            kss: {
                command: 'kss-node src/styles --template src/styleguide-template'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-customize-bootstrap');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-banner');

    grunt.registerTask('build-styleguide', ['clean:styleguide', 'exec', 'less:styleguide']);
    grunt.registerTask('dist-css', ['customizeBootstrap', 'clean:less:dist', 'concat:less', 'less:ualib', 'cssmin', 'usebanner']);
    grunt.registerTask('default', ['dist-css', 'build-styleguide', 'concat:gh_pages_index']);
};