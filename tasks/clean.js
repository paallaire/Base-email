const gulp = require('gulp');
const del = require('del');

module.exports = function () {

  del(['public,prod']);
  
};