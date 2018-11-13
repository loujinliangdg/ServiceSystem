import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './assets/css/index.css'
import Util from '../../../components/Util'
import req from '../../../assets/js/req'


import yyzn_png from './assets/img/yyzn_2x.png'     //运营指南图标
import sjcx_png from './assets/img/sjcx_2x.png'     //数据查询图标
import syjc_png from './assets/img/syjc_2x.png'     //使用教程图标
import sbgl_png from './assets/img/sbgl_2x.png'     //设备管理图标
import cgal_png from './assets/img/cgal_2x.png'     //成功案例图标
import xwsc_png from './assets/img/xwsc_2x.png'     //小卫商城图标

import circle_line_png from './assets/img/circle_line.png' //圆线
import zuo_jian_tou_png from './assets/img/zuojiantou_png@2x.png' //引导层箭头



class Main extends Component{
    constructor(){
        super();
        this.state = {
            maskIndex:0,
            zIndex:102,
            isRead:window.localStorage.getItem('isRead'),
            yyzn_isRead:true,
            syjc_isRead:true,
            cgal_isRead:true,
        }
        this.bianlaId = window.localStorage.getItem('bianlaId');
    }
    componentDidMount(){
        this.getPostTypeIsRead();
    }
    maskTouchMove(event){
        event.preventDefault();
    }
    nextClick(event){
        event.preventDefault();
        // 下一步
        if(this.state.maskIndex < 2){
            this.setState({
                maskIndex:this.state.maskIndex + 1
            })
        }
        // 完成
        else{
            req.get('标记用户已读提示语',{bianlaId:this.bianlaId},(result) =>{
                if(result.code == 1){
                    this.setState({
                        isRead:'true',
                        maskIndex:this.state.maskIndex + 1
                    })
                    window.localStorage.setItem('isRead',true);
                }
            },(error) =>{
                Util.Toast(error.toString())
            })
        }
    }
    getPostTypeIsRead(){
        ['yyzn','syjc','cgal'].forEach((item,index) =>{
            req.get('根据文章类型查询是否有未读文章',{postType:item,bianlaId:this.bianlaId},(result) =>{
                if(result.code === 1){
                    var obj = {};
                    obj[item+'_isRead'] = result.data.isRead;
                    this.setState(obj)
                }
            },(error) =>{
                Util.Toast(error.toString())
            })
        })
    }
    render(){
        return (
            <div className="Main">
                <div className="main-inner">
                    <div className="flex m-list">
                        <Link className="m-item" to="/index/childType?postType=yyzn">
                            <div>
                                <img className="m-icon" src={yyzn_png} alt=""/>
                                <div className="red-circle-dot" style={{display:!this.state.yyzn_isRead ? 'block' : 'none'}}>
                                    {/* 未读显示，已读隐藏 */}
                                </div>
                                {/* 新手引导 */}
                                <div className="guide" onTouchMove={this.maskTouchMove.bind(this)} onClick={this.nextClick.bind(this)} style={{zIndex:(this.state.maskIndex === 0 && this.state.isRead !== 'true') ? this.state.zIndex : -1}}>
                                    <img className="m-icon" src={yyzn_png} alt=""/>
                                    <img className="circle-line" src={circle_line_png} alt=""/>
                                    <img className="jiantou zuojiantou" src={zuo_jian_tou_png} alt=""/>
                                    <div className="text-box" style={{width:window.innerWidth + 'px'}}>
                                        <p>学习小卫运营技巧，尽在运营指南</p>
                                        <div className="next">
                                            <a href="javascript:;">下一步</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p>运营指南</p>
                        </Link>
                        <Link className="m-item" to="/index/dataSearch">
                            <div><img className="m-icon" src={sjcx_png} alt=""/></div>
                            <p>数据查询</p>
                        </Link>
                        <Link className="m-item" to="/index/childType?postType=syjc">
                            <div>
                                <img className="m-icon" src={syjc_png} alt=""/>
                                <div className="red-circle-dot" style={{display:!this.state.syjc_isRead ? 'block' : 'none'}}>
                                    {/* 未读显示，已读隐藏 */}
                                </div>
                                {/* 新手引导 */}
                                <div className="guide" onTouchMove={this.maskTouchMove.bind(this)} onClick={this.nextClick.bind(this)} style={{zIndex:(this.state.maskIndex === 1 && this.state.isRead !== 'true') ? this.state.zIndex : -1}}>
                                    <img className="m-icon" src={syjc_png} alt=""/>
                                    <img className="circle-line" src={circle_line_png} alt=""/>
                                    <img className="jiantou youjiantou" src={zuo_jian_tou_png} alt=""/>
                                    <div className="text-box" style={{width:window.innerWidth + 'px'}}>
                                        <p>快速了解小卫功能介绍，查看使用教程</p>
                                        <div className="next">
                                            <a href="javascript:;">下一步</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p>使用教程</p>
                        </Link>
                        <Link className="m-item" to="/index/deviceManagementHome">
                            <div>
                                <img className="m-icon" src={sbgl_png} alt=""/>
                                {/* 新手引导 */}
                                <div className="guide" onTouchMove={this.maskTouchMove.bind(this)} onClick={this.nextClick.bind(this)} style={{zIndex:(this.state.maskIndex === 2 && this.state.isRead !== 'true') ? this.state.zIndex : -1}}>
                                    <img className="m-icon" src={sbgl_png} alt=""/>
                                    <img className="circle-line" src={circle_line_png} alt=""/>
                                    <img className="jiantou zuojiantou" src={zuo_jian_tou_png} alt=""/>
                                    <div className="text-box" style={{width:window.innerWidth + 'px'}}>
                                        <p>设备管理移到这里了，快去试试吧</p>
                                        <div className="next">
                                            <a href="javascript:;">完成</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p>设备管理</p>
                        </Link>
                        <Link className="m-item" to="/index/childType/articleList?type=cgal">
                            <div>
                                <img className="m-icon" src={cgal_png} alt=""/>
                                <div className="red-circle-dot" style={{display:!this.state.cgal_isRead ? 'block' : 'none'}}>
                                    {/* 未读显示，已读隐藏 */}
                                </div>
                            </div>
                            <p>成功案例</p>
                        </Link>
                        <a className="m-item" href="https://weidian.com/?userid=1374903480&p=iphone&wfr=wxBuyerShare">
                            <div><img className="m-icon" src={xwsc_png} alt=""/></div>
                            <p>小卫商城</p>
                        </a>
                    </div>
                </div>
                <div className="mask" style={{position:'fixed',top:'0',bottom:'0',left:'0',right:'0',zIndex:'100',background:'rgba(0,0,0,0.5)',display:this.state.isRead !== 'true' ? 'block' : 'none'}} onTouchMove={this.maskTouchMove.bind(this)}>
                
                </div>
            </div>
        )
    }
}

export default Main