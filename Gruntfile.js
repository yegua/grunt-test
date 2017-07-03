const mozjpeg = require('imagemin-mozjpeg');
module.exports = function(grunt) {
    // LiveReload的默认端口号，你也可以改成你想要的端口号
   var lrPort = 35729;
   // 使用connect-livereload模块，生成一个与LiveReload脚本
   // <script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
   var lrSnippet = require('connect-livereload')({ port: lrPort });
   var serveStatic = require('serve-static');
   var serveIndex = require('serve-index');
   // 使用 middleware(中间件)，就必须关闭 LiveReload 的浏览器插件
   var lrMiddleware = function(connect, options) {
      return [
       // 把脚本，注入到静态文件中
       lrSnippet,
        // 静态文件服务器的路径
         serveStatic(options.base[0]),
        // 启用目录浏览(相当于IIS中的目录浏览)
        serveIndex(options.base[0])
      ];
   };
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),//获取解析package.json将内容保存在pkg中
    clean: {
      all: ['build/*'],
      unImg: ["build/*", "!build/images"]
    },
    copy: {
        src: {
          files: [
            {expand: true, cwd: 'src', src: ['*.html'], dest: 'build'}
          ]
        }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/js/**/*.js'],
      options: {
          // more options here if you want to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },
    // concat: {
    //   options: {
    //     // 定义一个用于插入合并输出文件之间的字符
    //     separator: ';'
    //   },
    //   dist: {
    //     // 将要被合并的文件
    //     src: ['src/js/libs/*.js'],
    //     // 合并后的JS文件的存放位置
    //     dest: 'src/js/libs/all.js'
    //   }
    // },
    // concat: {
    //     bar: {
    //         src: ["src/customers/*.js"],
    //         dest: 'dist/customers/all.js',
    //     },
    //     css: {
    //         src: ["src/css/*.css"],
    //         dest: 'src/css/all.css'
    //     }
    // },
    // uglify: {
    //   options: {
    //     // 此处定义的banner注释将插入到输出文件的顶部
    //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
    //     mangle: false//变量和函数名称不压缩       
    //     // mangle: {
    //     //     except: ["jquery"]//不压缩的关键字列表
    //     // }
        
    //   },
    //   dist: {
    //     files: [{
    //         src: 'src/js/libs/all.js',
    //         dest: 'build/js/libs/all.min.js'
    //     }]
    //   }
    //   // my_target: {
    //   //     files: [
    //   //       {
    //   //         expand: true,
    //   //         //相对路径
    //   //         cwd: 'src/js',
    //   //         src: '**/*.js',
    //   //         dest: 'build/js/',
    //   //         rename: function (dest, src) {  
    //   //               var folder = src.substring(0, src.lastIndexOf('/'));  
    //   //               var filename = src.substring(src.lastIndexOf('/'), src.length);  
    //   //               //  var filename=src;  
    //   //               filename = filename.substring(0, filename.lastIndexOf('.'));  
    //   //               var fileresult=dest + folder + filename + '.js';  
    //   //               grunt.log.writeln("现处理文件："+src+"  处理后文件："+fileresult);  
    //   //               return fileresult;  
    //   //               //return  filename + '.min.js';  
    //   //             } 
    //   //       }
    //   //     ]
    //   // }
    // },
     //压缩JS
    uglify: {
      generated: {
        files: [
          {dest: 'build/js/customers/index.js', src: ['src/js/customers/*.js']},
          {dest: 'build/js/libs/basic.min.js', src: ['src/js/libs/zepto-tap.js', 'src/js/libs/zepto.min.js']}
        ]
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/images',
          src: '**/*.{gif,GIF,jpg,JPG,png,PNG}',
          dest: 'build/images'
        }]
      }   
    },
    sass: {
        dist: {
          files: [{
            expand: true,
            cwd: 'src/sass',
            src: ['*.scss'],
            dest: 'src/css',
            ext: '.css'
          }]
        },
        options: {
            style: 'expanded'
        }
    }, 
    cssmin: {
        options: {
            noAdvanced : true
        },
        target: {
            files: [
              {
                expand : true,
                cwd : 'src/css',
                src : ['*.css'],
                dest : 'build/css',
                ext : '.css'
              }
            ]
        }
    },
    // // 静态文件hash
    // filerev: {
    //   css: {
    //     src: 'src/css/*.css',
    //     dest: 'dist/styles/'
    //   },
    //   js: {
    //     src: 'src/customers/*.js',
    //     dest: 'dist/customers/'
    //   }
    // },
    // // 替换
    // usemin: {
    //   options: {
    //     assetsDirs: [
    //       'dist', 
    //       'dist/styles', 
    //       'dist/customers'
    //     ]
    //   },
    //   css: 'dist/styles/*.css',
    //   html: 'dist/*.html'
    // },
    // 通过connect任务，创建一个静态服务器
    connect: {
       options: {
        // 服务器端口号
        port: 8080,
        // 服务器地址(可以使用主机名localhost，也能使用IP)
        hostname: 'localhost',
        // 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
        base: '.'
       },
       livereload: {
        options: {
         // 通过LiveReload脚本，让页面重新加载。
         middleware: lrMiddleware
        }
       }
    },
    // 处理html中css、js 引入合并问题
    useminPrepare:{
      html: 'index.html',
      options: {
        root: 'threeKingdoms_xq',
        dest: 'build'
      }
    },
    usemin: {
      html: 'build/index.html'
    },
    //压缩HTML
    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: false
      },
      html: {
        files: {
          'build/index.html': 'build/index.html'
        }
      }
    },
    // 通过watch任务，来监听文件是否有更改
    watch: {
       client: {
        // 我们不需要配置额外的任务，watch任务已经内建LiveReload浏览器刷新的代码片段。
        options: {
         livereload: lrPort
        },
        // '**' 表示包含所有的子目录
        // '*' 表示包含所有的文件
        files: ['src/*.html', 'src/css/*', 'src/js/**/*','src/sass/*.scss','src/images/*'],//监控的文件列表
        tasks: ['sass', 'cssmin']//监控的任务列表
       }
    }
  });

  //注册复合任务
  // grunt.registerMultiTask('log', 'Log stuff.', function() {
  //     grunt.log.writeln(this.target + ': ' + this.data);
  // });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin'); 
  grunt.loadNpmTasks('grunt-contrib-htmlmin'); 
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-usemin');
  //grunt.loadNpmTasks('connect-livereload');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch'); 
  grunt.registerTask('live', ['connect', 'watch']);
  grunt.registerTask('default', ['clean','copy', 'uglify:generated','cssmin','imagemin','useminPrepare','usemin','htmlmin']);
  //http://127.0.0.1:8080/src/ 默认执行index.html
  
};
