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
    canvas.setAttribute('onclick','');
    board.appendChild(canvas);
    canvas.width = gamey;
    canvas.height = gamey;
    canvas.style.backgroundColor = '#D5B092';
    var ext = canvas.getContext("2d");

    function converter(x) {
        //function not only used to init
        return (x)*between+border;
    }

    function drawc(x,y){
        //function not only used to init
        ext.beginPath();
        ext.arc(converter(x), converter(y),Math.floor(between/5),0,2*Math.PI);
        ext.fillStyle='#000000';
        ext.fill();
        ext.closePath();
    }

    socket = io.connect('http://' + document.domain + ':' + '100/socket');
    socket.emit('connect','data');

    function reset(){
        socket.emit('reset','');
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
        mathboard[x][y]=round;
        round = (round + 1)%2;
    }

    socket.on('init',function (steps) {
        ext.clearRect(0,0,gamey,gamey);
        console.log('reseeeet!!!');

        for(i=0;i<15;i++){
            ext.moveTo(border+(i*between),border);
            ext.lineTo(border+(i*between),border+(14*between));
            ext.stroke();
            ext.moveTo(border,border+(i*between));
            ext.lineTo(border+(14*between),border+(i*between));
            ext.stroke();
        }
        drawc(7,7);
        drawc(3,3);
        drawc(11,3);
        drawc(3,11);
        drawc(11,11);
        stepbystep=steps[0];
        mathboard=steps[1];
        console.log(mathboard);
        console.log(stepbystep);
        for(var index in stepbystep){
            walk(stepbystep[index][0],stepbystep[index][1]);
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

    function draw_over(x,y){
        var x=converter(x);
        var y=converter(y);
        var half_bet=between/2;
        ext.clearRect(x-half_bet,y-half_bet,between,between);
        ext.beginPath();
        ext.strokeStyle='#000000';
        for (var i = 0; i < 3; i++) {
            //this loop seems unreasonable but if you try to delete it
            //you will see what will happen
            ext.moveTo(x-half_bet,y);
            ext.lineTo(x+half_bet,y);
            ext.stroke();
            ext.moveTo(x,y-half_bet);
            ext.lineTo(x,y+half_bet);
            ext.stroke();
        }
        drawc(7,7);
        drawc(3,3);
        drawc(11,3);
        drawc(3,11);
        drawc(11,11);
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

    document.addEventListener('ontouchstart',function (ev) {
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
