// pages/CalculationResult/CalculationResult.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        is: 0,
        result: {}
    },
    gotoInfo(e) {
        wx.navigateTo({
            url: '/pages/fd_details/fd_details?info=' +  JSON.stringify(this.data.result.info),
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(JSON.parse(options.data))
        this.setData({
            result: JSON.parse(options.data),
            is: options.is
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // console.log(this.data.result)
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})