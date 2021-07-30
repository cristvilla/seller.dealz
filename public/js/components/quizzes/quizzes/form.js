/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/components/quizzes/quizzes/form.js":
/*!*********************************************************!*\
  !*** ./resources/js/components/quizzes/quizzes/form.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

new Vue({
  el: '#component',
  data: {
    name: {
      singular: 'Quiz',
      plural: 'Quizzes'
    },
    loading: false,
    submitting: false,
    url: {
      path: '/quizzes/quizzes'
    },
    quiz: {
      id: '',
      name: '',
      description: ''
    },
    config: {
      tinymce: {
        height: 350,
        menubar: false,
        branding: false,
        plugins: ['lists link image charmap anchor', 'media table paste help wordcount'],
        toolbar: 'bold italic |  bullist numlist outdent indent | removeformat | help'
      },
      large: {
        height: 350,
        menubar: false,
        branding: false,
        plugins: ['lists link image charmap anchor', 'media table paste help wordcount'],
        toolbar: 'bold italic | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | media link image charmap | removeformat | help',
        file_picker_callback: function file_picker_callback(callback, value, meta) {
          var url = '/mediamanager/modal';

          if (meta.filetype === 'image') {
            url += '/image';
          }

          if (meta.filetype === 'media') {
            url += '/video';
          }

          tinymce.activeEditor.windowManager.openUrl({
            title: 'Media Manager',
            url: url,
            onMessage: function onMessage(api, data) {
              callback(data.url, {
                'alt': 'Image',
                'data-media-id': data.id
              });
              api.close();
            }
          });
        },
        relative_urls: false,
        remove_script_host: false,
        convert_urls: true,
        content_css: '/css/frontend-tinymce.css'
      }
    },
    users: {
      url: '/admin/users/list',
      items: []
    },
    scoring_types: {
      url: '/quizzes/types/scorings/list',
      items: []
    }
  },
  methods: {
    submit: function submit() {
      var that = this;
      that.submitting = true;
      this.$validator.validateAll('quiz').then(function (result) {
        if (result) {
          that.quiz.action = 'update-about';
          axios({
            method: that.quiz.id !== '' ? 'PUT' : 'POST',
            url: that.url.path + (that.quiz.id !== '' ? '/' + that.quiz.id : ''),
            data: that.quiz
          }).then(function () {
            window.location = '/quizzes/quizzes';
          })["catch"](function () {
            var content = 'Failed to submit the form.';
            that.$bvToast.toast(content, {
              title: 'Error',
              variant: 'danger',
              solid: true
            });
            that.submitting = false;
          });
        } else {
          that.submitting = false;
        }
      })["catch"](function () {
        var content = 'Validation failed. Please check the form.';
        that.$bvToast.toast(content, {
          title: 'Error',
          variant: 'danger',
          solid: true
        });
        that.submitting = false;
      });
    }
  },
  beforeMount: function beforeMount() {
    var that = this;
    that.quiz = window.quizmaster.quiz;
    var role = window.quizmaster.user.role;
    var is_admin = role.slug === 'admin' || role.slug === 'developer';

    if (is_admin) {
      axios({
        method: 'GET',
        url: that.users.url + '?l=0'
      }).then(function (data) {
        that.users.items = data.data;
      });
      axios({
        method: 'GET',
        url: that.scoring_types.url + '?l=0'
      }).then(function (data) {
        that.scoring_types.items = data.data;
      });
    }
  }
});

/***/ }),

/***/ 18:
/*!***************************************************************!*\
  !*** multi ./resources/js/components/quizzes/quizzes/form.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/james/Projects/Web/GTC015 Quizmaster/resources/js/components/quizzes/quizzes/form.js */"./resources/js/components/quizzes/quizzes/form.js");


/***/ })

/******/ });