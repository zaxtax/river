from pymc import Model, Normal
from pymc import iter_sample, Metropolis
import numpy as np
import json


def linreg(w, x):
    y = (w["w0"][-1] +
         w["w1"][-1]*x +
         w["w2"][-1]*x*x +
         w["w3"][-1]*x*x*x +
         w["w4"][-1]*x*x*x*x +
         w["w5"][-1]*x*x*x*x*x)
    return [{"x": x[i],
             "y": y[i]} for i in range(len(x))]


def main():
    # Generate data
    size = 50
    x = np.linspace(2, -2, size)
    true_y = (x-1)*x*(x+1)*(x+2)*(x-2) + np.random.normal(scale=.5, size=size)
    nsamples = 100000

    with Model() as model:
        w0 = Normal('w0')
        w1 = Normal('w1')
        w2 = Normal('w2')
        w3 = Normal('w3')
        w4 = Normal('w4')
        w5 = Normal('w5')
        Normal('y', mu=w0 + w1*x + w2*(x**2) + w3*(x**3) + w4*(x**4) + w5*(x**5),
               tau=0.5**-2,
               shape=(size, 1), observed=true_y)

    with model:
        step = Metropolis(model.vars)
        trace = iter_sample(nsamples, step)

    for i in range(nsamples/100):
        with model:
            for j in range(99):
                trace.next()
            t = trace.next()
            y = linreg(t, x)
            rvars = {k: t[k][-50:].tolist()
                     for k in t.varnames}
            print json.dumps(
                {#"rvars": rvars,
                 "linreg": y,
                 "current_sample": len(t),
                 "total_samples": nsamples,
                }
            )

if __name__ == "__main__":
    main()
