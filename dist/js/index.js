'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slider = function () {
    /*构造函数*/
    function Slider(opts) {
        _classCallCheck(this, Slider);

        this.wrap = opts.dom;
        this.list = opts.list;
        this.init();
    }

    /*初始化*/


    _createClass(Slider, [{
        key: 'init',
        value: function init() {
            /* 窗口宽度*/
            this.scaleW = window.innerWidth;
            /*当前图片的索引*/
            this.idx = 0;
            this.renderDOM();

            this.lis = this.outer.getElementsByTagName('li');
            this.bindDOM();
        }

        /*绘制dom*/

    }, {
        key: 'renderDOM',
        value: function renderDOM() {
            var wrap = this.wrap,
                data = this.list,
                i = 0,
                html = [];
            this.outer = document.createElement('ul');

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var val = _step.value;

                    if (val) {
                        html.push('<li style="transform: translate3d(' + i * this.scaleW + 'px ,0,0)">\n                    <img src="' + val['img'] + '" alt="img" width="' + window.innerWidth + 'px" height="180px" />\n                  </li>');
                    }
                    i++;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.outer.innerHTML = html.join('');
            wrap.appendChild(this.outer);
        }
    }, {
        key: 'goIndex',
        value: function goIndex(n) {
            var idx = this.idx,
                cidx = void 0,
                len = this.lis.length;

            switch (typeof n === 'undefined' ? 'undefined' : _typeof(n)) {
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

            var min = this.lis[cidx - 1];
            var now = this.lis[cidx];
            var max = this.lis[cidx + 1];

            //改变过渡的方式，从无动画变为有动画

            var move = [-this.scaleW, 0, this.scaleW],
                i = 0;

            var _arr = [min, now, max];
            for (var _i = 0; _i < _arr.length; _i++) {
                var val = _arr[_i];
                if (val) {
                    console.log(val);
                    val.style.webkitTransition = '-webkit-transform .2s ease-out';
                    val.style.webkitTransform = 'translate3d(' + move[i] + 'px,0,0)';
                }
                i++;
            }
        }
    }, {
        key: 'bindDOM',
        value: function bindDOM() {
            var _this = this;

            var scaleW = this.scaleW,
                outer = this.outer;

            var startHandle = function startHandle(evt) {
                /*记录刚开始按下的时间*/
                _this.startTime = new Date() * 1;
                /*记录手指按下的坐标*/
                _this.startX = evt.touches[0].pageX;
                /*清除偏移量*/
                _this.offsetX = 0;

                //事件对象
                var target = evt.target;
                while (target.nodeName != 'LI' && target.nodeName != 'BODY') {
                    target = target.parentNode;
                }
                _this.target = target;
            };
            /*手指移动的处理事件*/
            var moveHandler = function moveHandler(evt) {
                /*兼容chrome android 阻止浏览器默认行为*/
                evt.preventDefault();
                /*手指移动位移*/
                _this.offsetX = evt.targetTouches[0].pageX - _this.startX;

                /*每次改变  只需要改变 当前图片,前一张图片,后一张图片*/
                var before = _this.lis[_this.idx - 1];
                var nex = _this.lis[_this.idx + 2];
                //最小化改变DOM属性
                /*下面为简写
                 * if(self.lis[before]){
                 *       …………
                 * }
                 * */

                var _arr2 = [before, nex];
                for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
                    var val = _arr2[_i2];
                    val && (val.style.webkitTransition = '-webkit-transform 0s ease-out');
                    val && (val.style.webkitTransform = 'translate3d(' + ((val - _this.idx) * _this.scaleW + _this.offsetX) + 'px, 0, 0)');
                }
            };
            /*手指抬起的事件*/
            var endHandler = function endHandler(evt) {
                evt.preventDefault();
                var boundary = scaleW / 6,
                    endTime = new Date() * 1;
                /*
                 * 手指滑动距离超过 boundary 翻页
                 * 当手指移动时间超过300ms的时候,按位移算
                 * */
                if (endTime - _this.startTime > 300) {
                    if (_this.offsetX >= boundary) {
                        /*进入上一页*/
                        _this.goIndex('-1');
                    } else if (_this.offsetX < 0 && _this.offsetX < -boundary) {
                        /*进入下一页*/
                        _this.goIndex('+1');
                    } else {
                        /*留在本页*/
                        _this.goIndex('0');
                    }
                } else {
                    /*快速滑动的时候,较少滑动的间隔,即可滑动*/
                    if (_this.offsetX > 50) {
                        _this.goIndex('-1');
                    } else if (_this.offsetX < -50) {
                        _this.goIndex('+1');
                    } else {
                        _this.goIndex('0');
                    }
                }
            };
            /*绑定事件*/
            outer.addEventListener('touchstart', startHandle);
            outer.addEventListener('touchmove', moveHandler);
            outer.addEventListener('touchend', endHandler);
        }
    }]);

    return Slider;
}();