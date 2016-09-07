/**
 * Created by hubert lin2 on 2016/9/7.
 */

var FadeIn = function(obj,dir) {
    this.inst = obj;
    // 1 for right to left, -1 for left to right
    this.direction = dir;

    this.triggerPos = $(obj).offset().top - $(window).height() * 0.8;
    this.hasTriggered = false;

    var that = this;

    this.trigger = function () {
        var curPos = $(window).scrollTop();
        // var HH =
        if(curPos>=that.triggerPos){

            // cuz don't know why trigger event will trigger twice
            if(!that.hasTriggered) {
                that.hasTriggered = true;

                console.log('trigger');

                var ww = $(that.inst).width();

                // $(that.inst).css('opacity','0').animate(800);

                var orientaion = that.direction > 1 ? 'left' : 'right';
                var originalPos = parseFloat($(that.inst).css(orientaion));
                if(!originalPos) originalPos = 0;
                var initCss = {opacity: 0,position: 'relative'};
                var animate = {opacity: 1};
                initCss[orientaion] = that.direction*(-1)*(ww * 0.9 + originalPos) + 'px';
                animate[orientaion] = originalPos + 'px';

                $(that.inst).css(initCss).animate(animate, 1000);
            }

            // remove self
            $(document).off('scroll',that.trigger);
            $(document).off('touchmove',that.trigger);
            $(window).off('resize',that.update);
        }
    };

    this.update = function () {
            var a = $(obj).offset().top;
        var b = $(window).height() * 0.8;
        that.triggerPos = $(obj).offset().top - $(window).height() * 0.8;
        that.trigger();
    };

    this.trigger();

    return this;

};


var fadeFromLeftInst = [];
var fadeFromRightInst = [];

function attachFadeInAnimate() {

    var D = $(document);
    var W = $(window);

    $('.fadeFromLeft').each(function (i, inst) {
        fadeFromLeftInst[i] = new FadeIn(inst,-1);
        D.scroll(fadeFromLeftInst[i].trigger);
        D.on('touchmove',fadeFromLeftInst[i].trigger);
        W.resize(fadeFromLeftInst[i].update);
    });
    $('.fadeFromRight').each(function (i, inst) {
        fadeFromRightInst[i] = new FadeIn(inst,1);
        D.scroll(fadeFromRightInst[i].trigger);
        D.on('touchmove',fadeFromRightInst[i].trigger);
        W.resize(fadeFromRightInst[i].update);
    });

}