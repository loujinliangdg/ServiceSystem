import React,{Component} from 'react';

class DocumentTitle extends Component{
    componentWillMount(){
        document.title = this.props.title;
    }
    render(){
        return ''
    }
}

export default DocumentTitle