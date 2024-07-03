// queryMixins.js
const app = getApp();
/**
 * 区分渠道，处理query相关逻辑
 */
export default {
  data: {
    query: {}
  },
  onLoad(query) {
    console.log('*****query******', query, app.globalData);
    const myQuery = {
      ...query
    };
    const isQueryEmpty = JSON.stringify(myQuery) === '{}';
    const globalQuery = app.globalData.query ? {
      ...app.globalData.query
    } : {};
    // 合并globalquery
    const handleQuery = isQueryEmpty ? globalQuery : {
      ...globalQuery,
      ...myQuery
    };
    if (!Object.keys) {
      Object.keys = function (obj) {
        let k = [];
        for (let p in obj) {
          if (!Object.prototype.hasOwnProperty.call(obj, p)) continue;
          k.push(p);
        }
        return k;
      };
    }
    // 处理渠道
    const hasPageSource = Object.keys(handleQuery).find(item => item === 'pageSource' || item === 'sourceId');
    if (hasPageSource) {
      handleQuery.channel = handleQuery[hasPageSource];
      delete handleQuery[hasPageSource];
    }
  }
};