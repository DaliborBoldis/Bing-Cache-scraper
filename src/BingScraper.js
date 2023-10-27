const puppeteer = require("puppeteer");

/**
 * A class for scraping Bing search results for cache links.
 */
class BingScraper {
  /**
   * Constructs a new BingScraper object.
   */
  constructor() {
    this.browser = null;
  }

  /**
  Initiates a new browser instance with puppeteer, and changes settings in bing settings to include maximum number of results per page 
  */
  async init() {
    // Launch a new instance of Puppeteer
    this.browser = await puppeteer.launch();

    // Create a new page in the browser
    const page = await this.browser.newPage();

    // Go to the Bing account page
    await page.goto(
      "https://www.bing.com/account?adlt_set=off&enASset=1&enAS=1&rpp=-1&newwndset=1&newsntset=1&newsnt=1&setlang=NO_OP&langall=1&sl%5B%5D=cs&pref_sbmt=1&rdr=1&rdrig=DD0C810ACBFC4D518B480A0A7C0B7A9D&ntb=1"
    );
    // Wait for the search settings panel to load
    await page.waitForSelector(".b_hPanel");

    // Change the search results per page setting to 50
    await page.evaluate(() => {
      const selectElement = document.querySelector("#rpp");
      selectElement.innerHTML = `
          <option value="-1">Auto</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="50" selected>50</option>`;
    });

    // Disable SafeSearch
    await page.evaluate(() => {
      const safeSearchElement = document.querySelector(".b_vPanel");
      safeSearchElement.innerHTML =
        '<div class="b_vPanel"><div> <input type="radio" id="aaaaaadlt_set_strict" name="adlt_set" value="strict"> <label class="ctl_labels after" for="adlt_set_strict">Strict<span class="clbl_secondary">Filter out adult text, images, and videos from your search results</span></label></div><div> <input type="radio" id="adlt_set_moderate" name="adlt_set" value="demote"> <label class="ctl_labels after" for="adlt_set_moderate">Moderate<span class="clbl_secondary">Filter adult images and videos but not text from your search results</span></label></div><div> <input type="radio" id="adlt_set_off" name="adlt_set" checked="checked" value="off"> <label class="ctl_labels after" for="adlt_set_off">Off<span class="clbl_secondary">Don\'t filter adult content from your search results</span></label></div><div><div class="sml" id="expitem_1152840587_1" data-appns="SERP" data-k="5000.1" data-expl=""><a id="expitem_1152840587_1_hit" class="b_mopexpref" href="javascript:void(0);" role="button" aria-expanded="false" aria-describedby="expansionAccessibilityTextexpitem_1152840587_1_hit">Still seeing inappropriate content?<img role="presentation" class="ciplr vam rms_img" width="10" height="7" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHBAMAAADDgsFQAAAAElBMVEX///8QINAQINAQINAQINAQINCEqDprAAAABXRSTlMAESIzZkG9BZgAAAAtSURBVAgdY3BVYGAOYQgNYjANZVANVQYymEJDQxUYgJwgBgYgB8hkYBBkYAAAjZEFp9arzeUAAAAASUVORK5CYII=" data-bm="6"><div class="expansionAccessibilityText" lessalttext="Less content will be shown above the current area of focus upon selection" morealttext="New content will be added above the current area of focus upon selection" id="expansionAccessibilityTextexpitem_1152840587_1_hit">New content will be added above the current area of focus upon selection</div></a><div class="b_hide" data-exp-noani="">Still seeing inappropriate content?<img role="presentation" class="ciplr vam rms_img" width="10" height="7" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHBAMAAADDgsFQAAAAFVBMVEX///8QINAQINAQINAQINAQINAQINBJFl3yAAAABnRSTlMAESIzRHdFROtBAAAALUlEQVQIHWNgYEwTYGBgEEtLZAAy04AcsTQTICctmcEtjSHMgIEllYEJqEABAI0lBpXZD2dhAAAAAElFTkSuQmCC" data-bm="7"></div></div><div class="b_hide" data-exp-noani="">SafeSearch uses advanced technology to filter adult content, but it won\'t catch everything. If SafeSearch is set to Strict or Moderate and you\'re seeing adult content, <a target="_blank" href="https://www.bing.com/ck/a?!&amp;&amp;p=a1a3cab08d1f7bebJmltdHM9MTY3NzExMDQwMCZpZ3VpZD0zNjgyNmVkNy0wMmQ0LTYxMDYtMDJlYi03ZjFhMDNlNzYwZWMmaW5zaWQ9NTAxNg&amp;ptn=3&amp;hsh=3&amp;fclid=36826ed7-02d4-6106-02eb-7f1a03e760ec&amp;u=a1aHR0cDovL2dvLm1pY3Jvc29mdC5jb20vZndsaW5rP0xpbmtJZD04NTA4NzY&amp;ntb=1" h="ID=SERP,5016.1">tell us about it</a> so we can filter it in the future. You can also learn about <a target="_blank" href="https://www.bing.com/ck/a?!&amp;&amp;p=44df0a4bf4bf87baJmltdHM9MTY3NzExMDQwMCZpZ3VpZD0zNjgyNmVkNy0wMmQ0LTYxMDYtMDJlYi03ZjFhMDNlNzYwZWMmaW5zaWQ9NTAxNQ&amp;ptn=3&amp;hsh=3&amp;fclid=36826ed7-02d4-6106-02eb-7f1a03e760ec&amp;u=a1aHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3Byb3RlY3QvZGVmYXVsdC5hc3B4&amp;ntb=1" h="ID=SERP,5015.1">services and products from Microsoft to help you stay safe online</a>.</div></div></div>';
    });

    // Click the Save button to apply changes
    await page.click("#sv_btn");

    // Wait for the search results to load
    await page.waitForSelector(".b_respl");
  }

  /**
Scrapes search results from Bing and returns an array of cache links for the given URL and encoded keyword.
@param {string} url - The URL to scrape search results from.
@param {string} encodedKeyword - The encoded keyword to use for the cache links.
@returns {Promise<Array<string>>} - A promise that resolves to an array of cache links.
*/
  async scrape(url, encodedKeyword) {
    // Create a new page in the browser
    const page = await this.browser.newPage();

    // Navigate to the given URL
    await page.goto(url);

    // Wait for the search results container to load
    await page.waitForSelector("#b_results");

    // Initialize an empty array to store cache links
    let cacheLinks = [];

    // Log the main page URL and extract cache links from that main page
    console.log(`Main page: ${url}`);
    await extractCacheLinks();

    // Get the hrefs of all the search result pages
    const srPageHrefs = await Promise.all(
      (await page.$$(".b_widePag")).map((pageNumber) => page.evaluate((el) => el.getAttribute("href"), pageNumber))
    );

    // Iterate over the search result pages and extract cache links from each of them
    for (const bingPage of srPageHrefs) {
      if (bingPage && !bingPage.includes("FORM=PORE")) {
        console.log(`Page: ${bingPage}`);
        await page.goto(`https://www.bing.com${bingPage}`);
        await page.waitForSelector("#b_results");
        await extractCacheLinks();
      }
    }

    /**
    Extracts cache links from the current page and adds them to the cacheLinks array.
    */
    async function extractCacheLinks() {
      const elements = await page.$$(".b_attribution");
      for (const element of elements) {
        const citeElement = await element.$("cite");
        const link = await (await citeElement.getProperty("textContent")).jsonValue();
        const uValue = await page.evaluate((el) => el.getAttribute("u"), element);

        // Exclude certain types of links from the cache links array
        if (uValue && !["/biz/", "/people/", "/events/", "/posts/", "/marketplace/"].some((val) => link.includes(val))) {
          const [value1, value2] = uValue.split("|").slice(2, 4);
          const cLink = `https://cc.bingj.com/cache.aspx?${encodedKeyword}%20site%3Afacebook.com%20prefer%3Abusiness%20-biz%20loc%3AUS&d=${value1}&mkt=en-WW&setlang=en-US&w=${value2}`;
          cacheLinks.push(cLink);
        }
      }
    }

    // Close the page and return the cache links array
    await page.close();
    return cacheLinks;
  }

  /**
  Closes the browser.
  */
  async close() {
    await this.browser.close();
  }
}

module.exports = BingScraper;
