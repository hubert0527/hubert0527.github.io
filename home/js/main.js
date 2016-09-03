
$(document).ready(function () {
    dealTopImage();
    // createSkillRatingBar();
});

$(window).load(function () {

    init();

});

function init() {

    $("body").removeClass('preload');

    browserDetect();


    if ('onmousewheel' in window) {
        window.onmousewheel = wheelHandler;
    } else if ('onmousewheel' in document) {
        document.onmousewheel = wheelHandler;
    } else if ('addEventListener' in window) {
        window.addEventListener("mousewheel", wheelHandler, false);
        window.addEventListener("DOMMouseScroll", wheelHandler, false);
    }

}

function createSkillRatingBar() {
    $('.skillRate').each(function (i, inst) {
        var rate = $(inst).attr('title');
        $(this).css('display','inline-block');

        var parentW = $(this).parent().innerWidth();
        var sib = $(this).siblings('h4');
        var sibW = sib.outerWidth();
        var sibH = sib.innerHeight();

        var remainW = parentW-sibW;

        $(this).css({
            width: (remainW*0.8)+'px',
            height: (sibH*0.8)+'px',
            padding: (sibH*0.1)+'px ' + (remainW*0.1)+'px',
            display: 'inline-block',
            backgroundColor: 'red'
        });

        console.log(sibH);
    });
}

var topImageScrolling = false;
function dealTopImage() {

    var HH = $(window).height();
    var WW = $(window).width();

    var imgHeight = WW * 1004 / 1234; // aspect original image ratio
    var remainHeight = imgHeight - HH;
    if(imgHeight<=HH) {
        $('#topImageWrapper').height(imgHeight);
        remainHeight = 0;
    }

    function calcTopBgPos(e) {
        var curPos = $(window).scrollTop();
        var scrolledRatio = curPos/HH;
        var marginTop = (HH+remainHeight) * scrolledRatio - remainHeight;
        $('#topImage').css({marginTop: marginTop + 'px'}, 1);

    }

    calcTopBgPos();

    $(document).scroll(calcTopBgPos);
    $(window).resize(function () {
        HH = $(window).height();
        WW = $(window).width();
        imgHeight = WW * 1004 / 1234; // aspect original image ratio
        remainHeight = imgHeight - HH;
        if(imgHeight<=HH) {
            $('#topImageWrapper').height(imgHeight);
            remainHeight = 0;
        }
        calcTopBgPos();
    });

    $('#goDownBtn').click(function () {

        topImageScrolling = true;

        var wh = $('#topImageWrapper').height();
        var cur = $(document).scrollTop();
        var dist = wh-cur;

        $(document).stop();
        $(window).stop();
        $('body,html').stop().animate({scrollTop:wh},1500,'swing',function () {
            topImageScrolling = false;
        });


    });
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
}

// code use from
// http://stackoverflow.com/questions/3656592/how-to-programmatically-disable-page-scrolling-with-jquery
function wheelHandler(event) {


    if(topImageScrolling) {
        $('body,html').stop();
        topImageScrolling = false;
    }

    console.log('!!');

    var delta = 0;
    if (event.wheelDelta) delta = event.wheelDelta / 120;
    else if (event.detail) delta = -event.detail / 3;

    wheelHandleWorker(delta);
    if (event.preventDefault) event.preventDefault();
    event.returnValue = false;

}

var end;
var interval;
function wheelHandleWorker(delta) {
    delta*=5;
    var animationInterval = 20; //lower is faster
    var scrollSpeed = 12; //lower is faster

    if (end == null) {
        end = $(window).scrollTop();
    }
    end -= 20 * delta;
    goUp = delta > 0;

    if (!interval) {
        interval = setInterval(function () {

            if(topImageScrolling) {
                clearInterval(interval);
                interval = undefined;
            }

            var scrollTop = $(window).scrollTop();
            var step = Math.round((end - scrollTop) / scrollSpeed);
            if (scrollTop <= 0 ||
                scrollTop >= $(window).prop("scrollHeight") - $(window).height() ||
                goUp && step > -1 ||
                !goUp && step < 1 ) {
                    clearInterval(interval);
                    interval = null;
                    end = null;
            }
            $(window).scrollTop(scrollTop + step );

        }, animationInterval);
    }
}

function insertCss( tar, dic ) {
    var style = document.createElement('style');
    style.type = 'text/css';

    var code,key;

    code = tar+"{";
    for(key in dic){
        if(dic.hasOwnProperty(key)){
            code+=(key+':'+dic[key]+';');
        }
    }

        code = code.slice(0,code.length-1) + '}';
    if (style.styleSheet) {
        // IE
        style.styleSheet.cssText = code;
    } else {
        // Other browsers
        style.innerHTML = code;
    }

    document.getElementsByTagName("head")[0].appendChild( style );
}