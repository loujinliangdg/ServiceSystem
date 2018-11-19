let WechatJSSDK = require("wechat-jssdk/dist/client");

/**
 * {
 *      debug: false,
 *      appId: appId,
 *      timestamp: timestamp,
 *      nonceStr: nonceStr,
 *      signature: signature,
 *      jsApiList: []
 * }
 * 
 * @param {Object} params 微信签名等信息 
 */
export default function Wechat(params){
    this.wechat = new WechatJSSDK(params);
    /**
     * {
     *  title
     *  link
     *  imgUrl
     *  desc
     *  success
     *  cancel
     * }
     * 
     * @param {Object} shareObj 
     */
    this.share = (shareObj) => {
        let timer = setInterval(() => {
            if(this.wechat.wx){
                let wx = this.wechat.wx;
                clearInterval(timer);
                // 微信分享
                wx.ready(() => {
                    wx.onMenuShareTimeline(shareObj);
                    wx.onMenuShareAppMessage(shareObj);
                })
            }
        },30);

        return this;
    }
}