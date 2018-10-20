import axios from 'axios'
class Req{
    constructor(){
        this['自动登陆'] = '/api/deviceSetInfo/checkLogin'  
    }
    get(name,data,successCallback,errorCallback){
        let authorization = window.sessionStorage.getItem('authorization');
        if(authorization){
            axios.defaults.headers.authorization = authorization;
        }
        axios.get(`${host}${this[name]}`,{params:data}).then(function(result){
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
        axios.post(`${host}${this[name]}`,data).then(function(result){
            if(result.headers.authorization){
                window.sessionStorage.setItem('authorization',result.headers.authorization)
            }
            successCallback(result.data)
        }).catch(errorCallback||function(error){console.error(`请求 [${name}] 接口报告错：${error.toString()}`)}.bind(this))
    }
}

export default new Req()