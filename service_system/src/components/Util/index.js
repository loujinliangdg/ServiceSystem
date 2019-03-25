




const Toast = {
    uid:0,
    defaultDelay:600,
    create(text,delay,callback){
        var toast = document.createElement('div');
        var span = document.createElement('span');

        toast.id = this.createId();
        span.className = 'Toast-text';

        toast.style.cssText = `
            position:fixed;
            width:100%;
            left:0;
            top:70%;
            text-align:center;
            -webkit-transition:all .3s;
            transition:all .3s;
            z-index:9992;
        `
        span.style.cssText = `
            max-width:80%;
            padding:5px 10px;
            background:rgba(0,0,0,0.97);
            color:#fff;
            font-size:13px;
            border-radius:3px;
        `
        span.innerHTML = text;
        toast.appendChild(span);
        document.body.appendChild(toast);

        setTimeout(() =>{
            document.querySelector('#'+toast.id).style.opacity = 0;
            // 淡出完成，display:none;
            setTimeout(() =>{
                this.hide(toast.id);
                if(typeof delay === 'function'){
                    delay();
                }
                else if(typeof callback === 'function'){
                    callback();
                }
            },300)
        },isNaN(delay) ? this.defaultDelay : delay)

        return toast.id;
    },
    hide(id){
        var toast = document.querySelector('#'+id);
        toast.style.display = 'none';
    },
    createId(){
        return 'Toast-' + (this.uid++);
    }
}

module.exports.Toast = function(text,delay,callback){
    return Toast.create(text,delay,callback)
}