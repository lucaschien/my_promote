const globalObj = {}

class WebStorage {
  constructor (storage) {
    this.storage = storage
  }
  get (key) {
    let valueStr = this.storage.getItem(key)
    try {
      return JSON.parse(valueStr)
    } catch (e) {
      return valueStr
    }
  }
  set (key, value) {
    let valueStr = JSON.stringify(value)
    return this.storage.setItem(key, valueStr)
  }
  remove (key) {
    this.storage.removeItem(key)
  }
}

export const storage = {
  local: new WebStorage(window.localStorage)
}
