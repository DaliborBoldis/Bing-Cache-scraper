/**
Requires the puppeteer and data_Facebook modules and declares the CacheLinksScraper class.
*/
const puppeteer = require("puppeteer");
const data_Facebook = require("./data_Facebook.js");

class CacheLinksScraper {
  constructor() {
    this.browser = null;
  }

  /**
  Initializes the browser.
  */
  async init() {
    this.browser = await puppeteer.launch();
  }

  /**
  Scrapes data from a Facebook page using a given index and link.
  @param {number} index - The index of the cache link in the array.
  @param {string} link - The link to scrape Facebook data from.
  @returns {Promise<object>} - A promise that resolves to an object containing scraped data.
  */
  async scrape(index, link) {
    // Create a new page in the browser
    const fbPage = await this.browser.newPage();

    // Navigate to the given link
    await fbPage.goto(link, { waitUntil: "domcontentloaded" }).catch((err) => {
      return "Cached page for link: " + link + " not accessible. Error: " + err;
    });

    // Instantiate a data_Facebook object to extract data from the Facebook page
    const fbData = new data_Facebook(fbPage);

    // Extract the page URL, meta title, meta description, and ld+json scripts using Promise.all()
    const [pageUrl, metaTitle, metaDescription, ldJsonScripts] = await Promise.all([
      fbData.getPageUrl(),
      fbData.getMetaTitle(),
      fbData.getMetaDescription(),
      fbData.getLdJson(),
    ]);

    // Extract sameAsWebsite, breadcrumbList, and lazyScript using the data_Facebook object's methods
    const [sameAsWebsite, breadcrumbList, lazyScript] = [
      fbData.getSameAsWebsite(ldJsonScripts[0]),
      fbData.getBreadcrumbList(ldJsonScripts[1]),
      await fbData.getLazyScript(),
    ];

    // Extract email, address, and phone using the data_Facebook object's methods
    const requireLazyData = fbData.parseLazyScriptData(lazyScript);

    const findInRequireLazy = (firstPattern, secondPattern) => {
      if (requireLazyData) {
        for (const entry of requireLazyData) {
          if (entry.includes(firstPattern) && entry.includes(secondPattern) && !entry.includes("Review")) {
            const cleanedEntry = entry.replace('"text":"', "").replace('"""', "");
            return cleanedEntry;
          }
        }
      }
      return null;
    };

    // Close the Facebook page and construct the pageData object
    await fbPage.close();

    let pageData = {
      index,
      bingCacheURL: link,
      facebookPageURL: pageUrl,
      pageTitle: metaTitle,
      pageDescription: metaDescription,
      pageTags: breadcrumbList,
      website: sameAsWebsite,
      email: findInRequireLazy("@", "."),
      address: findInRequireLazy("United States,", ","),
      phone: findInRequireLazy("(", "-"),
      web_facebookLinks: [],
      web_instagramLinks: [],
      web_twitterLinks: [],
      web_emailLinks: [],
      web_addressLinks: [],
      web_phoneLinks: [],
      web_errors: [],
    };

    // Use a combination of the Regex match method to extract email addresses and a JavaScript Set to get unique email addresses
    pageData.email = fbData.extractUniqueEmails(pageData.email);

    // If the website is available, navigate to it and extract additional links and data
    if (pageData.website) {
      // Update website URL to include protocol (http) and www subdomain
      const baseUrl = (url) => (url.includes("http") ? url : `http://${url}`);

      pageData.website = baseUrl(pageData.website);

      const webPage = await this.browser.newPage();
      await webPage
        .goto(baseUrl(pageData.website), { waitUntil: "domcontentloaded" })
        .then(async () => {
          // Extract all the initial links on the website
          const initialWebLinks = await webPage.$$eval("a", (a) => a.map((a) => a.href));

          // Filter the links based on keywords and add the base URL to the list
          const filteredWebLinks = initialWebLinks.filter((link) => {
            const keywords = ["contact", "feedback", "request", "about", "touch", "staff", "leadership", "reservation"];
            return keywords.some((keyword) => link.includes(keyword));
          });

          filteredWebLinks.push(baseUrl(pageData.website));

          // Iterate over the filtered links and extract additional links
          for (const link of filteredWebLinks) {
            const webPage = await this.browser.newPage();
            await webPage
              .goto(link, { waitUntil: "domcontentloaded" })
              .then(async () => {
                const pageText = await webPage.$eval("*", (el) => el.innerText);
                let foundEmails = fbData.extractUniqueEmails(pageText);

                for (let index = 0; index < foundEmails.length; index++) {
                  pageData.web_emailLinks.push(foundEmails[index]);
                }

                let webLinks = await webPage.$$eval("a", (a) => a.map((a) => a.href));

                webLinks = [...new Set(webLinks)]; // remove duplicate entries

                // Add each new link to the appropriate array in the pageData object
                for (const webLink of webLinks) {
                  if (
                    pageData.web_facebookLinks.includes(webLink) ||
                    pageData.web_instagramLinks.includes(webLink) ||
                    pageData.web_twitterLinks.includes(webLink) ||
                    pageData.web_emailLinks.includes(webLink) ||
                    pageData.web_phoneLinks.includes(webLink) ||
                    pageData.web_addressLinks.includes(webLink)
                  ) {
                    continue;
                  }

                  if (webLink.includes("facebook.com")) pageData.web_facebookLinks.push(webLink);
                  if (webLink.includes("instagram.com")) pageData.web_instagramLinks.push(webLink);
                  if (webLink.includes("twitter.com")) pageData.web_twitterLinks.push(webLink);
                  if (webLink.includes("mailto:")) {
                    let foundEmails = fbData.extractUniqueEmails(webLink);

                    for (let index = 0; index < foundEmails.length; index++) {
                      pageData.web_emailLinks.push(foundEmails[index]);
                    }
                  }
                  if (webLink.includes("tel:")) pageData.web_phoneLinks.push(webLink.replace("tel:", ""));
                  if (webLink.includes("/maps/") && webLink.includes("google")) pageData.web_addressLinks.push(webLink);
                }
              })
              .catch((err) => {
                pageData.web_errors.push(link + " Not accessible! Error: " + err);
                console.log(link + " Not accessible! Error: " + err);
              });
          }
        })
        .catch((err) => {
          pageData.web_errors.push(pageData.website + " Not accessible! Error: " + err);
          console.log(pageData.website + " Not accessible! Error: " + err);
        });
    }

    // Return the pageData object
    return pageData;
  }

  /**
  Closes the browser.
  */
  async close() {
    await this.browser.close();
  }
}

// Export the CacheLinksScraper class
module.exports = CacheLinksScraper;
