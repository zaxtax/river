# River: A visualization frontend for MCMC samplers

The visualization relies on some python libraries.
Install them with

    sudo pip install Flask Flask-Sockets Gunicorn

Run the server with

    gunicorn -k flask_sockets.worker server:app

or if you need more options

    gunicorn -k flask_sockets.worker server:app --bind 0.0.0.0:8000 --timeout 120 --log-level debug
 
`server.py` is a repeater that reads from a websocket. You can create samples using any system.
As an example to create samples with pymc 3 and [wssh](https://github.com/progrium/wssh)

    python model_lasso.py | wssh localhost:8000/sampler_input

Then open the client.html in a web browser
