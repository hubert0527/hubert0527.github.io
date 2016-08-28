// block resizing(cuz resizing will also modify size of extension popup window)
var alerted = false;
$(window).resize(function () {
    if(!alerted) alert('請不要更改此頁面的縮放！(會造成右上彈出式視窗跟著放大縮小)');
    alerted = true;
});

$(window).load(function () {

    $('.showCodeExample').click(function () {
        var codeBlock = $('#codeExample');
        var sec = $('#secondBtn');
        if(!codeBlock.is(':visible')) {
            codeBlock.hide().slideDown(400);
            $('.showCodeExample').blur();
            if(!sec.is(':visible')) sec.slideDown(500);
        }
        else {

            if(this.id=="secondBtn") {
                // screen slide up
                $('html, body').animate({
                    scrollTop: $("#codeTop").offset().top
                }, 400);
            }

            codeBlock.slideUp(400);
            $('.showCodeExample').blur();
            sec.slideUp(500);
        }
    });
});