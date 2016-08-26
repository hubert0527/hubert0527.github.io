
var tempServerUrl;

var socketInst;
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
    this.serverUrl = settings['url'];
    this.style = settings['style'];

    var url = this.serverUrl ? this.serverUrl : this.ip + ':' + this.port;

    createSocket(url);

    // insert simple html layout for context
    // use callback cuz loading items is asynchronized
    prepareContextLayout(ctx,settings,function () {
        // add controls to the items in context, like buttons or something else

        createWidgetFunction();

        $('#getBtn').click(function () {
            // doGet(url);
        });

    });

}

function createSocket(url) {

    console.log('create socket: ws://'+url);

    socketInst = new WebSocket("ws://"+url);

    socketInst.onerror = function(e) {
        socketInst = null;
        console.log('create socket FAIL!');
        $('#serverResponse').text('ERROR, server unreachable!');
    };

    socketInst.onmessage = function(e) {
        $('#serverResponse').text(e.data);
        console.log('server respond: ' + e.data);
    };

    socketInst.onopen = function() {
        console.log("create socket SUCCESS! Send 'Hello, world!' ");
        socketInst.send("Hello, world!");
    };
}

/**
 * This project will cause 'cross-origin' problem, more info:
 * http://jimmy319.blogspot.tw/2013/09/javascript-xhr-cross-domain-request-is.html
 * http://www.wengweitao.com/corskua-yu-zi-yuan-gong-xiang-cross-origin-resource-sharing.html
 */
function doGet(url) {
    $.ajax({
        url: 'http://'+url,
        success: function (data) {
            console.log('receive ' + data.toString());
        },
        dataType: 'text'
    });

    // var req = new XMLHttpRequest();
    // req.open('GET', 'http://'+url+'/hello/', true);
    // req.onreadystatechange = function (data) {
    //     console.log('receive ' + data.toString());
    // };
    // req.send();
}

/**
 * Insert layout for context object
 */
function prepareContextLayout(ctx,settings,callback) {

    $.get( "./ChatRoomPackage/ChatRoom.html", function( data ) {
        ctx.innerHTML = data;
        loadScriptsForChatRoomHtml(settings);
        if(callback) callback();
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
 * create functionality for widgets in chat room
 */
function createWidgetFunction() {
    createServerSettingWidget();
    createSendingMessageWidget();
}

function createServerSettingWidget() {
    $('#serverSettingButton').click(function () {
        tempServerUrl = $('#serverInput').val();
        reconnect(tempServerUrl);
    });
    $('#serverInput').keyup(function (k) {
        if(k.keyCode==13){
            tempServerUrl = $('#serverInput').val();
            reconnect(tempServerUrl);
        }
    });
}

function createSendingMessageWidget() {
    $('#submitMessageButton').click(function () {
        sendMessage();
    });
    $('#messageInput').keyup(function (k) {
        if(k.keyCode==13){
            sendMessage();
        }
    });
}

function sendMessage() {
    var str = $('#messageInput').val();
    console.log('send ' + str + ' to server!');
    if(str && socketInst){
        $('#serverResponse').text('sending: '+str + ' ...');
        socketInst.send(str);
    }
}

function reconnect(target) {
    if(socketInst) socketInst.close();
    createSocket(target);
}

/**
 * Simple toString method for debugging
 *
 * @returns {string}
 */
ChatRoom.prototype.toString = function toString() {
    return this.ip + ':' + this.port + ' ' + this.style;
};