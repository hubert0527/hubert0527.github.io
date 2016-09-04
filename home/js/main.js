
$(document).ready(function () {
    dealTopImage();
    prepareLayout();
    // createSkillRatingBar();
    // $('body').removeClass('preload');
});

$(window).load(function () {
    init();
});

$(window).resize(function () {
    prepareLayout();
});

function prepareLayout() {
    dealAllAboutMe();
}

function init() {

    grabMouseScroll();

    calcTopBgPos();
    browserDetect();

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

    $(document).scroll(calcTopBgPos);
    $(window).resize(function () {
        calcTopBgPos();
    });

    $('#goDownBtn').click(function () {

        topImageScrolling = true;

        var wh = $('#topImageDivWrapper').height();
        var cur = $(document).scrollTop();
        var dist = wh-cur;

        $(document).stop();
        $(window).stop();
        $('body,html').stop().animate({scrollTop:wh},1500,'swing',function () {
            topImageScrolling = false;
        });


    });
}

function calcTopBgPos(e) {
    var HH = $(window).outerHeight();
    var WW = $(window).outerWidth();

    var imgHeight = WW * 1004 / 1234; // aspect original image ratio
    var remainHeight = imgHeight - (HH-50);
    var wrapper = $('#topImageDivWrapper');
    var wrapperHeight;
    var viewPortRatio = (HH-50)/WW;

    var shadowHeader = $('#shadowHeader');

    // if screen is too square, the go-down button mat overlap Yi-Shen
    if(viewPortRatio>0.68){
        var oneThird = imgHeight/3;
        wrapperHeight = oneThird*2;
        wrapper.height(wrapperHeight);
        remainHeight = oneThird;
        console.log('oneThird='+oneThird);
    }
    else{
        // css calc seems won't update automatically
        wrapperHeight = HH-50;
        wrapper.height(wrapperHeight);
    }

    // deal with shadow part
    dealWithTopShadow();



    // find and set top image margin top
    var curPos = $(window).scrollTop();
    var scrolledRatio = curPos/wrapperHeight;
    var marginTop = (imgHeight) * scrolledRatio - remainHeight;
    $('#topImage').css({marginTop: marginTop + 'px'}, 1);

    function dealWithTopShadow() {
        var shadowHeight = (wrapperHeight)*0.32;
        $('#topImageShadow').height(shadowHeight);

        var btnHeight = WW/HH>1 ? '5vh' : '5vw';
        shadowHeader.css('padding-top',btnHeight).css('font-size',shadowHeight/6);
        $('#shadowQuoteWrapper').height(shadowHeight-shadowHeader.outerHeight());
        $('#shadowQuote').css('font-size',shadowHeight/10);
    }
}

function dealAllAboutMe() {
    var HH = window.innerWidth;
    if(HH>=992) {
        var hh = $('#myBasicInfo').height();
        $('#separator').height(hh * 0.9).width(0).css('margin', hh * 0.05 + 'px ' + ' auto').css('display','block');

        $('#profilePictureDiv').css('margin','auto');
    }
    else{
        var p = $('#myBasicInfo');
        var ww = p.width();
        var hh = p.height();
        $('#separator').width(ww * 0.9).height(0).css('margin',ww*0.05+'px').css('display','block');

        var pp = $('#profilePictureDiv');
        var mh = pp.height();
        pp.css('margin',(hh-mh)/2+'px auto');
    }

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

function grabMouseScroll() {
    if ('onmousewheel' in window) {
        window.onmousewheel = wheelHandler;
    } else if ('onmousewheel' in document) {
        document.onmousewheel = wheelHandler;
    } else if ('addEventListener' in window) {
        window.addEventListener("mousewheel", wheelHandler, false);
        window.addEventListener("DOMMouseScroll", wheelHandler, false);
    }
}

// code use from
// http://stackoverflow.com/questions/3656592/how-to-programmatically-disable-page-scrolling-with-jquery
function wheelHandler(event) {

    if(topImageScrolling) {
        $('body,html').stop();
        topImageScrolling = false;
    }

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