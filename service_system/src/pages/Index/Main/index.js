import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './assets/css/index.css'

import yyzn_png from './assets/img/yyzn_2x.png'     //运营指南图标
import sjcx_png from './assets/img/sjcx_2x.png'     //数据查询图标
import syjc_png from './assets/img/syjc_2x.png'     //使用教程图标
import sbgl_png from './assets/img/sbgl_2x.png'     //设备管理图标
import cgal_png from './assets/img/cgal_2x.png'     //成功案例图标
import xwsc_png from './assets/img/xwsc_2x.png'     //小卫商城图标

class Main extends Component{

    render(){
        return (
            <div className="Main">
                <div className="main-inner">
                    <div className="flex m-list">
                        <Link className="m-item" to="/index/childType?postType=yyzn">
                            <div><img className="m-icon" src={yyzn_png} alt=""/></div>
                            <p>运营指南</p>
                        </Link>
                        <Link className="m-item" to="/index/dataSearch">
                            <div><img className="m-icon" src={sjcx_png} alt=""/></div>
                            <p>数据查询</p>
                        </Link>
                        <Link className="m-item" to="/index/childType?postType=syjc">
                            <div><img className="m-icon" src={syjc_png} alt=""/></div>
                            <p>使用教程</p>
                        </Link>
                        <Link className="m-item" to="/index/deviceManagementHome">
                            <div><img className="m-icon" src={sbgl_png} alt=""/></div>
                            <p>设备管理</p>
                        </Link>
                        <Link className="m-item" to="/index/childType/articleList?type=cgal">
                            <div><img className="m-icon" src={cgal_png} alt=""/></div>
                            <p>成功案例</p>
                        </Link>
                        <div className="m-item">
                            <div><img className="m-icon" src={xwsc_png} alt=""/></div>
                            <p>小卫商城</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Main