var Promise = require('bluebird');

function immediate() {
    return new Promise(function(resolve) {
        setImmediate(resolve);
    });
}

(function loop(value) {
    return immediate().then(function() {
      if (value % 10000 === 0) {
        console.log(process.memoryUsage().heapUsed, value);
      }
      return value + 1;
    }).then(loop);
})(0);
