class StringUtils {
  /** String.format
   * 用法: format('/member/my/api/my/collect/{0}/{1}', 'C5', '1');
   * @param {string} format
   * @return {string}
   */
  format(format) {
    var args = Array.prototype.slice.call(arguments, 1)
    return format.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] !== 'undefined' ? args[number] : match
    })
  }
  /** 全型轉半型字元
   * @param {string} str
   * @return {string}
  */
  toSBC(str) {
    let tmp = '';
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) == 12288) {
        tmp = tmp + String.fromCharCode(str.charCodeAt(i) - 12256);
        continue;
      }
      if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
        tmp = tmp + String.fromCharCode(str.charCodeAt(i) - 65248);
      }
      else {
        tmp = tmp + String.fromCharCode(str.charCodeAt(i));
      }
    }
    return tmp;
  }
  // 將 http 或 https 開頭的字串轉成 <a>
  replaceHttpsToAlink(msg) {
    let temp = JSON.parse(JSON.stringify(msg));
    let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|:|%|#|@)+)/g;
    temp = temp.replace(reg, '<a href="$1$2" target="_blank">$1$2</a>'); // 強制另開分頁
    return temp;
  }
}
let stringUtils = new StringUtils()
export default stringUtils
