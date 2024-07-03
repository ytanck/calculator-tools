import Alipay from "./utils/alipay.js";


App({
  globalData: {},
  async onLaunch(options) {},
  //查询uid
  async queryUserInfo() {
    return new Promise(async (resolve, reject) => {
      const uid = await Alipay.getStorageSync('uid');
      if(uid){
        resolve(uid)
      }else{
        reject('')
      }
      
    });
  }
});