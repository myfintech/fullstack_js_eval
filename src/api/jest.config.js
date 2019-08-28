const { join } = require('path')

const TEST_DIR = join(__dirname, 'tests')
const SETUP_DIR = join(TEST_DIR, 'setup')

module.exports = {
  verbose: true,
  // bail: 1, // exit after a single failed test
  // roots: [TEST_DIR],
  globalSetup: join(SETUP_DIR, 'setup.js'),
  globalTeardown: join(SETUP_DIR, 'teardown.js')
}
