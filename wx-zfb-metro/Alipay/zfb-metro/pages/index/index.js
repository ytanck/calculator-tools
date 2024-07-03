import city from '../../data/city'
const app = getApp();
Page({
  data: {
    cityArray: [{
        name: 'beijing',
        label: '北京',
      },
      {
        name: 'chengdu',
        label: '成都',
      },
      {
        name: 'dalian',
        label: '大连',
      },
      {
        name: 'guangzhou',
        label: '广州',
      },
      {
        name: 'hangzhou',
        label: '杭州',
      },
      {
        name: 'nanjing',
        label: '南京',
      },
      {
        name: 'shanghai',
        label: '上海',
      },
      {
        name: 'shenzhen',
        label: '深圳',
      },
      {
        name: 'tianjin',
        label: '天津',
      },
      {
        name: 'wuhan',
        label: '武汉',
      },
      {
        name: 'xian',
        label: '西安',
      },
    ],
    arrIndex:0,
    currentCity: city.beijing,
  },
  async onLoad(query) {
    console.log(123, this.data.currentCity);
  },

  handlePreview(e) {
    my.previewImage({
      urls: [this.data.currentCity.map]
    });
  },
  handleLineTap(e) {
    const {
      cityArray,
      arrIndex
    } = this.data
    const {
      index
    } = e.target.dataset;
    my.navigateTo({
      url: `/pages/detail/index?index=${index}&name=${cityArray[arrIndex].name}`
    });
  },
  bindObjPickerChange(e) {
    const {
      cityArray
    } = this.data
    console.log('picker发送选择改变', e.detail.value, cityArray[e.detail.value].name);
    const name = cityArray[e.detail.value].name
    this.setData({
      arrIndex:e.detail.value,
      currentCity: city[name],
    });
  },

});