import React,{PureComponent} from 'react'
import req from '../../../../../../assets/js/req'

import DocumentTitle from '../../../../../../components/DocumentTitle'
import Loading from '../../../../../../components/Loading'
import NoHaveMessage from '../../../../../../components/NoHaveMessage'
import './assets/css/index.css'
import face_sad_png from './assets/img/face_sad.svg';
import face_smile_png from './assets/img/face_smile.svg';

const qs = require('querystring')

class Article extends PureComponent{
    constructor(props){
        super();
        this.query = {}
        this.state = {
            article:null,//文章
            requested:false,
            isClick:false,  //有用无用，是否点击过
        }
        this.bianlaId = window.localStorage.getItem('bianlaId');
    }
    componentWillMount(){
        this.query = qs.parse(this.props.location.search.slice(1));
        this.query.bianlaId = this.bianlaId;
    }
    componentDidMount() {
        this.getList(this.query);
    }
    getList(query){
        req.get('根据文章id获取文章',query,(result) =>{
            if(result.code === 1){
                var article = result.data.article || null
                this.setState({
                    article,
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
    Click(name,event){
        var api_name = `${name}数量统计`;
        // 点了一次不准再点了
        if(this.state.isClick){
            return;
        }
        this.setState({isClick:name});
        req.get(api_name,{id:this.state.article.id},(result) =>{
            if(result.code === 1){

            } 
        })
    }
    computedRenderContent(requested,article){
        // 未请求完成
        if(!requested){
            return <Loading />
        }
        // 请求完成无数据
        else if(requested && !article){
            return <NoHaveMessage />
        }
        // 有数据
        else{
            return (
                <div className="article">
                    <h1 className="article-title">{this.state.article.articleTitle}</h1>
                    <div className="content" dangerouslySetInnerHTML={{__html:this.state.article.articleContent}}>

                    </div>
                    <div className="bottom">
                        <div className="useful-and-useless">
                            <div className={`flex align-items-center text-center ${this.state.isClick == '有用' ? 'on' : ''}`} onClick={this.Click.bind(this,'有用')}>
                                <div className="flex1" style={{marginRight:'-13px'}}>
                                    <svg t="1542271962309" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3035" width="15" height="15"><path d="M512 0C228.266667 0 0 228.266667 0 512s228.266667 512 512 512 512-228.266667 512-512S795.733333 0 512 0z m0 981.333333C253.866667 981.333333 42.666667 770.133333 42.666667 512S253.866667 42.666667 512 42.666667s469.333333 211.2 469.333333 469.333333-211.2 469.333333-469.333333 469.333333z"  p-id="3036"></path><path d="M256 448m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"  p-id="3037"></path><path d="M768 448m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"  p-id="3038"></path><path d="M712.533333 704c-57.6 42.666667-128 66.133333-200.533333 66.133333-72.533333 0-142.933333-23.466667-200.533333-66.133333-8.533333-6.4-23.466667-4.266667-29.866667 4.266667-6.4 8.533333-4.266667 23.466667 4.266667 29.866666 66.133333 49.066667 142.933333 74.666667 226.133333 74.666667 83.2 0 160-25.6 226.133333-74.666667 8.533333-6.4 10.666667-21.333333 4.266667-29.866666-6.4-10.666667-19.2-12.8-29.866667-4.266667z"  p-id="3039"></path></svg>
                                </div>
                                <div className="flex1"><span>无用</span></div>
                            </div>
                            <div className={`flex align-items-center text-center ${this.state.isClick == '无用' ? 'on' : ''}`} onClick={this.Click.bind(this,'无用')}>
                                <div className="flex1" style={{marginRight:'-13px'}}>
                                    <svg t="1542271935960" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2763" width="15" height="15"><path d="M512 0C228.266667 0 0 228.266667 0 512s228.266667 512 512 512 512-228.266667 512-512S795.733333 0 512 0z m0 981.333333C253.866667 981.333333 42.666667 770.133333 42.666667 512S253.866667 42.666667 512 42.666667s469.333333 211.2 469.333333 469.333333-211.2 469.333333-469.333333 469.333333z"  p-id="2764" data-spm-anchor-id="a313x.7781069.0.i0" class="selected"></path><path d="M256 448m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"  p-id="2765"></path><path d="M768 448m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"  p-id="2766"></path><path d="M512 699.733333c-83.2 0-160 25.6-226.133333 74.666667-8.533333 6.4-10.666667 21.333333-4.266667 29.866667 6.4 8.533333 21.333333 10.666667 29.866667 4.266666 57.6-42.666667 128-66.133333 200.533333-66.133333 72.533333 0 142.933333 23.466667 200.533333 66.133333 4.266667 2.133333 8.533333 4.266667 12.8 4.266667 6.4 0 12.8-2.133333 17.066667-8.533333 6.4-8.533333 4.266667-23.466667-4.266667-29.866667-64-49.066667-142.933333-74.666667-226.133333-74.666667z"  p-id="2767"></path></svg>
                                </div>
                                <div className="flex1"><span>无用</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
    render(){
        return (
            <div className="App Article" style={{paddingTop:'1px'}}>
                <DocumentTitle title="文章详情"></DocumentTitle>
                {this.computedRenderContent(this.state.requested,this.state.article)}
            </div>
        )
    }
}
export default Article