import * as qiniu from "qiniu-js";   //上传七牛云sdk
import getCloudCDN from './cloud_cdn'
import req from './req'
/**
 * 
 * @param {File} file 上传至七牛云的文件
 * @param {Object} handles  上传中的回调函数，包括进行中，完成，错误
 */
function upQiNiu(file,handles){
    /**
     * 上传至七牛云说明地址
     * https://developer.qiniu.com/kodo/sdk/1283/javascript
     */
    let key = Date.now()+file.name.slice(file.name.lastIndexOf('.'));
    let token = '';
    let putExtra = {};
    let config = {
        useCdnDomain: true,
        region: qiniu.region.z0
    };
    //由晓锋提供的获取token的接口，上传图片需要的token
    req.get('获取七牛云token',{},(result) =>{
        var self = this;
        token = result.data.upToken;
        var observable = qiniu.upload(file, key, token, putExtra, config);
        var subscription = observable.subscribe({
            // 上传进度
            next(res) {
                handles.next && typeof handles.next === 'function' && handles.next(res)
            },
            //  上传失败
            error(err) {
                handles.error && typeof handles.error === 'function' && handles.error(err)
            },
            //   上传成功
            complete(res) {
                // 上传成功后完成的资源地址
                let CompletedResourceAddress = `${getCloudCDN(window.location)}${key}`
                handles.complete && typeof handles.complete === 'function' && handles.complete(res,CompletedResourceAddress)
            }
        }); // 上传开始
        console.log(result)
    })
}

export default upQiNiu