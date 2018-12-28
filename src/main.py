from flask import Flask
from flask import send_file
from flask import redirect
from flask import request

from flask_socketio import SocketIO
from flask_socketio import send, emit

app = Flask(__name__)
socketio = SocketIO(app)
color = 0

users = []
row = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
board = []
step_by_step = []
from copy import deepcopy

for i in xrange(0, 15):
    board.append(deepcopy(row))
print(len(board))


# socket start
# connection
@socketio.on('connect', namespace='/socket')
def connect():
    sid = request.sid
    users.append(sid)
    emit('sid', sid)
    emit('init', [step_by_step,board])
    print board
    print(users)


@socketio.on('disconnect', namespace='/socket')
def disconnect():
    users.remove(request.sid)
    print(users)


# connection end

# processor start
@socketio.on('go', namespace='/socket')
def go(place):
    global color
    global step_by_step
    print(place)
    x = place['x']
    y = place['y']
    global board
    board[x][y] = color
    step_by_step.append([x,y])
    print(step_by_step)
    color = (color + 1) % 2
    for i in users:
        emit('step', place, room=i)


@socketio.on('reset', namespace='/socket')
def reset(password):
    row = [-1, -1, -1, -1, -1,-1, -1, -1, -1, -1,-1, -1, -1, -1, -1]
    global board, step_by_step
    step_by_step=[]
    board = []
    for i in xrange(0, 15):
        board.append(deepcopy(row))
    emit('init', [step_by_step,board])
    print(board)
    print('reset')


# processor end


# static files start
@app.route('/')
def index():
    return send_file("static/index.html")


@app.route('/<path:path>')
def statics(path):
    try:
        return send_file("static/" + path)
    except IOError:
        try:
            return send_file("static/" + path + ".html")
        except IOError:
            pass


socketio.run(app, port=100, host='0.0.0.0')
