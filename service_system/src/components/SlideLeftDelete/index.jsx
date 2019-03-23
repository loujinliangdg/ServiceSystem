import React ,{Component} from 'react'
import './assets/css/index.css'

class SlideLeftDelete extends Component{
    static defaultProps = {
        deleteHandle:function(){}
    }
    constructor(){
        super();
        this.startX = 0;
        this.startY = 0;

        this.moveX = 0;
        this.moveY = 0;

        this.prevMoveX = null;
        this.prevMoveY = null;

        this.endX = 0;
        this.endY = 0;
        this.slideTransTime = 600;

        this.deleteBtnWidth = 0;
    }
    setTransition(element,transTime,left){
        if(!(element instanceof Element)){
            throw TypeError('element就是Element元素')
        }
        element.style.webKitTransition = `all ${transTime}ms`;
        element.style.transition = `all ${transTime}ms`;
        element.style.left = left + 'px';
    }
    pageTouchStart(event){
        if(event.target.className === 'delete-button'){
            return;
        }
        var userItem = [].slice.call(document.querySelectorAll('.was-slide'));
        userItem.forEach((item) =>{
            var itemLeft = item.style.left ? parseFloat(item.style.left) : 0;
            if(itemLeft !== 0){
                this.setTransition(item,this.slideTransTime,0);
            }
        })
    }
    otherInit(target){
        var AllSlide = [].slice.call(document.querySelectorAll('.was-slide'));
        AllSlide.forEach((item) =>{
            var itemLeft = item.style.left ? parseFloat(item.style.left) : 0;
            if(itemLeft !== 0 && item !== target){
                this.setTransition(item,this.slideTransTime,0);
            }
        })
    }
    TouchStart(event){
        var target = event.targetTouches[0];
        var currentTarget = event.currentTarget;
        this.startX = target.clientX;
        this.startY = target.clientY;
        currentTarget.style.webKitTransition = `all 0ms`;
        currentTarget.style.transition = `all 0ms`;
        this.otherInit(currentTarget);
    }
    TouchMove(event){
        var target = event.targetTouches[0];
        var currentTarget = event.currentTarget;
        var deleteBtn = currentTarget.querySelector('.delete-button');
        
        this.moveX = target.clientX;
        this.moveY = target.clientY;
        
        // 如果横向比纵向滑动的幅度大，则向应左滑删除的动作，并且阻止纵向滚动条的行为
        if(Math.abs(this.moveX - this.startX) > Math.abs(this.moveY - this.startY)){
            event.preventDefault();
            if(this.prevMoveX === null){
                this.prevMoveX = this.moveX;
                this.prevMoveY = this.moveY;
            }
            else{
                var willX = this.moveX - this.prevMoveX;
                var itemLeft = currentTarget.style.left ? parseFloat(currentTarget.style.left) : 0;
                currentTarget.style.left = ((itemLeft + willX) > 0 ? 0 : (itemLeft + willX) < -deleteBtn.offsetWidth ? -deleteBtn.offsetWidth : (itemLeft + willX)) + 'px';
            }



            this.prevMoveX = this.moveX;
            this.prevMoveY = this.moveY;
        }
    }
    TouchEnd(event){
        var target = event.changedTouches[0];
        var currentTarget = event.currentTarget;
        var deleteBtnWidth
        if(this.deleteBtnWidth){
            deleteBtnWidth = this.deleteBtnWidth;
        }
        else{
            var deleteBtn = currentTarget.querySelector('.delete-button');
            this.deleteBtnWidth = deleteBtnWidth = deleteBtn.offsetWidth;
        }
        var itemLeft = currentTarget.style.left ? parseFloat(currentTarget.style.left) : 0;
        if(Math.abs(itemLeft) >=  deleteBtnWidth * 0.6){
            let transTime = (deleteBtnWidth - Math.abs(itemLeft)) * (this.slideTransTime / deleteBtnWidth);
            this.setTransition(currentTarget,transTime,-deleteBtnWidth);
        }
        else{
            let transTime = Math.abs(itemLeft) * (this.slideTransTime / deleteBtnWidth);
            this.setTransition(currentTarget,transTime,0);
        }
        this.startX = 0;
        this.startY = 0;

        this.moveX = 0;
        this.moveY = 0;
        
        this.prevMoveX = null;
        this.prevMoveY = null;
    }
    render(){
        return (
            <div className="slide-left-delete">
                <div 
                className="was-slide"
                onTouchStart={this.TouchStart.bind(this)}
                onTouchMove={this.TouchMove.bind(this)}
                onTouchEnd={this.TouchEnd.bind(this)}
                >
                    {this.props.children}
                    <button className="delete-button" onClick={this.props.deleteHandle}>删除</button>
                </div>
            </div>
        )
    }
}

export default SlideLeftDelete