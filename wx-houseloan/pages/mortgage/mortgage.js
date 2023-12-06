let app = getApp();
// pages/mortgage/mortgage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        calculator: 0, //默认的计算器类型
        isshow: 0, //默认显示页面
        sdRate: 4.35, //商贷利率
        providentFundRate: 2.75, //公积金利率
        verifyTotalLoans: 0,//验证贷款总额
        verifyGjijinloan: 0, //验证购基金贷款总额
        verifyUnivalent: 0,//验证单价
        verifyArea: 0,//验证面积
        hkMethod: 0, //默认还款方式
        calculation: ["按贷款总额","按单价"],  //计算方式
        index: 0, // 默认计算方式
        totalLoans: '', //贷款总额
        gjijinloan: '', // 公积金贷款总额
        unitPrice: '', //单价
        area: '', //面积
        date: '', // 首次还款日期
        years: ["1年", "2年", "3年", "4年", "5年", "6年", "7年", "8年", "9年", "10年", "11年", "12年", "13年", "14年", "15年", "16年", "17年", "18年", "19年", "20年", "21年", "22年", "23年", "24年", "25年", "26年", "27年", "28年", "29年", "30年",], //按揭年数
        yearsIndex: 0, //默认年数
        ratio: ["1成", "2成", "3成", "4成", "5成", "6成", "6.5成", "7成", "8成", "9成", "10成"], // 按揭成数
        ratioIndex: 0, //默认按揭成数
        nper: '12期',//还款期数
        // 税费计算
        twoIsshow: 0,
        verifyNewHomeMoney: 0,
        verifyNewHomeArea: 0,
        verifyTwoHandHomeArea: 0,
        verifyTwoHandHomePrice: 0,
        verifyTwoHandHomeOldPrice: 0,
        newHomeMoney:"", //新房单价
        newHomeArea: "", // 新房面积
        twoHandHomeArea: "",//二手房面积
        twoHandHomePrice: "", //二手房总价
        twoHandHomeOldPrice: "",// 二手房原价
        buyYears: ["不满两年","满两年", "满五年"], //二手房购置年限
        buyYearsIndex: 0, //默认购置年限
        isBuyOnly: 0, //二手房买房唯一
        isOne: 0,// 二手房首套
    },
    // 切换计算器类型
    changeCalculator(e) {
        this.setData({
            calculator: e.currentTarget.dataset.index
        })
        wx.setNavigationBarTitle({
            title: e.currentTarget.dataset.title,
        })
        this.resetInputVerify()
    },
    // 切换显示页
    changeMain(e) {
        this.setData({
            isshow: e.currentTarget.dataset.index
        })
    },
    // 切换还款方式
    changeHkMethod(e) {
        this.setData({
            hkMethod: e.currentTarget.dataset.index
        })
    },
    // 切换计算方式
    bindPickerChange(e) {
        this.setData({
            index: e.detail.value,
        })
        this.resetInputVerify()
    },
    // 清空验证表单样式
    resetInputVerify() {
       this.setData({
           verifyTotalLoans: 0,//验证贷款总额
           verifyUnivalent: 0,
           verifyArea: 0,
           verifyGjijinloan: 0, //验证购基金贷款总额
       })
    },
    // 切换按揭年数
    bindPickerChangeYears(e) {
        if (e.detail.value == 0) {
            this.setData({
                sdRate: "4.35",
                providentFundRate: "2.75"
            })
        } else if (e.detail.value >= 1 && e.detail.value <= 4 ) {
            this.setData({
                sdRate: "4.75",
                providentFundRate: "2.75"
            })
        } else if (e.detail.value > 4) {
            this.setData({
                sdRate: "4.9",
                providentFundRate: "3.25"
            })
        }
        var year = this.data.years[e.detail.value]
        var nper = year.slice(0, year.length - 1) * 12 + "期"
        this.setData({
            yearsIndex: e.detail.value,
            nper
        })
    },
    // 切换首次还款日期
    bindDateChange(e) {
        this.setData({
            date: e.detail.value
        })
    },
    // 
    bindPickerChangeRatio(e) {
        this.setData({
            ratioIndex: e.detail.value,
        }) 
    },
  
    // 提交
    submit(e) {
        // 房贷总额   商贷利率  按揭年数数组  选中的年数索引 期数  还款方式   公积金利率
        var { totalLoans, sdRate, years, yearsIndex, nper, hkMethod, providentFundRate, ratio, ratioIndex, unitPrice, area, gjijinloan, date} = this.data;
        // 商贷月利率
        const a = sdRate / 100 / 12;
        // 公积金月利率
        const b = providentFundRate / 100 / 12;
        // 月数
        const month = parseInt(nper.slice(0, nper.length - 1));
        // 成数 
        const _ratio = Number(ratio[ratioIndex].slice(0, ratio[ratioIndex].length - 1)) / 10;
        // 还款月序号
        var monthIndex = Number(date.slice(date.indexOf("-") + 1, date.lastIndexOf("-")));
        // 获取本年剩余月数  +1是算上当前月
        const surplus_month = 12 - date.slice(date.indexOf("-") + 1, date.lastIndexOf("-")) + 1;
        if (this.data.isshow == 0) {
            // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++   商贷
            if (this.data.hkMethod == 0) {
                //商贷 等额本息
                if (this.data.index == 0) {
                // -----------------------------------------------
                    //商贷 等额本息 贷款总额 计算方式
                    if (totalLoans == '') {
                        this.showModal();
                        return
                    }
                    //1 + 月利率的期数方
                    var _b = Math.pow(a + 1, month); 
                    // 月还款
                    var monthRepayment = totalLoans * a * [_b / (_b - 1)] * 10000;
                    monthRepayment = monthRepayment.toFixed(2);
                    //总利息
                    var totalInterest = [month * monthRepayment - (totalLoans * 10000)] / 10000;
                    totalInterest = totalInterest.toFixed(2);
                    //还款总额
                    var totalMoney = month * monthRepayment / 10000;
                    totalMoney = totalMoney.toFixed(2);
                    // 创建明细数据数组              
                    var info = [];
                    // 遍历期数
                    for (let i = 0; i < month; i++) {
                        // 创建一个对象 
                        var obj = {};

                        var _c = Math.pow((1 + a), ((i + 1) - 1));
                        //本年还款
                        var yearRepayment = monthRepayment * surplus_month;
                        yearRepayment = yearRepayment.toFixed(2)
                        // 每月应还利息
                        var everyMonthRepayment_lx = (_b - _c) / (_b - 1) * a * totalLoans * 10000;
                        everyMonthRepayment_lx = everyMonthRepayment_lx.toFixed(2)
                        // 每月应还本金
                        var everyMonthRepayment_bj = _c / (_b - 1) * a * totalLoans * 10000;
                        everyMonthRepayment_bj = everyMonthRepayment_bj.toFixed(2)
                        // 本期剩余本金
                        var ccc = 1 / Math.pow((1 + a), (month + 1 - (i + 1) )) * (1 - 1 / Math.pow((1 + a), (i + 1))) / (1 - 1 / (1 + a)) * monthRepayment;
                        var result = (totalLoans * 10000 - ccc).toFixed(2);
                        // 对象赋值
                        obj.monthRepayment = monthRepayment;
                        obj.everyMonthRepayment_lx = everyMonthRepayment_lx;
                        obj.everyMonthRepayment_bj = everyMonthRepayment_bj;
                        obj.result = result;
                        obj.date = date;
                        obj.year = years[yearsIndex];
                        info.push(obj)
                    }
                    var data = {
                        date,
                        isshow: 0,
                        totalLoans, // 商贷总额
                        monthRepayment, //月还款
                        totalInterest,//总利息
                        totalMoney,//还款总额
                        month,// 期数
                        hk_Method: hkMethod == 0 ? "等额本息" : "等额本金",
                        info,
                    };

                // -----------------------------------------------------------------------------------------------

                }else{
                    //商贷 等额本息 单价 计算方式
                    // ------------------------------------------------------------------------------------------------
                    if (unitPrice == '' && area == '') {
                        this.showModal();
                        return
                    }
                    var homePrice = unitPrice * area;
                    // 贷款总额  = 单价 * 面积 * 成数
                    var totalLoans = unitPrice * area * _ratio / 10000;
                   
                    var _b = Math.pow(a + 1, month);
                    // 每月应还
                    var monthRepayment = totalLoans * a * [_b / (_b - 1)] * 10000;
                    monthRepayment = monthRepayment.toFixed(2);
                    //总利息
                    var totalInterest = [month * monthRepayment - (totalLoans * 10000)] / 10000;
                    totalInterest = totalInterest.toFixed(2);
                    //还款总额
                    var totalMoney = month * monthRepayment / 10000;
                    totalMoney = totalMoney.toFixed(2);
                    // 创建明细数据数组
                    var info = [];
                    // 遍历期数
                    for (let i = 0; i < month; i++) {
                        // 创建一个对象 
                        var obj = {};

                        var _c = Math.pow((1 + a), ((i + 1) - 1));
                        //本年还款
                        var yearRepayment = monthRepayment * surplus_month;
                        yearRepayment = yearRepayment.toFixed(2)
                        // 每月应还利息
                        var everyMonthRepayment_lx = (_b - _c) / (_b - 1) * a * totalLoans * 10000;
                        everyMonthRepayment_lx = everyMonthRepayment_lx.toFixed(2)
                        // 每月应还本金
                        var everyMonthRepayment_bj = _c / (_b - 1) * a * totalLoans * 10000;
                        everyMonthRepayment_bj = everyMonthRepayment_bj.toFixed(2)
                        // 本期剩余本金
                        var ccc = 1 / Math.pow((1 + a), (month + 1 - (i + 1))) * (1 - 1 / Math.pow((1 + a), (i + 1))) / (1 - 1 / (1 + a)) * monthRepayment;
                        var result = (totalLoans * 10000 - ccc).toFixed(2);
                        // 对象赋值
                        obj.monthRepayment = monthRepayment;
                        obj.everyMonthRepayment_lx = everyMonthRepayment_lx;
                        obj.everyMonthRepayment_bj = everyMonthRepayment_bj;
                        obj.result = result;
                        obj.date = date;
                        obj.year = years[yearsIndex];
                        info.push(obj)
                    }
                    var data = {
                        date,
                        homePrice,
                        calculation: "单价",
                        isshow: 0,
                        totalLoans, // 商贷总额
                        monthRepayment, //月还款
                        totalInterest,//总利息
                        totalMoney,//还款总额
                        month,// 期数
                        hk_Method: hkMethod == 0 ? "等额本息" : "等额本金",
                        info,
                    };
                }
            }else {
                //商贷 等额本金
                if (this.data.index == 0) {
                    //商贷 等额本金 贷款总额 计算方式
                    // ------------------------------------------------------------------------                    
                    if (totalLoans == '') {
                        this.showModal();
                        return
                    }
                    // 总利息
                    var totalInterest = totalLoans * a * (month + 1) / 2;
                    // 还款总额
                    var totalMoney = totalInterest + parseInt(totalLoans);
                    //月均还款  总利息 + 总代额 / 期数
                    var monthRepayment = (((totalInterest + parseInt(totalLoans)) / month) * 10000).toFixed(2);
                    // 当月应还后半部分
                    var curMonthEnd = 1 / month + 1 * a;
                    //当月应还
                    var curMonth = totalLoans * curMonthEnd * 10000;
                    curMonth = curMonth.toFixed(2);
                    // 创建明细数据数组
                    var info = [];
                    // 遍历期数
                    for (let i = 0; i < month; i++) {
                        // 创建一个对象 
                        var obj = {};
                        // 本期还款
                        var monthRepayment = (totalLoans * 10000) * (1 / month + (1 - (i - 1 + 1) / month) * a)
                        monthRepayment = monthRepayment.toFixed(2)
                        // 本期本金
                        var everyMonthRepayment_bj = (totalLoans * 10000) / month;
                        everyMonthRepayment_bj = everyMonthRepayment_bj.toFixed(2)
                        // 本期剩余
                        var _result = (totalLoans * 10000) - i * ((totalLoans * 10000) / month);
                        var result = (totalLoans * 10000) - (i + 1) * ((totalLoans * 10000) / month);
                        result = result.toFixed(2)
                        // 本期利息
                        var everyMonthRepayment_lx = _result * a;
                        everyMonthRepayment_lx = everyMonthRepayment_lx.toFixed(2)

                        obj.monthRepayment = monthRepayment; 
                        obj.everyMonthRepayment_lx = everyMonthRepayment_lx; 
                        obj.everyMonthRepayment_bj = everyMonthRepayment_bj; 
                        obj.result = result; 
                        obj.date = date;
                        obj.year = years[yearsIndex];
                        info.push(obj)
                    }
                    var data = {
                        isshow: 1,
                        // 商贷总额
                        totalLoans,
                        // 月均还款
                        monthRepayment,
                        //总利息
                        totalInterest: totalInterest.toFixed(2),
                        //还款总额
                        totalMoney,
                        month,// 期数
                        curMonth, // 首期应还
                        hk_Method: hkMethod == 0 ? "等额本息" : "等额本金",
                        info
                    };
                    // ------------------------------------------------------------------------                    
                } else {
                    //商贷 等额本金 单价 计算方式
                    // ------------------------------------------------------------------------   
                    if (unitPrice == '' && area == '') {
                        this.showModal();
                        return
                    }
                    var homePrice = unitPrice * area;
                    // 一 贷款总额  = 单价 * 面积 * 成数
                    var totalLoans = unitPrice * area * _ratio / 10000;

                    // 总利息
                    var totalInterest = totalLoans * a * (month + 1) / 2;
                    // 还款总额
                    var totalMoney = totalInterest + parseInt(totalLoans);
                    //月均还款  总利息 + 总代额 / 期数
                    var monthRepayment = (((totalInterest + parseInt(totalLoans)) / month) * 10000).toFixed(2);
                    // 当月应还后半部分
                    var curMonthEnd = 1 / month + 1 * a;
                    //当月应还
                    var curMonth = totalLoans * curMonthEnd * 10000;
                    curMonth = curMonth.toFixed(2);
                    var info = [];
                    // 遍历期数
                    for (let i = 0; i < month; i++) {
                        // 创建一个对象 
                        var obj = {};
                        // 本期还款
                        var _monthRepayment = (totalLoans * 10000) * (1 / month + (1 - (i - 1 + 1) / month) * a)
                        _monthRepayment = _monthRepayment.toFixed(2)
                        // 本期本金
                        var everyMonthRepayment_bj = (totalLoans * 10000) / month;
                        everyMonthRepayment_bj = everyMonthRepayment_bj.toFixed(2)
                        // 本期剩余
                        var _result = (totalLoans * 10000) - i * ((totalLoans * 10000) / month);
                        var result = (totalLoans * 10000) - (i + 1) * ((totalLoans * 10000) / month);
                        result = result.toFixed(2)
                        // 本期利息
                        var everyMonthRepayment_lx = _result * a;
                        everyMonthRepayment_lx = everyMonthRepayment_lx.toFixed(2)

                        obj.monthRepayment = _monthRepayment;
                        obj.everyMonthRepayment_lx = everyMonthRepayment_lx;
                        obj.everyMonthRepayment_bj = everyMonthRepayment_bj;
                        obj.result = result;
                        obj.date = date;
                        obj.year = years[yearsIndex];
                        info.push(obj)
                    }
                    var data = {
                        isshow: 1,
                        // 商贷总额
                        homePrice,
                        calculation: "单价",
                        totalLoans,
                        // 月均还款
                        monthRepayment,
                        //总利息
                        totalInterest: totalInterest.toFixed(2),
                        //还款总额
                        totalMoney,
                        month,// 期数
                        curMonth, // 首期应还
                        hk_Method: hkMethod == 0 ? "等额本息" : "等额本金",
                        info
                    };
                    // ---------------------------------------------
                }
            }

        } else if (this.data.isshow == 1) {
            // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++          公积金贷
            if (this.data.hkMethod == 0) {
                //公积金贷 等额本息
                if (this.data.index == 0) {
                    //公积金贷 等额本息 贷款总额 计算方式
                    // ---------------------------------------------
                    if (totalLoans == '') {
                        this.showModal();
                        return
                    }
                    
                    //1 + 月利率的期数方
                    var _b = Math.pow(b + 1, month);
                    // 每月应还
                    var monthRepayment = totalLoans * b * [_b / (_b - 1)] * 10000;
                    monthRepayment = monthRepayment.toFixed(2);
                    //总利息
                    var totalInterest = [month * monthRepayment - (totalLoans * 10000)] / 10000;
                    totalInterest = totalInterest.toFixed(2);
                    //还款总额
                    var totalMoney = month * monthRepayment / 10000;
                    totalMoney = totalMoney.toFixed(2);
                    var info = [];
                    // 遍历期数
                    for (let i = 0; i < month; i++) {
                        // 创建一个对象 
                        var obj = {};
                        var _c = Math.pow((1 + b), ((i + 1) - 1));
                        //本年还款
                        var yearRepayment = monthRepayment * surplus_month;
                        yearRepayment = yearRepayment.toFixed(2)
                        // 每月应还利息
                        var everyMonthRepayment_lx = (_b - _c) / (_b - 1) * b * totalLoans * 10000;
                        everyMonthRepayment_lx = everyMonthRepayment_lx.toFixed(2)
                        // 每月应还本金
                        var everyMonthRepayment_bj = _c / (_b - 1) * b * totalLoans * 10000;
                        everyMonthRepayment_bj = everyMonthRepayment_bj.toFixed(2)
                        // 本期剩余本金
                        var ccc = 1 / Math.pow((1 + b), (month + 1 - (i + 1))) * (1 - 1 / Math.pow((1 + b), (i + 1))) / (1 - 1 / (1 + b)) * monthRepayment;
                        var result = (totalLoans * 10000 - ccc).toFixed(2);
                        obj.monthRepayment = monthRepayment;
                        obj.everyMonthRepayment_lx = everyMonthRepayment_lx;
                        obj.everyMonthRepayment_bj = everyMonthRepayment_bj;
                        obj.result = result;
                        obj.date = date;
                        obj.year = years[yearsIndex];
                        info.push(obj)
                    }
                    var data = {
                        date,
                        isshow: 0,
                        totalLoans, // 商贷总额
                        monthRepayment, //月还款
                        totalInterest,//总利息
                        totalMoney,//还款总额
                        month,// 期数
                        hk_Method: hkMethod == 0 ? "等额本息" : "等额本金",
                        info,
                    };
                    // -----------------------------------------
                } else {
                    //公积金贷 等额本息 单价 计算方式
                    // ------------------------------------------
                    if (unitPrice == '' && area == '') {
                        this.showModal();
                        return
                    }
                    var homePrice = unitPrice * area;
                    // 一 贷款总额  = 单价 * 面积 * 成数
                    var totalLoans = unitPrice * area * _ratio / 10000; 
                    var _b = Math.pow(b + 1, month);
                    // 每月应还
                    var monthRepayment = totalLoans * b * [_b / (_b - 1)] * 10000;
                    monthRepayment = monthRepayment.toFixed(2);
                    //总利息
                    var totalInterest = [month * monthRepayment - (totalLoans * 10000)] / 10000;
                    totalInterest = totalInterest.toFixed(2);
                    //还款总额
                    var totalMoney = month * monthRepayment / 10000;
                    totalMoney = totalMoney.toFixed(2);
                    var info = [];
                    // 遍历期数
                    for (let i = 0; i < month; i++) {
                        // 创建一个对象 
                        var obj = {};
                        var _c = Math.pow((1 + b), ((i + 1) - 1));
                        //本年还款
                        var yearRepayment = monthRepayment * surplus_month;
                        yearRepayment = yearRepayment.toFixed(2)
                        // 每月应还利息
                        var everyMonthRepayment_lx = (_b - _c) / (_b - 1) * b * totalLoans * 10000;
                        everyMonthRepayment_lx = everyMonthRepayment_lx.toFixed(2)
                        // 每月应还本金
                        var everyMonthRepayment_bj = _c / (_b - 1) * b * totalLoans * 10000;
                        everyMonthRepayment_bj = everyMonthRepayment_bj.toFixed(2)
                        // 本期剩余本金
                        var ccc = 1 / Math.pow((1 + b), (month + 1 - (i + 1))) * (1 - 1 / Math.pow((1 + b), (i + 1))) / (1 - 1 / (1 + b)) * monthRepayment;
                        var result = (totalLoans * 10000 - ccc).toFixed(2);
                        obj.monthRepayment = monthRepayment;
                        obj.everyMonthRepayment_lx = everyMonthRepayment_lx;
                        obj.everyMonthRepayment_bj = everyMonthRepayment_bj;
                        obj.result = result;
                        obj.date = date;
                        obj.year = years[yearsIndex];
                        info.push(obj)
                    }
                    var data = {
                        date,
                        isshow: 0,
                        homePrice,
                        calculation: "单价",
                        totalLoans, // 商贷总额
                        monthRepayment, //月还款
                        totalInterest,//总利息
                        totalMoney,//还款总额
                        month,// 期数
                        hk_Method: hkMethod == 0 ? "等额本息" : "等额本金",
                        info,
                    };
                    // --------------------------------------------
                }
            } else {
                //公积金贷 等额本金
                if (this.data.index == 0) {
                /*~~~~~~~~~~~~~~~~~~~~~~~~~公积金贷 等额本金 贷款总额 计算方式~~~~~~~~~~~~~~~~~~~~~~~~~*/
                    if (totalLoans == '') {
                        this.showModal();
                        return
                    }
                    // 总利息
                    var totalInterest = totalLoans * b * (month + 1) / 2;
                    // 还款总额
                    var totalMoney = totalInterest + parseInt(totalLoans);
                    //月均还款  总利息 + 总代额 / 期数
                    var monthRepayment = (((totalInterest + parseInt(totalLoans)) / month) * 10000).toFixed(2);
                    // 当月应还后半部分
                    var curMonthEnd = 1 / month + 1 * b;
                    //当月应还
                    var curMonth = totalLoans * curMonthEnd * 10000;
                    curMonth = curMonth.toFixed(2);
                    var info = [];
                    // 遍历期数
                    for (let i = 0; i < month; i++) {
                        // 创建一个对象 
                        var obj = {};
                        // 本期还款
                        var monthRepayment = (totalLoans * 10000) * (1 / month + (1 - (i - 1 + 1) / month) * b)
                        monthRepayment = monthRepayment.toFixed(2)
                        // 本期本金
                        var everyMonthRepayment_bj = (totalLoans * 10000) / month;
                        everyMonthRepayment_bj = everyMonthRepayment_bj.toFixed(2)
                        // 本期剩余
                        var _result = (totalLoans * 10000) - i * ((totalLoans * 10000) / month);
                        var result = (totalLoans * 10000) - (i + 1) * ((totalLoans * 10000) / month);
                        result = result.toFixed(2)
                        // 本期利息
                        var everyMonthRepayment_lx = _result * b;
                        everyMonthRepayment_lx = everyMonthRepayment_lx.toFixed(2)
                        obj.monthRepayment = monthRepayment;
                        obj.everyMonthRepayment_lx = everyMonthRepayment_lx;
                        obj.everyMonthRepayment_bj = everyMonthRepayment_bj;
                        obj.result = result;
                        obj.date = date;
                        obj.year = years[yearsIndex];
                        info.push(obj)
                    }
                    var data = {
                        isshow: 1,
                        // 商贷总额
                        totalLoans,
                        // 月均还款
                        monthRepayment,
                        //总利息
                        totalInterest: totalInterest.toFixed(2),
                        //还款总额
                        totalMoney,
                        month,// 期数
                        curMonth, // 首期应还
                        hk_Method: hkMethod == 0 ? "等额本息" : "等额本金",
                        info
                    };
                    /*~~~~~~~~~~~~~~~~~~~~~~~~~公积金贷 等额本金 贷款总额 计算方式  结束~~~~~~~~~~~~~~~~~~~~~~~~~*/
                } else {
                    //公积金贷 等额本金 单价 计算方式
                // ------------------------------------------------------------------------
                    if (unitPrice == '' && area == '') {
                        this.showModal();
                        return
                    }
                    var homePrice = unitPrice * area;
                    // 一 贷款总额  = 单价 * 面积 * 成数
                    var totalLoans = unitPrice * area * _ratio / 10000; 
                    // 总利息
                    var totalInterest = totalLoans * b * (month + 1) / 2;
                    // 还款总额
                    var totalMoney = totalInterest + parseInt(totalLoans);
                    //月均还款  总利息 + 总代额 / 期数
                    var monthRepayment = (((totalInterest + parseInt(totalLoans)) / month) * 10000).toFixed(2);
                    // 当月应还后半部分
                    var curMonthEnd = 1 / month + 1 * b;
                    //当月应还
                    var curMonth = totalLoans * curMonthEnd * 10000;
                    curMonth = curMonth.toFixed(2);
                    var info = [];
                    // 遍历期数
                    for (let i = 0; i < month; i++) {
                        // 创建一个对象 
                        var obj = {};
                        // 本期还款
                        var _monthRepayment = (totalLoans * 10000) * (1 / month + (1 - (i - 1 + 1) / month) * b)
                        _monthRepayment = _monthRepayment.toFixed(2)
                        // 本期本金
                        var everyMonthRepayment_bj = (totalLoans * 10000) / month;
                        everyMonthRepayment_bj = everyMonthRepayment_bj.toFixed(2)
                        // 本期剩余
                        var _result = (totalLoans * 10000) - i * ((totalLoans * 10000) / month);
                        var result = (totalLoans * 10000) - (i + 1) * ((totalLoans * 10000) / month);
                        result = result.toFixed(2)
                        // 本期利息
                        var everyMonthRepayment_lx = _result * b;
                        everyMonthRepayment_lx = everyMonthRepayment_lx.toFixed(2)
                        obj.monthRepayment = _monthRepayment;
                        obj.everyMonthRepayment_lx = everyMonthRepayment_lx;
                        obj.everyMonthRepayment_bj = everyMonthRepayment_bj;
                        obj.result = result;
                        obj.date = date;
                        obj.year = years[yearsIndex];
                        info.push(obj)
                    }
                    var data = {
                        isshow: 1,
                        // 商贷总额
                        homePrice,
                        calculation: "单价",
                        totalLoans,
                        // 月均还款
                        monthRepayment,
                        //总利息
                        totalInterest: totalInterest.toFixed(2),
                        //还款总额
                        totalMoney,
                        month,// 期数
                        curMonth, // 首期应还
                        hk_Method: hkMethod == 0 ? "等额本息" : "等额本金",
                        info
                    };
                    // ----------------------------------
                }
            }
        }else {
            // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++       组合贷
            if (this.data.hkMethod == 0) {
                //组合贷 等额本息
                // ------------------------------------------
                var _b = Math.pow(a + 1, month);
                var _B = Math.pow(b + 1, month);
                // 每月应还
                var monthRepayment = totalLoans * a * [_b / (_b - 1)] * 10000;
                var _monthRepayment = gjijinloan * b * [_B / (_B - 1)] * 10000;
                var redult_monthRepayment = (monthRepayment + _monthRepayment).toFixed(2);
                var totalInterest = [month * monthRepayment - (totalLoans * 10000)] / 10000;
                var _totalInterest = [month * _monthRepayment - (gjijinloan * 10000)] / 10000;
                totalInterest = (totalInterest + _totalInterest).toFixed(2);
                var totalMoney = month * monthRepayment / 10000; 
                var _totalMoney = month * _monthRepayment / 10000;
                totalMoney = (totalMoney + _totalMoney).toFixed(2); //还款总额
                var result_totalLoans =  Number(gjijinloan) + Number(totalLoans)
                var info = [];
                // 遍历期数
                for (let i = 0; i < month; i++) {
                    // 创建一个对象 
                    var obj = {};
                    var s_c = Math.pow((1 + a), ((i + 1) - 1));
                    var g_c = Math.pow((1 + b), ((i + 1) - 1));
                    var yearRepayment = redult_monthRepayment * surplus_month;
                    // 每月应还利息
                    var s_everyMonthRepayment_lx = (_b - s_c) / (_b - 1) * a * totalLoans * 10000;
                    var g_everyMonthRepayment_lx = (_B - g_c) / (_B - 1) * b * totalLoans * 10000;
                    everyMonthRepayment_lx = (s_everyMonthRepayment_lx + g_everyMonthRepayment_lx).toFixed(2)
                    // 每月应还本金
                    var s_everyMonthRepayment_bj = s_c / (_b - 1) * a * totalLoans * 10000;
                    var g_everyMonthRepayment_bj = g_c / (_B - 1) * b * totalLoans * 10000;
                    everyMonthRepayment_bj = (s_everyMonthRepayment_bj + g_everyMonthRepayment_bj).toFixed(2)
                    // 本期剩余本金
                    var s_ccc = 1 / Math.pow((1 + a), (month + 1 - (i + 1))) * (1 - 1 / Math.pow((1 + a), (i + 1))) / (1 - 1 / (1 + a)) * monthRepayment;
                    var s_result = (totalLoans * 10000 - s_ccc).toFixed(2);
                    var g_ccc = 1 / Math.pow((1 + b), (month + 1 - (i + 1))) * (1 - 1 / Math.pow((1 + b), (i + 1))) / (1 - 1 / (1 + b)) * _monthRepayment;
                    var g_result = (totalLoans * 10000 - g_ccc).toFixed(2);
                    var result = (Number(s_result) + Number(g_result)).toFixed(2);
                    obj.monthRepayment = redult_monthRepayment;
                    obj.everyMonthRepayment_lx = everyMonthRepayment_lx;
                    obj.everyMonthRepayment_bj = everyMonthRepayment_bj;
                    obj.result = result;
                    obj.date = date;
                    obj.year = years[yearsIndex];
                    info.push(obj)
                }
                var data = {
                    date,
                    isshow: 0,
                    totalLoans: Number(gjijinloan) + Number(totalLoans), // 商贷总额
                    monthRepayment: redult_monthRepayment,
                    totalInterest,//总利息
                    totalMoney,//还款总额
                    month,// 期数
                    hk_Method: hkMethod == 0 ? "等额本息" : "等额本金",
                    info,
                };
                //----------------------------------------------------------------
            } else {
                //组合贷 等额本金
                // 总利息
                var totalInterest = totalLoans * a * (month + 1) / 2;
                var _totalInterest = gjijinloan * b * (month + 1) / 2;
                var result_totalInterest = (totalInterest + _totalInterest).toFixed(2);
                // 还款总额
                var totalMoney = Number(gjijinloan) + Number(totalLoans) + Number(totalInterest + _totalInterest);
                //月均还款  总利息 + 总代额 / 期数
                var monthRepayment = (totalMoney / month * 10000).toFixed(2);
                // 当月应还后半部分
                var curMonthEnd = 1 / month + 1 * a;
                var _curMonthEnd = 1 / month + 1 * b;
                //当月应还
                var curMonth = totalLoans * curMonthEnd * 10000;
                    // curMonth = curMonth.toFixed(2);
                var _curMonth = gjijinloan * _curMonthEnd * 10000;
                    // _curMonth = curMonth.toFixed(2);
                var result_curMonth = (curMonth + _curMonth).toFixed(2);
                var info = [];
                // 遍历期数
                for (let i = 0; i < month; i++) {
                    // 创建一个对象 
                    var obj = {};
                    // 本期还款
                    var s_monthRepayment = (totalLoans * 10000) * (1 / month + (1 - (i - 1 + 1) / month) * a);
                    var g_monthRepayment = (totalLoans * 10000) * (1 / month + (1 - (i - 1 + 1) / month) * b);
                    _monthRepayment = (s_monthRepayment + g_monthRepayment).toFixed(2)
                    // 本期本金
                    var everyMonthRepayment_bj = ((Number(gjijinloan) + Number(totalLoans)) * 10000) / month;
                    everyMonthRepayment_bj = everyMonthRepayment_bj.toFixed(2)
                    // 本期剩余
                    var _result = ((Number(gjijinloan) + Number(totalLoans)) * 10000) - i * (((Number(gjijinloan) + Number(totalLoans)) * 10000) / month);
                    var result = ((Number(gjijinloan) + Number(totalLoans)) * 10000) - (i + 1) * (((Number(gjijinloan) + Number(totalLoans)) * 10000) / month);
                    result = result.toFixed(2)
                    // 本期利息
                    var s_everyMonthRepayment_lx = _result * a;
                    var g_everyMonthRepayment_lx = _result * b;
                    everyMonthRepayment_lx = ((s_everyMonthRepayment_lx + g_everyMonthRepayment_lx) / 2).toFixed(2)
                    obj.monthRepayment = _monthRepayment;
                    obj.everyMonthRepayment_lx = everyMonthRepayment_lx;
                    obj.everyMonthRepayment_bj = everyMonthRepayment_bj;
                    obj.result = result;
                    obj.date = date;
                    obj.year = years[yearsIndex];
                    info.push(obj)
                }
                var data = {
                    isshow: 1,
                    // 商贷总额
                    totalLoans: Number(gjijinloan) + Number(totalLoans),
                    // 月均还款
                    monthRepayment,
                    //总利息
                    totalInterest: result_totalInterest,
                    //还款总额
                    totalMoney: totalMoney.toFixed(2),
                    month,// 期数
                    curMonth: result_curMonth, // 首期应还
                    hk_Method: hkMethod == 0 ? "等额本息" : "等额本金",
                    info
                };
            }
        }

          wx.navigateTo({
                        url: '/pages/CalculationResult/CalculationResult?is=0&data=' + JSON.stringify(data),
                    })
    },
    
    reset(e) {
        this.setData({
            sdRate: 4.9, //商贷利率
            providentFundRate: 3.25, //公积金利率
            hkMethod: 0, //默认还款方式
            index: 0, // 默认计算方式
            yearsIndex: 0, //默认年数
            nper: '12期',//还款期数
            totalLoans: ''
        })
    },
  




    // 税费计算器
    //税费提交
    sf_submit(e) {
        var { twoIsshow, newHomeMoney, newHomeArea, twoHandHomeArea, twoHandHomePrice, twoHandHomeOldPrice, buyYears, buyYearsIndex, isBuyOnly, isOne } = this.data;
        var data = {
        };
        if (twoIsshow == 0) {
            if (newHomeMoney == "" && newHomeArea == "") {
                this.showModal()
                return
            }
            // 新房页面的提交
            var home_money = newHomeMoney * newHomeArea;
            // 房屋总价
            // 定义是新房还是二手房
            data.is = "新房";
            data.home_money = home_money
            // 契税
            data.q_tax = this.q_tax_result(0, newHomeArea, home_money)
            // 印花税
            data.y_tax = home_money * 0.05 / 100;
            // 权属登记税
            data.qs_tax = 80;
            // 维修基金
            data.vx_money = home_money * 0.03;
            // 交易手续费
            data.jy_money = newHomeArea * 3;
            wx.navigateTo({
                url: '/pages/CalculationResult/CalculationResult?is=1&data=' + JSON.stringify(data),
            })
            return
        }
        else if (twoIsshow == 1) {
            // 二手房页面提交
            // 总价
            if (twoHandHomeArea == "" && twoHandHomePrice == "" && twoHandHomeOldPrice == "") {
                this.showModal()
                return
            }
            twoHandHomePrice = twoHandHomePrice * 10000;
            twoHandHomeOldPrice = twoHandHomeOldPrice * 10000;
            // 交易手续费
            data.is = "二手房";
            data.jy_money = twoHandHomeArea * 2 + 20;
            if (isOne == 0) {
                // 契税
                data.q_tax = this.q_tax_result(1, twoHandHomeArea, twoHandHomePrice, true)
            }else {
                data.q_tax = this.q_tax_result(1, twoHandHomeArea, twoHandHomePrice, false)
            }
            // 满两年
            if (buyYearsIndex != 0){
                // 营业税
                data.business_tax = 0;
                // 增值税
                data.add_tax = 0;

            }else{
                // 营业税
                data.business_tax = twoHandHomePrice * 0.05;
                // 增值税
                data.add_tax = twoHandHomePrice * 0.05;
            }
            // 个人所得税
            if (buyYearsIndex == 2 && isBuyOnly == 0) {
                // 满五年 唯一
                data.income_tax = 0
            }else {
                data.income_tax = (twoHandHomePrice - twoHandHomeOldPrice) * 0.2;
            }
            wx.navigateTo({
                url: '/pages/CalculationResult/CalculationResult?is=1&data=' + JSON.stringify(data),
            })
        }
    },
    sf_reset() {
        this.setData({
            verifyNewHomeMoney: 0,
            verifyNewHomeArea: 0,
            verifyTwoHandHomeArea: 0,
            verifyTwoHandHomePrice: 0,
            verifyTwoHandHomeOldPrice: 0,
            newHomeMoney: "", //新房单价
            newHomeArea: "", // 新房面积
            twoHandHomeArea: "",//二手房面积
            twoHandHomePrice: "", //二手房总价
            twoHandHomeOldPrice: "",// 二手房原价
            buyYears: ["不满两年", "满两年", "满五年"], //二手房购置年限
            buyYearsIndex: 0, //默认购置年限
            isBuyOnly: 0, //二手房买房唯一
            isOne: 0,// 二手房首套
        })
    },
    // 计算新房契税
    q_tax_result(is, m, money, isOne) {
       if(is == 0) {
           if (m <= 90) {
               return money * 1 / 100;
           } else if (m > 90 && m <= 144) {
               return money * 1.5 / 100;
           } else {
               return money * 3 / 100;
           }
       }else {
        //    二手房
           if (isOne == true) {
            //    是首套
                if(m <= 90) {
                    return money * 1 / 100
                }else {
                    return money * 1.5 / 100;
                }
           }else {
            //    非首套
               if (m <= 90) {
                   return money * 1.5 / 100
               } else {
                   return money * 3 / 100;
               }
           }
       }
    },



//————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————


    // 验证贷款总额
    verifyTotalLoans(e) {
        if (e.detail.value == "") {
            this.setData({
                verifyTotalLoans: 1
            })
        } else {
            this.setData({
                verifyTotalLoans: 0,
            })
        }
    },
    changeTotalLoans(e) {
        this.setData({
            verifyTotalLoans: 0,
            totalLoans: e.detail.value
        })
    },





    // 验证公积金贷款总额
    verifyGjijinloan(e) {
        if (e.detail.value == "") {
            this.setData({
                verifyGjijinloan: 1
            })
        } else {
            this.setData({
                verifyGjijinloan: 0,
            })
        }
    },
    changeGjijinloan(e) {
        this.setData({
            verifyGjijinloan: 0,
            gjijinloan: e.detail.value
        })
    },


    // 验证单价
    verifyUnivalent(e) {
        if (e.detail.value == "") {
            this.setData({
                verifyUnivalent: 1
            })
        } else {
            this.setData({
                verifyUnivalent: 0,
            })
        }
    },
    chengeUnivalent(e) {
        this.setData({
            verifyUnivalent: 0,
            unitPrice: e.detail.value
        })
    },



    // 验证面积
    verifyArea(e) {
        if (e.detail.value == "") {
            this.setData({
                verifyArea: 1
            })
        } else {
            this.setData({
                verifyArea: 0,
            })
        }
    },
    chengeArea(e) {
        this.setData({
            verifyArea: 0,
            area: e.detail.value
        })
    },



    
    
   
    // 更改商贷利率
    resetRate(e) {
        this.setData({
            sdRate: e.detail.value
        })
    },
   

//  ------------税费----------------

   
    // 验证新房单价
    verifyNewHomeMoneyFUN(e) {
        if (e.detail.value == "") {
            this.setData({
                verifyNewHomeMoney: 1
            })
        } else {
            this.setData({
                verifyNewHomeMoney: 0,
            })
        }
    },
    // 改变新房单价
    changeNewHomeMoney(e) {
        this.setData({
            verifyNewHomeMoney: 0,
            newHomeMoney: e.detail.value,
        })
    },

    // 验证新房面积
    verifyNewHomeAreaFUN(e) {
        if (e.detail.value == "") {
            this.setData({
                verifyNewHomeArea: 1
            })
        } else {
            this.setData({
                verifyNewHomeArea: 0,
            })
        }
    },
    // 改变新房面积
    changeNewHomeArea(e) {
        this.setData({
            verifyNewHomeArea: 0,
            newHomeArea: e.detail.value,
        })
    },
 
    
    // 验证二手房面积
    verifyTwoHandHomeArea(e) {
        if (e.detail.value == "") {
            this.setData({
                verifyTwoHandHomeArea: 1
            })
        } else {
            this.setData({
                verifyTwoHandHomeArea: 0,
            })
        }
    },
    changeTwoHandHomeArea(e) {
        this.setData({
            verifyTwoHandHomeArea: 0,
            twoHandHomeArea: e.detail.value
        })
    },

    // 验证二手房现价
    verifyTwoHandHomePrice(e) {
        if (e.detail.value == "") {
            this.setData({
                verifyTwoHandHomePrice: 1
            })
        } else {
            this.setData({
                verifyTwoHandHomePrice: 0,
            })
        }
    },
    changeTwoHandHomePrice(e) {
        this.setData({
            verifyTwoHandHomePrice: 0,
            twoHandHomePrice: e.detail.value
        })
    },
    // 验证二手房原价
    verifyTwoHandHomeOldPrice(e) {
        if (e.detail.value == "") {
            this.setData({
                verifyTwoHandHomeOldPrice: 1
            })
        } else {
            this.setData({
                verifyTwoHandHomeOldPrice: 0,
            })
        }
    },
    changeTwoHandHomeOldPrice(e) {
        this.setData({
            verifyTwoHandHomeOldPrice: 0,
            twoHandHomeOldPrice: e.detail.value
        })
    },

//————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

    twoChangeMain(e) {
        this.setData({
            twoIsshow: e.currentTarget.dataset.index
        })
        // this.resetInputVerify()
    },
    // 切换买房唯一
    changeOnly(e) {
        this.setData({
            isBuyOnly: e.currentTarget.dataset.index
        })
    },
    //切换是否首套
    changeIsOne(e) {
        this.setData({
            isOne: e.currentTarget.dataset.index
        })
    },
    // 切换购置年限
    bindPickerChangeBuyYears(e) {
        this.setData({
            buyYearsIndex: e.detail.value,
        })
    },

    showModal() {
        wx.showModal({
            title: '提示',
            content: '输入有误',
            success(res) {
                if (res.confirm) {
                    // console.log('用户点击确定')
                } else if (res.cancel) {
                    // console.log('用户点击取消')
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.getSystemInfo({
            success: function (res) {
                var model = res.model
                if (model.search('iPhone X') != -1) {
                    app.globalData.isIpx = true;
                } else {
                    app.globalData.isIpx = false;
                }
            },
        })
        var isIpx = app.globalData.isIpx;
        this.setData({
            isIpx
        })
        var date = new Date();
        date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        this.setData({
            date
        })

    },
  
    // 前往holp页面
    gotoHolp() {
        wx.navigateTo({
            url: '/pages/holp/holp',
        })
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