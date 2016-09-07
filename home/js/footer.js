/**
 * Created by hubert lin2 on 2016/9/8.
 */

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