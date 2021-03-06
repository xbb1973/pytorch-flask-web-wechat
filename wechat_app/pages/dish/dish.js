var app = getApp();
var api = require('../../utils/api.js');
var dishUrl = api.getDishUrl();
Page({
  data: {
    motto: '菜品识别',
    images: {},
    info: "",
    calorie: "",
    dishName: "",
    hasCalorie:"",
    probability:"",
    userInfo: {},
    backUserInfo: {},//后台得到的微信用户信息
    hasUserInfo: false,
    openId: "",
    nickName: "",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    baikeUrl:"",
    imageUrl:"",
    description:"",
    remark: ""
  },
  onShareAppMessage: function () {
    return {
      title: '菜品识别小程序',
      path: '/pages/dish/dish',
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 500
          });
        }
      },
      fail: function (res) {
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          wx.showToast({
            title: '分享取消',
            icon: 'loading',
            duration: 500
          })
        }
      }
    }
  },
  clear:function(event){
    console.info(event);
    wx.clearStorage();
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  uploads: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //console.log( res )
        that.setData({
          img: res.tempFilePaths[0],
          info: "",
          calorie: "",
          dishName: "",
          hasCalorie: "",
          probability: "",
          baikeUrl: "",
          imageUrl: "",
          description: ""
        }),
          wx.showLoading({
            title: "努力分析中...",
            mask: true
          }),
        wx.uploadFile({
          url: dishUrl,
          filePath: res.tempFilePaths[0],
          header: {
            'content-type': 'multipart/form-data'
          },
          name: 'file',
          formData: {
            'openId': that.data.openId,
            'nickName': that.data.nickName
          },
          success: function (res) {
            wx.hideLoading();
            var data = res.data;
            var str = JSON.parse(data);
            console.log(str);
            if (str.code == 0) {
              that.setData({
                dishName:str.dishName,
                calorie:str.calorie,
                probability:str.probability,
                baikeUrl: str.baikeUrl,
                imageUrl: str.imageUrl,
                description: str.description
              })
            } else if (str.code == "1") {
              that.setData({
                info: 'Sorry ' + str.msg
              })
            } else {
              that.setData({
                info: 'Sorry 小程序远走高飞了'
              })
            }
          },
          fail: function (res) {
            wx.hideLoading();
            wx.showModal({
              title: '温馨提示',
              content: 'Sorry 小程序离家出走了',
              showCancel: false
            })
          }
        })
      }
    })
  },
  onLoad: function () {
    var getAppWXUserInfo = app.globalData.userInfo;
    this.setData({
      userInfo: getAppWXUserInfo,
      hasUserInfo: true,
      openId: getAppWXUserInfo.openId,
      nickName: getAppWXUserInfo.nickName,
    })
  }
});