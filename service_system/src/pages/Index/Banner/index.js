import React, { Component } from 'react';
import './assets/css/index.css'
import '../../../assets/js/req'
import banner_loading_png from './assets/img/banner_loading.png'
import req from '../../../assets/js/req';
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'
import authorize_url from '../../../assets/js/authorize_url'
const qs = require('querystring');

class Banner extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataList:[], //分类列表
            requested:false,
        }
        this.swiper = null;
        this.wxAuthorize = null;
        this.localURL = window.location.href;
        this.bianlaId = window.localStorage.getItem('bianlaId');
    }
    componentWillMount(){
        this.wxAuthorize = authorize_url(`${this.localURL.split('#')[0]}#/autoLogin?`);
    }
    componentDidMount(){
        if(!this.bianlaId){
            window.location.href = this.wxAuthorize;
        }
        else{
            this.getBanner();
        }
    }
    componentWillUnmount(){
        // 如果swiper初始化过，则销毁swiper预防内存泄露
        this.swiper && this.swiper.destroy();
    }
    getBanner(){
        req.get('获取轮播图',{},(result) =>{
            if(Math.abs(result.code) === 401){
                window.location.href = this.wxAuthorize;
            }
            if(result.code == 1){
                var dataList = result.data.bannerList || [];
                this.setState({
                    dataList,
                    requested:true
                })
                // 如果轮播图大于1张 才初始化swiper
                if(this.state.dataList.length > 1){
                    this.swiper = new Swiper('.swiper-container', {
                        autoplay: true,//可选选项，自动滑动
                        pagination: {
                            el: '.swiper-pagination',
                        },
                    })
                }
            }
            else{
                this.setState({
                    requested:true
                })
            }
        },(error) =>{
            this.setState({
                requested:true
            })
        })
    }
    render(){
        return (
            <div className="Banner">
                <div className="banner-inner">
                    {
                        !this.state.dataList.length
                        ?   <div className="banner-loading">
                                <img className="banner-image" src={banner_loading_png} alt=""/>
                            </div>
                        :   <div className='swiper-container'>
                                <div className='swiper-wrapper'>
                                    {
                                        this.state.dataList.map((item) =>{
                                            return <div className='swiper-slide' key={item.id} style={{maxWidth:'100%'}}><a href={item.bannerUrl}><img style={{maxWidth:'100%'}} src={item.bannerPicture} alt=""/></a></div>
                                        })
                                    }
                                </div>
                                <div className="swiper-pagination"></div>
                            </div>
                    }
                </div>
            </div>
        )
    }
}

export default Banner