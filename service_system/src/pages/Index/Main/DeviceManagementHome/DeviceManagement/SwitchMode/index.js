import React,{Component} from 'react'

import './assets/css/index.css'
import req from '../../../../../../assets/js/req'
import Utils from '../../../../../../components/Util'
import Loading from '../../../../../../components/Loading'
import NoHaveMessage from '../../../../../../components/NoHaveMessage'

class SwitchMode extends Component {
    constructor(props){
        super();
        this.state = {
            requested:false,
            modes:[],
            currentModeId:null,
        }
        this.deviceId = window.localStorage.getItem('deviceId');
    }
    componentDidMount() {
        this.setState({
            currentModeId:parseInt(this.props.match.params.currentMode) //获取当前应用的模式id
        })
        this.getAllMode();
    }
    getAllMode(){
        req.get('获取模式列表',{},(result) =>{
            var modes = [];
            if(result.code === 1){
                modes = result.data.modes;
            }
            this.setState({
                modes:modes,
                requested:true,
            })
        },(error) =>{
            this.setState({
                requested:true,
            })
        })
    }
    showCurrentMode(){
        var modeName = '';
        this.state.modes.forEach((item) =>{
            if(item.id === parseInt(this.state.currentModeId)){
                modeName = item.modeName;
            }
        })
        return modeName;
    }
    enterSwitchMode(){
        req.get('切换模式',{deviceId:this.deviceId,deviceMode:this.state.currentModeId},(result) =>{
            result.code === 1 ? Utils.Toast(result.alertMsg,() =>{
                window.history.go(-1);
            }) : Utils.Toast(result.alertMsg);
        },(error) =>{
            Utils.Toast(error.toString());
        })
    }
    computedRenderContent(requested,modes){
        // 未请求完成
        if(!requested){
            return <Loading />
        }
        // 请求完成无数据
        else if(requested && !modes.length){
            return <NoHaveMessage />
        }
        // 有数据
        else{
            return (
                <div className="switchMode-container">
                    <h5 className="current-device">当前模式：</h5>
                    <div className="row-block">
                        <div className="row">
                            <div className="flex align-items-center">
                                <div className="flex1">
                                    <span>{this.showCurrentMode()}</span>
                                </div>
                                <label className="on"><input name="xxx" type="radio" /></label>
                            </div>
                        </div>
                    </div>
                    <h5 className="other-device">其它模式：</h5>
                    <div className="row-block">
                        {
                            modes.map((item,index) =>{
                                return (
                                    <div className="row" onClick={this.switchMode.bind(this,item)} key={item.id}>
                                        <div className="flex align-items-center">
                                            <div className="flex1">
                                                <span>{item.modeName}</span>
                                            </div>
                                            <label className={item.id === this.state.currentModeId ? 'on' : ''}><input name="allMode" type="radio" /></label>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <a href="javascript:;" style={{display:'block',padding:'16px 0 0 4%',fontSize:'13px',color:'#40CC45',textDecoration:'underline',background:'#fff'}}>如何正确的选择机器模式？</a>
                    <button className="enter" onClick={this.enterSwitchMode.bind(this)}>提交</button>
                </div>
            )
        }
    }
    switchMode(item){
        this.setState({
            currentModeId:item.id
        });
    }
    render(){
        return (
            <div className="App SwitchMode">
                {this.computedRenderContent(this.state.requested,this.state.modes)}
            </div>
        )
    }
}

export default SwitchMode