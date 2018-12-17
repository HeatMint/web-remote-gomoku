window.onload = function () {

    var y = window.screen.height>=window.screen.width?window.screen.width*0.8:window.screen.height*0.8;
    var gamey = Math.floor(y);
    var border = Math.round(gamey/20);
    var between = Math.floor((gamey-2*border)/14);

    function converter(x) {
        return (x)*between+border;
    }

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

};
