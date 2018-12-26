window.onload = function () {
    //initial board and variables
    var y = window.screen.height * window.devicePixelRatio>=window.screen.width * window.devicePixelRatio?window.screen.width*0.65 * window.devicePixelRatio:window.screen.height*0.65 * window.devicePixelRatio;
    var gamey = Math.floor(y);
    var border = Math.round(gamey/20);
    var between = Math.floor((gamey-2*border)/14);
    var colors=['black','white'];
    var round=0;
    var mathboard=[];
    var stepbystep=[];

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
        //function not nly used to init
        return (x)*between+border;
    }

    function drawc(x,y){
        //function not nly used to init
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

    function reset(){
        socket.emit('reset','')
    }

    var resetdiv=document.getElementById('reset');
    var resetbutton = document.createElement('input');
    resetbutton.type = 'button';
    resetbutton.onclick = reset;
    resetbutton.value='delete';
    resetdiv.appendChild(resetbutton);

    //initial completed

    //socket listener
    socket.on('step', function(info) {
        walk(info.x,info.y);
    });

    function walk(x,y) {
        drawq(x,y,colors[round]);
        round = (round + 1)%2;
    }

    socket.on('init',function (steps) {
        console.log('reseeeet!!!')
        stepbystep=steps[0];
        mathboard=steps[1]
        console.log(mathboard)
        console.log(stepbystep);
        for(var index in stepbystep){
            walk(stepbystep[index][0],stepbystep[index][1])
        }
    });
    //socket listener end

    //graphics
    function drawq(x,y,color){
        ext.beginPath();
        ext.arc(converter(x), converter(y),Math.floor(between/2.2),0,2*Math.PI);
        ext.strokeStyle="black";
        ext.fillStyle=color;
        ext.fill();
        ext.stroke();
        ext.closePath();
    }
    //graphics end


    //clicking event listener
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
    //clicking end

};
