from pymc import Model, Normal, Exponential, Laplace, LaplaceProposal
from pymc import iter_sample, find_MAP, Metropolis

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
    d = np.random.normal(size=(3, 30))
    d1 = d[0] + 4
    d2 = d[1] + 4
    yd = .2 * d1 + .3 * d2 + d[2]
    nsamples = 50000

    with Model() as model:
        s = Exponential('s', 1)
        m1 = Laplace('m1', 0, 100)
        m2 = Laplace('m2', 0, 100)
        p = d1 * m1 + d2 * m2

        Normal('y', p, s ** -2, observed=yd)

    with model:
        start = find_MAP()
        step1 = Metropolis([m1, m2])
        step2 = Metropolis([s], proposal_dist=LaplaceProposal)

        trace = iter_sample(nsamples, [step1, step2], start)

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
