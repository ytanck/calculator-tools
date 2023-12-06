// import flowers from '../../common/data';

Page({
  data: {
    flowerList: []
  },
  onLoad(query) {
    this.setData({
      flowerList: JSON.parse(decodeURIComponent(query.list || '{}'))
    });
  },
  queryFlowerLang(e) {
    const {
      item
    } = e.target.dataset;
    console.log(item);
    my.navigateTo({
      url: '/pages/detail/index?item=' + encodeURIComponent(JSON.stringify(item))
    });
  }
});