module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      production: {
        src: './.public/production.js',
        dest: './.public/production.js'
      }
    },

    clean: {
      js: ['./.public/*.js'],
      css: ['./.public/*.css'],
      views: ['./.public/views/'],
      directives: ['./.public/directives/']
    },

    concat: {
      options: {
        separator: '\n'
      },
      client: {
        src: [
          './app/app.js',
          './app/fireBaseFactory.js',
          './app/fireBaseTimer.js',
          './app/views/**/*.js',
          './app/directives/**/*.js',
        ],
        dest: './.public/production.js'
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          './.public/styles.css': ['./app/assets/css/main.css']
        }
      }
    },

    copy: {
      index: {
        files: [
          {expand: true, flatten: true, src: ['./app/index.html'], dest: './.public/'}
        ]
      },
      views: {
        files: [
          {expand: true, flatten: true, src: ['./app/views/**/*.html'], dest: './.public/views/'}
        ]
      },
      directives: {
        files: [
          {expand: true, flatten: true, src: ['./app/directives/**/*.html'], dest: './.public/directives/'}
        ]
      }
    },

    shell: {
      firebase: {
        command: 'firebase deploy',
        options: {
          stdout: true,
          stderr: true
        }
      },
      localserver: {
        command: 'nodemon server.js'
      }
    },

    'http-server': {
      dev: {
        root: './.public/',
        port: 8080,
        runInBackground: false
      }
    },

    jshint: {
      files: [
        './app/**/*.js',
        './Gruntfile.js'
      ],
      options: {
        force: 'true'
      }
    },

    watch: {
      client: {
        files: ['./app/**'],
        tasks: ['jshint', 'clean', 'build']
      }
    },

  });


  // Load the plugins //////////////////////////////////////////
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-shell');

  // Dev Env /////////////////////////////////////////

  grunt.registerTask('server-dev', function(target) {
    var http = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'http-server'
    });

    http.stdout.pipe(process.stdout);
    http.stderr.pipe(process.stderr);

    grunt.task.run(['watch']);

  });

  // Helper Tasks ////////////////////////////////////

  grunt.registerTask('build', function(n) {

    grunt.task.run(['concat']);
    grunt.task.run(['cssmin']);
    grunt.task.run(['copy']);
    if (grunt.option('prod')) {
      //grunt.task.run(['uglify'])
    }

  });

  grunt.registerTask('test', [
    'jshint'
  ]);

  grunt.registerTask('upload', function(n) {
    grunt.task.run(['build']);
    if (grunt.option('prod')) {
      //
      grunt.task.run(['shell:firebase']);
    }
    else {
      grunt.task.run(['shell:localserver']);
    }
  });

  // Grunt Tasks /////////////////////////////////////
  grunt.registerTask('deploy', [
    'test',
    'clean',
    'upload'
  ]);

};