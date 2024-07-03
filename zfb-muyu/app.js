import alipayUtils from "./utils/alipayUtils";
import { checkVersion } from "./utils/tool";
require("./mixins/mixins.js");
const config = require("./config.json");

App({
  alipayUtils,
  globalData: {
    systemInfo: null,
    networkType: "",
    webViewUrl: null,
    //  webview页面链接
    uid: "",
    //  用户UID
    firstChannel: null,
    // 首次进页面的渠道
    isFirstInPage: true,
    query: {}
  },
  async onLaunch(options) {
    if (!checkVersion()) {
      // 查看当前基础库版本
      if (!my.canIUse("plugin") && !my.isIDE) {
        my.ap && my.ap.updateAlipayClient && my.ap.updateAlipayClient();
      }
      my.alert({
        content: "亲，您当前的版本过低，请升级至最新版本"
      });
      return;
    }

    // 网络信息
    await this.getNetworkType();
    // 系统信息
    await this.getSystemInfo();
    // 小程序版本
    this.getAppVersion();
    // 当页面onLoad或者onShow中有调用getUserInfo时，添加notAutoUserInfo: true,
    // 页面外投时不自动调用userInfo；
    // 否则统一在onLaunch调用，防止lock导致页面锁死请求。
    const pages = getCurrentPages();
    const curPage = pages && pages.pop();
    if (!curPage || !curPage.notAutoUserInfo) {
      this.queryUserInfo(); // 调取用户信息， 首页单独调用
    }
  },
  onPageNotFound() {
    my.redirectTo({
      url: "/pages/index/index"
    });
  },
  onShow(options) {
    if (options.scene) {
      this.globalData.scene = options.scene;
    } else if (my.getLaunchOptionsSync) {
      this.globalData.scene = my.getLaunchOptionsSync().scene;
    }
    console.log("=====2222=====", options);
  },
  //获取用户uid
  async queryUserInfo(callback) {
    
  },
  getAppVersion() {
    var _accountInfo$miniProg, _accountInfo$miniProg2;
    if (this.globalData.app_version) {
      return this.globalData.app_version;
    }
    console.log('====getAppVersion====', my.canIUse('getAccountInfoSync'));
    if (!my.canIUse('getAccountInfoSync')) {
      return '';
    }
    const accountInfo = my.getAccountInfoSync();
    this.globalData.app_version = accountInfo === null || accountInfo === void 0 ? void 0 : (_accountInfo$miniProg = accountInfo.miniProgram) === null || _accountInfo$miniProg === void 0 ? void 0 : _accountInfo$miniProg.version;
    return (accountInfo === null || accountInfo === void 0 ? void 0 : (_accountInfo$miniProg2 = accountInfo.miniProgram) === null || _accountInfo$miniProg2 === void 0 ? void 0 : _accountInfo$miniProg2.version) || '';
  },
  isAndroid: function () {},
  isIos: function () {},

  /**
   * 网络状态
   * @returns
   */
  getNetworkType() {
    if (this.globalData.networkType) {
      return Promise.resolve(this.globalData.networkType);
    } else {
      return new Promise((resolve, reject) => {
        my.getNetworkType({
          success: res => {
            this.globalData.networkType = res.networkType;
            resolve(res.networkType);
          },
          fail: err => {
            reject(err);
          }
        });
      });
    }
  },
  /**
   * 系统信息
   * @returns
   */
  getSystemInfo() {
    if (this.globalData.systemInfo) {
      return Promise.resolve(this.globalData.systemInfo);
    } else {
      return new Promise((resolve, reject) => {
        my.getSystemInfo({
          success: res => {
            this.globalData.systemInfo = res || {};
            console.log("getSystemInfo", res);
            resolve(res);
          },
          fail: err => {
            reject(err);
          }
        });
      });
    }
  },
  /**
   * 获取uuid 10min内无操作则变更uuid，否则取缓存内uuid
   */
  getUuidv4() {
    const uuid_v4_info = alipayUtils.getStorageSync("uuid_v4_info");
    const {
      uuid_v4,
      uuid_timestamp
    } = uuid_v4_info || {};
    const nowTime = new Date().getTime();
    if (nowTime - uuid_timestamp < 10 * 60 * 1000 && uuid_v4) {
      alipayUtils.setStorageSync("uuid_v4_info", {
        uuid_v4,
        uuid_timestamp: new Date().getTime() // 重置时间戳
      });
      return uuid_v4;
    }
    const newUuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0;
      let v = c == "x" ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
    alipayUtils.setStorageSync("uuid_v4_info", {
      uuid_v4: newUuid,
      uuid_timestamp: new Date().getTime() // 重置时间戳
    });
    return newUuid;
  },

});