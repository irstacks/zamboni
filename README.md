# Scrape them NHL stats. 
Runs on __node.js__.  Turns [this](./testStorage/test-input.html) into [this](./testStorage/test-output.json). 

Because I don't know how to use [this](http://finzi.psych.upenn.edu/library/nhlscrapr/html/00Index.html). 

### How to do it. 
- clone or copy and paste, then
```shell
$ cd path/to/zamboni
$ npm install
$ node app.js
```

**Oh, you want to run it on the server??** 
```shell
$ cd got/tron/zamboni
$ nohup node app.js > /dev/null 2>&1 &
```

### How to pick what data gets used.
Change the url and/or html hanging out at the top of `app.js`. 
If you use a url instead of html you need to change the `data` method in there too. 

### What's next?
- Figure out how to get a lot of sites to scrape. 
- Put the parsed data somewhere better than in json files. __Mongo__ might be an obvious choice since out is already in JSON. 

