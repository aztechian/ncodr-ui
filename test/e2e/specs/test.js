// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': function test(browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL;

    browser
      .url(devServer)
      .waitForElementVisible('#ncodr', 5000)
      .assert.elementPresent('.navigation-drawer>.list')
      .assert.containsText('div', 'Ncodr')
      .assert.elementCount('nav', 1)
      .end();
  },
};
