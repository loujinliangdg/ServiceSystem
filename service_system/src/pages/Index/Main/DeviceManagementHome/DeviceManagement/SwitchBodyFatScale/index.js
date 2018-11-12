import React,{Component} from 'react'
import DocumentTitle from '../../../../../../components/DocumentTitle'
import req from '../../../../../../assets/js/req'
import Utils from '../../../../../../components/Util'
import './assets/css/index.css'
import body_fat_scale_png from './assets/img/body-fat-scale-img.png'

class SwitchBodyFatScale extends Component {
    constructor(props){
        super();
        this.state = {
            requested:false,
            bodyFatScaleList:[],
        }
        this.bianlaId = window.localStorage.getItem('bianlaId');
        this.deviceId = window.localStorage.getItem('deviceId');
        this.deviceNo = window.localStorage.getItem('deviceNo');
    }
    componentDidMount() {
        var bodyFatScaleList = !JSON.parse(this.props.match.params.bodyFatScaleList).length ? [
            {
                id: 486,
                deviceId: 129,
                scaleCode: "04:AC:44:80:01:15",
                isUse: false,
                isDelete: false,
                scalePic: null,
                created: "2018-10-23 15:02:01",
                modified: "2018-10-23 15:02:01"
            },
            {
                id: 487,
                deviceId: 129,
                scaleCode: "04:AC:44:80:01:15",
                isUse: true,
                isDelete: false,
                scalePic: null,
                created: "2018-10-23 15:02:01",
                modified: "2018-10-23 15:02:01"
            }
        ] : JSON.parse(this.props.match.params.bodyFatScaleList);
        this.setState({
            bodyFatScaleList:bodyFatScaleList
        })         
    }
    switchBodyFatScale(item){
        this.state.bodyFatScaleList.map((item) =>{
            item.isUse = false;
        })
        item.isUse = true;
        // 更新数据
        this.setState({
            bodyFatScaleList:this.state.bodyFatScaleList,
        })
    }
    enterSwitchBodyFatScale(){
        var scaleId = null;
        this.state.bodyFatScaleList.forEach((item) =>{
            if(item.isUse){
                scaleId = item.id;
            }
        })
        // 如果有选中的体脂秤
        if(scaleId !== null){
            req.get('切换体脂秤',{deviceId:this.deviceId,scaleId:scaleId},(result) =>{
                result.code === 1 ? Utils.Toast(result.alertMsg,() =>{
                    window.history.go(-1);
                }) : Utils.Toast(result.alertMsg);
            },(error) =>{
                Utils.Toast(error.toString());
            })
        }
        else{

        }
    }
    render(){
        return (
            <div className="App SwitchBodyFatScale">
                <DocumentTitle title="切换体脂秤"></DocumentTitle>
                <div className="switchBodyFatScale-container">
                    <div className="row-block">
                        {
                            this.state.bodyFatScaleList.map((item,index) =>{
                                return (
                                    <div className="row" key={item.id} onClick={this.switchBodyFatScale.bind(this,item)}>
                                        <div className="flex align-items-center">
                                            <div className="flex1 flex align-items-center">
                                                体脂秤{index+1}：<span className="flex1">{item.scaleCode}</span>
                                            </div>
                                            <label className={item.isUse ? 'on' : ''}><input name="bodyFatScale" type="radio" value={index} /></label>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <p className="text-ts">体脂秤蓝牙ID在体脂秤电池仓底部,可通过微信扫码查看蓝牙ID</p>
                    <div className="body-fat-scale-big-img">
                        <img src={body_fat_scale_png} alt=""/>
                    </div>
                    <button className="enter" onClick={this.enterSwitchBodyFatScale.bind(this)}>确定</button>
                </div>
            </div>
        )
    }
}

export default SwitchBodyFatScale