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

    // BLABLABLA still constructing

}

/**
 * Insert layout for context object
 */
function prepareContextLayout(ctx,settings) {

    $.get( "./ChatRoomPackage/ChatRoom.html", function( data ) {
        ctx.innerHTML = data;
        loadScriptsForChatRoomHtml(settings);
    });

}

/**
 * Add script here for ChatRoom.html here!
 * @param settings
 */
function loadScriptsForChatRoomHtml(settings) {

    // TODO: this would be the default layout if user set nothing
    if(!settings || !settings.style || settings.style=='default'){
        $('#ChatRoom').css('bottom','0')
            .css('right','40px');
        createClickOnTopBarPopUpAnimation();
    }
}

/**
 * Create animation of showing and hiding chat room while clicking on top bar
 */
var mainBlockOriginalHeight;
function createClickOnTopBarPopUpAnimation() {

    var mainBlock = $('#mainContent');
    mainBlockOriginalHeight = mainBlock.height();
    mainBlock.height(0);

    $('#topBar').click(function () {
        if(!mainBlock.is(':visible') || mainBlock.height()==0){
            mainBlock.animate({height:mainBlockOriginalHeight},'fast');
        }
        else{
            mainBlock.animate({height:0},'fast');
        }
    });
}



/**
 * Simple toString method for debugging
 *
 * @returns {string}
 */
ChatRoom.prototype.toString = function toString() {
    return this.ip + ':' + this.port + ' ' + this.style;
};