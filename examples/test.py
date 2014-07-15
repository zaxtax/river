import random
import json


def main():
    total_samples = 10000
    batch_size = 50
    u = []
    n = []
    for i in range(total_samples):
        if (i % batch_size) == 0:
            print json.dumps(dict(total_samples=total_samples,
                                  current_sample=i,
                                  rvars=dict(uniform=u,
                                             normal=n)))
        else:
            u.append(random.random())
            n.append(random.gauss(0, 1))

if __name__ == "__main__":
    main()
