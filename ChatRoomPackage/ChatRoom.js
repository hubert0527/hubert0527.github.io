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
    prepareContextLayout(ctx);

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
function prepareContextLayout(ctx) {
    // the simple layout is in ChatRoom.html, find a way to insert html layout
    // Recommendations:
    //     1. load ChatRoom.html as string and use 'append()' to create layout
    //     2. use append({'tag1','tag2',...}.join()); to create html layout,
    //          but changing layout in future will be painful
    //     3. Find your way
    //
    // IMPORTANT:
    //     1. How to insert CSS rules?
    //     2. Responsive to most browsers

    // ctx.innerHTML = new File('./ChatRoom.html');

    $.get( "./ChatRoomPackage/ChatRoom.html", function( data ) {
        ctx.innerHTML = data;
    });

}

