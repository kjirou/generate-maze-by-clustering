# generate-maze-by-clustering

[![npm version](https://badge.fury.io/js/generate-maze-by-clustering.svg)](http://badge.fury.io/js/generate-maze-by-clustering)
[![Build Status](https://travis-ci.org/kjirou/generate-maze-by-clustering.svg?branch=master)](https://travis-ci.org/kjirou/generate-maze-by-clustering)

Generate a maze by clustering algorithm


## Usage
### In Command Line
```bash
npm install -g generate-maze-by-clustering
generate-maze-by-clustering 20 10
#########################################
#       #   # # #   #     # # #   #     #
##### ### # # # # ### ##### # ### ### ###
#   # #   # #   #   #     #         #   #
# # # # # ##### ### # ### # # ##### ### #
# #     #   # #   #     #   #     #     #
# ####### ### # ### ### # ### # ### ### #
#   #     # #     # # # # #   #   # #   #
# # # ### # # ##### # ##### ######### # #
# # # # #   #     #   #   # #   #   # # #
##### # # ##### ### ### # # # ### ### ###
#     #     #         # # #   # #       #
### ### ####### ######### # ### ##### ###
#     #   #   #   #     #     #     # # #
# ### # ### ### # # ############### ### #
# #   #     # # #       # # #   #   #   #
# ### ##### # # ##### # # # # ### ##### #
#   #   #   #   #     #                 #
# ######### # ##### # # ### # ### ### ###
#       #     #     # #   # # #   #     #
#########################################
```

### In JavaScript
```bash
npm install --save generate-maze-by-clustering
```
Or, you can use in browser through the [browserify](https://github.com/substack/node-browserify).

```
var generateMaze = require('generate-maze-by-clustering');

var maze = generateMaze([20, 10]);

console.log(maze.toText());
```


## Algorithm
I referred the following site:
http://apollon.issp.u-tokyo.ac.jp/~watanabe/tips/maze.html

The algorithm is named by "Clustering Method"(クラスタリング法) in this site (and many japanize sites).
However, I don't know whether that's the right name.
