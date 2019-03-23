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
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1702
         */
        this['根据文章类型获取子分类'] = '/api/customerService/getClassifyByType'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1703
         */
        this['根据子分类获取文章列表'] = '/api/customerService/getArticleByClassify'
        /**
         * 文档地址：/api/customerService/getArticleByType
         */
        this['根据类型获取文章列表'] = '/api/customerService/getArticleByType'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1708
         */
        this['置顶的常见问题'] = '/api/customerService/topProblem'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1705
         */
        this['根据文章id获取文章'] = '/api/customerService/getArticleById'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1713
         */
        this['获取轮播图'] = '/api/customerService/getBanner'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1715
         */
        this['设备管理首页的信息'] = '/api/customerService/deviceHomePage'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1716
         */
        this['设备运行状态'] = '/api/customerService/myDeviceRunningState'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1717
         */
        this['获取设备的信息'] = '/api/customerService/getDeviceSetInfo'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1718
         */
        this['切换体脂秤'] = '/api/customerService/switchFatScale'
        /**
         * 文档地址：
         */
        this['获取模式列表'] = '/api/customerService/getAllMode'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1719
         */
        this['切换模式'] = '/api/customerService/changeAioDeviceMode'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1719
         */
        this['获取所有的使用场景'] = '/api/customerService/useScenariosList'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1721
         */
        this['切换使用场景'] = '/api/customerService/changeUseScenarios'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1730
         */
        this['数据查询'] = '/api/customerService/getDatas'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1734
         */
        this['获取上秤玩家'] = '/api/customerService/getPlayerNumber'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1733
         */
        this['获取新增粉丝'] = '/api/customerService/addPowderDetails'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1724
         */
        this['获取成员列表'] = '/api/customerService/memberList'

        this['你大爷'] = '/api/deviceSetInfo/runningState' // 测试的一个接口，没鸟用
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1723
         */
        this['删除成员'] = '/api/customerService/delMember'
        /**
         * 文档地址：
         */
        this['标记用户已读提示语'] = '/api/customerService/signIsRead'

        this['根据文章类型查询是否有未读文章'] = '/api/customerService/getIsReadByPostType'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1722
         */
        this['添加成员'] = this['新增成员'] = '/api/customerService/addMember'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1725
         */
        this['编辑成员'] = this['更新成员'] = '/api/customerService/updateMember'

        this['获取七牛云token'] = '/api/deviceSetInfo/getNewUpToken'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1706
         */
        this['有用数量统计'] = '/api/customerService/usefulStatistical'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1707
         */
        this['无用数量统计'] = '/api/customerService/uselessStatistical'
        /**
         * 文档地址：http://app.bianla.cn/showdoc/web/#/1?page_id=1789
         */
        this['设置待机时间'] = '/api/customerService/setAioSetInfo'
        /**
         * 文档地址：
         */
        this['预览文章'] = '/api/customerService/getPreviewArticle'

        this['获取微信配置信息'] = '/api/wechat/config'
        /**
         * 文档地址：http://showdoc.bianla.cn/web/#/1?page_id=1872
         */
        this['获取折线图数据'] = '/api/customerService/getDatasCurve'
        /**
         * 获取打印流水系统账号列表
         */
        this['获取打印报告系统账号列表'] = '/api/customerService/getPrintAccountList'
        /**
         * 机主新增打印账号
         */
        this['机主新增打印账号'] = '/api/customerService/addPrintAccount'
        /**
         * 机主修改打印账号密码
         */
        this['机主修改打印账号密码'] = '/api/customerService/updatePrintAccount'
        /**
         * 机主删除打印账号
         */
        this['机主删除打印账号'] = '/api/customerService/deletePrintAccount'
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