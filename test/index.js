var assert = require('assert');
var _ = require('lodash');

var generateMaze = require('../index');


describe('generate-maze-by-clustering', function() {

  it('should be defined', function() {
    assert.strictEqual(typeof generateMaze, 'function');
  });

  it('basic usage', function() {
    var results = generateMaze([3, 2]);
    assert.strictEqual(results.rawSquares.length, 2);
    assert.strictEqual(results.rawSquares[0].length, 3);
    assert.strictEqual(results.rawWalls.length, 17);
    assert.strictEqual(
      results.rawWalls.filter(function(v) { return v.edgedSquares[0] === null; }).length,
      5
    );
    assert.strictEqual(
      results.rawWalls.filter(function(v) { return v.edgedSquares[1] === null; }).length,
      5
    );

    var clusterIds = results.rawSquares.map(function(line) {
      return line.map(function(square) {
        return square.clusterId;
      }).join(',');
    }).join(',');
    console.log(clusterIds);

    console.log(results.maze.toString());
  });
});
