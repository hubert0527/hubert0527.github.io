/**
 * Created by hubert lin2 on 2016/9/7.
 */

var scrollTargetPosition; // record the last window stop position
var scrollInterval;
var isScrollDirectionUp;

// code use from
// http://stackoverflow.com/questions/3656592/how-to-programmatically-disable-page-scrolling-with-jquery
function wheelHandler(event) {

    haltGoToAction();

    var delta = 0;
    if (event.wheelDelta) delta = event.wheelDelta / 120;
    else if (event.detail) delta = -event.detail / 3;

    wheelHandleWorker(delta);
    if (event.preventDefault) event.preventDefault();
    event.returnValue = false;

}

function wheelHandleWorker(delta) {
    delta*=5;
    var animationInterval = 20; //lower is faster
    var scrollSpeed = 12; //lower is faster

    if (scrollTargetPosition == null) {
        scrollTargetPosition = $(window).scrollTop();
    }
    scrollTargetPosition -= 20 * delta;
    isScrollDirectionUp = delta > 0;

    if (!scrollInterval) {
        scrollInterval = setInterval(function () {

            var scrollTop = $(window).scrollTop();
            var step = Math.round((scrollTargetPosition - scrollTop) / scrollSpeed);
            if (scrollTop < 0 ||
                scrollTop >= $(window).prop("scrollHeight") - $(window).height() ||
                isScrollDirectionUp && step > -1 ||
                !isScrollDirectionUp && step < 1 ) {
                    clearInterval(scrollInterval);
                    scrollInterval = null;
                    scrollTargetPosition = null;
            }
            else{
                $(window).scrollTop(scrollTop + step );
            }

        }, animationInterval);
    }
}
