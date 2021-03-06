'use strict';

var path = require('path');
var config = require('config');

let dataDirectory = config.get('database.data_directory');
if (!path.isAbsolute(dataDirectory)) {
    dataDirectory = path.join(__dirname, dataDirectory, './.oak');
}

module.exports = function(grunt) {

    grunt.initConfig({
        babel: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*.js'],
                        dest: '.dist/'
                    }
                ]
            },
            test: {
                files: [
                    {
                        expand: true,
                        cwd: 'test/',
                        src: ['**/*.js'],
                        dest: '.test/'
                    }
                ]
            },
            tools: {
                files: [
                    {
                        expand: true,
                        cwd: 'tools/',
                        src: ['**/*.js'],
                        dest: '.tools/'
                    }
                ]
            }
        },
        copy: {
            target: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: [
                            '**/*.html',
                            '**/*.css'
                        ],
                        dest: '.dist/'
                    }
                ]
            }
        },
        eslint: {
            options: {
                configFile: '.eslintrc.json'
            },
            src: ['src/**/*.js', 'test/**/*.js']
        },
        mochacli: {
            options: {
                reporter: 'spec'
            },
            unit: {
                files: {
                    src: ['.test/unit/**/*.js']
                }
            },
            functional: {
                files: {
                    src: ['.test/functional/**/*.js']
                }
            }
        },
        clean: {
            assets: ['!assets/img/placeholder.jpeg', 'assets/img/m*.jpeg', 'assets/img/i*.jpeg'],
            coverage: ['coverage/', 'coverage.lcov', '.nyc_output'],
            dist: ['.dist/'],
            test: ['.test/'],
            tools: ['.tools/'],
            database: [dataDirectory]
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('build', ['clean:dist', 'babel:dist', 'copy']);
    grunt.registerTask('lint', ['eslint']);
    grunt.registerTask('test', ['lint', 'build', 'clean:test', 'babel:test', 'mochacli']);
    grunt.registerTask('lintless-test', ['build', 'clean:test', 'babel:test', 'mochacli']);
    grunt.registerTask('prepublish', ['test', 'clean:dist', 'babel:dist']);
    grunt.registerTask('tools', ['build', 'clean:tools', 'babel:tools']);
    grunt.registerTask('delete-database', ['clean:database']);

};
