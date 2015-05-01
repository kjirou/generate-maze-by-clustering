# generate-maze-by-clustering

[![npm version](https://badge.fury.io/js/generate-maze-by-clustering.svg)](http://badge.fury.io/js/generate-maze-by-clustering)
[![Build Status](https://travis-ci.org/kjirou/generate-maze-by-clustering.svg?branch=master)](https://travis-ci.org/kjirou/generate-maze-by-clustering)

Generate a maze by clustering algorithm


## Usage
### CLI
```bash
$generate-maze-by-clustering 5 4
###########
#   #   # #
# ### ### #
#         #
######### #
# # # #   #
# # # # ###
#         #
###########
```

### JavaScript API
```
var generateMaze = require('generate-maze-by-clustering');

var maze = generateMaze([5, 4]);

console.log(maze.toText());
```
