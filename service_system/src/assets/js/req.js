import axios from 'axios'
class Req{
    constructor(){
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1010
         */
        this['自动登陆'] = '/api/deviceSetInfo/checkLogin'  
        /**
         * 文档地址：?
         */
        this['登陆变啦'] = '/api/deviceSetInfo/loginBianla'
    }
    get(name,data,successCallback,errorCallback){
        let authorization = window.sessionStorage.getItem('authorization');
        if(authorization){
            axios.defaults.headers.authorization = authorization;
        }
        axios.get(`${this[name]}`,{params:data}).then(function(result){
            if(result.headers.authorization){
                window.sessionStorage.setItem('authorization',result.headers.authorization)
            }
            successCallback(result.data)
        }).catch(errorCallback||function(error){console.error(`请求 [${name}] 接口报告错：${error.toString()}`)}.bind(this))
    }
    post(name,data,successCallback,errorCallback){
        let authorization = window.sessionStorage.getItem('authorization');
        if(authorization){
            axios.defaults.headers.authorization = authorization;
        }
        axios.post(`${this[name]}`,data).then(function(result){
            if(result.headers.authorization){
                window.sessionStorage.setItem('authorization',result.headers.authorization)
            }
            successCallback(result.data)
        }).catch(errorCallback||function(error){console.error(`请求 [${name}] 接口报告错：${error.toString()}`)}.bind(this))
    }
}

export default new Req()