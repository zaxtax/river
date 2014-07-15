from pymc import Model, Normal
from pymc import iter_sample, Metropolis
import numpy as np
import json

def main():
    # Generate data
    size = 50
    x = np.linspace(2, -2, size)
    true_y = (x-1)*x*(x+1) + np.random.normal(scale=.5, size=size)
    nsamples = 50000

    with Model() as model:
        w0 = Normal('w0')
        w1 = Normal('w1')
        w2 = Normal('w2')
        w3 = Normal('w3')
        Normal('y', mu=w0 + w1*x + w2*(x**2) + w3*(x**3),
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
            rvars = {k: t[k][-50:].tolist()
                     for k in t.varnames}
            print json.dumps(
                {"rvars": rvars,
                 "current_sample": len(t),
                 "total_samples": nsamples}
            )

if __name__ == "__main__":
    main()
