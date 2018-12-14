" vim-test
let test#javascript#mocha#executable = 'NODE_ENV=test node_modules/.bin/mocha'
let test#javascript#mocha#options = '-r test/setup.test.js'
