function Slider(opts) {
    this.wrap = opts.dom;
    this.list = opts.list;

    this.init();
    this.renderDOM();
    this.bindDOM();
}

Slider.prototype = {
    init: function () {
        /* 窗口宽度*/
        this.scaleW = window.innerWidth;
        /*当前图片的索引*/
        this.idx = 0;
    },
    renderDOM: function () {
        var wrap = this.wrap,
            data = this.list,
            len = data.length, i;

        this.outer = document.createElement('ul');

        for (i = 0; i < len; i++) {
            var li = document.createElement('li'),
                item = data[i];

            li.style.webkitTransform = 'translate3d(' + i * this.scaleW + 'px,0,0)';
            if (item) {
                li.innerHTML = '<img width="' + window.innerWidth + 'px" height="180px" src="' + item['img'] + '">';
            }
            this.outer.appendChild(li);
        }

        this.lis = this.outer.getElementsByTagName('li');
        wrap.appendChild(this.outer);
    },
    goIndex: function (n) {
        var idx = this.idx,
            len = this.lis.length,
            cidx;
        if (typeof n === 'number') {
            cidx = idx;
        } else if (typeof n == 'string') {
            cidx = idx + n * 1;
        }
        if (cidx > len - 1) {
            cidx = len - 1;
        } else if (cidx < 0) {
            cidx = 0;
        }
        this.idx = cidx;

        //改变过渡的方式，从无动画变为有动画
        this.lis[cidx].style.webkitTransition = '-webkit-transform .2s ease-out';
        this.lis[cidx - 1] && (this.lis[cidx - 1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
        this.lis[cidx + 1] && (this.lis[cidx + 1].style.webkitTransition = '-webkit-transform 0.2s ease-out');

        //改变动画后所应该的位移值
        this.lis[cidx].style.webkitTransform = 'translate3d(0, 0, 0)';
        this.lis[cidx - 1] && (this.lis[cidx - 1].style.webkitTransform = 'translate3d(-' + this.scaleW + 'px, 0, 0)');
        this.lis[cidx + 1] && (this.lis[cidx + 1].style.webkitTransform = 'translate3d(' + this.scaleW + 'px, 0, 0)');
    },
    bindDOM: function () {
        /*先缓存this*/
        var self = this,
            scaleW = self.scaleW,
            outer = self.outer;

        var startHandle = function (evt) {
            /*记录刚开始按下的时间*/
            self.startTime = new Date() * 1;
            /*记录手指按下的坐标*/
            self.startX = evt.touches[0].pageX;
            /*清除偏移量*/
            self.offsetX = 0;

            //事件对象
            var target = evt.target;
            while (target.nodeName != 'LI' && target.nodeName != 'BODY') {
                target = target.parentNode;
            }
            self.target = target;
        };

        /*手指移动的处理事件*/
        var moveHandler = function (evt) {
            /*兼容chrome android 阻止浏览器默认行为*/
            evt.preventDefault();
            /*手指移动位移*/
            self.offsetX = evt.targetTouches[0].pageX - self.startX;

            var i = self.idx - 1,
                m = i + 3;

            //最小化改变DOM属性
            for (i; i < m; i++) {
                self.lis[i] && (self.lis[i].style.webkitTransition = '-webkit-transform 0s ease-out');
                self.lis[i] && (self.lis[i].style.webkitTransform = 'translate3d(' + ((i - self.idx) * self.scaleW + self.offsetX) + 'px, 0, 0)');
            }
        }
        /*手指抬起的事件*/
        var endHandler = function (evt) {
            evt.preventDefault();
            var boundary = scaleW / 6,
                endTime = new Date() * 1;
            /*
             * 手指滑动距离超过 boundary 翻页
             * 当手指移动时间超过300ms的时候,按位移算
             * */
            if (endTime - self.startTime > 300) {
                if (self.offsetX >= boundary) {
                    self.goIndex('-1');
                } else if (self.offsetX < 0 && self.offsetX < -boundary) {
                    self.goIndex('+1');
                } else {
                    self.goIndex('0');
                }
            } else {
                if (self.offsetX > 50) {
                    self.goIndex('-1');
                } else if (self.offsetX < -50) {
                    self.goIndex('+1');
                } else {
                    self.goIndex('0');
                }
            }
        };
        /*绑定事件*/
        outer.addEventListener('touchstart', startHandle);
        outer.addEventListener('touchmove', moveHandler);
        outer.addEventListener('touchend', endHandler);
    }
}

















