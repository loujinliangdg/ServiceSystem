export default function getCloudCDN(location){
    if(/(?:\d+\.\d+.\d+.\d+|aidev.bianla.cn)/.test(location.host)){
        return 'http://ljltest.tll521.cn/'   //七牛云测试域名
    }
    return 'https://cdnnet.bianla.cn/'               //配置域名
}