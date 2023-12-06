// pages/index/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        money: "",
        o_money: "",
        result: ""
    },


    change(e) {
     
        this.setData({
            money: e.detail.value
        })
    },


    change_a(e) {
        this.setData({
            o_money: e.detail.value
        })
    },

    sub() {
        var { money, o_money} = this.data;
        money = Number(money) * 10000;
        o_money = Number(o_money) * 10000;
        var data = {}
        data.result = ((money - o_money) * 0.2);
        wx.navigateTo({
            url: '/pages/result/result?data=' + JSON.stringify(data),
        })
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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