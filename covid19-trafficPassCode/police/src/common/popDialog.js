import swal from 'sweetalert2'
import i18nUtils from '@/common/utils/i18n'
const popDialog = {
  normal (title, text, confirmCallback, cancelCallback) {
    swal({
      title: title,
      html: text,
      confirmButtonText: i18nUtils.generateTitle('common.certain'),
      showCancelButton: true,
      cancelButtonText: i18nUtils.generateTitle('common.cancel'),
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: 'pop_dialog for-normal'
    })
      .then(result => {
        if (result.value) {
          // confirm button
          if (confirmCallback) {
            confirmCallback()
          }
        }
        if (cancelCallback) {
          cancelCallback()
        }
      })
      .catch(reason => {
        if (cancelCallback) {
          cancelCallback()
        }
      })
  },
  alert (text, confirmCallback) {
    swal({
      html: text,
      confirmButtonText:  i18nUtils.generateTitle('common.certain'),
      confirmButtonClass: 'btn-secondary',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: 'pop_dialog for-alrat'
    })
      .then(result => {
        if (confirmCallback) {
          confirmCallback()
        }
      })
      .catch(reason => {
        if (confirmCallback) {
          confirmCallback()
        }
      })
  },
  singleBtn (title, text, buttobText = i18nUtils.generateTitle('common.certain'), confirmCallback) {
    swal({
      title: title,
      html: text,
      confirmButtonText: buttobText,
      confirmButtonClass: 'btn-secondary',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: 'pop_dialog for-singleBtn'
    })
      .then(result => {
        if (result.value) {
          // confirm button
          if (confirmCallback) {
            confirmCallback()
          }
        }
      })
      .catch(reason => {
        if (confirmCallback) {
          confirmCallback()
        }
      })
  },
  timer (text, confirmCallback, milliseconds=2000) {
    swal({
      html: text,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: 'timer',
      background: "transparent",
      backdrop: "transparent",
      timer: milliseconds
    })
      .then(result => {
        if (confirmCallback) {
          confirmCallback()
        }
      })
      .catch(reason => {
        if (confirmCallback) {
          confirmCallback()
        }
      })
  }
}

export default popDialog
