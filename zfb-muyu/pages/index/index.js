import { queryMixins } from '/mixins/index';
import { qs } from '/utils/tool';
const app = getApp();
const hostConfig = require("/config.json");
Page({
  mixins: [queryMixins],
  notAutoUserInfo: true,
  //不自动调用用户信息接口
  data: {
    query: {},
    box_bg: '',
    // 弹窗后页面固定
    turnUrl: '',
    config: {},
    // uiContent
    meritCount: 0,
    // 功德值
    key: 'index',
    // 页面区分key
    picIndex: 0,
    // 图片索引值
    spaceCode: hostConfig.dhSpaceCode
  },
  async onLoad(query) {

    // 创建前景音频实例对象
    for (let aa = 1; aa < 5; aa++) {
      this['innerAudioContext' + aa] = my.createInnerAudioContext();
      this['innerAudioContext' + aa].src = 'https://xiaojinhe-cdn.iyoudui.cn/upload/common/20231020/beat.mp3';
      this['innerAudioContext' + aa].onPlay(() => {
        console.log('监听前景音频播放', aa);
      });
      this['innerAudioContext' + aa].onError(error => {
        console.log('监听前景音频播放错误', aa, error);
      });
    }
    // 创建动画对象(钵动画)
    // this.animation = my.createAnimation({
    //     duration: 50,
    //     timeFunction: "ease-in-out",
    //     transformOrigin: "right bottom"
    // });
    // 创建动画对象(功德+1)
    for (let o = 0; o < 10; o++) {
      this["agd" + o] = my.createAnimation({
        duration: 250,
        transformOrigin: "right top",
        timeFunction: "ease-out"
      });
    }
  },
  async onShow(query) {
    this.getStatus();
  },
  // 获取状态
  getStatus() {
    // 取本地存的功德值
    const count = app.alipayUtils.getStorageSync(`meritCount-${this.data.key}`) || {};
    this.setData({
      meritCount: count.value || 0
    });
    // 取本地存的声音状态和皮肤状态
    const skin = app.alipayUtils.getStorageSync(`skin-${this.data.key}`) || {};
    const sound = app.alipayUtils.getStorageSync('sound') || {};
    this.voiced = sound.value != false;
    this.setData({
      picIndex: skin.value || 0
    });
    // 告诉操作组件需要更新声音状态
    this.actionItemRef && this.actionItemRef.updateSound && this.actionItemRef.updateSound(this.voiced);
  },
  // 功德++++++++
  meritUp() {
    console.log('积累功德');
    // 处理声音
    this.voiced && (this.data.meritCount % 4 == 0 ? (this.innerAudioContext4.stop(), this.innerAudioContext4.play()) : this.data.meritCount % 3 == 0 ? (this.innerAudioContext3.stop(), this.innerAudioContext3.play()) : this.data.meritCount % 2 == 0 ? (this.innerAudioContext2.stop(), this.innerAudioContext2.play()) : (this.innerAudioContext1.stop(), this.innerAudioContext1.play()));
    // 处理功德+1动画
    const t = "" + this.data.meritCount;
    const e = t.substr("" + t.length - 1);
    console.log(e);
    const n = ["agd" + e];
    this["agd" + e].top("55%").step().top("35%").opacity(1).step().opacity(0).step().top("55%");
    // 处理钵动画
    // this.animation.rotate(-20).step().rotate(0).step();
    this.setData({
      // animation: this.animation.export(),
      [n]: this["agd" + e].export(),
      meritCount: this.data.meritCount + 1
    });
    app.alipayUtils.setStorageSync(`meritCount-${this.data.key}`, {
      value: this.data.meritCount
    });
  },
  // 保存操作实例
  onSaveRef(ref) {
    this.actionItemRef = ref;
  },
  // 切换声音
  onSwitchSound(data) {
    this.voiced = data;
  },
  // 重置数据
  onResetData() {
    this.setData({
      meritCount: 0
    });
    app.alipayUtils.setStorageSync(`meritCount-${this.data.key}`, {
      value: this.data.meritCount
    });
  },
  // 切换皮肤
  onSwitchSkin(data) {
    this.setData({
      picIndex: data
    });
  }
});