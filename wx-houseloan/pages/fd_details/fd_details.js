// pages/fd_details/fd_details.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        arr: [
        ],
        monthRepayment: 0,
        curIndex: null, //临时变量  保存点击的是谁

    },
    changeShow(e) {
        var index = e.currentTarget.dataset.index;
        var list = this.data.arr;
        for(let i  = 0; i < list.length; i++) {
            if (index == list[i].index) {
                list[i].isShow = !list[i].isShow;
            }else {
                list[i].isShow = false;
            }
        }
        this.setData({
            arr: list
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取数据数组
        var info = JSON.parse(options.info);
        // 月均还款
        var monthRepayment = Number(info[0].monthRepayment);
        // return
        var year = info[0].year.slice(0,info[0].year.length-1);
        // 获取年数 = 数组长度 / 12;
        var len = info.length / 12;
        // 获取选择的时间
        var date = info[0].date;
        // 获取年份
        var date_year = Number(date.slice(0, 4));
        // 获取月份
        var month = Number(date.slice(date.indexOf("-") + 1, date.lastIndexOf("-")))
        // 获取第一年剩余多少个月
        var first_months = 12 - (info[0].date.slice(info[0].date.indexOf("-") + 1, info[0].date.lastIndexOf("-"))) + 1;
        // 获取最后一年剩余多少个月
        var last_months = 12 - first_months;
         // 创建第一年的数据数组
        var first_info = [];
        // 创建最后一年的数据数组
        var last_info = [];
        // 定义第一年的总利息
        var first_lx = null;
        // 定义最后一年的总利息
        var last_lx = null;
        //定义第一年的总还款
        var first_hk = null;
        //定义最后一年的总还款
        var last_hk = null;
        // 备份数据数组
        var _info = JSON.parse(options.info);
        // 备份列表数组
        var _arr = this.data.arr;
    
        if(year == "1" && month ===1 ) {
            // 根据年数循环创建列表数组
             for (let i = 0; i < year; i++) {
                // 每循环一次  创建一份年份对象
                var obj = {};
                // 根据这两项控制列表的显示隐藏
                obj.index = i;
                obj.isShow = false;
                obj.month = 1;
                // 给每个年份对象创建一个月份数组
                obj.months = [];
                // 将obj添加到列表数组中
                _arr.push(obj)
            }
            first_info = _info.splice(0, 12);
            // 循环计算第一年的总利息
            first_lx = first_info.map(function (item, index) {
                return Number(item.everyMonthRepayment_lx)
            }).reduce(function (a, b) {
                return a + b;
            })
            //循环计算第一年的总还款
            first_hk = first_info.map(function (item, index) {
                return Number(item.monthRepayment)
            }).reduce(function (a, b) {
                return a + b;
            })
            // 将第一年的数据放入
            _arr[0].months = first_info;
            _arr[0].lx = first_lx;
            _arr[0].hk = first_hk;
            _arr[0].month = month;
            this.setData({
                arr: _arr,
                date_year,
                monthRepayment,
            })
        }
        else if (year == "1" && month !== 1) {
            // 说明是一年  不同月份  创建两个
            for (let i = 0; i < 2; i++) {
                // 每循环一次  创建一份年份对象
                var obj = {};
                // 根据这两项控制列表的显示隐藏
                obj.index = i;
                obj.isShow = false;
                // 给每个年份对象创建一个月份数组
                obj.month = 1;
                obj.months = [];
                // 将obj添加到列表数组中
                _arr.push(obj)
            }
            // 根据第一年剩余多少个月对数据数组进行截取 从0 开始  截取到第一年剩余多少个月 
            first_info = _info.splice(0, first_months);
            // 最后一年的数据数组  从-的剩余月数  截取剩余月数个项
            last_info = _info.splice(-last_months, last_months);
            // 循环计算第一年的总利息
            first_lx = first_info.map(function (item, index) {
                return Number(item.everyMonthRepayment_lx)
            }).reduce(function (a, b) {
                return a + b;
            })
            // 循环计算最后一年的总利息
            last_lx = last_info.map(function (item, index) {
                return Number(item.everyMonthRepayment_lx)
            }).reduce(function (a, b) {
                return a + b;
            })
            //循环计算第一年的总还款
            first_hk = first_info.map(function (item, index) {
                return Number(item.monthRepayment)
            }).reduce(function (a, b) {
                return a + b;
            })
            //循环计算最后一年的总还款
            last_hk = last_info.map(function (item, index) {
                return Number(item.monthRepayment)
            }).reduce(function (a, b) {
                return a + b;
            })
            // 将第一年的数据放入
            _arr[0].months = first_info;
            _arr[0].lx = first_lx;
            _arr[0].hk = first_hk;
            _arr[0].month = month;

            _arr[1].months = last_info;
            _arr[1].lx = last_lx;
            _arr[1].hk = last_hk;
            _arr[1].month = 1;

            this.setData({
                arr: _arr,
                date_year,
                monthRepayment,
            })

        }
        else if (year != "1" && month === 1) {
            // 说明大于1年  并且是整年还款

            for (let i = 0; i < year; i++) {
                // 每循环一次  创建一份年份对象
                var obj = {};
                // 根据这两项控制列表的显示隐藏
                obj.index = i;
                obj.isShow = false;
                obj.month = 1;

                // 给每个年份对象创建一个月份数组
                obj.months = _info.splice(0, 12);
                obj.lx = obj.months.map(function (item, index) {
                    return Number(item.everyMonthRepayment_lx)
                }).reduce(function (a, b) {
                    return a + b;
                })
                obj.hk = obj.months.map(function (item, index) {
                    return Number(item.monthRepayment)
                }).reduce(function (a, b) {
                    return a + b;
                })
                // 将obj添加到列表数组中
                _arr.push(obj)
            }
            this.setData({
                arr: _arr,
                date_year,
                monthRepayment,
            })
        }else {
            // 说明是大于1年  不整年还款


            // 先创建两个保存第一年与最后一年的
            for (let i = 0; i < 2; i++) {
                // 每循环一次  创建一份年份对象
                var obj = {};
                // 根据这两项控制列表的显示隐藏
                obj.index = i;
                obj.month = 1;

                obj.isShow = false;
                // 给每个年份对象创建一个月份数组
                obj.months = [];
                // 将obj添加到列表数组中
                _arr.push(obj)
            }
            // 根据第一年剩余多少个月对数据数组进行截取 从0 开始  截取到第一年剩余多少个月 
            first_info = _info.splice(0, first_months);
            // 最后一年的数据数组  从-的剩余月数  截取剩余月数个项
            last_info = _info.splice(-last_months, last_months);
            // 循环计算第一年的总利息
            first_lx = first_info.map(function (item, index) {
                return Number(item.everyMonthRepayment_lx)
            }).reduce(function (a, b) {
                return a + b;
            })
            // 循环计算最后一年的总利息
            last_lx = last_info.map(function (item, index) {
                return Number(item.everyMonthRepayment_lx)
            }).reduce(function (a, b) {
                return a + b;
            })
            //循环计算第一年的总还款
            first_hk = first_info.map(function (item, index) {
                return Number(item.monthRepayment)
            }).reduce(function (a, b) {
                return a + b;
            })
            //循环计算最后一年的总还款
            last_hk = last_info.map(function (item, index) {
                return Number(item.monthRepayment)
            }).reduce(function (a, b) {
                return a + b;
            })
            // 将第一年的数据放入
            _arr[0].months = first_info;
            _arr[0].lx = first_lx;
            _arr[0].hk = first_hk;
            _arr[0].month = month;
            // 将第最后一年的数据放入
            _arr[1].months = last_info;
            _arr[1].lx = last_lx;
            _arr[1].hk = last_hk;
            var n_arr = [];
            for (let i = 0; _info.length / 12; i++) {
                // 每循环一次  创建一份年份对象
                var obj = {};
                // 根据这两项控制列表的显示隐藏
                obj.index = i + 1;
                obj.isShow = false;
                obj.month = 1;
                // 给每个年份对象创建一个月份数组
                obj.months = _info.splice(0, 12);
                obj.lx = obj.months.map(function (item, index) {
                    return Number(item.everyMonthRepayment_lx)
                }).reduce(function (a, b) {
                    return a + b;
                })
                obj.hk = obj.months.map(function (item, index) {
                    return Number(item.monthRepayment)
                }).reduce(function (a, b) {
                    return a + b;
                })
                n_arr.push(obj)
            }
            // 数组合并
            var num = 1;
            n_arr.unshift(num, 0);
            Array.prototype.splice.apply(_arr, n_arr);
            // 修改合并后的最后一项索引
            _arr[_arr.length - 1].index = _arr.length - 1;
            this.setData({
                arr: _arr,
                date_year,
                monthRepayment,
                month
            })
        }
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