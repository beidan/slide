'use strict';
class Slider {
    /*构造函数*/
    constructor(opts) {
        this.wrap = opts.dom;
        this.list = opts.list;
        this.init();
    }

    /*初始化*/
    init() {
        /* 窗口宽度*/
        this.scaleW = window.innerWidth;
        /*当前图片的索引*/
        this.idx = 0;
        this.renderDOM();
        this.bindDOM();
    }

    /*绘制dom*/
    renderDOM() {
        let data = this.list,
            i, len = data.length;

        this.outer = this.wrap.getElementsByTagName('ul');

        this.lis = this.outer[0].querySelectorAll('li');

        for (i = 0; i < len; i++) {

            if (this.lis[i]) {
                this.lis[i].style.webkitTransform = `translate3d(${i * this.scaleW}px ,0,0)`;
                let image = this.lis[i].querySelector('img');
                image.src = `${data[i]['imageUrl']}`;
            }
        }
    }

    goIndex(n) {
        let idx = this.idx, cidx,
            len = this.lis.length;

        switch (typeof n) {
            case 'number':
                cidx = idx;
                break;
            case 'string':
                cidx = idx + n * 1;
                break;
            default:
                break;
        }

        /*如果索引值超出范围*/
        if (cidx > len - 1) {
            cidx = len - 1;
        } else if (cidx < 0) {
            cidx = 0;
        }
        this.idx = cidx;

        let [min,now,max]=[this.lis[cidx - 1], this.lis[cidx], this.lis[cidx + 1]];

        //改变过渡的方式，从无动画变为有动画
        let move = [-this.scaleW, 0, this.scaleW], i = 0;

        for (let val of [min, now, max]) {
            if (val) {
                val.style.webkitTransition = '-webkit-transform .2s ease-out';
                val.style.webkitTransform = `translate3d(${move[i]}px,0,0)`;
            }
            i++;
        }
    }

    bindDOM() {
        let scaleW = this.scaleW,
            outer = this.outer[0];

        let startHandle = (evt)=> {
            /*记录刚开始按下的时间*/
            this.startTime = new Date() * 1;
            /*记录手指按下的坐标*/
            this.startX = evt.touches[0].pageX;
            /*清除偏移量*/
            this.offsetX = 0;

            //事件对象
            let target = evt.target;
            while (target.nodeName != 'LI' && target.nodeName != 'BODY') {
                target = target.parentNode;
            }
            this.target = target;
        }
        /*手指移动的处理事件*/
        let moveHandler = (evt)=> {
            /*兼容chrome android 阻止浏览器默认行为*/
            evt.preventDefault();
            /*手指移动位移*/
            this.offsetX = evt.targetTouches[0].pageX - this.startX;

            /*每次改变  只需要改变 当前图片,前一张图片,后一张图片*/
            let [before,nex] = [this.lis[this.idx - 1], this.lis[this.idx + 2]];
            //最小化改变DOM属性
            /*下面为简写
             * if(self.lis[before]){
             *       …………
             * }
             * */
            for (let val of [before, nex]) {
                val && (val.style.webkitTransition = '-webkit-transform 0s ease-out');
                val && (val.style.webkitTransform = 'translate3d(' + ((val - this.idx) * this.scaleW + this.offsetX) + 'px, 0, 0)');
            }
        }
        /*手指抬起的事件*/
        let endHandler = (evt)=> {
            evt.preventDefault();
            let boundary = scaleW / 6,
                endTime = new Date() * 1;
            /*
             * 手指滑动距离超过 boundary 翻页
             * 当手指移动时间超过300ms的时候,按位移算
             * */
            if (endTime - this.startTime > 300) {
                if (this.offsetX >= boundary) {/*进入上一页*/
                    this.goIndex('-1');
                } else if (this.offsetX < 0 && this.offsetX < -boundary) {/*进入下一页*/
                    this.goIndex('+1');
                } else {/*留在本页*/
                    this.goIndex('0');
                }
            } else {
                /*快速滑动的时候,较少滑动的间隔,即可滑动*/
                if (this.offsetX > 50) {
                    this.goIndex('-1');
                } else if (this.offsetX < -50) {
                    this.goIndex('+1');
                } else {
                    this.goIndex('0');
                }
            }
        };
        /*绑定事件*/
        outer.addEventListener('touchstart', startHandle);
        outer.addEventListener('touchmove', moveHandler);
        outer.addEventListener('touchend', endHandler);
    }
}





