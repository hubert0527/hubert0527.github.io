/**
 * Created by hubert lin2 on 2016/9/7.
 */

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
