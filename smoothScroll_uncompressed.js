/*--------------------------------------------------------------------------*
 *  
 *  SmoothScroll JavaScript Library V2 modified by mi73
 *  Inner scroll with Easing curve
 *  document.smoothScroll(element|idName) is Available in external scope.
 *
 *  MIT-style license.
 *
 *  ＠originalAuthor Kazuma Nishihata
 *  ＠modifier Yohei Minami
 *  @access  public
 *  @facebook  yohei.minami
 *  @twitter  mi73
 *  @modifier  2012/10/18
 *  @version 0.0.1
 *--------------------------------------------------------------------------*/

(function (_document) {

    var
        // scroll seconds (millsecond)
        // スクロールにかかる時間を設定(ミリ秒)
        scrollDulation = 1000,

        // Easing Curve Function. The list is below.  RECOMMEND : easeOutQuart　
        // イージングカーブタイプ 一覧は下の方にあります。  オススメ : easeOutQuart
        animationType = "easeOutQuart",

        // Default interval time is 6ms
        // タイマーインターバルは6ミリ秒としています。
        stepMs = 6,

        //attr = "data-for-smoothScroll", // if you can't use html5 , this value change "class"
        attr = "class", //for html5

        // If you don't need, set class or data-for-smoothScroll "noSmooth"
        // 必要ない要素には、classまたはdata-for-smoothScroll属性にnoSmoothとセットしてください。
        attrPatt = /noSmooth/,

        d = document, //document short cut
        easingFunction; //Easing Function


    function addEvent(elm, listener, fn) {
        try { // IE
            elm.addEventListener(listener, fn, false);
        } catch (e) {
            elm.attachEvent(
                "on" + listener
                , function () {
                    fn.apply(elm, arguments)
                }
            );
        }
    }

    function SmoothScroll(a) {

        var e, end, docHeight, winHeight, start, flag, hashing;

        //a tag
        if (a.rel) {
            if (d.getElementById(a.rel.replace(/.*\#/, ""))) {
                e = d.getElementById(a.rel.replace(/.*\#/, ""));
            } else {
                return;
            }
            // name of id
        } else if (typeof a == "string") {
            e = d.getElementById(a)
            // element itself
        } else {
            e = a;
        }

        end = e.offsetTop;
        if (navigator.userAgent.indexOf('Android') > 0 && end == 0) end = 2;
        docHeight = d.documentElement.scrollHeight;
        winHeight = window.innerHeight || d.documentElement.clientHeight;
        if (docHeight - winHeight < end) {
            end = docHeight - winHeight;
        }

        start = window.pageYOffset || d.documentElement.scrollTop || d.body.scrollTop || 0;
        flag = (end < start) ? "up" : "down";

        hashing = function () {
            if (typeof a == "string")location.hash = a;
        };

        function scrollMe(start, end, flag, step) {
            setTimeout(
                function () {
                    if (scrollDulation <= step) {
                        window.scrollTo(0, end);
                        hashing();
                    } else if (flag == "up" && start >= end) {
                        target = start - (start - end) * ( easingFunction[animationType](step, 0, 1, scrollDulation) );
                        window.scrollTo(0, target);
                        scrollMe(start, end, flag, step + stepMs);
                    } else if (flag == "down" && start <= end) {
                        target = start + (end - start) * ( easingFunction[animationType](step, 0, 1, scrollDulation) );
                        window.scrollTo(0, target);
                        scrollMe(start, end, flag, step + stepMs);
                    }
                    return;
                }
                , stepMs
            );
        }

        scrollMe(start, end, flag, 0);

    }

    /*
     *Add SmoothScroll
     -------------------------------------------------*/
    addEvent(window, "load", function () {
        var anchors = d.getElementsByTagName("a");
        for (var i = 0 , len = anchors.length; i < len; i++) {
            if (!attrPatt.test(anchors[i].getAttribute(attr)) &&
                anchors[i].href.replace(/\#[a-zA-Z0-9_]+/, "") == location.href.replace(/\#[a-zA-Z0-9_]+/, "")) {
                anchors[i].rel = anchors[i].href;
                anchors[i].href = "javascript:void(0)";
                anchors[i].onclick = function () {
                    SmoothScroll(this)
                }
            }
        }
    });

    /*
     *Easing Function for scroll from jquery easing
     -------------------------------------------------*/
    // t: current time, b: begInnIng value, c: change In value, d: duration
    easingFunction = {
        easeInQuad:function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad:function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad:function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        easeInCubic:function (t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic:function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOutCubic:function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        easeInQuart:function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOutQuart:function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOutQuart:function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        easeInQuint:function (t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOutQuint:function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOutQuint:function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        easeInSine:function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine:function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine:function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        easeInExpo:function (t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo:function (t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo:function (t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc:function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOutCirc:function (t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc:function (t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        easeInElastic:function (t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOutElastic:function (t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        },
        easeInOutElastic:function (t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (!p) p = d * (.3 * 1.5);
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        },
        easeInBack:function (t, b, c, d) {
            var s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOutBack:function (t, b, c, d) {
            var s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOutBack:function (t, b, c, d) {
            var s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        easeInBounce:function (t, b, c, d) {
            return c - this.easeOutBounce(d - t, 0, c, d) + b;
        },
        easeOutBounce:function (t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOutBounce:function (t, b, c, d) {
            if (t < d / 2) return this.easeInBounce(t * 2, 0, c, d) * .5 + b;
            return this.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    };

    // for external execution
    document.smoothScroll = SmoothScroll;
}(document));