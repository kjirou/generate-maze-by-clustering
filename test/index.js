var assert = require('assert');
var _ = require('lodash');

var generateMaze = require('../index');


describe('generate-maze-by-clustering', function() {

  it('should be defined', function() {
    assert.strictEqual(typeof generateMaze, 'function');
  });

  it('validate created 3x2 maze formally', function() {
    var maze = generateMaze([3, 2]);
    assert.strictEqual(maze.squares.length, 6);
    assert.strictEqual(maze.walls.length, 29);
    assert.strictEqual(maze.cells.length, 5);
    assert.strictEqual(maze.cells[0].length, 7);
    maze.squares.forEach(function(square) {
      assert.strictEqual(square.clusterId, 0);
    });
  });


  context('multipul patterns', function() {

    function assertExptedMapFormally(expectedMazeText, mazeText) {
      _.range(expectedMazeText.length).forEach(function(i) {
        var expected = expectedMazeText[i];
        var actual = mazeText[i];
        if (expected === '?') return;
        assert.strictEqual(expected, actual, 'mazeText[' + i + '] is not valid');
      });
    }

    function exploreMaze(mazeText, startPos) {

      // convert maze text to 2D array
      var cells = [];
      mazeText.split('\n').forEach(function(line) {
        cells.push(line.split(''));
      });

      var findAroundRoutes = function(pos) {
        var poses = [
          [pos[0] - 1, pos[1]],
          [pos[0], pos[1] + 1],
          [pos[0] + 1, pos[1]],
          [pos[0], pos[1] - 1]
        ];

        return poses.filter(function(p) {
          if (cells[p[0]][p[1]] === ' ') {
            return true;
          } else {
            return false;
          }
        });
      };

      var markPassedRoute = function(pos) {
        cells[pos[0]][pos[1]] = '*';
      };

      var nextPosList = findAroundRoutes(startPos);
      markPassedRoute(startPos);

      while (nextPosList.length > 0) {
        var currentPos = nextPosList.shift();
        markPassedRoute(currentPos);
        findAroundRoutes(currentPos).forEach(function(pos) {
          nextPosList.push(pos);
        });;
      }

      return cells.map(function(line) {
        return line.join('');
      }).join('\n') + '\n';
    }

    it('100 times to 3x2', function() {
      var expectedMazeText =
        '#######\n' +
        '# ? ? #\n' +
        '#?#?#?#\n' +
        '# ? ? #\n' +
        '#######'
      ;
      _.range(100).forEach(function(i) {
        var maze = generateMaze([3, 2]);

        maze.squares.forEach(function(square) {
          assert.strictEqual(square.clusterId, 0);
        });

        var mazeText = maze.toText();
        assertExptedMapFormally(expectedMazeText, mazeText);

        var exploredMazeText = exploreMaze(mazeText, [1, 1]);
        assert(!/ /.test(exploredMazeText));
      });
    });

    it('100 times to 20x20', function() {
      _.range(100).forEach(function(i) {
        var maze = generateMaze([20, 20]);

        maze.squares.forEach(function(square) {
          assert.strictEqual(square.clusterId, 0);
        });

        var mazeText = maze.toText();
        var exploredMazeText = exploreMaze(mazeText, [1, 1]);
        assert(!/ /.test(exploredMazeText));
      });
    });
  });
});
