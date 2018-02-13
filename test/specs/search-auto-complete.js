const assert = require('assert');
browser.url('/');

describe('fixture', () => {
  it('Search auto complete is functional', () => {
  	browser.setValue('#searchInput','pr');
  	browser.pause(100);
  	assert.ok( browser.isVisible('.autocomplete-suggestions') );
  });
});
