// pages/home/info/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    key: "Key_Info_NEW",
    title: "资讯",
    itemsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: this.data.title
    });
    this.getItem()

  },
  getItem() {
    let _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      // url: 'https://open.tophub.today/hot',
      url:'https://c.3g.163.com/nc/article/list/T1467284926140/0-40.html',
      // url:'https://www.mxnzp.com/api/news/list/v2?typeId=532&page=1&app_id=qqknjvrjrohlkpyp&app_secret=CHPhSZS4Y0oIFSheVy8YN4zvIl2VTf7T',
      // header: {
      //   "Content-Type": "application/json;charset=UTF-8"
      // },
      success: res => {
        wx.hideLoading();
        if (res.data) {
          console.log(res.data) 
          _this.setData({
            itemsList: res.data.T1467284926140
            // itemsList: res.data.data.items
          })
        } else {
          wx.showToast({
            title: "服务器繁忙,请稍后再试!",
            icon: 'none'
          })
        }
      },
      fail: res => {
        wx.showToast({
          title: "网络繁忙,请稍后再试!",
          icon: 'none'
        })
      }
    });
  },
  clickNews(e){
    const {item} = e.target.dataset
    console.log(123,item);
    // 个人号不支持业务域名配置，所以不支持webview跳转
    // wx.navigateTo({
    //   url: '../../webview/webview?url='+item.url,
    // })
  },

  onShareAppMessage: function () {},
  onShareTimeline: function () {},

  onShow() {
  },


})