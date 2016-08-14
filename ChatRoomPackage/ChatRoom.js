/**
 * Created by hubert lin2 on 2016/8/14.
 */

/**
 * the starter of client js
 *
 * @param ctx
 *      context
 * @param settings
 *      user customize settings
 * @constructor
 */
function ChatRoom(ctx, settings) {
    this.ip = settings['ip'];
    this.port = settings['port'];
    this.style = settings['style'];

    // insert simple html layout for context
    prepareContextLayout(ctx,settings);

    // add controls to the items in context, like buttons or something else

    // blablabla


}

/**
 * Simple toString method for debugging
 *
 * @returns {string}
 */
ChatRoom.prototype.toString = function toString() {
    return this.ip + ':' + this.port + ' ' + this.style;
};

/**
 * Insert layout for context object
 */
function prepareContextLayout(ctx,settings) {

    // ctx.innerHTML='<object type="text/html" data="./ChatRoomPackage/ChatRoom.html" ></object>';

    // this only works on internet, can't work with 'file://' path
    // the only way to test this locally is use IE (XDDD)
    $.get( "./ChatRoomPackage/ChatRoom.html", function( data ) {
        ctx.innerHTML = data;
    });

    if(settings.style=='classic'){
        $('#ChatRoom').css('bottom','0')
            .css('right','40px');
        createClickOnTopBarPopUpAnimation();
    }

}

function createClickOnTopBarPopUpAnimation() {
    $('#topBar').click(function () {
        var mainBlock = $('#httpTesting');
        if(mainBlock.is(':visible')){
            var wrapper = $('#chatRoomWrapper');
            mainBlock.css('display','block');
            var HH = mainBlock.height();
            wrapper.css('bottom',HH+'px');
            mainBlock.animate({bottom:0},1000);
        }
        else{
            mainBlock.animate({bottom:0},1000,function () {
                mainBlock.css('display','none');
            });
        }
    });
}

