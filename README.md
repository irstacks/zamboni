# Scrape them NHL stats. 
Runs on __node.js__.  Turns [this](http://www.nhl.com/scores/htmlreports/20152016/PL010003.HTM) into [this](./dataOut/20152016/010003.json). 

Because I don't know how to use [this](http://finzi.psych.upenn.edu/library/nhlscrapr/html/00Index.html). 

## How to do it. 

Note that the `outData/` comes along with the repo, and that `./leftoff.json` keeps track of the last scraped (or tried-to-scrape) game. When you run `node app.js`, you'll pick up wherever the repository's data ends and just keep on growing it. 

**Fire er up local!**
```shell
$ cd path/to/zamboni
$ npm install
$ node app.js
```

**Oh, you want to run it on _the server_??** 
```shell
$ cd ~/got/tron/zamboni
$ nohup node app.js > /dev/null 2>&1 &
# The damn communists will probably kill your process after about 5 games. 
```

### How to pick what data gets used.
Change the url and/or html hanging out at the top of `app.js`. 
If you use a url instead of html you need to change the `data` method in there too. 

### What's next?
- Put the parsed data somewhere better than in json files. __Mongo__ might be an obvious choice since out is already in JSON. Or __Postres__ cuz relational seems to fit the model. 
- Handle errors better so to not stop the flow, ie. `Segmentation fault: 11`. 