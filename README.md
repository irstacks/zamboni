# Scrape them NHL stats. 
Runs on __node.js__.  Turns [this](./localStore/test-input.html) into [this](./localStore/test-output.json). 


### How to do it. 
- clone or copy and paste, then
```shell
$ cd where/it/is
$ npm install
$ node app.js
```

Example url and html hanging out at the top of `parseable.js`. 

Next steps:
- Figure out how to get a lot of sites to scrape. 
- Put the parsed data somewhere better than in json files. __Mongo__ might be an obvious choice since out is already in JSON. 