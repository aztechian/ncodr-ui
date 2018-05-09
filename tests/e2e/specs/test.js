// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': (browser) => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL)
      .waitForElementVisible('#ncodr', 5000)
      .assert.elementPresent('.navigation-drawer>.list')
      .assert.containsText('div', 'Ncodr')
      .assert.elementCount('nav', 1)
      .end();
  },
};
