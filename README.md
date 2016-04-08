# Scrape them NHL stats. 
Runs on __node.js__.  Turns [this](./localStore/test-input.html) into [this](./localStore/test-output.json). 

Because [this](http://finzi.psych.upenn.edu/library/nhlscrapr/html/00Index.html) isn't cutting it. 

### How to do it. 
- clone or copy and paste, then
```shell
$ cd where/it/is
$ npm install
$ node app.js
```

### How to pick what data gets used.
Change the url and/or html hanging out at the top of `app.js`. 
If you use a url instead of html you need to change the `data` method in there too. 

### What's next?
- Figure out how to get a lot of sites to scrape. 
- Put the parsed data somewhere better than in json files. __Mongo__ might be an obvious choice since out is already in JSON. 

