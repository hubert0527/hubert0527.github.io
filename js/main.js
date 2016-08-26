
$(document).ready(function () {
    var ctx = $('#ChatRoom')[0];
    var settings = {
        ip: '1.2.3.4',
        port: '1234',
        url:'intense-waters-75416.herokuapp.com/chat/',
        style: 'default'
    };
    var chatRoom = new ChatRoom(ctx,settings);
});
