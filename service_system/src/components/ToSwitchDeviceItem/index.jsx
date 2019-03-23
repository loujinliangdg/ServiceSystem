import React from 'react'
import {Link} from 'react-router-dom'
import './assets/css/index.css'
/**
 * 
 * 去切换设备按钮组件，有多处调用
 * 需要一个deviceNo 显示设备号
 */
const ToSwitchDeviceItem = (props)=>{
    return (
        <div className="ToSwitchDeviceItem">
            <h5 className="current-device">当前设备：</h5>
            <div className="row-block">
                <div className="row">
                    <div className="flex align-items-center">
                        <div className="flex1">
                            设备号：<span>{props.deviceNo}</span>
                        </div>
                        <div>
                            <Link className="switch-device-btn" to="/index/deviceManagementHome/deviceManagement/switchDevice">切换</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ToSwitchDeviceItem