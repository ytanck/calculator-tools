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
        const { data = {} } = my.getStorageSync({ key }) || {};
        return data == null ? {} : data;
    }
    /**
     * 异步获取storage
     * @param {string} key
     */
    static async getStorage(key) {
        const { data = {} } = await new Promise((resolve, reject) => {
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
        Object.assign(data, { // 添加时间戳
            time: (new Date())
                .getTime()
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
        Object.assign(data, { // 添加时间戳
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
            key,
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
            key,
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
                },
            });
        });
    }
    /**
     * 收藏小程序
     */
    static addToFavorite() {
        return new Promise((resolve, reject) => {
            my.addToFavorite({
                bizType: 'P_RPC_2018092561507369_YIDONGTEQUAN',
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
}
export default Alipay;
