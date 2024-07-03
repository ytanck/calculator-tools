import city from '../../data/city'
const app = getApp();
Page({
  data: {
    line: {},
    count: 0,
  },

  async onLoad(query) {
    const {
      index,
      name
    } = query;
    const line = city[name].lines[index];
    const stations = line.stations || [];

    this.setData({
      line: line,
      count: stations.length,
    });
  },
});