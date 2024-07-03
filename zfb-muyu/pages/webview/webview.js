Page({
  data: {
    url: '' // 链接
  },
  onLoad(query) {
    console.log('query',query);

    this.setData({
      url: query.url
    });
  }
});