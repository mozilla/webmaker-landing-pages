module.exports = function (grunt) {
  var
    jsLocation = 'site/resources/js/**/*.js';

  grunt.loadNpmTasks('grunt-metalsmith');
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin'
  });

  grunt.initConfig({
    metalsmith: {
      landingPages: {
        options: {
          clean: false,
          metadata: {
            title: "Mozilla Webmaker"
          },
          plugins: {
            "metalsmith-markdown": {
              smartypants: true
            },
            "metalsmith-permalinks": {
              pattern: "from/:slug"
            },
            "metalsmith-templates": {
              engine: "nunjucks",
              directory: "site/templates"
            }
          }
        },
        src: 'site/src',
        dest: 'build'
      }
    },
    copy: {
      fonts: {
        cwd: 'site/resources/vendors/font-awesome/fonts/',
        expand: true,
        src: '**',
        dest: 'build/resources/fonts/'
      },
      img: {
        cwd: 'site/',
        expand: true,
        src: ['resources/img/**/*'],
        dest: 'build/'
      }
    },
    less: {
      styles: {
        files: {
          'build/resources/css/style.css': 'site/less/style.less',
          'site/resources/compiled/webmaker.css': 'site/less/pages/webmaker.less',
          'site/resources/compiled/sandstone.css': 'site/less/pages/sandstone.less'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      styles: {
        src: 'build/resources/css/*.css'
      }
    },
    watch: {
      options: {
        spawn: false
      },
      img : {
        files: ['resources/img/**/*'],
        tasks: ['copy:img']
      },
      html: {
        files: ['site/templates/**/*', 'site/src/**/*', 'site/resources/**/*'],
        tasks: [
          'metalsmith:landingPages',
          'useminPrepare',
          'usemin'
        ]
      },
      styles: {
        files: 'site/less/**/*.less',
        tasks: [
          'less:styles',
          'autoprefixer:styles',
          'useminPrepare',
          'concat',
          'uglify',
          'cssmin',
          'usemin'
        ]
      }
    },
    connect: {
      server: {
        options: {
          port: '9006',
          base: 'build'
        }
      }
    },
    jshint: {
      files: jsLocation,
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
            cwd: "build/resources/img/",
            src: ["**/*.{png,jpg,gif}"]
          }
        ]
      }
    },
    jsbeautifier: {
      modify: {
        src: jsLocation,
        options: {
          config: '.jsbeautifyrc'
        }
      },
      verify: {
        src: jsLocation,
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    },
    useminPrepare: {
      html: 'build/**/*.html',
      options: {
        root: 'site',
        dest: 'build'
      }
    },
    htmlmin: {
      build: {
        options: {
          collapseBooleanAttributes: true
        },
        files:  __dirname + 'build/**/*.html'
      },
      lint: {
        options: {
          lint: true
        },
        files: 'build/**/*.html'
      }
    },
    usemin: {
      html: ['build/**/*.html'],
      css: ['build/resources/css/**/*.css']
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
    'autoprefixer:styles',
    'metalsmith:landingPages',
    'copy',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'htmlmin:build',
    'usemin'
  ]);

  grunt.registerTask('dev', [
    'build',
    'connect:server',
    'watch'
  ]);

  // Clean & verify code (Run before commit)
  grunt.registerTask('default', [
    'jsbeautifier:modify',
    'jshint',
    'imagemin',
    'useminPrepare',
    'concat',
    'uglify',
    'htmlmin:build',
    'cssmin',
    'usemin'
  ]);

  // Verify code (Read only)
  grunt.registerTask('validate', [
    'jsbeautifier:verify',
    'htmlmin:lint',
    'jshint'
  ]);
};
