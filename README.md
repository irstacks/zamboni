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
- [ ] Put the parsed data somewhere better than in json files. __Mongo__ might be an obvious choice since out is already in JSON. Or __Postres__ cuz relational seems to fit the model.

- [ ] Handle errors better so to not stop the flow, ie. `Segmentation fault: 11`.

- [ ] Refactor/rebuild app.js w/r/t to knowing now where the games are w/r/t to urls, incrementing more elegantly, perhaps promisifying the callbackery

## Sketching the Relational Schema

```json
Team:
    id: <int> 1,
    name: <string> 'BOSTON BRUINS'
    abbreviation: <string> 'BOS' // always expect this to have length of 3

Player:
    id: <int> 1,
    name: <string> 'STEVEN KAMPFER' // could break up into first and last but probably not necessary

TeamPlayer: 
    id: <int> 1,
    team_id: <int> 1,
    player_id: <int> 1,
    game_id: <int> 1

Jersey: // really? --> yeah, just safer to not rely on this for IDing players outside of a single game
    player_id: <int> 1,
    team_id: <int> 1,
    year: <int> 2015,
    jersey: <int> 3

Game:
    id: <int> 1,
    year_start: <int> 2015,
    year_end: <int> 2016,
    game_num: <int> 2,
    seasonality: <string> 'Pre' || 'Regular' || 'Playoffs',
    team_home_id: <int> 1,
    team_away_id: <int> 2,
    team_home_game_count: <int> 4,
    team_away_game_count: <int> 5,
    team_home_home_game_count: <int> 2,
    team_away_away_game_count: <int> 2,
    team_home_score: <int> 0,
    team_away_score: <int> 1,
    was_tie: <boolean> false,
    was_shootout: <boolean> false,
    winner_team_id: <int> 2, (|| <null>)
    loser_team_id: <int> 1, (|| <null>)
    date_human: <string> 'Sunday, September 20, 2015',
    date_unix: <int> 1240939242342,
    asses: 'Attendance 15,432 at Bridgestone Arena', // could probably parse this
    clocks: 'Start 3:38 CDT; End 6:02 CDT'

GameEvent:
    id: <int> 1,
    game_id: <int> 1,
    game_index: <int> 1,
    period: <int> 1,
    str: <string> 'EV' (|| <null>), // this will either be EV, SH, PP, (even strength, shorthanded, power play)
    event_kind: <string> 'PSTR',
    description: <string> 'MIN won Neu. Zone - MIN #3 COYLE vs WPG #55 SCHEIFELE', // will ~~need~~ want to extract more quantitative information about the event -- which positive/negative outcome for each team, players highlighted, location on ice
    time_elapsed: <int> 24, // in seconds
    time_remaining: <int> 47342 // in seconds

PlayerEvent:
    event_id: <int> 1,
    player_id: <int> 1,
    team_id: <int> 1,
    position: <string> 'Center'
```

----

### Wiring up Postgres

```
ia@mh:~/dev/zamboni (relational-pg *%) $ psql
psql: FATAL:  database "ia" does not exist
ia@mh:~/dev/zamboni (relational-pg *%) $ psql -d postgres -U postgres -h localhost
psql: FATAL:  role "postgres" does not exist
ia@mh:~/dev/zamboni (relational-pg *%) $ createdb
ia@mh:~/dev/zamboni (relational-pg *%) $ psql -h localhost
psql (9.5.1)
Type "help" for help.

ia=# \du
                                   List of roles
 Role name |                         Attributes                         | Member of 
-----------+------------------------------------------------------------+-----------
 ia        | Superuser, Create role, Create DB, Replication, Bypass RLS | {}

ia=# CREATE USER zamboni WITH PASSWORD 'zamboni';
CREATE ROLE
ia=# GRANT ALL PRIVILEGES ON DATABASE "zamboni_test" to zamboni;
ERROR:  database "zamboni_test" does not exist
ia=# \q
ia@mh:~/dev/zamboni (relational-pg *%) $ node database.js 
{ name: undefined,
  pgErr: 
   { [error: permission denied to create database]
     name: 'error',
     length: 86,
     severity: 'ERROR',
     code: '42501',
     detail: undefined,
     hint: undefined,
     position: undefined,
     internalPosition: undefined,
     internalQuery: undefined,
     where: undefined,
     schema: undefined,
     table: undefined,
     column: undefined,
     dataType: undefined,
     constraint: undefined,
     file: 'dbcommands.c',
     line: '298',
     routine: 'createdb' } }
ia@mh:~/dev/zamboni (relational-pg *%) $ psql
psql (9.5.1)
Type "help" for help.

ia=# ALTER USER zamboni CREATEDB;
ALTER ROLE
ia=# \q
ia@mh:~/dev/zamboni (relational-pg *%) $ 
```
