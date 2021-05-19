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


// 區分要打開哪一個 endpointType 的div區塊
function showEndpointTypeBlock (endpointType) {
  // 消費者端
  if (endpointType === 'REISTER') { // 已申請通行證,未申請通行證
    $('.endpointType_REISTER').addClass('show');
    $('.main').addClass('recording');
  }
  if (endpointType === 'FOOTPRINT') { // 28日足跡
    $('.endpointType_FOOTPRINT').addClass('show');
    $('.main').addClass('footprint');
  }

  // 店家端
  if (endpointType === 'STANDARD') { // 一般類
    $('.endpointType_STANDARD').addClass('show');
    $('.main').addClass('normal');
  }
  if (endpointType === 'TRAFFIC') { // 交通類
    $('.endpointType_TRAFFIC').addClass('show');
    $('.main').addClass('traffic');
  }
  if (endpointType === 'B_FOOTPRINT') { // 28日足跡
    $('.endpointType_B_FOOTPRINT').addClass('show');
    $('.main').addClass('b-footprint');
  }
  if (endpointType === 'QRCODE') { // 下載QA code
    $('.endpointType_QRCODE').addClass('show');
    $('.main').addClass('qrcode');
  }

}