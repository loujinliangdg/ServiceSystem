import React,{Component,PureComponent} from 'react';

class DocumentTitle extends PureComponent{
    componentWillMount(){
        document.title = this.props.title;
    }
    render(){
        return ''
    }
}

export default DocumentTitle