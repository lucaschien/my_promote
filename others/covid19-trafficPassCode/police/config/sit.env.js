'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const createEnvObject = require('./createEnvObject');

var env = createEnvObject('sit', '//sit.eyesmedia.com.tw');
env = merge(env, {
  STATIC_PATH:'"/static"',
  ROUTER_PATH:'"/"'
});

module.exports = merge(prodEnv, env);
