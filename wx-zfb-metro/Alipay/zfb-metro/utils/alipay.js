/**
 *封装alipay api
 *
 * @class Alipay
 */
class Alipay {
  /**
   * 同步获取storage
   * @param {string} key
   */
  static getStorageSync(key) {
    const {
      data = {}
    } = my.getStorageSync({
      key
    }) || {};
    return data == null ? {} : data;
  }

  /**
   * 异步获取storage
   * @param {string} key
   */
  static async getStorage(key) {
    const {
      data = {}
    } = await new Promise((resolve, reject) => {
      my.getStorage({
        key,
        success: resolve,
        fail: reject
      });
    });
    return data == null ? {} : data;
  }

  /**
   *存储 storage
   *
   * @static
   * @param {*} key
   * @param {*} data
   * @memberof Alipay
   */
  static setStorageSync(key, data) {
    Object.assign(data, {
      // 添加时间戳
      time: new Date().getTime()
    });
    my.setStorageSync({
      key,
      data
    });
  }

  /**
   *异步存储 storage
   *
   * @static
   * @param {*} key
   * @param {*} data
   * @memberof Alipay
   */
  static setStorage(key, data) {
    Object.assign(data, {
      // 添加时间戳
      time: Date.now()
    });
    return new Promise((resolve, reject) => {
      my.setStorage({
        key,
        data,
        success: resolve,
        fail: reject
      });
    });
  }

  /**
   *移除storage
   *
   * @static
   * @param {*} key
   * @memberof Alipay
   */
  static removeStorageSync(key) {
    my.removeStorageSync({
      key
    });
  }

  /**
  *移除storage
  *
  * @static
  * @param {*} key
  * @memberof Alipay
  */
  static removeStorage(key) {
    my.removeStorage({
      key
    });
  }

  /**
   * 判断用户是否收藏了小程序
   */
  static isFavorite() {
    return new Promise((resolve, reject) => {
      my.isFavorite({
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        }
      });
    });
  }

  /**
   * 收藏小程序
   */
  static addToFavorite() {
    return new Promise((resolve, reject) => {
      my.addToFavorite({
        bizType: 'xxx',
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        }
      });
    });
  }

  // 获取系统信息
  static getSystemInfo() {
    return new Promise((resolve, reject) => {
      my.getSystemInfo({
        success(res) {
          resolve(res);
        }
      });
    });
  }
  static getNetWorkType() {
    return new Promise((resolve, reject) => {
      my.getNetworkType({
        success: res => {
          resolve(res.networkType);
        },
        fail: () => {
          resolve(null);
        }
      });
    }).catch(() => {
      my.showToast({
        content: '哎呀！获取网络类型失败'
      });
    });
  }
  static showToast(content, duration = 500) {
    my.showToast({
      content,
      duration
    });
  }

  // 函数节流
  static throttle(fn, gapTime) {
    if (gapTime == null || gapTime === undefined) {
      gapTime = 1500;
    }
    let _lastTime = null;
    // 返回新的函数
    return function () {
      const _nowTime = +new Date();
      if (_nowTime - _lastTime > gapTime || !_lastTime) {
        fn.apply(this, arguments); // 将this和参数传给原函数
        _lastTime = _nowTime;
      }
    };
  }
  static sleep(time = 0) {
    return new Promise((resolve, reject) => {
      if (time) {
        setTimeout(() => {
          resolve();
        }, time);
      } else {
        resolve();
      }
    });
  }
}
export default Alipay;