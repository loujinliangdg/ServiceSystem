import React, { Component } from 'react';
import DocumentTitle from '../../../../../components/DocumentTitle'
import './assets/css/index.css'
import req from '../../../../../assets/js/req'
import Loading from '../../../../../components/Loading'
import NoHaveMessage from '../../../../../components/NoHaveMessage'

const qs = require('querystring')


class PlayerNumber extends Component{
    constructor(){
        super();
        this.state = {
            requested:false,
            dataList:[],
        }
        this.deviceArray = JSON.parse(window.localStorage.getItem('deviceArray'));
        this.deviceId = this.deviceArray[0].deviceId;
        this.deviceNo = this.deviceArray[0].deviceNo;

        this.beginDate = '';
        this.endDate = '';
    }
    componentWillMount(){
        var query = qs.parse(this.props.location.search.replace(/^\?&*/,''));
        this.beginDate = query.beginDate;
        this.endDate = query.endDate;
    }
    componentDidMount(){
        this.getList();
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }
    /**
     * 获取上秤人数
     */
    getList(){
        req.get('获取上秤玩家',{deviceId:this.deviceId,beginDate:this.beginDate,endDate:this.endDate},(result) =>{
            if(result.code === 1){
                var dataList = result.data.playerNumberList || []
                this.setState({
                    dataList,
                    requested:true,
                })
            }
            else{
                this.setState({
                    requested:true,
                })
            }
        },(error) =>{
            this.setState({
                requested:true,
            })
        })
    }
    computedRenderContent(requested,dataList){
        // 未请求完成
        if(!requested){
            return <Loading />
        }
        // 请求完成无数据
        else if(requested && !dataList.length){
            return <NoHaveMessage />
        }
        // 有数据
        else{
            return (
                <div className="playerNumber-container">
                    <div className="list-title">
                        <div className="flex align-items-center">
                            <div className="flex1 text-center">时间</div>
                            <div className="flex1 text-center">人数</div>
                        </div>
                    </div>
                    <div className="list-content">
                        <div className="gray"></div>
                        {
                            dataList.map((item,index) =>{
                                return (
                                    <div className="flex align-items-center" key={index}>
                                        <div className="flex1 text-center"><span>{item.count_date}</span></div>
                                        <div className="flex1 text-center"><span>{item.player_number}</span></div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )
        }
    }
    render(){
        return (
            <div className="App PlayerNumber">
                <DocumentTitle title="上秤人数"></DocumentTitle>
                {
                    this.computedRenderContent(this.state.requested,this.state.dataList)
                }
            </div>
        )
    }
}

export default PlayerNumber