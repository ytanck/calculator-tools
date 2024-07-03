const app = getApp();
Component({
  data: {
    voiced: true // 控制声音开关
  },
  props: {
    key: '',
    // 页面标识
    length: 0,
    // 图片数量
    hasSkin: true,
    // 是否有切换皮肤功能
    onResetData: () => {},
    onSwitchSound: () => {},
    onSwitchSkin: () => {}
  },
  didMount() {
    console.log('更新声音状态');
    // 取本地存的声音状态
    const sound = app.alipayUtils.getStorageSync('sound') || {};
    this.setData({
      voiced: sound.value == false ? false : true
    });
  },
  methods: {
    // 页面onshow更新声音状态
    updateSound(data) {
      console.log('更新声音onshow');
      this.setData({
        voiced: data
      });
    },
    // 控制声音
    switchSound() {
      this.setData({
        voiced: !this.data.voiced
      });
      app.alipayUtils.setStorageSync('sound', {
        value: this.data.voiced
      });
      this.props.onSwitchSound(this.data.voiced);
    },
    // 重置数据
    resetData() {
      my.confirm({
        title: '提示',
        content: '重置后数据将清零，是否重置数据？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        success: res => {
          if (res.confirm) {
            this.props.onResetData();
          }
          console.log(res);
        },
        fail: err => {
          console.log(err);
        }
      });
    },
    // 切换皮肤
    switchSkin() {
      const skin = app.alipayUtils.getStorageSync(`skin-${this.props.key}`) || {};
      let skinIndex = skin.value || 0;
      if (skinIndex + 1 == this.props.length) {
        skinIndex = 0;
      } else {
        skinIndex += 1;
      }
      app.alipayUtils.setStorageSync(`skin-${this.props.key}`, {
        value: skinIndex
      });
      this.props.onSwitchSkin(skinIndex);
    }
  }
});