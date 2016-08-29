// some styles cannot load directly through css (or, will be ugly on page load)
$(document).ready(function () {
    var i = setInterval(function () {
        clearInterval(i);
        $('.navItem').css({'transition-delay': '.05s','transition-duration': '.4s'});
    },100);
});