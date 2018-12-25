from flask import Flask
from flask import send_file
from flask import redirect
from flask import request

from flask_socketio import SocketIO
from flask_socketio import send, emit


app = Flask(__name__)
socketio = SocketIO(app)
color=0

users=[]
row=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
board=[]
from copy import deepcopy
for i in xrange(0,15):
    board.append(deepcopy(row))
print(len(board))


@app.route('/')
def index():
    return send_file("static/index.html")


@socketio.on('connect',namespace='/socket')
def connect():
    sid = request.sid
    users.append(sid)
    emit('sid',sid)
    emit('init',board)
    print board
    print(users)


@socketio.on('disconnect',namespace='/socket')
def disconnect():
    users.remove(request.sid)
    print(users)


@socketio.on('go',namespace='/socket')
def go(place):
    global color
    print(place)
    x=place['x']
    y=place['y']
    global board
    board[x][y] = color
    color=(color+1)%2
    for i in users:
        emit('step',place,room=i)


@socketio.on('reset',namespace='/socket')
def reset(password):
    row = [-1, -1, -1, -1, -1]
    global board
    board = []
    for i in xrange(0, 15):
        board.append(deepcopy(row))
    emit('init',board)
    print(board)
    print('reset')


@app.route('/<path:path>')
def statics(path):
    try:
        return send_file("static/"+path)
    except IOError:
        try:
            return send_file("static/"+path+".html")
        except IOError:
            pass


def ack():
    print "sucess"


socketio.run(app,port=100)
