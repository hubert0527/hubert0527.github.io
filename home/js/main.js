/**
 * Created by hubert lin2 on 2016/9/7.
 */

var NAV_BAR_HH = 70;

$(document).ready(function () {

    // prepare bootstrap widget
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip();

    dealFooter();

});

$(window).load(function () {

    attachBasicEventHandlers()

});


function attachBasicEventHandlers() {

    $(document).scroll(function () {

    });
    $(document).on('touchmove',function(){

    });
    $(window).resize(function () {

    });
    if ('onmousewheel' in window) {
        window.onmousewheel = wheelHandler;
    } else if ('onmousewheel' in document) {
        document.onmousewheel = wheelHandler;
    } else if ('addEventListener' in window) {
        window.addEventListener("mousewheel", wheelHandler, false);
        window.addEventListener("DOMMouseScroll", wheelHandler, false);
    }

    attachFadeInAnimate();

}
