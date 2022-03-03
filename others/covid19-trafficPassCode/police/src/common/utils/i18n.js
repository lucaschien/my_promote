import i18n from '../../i18n'; 
// Internationalization
class i18nUtils {
  generateTitle(title) {
    const hasKey = i18n.te(`${title}`)
    const translatedTitle = i18n.t(`${title}`) // $t :this method from vue-i18n, inject in @/lang/index.js
  
    if (hasKey) {
      return translatedTitle
    }
    return title
  }
}
let i18n_utils = new i18nUtils()
export default i18n_utils
