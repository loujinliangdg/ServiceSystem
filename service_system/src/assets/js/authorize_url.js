// 获取微信授权的地址
export default function(url){
    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3cae3948d19f4157&redirect_uri=https%3A%2F%2Foper.bianla.cn%2Fpage%2Fget-weixin-code.html%3Fredirect_uri%3D${encodeURIComponent(url)}&response_type=code&scope=snsapi_userinfo&state=state#wechat_redirect`
}