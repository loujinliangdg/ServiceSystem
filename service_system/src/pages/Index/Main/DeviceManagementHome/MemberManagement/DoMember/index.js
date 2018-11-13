import React,{Component} from 'react'
import DocumentTitle from '../../../../../../components/DocumentTitle'
import './assets/css/index.css'
import req from '../../../../../../assets/js/req'
import Confirm from '../../../../../../components/Confirm'
import Util from '../../../../../../components/Util'
import default_qrCode_png from './assets/img/default_qrCode.png'
import gantan_png from './assets/img/gantan.png'

const qs = require('querystring');

class DoMember extends Component{
    constructor(){
        super();
    }
    componentWillMount(){
        this.query = qs.parse(this.props.location.search.replace(/^\?&*/,''));
    }
    render(){
        return (
            <div className="App DoMember">
                <DocumentTitle title={JSON.stringify(this.query) === '{}' ? '添加成员' : '编辑成员'}></DocumentTitle>
                <div className="block">
                    <div className="flex align-items-center">
                        <div className="label">手机号：</div>
                        <div className="flex1">
                            <input className="phoneNumber" type="text" placeholder="请输入手机号码"/>
                        </div>
                    </div>
                    <div className="flex align-items-center">
                        <div className="label">备注：</div>
                        <div className="flex1">
                            <input className="phoneNumber" type="text" placeholder="备注姓名信息"/>
                        </div>
                    </div>
                </div>
                <div className="block-title">
                    <div className="flex align-items-center">
                        <div className="flex1">设备号（多选）</div>
                        <div className="flex1 text-right">接单开关</div>
                    </div>
                </div>
                <div className="block device-list">
                    <div className="flex align-items-center">
                        <label class="on"><input name="allMode" type="radio" /></label>
                        <div className="flex1">
                            <span>010101010</span>
                            <div className="warning">
                                <img src={gantan_png} alt=""/>
                                <span>设备接单成员最多为12人，当前设备以达到上限！</span>
                            </div>
                        </div>
                        <div className="switch"><span className="green-circle"></span></div>
                    </div>
                    <div className="flex align-items-center">
                        <label class="on"><input name="allMode" type="radio" /></label>
                        <div className="flex1">
                            <span>010101010</span>
                            <div className="warning">
                                <img src={gantan_png} alt=""/>
                                <span>设备接单成员最多为12人，当前设备以达到上限！</span>
                            </div>
                        </div>
                        <div className="switch on"><span className="green-circle"></span></div>
                    </div>
                    <div className="flex align-items-center">
                        <label class="on"><input name="allMode" type="radio" /></label>
                        <div className="flex1">
                            <span>010101010</span>
                            <div className="warning">
                                <img src={gantan_png} alt=""/>
                                <span>设备接单成员最多为12人，当前设备以达到上限！</span>
                            </div>
                        </div>
                        <div className="switch"><span className="green-circle"></span></div>
                    </div>
                </div>
                <div className="block upload-qrCode">
                    <p>提交该成员微信二维码</p>
                    <div className="qrCode">
                        <img src={default_qrCode_png} alt=""/>
                    </div>
                    <p className="text-center">展会模式下不提交二维码，将接不到推送订单</p>
                    <button>提交</button>
                </div>
            </div>
        )
    }
}

export default DoMember