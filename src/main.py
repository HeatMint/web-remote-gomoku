from flask import Flask
from flask import send_file
from flask import redirect
from flask import request

from flask_socketio import SocketIO
from flask_socketio import send, emit


app = Flask(__name__)
socketio = SocketIO(app)


users=[]

@app.route('/<path:path>')
def statics(path):
    try:
        return send_file("static/"+path)
    except IOError:
        try:
            return send_file("static/"+path+".html")
        except IOError:
            return redirect("/404")


def ack():
    print "sucess"


@socketio.on('connect')
def connect():
    sid = request.sid
    users.append(sid)
    emit('sid',sid)
    print(users)


@socketio.on('disconnect')
def disconnect():
    users.remove(request.sid)
    print(users)


@socketio.on('go')
def go(place):
    print(place)
    print(place['x'],place['y'])
    for i in users:
        emit('step',place,room=i)


socketio.run(app)
