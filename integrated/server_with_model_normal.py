from pymc import Model, Normal, Uniform
from pymc import find_MAP, NUTS, iter_sample
import numpy as np
import json

from flask import Flask
from flask_sockets import Sockets

app = Flask(__name__)
sockets = Sockets(app)


@sockets.route('/echo')
def echo_socket(ws):
    while True:
        message = ws.receive()
        ws.send(message)


@app.route('/')
def main():
    return 'Welcome to the sampling server'


@sockets.route('/sampler')
def batch_sample(ws):
    n = 20
    data = 2*np.random.normal(size=(1, n)) + 3.0
    nsamples = 50000

    model = Model()
    with model:
        theta = Normal('mean', 0., 1.)
        sg = Uniform('standard_deviation', 0.5, 10, testval=2.)
        Normal('x', theta, sg ** -2, shape=n, observed=data)

        # start sampling at the MAP
        start = find_MAP()
        step = NUTS(scaling=start)

        trace = iter_sample(nsamples, step, start=start)

    for i in range(nsamples/100):
        with model:
            for j in range(99):
                trace.next()
            t = trace.next()
            rvars = {k: t[k][-50:].tolist()
                     for k in t.varnames}
            ws.send(json.dumps(
                {"rvars": rvars,
                 "current_sample": len(t),
                 "total_samples": nsamples}
            ))
