"""
Repeater server
===============

Reads samples from a file and sends them over
a WebSocket
"""

from flask import Flask
from flask_sockets import Sockets
import gevent
import gevent.queue

app = Flask(__name__)
sockets = Sockets(app)

sample_queue = gevent.queue.Queue()


@sockets.route('/echo')
def echo_socket(ws):
    while True:
        message = ws.receive()
        ws.send(message)


@app.route('/')
def main():
    return 'Welcome to the sampling server'


@sockets.route('/sampler_input')
def batch_enqueue(ws):
    while ws is not None:
        gevent.sleep(0.01)
        messages = ws.receive()

        if messages:
            for msg in messages.split():
                sample_queue.put(msg)


@sockets.route('/sampler_output')
def batch_dequeue(ws):
    while ws is not None:
        gevent.sleep(0.01)

        if not sample_queue.empty():
            sample = sample_queue.get()
            while sample[-1] != "}":
                sample += sample_queue.get()

            ws.send(sample)
