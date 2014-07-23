# River:
## A visualization frontend for MCMC samplers

The visualization relies on some python libraries.
Install them with

    sudo pip install Flask Flask-Sockets Gunicorn

Run the server with

    gunicorn -k flask_sockets.worker server:app

or if you need more options

    gunicorn -k flask_sockets.worker server:app --bind 0.0.0.0:8000 --timeout 120 --log-level debug
 
`server.py` is a repeater that reads from a websocket. You can create samples using any system.
As an example to create samples using [wssh](https://github.com/progrium/wssh)

    python examples/test.py | wssh localhost:8000/sampler_input

Then open the client.html in a web browser

If you have pymc3 installed, try out some of the other examples

## JSON visualization grammar

The frontend accepts JSON with the following format

    format = "{" draw_types* "}"
    draw_types = line | histogram | total | current
    line = "\"linreg\": [" tuple* "]" 
    tuple = "{\"x\":" number "} , {\"y\":" number "}"
    total = "\"total_samples\":" number
    current = "\"current_sample\":" number
    histogram = "\"rvars\": [" vars* "]" 
    vars = string ":" "[" samples "]"
    samples = number*

Expect this grammar to be extended and made more modular
