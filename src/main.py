from flask import Flask
from flask import send_file
from flask import redirect
from flask import request

from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop


app = Flask(__name__)


@app.route('/<path:path>')
def statics(path):
    try:
        return send_file("static/"+path)
    except IOError:
        try:
            return send_file("static/"+path+".html")
        except IOError:
            return redirect("/404")


#develop server
'''app.run(
    port=80,
    debug=True
)'''

def main():
    try:
        http_server = HTTPServer(WSGIContainer(app))
        http_server.listen(5000)
        IOLoop.instance().start()
    except Exception:
        main()
        print("restart!")

main()