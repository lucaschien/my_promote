// 解析瀏覽器url參數
function parseURLparm() {
  var href = window.location.href;
  var vars = {}, hash;
  var hashes = href.slice(href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    if (Array.isArray(hash[0], vars) > -1) {
      vars[hash[0]] = hash[1];
    }
  }
  return vars;
}
