window.onload = function () {
    var y = window.screen.height*0.8;
    var gamey = Math.floor(y);
    var border = Math.round(gamey/20);
    var between = Math.floor((gamey-2*border)/14);

    var board = document.getElementById('board');
    var canvas = document.createElement('canvas');
    board.appendChild(canvas);
    canvas.width = gamey;
    canvas.height = gamey;
    canvas.style.backgroundColor = '#D5B092';
    var ext = canvas.getContext("2d");

    for(i=0;i<15;i++){
        ext.moveTo(border+(i*between),border);
        ext.lineTo(border+(i*between),gamey-border);
        ext.stroke();
        ext.moveTo(border,border+(i*between));
        ext.lineTo(gamey-border,border+(i*between));
        ext.stroke();
    }

};