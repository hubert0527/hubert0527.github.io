
var NAV_BAR_HH = 70;

var BIO = [
    "想到就立刻去做，有趣就馬上動手做，一直空想只是浪費生命",
    "傾盡全力去幫助那些努力向上、勤勉不懈的人",
    "等待、尋找一群願意一起努力做好一件事的人",
    "要求網頁對IE8和手機端都responsive是寫這個網站過程中最愚蠢的錯誤"
];


$(document).ready(function () {

    // prepare bootstrap widget
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip();

    dealTopImage();
    dealFooter();
    doLayout();
});

$(window).load(function () {
    init();
});

$(window).resize(function () {
    doLayout();
    stopAndReMeasureAllRateBarWidth();
});

function doLayout() {
    createSkillRatingBar();
    dealAllAboutMe();
}

function init() {

    browserDetect();

    setBioRandom();
    setIconHoverAnimation();
    showTopImage();
    grabMouseScroll();
    setRateBarVibrateAnimation();
    stopAndReMeasureAllRateBarWidth();

    calcTopBgPos();

}

function scrollAnimation() {

    $('.skillBar').each(function (i, inst) {
        vibrateRateBar(i,inst,'medium',true);
    });
}

// function doSomeAnimationOnLoad() {
//     $('#abilityBlock').load(function () {
//         $('.skillBar').each(function (i, inst) {
//             vibrateRateBar(i,inst,'short');
//         });
//     });
// }
// doSomeAnimationOnLoad();

function setRateBarVibrateAnimation() {
    $('.skillBar').each(function (i, inst) {
        $(inst).mouseover(function () {
            vibrateRateBar(i,this);
        });
    });
}

function setBioRandom() {
    var prev,r,ri;
    setInterval(function () {

        r = Math.random();
        ri = Math.floor(r * BIO.length);

        if(prev==ri) ri = (ri+1)%BIO.length;

        prev = ri;

        $('#shadowQuote').fadeOut('slow',function () {
            $(this).text(BIO[ri]).fadeIn('slow');
        });
    },5000);
}

function setIconHoverAnimation() {
    $('.iconLink').mouseover(function () {
        $(this).children().css({'background-color': 'orange'});
    })
        .mouseleave(function () {
        $(this).children().css({'background-color': 'white'});
    });
}

/**
 * originally set invisible cuz image will have a jump on page load (due to the margin setting)
 */
function showTopImage() {
    var topImg = $('#topImage');
    if(topImg[0].complete){
        topImg.css('visibility','visible');
    }
    else{
        topImg.load(function () {
           $(this).css('visibility','visible');
        });
    }
}

function createSkillRatingBar() {

    $('.skillLang').each(function (i, inst) {

        var p = $(inst).parent();
        var skillLang = $(inst);
        var skillBar = $(inst).siblings('.skillBar');
        var skillRate = $(skillBar.children()[0]);
        var skillRateShadow = $(skillBar.children()[1]);

        var HH = skillLang.height();
        var WW = p.width();
        var ow = p.outerWidth();
        var margin = (ow-WW)/2;
        var rate = parseInt(p.find('.skillRate').text());

        // var innerMaxWidth = (WW-10) - (HH*0.1)*2;

        skillBar.css({
            'bottom':0,
            'width':WW-10+'px',
            'height':HH*0.7+'px',
            'margin':HH*0.05+'px 0'
        });
        skillRateShadow.css({
            'width':(WW-10)+'px',
            'height':HH*0.7+'px',
            'border-radius':HH/2+'px'
        });
        skillRate.css({
            'width':((WW-10)*rate/10)+'px',
            'border-radius':HH/2+'px',
            'font-size':HH*0.5+'px',
            'line-height':HH*0.7+'px',
            'height':HH*0.7+'px'
        });
    });
}

var topImageScrolling = false;
function dealTopImage() {

    $(document).scroll(calcTopBgPos);
    $(document).on('touchmove',function(){
        $('body,html').stop();
        calcTopBgPos();
    });
    $(window).resize(function () {
        calcTopBgPos();
    });

    $('#goDownBtn').click(function () {

        $(this).blur();

        topImageScrolling = true;
        clearInterval(interval);
        interval = undefined;

        var wh = $('#topImageDivWrapper').height();
        $(document).stop();
        $(window).stop();
        $('body,html').stop().animate({scrollTop:wh},1500,'swing',function () {
            topImageScrolling = false;
            end = $(window).scrollTop();
        });


    });
}

function dealFooter() {
    $('#goTopBtn').click(function () {

        $(this).blur();

        topImageScrolling = true;
        clearInterval(interval);
        interval = undefined;

        $(document).stop();
        $(window).stop();
        $('body,html').stop().animate({scrollTop:0},1500,'swing',function () {
            topImageScrolling = false;
            end = $(window).scrollTop();
        });


    });
}

function calcTopBgPos(e) {

    // find and set top image margin top
    var curPos = $(window).scrollTop();
    if(curPos<0){
        // $('body').css('marginTop',curPos+70+'px');
        $('html').css('padding-top',curPos+'px').css('overflow','visible');
        return;
    }

    var HH = $(window).outerHeight();
    var WW = $(window).outerWidth();

    var imgHeight = WW * 1004 / 1234; // aspect original image ratio
    var remainHeight = imgHeight - (HH-NAV_BAR_HH);
    var wrapper = $('#topImageDivWrapper');
    var wrapperHeight;
    var viewPortRatio = (HH-NAV_BAR_HH)/WW;

    var shadowHeader = $('#shadowHeader');

    // if screen is too square, the go-down button mat overlap Yi-Shen
    if(viewPortRatio>0.68){
        var oneThird = imgHeight/3;
        wrapperHeight = oneThird*2;
        wrapper.height(wrapperHeight);
        remainHeight = oneThird;
    }
    else{
        // css calc seems won't update automatically
        wrapperHeight = HH-NAV_BAR_HH;
        wrapper.height(wrapperHeight);
    }

    // deal with shadow part
    dealWithTopShadow();


    var scrolledRatio = curPos/wrapperHeight;
    var marginTop = (imgHeight) * scrolledRatio - remainHeight;
    $('#topImage').css({marginTop: marginTop + 'px'}, 1);

    function dealWithTopShadow() {
        var shadowHeight = (wrapperHeight)*0.32;
        $('#topImageShadow').height(shadowHeight);

        var headerTopMargin = WW/HH>1 ? '8vh' : '6vw';
        shadowHeader.css('padding-top',headerTopMargin).css('font-size',shadowHeight/6);
        $('#shadowQuoteWrapper').height(shadowHeight-shadowHeader.outerHeight());
        $('#shadowQuote').css('font-size',shadowHeight/10);
    }
}

function dealAllAboutMe() {
    var WW = window.innerWidth;
    var hh;
    if(WW>=992) {
        // right col is strictly higher than left one
        hh = $('#moreDetailAboutMe').height();

        // clean up unnecessary margin
        $('#profilePictureDiv').css('margin','auto');

        // prepare separator
        $('#separator').height(hh * 0.9).width(0).css('margin', hh * 0.05 + 'px ' + ' auto').css('display','block');
    }
    else{

        // collapse basic info, one of top block need to vertically align middle

        var right = $('#objectProfile');
        var left = $('#profilePictureDiv');
        var left2 = $('#nameAndContactInfo');
        var rightH = right.outerHeight();
        // cuz photo may not ready, and my photo aspect 1:1 ratio
        var leftH = left.width() + left2.outerHeight();

        if(leftH>rightH){
            hh = leftH;
            right.css('margin',(hh-rightH)/2+'px auto');
        }
        else{
            hh = rightH;
            left.css('margin',(hh-leftH)/2+'px auto');
        }

        // prepare separator
        var ww = $('#myBasicInfo').width();
        // $('#separator').width(ww * 0.9).height(0).css('margin',ww*0.05+'px').css('display','block');
        $('#separator').css('display','none');

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

    scrollAnimation();

    if(topImageScrolling) {
        end = $(window).scrollTop();
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

var end; // record the last window stop position
var interval;
var goUp;
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
            if (scrollTop < 0 ||
                scrollTop >= $(window).prop("scrollHeight") - $(window).height() ||
                goUp && step > -1 ||
                !goUp && step < 1 ) {
                    clearInterval(interval);
                    interval = null;
                    end = null;
            }
            else{
                $(window).scrollTop(scrollTop + step );
            }

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

var rateBarVibrateInst = [];
var canReplaceFlag = [];
var originalWidth = [];
function vibrateRateBar(index,obj,duration,randomTrigger) {

    var dir = 1;
    if(randomTrigger){
        if(Math.random()>0.5) dir = -1;
    }

    if(canReplaceFlag[index]==false) return;
    clearInterval(rateBarVibrateInst[index]);

    var amplitude = $(obj).children('.skillRateShadow').width()/10*2;
    var rateBar = $(obj).children('.skillRate');
    var dampRatio = 0.99;
    if(duration=='short'){
        dampRatio = 0.95;
    }
    else if(duration=='medium'){
        dampRatio = 0.97;
    }
    var deg = 90;

    var ww = originalWidth[index];

    rateBarVibrateInst[index] = setInterval(function () {
        deg += (3.6*dir);
        amplitude *= dampRatio;
        if(amplitude<0.01){
            clearInterval(rateBarVibrateInst[index]);
            canReplaceFlag[index] = true;
            return;
        }
        var displacement = amplitude*Math.cos(deg/180*3.1415926);

        rateBar.width(ww-displacement);

    },10);

    var i = setInterval(function () {
        clearInterval(i);
        canReplaceFlag[i] = true;
    },1000);
}

function stopAndReMeasureAllRateBarWidth() {
    $('.skillRate').each(function (i,inst) {
        clearInterval(rateBarVibrateInst[i]);
        var rate = parseInt($(inst).children().text());
        originalWidth[i] = $(inst).parent().width()*rate/10;
        $(inst).width(originalWidth[i]);
    });
}