// sit
var apiPath = 'https://sit.eyesmedia.com.tw/covid19-footprint';
var bLiffId = '1656001745-aAmeEVo1'; 
var cLiffId = '1655865887-gqaQ9dee';

// biz 


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

// 驗證手機號
function is_mobile(mobile) {
  if (mobile === '') {
    return false;
  } else {
    // 台灣手機規則
    if (!(/^09[0-9]{8}$/.test(mobile))) {
      return false;
    }
    return true;
  }
}

// 區分要打開哪一個 endpointType 的div區塊
function showEndpointTypeBlock (endpointType) {
  //alert(endpointType);

  // 消費者端
  if (endpointType === 'REGISTER') { // 已申請通行證,未申請通行證
    $('.endpointType_REGISTER').addClass('show');
    $('.main').addClass('user');
  }
  if (endpointType === 'MODIFYUSER') { // 修改會員資料
    $('.endpointType_MODIFYUSER').addClass('show');
    $('.main').addClass('user');
    $('.user').addClass('modifyuser');
    document.title = '實聯制｜修改會員資料';
  }
  if (endpointType === 'FOOTPRINT') { // 28日足跡
    $('.endpointType_FOOTPRINT').addClass('show');
    $('.main').addClass('footprint');
    document.title = '防疫新生活｜實聯制';
  }

  // 店家端
  if (endpointType === 'STANDARD') { // 一般類申請
    $('.endpointType_STANDARD').addClass('show');
    $('.main').addClass('normal');
    document.title = '店家申請單：一般類';
  }
  if (endpointType === 'TRAFFIC') { // 交通類申請
    $('.endpointType_TRAFFIC').addClass('show');
    $('.main').addClass('traffic');
    document.title = '店家申請單：交通類';
  }
  if (endpointType === 'B_FOOTPRINT') { // 28日足跡
    $('.endpointType_B_FOOTPRINT').addClass('show');
    $('.main').addClass('b-footprint');
    document.title = '防疫新生活｜實聯制';
  }
  if (endpointType === 'QRCODE') { // 下載QA code
    $('.endpointType_QRCODE').addClass('show');
    $('.main').addClass('qrcode');
    document.title = '店家專屬QRcode';
  }
  if (endpointType === 'STANDARD_COMPLETE') { // 一般類完成
    $('.endpointType_STANDARD_COMPLETE').addClass('show');
    document.title = '店家申請單：一般類';
  }
  if (endpointType === 'TRAFFIC_COMPLETE') { // 交通類完成
    $('.endpointType_TRAFFIC_COMPLETE').addClass('show');
    document.title = '店家申請單：交通類';
  }


}