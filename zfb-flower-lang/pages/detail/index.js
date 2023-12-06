Page({
  data: {
    flower: {}
  },
  onLoad(query) {
    this.setData({
      flower: JSON.parse(decodeURIComponent(query.item || '{}'))
    });
  }
});