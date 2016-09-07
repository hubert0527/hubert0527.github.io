/**
 * Created by hubert lin2 on 2016/9/8.
 */

$(document).ready(function () {
    dealTopImage();
    doLayout();
});

$(window).load(function () {

    // init
    calcTopBgPos();
    // browserDetect();
    // setBioRandom();
    showTopImage();
    setRateBarVibrateAnimation();
    attachIndexEventHandlers();

});


function doLayout() {
    createSkillRatingBar();
    dealAllAboutMe();
    measureTopImagePlaceHolder();
}


function browserDetect() {
    // Opera 8.0+
    window.isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Firefox 1.0+
    window.isFirefox = typeof InstallTrigger !== 'undefined';
    // At least Safari 3+: "[object HTMLElementConstructor]"
    window.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // Internet Explorer 6-11
    window.isIE = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
    window.isEdge = !isIE && !!window.StyleMedia;
    // Chrome 1+
    window.isChrome = !!window.chrome && !!window.chrome.webstore;

    // touch device
    var touch = window.ontouchstart
            || (navigator.MaxTouchPoints > 0)
            || (navigator.msMaxTouchPoints > 0);
    if (touch) { // remove all :hover stylesheets
        try { // prevent exception on browsers not supporting DOM styleSheets properly
            for (var si in document.styleSheets) {
                var styleSheet = document.styleSheets[si];
                if (!styleSheet.rules) continue;

                for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                    if (!styleSheet.rules[ri].selectorText) continue;

                    if (styleSheet.rules[ri].selectorText.match(':hover')) {
                        styleSheet.deleteRule(ri);
                    }
                }
            }
        } catch (ex) {}
    }

}

function attachIndexEventHandlers() {

    $(document).scroll(function () {
        calcTopBgPos();
        rateBarAnimationOnScroll();
    });
    $(document).on('touchmove',function(){
        $('body,html').stop();
        calcTopBgPos();
        rateBarAnimationOnScroll();
    });
    $(window).resize(function () {
        calcTopBgPos();
        doLayout();
        updateVibrateRateBar();
    });

}




