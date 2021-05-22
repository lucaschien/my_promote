import MobileDetect from 'mobile-detect';

const state = {
  clientUserId: null, // line liff 提供 userId
  // 記錄 client 端是否為手機用
  isMobile: (() => {
    var md = new MobileDetect(window.navigator.userAgent);
    let os = md.os();
    let agent = md.userAgent();
    if (os === null) {
      return false
    }
    return true
  })(),

}

export default state
