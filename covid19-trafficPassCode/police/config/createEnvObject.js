module.exports = function (envName, domain) {
  return {
    NODE_ENV: `"${envName}"`,
    HOST_DOMAIN: `"${domain}"`,
    DEBUG_MODE: false,
    // STATIC_PATH:`"/webapp/static"`,   // 前端靜態資源路徑
    // ROUTER_PATH: `"/webapp"`,         // 前端 vue router base
  }
}
