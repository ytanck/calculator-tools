//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    wx.showToast({
      title: '欢迎使用房贷计算器',
      icon: 'none',
      duration: 1500
    })
  },
  globalData: {
    mortgageData: null
  }
})