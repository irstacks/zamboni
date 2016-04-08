scrapes some nhl stats
runs on __node.js__

Turns [this](./localStore/test-input.html) into [this](./localStore/output-test.json). 

- clone or copy and paste, then
```shell
$ npm install
$ node parseable.js
```

Example url and html hanging out at the top of `parseable.js`. 

Next steps:
- Figure out how to get a lot of sites to scrape. 
- Put the parsed data somewhere better than in json files. __Mongo__ might be an obvious choice since out is already in JSON. 
- :lipstick: Modularize data parsing, among many other ways to make it more better. 