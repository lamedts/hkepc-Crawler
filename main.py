# nohup python {{path}} &
from flask import Flask, Response, jsonify, render_template

import crawler

app = Flask(__name__)

a, b = crawler.main()

@app.route("/")
def index():
    return render_template('index.html', title="hkepc")

@app.route("/crawl")
def crawl():
    a, b = crawler.main()
    return jsonify(rows=b)

@app.route("/api/get")
def getData():
    return jsonify(rows=b)

@app.route("/json")
def jsontest():
    list = [
        {'param': 'foo', 'val': 2},
        {'param': 'bar', 'val': 10}
    ]
    # jsonify will do for us all the work, returning the
    # previous data structure in JSON
    return jsonify(results=list)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
