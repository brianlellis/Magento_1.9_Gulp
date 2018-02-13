const assert = require('assert');

describe('fixture', () => {
  it('returns a status 200', () => {
    browser.url('/');
    assert.equal(browser.status().state, 'success');
  });
});

describe('fixture', () => {
  it('has the expected page title', () => {
    browser.url('/');
    assert.equal(browser.getTitle(), 'Gorilla | Category Landing Page');
  });
});