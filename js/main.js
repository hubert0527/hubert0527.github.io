
$(document).ready(function () {
    var ctx = $('#chatRoomDivAtHere')[0];
    var settings = {
        ip: '1.2.3.4',
        port: '1234',
        style: 'classic'
    };
    var chatRoom = new ChatRoom(ctx,settings);

    console.log(chatRoom.toString());
});
