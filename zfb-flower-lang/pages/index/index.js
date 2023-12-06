import flowers from '../../common/data';
Page({
  data: {
    flowers,
    fourFlowers: []
  },
  onLoad() {
    this.myRandom(flowers, 4);
  },
  bindKeyInput(e) {
    console.log(e.detail.value);
    this.setData({
      inputValue: e.detail.value
    });
  },
  myRandom(arr, length) {
    let newArr = [];
    for (let i = 0; i < 4; i++) {
      let index = Math.floor(Math.random() * flowers.length);
      let item = flowers[index];
      newArr.push(item);
      // flowers.splice(index, 1);//展示后删除
    }
    this.setData({
      fourFlowers: newArr
    });
  },
  queryList(e) {
    // const { item } = e.target.dataset;
    const {
      inputValue
    } = this.data;
    console.log(inputValue);
    if (inputValue) {
      const arr = flowers.filter(item => item.name.indexOf(inputValue) != -1);
      console.log(inputValue, arr);
      if (arr.length > 0) {
        my.navigateTo({
          url: '/pages/list/index?list=' + encodeURIComponent(JSON.stringify(arr))
        });
      } else {
        my.showToast({
          content: '没有找到这个花的花语哦'
        });
      }
    } else {
      my.showToast({
        content: '没有找到这个花的花语哦'
      });
    }
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