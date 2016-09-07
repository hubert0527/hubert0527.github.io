/**
 * Created by hubert lin2 on 2016/9/7.
 */

var isGoToActionScrolling = false;

var BIO = [
    "想到就立刻去做，有趣就馬上動手做，一直空想只是浪費生命",
    "傾盡全力去幫助那些努力向上、勤勉不懈的人",
    "等待、尋找一群願意一起努力做好一件事的人",
    "要求網頁對IE和手機端都responsive是寫這個網站過程中最愚蠢的錯誤",
    "沒東西可學是句屁話，沒學到任何東西是另一句"
];

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

function dealTopImage() {

    $('#goDownBtn').click(function () {

        $(this).blur();

        isGoToActionScrolling = true;
        clearInterval(scrollInterval);
        scrollInterval = undefined;

        var wh = $('#topImageDivWrapper').height();
        $(document).stop();
        $(window).stop();
        $('body,html').stop().animate({scrollTop:wh},1500,'swing',function () {
            isGoToActionScrolling = false;
            scrollTargetPosition = $(window).scrollTop();
        });


    });
}

function dealFooter() {
    $('#goTopBtn').click(function () {

        $(this).blur();

        isGoToActionScrolling = true;
        clearInterval(scrollInterval);
        scrollInterval = undefined;

        $(document).stop();
        $(window).stop();
        $('body,html').stop().animate({scrollTop:0},1500,'swing',function () {
            isGoToActionScrolling = false;
            scrollTargetPosition = $(window).scrollTop();
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

function haltGoToAction() {
    if(isGoToActionScrolling) {
        scrollTargetPosition = $(window).scrollTop();
        $('body,html').stop();
        isGoToActionScrolling = false;
        clearInterval(scrollInterval);
    }
}

function measureTopImagePlaceHolder() {
    var HH = $(window).outerHeight();
    var WW = $(window).outerWidth();
    var viewPortRatio = (HH-NAV_BAR_HH)/WW;

    if(viewPortRatio>0.68){
        var imgHeight = WW * 1004 / 1234; // aspect original image ratio
        $('#topImagePlaceHolder').height(imgHeight*2/3);
    }
    else{
        $('#topImagePlaceHolder').height(HH-NAV_BAR_HH);
    }
    
    $('#topImage').ready(function () {
        $('#topImagePlaceHolder').css('display','none');
    });
    if($('#topImage')[0].complete) $('#topImagePlaceHolder').css('display','none');

}