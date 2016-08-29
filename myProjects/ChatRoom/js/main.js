
$(document).ready(function () {
    var ctx = $('#ChatRoom')[0];
    var settings = {
        serverUrl:'intense-waters-75416.herokuapp.com/chat/',
        style: 'default'
    };
    var chatRoom = new ChatRoom(ctx,settings);
});
