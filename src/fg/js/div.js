class Div {
    constructor() {
        this.div = null;
        this.offset = 1;
        this.popup = new Popup();
        this.t_point = null;
        this.options = null;
    }

    show(pageInfo,options,type,isUp){
        // console.log(window.odhfront.options);
        this.options = options;
        //注入插件按钮
        this.inject();
        //注入展示页面
        this.popup.inject(options);
        //生成展示页面内容
        let content = this.popup.renderPopup(pageInfo,type,isUp);

        this.div.style.visibility = 'visible';
        this.div.innerText='助手';
        document.body.appendChild(this.div);

    }
    getRangeRect(point) {
        return rangeFromPoint(point).getBoundingClientRect();
    }

    showPopup(e){

        if(status=='visible'){
            this.popup.hide();
        }
        let height=document.documentElement.clientHeight;//取得浏览器页面可视区域的宽度
        let popTop = parseInt(this.div.style.top)+20+2;
        //let popTop = (height/2+20)/2+2;
        let pos = {
            x:0,
            y:popTop
        }
        this.popup.showAt(pos);

    }

    async mysleep(ms) {
        return new Promise(resolve =>
            setTimeout(resolve, ms)
        )
    }

    hide() {
        if (this.div !== null) {
            this.div.style.visibility = 'hidden';
        }
    }

    sleep(delay) {
        var start = (new Date()).getTime();
        while ((new Date()).getTime() - start < delay) {
            continue;
        }
    }


    hasClass(elem, cls) {
        cls = cls || '';
        if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
        return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
    }

    addClass(ele, cls) {
        if (!this.hasClass(ele, cls)) {
            ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
        }
    }

    removeClass(ele, cls) {
        if (this.hasClass(ele, cls)) {
            var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
            while (newClass.indexOf(' ' + cls + ' ') >= 0) {
                newClass = newClass.replace(' ' + cls + ' ', ' ');
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        }
    }


    inject(){
        if (this.div !== null) {
            return;
        }
        let height=document.documentElement.clientHeight;//取得浏览器页面可视区域的宽度
        this.div = document.createElement('div');
        this.div.style.right='0px';
        this.div.style.top=(height/2-20)/2+'px';
        this.div.style.width='40px'; // 指定宽度
        this.div.style.height='20px'; // 指定高度
        this.div.id = 'acfun-helper-div';
        this.div.style.position='fixed';
        this.div.style.visibility='hidden';
        this.div.style.zIndex=9999;
        this.div.addEventListener('mousedown', (e) => e.stopPropagation());
        this.div.addEventListener('click', (e) => this.showPopup(e));
        let root = document.body;
        root.appendChild(this.div);
    }

}