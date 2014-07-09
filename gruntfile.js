module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin'
  });

  grunt.initConfig({
    landingpages: {
      // store commonly used directories in case we change them later
      app: 'site',
      buildTarget: 'build',
      serverTarget: '.server',
      jsLocation: 'resources/js/**/*.js'
    },
    metalsmith: {
      server: {
        options: {
          clean: false,
          metadata: {
            title: 'Mozilla Webmaker'
          },
          plugins: {
            'metalsmith-markdown': {
              smartypants: true
            },
            'metalsmith-permalinks': {
              pattern: 'from/:slug'
            },
            'metalsmith-templates': {
              engine: 'nunjucks',
              directory: '<%= landingpages.app %>/templates'
            }
          }
        },
        src: '<%= landingpages.app %>/src',
        dest: '<%= landingpages.serverTarget %>'
      },
      build: {
        options: {
          clean: false,
          metadata: {
            title: 'Mozilla Webmaker'
          },
          plugins: {
            'metalsmith-markdown': {
              smartypants: true
            },
            'metalsmith-permalinks': {
              pattern: 'from/:slug'
            },
            'metalsmith-templates': {
              engine: 'nunjucks',
              directory: '<%= landingpages.app %>/templates'
            }
          }
        },
        src: '<%= landingpages.app %>/src',
        dest: '<%= landingpages.buildTarget %>'
      }
    },
    copy: {
      fontsServer: {
        cwd: '<%= landingpages.app %>/resources/vendors/font-awesome/fonts/',
        expand: true,
        src: '**',
        dest: '<%= landingpages.serverTarget %>/resources/fonts/'
      },
      imgServer: {
        cwd: '<%= landingpages.app %>/',
        expand: true,
        src: ['resources/img/**/*'],
        dest: '<%= landingpages.serverTarget %>/'
      },
      javascript: {
        cwd: '<%= landingpages.app %>/',
        expand: true,
        src: ['resources/js/**/*'],
        dest: '<%= landingpages.serverTarget %>/'
      },
      vendor: {
        cwd: '<%= landingpages.app %>/',
        expand: true,
        src: ['resources/vendors/**/*'],
        dest: '<%= landingpages.serverTarget %>/'
      },
      fontsBuild: {
        cwd: '<%= landingpages.app %>/resources/vendors/font-awesome/fonts/',
        expand: true,
        src: '**',
        dest: '<%= landingpages.buildTarget %>/resources/fonts/'
      },
      imgBuild: {
        cwd: '<%= landingpages.app %>/',
        expand: true,
        src: ['resources/img/**/*'],
        dest: '<%= landingpages.buildTarget %>/'
      }
    },
    less: {
      styles: {
        files: {
          '<%= landingpages.app %>/resources/compiled/webmaker.css': '<%= landingpages.app %>/less/pages/webmaker.less',
          '<%= landingpages.app %>/resources/compiled/sandstone.css': '<%= landingpages.app %>/less/pages/sandstone.less'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      server: {
        expand: true,
        cwd: '<%= landingpages.app %>/resources/compiled/',
        src: '*.css',
        dest: '<%= landingpages.serverTarget %>/resources/compiled/'
      },
      build: {
        src: '<%= landingpages.buildTarget %>/resources/css/*.css'
      }
    },
    watch: {
      options: {
        spawn: false
      },
      img: {
        files: ['resources/img/**/*'],
        tasks: ['copy:imgServer']
      },
      javascript: {
        files: ['resources/js/**/*'],
        tasks: ['copy:javascript']
      },
      html: {
        files: [
          '<%= landingpages.app %>/templates/**/*',
          '<%= landingpages.app %>/src/**/*',
          '<%= landingpages.app %>/resources/**/*'
        ],
        tasks: [
          'metalsmith:server'
        ]
      },
      styles: {
        files: '<%= landingpages.app %>/less/**/*.less',
        tasks: [
          'less:styles',
          'autoprefixer:server'
        ]
      }
    },
    connect: {
      server: {
        options: {
          port: '9006',
          base: '<%= landingpages.serverTarget %>'
        }
      }
    },
    jshint: {
      files: '<%= landingpages.app %>/<%= landingpages.jsLocation %>',
      options: grunt.file.readJSON('.jshintrc')
    },
    imagemin: {
      options: {
        optimizationLevel: 7,
        pngquant: false
      },
      primary: {
        files: [
          {
            expand: true,
            cwd: '<%= landingpages.buildTarget %>/resources/img/',
            src: ['**/*.{png,jpg,gif}']
          }
        ]
      }
    },
    jsbeautifier: {
      modify: {
        src: '<%= landingpages.app %>/<%= landingpages.jsLocation %>',
        options: {
          config: '.jsbeautifyrc'
        }
      },
      verify: {
        src: '<%= landingpages.app %>/<%= landingpages.jsLocation %>',
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    },
    useminPrepare: {
      html: '<%= landingpages.buildTarget %>/**/*.html',
      options: {
        root: '<%= landingpages.app %>',
        dest: '<%= landingpages.buildTarget %>'
      }
    },
    htmlmin: {
      options: {
        collapseBooleanAttributes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        keepClosingSlash: true
      },
      modify: {
        files: [
          '<%= landingpages.app %>/src/**/*.html',
          '<%= landingpages.app %>/templates/**/*.html'
        ]
      },
      lint: {
        options: {
          lint: true
        },
        files: [
          '<%= landingpages.app %>/src/**/*.html',
          '<%= landingpages.app %>/templates/**/*.html'
        ]
      }
    },
    usemin: {
      html: ['<%= landingpages.buildTarget %>/**/*.html'],
      css: ['<%= landingpages.buildTarget %>/resources/css/**/*.css']
    },
    // Usemin adds files to concat
    concat: {},
    // Usemin adds files to uglify
    uglify: {},
    // Usemin adds files to cssmin
    cssmin: {
    }
  });

  grunt.registerTask('build', [
    'less:styles',
    'metalsmith:build',
    'copy:imgBuild',
    'copy:fontsBuild',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'htmlmin:build',
    'usemin',
    'autoprefixer:build'
  ]);

  grunt.registerTask('dev', [
    'less:styles',
    'autoprefixer:server',
    'metalsmith:server',
    'copy:fontsServer',
    'copy:imgServer',
    'copy:javascript',
    'copy:vendor',
    'connect:server',
    'watch'
  ]);

  // Clean & verify code (Run before commit)
  grunt.registerTask('default', [
    'jsbeautifier:modify',
    'jshint',
    'htmlmin:modify',
    'imagemin'
  ]);

  // Verify code (Read only)
  grunt.registerTask('validate', [
    'jsbeautifier:verify',
    'htmlmin:lint',
    'jshint'
  ]);
};
