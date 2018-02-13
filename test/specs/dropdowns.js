const assert = require('assert');
browser.url('/');

describe('fixture', () => {
  it('Dropdowns are functional', () => {
  	browser.click('#positionDropdown');
  	browser.pause(100);
  	assert.ok( browser.isVisible('//div[@id="positionDropdown"]//ul[@class="select__list"]') );
  });
});
