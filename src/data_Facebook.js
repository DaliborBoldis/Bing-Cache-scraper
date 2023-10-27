// Declares the FacebookData class
class FacebookData {
  constructor(page) {
    this.page = page;
  }

  /**
   * Retrieves the URL of the Facebook page.
   * Returns a string containing the URL if found, or a string indicating that the URL was not found.
   */
  async getPageUrl() {
    try {
      return await this.page.$eval(".b_vPanel a", (el) => el.getAttribute("href"));
    } catch (error) {
      return "Page URL not found.";
    }
  }

  /**
   * Retrieves the meta title of the Facebook page.
   * Returns a string containing the title if found, or a string indicating that the title was not found.
   */
  async getMetaTitle() {
    try {
      return await this.page.$eval('meta[property="og:title"]', (el) => el.getAttribute("content"));
    } catch (error) {
      return "Page title not found.";
    }
  }

  /**
   * Retrieves the meta description of the Facebook page.
   * Returns a string containing the description if found, or a string indicating that the description was not found.
   */
  async getMetaDescription() {
    try {
      return await this.page.$eval('meta[property="og:description"]', (el) => el.getAttribute("content"));
    } catch (error) {
      return "Page description not found.";
    }
  }

  /**
   * Retrieves the JSON-LD data of the Facebook page.
   * Returns an array containing the JSON objects if found, or null if the data was not found.
   */
  async getLdJson() {
    return await this.page.$$eval('script[type="application/ld+json"]', (els) => els.map((el) => JSON.parse(el.textContent)));
  }

  /**
   * Retrieves the breadcrumb list from the JSON-LD data of the Facebook page.
   * Returns a string containing the tags if found, or a string indicating that the tags were not found.
   */
  getBreadcrumbList(json) {
    try {
      return json.itemListElement.map((item) => item.name).join(", ");
    } catch (error) {
      return "Page tags not found.";
    }
  }

  /**
   * Retrieves the 'sameAs' value from the JSON-LD data of the Facebook page.
   * Returns a string containing the website URL if found, or null if the 'sameAs' value was not found.
   */
  getSameAsWebsite(json) {
    try {
      return json.author?.sameAs !== "<<not-applicable>>" ? json.author.sameAs : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Retrieves the lazy-loaded script data of the Facebook page.
   * Returns a string containing the script data if found, or null if the script was not found.
   */
  async getLazyScript() {
    try {
      const [script] = await this.page.$x('//script[contains(., "TILE_URL_TEMPLATE_")]');
      const lazyScript = await this.page.evaluate((el) => el.innerHTML, script);
      return lazyScript;
    } catch (error) {
      try {
        const [script] = await this.page.$x('//script[contains(., "page_about_fields")]');
        const lazyScript = await this.page.evaluate((el) => el.innerHTML, script);
        return lazyScript;
      } catch (error) {
        return null;
      }
    }
  }

  /**
   * Parses the lazy-loaded script data of the Facebook page to extract relevant information.
   * Returns an array containing the extracted data if found, or null if the data could not be extracted.
   */
  parseLazyScriptData(str) {
    try {
      const regexp = /"text":"([^"]*)"/g;
      const matches = [...str.matchAll(regexp)];
      const result = matches.map((match) => this.unicodeToChar(match[1]));

      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * This function extracts unique emails from a string using regex.
   * @param {*} string The string to extract emails from.
   * @returns An array of unique emails.
   */
  extractUniqueEmails(string) {
    try {
      const emailRegex = /[\w.-]+@[\w-]+\.[\w.-]+/g;
      const emails = string.match(emailRegex);

      return [...new Set(emails)];
    } catch (error) {
      return null;
    }
  }

  /**
Converts Unicode characters to their corresponding characters.
Returns a string containing the converted text.
*/
  unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi, (match) => String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16)));
  }
}

module.exports = FacebookData;
