module.exports = function(grunt) {

  var TOKEN = (Math.random()*0xFFFFFFFFFFFFF).toString(16).replace(".", "");

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    browserify: {
      catholicHolidays: {
        files: {
          'js/catholicHolidays.js': ['lib/catholicHolidays.js'],
        },
        options: {
            transform: [["babelify", { "presets": ["es2015"] }]],
            browserifyOptions: {
              standalone: 'catholicHolidays'
            }
        }
      },
      momentJs: {
        files: {
          'js/moment-with-locales.js': ['node_modules/moment/min/moment-with-locales.js'],
        },
        options: {
            browserifyOptions: {
              standalone: 'moment'
            }
        }
      }
    },
    concat: {
        options: { separator: ';' },
        css: {
            src: [
                "js/keen-ui.min.css",
                "css/style.css"
            ],
            dest: "dist/style.css",
            options: { separator: '' }
        },
        jsBundle1: {
            src: [
                "js/moment-with-locales.js",
                "js/catholicHolidays.js",
                "js/vue.min.js",
                "js/vue-resource.min.js",
                "js/keen-ui.min.js",
                "js/catholicHolidays.js",
                "js/main.js"
            ],
            dest: "dist/bundle.js"
        }
    },
    uglify: {
        bundle: {
          files: (function (sToken) {
            var oResult = {};

            oResult["dist/bundle" + sToken + ".min.js"] = ['dist/bundle.js'];

            return oResult;
          })(TOKEN)
        }
     },
     cssmin: {
       target: {
         files: (function (sToken) {
           var oResult = {};

           oResult["dist/style" + sToken + ".min.css"] = ["dist/style.css"];

           return oResult;
         })(TOKEN)
       }
     },
     "string-replace": {
        index: {
            files: {
                "index.html": "index.html.template"
            }
        },
        options: {
            replacements: [{
                pattern: /__CACHEBUSTERTOKEN__/g,
                replacement: TOKEN
            }]
        }
     },
     clean: ["dist"]
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['clean', 'browserify', 'concat', 'uglify', 'cssmin', 'string-replace']);
};
