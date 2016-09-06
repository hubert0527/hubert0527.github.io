/**
 * Created by hubert lin2 on 2016/9/7.
 */

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
