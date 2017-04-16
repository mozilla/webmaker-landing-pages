module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    shell: 'grunt-shell-spawn'
  });

  grunt.initConfig({
    landingpages: {
      // store commonly used directories in case we change them later
      app: 'site',
      buildTarget: 'build',
      serverTarget: '.server',
      jsLocation: 'resources/js/**/*.js'
    },
    clean : {
      build: '<%= landingpages.buildTarget %>',
      server: '<%= landingpages.serverTarget %>'
    },
    shell: {
      server: {
        options: {
          async: true
        },
        command: 'node app'
      }
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
            'metalsmith-permalinks': {},
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
        src: '<%= landingpages.jsLocation %>',
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
      },
      styles: {
        cwd: '<%= landingpages.app %>/',
        expand: true,
        src: ['resources/compiled/**/*'],
        dest: '<%= landingpages.serverTarget %>/'
      },
      // Assets for partner landing page template
      partnerAssets: {
        cwd: '<%= landingpages.app %>/',
        expand: true,
        src: ['resources/compiled/partner.css', 'resources/vendors/makerstrap/dist/makerstrap.min.css'],
        dest: '<%= landingpages.buildTarget %>/'
      }
    },
    less: {
      styles: {
        files: {
          '<%= landingpages.app %>/resources/compiled/core.css': '<%= landingpages.app %>/less/core.less',
          '<%= landingpages.app %>/resources/compiled/partner.css': '<%= landingpages.app %>/less/pages/partner.less'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      build: {
        src: '<%= landingpages.buildTarget %>/resources/compiled/*.css'
      }
    },
    watch: {
      options: {
        atBegin: true
      },
      img: {
        files: '<%= landingpages.app %>/img/**/*',
        tasks: ['copy:imgServer']
      },
      javascript: {
        files: '<%= landingpages.app %>/<%= landingpages.jsLocation %>',
        tasks: ['copy:javascript']
      },
      html: {
        files: [
          '<%= landingpages.app %>/templates/**/*',
          '<%= landingpages.app %>/src/**/*'
        ],
        tasks: [
          'metalsmith:server'
        ]
      },
      styles: {
        files: '<%= landingpages.app %>/less/**/*.less',
        tasks: [
          'less:styles',
          'copy:styles'
        ]
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
            src: ['<%= landingpages.buildTarget %>/resources/img/**/*.{png,jpg,gif}']
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
        collapseBooleanAttributes: true
      },
      build: {
        files: __dirname + '<%= landingpages.buildTarget %>/**/*.html'
      },
      lint: {
        options: {
          lint: true
        },
        files: '<%= landingpages.buildTarget %>/**/*.html'
      }
    },
    usemin: {
      html: ['<%= landingpages.buildTarget %>/**/*.html'],
      css: ['<%= landingpages.buildTarget %>/resources/compiled/*.css']
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
    'clean',
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
    'autoprefixer:build',
    'copy:partnerAssets'
  ]);

  grunt.registerTask('dev', [
    'clean:server',
    'copy:fontsServer',
    'copy:vendor',
    'shell:server',
    'watch'
  ]);

  // Clean & verify code (Run before commit)
  grunt.registerTask('default', [
    'jsbeautifier:modify',
    'jshint',
    'htmlmin:build',
    'imagemin'
  ]);

  // Verify code (Read only)
  grunt.registerTask('validate', [
    'jsbeautifier:verify',
    'htmlmin:lint',
    'jshint'
  ]);
};
