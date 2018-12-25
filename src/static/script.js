window.onload = function () {
    //initial board and variables
    var y = window.screen.height * window.devicePixelRatio>=window.screen.width * window.devicePixelRatio?window.screen.width*0.65 * window.devicePixelRatio:window.screen.height*0.65 * window.devicePixelRatio;
    var gamey = Math.floor(y);
    var border = Math.round(gamey/20);
    var between = Math.floor((gamey-2*border)/14);
    var colors=['black','white'];
    var round=0;

    var board = document.getElementById('board');
    var canvas = document.createElement('canvas');
    board.appendChild(canvas);
    canvas.width = gamey;
    canvas.height = gamey;
    canvas.style.backgroundColor = '#D5B092';
    var ext = canvas.getContext("2d");

    for(i=0;i<15;i++){
        ext.moveTo(border+(i*between),border);
        ext.lineTo(border+(i*between),border+(14*between));
        ext.stroke();
        ext.moveTo(border,border+(i*between));
        ext.lineTo(border+(14*between),border+(i*between));
        ext.stroke();
    }

    function converter(x) {
        return (x)*between+border;
    }

    function drawc(x,y){
        ext.beginPath();
        ext.arc(converter(x), converter(y),Math.floor(between/5),0,2*Math.PI);
        ext.fill();
        ext.closePath();
    }

    drawc(7,7);
    drawc(3,3);
    drawc(11,3);
    drawc(3,11);
    drawc(11,11);

    socket = io.connect('http://' + 'localhost' + ':' + '100/socket');
    socket.emit('connect','data');
    socket.on('step', function(info) {
        walk(info.x,info.y);
    });
    var mathboard=[];
    socket.on('init',function (board) {
        mathboard=board;
        console.log(mathboard);
        for(var indexx in mathboard){
            for(var indexy in mathboard[indexx]){
                if(mathboard[indexx][indexy] !=-1){
                    walk(indexx,indexy);
                }
            }
        }
    });
    //initial completed, start llistening to click event

    function drawq(x,y,color){
        ext.beginPath();
        ext.arc(converter(x), converter(y),Math.floor(between/2.2),0,2*Math.PI);
        ext.strokeStyle="black";
        ext.fillStyle=color;
        ext.fill();
        ext.stroke();
        ext.closePath();
    }

    function walk(x,y) {
        drawq(x,y,colors[round]);
        round = (round + 1)%2;
    }

    var rect = canvas.getBoundingClientRect();
    function clickPos(event) {
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        return {x:x-border,y:y-border}
    }

    document.addEventListener('click',function (ev) {
        var position=clickPos(ev);
        abx = Math.round(position.x/between);
        aby = Math.round(position.y/between);
        console.log(mathboard);
        if(abx<15 && aby<15&&mathboard[abx][aby] ==-1){
            console.log(mathboard[abx][aby]);
            var place={x:abx,y:aby};
            socket.emit('go',place)
        }
        console.log(abx,aby)
    });

};
