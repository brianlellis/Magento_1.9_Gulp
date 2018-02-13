const assert = require('assert');
browser.url('/');
browser.windowHandleSize({width:1900,height:800});

describe('fixture', () => {
  it('Page container is correct size', () => {
    const mainCont = browser.getElementSize('#content','width'); 
    assert.equal( mainCont, 1170);
  });
});

describe('fixture', () => {
  it('Sidebar is correct size', () => {
    const sidebarWidth = browser.getElementSize('//div[@class="sidebar"]','width'); 
    assert.equal( (sidebarWidth >= 230 && sidebarWidth <= 235) ? 233 : 0, 233);
  });
});

describe('fixture', () => {
  it('Product Grid is correct size', () => {
    const prodGrid = browser.getElementSize('#productGrid','width'); 
    assert.equal( (prodGrid >= 868 && prodGrid <= 873) ? 870 : 0, 870);
  });
});

describe('fixture', () => {
  it('Swatches are correct size', () => {
    assert.equal(browser.getElementSize('//li[@class="product"][1]/ul/li[1]','height'), 15);
  });
});

describe('fixture', () => {
  it('Star Ratings are correct width', () => {
    assert.equal(browser.getElementSize('//ul[@id="productGrid"]/li[1]/div[2]','width'), 90);
  });
});

describe('fixture', () => {
  it('Newsletter is correct size', () => {
    const newsBox = browser.getElementSize('#newsletterInput','width'); 
    assert.equal( (newsBox >= 266 && newsBox <= 270) ? 268 : 0, 268);
  });
});