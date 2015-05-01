# generate-maze-by-clustering

[![npm version](https://badge.fury.io/js/generate-maze-by-clustering.svg)](http://badge.fury.io/js/generate-maze-by-clustering)
[![Build Status](https://travis-ci.org/kjirou/generate-maze-by-clustering.svg?branch=master)](https://travis-ci.org/kjirou/generate-maze-by-clustering)

Generate a maze by clustering algorithm


## Usage
### In Command Line
```bash
npm install -g generate-maze-by-clustering
generate-maze-by-clustering 5 4
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

### In JavaScript
```bash
npm install --save generate-maze-by-clustering
```
Or, you can use in browser through the [browserify](https://github.com/substack/node-browserify).

```
var generateMaze = require('generate-maze-by-clustering');

var maze = generateMaze([5, 4]);

console.log(maze.toText());
```
