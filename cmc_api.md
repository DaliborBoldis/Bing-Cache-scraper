CoinMarketCap-logoCoinMarketCapDevelopers
API DOCUMENTATION
PRICING
FAQ
Search
INTRODUCTION
QUICK START GUIDE
AUTHENTICATION
ENDPOINT OVERVIEW
STANDARDS AND CONVENTIONS
ERRORS AND RATE LIMITS
BEST PRACTICES
VERSION HISTORY
CRYPTOCURRENCY
FIAT
EXCHANGE
GLOBAL-METRICS
TOOLS
BLOCKCHAIN
CONTENT
COMMUNITY
KEY
DEPRECATED
Content Latest
Community Trending Tokens
Community Trending Topics
Content Post Comments
Content Latest Posts
Content Top Posts
Introduction
The CoinMarketCap API is a suite of high-performance RESTful JSON endpoints that are specifically designed to meet the mission-critical demands of application developers, data scientists, and enterprise business platforms.

This API reference includes all technical documentation developers need to integrate third-party applications and platforms. Additional answers to common questions can be found in the CoinMarketCap API FAQ.

Quick Start Guide
For developers eager to hit the ground running with the CoinMarketCap API here are a few quick steps to make your first call with the API.

Sign up for a free Developer Portal account. You can sign up at pro.coinmarketcap.com - This is our live production environment with the latest market data. Select the free Basic plan if it meets your needs or upgrade to a paid tier.
Copy your API Key. Once you sign up you'll land on your Developer Portal account dashboard. Copy your API from the API Key box in the top left panel.
Make a test call using your key. You may use the code examples provided below to make a test call with your programming language of choice. This example fetches all active cryptocurrencies by market cap and return market values in USD.
Be sure to replace the API Key in sample code with your own and use API domain pro-api.coinmarketcap.com or use the test API Key b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c for sandbox-api.coinmarketcap.com testing with our sandbox environment. Please note that our sandbox api has mock data and should not be used in your application.
Postman Collection To help with development, we provide a fully featured postman collection that you can import and use immediately! Read more here.
Implement your application. Now that you've confirmed your API Key is working, get familiar with the API by reading the rest of this API Reference and commence building your application!
Note: Making HTTP requests on the client side with Javascript is currently prohibited through CORS configuration. This is to protect your API Key which should not be visible to users of your application so your API Key is not stolen. Secure your API Key by routing calls through your own backend service.

View Quick Start Code Examples
cURL command line

curl -H "X-CMC_PRO_API_KEY: b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c" -H "Accept: application/json" -d "start=1&limit=5000&convert=USD" -G https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest

Node.js
Python
PHP
Java
C#
Go
Authentication
Acquiring an API Key
All HTTP requests made against the CoinMarketCap API must be validated with an API Key. If you don't have an API Key yet visit the API Developer Portal to register for one.

Using Your API Key
You may use any server side programming language that can make HTTP requests to target the CoinMarketCap API. All requests should target domain https://pro-api.coinmarketcap.com.

You can supply your API Key in REST API calls in one of two ways:

Preferred method: Via a custom header named X-CMC_PRO_API_KEY
Convenience method: Via a query string parameter named CMC_PRO_API_KEY
Security Warning: It's important to secure your API Key against public access. The custom header option is strongly recommended over the querystring option for passing your API Key in a production environment.

API Key Usage Credits
Most API plans include a daily and monthly limit or "hard cap" to the number of data calls that can be made. This usage is tracked as API "call credits" which are incremented 1:1 against successful (HTTP Status 200) data calls made with your key with these exceptions:

Account management endpoints, usage stats endpoints, and error responses are not included in this limit.
Paginated endpoints: List-based endpoints track an additional call credit for every 100 data points returned (rounded up) beyond our 100 data point defaults. Our lightweight /map endpoints are not included in this limit and always count as 1 credit. See individual endpoint documentation for more details.
Bundled API calls: Many endpoints support resource and currency conversion bundling. Bundled resources are also tracked as 1 call credit for every 100 resources returned (rounded up). Optional currency conversion bundling using the convert parameter also increment an additional API call credit for every conversion requested beyond the first.
You can log in to the Developer Portal to view live stats on your API Key usage and limits including the number of credits used for each call. You can also find call credit usage in the JSON response for each API call. See the status object for details. You may also use the /key/info endpoint to quickly review your usage and when daily/monthly credits reset directly from the API.

Note: "day" and "month" credit usage periods are defined relative to your API subscription. For example, if your monthly subscription started on the 5th at 5:30am, this billing anchor is also when your monthly credits refresh each month. The free Basic tier resets each day at UTC midnight and each calendar month at UTC midnight.

Endpoint Overview
The CoinMarketCap API is divided into 8 top-level categories
Endpoint Category	Description
/cryptocurrency/*	Endpoints that return data around cryptocurrencies such as ordered cryptocurrency lists or price and volume data.
/exchange/*	Endpoints that return data around cryptocurrency exchanges such as ordered exchange lists and market pair data.
/global-metrics/*	Endpoints that return aggregate market data such as global market cap and BTC dominance.
/tools/*	Useful utilities such as cryptocurrency and fiat price conversions.
/blockchain/*	Endpoints that return block explorer related data for blockchains.
/fiat/*	Endpoints that return data around fiats currencies including mapping to CMC IDs.
/partners/*	Endpoints for convenient access to 3rd party crypto data.
/key/*	API key administration endpoints to review and manage your usage.
/content/*	Endpoints that return cryptocurrency-related news, headlines, articles, posts, and comments.
Endpoint paths follow a pattern matching the type of data provided
Endpoint Path	Endpoint Type	Description
*/latest	Latest Market Data	Latest market ticker quotes and averages for cryptocurrencies and exchanges.
*/historical	Historical Market Data	Intervals of historic market data like OHLCV data or data for use in charting libraries.
*/info	Metadata	Cryptocurrency and exchange metadata like block explorer URLs and logos.
*/map	ID Maps	Utility endpoints to get a map of resources to CoinMarketCap IDs.
Cryptocurrency and exchange endpoints provide 2 different ways of accessing data depending on purpose
Listing endpoints: Flexible paginated */listings/* endpoints allow you to sort and filter lists of data like cryptocurrencies by market cap or exchanges by volume.
Item endpoints: Convenient ID-based resource endpoints like */quotes/* and */market-pairs/* allow you to bundle several IDs; for example, this allows you to get latest market quotes for a specific set of cryptocurrencies in one call.
Standards and Conventions
Each HTTP request must contain the header Accept: application/json. You should also send an Accept-Encoding: deflate, gzip header to receive data fast and efficiently.

Endpoint Response Payload Format
All endpoints return data in JSON format with the results of your query under data if the call is successful.

A Status object is always included for both successful calls and failures when possible. The Status object always includes the current time on the server when the call was executed as timestamp, the number of API call credits this call utilized as credit_count, and the number of milliseconds it took to process the request as elapsed. Any details about errors encountered can be found under the error_code and error_message. See Errors and Rate Limits for details on errors.

{
  "data" : {
    ...
  },
  "status": {
    "timestamp": "2018-06-06T07:52:27.273Z",
    "error_code": 400,
    "error_message": "Invalid value for \"id\"",
    "elapsed": 0,
    "credit_count": 0
  }
}
Cryptocurrency, Exchange, and Fiat currency identifiers
Cryptocurrencies may be identified in endpoints using either the cryptocurrency's unique CoinMarketCap ID as id (eg. id=1 for Bitcoin) or the cryptocurrency's symbol (eg. symbol=BTC for Bitcoin). For a current list of supported cryptocurrencies use our /cryptocurrency/map call.
Exchanges may be identified in endpoints using either the exchange's unique CoinMarketCap ID as id (eg. id=270 for Binance) or the exchange's web slug (eg. slug=binance for Binance). For a current list of supported exchanges use our /exchange/map call.
All fiat currency options use the standard ISO 8601 currency code (eg. USD for the US Dollar). For a current list of supported fiat currencies use our /fiat/map endpoint. Unless otherwise stated, endpoints with fiat currency options like our convert parameter support these 93 major currency codes:
Currency	Currency Code	CoinMarketCap ID
United States Dollar ($)	USD	2781
Albanian Lek (L)	ALL	3526
Algerian Dinar (د.ج)	DZD	3537
Argentine Peso ($)	ARS	2821
Armenian Dram (֏)	AMD	3527
Australian Dollar ($)	AUD	2782
Azerbaijani Manat (₼)	AZN	3528
Bahraini Dinar (.د.ب)	BHD	3531
Bangladeshi Taka (৳)	BDT	3530
Belarusian Ruble (Br)	BYN	3533
Bermudan Dollar ($)	BMD	3532
Bolivian Boliviano (Bs.)	BOB	2832
Bosnia-Herzegovina Convertible Mark (KM)	BAM	3529
Brazilian Real (R$)	BRL	2783
Bulgarian Lev (лв)	BGN	2814
Cambodian Riel (៛)	KHR	3549
Canadian Dollar ($)	CAD	2784
Chilean Peso ($)	CLP	2786
Chinese Yuan (¥)	CNY	2787
Colombian Peso ($)	COP	2820
Costa Rican Colón (₡)	CRC	3534
Croatian Kuna (kn)	HRK	2815
Cuban Peso ($)	CUP	3535
Czech Koruna (Kč)	CZK	2788
Danish Krone (kr)	DKK	2789
Dominican Peso ($)	DOP	3536
Egyptian Pound (£)	EGP	3538
Euro (€)	EUR	2790
Georgian Lari (₾)	GEL	3539
Ghanaian Cedi (₵)	GHS	3540
Guatemalan Quetzal (Q)	GTQ	3541
Honduran Lempira (L)	HNL	3542
Hong Kong Dollar ($)	HKD	2792
Hungarian Forint (Ft)	HUF	2793
Icelandic Króna (kr)	ISK	2818
Indian Rupee (₹)	INR	2796
Indonesian Rupiah (Rp)	IDR	2794
Iranian Rial (﷼)	IRR	3544
Iraqi Dinar (ع.د)	IQD	3543
Israeli New Shekel (₪)	ILS	2795
Jamaican Dollar ($)	JMD	3545
Japanese Yen (¥)	JPY	2797
Jordanian Dinar (د.ا)	JOD	3546
Kazakhstani Tenge (₸)	KZT	3551
Kenyan Shilling (Sh)	KES	3547
Kuwaiti Dinar (د.ك)	KWD	3550
Kyrgystani Som (с)	KGS	3548
Lebanese Pound (ل.ل)	LBP	3552
Macedonian Denar (ден)	MKD	3556
Malaysian Ringgit (RM)	MYR	2800
Mauritian Rupee (₨)	MUR	2816
Mexican Peso ($)	MXN	2799
Moldovan Leu (L)	MDL	3555
Mongolian Tugrik (₮)	MNT	3558
Moroccan Dirham (د.م.)	MAD	3554
Myanma Kyat (Ks)	MMK	3557
Namibian Dollar ($)	NAD	3559
Nepalese Rupee (₨)	NPR	3561
New Taiwan Dollar (NT$)	TWD	2811
New Zealand Dollar ($)	NZD	2802
Nicaraguan Córdoba (C$)	NIO	3560
Nigerian Naira (₦)	NGN	2819
Norwegian Krone (kr)	NOK	2801
Omani Rial (ر.ع.)	OMR	3562
Pakistani Rupee (₨)	PKR	2804
Panamanian Balboa (B/.)	PAB	3563
Peruvian Sol (S/.)	PEN	2822
Philippine Peso (₱)	PHP	2803
Polish Złoty (zł)	PLN	2805
Pound Sterling (£)	GBP	2791
Qatari Rial (ر.ق)	QAR	3564
Romanian Leu (lei)	RON	2817
Russian Ruble (₽)	RUB	2806
Saudi Riyal (ر.س)	SAR	3566
Serbian Dinar (дин.)	RSD	3565
Singapore Dollar (S$)	SGD	2808
South African Rand (R)	ZAR	2812
South Korean Won (₩)	KRW	2798
South Sudanese Pound (£)	SSP	3567
Sovereign Bolivar (Bs.)	VES	3573
Sri Lankan Rupee (Rs)	LKR	3553
Swedish Krona ( kr)	SEK	2807
Swiss Franc (Fr)	CHF	2785
Thai Baht (฿)	THB	2809
Trinidad and Tobago Dollar ($)	TTD	3569
Tunisian Dinar (د.ت)	TND	3568
Turkish Lira (₺)	TRY	2810
Ugandan Shilling (Sh)	UGX	3570
Ukrainian Hryvnia (₴)	UAH	2824
United Arab Emirates Dirham (د.إ)	AED	2813
Uruguayan Peso ($)	UYU	3571
Uzbekistan Som (so'm)	UZS	3572
Vietnamese Dong (₫)	VND	2823
Along with these four precious metals:

Precious Metal	Currency Code	CoinMarketCap ID
Gold Troy Ounce	XAU	3575
Silver Troy Ounce	XAG	3574
Platinum Ounce	XPT	3577
Palladium Ounce	XPD	3576
Warning: Using CoinMarketCap IDs is always recommended as not all cryptocurrency symbols are unique. They can also change with a cryptocurrency rebrand. If a symbol is used the API will always default to the cryptocurrency with the highest market cap if there are multiple matches. Our convert parameter also defaults to fiat if a cryptocurrency symbol also matches a supported fiat currency. You may use the convenient /map endpoints to quickly find the corresponding CoinMarketCap ID for a cryptocurrency or exchange.

Bundling API Calls
Many endpoints support ID and crypto/fiat currency conversion bundling. This means you can pass multiple comma-separated values to an endpoint to query or convert several items at once. Check the id, symbol, slug, and convert query parameter descriptions in the endpoint documentation to see if this is supported for an endpoint.
Endpoints that support bundling return data as an object map instead of an array. Each key-value pair will use the identifier you passed in as the key.
For example, if you passed symbol=BTC,ETH to /v1/cryptocurrency/quotes/latest you would receive:

"data" : {
    "BTC" : {
      ...
    },
    "ETH" : {
      ...
    }
}
Or if you passed id=1,1027 you would receive:

"data" : {
    "1" : {
      ...
    },
    "1027" : {
      ...
    }
}
Price conversions that are returned inside endpoint responses behave in the same fashion. These are enclosed in a quote object.

Date and Time Formats
All endpoints that require date/time parameters allow timestamps to be passed in either ISO 8601 format (eg. 2018-06-06T01:46:40Z) or in Unix time (eg. 1528249600). Timestamps that are passed in ISO 8601 format support basic and extended notations; if a timezone is not included, UTC will be the default.
All timestamps returned in JSON payloads are returned in UTC time using human-readable ISO 8601 format which follows this pattern: yyyy-mm-ddThh:mm:ss.mmmZ. The final .mmm designates milliseconds. Per the ISO 8601 spec the final Z is a constant that represents UTC time.
Data is collected, recorded, and reported in UTC time unless otherwise specified.
Versioning
The CoinMarketCap API is versioned to guarantee new features and updates are non-breaking. The latest version of this API is /v1/.

Errors and Rate Limits
API Request Throttling
Use of the CoinMarketCap API is subject to API call rate limiting or "request throttling". This is the number of HTTP calls that can be made simultaneously or within the same minute with your API Key before receiving an HTTP 429 "Too Many Requests" throttling error. This limit scales with the usage tier and resets every 60 seconds. Please review our Best Practices for implementation strategies that work well with rate limiting.

HTTP Status Codes
The API uses standard HTTP status codes to indicate the success or failure of an API call.

400 (Bad Request) The server could not process the request, likely due to an invalid argument.
401 (Unauthorized) Your request lacks valid authentication credentials, likely an issue with your API Key.
402 (Payment Required) Your API request was rejected due to it being a paid subscription plan with an overdue balance. Pay the balance in the Developer Portal billing tab and it will be enabled.
403 (Forbidden) Your request was rejected due to a permission issue, likely a restriction on the API Key's associated service plan. Here is a convenient map of service plans to endpoints.
429 (Too Many Requests) The API Key's rate limit was exceeded; consider slowing down your API Request frequency if this is an HTTP request throttling error. Consider upgrading your service plan if you have reached your monthly API call credit limit for the day/month.
500 (Internal Server Error) An unexpected server issue was encountered.
Error Response Codes
A Status object is always included in the JSON response payload for both successful calls and failures when possible. During error scenarios you may reference the error_code and error_message properties of the Status object. One of the API error codes below will be returned if applicable otherwise the HTTP status code for the general error type is returned.

HTTP Status	Error Code	Error Message
401	1001 [API_KEY_INVALID]	This API Key is invalid.
401	1002 [API_KEY_MISSING]	API key missing.
402	1003 [API_KEY_PLAN_REQUIRES_PAYEMENT]	Your API Key must be activated. Please go to pro.coinmarketcap.com/account/plan.
402	1004 [API_KEY_PLAN_PAYMENT_EXPIRED]	Your API Key's subscription plan has expired.
403	1005 [API_KEY_REQUIRED]	An API Key is required for this call.
403	1006 [API_KEY_PLAN_NOT_AUTHORIZED]	Your API Key subscription plan doesn't support this endpoint.
403	1007 [API_KEY_DISABLED]	This API Key has been disabled. Please contact support.
429	1008 [API_KEY_PLAN_MINUTE_RATE_LIMIT_REACHED]	You've exceeded your API Key's HTTP request rate limit. Rate limits reset every minute.
429	1009 [API_KEY_PLAN_DAILY_RATE_LIMIT_REACHED]	You've exceeded your API Key's daily rate limit.
429	1010 [API_KEY_PLAN_MONTHLY_RATE_LIMIT_REACHED]	You've exceeded your API Key's monthly rate limit.
429	1011 [IP_RATE_LIMIT_REACHED]	You've hit an IP rate limit.
Best Practices
This section contains a few recommendations on how to efficiently utilize the CoinMarketCap API for your enterprise application, particularly if you already have a large base of users for your application.

Use CoinMarketCap ID Instead of Cryptocurrency Symbol
Utilizing common cryptocurrency symbols to reference cryptocurrencies on the API is easy and convenient but brittle. You should know that many cryptocurrencies have the same symbol, for example, there are currently three cryptocurrencies that commonly refer to themselves by the symbol HOT. Cryptocurrency symbols also often change with cryptocurrency rebrands. When fetching cryptocurrency by a symbol that matches several active cryptocurrencies we return the one with the highest market cap at the time of the query. To ensure you always target the cryptocurrency you expect, use our permanent CoinMarketCap IDs. These IDs are used reliably by numerous mission critical platforms and never change.

We make fetching a map of all active cryptocurrencies' CoinMarketCap IDs very easy. Just call our /cryptocurrency/map endpoint to receive a list of all active currencies mapped to the unique id property. This map also includes other typical identifiying properties like name, symbol and platform token_address that can be cross referenced. In cryptocurrency calls you would then send, for example id=1027, instead of symbol=ETH. It's strongly recommended that any production code utilize these IDs for cryptocurrencies, exchanges, and markets to future-proof your code.

Use the Right Endpoints for the Job
You may have noticed that /cryptocurrency/listings/latest and /cryptocurrency/quotes/latest return the same crypto data but in different formats. This is because the former is for requesting paginated and ordered lists of all cryptocurrencies while the latter is for selectively requesting only the specific cryptocurrencies you require. Many endpoints follow this pattern, allow the design of these endpoints to work for you!

Implement a Caching Strategy If Needed
There are standard legal data safeguards built into the Commercial User Terms that application developers should keep in mind. These Terms help prevent unauthorized scraping and redistributing of CMC data but are intentionally worded to allow legitimate local caching of market data to support the operation of your application. If your application has a significant user base and you are concerned with staying within the call credit and API throttling limits of your subscription plan consider implementing a data caching strategy.

For example instead of making a /cryptocurrency/quotes/latest call every time one of your application's users needs to fetch market rates for specific cryptocurrencies, you could pre-fetch and cache the latest market data for every cryptocurrency in your application's local database every 60 seconds. This would only require 1 API call, /cryptocurrency/listings/latest?limit=5000, every 60 seconds. Then, anytime one of your application's users need to load a custom list of cryptocurrencies you could simply pull this latest market data from your local cache without the overhead of additional calls. This kind of optimization is practical for customers with large, demanding user bases.

Code Defensively to Ensure a Robust REST API Integration
Whenever implementing any high availability REST API service for mission critical operations it's recommended to code defensively. Since the API is versioned, any breaking request or response format change would only be introduced through new versions of each endpoint, however existing endpoints may still introduce new convenience properties over time.

We suggest these best practices:

You should parse the API response JSON as JSON and not through a regular expression or other means to avoid brittle parsing logic.
Your parsing code should explicitly parse only the response properties you require to guarantee new fields that may be returned in the future are ignored.
You should add robust field validation to your response parsing logic. You can wrap complex field parsing, like dates, in try/catch statements to minimize the impact of unexpected parsing issues (like the unlikely return of a null value).
Implement a "Retry with exponential backoff" coding pattern for your REST API call logic. This means if your HTTP request happens to get rate limited (HTTP 429) or encounters an unexpected server-side condition (HTTP 5xx) your code would automatically recover and try again using an intelligent recovery scheme. You may use one of the many libraries available; for example, this one for Node or this one for Python.
Reach Out and Upgrade Your Plan
If you're uncertain how to best implement the CoinMarketCap API in your application or your needs outgrow our current self-serve subscription tiers you can reach out to api@coinmarketcap.com. We'll review your needs and budget and may be able to tailor a custom enterprise plan that is right for you.

Version History
The CoinMarketCap API utilizes Semantic Versioning in the format major.minor.patch. The current major version is incorporated into the API request path as /v1/. Non-breaking minor and patch updates to the API are released regularly. These may include new endpoints, data points, and API plan features which are always introduced in a non-breaking manner. This means you can expect new properties to become available in our existing /v1/ endpoints however any breaking change will be introduced under a new major version of the API with legacy versions supported indefinitely unless otherwise stated.

You can subscribe to our API Newsletter to get monthly email updates on CoinMarketCap API enhancements.

v2.0.9 on June 1, 2023
/v1/community/trending/topic now available to get community trending topics.
/v1/community/trending/token now available to get community trending tokens.
v2.0.8 on November 25, 2022
/v1/exchange/assets now available to get exchange assets in the form of token holdings.
v2.0.7 on September 19, 2022
/v1/content/posts/top now available to get cryptocurrency-related top posts.
/v1/content/posts/latest now available to get cryptocurrency-related latest posts.
/v1/content/posts/comments now available to get comments of the post.
v2.0.6 on Augest 18, 2022
/v1/content/latest now available to get news/headlines and Alexandria articles.
v2.0.5 on Augest 4, 2022
/v1/tools/postman now API postman collection is available.
v2.0.4 on October 11, 2021
/v1/cryptocurrency/listings/latest now includes volume_change_24h.
/v2/cryptocurrency/quotes/latest now includes volume_change_24h.
v2.0.3 on October 6, 2021
/v1/cryptocurrency/trending/latest now supports time_period as an optional parameter.
v2.0.2 on September 13, 2021
/exchange/map now available to Free tier users.
/exchange/info now available to Free tier users.
v2.0.1 on September 8, 2021
/exchange/market-pairs/latest now includes volume_24h, depth_negative_two, depth_positive_two and volume_percentage.
/exchange/listings/latest now includes open_interest.
v2.0.0 on August 17, 2021
By popular request we have added a number of new useful endpoints !
/v1/cryptocurrency/categories can be used to access a list of categories and their associated coins. You can also filter the list of categories by one or more cryptocurrencies.
/v1/cryptocurrency/category can be used to load only a single category of coins, listing the coins within that category.
/v1/cryptocurrency/airdrops can be used to access a list of CoinMarketCap’s free airdrops. This defaults to a status of ONGOING but can be filtered to UPCOMING or ENDED. You can also query for a list of airdrops by cryptocurrency.
/v1/cryptocurrency/airdrop can be used to load a single airdrop and its associated cryptocurrency.
/v1/cryptocurrency/trending/latest can be used to load the most searched for cryptocurrencies within a period of time. This defaults to a time_period of the previous 24h, but can be changed to 30d, or 7d for a larger window of time.
/v1/cryptocurrency/trending/most-visited can be used to load the most visited cryptocurrencies within a period of time. This defaults to a time_period of the previous 24h, but can be changed to 30d, or 7d for a larger window of time.
/v1/cryptocurrency/trending/gainers-losers can be used to load the biggest gainers & losers within a period of time. This defaults to a time_period of the previous 24h, but can be changed to 30d, or 7d for a larger window of time.
v1.28.0 on August 9, 2021
/v1/cryptocurrency/listings/latest now includes market_cap_dominance and fully_diluted_market_cap.
/v1/cryptocurrency/quotes/latest now includes market_cap_dominance and fully_diluted_market_cap.
v1.27.0 on January 27, 2021
/v2/cryptocurrency/info response format changed to allow for multiple coins per symbol.
/v2/cryptocurrency/market-pairs/latest response format changed to allow for multiple coins per symbol.
/v2/cryptocurrency/quotes/historical response format changed to allow for multiple coins per symbol.
/v2/cryptocurrency/ohlcv/historical response format changed to allow for multiple coins per symbol.
/v2/tools/price-conversion response format changed to allow for multiple coins per symbol.
/v2/cryptocurrency/ohlcv/latest response format changed to allow for multiple coins per symbol.
/v2/cryptocurrency/price-performance-stats/latest response format changed to allow for multiple coins per symbol.
v1.26.0 on January 21, 2021
/v2/cryptocurrency/quotes/latest response format changed to allow for multiple coins per symbol.
v1.25.0 on April 17, 2020
/v1.1/cryptocurrency/listings/latest now includes a more robust tags response with slug, name, and category.
/cryptocurrency/quotes/historical and /cryptocurrency/quotes/latest now include is_active and is_fiat in the response.
v1.24.0 on Feb 24, 2020
/cryptocurrency/ohlcv/historical has been modified to include the high and low timestamps.
/exchange/market-pairs/latest now includes category and fee_type market pair filtering options.
/cryptocurrency/listings/latest now includes category and fee_type market pair filtering options.
v1.23.0 on Feb 3, 2020
/fiat/map is now available to fetch the latest mapping of supported fiat currencies to CMC IDs.
/exchange/market-pairs/latest now includes matched_id and matched_symbol market pair filtering options.
/cryptocurrency/listings/latest now provides filter parameters price_min, price_max, market_cap_min, market_cap_max, percent_change_24h_min, percent_change_24h_max, volume_24h_max, circulating_supply_min and circulating_supply_max in addition to the existing volume_24h_min filter.
v1.22.0 on Oct 16, 2019
/global-metrics/quotes/latest now additionally returns total_cryptocurrencies and total_exchanges counts which include inactive projects who's data is still available via API.
v1.21.0 on Oct 1, 2019
/exchange/map now includes sort options including volume_24h.
/cryptocurrency/map fix for a scenario where first_historical_data and last_historical_data may not be populated.
Additional improvements to alphanumeric sorts.
v1.20.0 on Sep 25, 2019
By popular request you may now configure API plan usage notifications and email alerts in the Developer Portal.
/cryptocurrency/map now includes sort options including cmc_rank.
v1.19.0 on Sep 19, 2019
A new /blockchain/ category of endpoints is now available with the introduction of our new /v1/blockchain/statistics/latest endpoint. This endpoint can be used to poll blockchain statistics data as seen in our Blockchain Explorer.
Additional platform error codes are now surfaced during HTTP Status Code 401, 402, 403, and 429 scenarios as documented in Errors and Rate Limits.
OHLCV endpoints using the convert option now match historical UTC open period exchange rates with greater accuracy.
/cryptocurrency/info and /exchange/info now include the optional aux parameter where listing status can be requested in the list of supplemental properties.
/cryptocurrency/listings/latest and /cryptocurrency/quotes/latest: The accuracy of percent_change_ conversions was improved when passing non-USD fiat convert options.
/cryptocurrency/ohlcv/historical and /cryptocurrency/quotes/latest now support relaxed request validation rules via the skip_invalid request parameter.
We also now return a helpful notice warning when API key usage is above 95% of daily and monthly API credit usage limits.
v1.18.0 on Aug 28, 2019
/key/info has been added as a new endpoint. It may be used programmatically monitor your key usage compared to the rate limit and daily/monthly credit limits available to your API plan as an alternative to using the Developer Portal Dashboard.
/cryptocurrency/quotes/historical and /v1/global-metrics/quotes/historical have new options to make charting tasks easier and more efficient. Use the new aux parameter to cut out response properties you don't need and include the new search_interval timestamp to normalize disparate historical records against the same interval time periods.
A 4 hour interval option 4h was added to all historical time series data endpoints.
v1.17.0 on Aug 22, 2019
/cryptocurrency/price-performance-stats/latest has been added as our 21st endpoint! It returns launch price ROI, all-time high / all-time low, and other price stats over several supported time periods.
/cryptocurrency/market-pairs/latest now has the ability to filter all active markets for a cryptocurrency to specific base/quote pairs. Want to return only BTC/USD and BTC/USDT markets? Just pass ?symbol=BTC&matched_symbol=USD,USDT or ?id=1&matched_id=2781,825.
/cryptocurrency/market-pairs/latest now features sort options including cmc_rank to reproduce the methodology based sort on pages like Bitcoin Markets.
/cryptocurrency/market-pairs/latest can now return any exchange level CMC notices affecting a market via the new notice aux parameter.
/cryptocurrency/quotes/latest will now continue to return the last updated price data for cryptocurrency that have transitioned to an inactive state instead of returning an HTTP 400 error. These active coins that have gone inactive can easily be identified as having a num_market_pairs of 0 and a stale last_updated date.
/exchange/info now includes a brief text summary for most exchanges as description.
v1.16.0 on Aug 9, 2019
We've introduced a new partners category of endpoints for convenient access to 3rd party crypto data. FlipSide Crypto's Fundamental Crypto Asset Score (FCAS) is now available as the first partner integration.
/cryptocurrency/listings/latest now provides a volume_24h_min filter parameter. It can be used when a threshold of volume is required like in our Biggest Gainers and Losers lists.
/cryptocurrency/listings/latest and /cryptocurrency/quotes/latest can now return rolling volume_7d and volume_30d via the supplemental aux parameter and sort options by these fields.
volume_24h_reported, volume_7d_reported, volume_30d_reported, and market_cap_by_total_supply are also now available through the aux parameter with an additional sort option for the latter.
/cryptocurrency/market-pairs/latest can now provide market price relative to the quote currency. Just pass price_quote to the supplemental aux parameter. This can be used to display consistent price data for a cryptocurrency across several markets no matter if it is the base or quote in each pair as seen in our Bitcoin markets price column.
When requesting a custom sort on our list based endpoints, numeric fields like percent_change_7d now conveniently return non-applicable null values last regardless of sort order.
v1.15.0 on Jul 10, 2019
/cryptocurrency/map and /v1/exchange/map now expose a 3rd listing state of untracked between active and inactive as outlined in our methodology. See endpoint documentation for additional details.
/cryptocurrency/quotes/historical, /cryptocurrency/ohlcv/historical, and /exchange/quotes/latest now support fetching multiple cryptocurrencies and exchanges in the same call.
/global-metrics/quotes/latest now updates more frequently, every minute. It aslo now includes total_volume_24h_reported, altcoin_volume_24h, altcoin_volume_24h_reported, and altcoin_market_cap.
/global-metrics/quotes/historical also includes these new dimensions along with historical active_cryptocurrencies, active_exchanges, and active_market_pairs counts.
We've also added a new aux auxiliary parameter to many endpoints which can be used to customize your request. You may request new supplemental data properties that are not returned by default or slim down your response payload by excluding default aux fields you don't need in endpoints like /cryptocurrency/listings/latest. /cryptocurrency/market-pairs/latest and /exchange/market-pairs/latest can now supply market_url, currency_name, and currency_slug for each market using this new parameter. /exchange/listings/latest can now include the exchange date_launched.
v1.14.1 on Jun 14, 2019 - DATA: Phase 1 methodology updates
Per our May 1 announcement of the Data Accountability & Transparency Alliance (DATA), a platform methodology update was published. No API changes are required but users should take note:

Exchanges that are not compliant with mandatory transparency requirements (Ability to surface live trade and order book data) will be excluded from VWAP price and volume calculations returned from our /cryptocurrency/ and /global-metrics/ endpoints going forward.
These exchanges will also return a volume_24h_adjusted value of 0 from our /exchange/ endpoints like the exclusions based on market category and fee type. Stale markets (24h or older) will also be excluded. All exchanges will continue to return exchange_reported values as reported.
We welcome you to learn more about the DATA alliance and become a partner.
v1.14.0 on Jun 3, 2019
/cryptocurrency/info now include up to 5 block explorer URLs for each cryptocurrency including our brand new Bitcoin and Ethereum Explorers.
/cryptocurrency/info now provides links to most cryptocurrency white papers and technical documentation! Just reference the technical_doc array.
/cryptocurrency/info now returns a notice property that may highlight a significant event or condition that is impacting the cryptocurrency or how it is displayed. See the endpoint property description for more details.
/exchange/info also includes a notice property. This one may highlight a condition that is impacting the availability of an exchange's market data or the use of the exchange. See the endpoint property description for more details.
/exchange/info now includes the official launch date for each exchange as date_launched.
/cryptocurrency/market-pairs/latest and /exchange/market-pairs/latest now include market category (Spot, Derivatives, or OTC) and fee_type (Percentage, No Fees, Transactional Mining, or Unknown) for every market returned.
/cryptocurrency/market-pairs/latest now supports querying by cryptocurrency slug.
/cryptocurrency/listings/latest now includes a market_cap_strict sort option to apply a strict numeric sort on this field.
v1.13.0 on May 17, 2019
You may now leverage CoinMarketCap IDs for currency quote conversions across all endpoints! Just utilize the new convert_id parameter instead of the convert parameter. Learn more about creating robust integrations with CMC IDs in our Best Practices.
We've updated requesting cryptocurrencies by slug to support legacy names from past cryptocurrency rebrands. For example, a request to /cryptocurrency/quotes/latest?slug=antshares successfully returns the cryptocurrency by current slug neo.
We've extended the brief text summary included as description in /cryptocurrency/info to now cover all cryptocurrencies!
We've added the fetch-by-slug option to /cryptocurrency/ohlcv/historical.
Premium subscription users: On your next billing period we'll conveniently switch to displaying monthly/daily credit usage relative to your monthly billing period instead of calendar month and UTC midnight. Click the ? on our updated API Key Usage panel for more details.
v1.12.1 on May 1, 2019
To celebrate CoinMarketCap's 6th anniversary we've upgraded the crypto API to make more of our data available at each tier!
Our free Basic tier may now access live price conversions via /tools/price-conversion.
Our Hobbyist tier now supports a month of historical price conversions with /tools/price-conversion using the time parameter. We've also made this plan 12% cheaper at $29/mo with a yearly subscription or $35/mo month-to-month.
Our Startup tier can now access a month of cryptocurrency OHLCV data via /cryptocurrency/ohlcv/historical along with /tools/price-conversion.
Our Standard tier has been upgraded from 1 month to now 3 months of historical market data access across all historical endpoints.
Our Enterprise, Professional, and Standard tiers now get access to a new #18th endpoint /cryptocurrency/listings/historical! Utilize this endpoint to fetch daily historical crypto rankings from the past. We've made historical ranking snapshots available all the way back to 2013!
All existing accounts and subscribers may take advantage of these updates. If you haven't signed up yet you can check out our updated plans on our feature comparison page.
v1.12.0 on Apr 28, 2019
Our API docs now supply API request examples in 7 languages for every endpoint: cURL, Node.js, Python, PHP, Java, C#, and Go.
Many customer sites format cryptocurrency data page URLs by SEO friendly names like we do here: coinmarketcap.com/currencies/binance-coin. We've made it much easier for these kinds of pages to dynamically reference data from our API. You may now request cryptocurrencies from our /cryptocurrency/info and /cryptocurrency/quotes/latest endpoints by slug as an alternative to symbol or id. As always, you can retrieve a quick list of every cryptocurrency we support and it's id, symbol, and slug via our /cryptocurrency/map endpoint.
We've increased convert limits on historical endpoints once more. You can now request historical market data in up to 3 conversion options at a time like we do internally to display line charts like this. You can now fetch market data converted into your primary cryptocurrency, fiat currency, and a parent platform cryptocurrency (Ethereum in this case) all in one call!
v1.11.0 on Mar 25, 2019
We now supply a brief text summary for each cryptocurrency in the description field of /cryptocurrency/info. The majority of top cryptocurrencies include this field with more coming in the future.
We've made convert limits on some endpoints and plans more flexible. Historical endpoints are now allowed 2 price conversion options instead of 1. Professional plan convert limit has doubled from 40 to 80. Enterprise has tripled from 40 to 120.
CoinMarketCap Market ID: We now return market_id in /market-pairs/latest endpoints. Like our cryptocurrency and exchange IDs, this ID can reliably be used to uniquely identify each market permanently as this ID never changes.
Market symbol overrides: We now supply an exchange_symbol in addition to currency_symbol for each market pair returned in our /market-pairs/latest endpoints. This allows you to reference the currency symbol provided by the exchange in case it differs from the CoinMarketCap identified symbol that the majority of markets use.
v1.10.1 on Jan 30, 2019
Our API health status dashboard is now public at http://status.coinmarketcap.com.
We now conveniently return market_cap in our /cryptocurrency/ohlcv/historical endpoint so you don't have to make a separately query when fetching historic OHLCV data.
We've improved the accuracy of percent_change_1h / 24h / 7d calculations when using the convert option with our latest cryptocurrency endpoints.
/cryptocurrency/market-pairs/latest now updates more frequently, every 1 minute.
Contract Address and parent platform metadata changes are reflected on the API much more quickly.
v1.9.0 on Jan 8, 2019
Did you know there are currently 684 active USD market pairs tracked by CoinMarketCap? You can now pass any fiat CoinMarketCap ID to the /cryptocurrency/market-pairs/latest id parameter to list all active markets across all exchanges for a given fiat currency.
We've added a new dedicated migration FAQ page for users migrating from our old Public API to the new API here. It includes a helpful tutorial link for Excel and Google Sheets users who need help migrating.
Cryptocurrency and exchange symbol and name rebrands are now reflected in the API much more quickly.
v1.8.0 on Dec 27, 2018
We now supply the contract address for all cryptocurrencies on token platforms like Ethereum! Look for token_address in the platform property of our cryptocurrency endpoints like /cryptocurrency/map and /cryptocurrency/listings/latest.
All 96 non-USD fiat conversion rates now update every 1 minute like our USD rates! This includes using the convert option for all /latest market data endpoints as well as our /tools/price-conversion endpoint.
v1.7.0 on Dec 18, 2018
We've upgraded our fiat (government) currency conversion support from our original 32 to now cover 93 fiat currencies!
We've also introduced currency conversions for four precious metals: Gold, Silver, Platinum, and Palladium!
You may pass all 97 fiat currency options to our /tools/price-conversion endpoint using either the symbol or id parameter. Using CMC id is always the most robust option. CMC IDs are now included in the full list of fiat options located here.
All historical endpoints including our price conversion endpoint with "time" parameter now support historical fiat conversions back to 2013!
v1.6.0 on Dec 4, 2018
We've rolled out another top requested feature, giving you access to platform metadata for cryptocurrencies that are tokens built on other cryptocurrencies like Ethereum. Look for the new platform property on our cryptocurrency endpoints like /cryptocurrency/listings/latest and /cryptocurrency/map.
We've also added a CMC equivalent pages section to our endpoint docs so you can easily determine which endpoints to use to reproduce functionality on the main coinmarketcap.com website.
Welcome Public API users! With the migration of our legacy Public API into the Professional API we now have 1 unified API at CMC. This API is now known as the CoinMarketCap API and can always be accessed at coinmarketcap.com/api.
v1.5.0 on Nov 28, 2018
/cryptocurrency/ohlcv/historical now supports hourly OHLCV! Use time_period="hourly" and don't forget to set the "interval" parameter to "hourly" or one of the new hourly interval options.
/tools/price-conversion now supports historical USD conversions.
We've increased the minute based rate limits for several plans. Standard plan has been upgraded from 30 to 60 calls per minute. Professional from 60 to 90. Enterprise from 90 to 120.
We now include some customer and data partner logos and testimonials on the CoinMarketCap API site. Visit pro.coinmarketcap.com to check out what our enterprise customers are saying and contact us at api@coinmarketcap.com if you'd like to get added to the list!
v1.4.0 on Nov 20, 2018
/tools/price-conversion can now provide the latest crypto-to-crypto conversions at 1 minute accuracy with extended decimal precision upwards of 8 decimal places.
/tools/price-conversion now supports historical crypto-to-crypto conversions leveraging our closest averages to the specified "time" parameter.
All of our historical data endpoints now support historical cryptocurrency conversions using the "convert" parameter. The closest reference price for each "convert" option against each historical datapoint is used for each conversion.
/global-metrics/quotes/historical now supports the "convert" parameter.
v1.3.0 on Nov 9, 2018
The latest UTC day's OHLCV record is now available sooner. 5-10 minutes after each UTC midnight.
We're now returning a new vol_24h_adjusted property on /exchange/quotes/latest and /exchange/listings/latest and a sort option for the latter so you may now list exchange rankings by CMC adjusted volume as well as exchange reported.
We are now returning a tags property with /cryptocurrency/listings/latest with our first tag mineable so you know which currencies are mineable. Additional tags will be introduced in the future.
We've increased the "convert" parameter limit from 32 to 40 for plans that support max conversion limits.
v1.2.0 on Oct 30, 2018
Our exchange listing and quotes endpoints now update much more frequently! Every 1 minute instead of every 5 minutes.
These latest exchange data endpoints also now return volume_7d / 30d and percent_change_volume_24h / 7d / 30d along with existing data.
We've updated our documentation for /exchange/market-pairs/latest to reflect that it receives updates every 1 minute, not 5, since June.
v1.1.4 on Oct 19, 2018
We've improved our tiered support inboxes by plan type to answer support requests even faster.
You may now opt-in to our API mailing list on signup. If you haven't signed up you can here.
v1.1.3 on Oct 12, 2018
We've increased the rate limit of our free Basic plan from 10 calls a minute to 30.
We've increased the rate limit of our Hobbyist plan from 15 to 30.
v1.1.2 on Oct 5, 2018
We've updated our most popular /cryptocurrency/listings/latest endpoint to cost 1 credit per 200 data points instead of 100 to give customers more flexibility.
By popular request we've introduced a new $33 personal use Hobbyist tier with access to our currency conversion calculator endpoint.
Our existing commercial use Hobbyist tier has been renamed to Startup. Our free Starter tier has been renamed to Basic.
v1.1.1 on Sept 28, 2018
We've increased our monthly credit limits for our smaller plans! Existing customers plans have also been updated.
Our free Starter plan has been upgraded from 6 to 10k monthly credits (66% increase).
Our Hobbyist plan has been upgraded from 60k to 120k monthly credits (100% increase).
Our Standard plan has been upgraded from 300 to 500k monthly credits (66% increase).
v1.1.0 on Sept 14, 2018
We've introduced our first new endpoint since rollout, active day OHLCV for Standard plan and above with /v1/cryptocurrency/ohlcv/latest
v1.0.4 on Sept 7, 2018
Subscription customers with billing renewal issues now receive an alert from our API during usage and an unpublished grace period before access is restricted.
API Documentation has been improved including an outline of credit usage cost outlined on each endpoint documentation page.
v1.0.3 on Aug 24, 2018
/v1/tools/price-conversion floating point conversion accuracy was improved.
Added ability to query for non-alphanumeric crypto symbols like $PAC
Customers may now update their billing card on file with an active Stripe subscription at pro.coinmarketcap.com/account/plan
Cryptocurrency
API endpoints for cryptocurrencies. This category currently includes 17 endpoints:
/v1/cryptocurrency/map - CoinMarketCap ID map
/v2/cryptocurrency/info - Metadata
/v1/cryptocurrency/listings/latest - Latest listings
/v1/cryptocurrency/listings/historical - Historical listings
/v2/cryptocurrency/quotes/latest - Latest quotes
/v2/cryptocurrency/quotes/historical - Historical quotes
/v2/cryptocurrency/market-pairs/latest - Latest market pairs
/v2/cryptocurrency/ohlcv/latest - Latest OHLCV
/v2/cryptocurrency/ohlcv/historical - Historical OHLCV
/v2/cryptocurrency/price-performance-stats/latest - Price performance Stats
/v1/cryptocurrency/categories - Categories
/v1/cryptocurrency/category - Category
/v1/cryptocurrency/airdrops - Airdrops
/v1/cryptocurrency/airdrop - Airdrop
/v1/cryptocurrency/trending/latest - Trending Latest
/v1/cryptocurrency/trending/most-visited - Trending Most Visited
/v1/cryptocurrency/trending/gainers-losers - Trending Gainers & Losers

Airdrop
Returns information about a single airdrop available on CoinMarketCap. Includes the cryptocurrency metadata.

This endpoint is available on the following API plans:

Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Data is updated only as needed, every 30 seconds.
Plan credit use: 1 API call credit per request no matter query size.
CMC equivalent pages: Our free airdrops page coinmarketcap.com/airdrop/.


PARAMETERS
Query Parameters ?
 id	
string Required
Airdrop Unique ID. This can be found using the Airdrops API.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results of your query returned as an object map.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/cryptocurrency/airdrop
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/airdrop

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"id": "60e59b99c8ca1d58514a2322",
"project_name": "DeRace Airdrop",
"description": "For 7 days starting from August 15, 2021, CoinMarketCap will host an Airdrop event...",
"status": "UPCOMING",
"coin": {
"id": 10744,
"name": "DeRace",
"slug": "derace",
"symbol": "DERC"
},
"start_date": "2021-06-01T22:11:00.000Z",
"end_date": "2021-07-01T22:11:00.000Z",
"total_prize": 20000000000,
"winner_count": 1000,
"link": "https://coinmarketcap.com/currencies/derace/airdrop/"
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Airdrops
Returns a list of past, present, or future airdrops which have run on CoinMarketCap.

This endpoint is available on the following API plans:

Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Data is updated only as needed, every 30 seconds.
Plan credit use: 1 API call credit per request no matter query size.
CMC equivalent pages: Our free airdrops page coinmarketcap.com/airdrop/.


PARAMETERS
Query Parameters ?
 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of items to return.

 limit	
integer [ 1 .. 5000 ]
100
Optionally specify the number of results to return. Use this parameter and the "start" parameter to determine your own pagination size.

 status	
string
"ONGOING"
"ENDED""ONGOING""UPCOMING"
What status of airdrops.

 id	
string
Filtered airdrops by one cryptocurrency CoinMarketCap IDs. Example: 1

 slug	
string
Alternatively filter airdrops by a cryptocurrency slug. Example: "bitcoin"

 symbol	
string
Alternatively filter airdrops one cryptocurrency symbol. Example: "BTC".

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Array of airdrop object results.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/cryptocurrency/airdrops
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/airdrops

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": [
{
"id": "60e59b99c8ca1d58514a2322",
"project_name": "DeRace Airdrop",
"description": "For 7 days starting from August 15, 2021, CoinMarketCap will host an Airdrop event...",
"status": "UPCOMING",
"coin": {
"id": 10744,
"name": "DeRace",
"slug": "derace",
"symbol": "DERC"
},
"start_date": "2021-06-01T22:11:00.000Z",
"end_date": "2021-07-01T22:11:00.000Z",
"total_prize": 20000000000,
"winner_count": 1000,
"link": "https://coinmarketcap.com/currencies/derace/airdrop/"
}
],
"status": {
"timestamp": "2021-08-01T22:51:28.209Z",
"error_code": 0,
"error_message": "",
"elapsed": 3,
"credit_count": 1
}
}
Categories
Returns information about all coin categories available on CoinMarketCap. Includes a paginated list of cryptocurrency quotes and metadata from each category.

This endpoint is available on the following API plans:

Free
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Data is updated only as needed, every 30 seconds.
Plan credit use: 1 API call credit per request + 1 call credit per 200 cryptocurrencies returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Our free airdrops page coinmarketcap.com/cryptocurrency-category/.


PARAMETERS
Query Parameters ?
 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of items to return.

 limit	
integer [ 1 .. 5000 ]
Optionally specify the number of results to return. Use this parameter and the "start" parameter to determine your own pagination size.

 id	
string
Filtered categories by one or more comma-separated cryptocurrency CoinMarketCap IDs. Example: 1,2

 slug	
string
Alternatively filter categories by a comma-separated list of cryptocurrency slugs. Example: "bitcoin,ethereum"

 symbol	
string
Alternatively filter categories one or more comma-separated cryptocurrency symbols. Example: "BTC,ETH".

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results of your query returned as an object map.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/cryptocurrency/categories
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/categories

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": [
{
"id": "605e2ce9d41eae1066535f7c",
"name": "A16Z Portfolio",
"title": "A16Z Portfolio",
"description": "A16Z Portfolio",
"num_tokens": 12,
"avg_price_change": 0.61305157,
"market_cap": 29429241867.031097,
"market_cap_change": 3.049044106496,
"volume": 4103706600.0391645,
"volume_change": -10.538325849854,
"last_updated": 1616488708878
}
],
"status": {
"timestamp": "2021-08-01T22:51:28.209Z",
"error_code": 0,
"error_message": "",
"elapsed": 3,
"credit_count": 1
}
}
Category
Returns information about a single coin category available on CoinMarketCap. Includes a paginated list of the cryptocurrency quotes and metadata for the category.

This endpoint is available on the following API plans:

Free
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Data is updated only as needed, every 30 seconds.
Plan credit use: 1 API call credit per request + 1 call credit per 200 cryptocurrencies returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Our Cryptocurrency Category page coinmarketcap.com/cryptocurrency-category/.


PARAMETERS
Query Parameters ?
 id	
string Required
The Category ID. This can be found using the Categories API.

 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of coins to return.

 limit	
integer [ 1 .. 1000 ]
100
Optionally specify the number of coins to return. Use this parameter and the "start" parameter to determine your own pagination size.

 convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

Responses
200 Successful

400 Bad Request

RESPONSE SCHEMA
 status 	
 timestamp	
string <date>
Current ISO 8601 timestamp on the server.

 error_code	
integer
400
An internal error code for the current error. If a unique platform error code is not available the HTTP status code is returned.

 error_message	
string
An error message to go along with the error code.

 elapsed	
integer
Number of milliseconds taken to generate this response

 credit_count	
integer
Number of API call credits required for this call. Always 0 for errors.

401 Unauthorized

RESPONSE SCHEMA
 status 	
 timestamp	
string <date>
Current ISO 8601 timestamp on the server.

 error_code	
integer
401
An internal error code for the current error. If a unique platform error code is not available the HTTP status code is returned.

 error_message	
string
An error message to go along with the error code.

 elapsed	
integer
Number of milliseconds taken to generate this response

 credit_count	
integer
Number of API call credits required for this call. Always 0 for errors.

403 Forbidden

RESPONSE SCHEMA
 status 	
 timestamp	
string <date>
Current ISO 8601 timestamp on the server.

 error_code	
integer
403
An internal error code for the current error. If a unique platform error code is not available the HTTP status code is returned.

 error_message	
string
An error message to go along with the error code.

 elapsed	
integer
Number of milliseconds taken to generate this response

 credit_count	
integer
Number of API call credits required for this call. Always 0 for errors.

429 Too Many Requests

RESPONSE SCHEMA
 status 	
 timestamp	
string <date>
Current ISO 8601 timestamp on the server.

 error_code	
integer
429
An internal error code string for the current error. If a unique platform error code is not available the HTTP status code is returned.

 error_message	
string
An error message to go along with the error code.

 elapsed	
integer
Number of milliseconds taken to generate this response

 credit_count	
integer
Number of API call credits required for this call. Always 0 for errors.

500 Internal Server Error

RESPONSE SCHEMA
 status 	
 timestamp	
string <date>
Current ISO 8601 timestamp on the server.

 error_code 500	
integer
500
An internal error code string for the current error. If a unique platform error code is not available the HTTP status code is returned.

 error_message	
string
An error message to go along with the error code.

 elapsed	
integer
Number of milliseconds taken to generate this response

 credit_count	
integer
Number of API call credits required for this call. Always 0 for errors.

GET /v1/cryptocurrency/category
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/category

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"id": "605e2ce9d41eae1066535f7c",
"name": "A16Z Portfolio",
"title": "A16Z Portfolio",
"description": "A16Z Portfolio",
"num_tokens": 12,
"avg_price_change": 0.61305157,
"market_cap": 29429241867.031097,
"market_cap_change": 3.049044106496,
"volume": 4103706600.0391645,
"volume_change": -10.538325849854,
"coins": [
{
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"slug": "bitcoin",
"cmc_rank": 5,
"num_market_pairs": 500,
"circulating_supply": 16950100,
"total_supply": 16950100,
"max_supply": 21000000,
"last_updated": "2018-06-02T22:51:28.209Z",
"date_added": "2013-04-28T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"quote": {
"USD": {
"price": 9283.92,
"volume_24h": 7155680000,
"percent_change_1h": -0.152774,
"percent_change_24h": 0.518894,
"percent_change_7d": 0.986573,
"market_cap": 158055024432,
"last_updated": "2018-08-09T22:53:32.000Z"
},
"BTC": {
"price": 1,
"volume_24h": 772012,
"percent_change_1h": 0,
"percent_change_24h": 0,
"percent_change_7d": 0,
"market_cap": 17024600,
"last_updated": "2018-08-09T22:53:32.000Z"
}
}
},
{
"id": 1027,
"name": "Ethereum",
"symbol": "ETH",
"slug": "ethereum",
"num_market_pairs": 6360,
"circulating_supply": 16950100,
"total_supply": 16950100,
"max_supply": 21000000,
"last_updated": "2018-06-02T22:51:28.209Z",
"date_added": "2013-04-28T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"quote": {
"USD": {
"price": 1283.92,
"volume_24h": 7155680000,
"percent_change_1h": -0.152774,
"percent_change_24h": 0.518894,
"percent_change_7d": 0.986573,
"market_cap": 158055024432,
"last_updated": "2018-08-09T22:53:32.000Z"
},
"ETH": {
"price": 1,
"volume_24h": 772012,
"percent_change_1h": 0,
"percent_change_24h": 0,
"percent_change_7d": 0,
"market_cap": 17024600,
"last_updated": "2018-08-09T22:53:32.000Z"
}
}
}
],
"last_updated": 1616488708878
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
CoinMarketCap ID Map
Returns a mapping of all cryptocurrencies to unique CoinMarketCap ids. Per our Best Practices we recommend utilizing CMC ID instead of cryptocurrency symbols to securely identify cryptocurrencies with our other endpoints and in your own application logic. Each cryptocurrency returned includes typical identifiers such as name, symbol, and token_address for flexible mapping to id.

By default this endpoint returns cryptocurrencies that have actively tracked markets on supported exchanges. You may receive a map of all inactive cryptocurrencies by passing listing_status=inactive. You may also receive a map of registered cryptocurrency projects that are listed but do not yet meet methodology requirements to have tracked markets via listing_status=untracked. Please review our methodology documentation for additional details on listing states.

Cryptocurrencies returned include first_historical_data and last_historical_data timestamps to conveniently reference historical date ranges available to query with historical time-series data endpoints. You may also use the aux parameter to only include properties you require to slim down the payload if calling this endpoint frequently.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Mapping data is updated only as needed, every 30 seconds.
Plan credit use: 1 API call credit per request no matter query size.
CMC equivalent pages: No equivalent, this data is only available via API.


PARAMETERS
Query Parameters ?
 listing_status	
string
"active"
Only active cryptocurrencies are returned by default. Pass inactive to get a list of cryptocurrencies that are no longer active. Pass untracked to get a list of cryptocurrencies that are listed but do not yet meet methodology requirements to have tracked markets available. You may pass one or more comma-separated values.

 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of items to return.

 limit	
integer [ 1 .. 5000 ]
Optionally specify the number of results to return. Use this parameter and the "start" parameter to determine your own pagination size.

 sort	
string
"id"
"cmc_rank""id"
What field to sort the list of cryptocurrencies by.

 symbol	
string
Optionally pass a comma-separated list of cryptocurrency symbols to return CoinMarketCap IDs for. If this option is passed, other options will be ignored.

 aux	
string
"platform,first_historical_data,last_historical_data,is_active"
Optionally specify a comma-separated list of supplemental data fields to return. Pass platform,first_historical_data,last_historical_data,is_active,status to include all auxiliary fields.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Array of cryptocurrency object results.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/cryptocurrency/map
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/map

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": [
{
"id": 1,
"rank": 1,
"name": "Bitcoin",
"symbol": "BTC",
"slug": "bitcoin",
"is_active": 1,
"first_historical_data": "2013-04-28T18:47:21.000Z",
"last_historical_data": "2020-05-05T20:44:01.000Z",
"platform": null
},
{
"id": 1839,
"rank": 3,
"name": "Binance Coin",
"symbol": "BNB",
"slug": "binance-coin",
"is_active": 1,
"first_historical_data": "2017-07-25T04:30:05.000Z",
"last_historical_data": "2020-05-05T20:44:02.000Z",
"platform": {
"id": 1027,
"name": "Ethereum",
"symbol": "ETH",
"slug": "ethereum",
"token_address": "0xB8c77482e45F1F44dE1745F52C74426C631bDD52"
}
},
{
"id": 825,
"rank": 5,
"name": "Tether",
"symbol": "USDT",
"slug": "tether",
"is_active": 1,
"first_historical_data": "2015-02-25T13:34:26.000Z",
"last_historical_data": "2020-05-05T20:44:01.000Z",
"platform": {
"id": 1027,
"name": "Ethereum",
"symbol": "ETH",
"slug": "ethereum",
"token_address": "0xdac17f958d2ee523a2206206994597c13d831ec7"
}
}
],
"status": {
"timestamp": "2018-06-02T22:51:28.209Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1
}
}
Metadata v2
Returns all static metadata available for one or more cryptocurrencies. This information includes details like logo, description, official website URL, social links, and links to a cryptocurrency's technical documentation.

Please note: This documentation relates to our updated V2 endpoint, which may be incompatible with our V1 versions. Documentation for deprecated endpoints can be found here.

This endpoint is available on the following API plans:

Basic
Startup
Hobbyist
Standard
Professional
Enterprise
Cache / Update frequency: Static data is updated only as needed, every 30 seconds.
Plan credit use: 1 call credit per 100 cryptocurrencies returned (rounded up).
CMC equivalent pages: Cryptocurrency detail page metadata like coinmarketcap.com/currencies/bitcoin/.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated CoinMarketCap cryptocurrency IDs. Example: "1,2"

 slug	
string
Alternatively pass a comma-separated list of cryptocurrency slugs. Example: "bitcoin,ethereum"

 symbol	
string
Alternatively pass one or more comma-separated cryptocurrency symbols. Example: "BTC,ETH". At least one "id" or "slug" or "symbol" is required for this request. Please note that starting in the v2 endpoint, due to the fact that a symbol is not unique, if you request by symbol each data response will contain an array of objects containing all of the coins that use each requested symbol. The v1 endpoint will still return a single object, the highest ranked coin using that symbol.

 address	
string
Alternatively pass in a contract address. Example: "0xc40af1e4fecfa05ce6bab79dcd8b373d2e436c4e"

 skip_invalid	
boolean
false
Pass true to relax request validation rules. When requesting records on multiple cryptocurrencies an error is returned if any invalid cryptocurrencies are requested or a cryptocurrency does not have matching records in the requested timeframe. If set to true, invalid lookups will be skipped allowing valid cryptocurrencies to still be returned.

 aux	
string
"urls,logo,description,tags,platform,date_added,notice"
Optionally specify a comma-separated list of supplemental data fields to return. Pass urls,logo,description,tags,platform,date_added,notice,status to include all auxiliary fields.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results of your query returned as an object map.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v2/cryptocurrency/info
Server URL

https://pro-api.coinmarketcap.com/v2/cryptocurrency/info

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"1": {
"urls": {
"website": [
"https://bitcoin.org/"
],
"technical_doc": [
"https://bitcoin.org/bitcoin.pdf"
],
"twitter": [ ],
"reddit": [
"https://reddit.com/r/bitcoin"
],
"message_board": [
"https://bitcointalk.org"
],
"announcement": [ ],
"chat": [ ],
"explorer": [
"https://blockchain.coinmarketcap.com/chain/bitcoin",
"https://blockchain.info/",
"https://live.blockcypher.com/btc/"
],
"source_code": [
"https://github.com/bitcoin/"
]
},
"logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"slug": "bitcoin",
"description": "Bitcoin (BTC) is a consensus network that enables a new payment system and a completely digital currency. Powered by its users, it is a peer to peer payment network that requires no central authority to operate. On October 31st, 2008, an individual or group of individuals operating under the pseudonym "Satoshi Nakamoto" published the Bitcoin Whitepaper and described it as: "a purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution."",
"date_added": "2013-04-28T00:00:00.000Z",
"date_launched": "2013-04-28T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"category": "coin"
},
"1027": {
"urls": {
"website": [
"https://www.ethereum.org/"
],
"technical_doc": [
"https://github.com/ethereum/wiki/wiki/White-Paper"
],
"twitter": [
"https://twitter.com/ethereum"
],
"reddit": [
"https://reddit.com/r/ethereum"
],
"message_board": [
"https://forum.ethereum.org/"
],
"announcement": [
"https://bitcointalk.org/index.php?topic=428589.0"
],
"chat": [
"https://gitter.im/orgs/ethereum/rooms"
],
"explorer": [
"https://blockchain.coinmarketcap.com/chain/ethereum",
"https://etherscan.io/",
"https://ethplorer.io/"
],
"source_code": [
"https://github.com/ethereum"
]
},
"logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
"id": 1027,
"name": "Ethereum",
"symbol": "ETH",
"slug": "ethereum",
"description": "Ethereum (ETH) is a smart contract platform that enables developers to build decentralized applications (dapps) conceptualized by Vitalik Buterin in 2013. ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.

Ethereum is the pioneer for blockchain based smart contracts. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met. On the blockchain, smart contracts allow for code to be run exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. The Ethereum network went live on July 30th, 2015 with 72 million Ethereum premined.",
"notice": null,
"date_added": "2015-08-07T00:00:00.000Z",
"date_launched": "2015-08-07T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"category": "coin",
"self_reported_circulating_supply": null,
"self_reported_market_cap": null,
"self_reported_tags": null,
"infinite_supply": false
}
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Listings Historical
Returns a ranked and sorted list of all cryptocurrencies for a historical UTC date.

Technical Notes

This endpoint is identical in format to our /cryptocurrency/listings/latest endpoint but is used to retrieve historical daily ranking snapshots from the end of each UTC day.
Daily snapshots reflect market data at the end of each UTC day and may be requested as far back as 2013-04-28 (as supported by your plan's historical limits).
The required "date" parameter can be passed as a Unix timestamp or ISO 8601 date but only the date portion of the timestamp will be referenced. It is recommended to send an ISO date format like "2019-10-10" without time.
This endpoint is for retrieving paginated and sorted lists of all currencies. If you require historical market data on specific cryptocurrencies you should use /cryptocurrency/quotes/historical.
Cryptocurrencies are listed by cmc_rank by default. You may optionally sort against any of the following:
cmc_rank: CoinMarketCap's market cap rank as outlined in our methodology.
name: The cryptocurrency name.
symbol: The cryptocurrency symbol.
market_cap: market cap (latest trade price x circulating supply).
price: latest average trade price across markets.
circulating_supply: approximate number of coins currently in circulation.
total_supply: approximate total amount of coins in existence right now (minus any coins that have been verifiably burned).
max_supply: our best approximation of the maximum amount of coins that will ever exist in the lifetime of the currency.
num_market_pairs: number of market pairs across all exchanges trading each currency.
volume_24h: 24 hour trading volume for each currency.
percent_change_1h: 1 hour trading price percentage change for each currency.
percent_change_24h: 24 hour trading price percentage change for each currency.
percent_change_7d: 7 day trading price percentage change for each currency.

This endpoint is available on the following API plans:

Basic
Hobbyist (1 month)
Startup (1 month)
Standard (3 month)
Professional (12 months)
Enterprise (Up to 6 years)
Cache / Update frequency: The last completed UTC day is available 30 minutes after midnight on the next UTC day.
Plan credit use: 1 call credit per 100 cryptocurrencies returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Our historical daily crypto ranking snapshot pages like this one on February 02, 2014.


PARAMETERS
Query Parameters ?
 date	
string Required
date (Unix or ISO 8601) to reference day of snapshot.

 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of items to return.

 limit	
integer [ 1 .. 5000 ]
100
Optionally specify the number of results to return. Use this parameter and the "start" parameter to determine your own pagination size.

 convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 sort	
string
"cmc_rank"
"cmc_rank""name""symbol""market_cap""price""circulating_supply""total_supply""max_supply""num_market_pairs""volume_24h""percent_change_1h""percent_change_24h""percent_change_7d"
What field to sort the list of cryptocurrencies by.

 sort_dir	
string
"asc""desc"
The direction in which to order cryptocurrencies against the specified sort.

 cryptocurrency_type	
string
"all"
"all""coins""tokens"
The type of cryptocurrency to include.

 aux	
string
"platform,tags,date_added,circulating_supply,total_supply,max_supply,cmc_rank,num_market_pairs"
Optionally specify a comma-separated list of supplemental data fields to return. Pass platform,tags,date_added,circulating_supply,total_supply,max_supply,cmc_rank,num_market_pairs to include all auxiliary fields.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Array of cryptocurrency objects matching the list options.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/cryptocurrency/listings/historical
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/historical

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": [
{
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"slug": "bitcoin",
"cmc_rank": 1,
"num_market_pairs": 500,
"circulating_supply": 17200062,
"total_supply": 17200062,
"max_supply": 21000000,
"last_updated": "2018-06-02T22:51:28.209Z",
"date_added": "2013-04-28T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"quote": {
"USD": {
"price": 9283.92,
"volume_24h": 7155680000,
"percent_change_1h": -0.152774,
"percent_change_24h": 0.518894,
"percent_change_7d": 0.986573,
"market_cap": 158055024432,
"last_updated": "2018-08-09T22:53:32.000Z"
},
"BTC": {
"price": 1,
"volume_24h": 772012,
"percent_change_1h": 0,
"percent_change_24h": 0,
"percent_change_7d": 0,
"market_cap": 17024600,
"last_updated": "2018-08-09T22:53:32.000Z"
}
}
},
{
"id": 1027,
"name": "Ethereum",
"symbol": "ETH",
"slug": "ethereum",
"num_market_pairs": 6089,
"circulating_supply": 17200062,
"total_supply": 17200062,
"max_supply": 21000000,
"last_updated": "2018-06-02T22:51:28.209Z",
"date_added": "2013-04-28T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"quote": {
"USD": {
"price": 1678.6501384942708,
"volume_24h": 7155680000,
"percent_change_1h": -0.152774,
"percent_change_24h": 0.518894,
"percent_change_7d": 0.986573,
"market_cap": 158055024432,
"last_updated": "2018-08-09T22:53:32.000Z"
},
"ETH": {
"price": 1,
"volume_24h": 772012,
"percent_change_1h": 0,
"percent_change_24h": 0,
"percent_change_7d": 0,
"market_cap": 17024600,
"last_updated": "2018-08-09T22:53:32.000Z"
}
}
}
],
"status": {
"timestamp": "2019-04-02T22:44:24.200Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1
}
}
Listings Latest
Returns a paginated list of all active cryptocurrencies with latest market data. The default "market_cap" sort returns cryptocurrency in order of CoinMarketCap's market cap rank (as outlined in our methodology) but you may configure this call to order by another market ranking field. Use the "convert" option to return market values in multiple fiat and cryptocurrency conversions in the same call.

You may sort against any of the following:
market_cap: CoinMarketCap's market cap rank as outlined in our methodology.
market_cap_strict: A strict market cap sort (latest trade price x circulating supply).
name: The cryptocurrency name.
symbol: The cryptocurrency symbol.
date_added: Date cryptocurrency was added to the system.
price: latest average trade price across markets.
circulating_supply: approximate number of coins currently in circulation.
total_supply: approximate total amount of coins in existence right now (minus any coins that have been verifiably burned).
max_supply: our best approximation of the maximum amount of coins that will ever exist in the lifetime of the currency.
num_market_pairs: number of market pairs across all exchanges trading each currency.
market_cap_by_total_supply_strict: market cap by total supply.
volume_24h: rolling 24 hour adjusted trading volume.
volume_7d: rolling 24 hour adjusted trading volume.
volume_30d: rolling 24 hour adjusted trading volume.
percent_change_1h: 1 hour trading price percentage change for each currency.
percent_change_24h: 24 hour trading price percentage change for each currency.
percent_change_7d: 7 day trading price percentage change for each currency.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Every 60 seconds.
Plan credit use: 1 call credit per 200 cryptocurrencies returned (rounded up) and 1 call credit per convert option beyond the first. CMC equivalent pages: Our latest cryptocurrency listing and ranking pages like coinmarketcap.com/all/views/all/, coinmarketcap.com/tokens/, coinmarketcap.com/gainers-losers/, coinmarketcap.com/new/.

NOTE: Use this endpoint if you need a sorted and paginated list of all cryptocurrencies. If you want to query for market data on a few specific cryptocurrencies use /v1/cryptocurrency/quotes/latest which is optimized for that purpose. The response data between these endpoints is otherwise the same.


PARAMETERS
Query Parameters ?
 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of items to return.

 limit	
integer [ 1 .. 5000 ]
100
Optionally specify the number of results to return. Use this parameter and the "start" parameter to determine your own pagination size.

 price_min	
number [ 0 .. 100000000000000000 ]
Optionally specify a threshold of minimum USD price to filter results by.

 price_max	
number [ 0 .. 100000000000000000 ]
Optionally specify a threshold of maximum USD price to filter results by.

 market_cap_min	
number [ 0 .. 100000000000000000 ]
Optionally specify a threshold of minimum market cap to filter results by.

 market_cap_max	
number [ 0 .. 100000000000000000 ]
Optionally specify a threshold of maximum market cap to filter results by.

 volume_24h_min	
number [ 0 .. 100000000000000000 ]
Optionally specify a threshold of minimum 24 hour USD volume to filter results by.

 volume_24h_max	
number [ 0 .. 100000000000000000 ]
Optionally specify a threshold of maximum 24 hour USD volume to filter results by.

 circulating_supply_min	
number [ 0 .. 100000000000000000 ]
Optionally specify a threshold of minimum circulating supply to filter results by.

 circulating_supply_max	
number [ 0 .. 100000000000000000 ]
Optionally specify a threshold of maximum circulating supply to filter results by.

 percent_change_24h_min	
number >= -100
Optionally specify a threshold of minimum 24 hour percent change to filter results by.

 percent_change_24h_max	
number >= -100
Optionally specify a threshold of maximum 24 hour percent change to filter results by.

 convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 sort	
string
"market_cap"
"name""symbol""date_added""market_cap""market_cap_strict""price""circulating_supply""total_supply""max_supply""num_market_pairs""volume_24h""percent_change_1h""percent_change_24h""percent_change_7d""market_cap_by_total_supply_strict""volume_7d""volume_30d"
What field to sort the list of cryptocurrencies by.

 sort_dir	
string
"asc""desc"
The direction in which to order cryptocurrencies against the specified sort.

 cryptocurrency_type	
string
"all"
"all""coins""tokens"
The type of cryptocurrency to include.

 tag	
string
"all"
"all""defi""filesharing"
The tag of cryptocurrency to include.

 aux	
string
"num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply"
Optionally specify a comma-separated list of supplemental data fields to return. Pass num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_market_cap_included_in_calc to include all auxiliary fields.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Array of cryptocurrency objects matching the list options.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/cryptocurrency/listings/latest
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": [
{
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"slug": "bitcoin",
"cmc_rank": 5,
"num_market_pairs": 500,
"circulating_supply": 16950100,
"total_supply": 16950100,
"max_supply": 21000000,
"infinite_supply": false,
"last_updated": "2018-06-02T22:51:28.209Z",
"date_added": "2013-04-28T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"self_reported_circulating_supply": null,
"self_reported_market_cap": null,
"quote": {
"USD": {
"price": 9283.92,
"volume_24h": 7155680000,
"volume_change_24h": -0.152774,
"percent_change_1h": -0.152774,
"percent_change_24h": 0.518894,
"percent_change_7d": 0.986573,
"market_cap": 852164659250.2758,
"market_cap_dominance": 51,
"fully_diluted_market_cap": 952835089431.14,
"last_updated": "2018-08-09T22:53:32.000Z"
},
"BTC": {
"price": 1,
"volume_24h": 772012,
"volume_change_24h": 0,
"percent_change_1h": 0,
"percent_change_24h": 0,
"percent_change_7d": 0,
"market_cap": 17024600,
"market_cap_dominance": 12,
"fully_diluted_market_cap": 952835089431.14,
"last_updated": "2018-08-09T22:53:32.000Z"
}
}
},
{
"id": 1027,
"name": "Ethereum",
"symbol": "ETH",
"slug": "ethereum",
"num_market_pairs": 6360,
"circulating_supply": 16950100,
"total_supply": 16950100,
"max_supply": 21000000,
"infinite_supply": false,
"last_updated": "2018-06-02T22:51:28.209Z",
"date_added": "2013-04-28T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"quote": {
"USD": {
"price": 1283.92,
"volume_24h": 7155680000,
"volume_change_24h": -0.152774,
"percent_change_1h": -0.152774,
"percent_change_24h": 0.518894,
"percent_change_7d": 0.986573,
"market_cap": 158055024432,
"market_cap_dominance": 51,
"fully_diluted_market_cap": 952835089431.14,
"last_updated": "2018-08-09T22:53:32.000Z"
},
"ETH": {
"price": 1,
"volume_24h": 772012,
"volume_change_24h": -0.152774,
"percent_change_1h": 0,
"percent_change_24h": 0,
"percent_change_7d": 0,
"market_cap": 17024600,
"market_cap_dominance": 12,
"fully_diluted_market_cap": 952835089431.14,
"last_updated": "2018-08-09T22:53:32.000Z"
}
}
}
],
"status": {
"timestamp": "2018-06-02T22:51:28.209Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1
}
}
Listings New
Returns a paginated list of most recently added cryptocurrencies.

This endpoint is available on the following API plans:

Startup
Standard
Professional
Enterprise
Cache / Update frequency: Every 60 seconds.
Plan credit use: 1 call credit per 200 cryptocurrencies returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Our "new" cryptocurrency page coinmarketcap.com/new/

NOTE: Use this endpoint if you need a sorted and paginated list of all recently added cryptocurrencies.


PARAMETERS
Query Parameters ?
 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of items to return.

 limit	
integer [ 1 .. 5000 ]
100
Optionally specify the number of results to return. Use this parameter and the "start" parameter to determine your own pagination size.

 convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 sort_dir	
string
"asc""desc"
The direction in which to order cryptocurrencies against the specified sort.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Array of cryptocurrency objects matching the list options.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/cryptocurrency/listings/new
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/new

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": [
{
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"slug": "bitcoin",
"cmc_rank": 5,
"num_market_pairs": 500,
"circulating_supply": 16950100,
"total_supply": 16950100,
"max_supply": 21000000,
"last_updated": "2018-06-02T22:51:28.209Z",
"date_added": "2013-04-28T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"quote": {
"USD": {
"price": 9283.92,
"volume_24h": 7155680000,
"volume_change_24h": -0.152774,
"percent_change_1h": -0.152774,
"percent_change_24h": 0.518894,
"percent_change_7d": 0.986573,
"market_cap": 852164659250.2758,
"market_cap_dominance": 51,
"fully_diluted_market_cap": 952835089431.14,
"last_updated": "2018-08-09T22:53:32.000Z"
},
"BTC": {
"price": 1,
"volume_24h": 772012,
"volume_change_24h": 0,
"percent_change_1h": 0,
"percent_change_24h": 0,
"percent_change_7d": 0,
"market_cap": 17024600,
"market_cap_dominance": 12,
"fully_diluted_market_cap": 952835089431.14,
"last_updated": "2018-08-09T22:53:32.000Z"
}
}
},
{
"id": 1027,
"name": "Ethereum",
"symbol": "ETH",
"slug": "ethereum",
"num_market_pairs": 6360,
"circulating_supply": 16950100,
"total_supply": 16950100,
"max_supply": 21000000,
"last_updated": "2018-06-02T22:51:28.209Z",
"date_added": "2013-04-28T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"quote": {
"USD": {
"price": 1283.92,
"volume_24h": 7155680000,
"volume_change_24h": -0.152774,
"percent_change_1h": -0.152774,
"percent_change_24h": 0.518894,
"percent_change_7d": 0.986573,
"market_cap": 158055024432,
"market_cap_dominance": 51,
"fully_diluted_market_cap": 952835089431.14,
"last_updated": "2018-08-09T22:53:32.000Z"
},
"ETH": {
"price": 1,
"volume_24h": 772012,
"volume_change_24h": -0.152774,
"percent_change_1h": 0,
"percent_change_24h": 0,
"percent_change_7d": 0,
"market_cap": 17024600,
"market_cap_dominance": 12,
"fully_diluted_market_cap": 952835089431.14,
"last_updated": "2018-08-09T22:53:32.000Z"
}
}
}
],
"status": {
"timestamp": "2018-06-02T22:51:28.209Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1
}
}
Trending Gainers & Losers
Returns a paginated list of all trending cryptocurrencies, determined and sorted by the largest price gains or losses.

You may sort against any of the following:
percent_change_24h: 24 hour trading price percentage change for each currency.

This endpoint is available on the following API plans:

Startup
Standard
Professional
Enterprise
Cache / Update frequency: Every 10 minutes.
Plan credit use: 1 call credit per 200 cryptocurrencies returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Our cryptocurrency Gainers & Losers page coinmarketcap.com/gainers-losers/.


PARAMETERS
Query Parameters ?
 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of items to return.

 limit	
integer [ 1 .. 1000 ]
100
Optionally specify the number of results to return. Use this parameter and the "start" parameter to determine your own pagination size.

 time_period	
string
"24h"
"1h""24h""30d""7d"
Adjusts the overall window of time for the biggest gainers and losers.

 convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 sort	
string
"percent_change_24h"
"percent_change_24h"
What field to sort the list of cryptocurrencies by.

 sort_dir	
string
"asc""desc"
The direction in which to order cryptocurrencies against the specified sort.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Array of cryptocurrency objects matching the list options.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/cryptocurrency/trending/gainers-losers
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/trending/gainers-losers

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": [
{
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"slug": "bitcoin",
"cmc_rank": 5,
"num_market_pairs": 500,
"circulating_supply": 16950100,
"total_supply": 16950100,
"max_supply": 21000000,
"last_updated": "2018-06-02T22:51:28.209Z",
"date_added": "2013-04-28T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"quote": {
"USD": {
"price": 9283.92,
"volume_24h": 7155680000,
"percent_change_1h": -0.152774,
"percent_change_24h": 0.518894,
"percent_change_7d": 0.986573,
"market_cap": 158055024432,
"last_updated": "2018-08-09T22:53:32.000Z"
},
"BTC": {
"price": 1,
"volume_24h": 772012,
"percent_change_1h": 0,
"percent_change_24h": 0,
"percent_change_7d": 0,
"market_cap": 17024600,
"last_updated": "2018-08-09T22:53:32.000Z"
}
}
},
{
"id": 1027,
"name": "Ethereum",
"symbol": "ETH",
"slug": "ethereum",
"num_market_pairs": 6360,
"circulating_supply": 16950100,
"total_supply": 16950100,
"max_supply": 21000000,
"last_updated": "2018-06-02T22:51:28.209Z",
"date_added": "2013-04-28T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"quote": {
"USD": {
"price": 1283.92,
"volume_24h": 7155680000,
"percent_change_1h": -0.152774,
"percent_change_24h": 0.518894,
"percent_change_7d": 0.986573,
"market_cap": 158055024432,
"last_updated": "2018-08-09T22:53:32.000Z"
},
"ETH": {
"price": 1,
"volume_24h": 772012,
"percent_change_1h": 0,
"percent_change_24h": 0,
"percent_change_7d": 0,
"market_cap": 17024600,
"last_updated": "2018-08-09T22:53:32.000Z"
}
}
}
],
"status": {
"timestamp": "2018-06-02T22:51:28.209Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1
}
}
Trending Latest
Returns a paginated list of all trending cryptocurrency market data, determined and sorted by CoinMarketCap search volume.

This endpoint is available on the following API plans:

Startup
Standard
Professional
Enterprise
Cache / Update frequency: Every 10 minutes.
Plan credit use: 1 call credit per 200 cryptocurrencies returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Our cryptocurrency Trending page coinmarketcap.com/trending-cryptocurrencies/.


PARAMETERS
Query Parameters ?
 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of items to return.

 limit	
integer [ 1 .. 1000 ]
100
Optionally specify the number of results to return. Use this parameter and the "start" parameter to determine your own pagination size.

 time_period	
string
"24h"
"24h""30d""7d"
Adjusts the overall window of time for the latest trending coins.

 convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Array of cryptocurrency objects matching the list options.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/cryptocurrency/trending/latest
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/trending/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": [
{
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"slug": "bitcoin",
"cmc_rank": 5,
"is_active": true,
"is_fiat": 0,
"self_reported_circulating_supply": null,
"self_reported_market_cap": null,
"num_market_pairs": 500,
"circulating_supply": 16950100,
"total_supply": 16950100,
"max_supply": 21000000,
"last_updated": "2018-06-02T22:51:28.209Z",
"date_added": "2013-04-28T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"quote": {
"USD": {
"price": 9283.92,
"volume_24h": 7155680000,
"percent_change_1h": -0.152774,
"percent_change_24h": 0.518894,
"percent_change_7d": 0.986573,
"market_cap": 158055024432,
"last_updated": "2018-08-09T22:53:32.000Z"
},
"BTC": {
"price": 1,
"volume_24h": 772012,
"percent_change_1h": 0,
"percent_change_24h": 0,
"percent_change_7d": 0,
"market_cap": 17024600,
"last_updated": "2018-08-09T22:53:32.000Z"
}
}
},
{
"id": 1027,
"name": "Ethereum",
"symbol": "ETH",
"slug": "ethereum",
"num_market_pairs": 6360,
"circulating_supply": 16950100,
"total_supply": 16950100,
"max_supply": 21000000,
"last_updated": "2018-06-02T22:51:28.209Z",
"date_added": "2013-04-28T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"quote": {
"USD": {
"price": 1283.92,
"volume_24h": 7155680000,
"percent_change_1h": -0.152774,
"percent_change_24h": 0.518894,
"percent_change_7d": 0.986573,
"market_cap": 158055024432,
"last_updated": "2018-08-09T22:53:32.000Z"
},
"ETH": {
"price": 1,
"volume_24h": 772012,
"percent_change_1h": 0,
"percent_change_24h": 0,
"percent_change_7d": 0,
"market_cap": 17024600,
"last_updated": "2018-08-09T22:53:32.000Z"
}
}
}
],
"status": {
"timestamp": "2018-06-02T22:51:28.209Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1
}
}
Trending Most Visited
Returns a paginated list of all trending cryptocurrency market data, determined and sorted by traffic to coin detail pages.

This endpoint is available on the following API plans:

Startup
Standard
Professional
Enterprise
Cache / Update frequency: Every 24 hours.
Plan credit use: 1 call credit per 200 cryptocurrencies returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: The CoinMarketCap “Most Visited” trending list. coinmarketcap.com/most-viewed-pages/.


PARAMETERS
Query Parameters ?
 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of items to return.

 limit	
integer [ 1 .. 1000 ]
100
Optionally specify the number of results to return. Use this parameter and the "start" parameter to determine your own pagination size.

 time_period	
string
"24h"
"24h""30d""7d"
Adjusts the overall window of time for most visited currencies.

 convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Array of cryptocurrency objects matching the list options.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/cryptocurrency/trending/most-visited
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/trending/most-visited

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": [
{
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"slug": "bitcoin",
"cmc_rank": 5,
"num_market_pairs": 500,
"circulating_supply": 16950100,
"total_supply": 16950100,
"max_supply": 21000000,
"last_updated": "2018-06-02T22:51:28.209Z",
"date_added": "2013-04-28T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"quote": {
"USD": {
"price": 9283.92,
"volume_24h": 7155680000,
"percent_change_1h": -0.152774,
"percent_change_24h": 0.518894,
"percent_change_7d": 0.986573,
"market_cap": 158055024432,
"last_updated": "2018-08-09T22:53:32.000Z"
},
"BTC": {
"price": 1,
"volume_24h": 772012,
"percent_change_1h": 0,
"percent_change_24h": 0,
"percent_change_7d": 0,
"market_cap": 17024600,
"last_updated": "2018-08-09T22:53:32.000Z"
}
}
},
{
"id": 1027,
"name": "Ethereum",
"symbol": "ETH",
"slug": "ethereum",
"num_market_pairs": 6360,
"circulating_supply": 16950100,
"total_supply": 16950100,
"max_supply": 21000000,
"last_updated": "2018-06-02T22:51:28.209Z",
"date_added": "2013-04-28T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"quote": {
"USD": {
"price": 1283.92,
"volume_24h": 7155680000,
"percent_change_1h": -0.152774,
"percent_change_24h": 0.518894,
"percent_change_7d": 0.986573,
"market_cap": 158055024432,
"last_updated": "2018-08-09T22:53:32.000Z"
},
"ETH": {
"price": 1,
"volume_24h": 772012,
"percent_change_1h": 0,
"percent_change_24h": 0,
"percent_change_7d": 0,
"market_cap": 17024600,
"last_updated": "2018-08-09T22:53:32.000Z"
}
}
}
],
"status": {
"timestamp": "2018-06-02T22:51:28.209Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1
}
}
Market Pairs Latest v2
Lists all active market pairs that CoinMarketCap tracks for a given cryptocurrency or fiat currency. All markets with this currency as the pair base or pair quote will be returned. The latest price and volume information is returned for each market. Use the "convert" option to return market values in multiple fiat and cryptocurrency conversions in the same call.

Please note: This documentation relates to our updated V2 endpoint, which may be incompatible with our V1 versions. Documentation for deprecated endpoints can be found here.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Every 1 minute.
Plan credit use: 1 call credit per 100 market pairs returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Our active cryptocurrency markets pages like coinmarketcap.com/currencies/bitcoin/#markets.


PARAMETERS
Query Parameters ?
 id	
string
A cryptocurrency or fiat currency by CoinMarketCap ID to list market pairs for. Example: "1"

 slug	
string
Alternatively pass a cryptocurrency by slug. Example: "bitcoin"

 symbol	
string
Alternatively pass a cryptocurrency by symbol. Fiat currencies are not supported by this field. Example: "BTC". A single cryptocurrency "id", "slug", or "symbol" is required.

 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of items to return.

 limit	
integer [ 1 .. 5000 ]
100
Optionally specify the number of results to return. Use this parameter and the "start" parameter to determine your own pagination size.

 sort_dir	
string
"desc"
"asc""desc"
Optionally specify the sort direction of markets returned.

 sort	
string
"volume_24h_strict"
"volume_24h_strict""cmc_rank""cmc_rank_advanced""effective_liquidity""market_score""market_reputation"
Optionally specify the sort order of markets returned. By default we return a strict sort on 24 hour reported volume. Pass cmc_rank to return a CMC methodology based sort where markets with excluded volumes are returned last.

 aux	
string
"num_market_pairs,category,fee_type"
Optionally specify a comma-separated list of supplemental data fields to return. Pass num_market_pairs,category,fee_type,market_url,currency_name,currency_slug,price_quote,notice,cmc_rank,effective_liquidity,market_score,market_reputation to include all auxiliary fields.

 matched_id	
string
Optionally include one or more fiat or cryptocurrency IDs to filter market pairs by. For example ?id=1&matched_id=2781 would only return BTC markets that matched: "BTC/USD" or "USD/BTC". This parameter cannot be used when matched_symbol is used.

 matched_symbol	
string
Optionally include one or more fiat or cryptocurrency symbols to filter market pairs by. For example ?symbol=BTC&matched_symbol=USD would only return BTC markets that matched: "BTC/USD" or "USD/BTC". This parameter cannot be used when matched_id is used.

 category	
string
"all"
"all""spot""derivatives""otc""perpetual"
The category of trading this market falls under. Spot markets are the most common but options include derivatives and OTC.

 fee_type	
string
"all"
"all""percentage""no-fees""transactional-mining""unknown"
The fee type the exchange enforces for this market.

 convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results of your query returned as an object.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v2/cryptocurrency/market-pairs/latest
Server URL

https://pro-api.coinmarketcap.com/v2/cryptocurrency/market-pairs/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"num_market_pairs": 7526,
"market_pairs": [
{
"exchange": {
"id": 157,
"name": "BitMEX",
"slug": "bitmex"
},
"market_id": 4902,
"market_pair": "BTC/USD",
"category": "derivatives",
"fee_type": "no-fees",
"market_pair_base": {
"currency_id": 1,
"currency_symbol": "BTC",
"exchange_symbol": "XBT",
"currency_type": "cryptocurrency"
},
"market_pair_quote": {
"currency_id": 2781,
"currency_symbol": "USD",
"exchange_symbol": "USD",
"currency_type": "fiat"
},
"quote": {
"exchange_reported": {
"price": 7839,
"volume_24h_base": 434215.85308502,
"volume_24h_quote": 3403818072.33347,
"last_updated": "2019-05-24T02:39:00.000Z"
},
"USD": {
"price": 7839,
"volume_24h": 3403818072.33347,
"last_updated": "2019-05-24T02:39:00.000Z"
}
}
},
{
"exchange": {
"id": 108,
"name": "Negocie Coins",
"slug": "negocie-coins"
},
"market_id": 3377,
"market_pair": "BTC/BRL",
"category": "spot",
"fee_type": "percentage",
"market_pair_base": {
"currency_id": 1,
"currency_symbol": "BTC",
"exchange_symbol": "BTC",
"currency_type": "cryptocurrency"
},
"market_pair_quote": {
"currency_id": 2783,
"currency_symbol": "BRL",
"exchange_symbol": "BRL",
"currency_type": "fiat"
},
"quote": {
"exchange_reported": {
"price": 33002.11,
"volume_24h_base": 336699.03559957,
"volume_24h_quote": 11111778609.7509,
"last_updated": "2019-05-24T02:39:00.000Z"
},
"USD": {
"price": 8165.02539531659,
"volume_24h": 2749156176.2491,
"last_updated": "2019-05-24T02:39:00.000Z"
}
}
}
]
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
OHLCV Historical v2
Returns historical OHLCV (Open, High, Low, Close, Volume) data along with market cap for any cryptocurrency using time interval parameters. Currently daily and hourly OHLCV periods are supported. Volume is not currently supported for hourly OHLCV intervals before 2020-09-22.

Please note: This documentation relates to our updated V2 endpoint, which may be incompatible with our V1 versions. Documentation for deprecated endpoints can be found here.


Technical Notes

Only the date portion of the timestamp is used for daily OHLCV so it's recommended to send an ISO date format like "2018-09-19" without time for this "time_period".
One OHLCV quote will be returned for every "time_period" between your "time_start" (exclusive) and "time_end" (inclusive).
If a "time_start" is not supplied, the "time_period" will be calculated in reverse from "time_end" using the "count" parameter which defaults to 10 results.
If "time_end" is not supplied, it defaults to the current time.
If you don't need every "time_period" between your dates you may adjust the frequency that "time_period" is sampled using the "interval" parameter. For example with "time_period" set to "daily" you may set "interval" to "2d" to get the daily OHLCV for every other day. You could set "interval" to "monthly" to get the first daily OHLCV for each month, or set it to "yearly" to get the daily OHLCV value against the same date every year.
Implementation Tips

If querying for a specific OHLCV date your "time_start" should specify a timestamp of 1 interval prior as "time_start" is an exclusive time parameter (as opposed to "time_end" which is inclusive to the search). This means that when you pass a "time_start" results will be returned for the next complete "time_period". For example, if you are querying for a daily OHLCV datapoint for 2018-11-30 your "time_start" should be "2018-11-29".
If only specifying a "count" parameter to return latest OHLCV periods, your "count" should be 1 number higher than the number of results you expect to receive. "Count" defines the number of "time_period" intervals queried, not the number of results to return, and this includes the currently active time period which is incomplete when working backwards from current time. For example, if you want the last daily OHLCV value available simply pass "count=2" to skip the incomplete active time period.
This endpoint supports requesting multiple cryptocurrencies in the same call. Please note the API response will be wrapped in an additional object in this case.
Interval Options

There are 2 types of time interval formats that may be used for "time_period" and "interval" parameters. For "time_period" these return aggregate OHLCV data from the beginning to end of each interval period. Apply these time intervals to "interval" to adjust how frequently "time_period" is sampled.

The first are calendar year and time constants in UTC time:
"hourly" - Hour intervals in UTC.
"daily" - Calendar day intervals for each UTC day.
"weekly" - Calendar week intervals for each calendar week.
"monthly" - Calendar month intervals for each calendar month.
"yearly" - Calendar year intervals for each calendar year.

The second are relative time intervals.
"h": Get the first quote available every "h" hours (3600 second intervals). Supported hour intervals are: "1h", "2h", "3h", "4h", "6h", "12h".
"d": Time periods that repeat every "d" days (86400 second intervals). Supported day intervals are: "1d", "2d", "3d", "7d", "14d", "15d", "30d", "60d", "90d", "365d".

Please note that "time_period" currently supports the "daily" and "hourly" options. "interval" supports all interval options.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup (1 month)
Standard (3 months)
Professional (12 months)
Enterprise (Up to 6 years)
Cache / Update frequency: Latest Daily OHLCV record is available ~5 to ~10 minutes after each midnight UTC. The latest hourly OHLCV record is available 5 minutes after each UTC hour.
Plan credit use: 1 call credit per 100 OHLCV data points returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Our historical cryptocurrency data pages like coinmarketcap.com/currencies/bitcoin/historical-data/.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated CoinMarketCap cryptocurrency IDs. Example: "1,1027"

 slug	
string
Alternatively pass a comma-separated list of cryptocurrency slugs. Example: "bitcoin,ethereum"

 symbol	
string
Alternatively pass one or more comma-separated cryptocurrency symbols. Example: "BTC,ETH". At least one "id" or "slug" or "symbol" is required for this request.

 time_period	
string
"daily"
"daily""hourly"
Time period to return OHLCV data for. The default is "daily". If hourly, the open will be 01:00 and the close will be 01:59. If daily, the open will be 00:00:00 for the day and close will be 23:59:99 for the same day. See the main endpoint description for details.

 time_start	
string
Timestamp (Unix or ISO 8601) to start returning OHLCV time periods for. Only the date portion of the timestamp is used for daily OHLCV so it's recommended to send an ISO date format like "2018-09-19" without time.

 time_end	
string
Timestamp (Unix or ISO 8601) to stop returning OHLCV time periods for (inclusive). Optional, if not passed we'll default to the current time. Only the date portion of the timestamp is used for daily OHLCV so it's recommended to send an ISO date format like "2018-09-19" without time.

 count	
number [ 1 .. 10000 ]
10
Optionally limit the number of time periods to return results for. The default is 10 items. The current query limit is 10000 items.

 interval	
string
"daily"
"hourly""daily""weekly""monthly""yearly""1h""2h""3h""4h""6h""12h""1d""2d""3d""7d""14d""15d""30d""60d""90d""365d"
Optionally adjust the interval that "time_period" is sampled. For example with interval=monthly&time_period=daily you will see a daily OHLCV record for January, February, March and so on. See main endpoint description for available options.

 convert	
string
By default market quotes are returned in USD. Optionally calculate market quotes in up to 3 fiat currencies or cryptocurrencies.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 skip_invalid	
boolean
true
Pass true to relax request validation rules. When requesting records on multiple cryptocurrencies an error is returned if any invalid cryptocurrencies are requested or a cryptocurrency does not have matching records in the requested timeframe. If set to true, invalid lookups will be skipped allowing valid cryptocurrencies to still be returned.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results of your query returned as an object.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v2/cryptocurrency/ohlcv/historical
Server URL

https://pro-api.coinmarketcap.com/v2/cryptocurrency/ohlcv/historical

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"quotes": [
{
"time_open": "2019-01-02T00:00:00.000Z",
"time_close": "2019-01-02T23:59:59.999Z",
"time_high": "2019-01-02T03:53:00.000Z",
"time_low": "2019-01-02T02:43:00.000Z",
"quote": {
"USD": {
"open": 3849.21640853,
"high": 3947.9812729,
"low": 3817.40949569,
"close": 3943.40933686,
"volume": 5244856835.70851,
"market_cap": 68849856731.6738,
"timestamp": "2019-01-02T23:59:59.999Z"
}
}
},
{
"time_open": "2019-01-03T00:00:00.000Z",
"time_close": "2019-01-03T23:59:59.999Z",
"time_high": "2019-01-02T03:53:00.000Z",
"time_low": "2019-01-02T02:43:00.000Z",
"quote": {
"USD": {
"open": 3931.04863841,
"high": 3935.68513083,
"low": 3826.22287069,
"close": 3836.74131867,
"volume": 4530215218.84018,
"market_cap": 66994920902.7202,
"timestamp": "2019-01-03T23:59:59.999Z"
}
}
}
]
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
OHLCV Latest v2
Returns the latest OHLCV (Open, High, Low, Close, Volume) market values for one or more cryptocurrencies for the current UTC day. Since the current UTC day is still active these values are updated frequently. You can find the final calculated OHLCV values for the last completed UTC day along with all historic days using /cryptocurrency/ohlcv/historical.

Please note: This documentation relates to our updated V2 endpoint, which may be incompatible with our V1 versions. Documentation for deprecated endpoints can be found here.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Every 10 minutes. Additional OHLCV intervals and 1 minute updates will be available in the future.
Plan credit use: 1 call credit per 100 OHLCV values returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: No equivalent, this data is only available via API.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated cryptocurrency CoinMarketCap IDs. Example: 1,2

 symbol	
string
Alternatively pass one or more comma-separated cryptocurrency symbols. Example: "BTC,ETH". At least one "id" or "symbol" is required.

 convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 skip_invalid	
boolean
true
Pass true to relax request validation rules. When requesting records on multiple cryptocurrencies an error is returned if any invalid cryptocurrencies are requested or a cryptocurrency does not have matching records in the requested timeframe. If set to true, invalid lookups will be skipped allowing valid cryptocurrencies to still be returned.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
A map of cryptocurrency objects by ID or symbol (as passed in query parameters).

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v2/cryptocurrency/ohlcv/latest
Server URL

https://pro-api.coinmarketcap.com/v2/cryptocurrency/ohlcv/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"1": {
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"last_updated": "2018-09-10T18:54:00.000Z",
"time_open": "2018-09-10T00:00:00.000Z",
"time_close": null,
"time_high": "2018-09-10T00:00:00.000Z",
"time_low": "2018-09-10T00:00:00.000Z",
"quote": {
"USD": {
"open": 6301.57,
"high": 6374.98,
"low": 6292.76,
"close": 6308.76,
"volume": 3786450000,
"last_updated": "2018-09-10T18:54:00.000Z"
}
}
}
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Price Performance Stats v2
Returns price performance statistics for one or more cryptocurrencies including launch price ROI and all-time high / all-time low. Stats are returned for an all_time period by default. UTC yesterday and a number of rolling time periods may be requested using the time_period parameter. Utilize the convert parameter to translate values into multiple fiats or cryptocurrencies using historical rates.

Please note: This documentation relates to our updated V2 endpoint, which may be incompatible with our V1 versions. Documentation for deprecated endpoints can be found here.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Every 60 seconds.
Plan credit use: 1 call credit per 100 cryptocurrencies returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: The statistics module displayed on cryptocurrency pages like Bitcoin.

NOTE: You may also use /cryptocurrency/ohlcv/historical for traditional OHLCV data at historical daily and hourly intervals. You may also use /v1/cryptocurrency/ohlcv/latest for OHLCV data for the current UTC day.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated cryptocurrency CoinMarketCap IDs. Example: 1,2

 slug	
string
Alternatively pass a comma-separated list of cryptocurrency slugs. Example: "bitcoin,ethereum"

 symbol	
string
Alternatively pass one or more comma-separated cryptocurrency symbols. Example: "BTC,ETH". At least one "id" or "slug" or "symbol" is required for this request.

 time_period	
string
"all_time"
Specify one or more comma-delimited time periods to return stats for. all_time is the default. Pass all_time,yesterday,24h,7d,30d,90d,365d to return all supported time periods. All rolling periods have a rolling close time of the current request time. For example 24h would have a close time of now and an open time of 24 hours before now. Please note: yesterday is a UTC period and currently does not currently support high and low timestamps.

 convert	
string
Optionally calculate quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 skip_invalid	
boolean
true
Pass true to relax request validation rules. When requesting records on multiple cryptocurrencies an error is returned if no match is found for 1 or more requested cryptocurrencies. If set to true, invalid lookups will be skipped allowing valid cryptocurrencies to still be returned.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
An object map of cryptocurrency objects by ID, slug, or symbol (as used in query parameters).

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v2/cryptocurrency/price-performance-stats/latest
Server URL

https://pro-api.coinmarketcap.com/v2/cryptocurrency/price-performance-stats/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"1": {
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"slug": "bitcoin",
"last_updated": "2019-08-22T01:51:32.000Z",
"periods": {
"all_time": {
"open_timestamp": "2013-04-28T00:00:00.000Z",
"high_timestamp": "2017-12-17T12:19:14.000Z",
"low_timestamp": "2013-07-05T18:56:01.000Z",
"close_timestamp": "2019-08-22T01:52:18.613Z",
"quote": {
"USD": {
"open": 135.3000030517578,
"open_timestamp": "2013-04-28T00:00:00.000Z",
"high": 20088.99609375,
"high_timestamp": "2017-12-17T12:19:14.000Z",
"low": 65.5260009765625,
"low_timestamp": "2013-07-05T18:56:01.000Z",
"close": 65.5260009765625,
"close_timestamp": "2019-08-22T01:52:18.618Z",
"percent_change": 7223.718930042746,
"price_change": 9773.691932798241
}
}
}
}
}
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Quotes Historical v2
Returns an interval of historic market quotes for any cryptocurrency based on time and interval parameters.

Please note: This documentation relates to our updated V2 endpoint, which may be incompatible with our V1 versions. Documentation for deprecated endpoints can be found here.

Technical Notes

A historic quote for every "interval" period between your "time_start" and "time_end" will be returned.
If a "time_start" is not supplied, the "interval" will be applied in reverse from "time_end".
If "time_end" is not supplied, it defaults to the current time.
At each "interval" period, the historic quote that is closest in time to the requested time will be returned.
If no historic quotes are available in a given "interval" period up until the next interval period, it will be skipped.
Implementation Tips

Want to get the last quote of each UTC day? Don't use "interval=daily" as that returns the first quote. Instead use "interval=24h" to repeat a specific timestamp search every 24 hours and pass ex. "time_start=2019-01-04T23:59:00.000Z" to query for the last record of each UTC day.
This endpoint supports requesting multiple cryptocurrencies in the same call. Please note the API response will be wrapped in an additional object in this case.
Interval Options
There are 2 types of time interval formats that may be used for "interval".

The first are calendar year and time constants in UTC time:
"hourly" - Get the first quote available at the beginning of each calendar hour.
"daily" - Get the first quote available at the beginning of each calendar day.
"weekly" - Get the first quote available at the beginning of each calendar week.
"monthly" - Get the first quote available at the beginning of each calendar month.
"yearly" - Get the first quote available at the beginning of each calendar year.

The second are relative time intervals.
"m": Get the first quote available every "m" minutes (60 second intervals). Supported minutes are: "5m", "10m", "15m", "30m", "45m".
"h": Get the first quote available every "h" hours (3600 second intervals). Supported hour intervals are: "1h", "2h", "3h", "4h", "6h", "12h".
"d": Get the first quote available every "d" days (86400 second intervals). Supported day intervals are: "1d", "2d", "3d", "7d", "14d", "15d", "30d", "60d", "90d", "365d".

This endpoint is available on the following API plans:

Basic
Hobbyist (1 month)
Startup (1 month)
Standard (3 month)
Professional (12 months)
Enterprise (Up to 6 years)
Cache / Update frequency: Every 5 minutes.
Plan credit use: 1 call credit per 100 historical data points returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Our historical cryptocurrency charts like coinmarketcap.com/currencies/bitcoin/#charts.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated CoinMarketCap cryptocurrency IDs. Example: "1,2"

 symbol	
string
Alternatively pass one or more comma-separated cryptocurrency symbols. Example: "BTC,ETH". At least one "id" or "symbol" is required for this request.

 time_start	
string
Timestamp (Unix or ISO 8601) to start returning quotes for. Optional, if not passed, we'll return quotes calculated in reverse from "time_end".

 time_end	
string
Timestamp (Unix or ISO 8601) to stop returning quotes for (inclusive). Optional, if not passed, we'll default to the current time. If no "time_start" is passed, we return quotes in reverse order starting from this time.

 count	
number [ 1 .. 10000 ]
10
The number of interval periods to return results for. Optional, required if both "time_start" and "time_end" aren't supplied. The default is 10 items. The current query limit is 10000.

 interval	
string
"5m"
"yearly""monthly""weekly""daily""hourly""5m""10m""15m""30m""45m""1h""2h""3h""4h""6h""12h""24h""1d""2d""3d""7d""14d""15d""30d""60d""90d""365d"
Interval of time to return data points for. See details in endpoint description.

 convert	
string
By default market quotes are returned in USD. Optionally calculate market quotes in up to 3 other fiat currencies or cryptocurrencies.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 aux	
string
"price,volume,market_cap,circulating_supply,total_supply,quote_timestamp,is_active,is_fiat"
Optionally specify a comma-separated list of supplemental data fields to return. Pass price,volume,market_cap,circulating_supply,total_supply,quote_timestamp,is_active,is_fiat,search_interval to include all auxiliary fields.

 skip_invalid	
boolean
true
Pass true to relax request validation rules. When requesting records on multiple cryptocurrencies an error is returned if no match is found for 1 or more requested cryptocurrencies. If set to true, invalid lookups will be skipped allowing valid cryptocurrencies to still be returned.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results of your query returned as an object map.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v2/cryptocurrency/quotes/historical
Server URL

https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/historical

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"is_active": 1,
"is_fiat": 0,
"quotes": [
{
"timestamp": "2018-06-22T19:29:37.000Z",
"quote": {
"USD": {
"price": 6242.29,
"volume_24h": 4681670000,
"market_cap": 106800038746.48,
"circulating_supply": 4681670000,
"total_supply": 4681670000,
"timestamp": "2018-06-22T19:29:37.000Z"
}
}
},
{
"timestamp": "2018-06-22T19:34:33.000Z",
"quote": {
"USD": {
"price": 6242.82,
"volume_24h": 4682330000,
"market_cap": 106809106575.84,
"circulating_supply": 4681670000,
"total_supply": 4681670000,
"timestamp": "2018-06-22T19:34:33.000Z"
}
}
}
]
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Quotes Latest v2
Returns the latest market quote for 1 or more cryptocurrencies. Use the "convert" option to return market values in multiple fiat and cryptocurrency conversions in the same call.

Please note: This documentation relates to our updated V2 endpoint, which may be incompatible with our V1 versions. Documentation for deprecated endpoints can be found here.

This endpoint is available on the following API plans:

Basic
Startup
Hobbyist
Standard
Professional
Enterprise
Cache / Update frequency: Every 60 seconds.
Plan credit use: 1 call credit per 100 cryptocurrencies returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Latest market data pages for specific cryptocurrencies like coinmarketcap.com/currencies/bitcoin/.

NOTE: Use this endpoint to request the latest quote for specific cryptocurrencies. If you need to request all cryptocurrencies use /v1/cryptocurrency/listings/latest which is optimized for that purpose. The response data between these endpoints is otherwise the same.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated cryptocurrency CoinMarketCap IDs. Example: 1,2

 slug	
string
Alternatively pass a comma-separated list of cryptocurrency slugs. Example: "bitcoin,ethereum"

 symbol	
string
Alternatively pass one or more comma-separated cryptocurrency symbols. Example: "BTC,ETH". At least one "id" or "slug" or "symbol" is required for this request.

 convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 aux	
string
"num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,is_active,is_fiat"
Optionally specify a comma-separated list of supplemental data fields to return. Pass num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_active,is_fiat to include all auxiliary fields.

 skip_invalid	
boolean
true
Pass true to relax request validation rules. When requesting records on multiple cryptocurrencies an error is returned if no match is found for 1 or more requested cryptocurrencies. If set to true, invalid lookups will be skipped allowing valid cryptocurrencies to still be returned.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
A map of cryptocurrency objects by ID, symbol, or slug (as used in query parameters).

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v2/cryptocurrency/quotes/latest
Server URL

https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"1": {
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"slug": "bitcoin",
"is_active": 1,
"is_fiat": 0,
"circulating_supply": 17199862,
"total_supply": 17199862,
"max_supply": 21000000,
"date_added": "2013-04-28T00:00:00.000Z",
"num_market_pairs": 331,
"cmc_rank": 1,
"last_updated": "2018-08-09T21:56:28.000Z",
"tags": [
"mineable"
],
"platform": null,
"self_reported_circulating_supply": null,
"self_reported_market_cap": null,
"quote": {
"USD": {
"price": 6602.60701122,
"volume_24h": 4314444687.5194,
"volume_change_24h": -0.152774,
"percent_change_1h": 0.988615,
"percent_change_24h": 4.37185,
"percent_change_7d": -12.1352,
"percent_change_30d": -12.1352,
"market_cap": 852164659250.2758,
"market_cap_dominance": 51,
"fully_diluted_market_cap": 952835089431.14,
"last_updated": "2018-08-09T21:56:28.000Z"
}
}
}
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Quotes Historical v3
Returns an interval of historic market quotes for any cryptocurrency based on time and interval parameters.

Please note: This documentation relates to our updated V3 endpoint, which may be incompatible with our V1 versions. Documentation for deprecated endpoints can be found here.

Technical Notes

A historic quote for every "interval" period between your "time_start" and "time_end" will be returned.
If a "time_start" is not supplied, the "interval" will be applied in reverse from "time_end".
If "time_end" is not supplied, it defaults to the current time.
At each "interval" period, the historic quote that is closest in time to the requested time will be returned.
If no historic quotes are available in a given "interval" period up until the next interval period, it will be skipped.
Implementation Tips

Want to get the last quote of each UTC day? Don't use "interval=daily" as that returns the first quote. Instead use "interval=24h" to repeat a specific timestamp search every 24 hours and pass ex. "time_start=2019-01-04T23:59:00.000Z" to query for the last record of each UTC day.
This endpoint supports requesting multiple cryptocurrencies in the same call. Please note the API response will be wrapped in an additional object in this case.
Interval Options
There are 2 types of time interval formats that may be used for "interval".

The first are calendar year and time constants in UTC time:
"hourly" - Get the first quote available at the beginning of each calendar hour.
"daily" - Get the first quote available at the beginning of each calendar day.
"weekly" - Get the first quote available at the beginning of each calendar week.
"monthly" - Get the first quote available at the beginning of each calendar month.
"yearly" - Get the first quote available at the beginning of each calendar year.

The second are relative time intervals.
"m": Get the first quote available every "m" minutes (60 second intervals). Supported minutes are: "5m", "10m", "15m", "30m", "45m".
"h": Get the first quote available every "h" hours (3600 second intervals). Supported hour intervals are: "1h", "2h", "3h", "4h", "6h", "12h".
"d": Get the first quote available every "d" days (86400 second intervals). Supported day intervals are: "1d", "2d", "3d", "7d", "14d", "15d", "30d", "60d", "90d", "365d".

This endpoint is available on the following API plans:

Basic
Hobbyist (1 month)
Startup (1 month)
Standard (3 month)
Professional (12 months)
Enterprise (Up to 6 years)
Cache / Update frequency: Every 5 minutes.
Plan credit use: 1 call credit per 100 historical data points returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Our historical cryptocurrency charts like coinmarketcap.com/currencies/bitcoin/#charts.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated CoinMarketCap cryptocurrency IDs. Example: "1,2"

 symbol	
string
Alternatively pass one or more comma-separated cryptocurrency symbols. Example: "BTC,ETH". At least one "id" or "symbol" is required for this request.

 time_start	
string
Timestamp (Unix or ISO 8601) to start returning quotes for. Optional, if not passed, we'll return quotes calculated in reverse from "time_end".

 time_end	
string
Timestamp (Unix or ISO 8601) to stop returning quotes for (inclusive). Optional, if not passed, we'll default to the current time. If no "time_start" is passed, we return quotes in reverse order starting from this time.

 count	
number [ 1 .. 10000 ]
10
The number of interval periods to return results for. Optional, required if both "time_start" and "time_end" aren't supplied. The default is 10 items. The current query limit is 10000.

 interval	
string
"5m"
"yearly""monthly""weekly""daily""hourly""5m""10m""15m""30m""45m""1h""2h""3h""4h""6h""12h""24h""1d""2d""3d""7d""14d""15d""30d""60d""90d""365d"
Interval of time to return data points for. See details in endpoint description.

 convert	
string
By default market quotes are returned in USD. Optionally calculate market quotes in up to 3 other fiat currencies or cryptocurrencies.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 aux	
string
"price,volume,market_cap,circulating_supply,total_supply,quote_timestamp,is_active,is_fiat"
Optionally specify a comma-separated list of supplemental data fields to return. Pass price,volume,market_cap,circulating_supply,total_supply,quote_timestamp,is_active,is_fiat,search_interval to include all auxiliary fields.

 skip_invalid	
boolean
true
Pass true to relax request validation rules. When requesting records on multiple cryptocurrencies an error is returned if no match is found for 1 or more requested cryptocurrencies. If set to true, invalid lookups will be skipped allowing valid cryptocurrencies to still be returned.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results of your query returned as an object map.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v3/cryptocurrency/quotes/historical
Server URL

https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/historical

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"is_active": 1,
"is_fiat": 0,
"quotes": [
{
"timestamp": "2018-06-22T19:29:37.000Z",
"quote": {
"USD": {
"price": 6242.29,
"volume_24h": 4681670000,
"market_cap": 106800038746.48,
"circulating_supply": 4681670000,
"total_supply": 4681670000,
"timestamp": "2018-06-22T19:29:37.000Z"
}
}
},
{
"timestamp": "2018-06-22T19:34:33.000Z",
"quote": {
"USD": {
"price": 6242.82,
"volume_24h": 4682330000,
"market_cap": 106809106575.84,
"circulating_supply": 4681670000,
"total_supply": 4681670000,
"timestamp": "2018-06-22T19:34:33.000Z"
}
}
}
]
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Fiat
API endpoints for fiat currencies. This category currently includes 1 endpoint:
/v1/fiat/map - CoinMarketCap ID map

CoinMarketCap ID Map
Returns a mapping of all supported fiat currencies to unique CoinMarketCap ids. Per our Best Practices we recommend utilizing CMC ID instead of currency symbols to securely identify assets with our other endpoints and in your own application logic.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Mapping data is updated only as needed, every 30 seconds.
Plan credit use: 1 API call credit per request no matter query size.
CMC equivalent pages: No equivalent, this data is only available via API.


PARAMETERS
Query Parameters ?
 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of items to return.

 limit	
integer [ 1 .. 5000 ]
Optionally specify the number of results to return. Use this parameter and the "start" parameter to determine your own pagination size.

 sort	
string
"id"
"name""id"
What field to sort the list by.

 include_metals	
boolean
false
Pass true to include precious metals.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Array of fiat object results.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/fiat/map
Server URL

https://pro-api.coinmarketcap.com/v1/fiat/map

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": [
{
"id": 2781,
"name": "United States Dollar",
"sign": "$",
"symbol": "USD"
},
{
"id": 2787,
"name": "Chinese Yuan",
"sign": "¥",
"symbol": "CNY"
},
{
"id": 2781,
"name": "South Korean Won",
"sign": "₩",
"symbol": "KRW"
}
],
"status": {
"timestamp": "2020-01-07T22:51:28.209Z",
"error_code": 0,
"error_message": "",
"elapsed": 3,
"credit_count": 1
}
}
Exchange
API endpoints for cryptocurrency exchanges. This category currently includes 7 endpoints:
/v1/exchange/map - CoinMarketCap ID map
/v1/exchange/info - Metadata
/v1/exchange/listings/latest - Latest listings
/v1/exchange/quotes/latest - Latest quotes
/v1/exchange/quotes/historical - Historical quotes
/v1/exchange/market-pairs/latest - Latest market pairs
/v1/exchange/assets - Exchange Assets

Exchange Assets
Returns the exchange assets in the form of token holdings. This information includes details like wallet address, cryptocurrency, blockchain platform, balance, and etc.

Only wallets containing at least 100,000 USD in balance are shown
Balances from wallets might be delayed
** Disclaimer: All information and data relating to the holdings in the third-party wallet addresses are provided by the third parties to CoinMarketCap, and CoinMarketCap does not confirm or verify the accuracy or timeliness of such information and data. The information and data are provided "as is" without warranty of any kind. CoinMarketCap shall have no responsibility or liability for these third parties’ information and data or have the duty to review, confirm, verify or otherwise perform any inquiry or investigation as to the completeness, accuracy, sufficiency, integrity, reliability or timeliness of any such information or data provided.

This endpoint is available on the following API plans:

Free
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Balance data is updated statically based on the source. Price data is updated every 5 minutes.
Plan credit use: 1 credit.
CMC equivalent pages: Exchange detail page like coinmarketcap.com/exchanges/binance/


PARAMETERS
Query Parameters ?
 id	
string
A CoinMarketCap exchange ID. Example: 270

Responses
200 Successful

RESPONSE SCHEMA
 data 	
 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/exchange/assets
Server URL

https://pro-api.coinmarketcap.com/v1/exchange/assets

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"status": {
"timestamp": "2022-11-24T08:23:22.028Z",
"error_code": 0,
"error_message": null,
"elapsed": 1828,
"credit_count": 0,
"notice": null
},
"data": [
{
"wallet_address": "0x5a52e96bacdabb82fd05763e25335261b270efcb",
"balance": 45000000,
"platform": {
"crypto_id": 1027,
"symbol": "ETH",
"name": "Ethereum"
},
"currency": {
"crypto_id": 5117,
"price_usd": 0.10241799413549,
"symbol": "OGN",
"name": "Origin Protocol"
}
},
{
"wallet_address": "0xf977814e90da44bfa03b6295a0616a897441acec",
"balance": 400000000,
"platform": {
"crypto_id": 1027,
"symbol": "ETH",
"name": "Ethereum"
},
"currency": {
"crypto_id": 5824,
"price_usd": 0.00251174724338,
"symbol": "SLP",
"name": "Smooth Love Potion"
}
},
{
"wallet_address": "0x5a52e96bacdabb82fd05763e25335261b270efcb",
"balance": 5588175,
"platform": {
"crypto_id": 1027,
"symbol": "ETH",
"name": "Ethereum"
},
"currency": {
"crypto_id": 3928,
"price_usd": 0.04813245442357,
"symbol": "IDEX",
"name": "IDEX"
}
},
{
"wallet_address": "0x5a52e96bacdabb82fd05763e25335261b270efcb",
"balance": 125000,
"platform": {
"crypto_id": 1027,
"symbol": "ETH",
"name": "Ethereum"
},
"currency": {
"crypto_id": 1552,
"price_usd": 20.46545919550142,
"symbol": "MLN",
"name": "Enzyme"
}
},
{
"wallet_address": "0x21a31ee1afc51d94c2efccaa2092ad1028285549",
"balance": 27241191.98,
"platform": {
"crypto_id": 1027,
"symbol": "ETH",
"name": "Ethereum"
},
"currency": {
"crypto_id": 14806,
"price_usd": 0.02390427295165,
"symbol": "PEOPLE",
"name": "ConstitutionDAO"
}
}
]
}
Metadata
Returns all static metadata for one or more exchanges. This information includes details like launch date, logo, official website URL, social links, and market fee documentation URL.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Static data is updated only as needed, every 30 seconds.
Plan credit use: 1 call credit per 100 exchanges returned (rounded up).
CMC equivalent pages: Exchange detail page metadata like coinmarketcap.com/exchanges/binance/.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated CoinMarketCap cryptocurrency exchange ids. Example: "1,2"

 slug	
string
Alternatively, one or more comma-separated exchange names in URL friendly shorthand "slug" format (all lowercase, spaces replaced with hyphens). Example: "binance,gdax". At least one "id" or "slug" is required.

 aux	
string
"urls,logo,description,date_launched,notice"
Optionally specify a comma-separated list of supplemental data fields to return. Pass urls,logo,description,date_launched,notice,status to include all auxiliary fields.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results of your query returned as an object map.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/exchange/info
Server URL

https://pro-api.coinmarketcap.com/v1/exchange/info

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"270": {
"id": 270,
"name": "Binance",
"slug": "binance",
"logo": "https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png",
"description": "Launched in Jul-2017, Binance is a centralized exchange based in Malta.",
"date_launched": "2017-07-14T00:00:00.000Z",
"notice": null,
"countries": [ ],
"fiats": [
"AED",
"USD"
],
"tags": null,
"type": "",
"maker_fee": 0.02,
"taker_fee": 0.04,
"weekly_visits": 5123451,
"spot_volume_usd": 66926283498.60113,
"spot_volume_last_updated": "2021-05-06T01:20:15.451Z",
"urls": {
"website": [
"https://www.binance.com/"
],
"twitter": [
"https://twitter.com/binance"
],
"blog": [ ],
"chat": [
"https://t.me/binanceexchange"
],
"fee": [
"https://www.binance.com/fees.html"
]
}
}
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
CoinMarketCap ID Map
Returns a paginated list of all active cryptocurrency exchanges by CoinMarketCap ID. We recommend using this convenience endpoint to lookup and utilize our unique exchange id across all endpoints as typical exchange identifiers may change over time. As a convenience you may pass a comma-separated list of exchanges by slug to filter this list to only those you require or the aux parameter to slim down the payload.

By default this endpoint returns exchanges that have at least 1 actively tracked market. You may receive a map of all inactive cryptocurrencies by passing listing_status=inactive. You may also receive a map of registered exchanges that are listed but do not yet meet methodology requirements to have tracked markets available via listing_status=untracked. Please review (3) Listing Tiers in our methodology documentation for additional details on listing states.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Mapping data is updated only as needed, every 30 seconds.
Plan credit use: 1 call credit per call.
CMC equivalent pages: No equivalent, this data is only available via API.


PARAMETERS
Query Parameters ?
 listing_status	
string
"active"
Only active exchanges are returned by default. Pass inactive to get a list of exchanges that are no longer active. Pass untracked to get a list of exchanges that are registered but do not currently meet methodology requirements to have active markets tracked. You may pass one or more comma-separated values.

 slug	
string
Optionally pass a comma-separated list of exchange slugs (lowercase URL friendly shorthand name with spaces replaced with dashes) to return CoinMarketCap IDs for. If this option is passed, other options will be ignored.

 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of items to return.

 limit	
integer [ 1 .. 5000 ]
Optionally specify the number of results to return. Use this parameter and the "start" parameter to determine your own pagination size.

 sort	
string
"id"
"volume_24h""id"
What field to sort the list of exchanges by.

 aux	
string
"first_historical_data,last_historical_data,is_active"
Optionally specify a comma-separated list of supplemental data fields to return. Pass first_historical_data,last_historical_data,is_active,status to include all auxiliary fields.

 crypto_id	
string
Optionally include one fiat or cryptocurrency IDs to filter market pairs by. For example ?crypto_id=1 would only return exchanges that have BTC.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Array of exchange object results.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/exchange/map
Server URL

https://pro-api.coinmarketcap.com/v1/exchange/map

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": [
{
"id": 270,
"name": "Binance",
"slug": "binance",
"is_active": 1,
"status": "active",
"first_historical_data": "2018-04-26T00:45:00.000Z",
"last_historical_data": "2019-06-02T21:25:00.000Z"
}
],
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Listings Latest
Returns a paginated list of all cryptocurrency exchanges including the latest aggregate market data for each exchange. Use the "convert" option to return market values in multiple fiat and cryptocurrency conversions in the same call.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Every 1 minute.
Plan credit use: 1 call credit per 100 exchanges returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Our latest exchange listing and ranking pages like coinmarketcap.com/rankings/exchanges/.

NOTE: Use this endpoint if you need a sorted and paginated list of exchanges. If you want to query for market data on a few specific exchanges use /v1/exchange/quotes/latest which is optimized for that purpose. The response data between these endpoints is otherwise the same.


PARAMETERS
Query Parameters ?
 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of items to return.

 limit	
integer [ 1 .. 5000 ]
100
Optionally specify the number of results to return. Use this parameter and the "start" parameter to determine your own pagination size.

 sort	
string
"volume_24h"
"name""volume_24h""volume_24h_adjusted""exchange_score"
What field to sort the list of exchanges by.

 sort_dir	
string
"asc""desc"
The direction in which to order exchanges against the specified sort.

 market_type	
string
"all"
"fees""no_fees""all"
The type of exchange markets to include in rankings. This field is deprecated. Please use "all" for accurate sorting.

 category	
string
"all"
"all""spot""derivatives""dex""lending"
The category for this exchange.

 aux	
string
"num_market_pairs,traffic_score,rank,exchange_score,effective_liquidity_24h"
Optionally specify a comma-separated list of supplemental data fields to return. Pass num_market_pairs,traffic_score,rank,exchange_score,effective_liquidity_24h,date_launched,fiats to include all auxiliary fields.

 convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Array of exchange objects matching the list options.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/exchange/listings/latest
Server URL

https://pro-api.coinmarketcap.com/v1/exchange/listings/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": [
{
"id": 270,
"name": "Binance",
"slug": "binance",
"num_market_pairs": 1214,
"fiats": [
"AED",
"USD"
],
"traffic_score": 1000,
"rank": 1,
"exchange_score": 9.8028,
"liquidity_score": 9.8028,
"last_updated": "2018-11-08T22:18:00.000Z",
"quote": {
"USD": {
"volume_24h": 769291636.239632,
"volume_24h_adjusted": 769291636.239632,
"volume_7d": 3666423776,
"volume_30d": 21338299776,
"percent_change_volume_24h": -11.6153,
"percent_change_volume_7d": 67.2055,
"percent_change_volume_30d": 0.00169339,
"effective_liquidity_24h": 629.9774,
"derivative_volume_usd": 62828618628.85901,
"spot_volume_usd": 39682580614.8572
}
}
},
{
"id": 294,
"name": "OKEx",
"slug": "okex",
"num_market_pairs": 385,
"fiats": [
"AED",
"USD"
],
"traffic_score": 845.1565,
"rank": 1,
"exchange_score": 7.0815,
"liquidity_score": 9.8028,
"last_updated": "2018-11-08T22:18:00.000Z",
"quote": {
"USD": {
"volume_24h": 677439315.721563,
"volume_24h_adjusted": 677439315.721563,
"volume_7d": 3506137120,
"volume_30d": 14418225072,
"percent_change_volume_24h": -13.9256,
"percent_change_volume_7d": 60.0461,
"percent_change_volume_30d": 67.2225,
"effective_liquidity_24h": 629.9774,
"derivative_volume_usd": 62828618628.85901,
"spot_volume_usd": 39682580614.8572
}
}
}
],
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Market Pairs Latest
Returns all active market pairs that CoinMarketCap tracks for a given exchange. The latest price and volume information is returned for each market. Use the "convert" option to return market values in multiple fiat and cryptocurrency conversions in the same call.'

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Every 60 seconds.
Plan credit use: 1 call credit per 100 market pairs returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Our exchange level active markets pages like coinmarketcap.com/exchanges/binance/.


PARAMETERS
Query Parameters ?
 id	
string
A CoinMarketCap exchange ID. Example: "1"

 slug	
string
Alternatively pass an exchange "slug" (URL friendly all lowercase shorthand version of name with spaces replaced with hyphens). Example: "binance". One "id" or "slug" is required.

 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of items to return.

 limit	
integer [ 1 .. 5000 ]
100
Optionally specify the number of results to return. Use this parameter and the "start" parameter to determine your own pagination size.

 aux	
string
"num_market_pairs,category,fee_type"
Optionally specify a comma-separated list of supplemental data fields to return. Pass num_market_pairs,category,fee_type,market_url,currency_name,currency_slug,price_quote,effective_liquidity,market_score,market_reputation to include all auxiliary fields.

 matched_id	
string
Optionally include one or more comma-delimited fiat or cryptocurrency IDs to filter market pairs by. For example ?matched_id=2781 would only return BTC markets that matched: "BTC/USD" or "USD/BTC" for the requested exchange. This parameter cannot be used when matched_symbol is used.

 matched_symbol	
string
Optionally include one or more comma-delimited fiat or cryptocurrency symbols to filter market pairs by. For example ?matched_symbol=USD would only return BTC markets that matched: "BTC/USD" or "USD/BTC" for the requested exchange. This parameter cannot be used when matched_id is used.

 category	
string
"all"
"all""spot""derivatives""otc""futures""perpetual"
The category of trading this market falls under. Spot markets are the most common but options include derivatives and OTC.

 fee_type	
string
"all"
"all""percentage""no-fees""transactional-mining""unknown"
The fee type the exchange enforces for this market.

 convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results of your query returned as an object.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/exchange/market-pairs/latest
Server URL

https://pro-api.coinmarketcap.com/v1/exchange/market-pairs/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"id": 270,
"name": "Binance",
"slug": "binance",
"num_market_pairs": 473,
"volume_24h": 769291636.239632,
"market_pairs": [
{
"market_id": 9933,
"market_pair": "BTC/USDT",
"category": "spot",
"fee_type": "percentage",
"outlier_detected": 0,
"exclusions": null,
"market_pair_base": {
"currency_id": 1,
"currency_symbol": "BTC",
"exchange_symbol": "BTC",
"currency_type": "cryptocurrency"
},
"market_pair_quote": {
"currency_id": 825,
"currency_symbol": "USDT",
"exchange_symbol": "USDT",
"currency_type": "cryptocurrency"
},
"quote": {
"exchange_reported": {
"price": 7901.83,
"volume_24h_base": 47251.3345550653,
"volume_24h_quote": 373372012.927251,
"volume_percentage": 19.4346563602467,
"last_updated": "2019-05-24T01:40:10.000Z"
},
"USD": {
"price": 7933.66233493434,
"volume_24h": 374876133.234903,
"depth_negative_two": 40654.68019906,
"depth_positive_two": 17352.9964811,
"last_updated": "2019-05-24T01:40:10.000Z"
}
}
},
{
"market_id": 36329,
"market_pair": "MATIC/BTC",
"category": "spot",
"fee_type": "percentage",
"outlier_detected": 0,
"exclusions": null,
"market_pair_base": {
"currency_id": 3890,
"currency_symbol": "MATIC",
"exchange_symbol": "MATIC",
"currency_type": "cryptocurrency"
},
"market_pair_quote": {
"currency_id": 1,
"currency_symbol": "BTC",
"exchange_symbol": "BTC",
"currency_type": "cryptocurrency"
},
"quote": {
"exchange_reported": {
"price": 0.0000034,
"volume_24h_base": 8773968381.05,
"volume_24h_quote": 29831.49249557,
"volume_percentage": 19.4346563602467,
"last_updated": "2019-05-24T01:41:16.000Z"
},
"USD": {
"price": 0.0269295015799739,
"volume_24h": 236278595.380127,
"depth_negative_two": 40654.68019906,
"depth_positive_two": 17352.9964811,
"last_updated": "2019-05-24T01:41:16.000Z"
}
}
}
]
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Quotes Historical
Returns an interval of historic quotes for any exchange based on time and interval parameters.

Technical Notes

A historic quote for every "interval" period between your "time_start" and "time_end" will be returned.
If a "time_start" is not supplied, the "interval" will be applied in reverse from "time_end".
If "time_end" is not supplied, it defaults to the current time.
At each "interval" period, the historic quote that is closest in time to the requested time will be returned.
If no historic quotes are available in a given "interval" period up until the next interval period, it will be skipped.
This endpoint supports requesting multiple exchanges in the same call. Please note the API response will be wrapped in an additional object in this case.
Interval Options
There are 2 types of time interval formats that may be used for "interval".

The first are calendar year and time constants in UTC time:
"hourly" - Get the first quote available at the beginning of each calendar hour.
"daily" - Get the first quote available at the beginning of each calendar day.
"weekly" - Get the first quote available at the beginning of each calendar week.
"monthly" - Get the first quote available at the beginning of each calendar month.
"yearly" - Get the first quote available at the beginning of each calendar year.

The second are relative time intervals.
"m": Get the first quote available every "m" minutes (60 second intervals). Supported minutes are: "5m", "10m", "15m", "30m", "45m".
"h": Get the first quote available every "h" hours (3600 second intervals). Supported hour intervals are: "1h", "2h", "3h", "4h", "6h", "12h".
"d": Get the first quote available every "d" days (86400 second intervals). Supported day intervals are: "1d", "2d", "3d", "7d", "14d", "15d", "30d", "60d", "90d", "365d".

This endpoint is available on the following API plans:

Basic
Hobbyist (1 month)
Startup (1 month)
Standard (3 month)
Professional (Up to 12 months)
Enterprise (Up to 6 years)
Note: You may use the /exchange/map endpoint to receive a list of earliest historical dates that may be fetched for each exchange as first_historical_data. This timestamp will either be the date CoinMarketCap first started tracking the exchange or 2018-04-26T00:45:00.000Z, the earliest date this type of historical data is available for.

Cache / Update frequency: Every 5 minutes.
Plan credit use: 1 call credit per 100 historical data points returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: No equivalent, this data is only available via API outside of our volume sparkline charts in coinmarketcap.com/rankings/exchanges/.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated exchange CoinMarketCap ids. Example: "24,270"

 slug	
string
Alternatively, one or more comma-separated exchange names in URL friendly shorthand "slug" format (all lowercase, spaces replaced with hyphens). Example: "binance,kraken". At least one "id" or "slug" is required.

 time_start	
string
Timestamp (Unix or ISO 8601) to start returning quotes for. Optional, if not passed, we'll return quotes calculated in reverse from "time_end".

 time_end	
string
Timestamp (Unix or ISO 8601) to stop returning quotes for (inclusive). Optional, if not passed, we'll default to the current time. If no "time_start" is passed, we return quotes in reverse order starting from this time.

 count	
number [ 1 .. 10000 ]
10
The number of interval periods to return results for. Optional, required if both "time_start" and "time_end" aren't supplied. The default is 10 items. The current query limit is 10000.

 interval	
string
"5m"
"yearly""monthly""weekly""daily""hourly""5m""10m""15m""30m""45m""1h""2h""3h""4h""6h""12h""24h""1d""2d""3d""7d""14d""15d""30d""60d""90d""365d"
Interval of time to return data points for. See details in endpoint description.

 convert	
string
By default market quotes are returned in USD. Optionally calculate market quotes in up to 3 other fiat currencies or cryptocurrencies.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results of your query returned as an object map.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/exchange/quotes/historical
Server URL

https://pro-api.coinmarketcap.com/v1/exchange/quotes/historical

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"id": 270,
"name": "Binance",
"slug": "binance",
"quotes": [
{
"timestamp": "2018-06-03T00:00:00.000Z",
"quote": {
"USD": {
"volume_24h": 1632390000,
"timestamp": "2018-06-03T00:00:00.000Z"
}
},
"num_market_pairs": 338
},
{
"timestamp": "2018-06-10T00:00:00.000Z",
"quote": {
"USD": {
"volume_24h": 1034720000,
"timestamp": "2018-06-10T00:00:00.000Z"
}
},
"num_market_pairs": 349
},
{
"timestamp": "2018-06-17T00:00:00.000Z",
"quote": {
"USD": {
"volume_24h": 883885000,
"timestamp": "2018-06-17T00:00:00.000Z"
}
},
"num_market_pairs": 357
}
]
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Quotes Latest
Returns the latest aggregate market data for 1 or more exchanges. Use the "convert" option to return market values in multiple fiat and cryptocurrency conversions in the same call.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Every 60 seconds.
Plan credit use: 1 call credit per 100 exchanges returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Latest market data summary for specific exchanges like coinmarketcap.com/rankings/exchanges/.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated CoinMarketCap exchange IDs. Example: "1,2"

 slug	
string
Alternatively, pass a comma-separated list of exchange "slugs" (URL friendly all lowercase shorthand version of name with spaces replaced with hyphens). Example: "binance,gdax". At least one "id" or "slug" is required.

 convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 aux	
string
"num_market_pairs,traffic_score,rank,exchange_score,liquidity_score,effective_liquidity_24h"
Optionally specify a comma-separated list of supplemental data fields to return. Pass num_market_pairs,traffic_score,rank,exchange_score,liquidity_score,effective_liquidity_24h to include all auxiliary fields.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
A map of exchange objects by ID or slugs (as used in query parameters).

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/exchange/quotes/latest
Server URL

https://pro-api.coinmarketcap.com/v1/exchange/quotes/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"270": {
"id": 270,
"name": "Binance",
"slug": "binance",
"num_coins": 132,
"num_market_pairs": 385,
"last_updated": "2018-11-08T22:11:00.000Z",
"traffic_score": 1000,
"rank": 1,
"exchange_score": 9.8028,
"liquidity_score": 9.8028,
"quote": {
"USD": {
"volume_24h": 768478308.529847,
"volume_24h_adjusted": 768478308.529847,
"volume_7d": 3666423776,
"volume_30d": 21338299776,
"percent_change_volume_24h": -11.8232,
"percent_change_volume_7d": 67.0306,
"percent_change_volume_30d": -0.0821558,
"effective_liquidity_24h": 629.9774
}
}
}
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Global-Metrics
API endpoints for global aggregate market data. This category currently includes 2 endpoints:
/v1/global-metrics/quotes/latest - Latest global metrics
/v1/global-metrics/quotes/historical - Historical global metrics

Quotes Historical
Returns an interval of historical global cryptocurrency market metrics based on time and interval parameters.

Technical Notes

A historic quote for every "interval" period between your "time_start" and "time_end" will be returned.
If a "time_start" is not supplied, the "interval" will be applied in reverse from "time_end".
If "time_end" is not supplied, it defaults to the current time.
At each "interval" period, the historic quote that is closest in time to the requested time will be returned.
If no historic quotes are available in a given "interval" period up until the next interval period, it will be skipped.
Interval Options
There are 2 types of time interval formats that may be used for "interval".

The first are calendar year and time constants in UTC time:
"hourly" - Get the first quote available at the beginning of each calendar hour.
"daily" - Get the first quote available at the beginning of each calendar day.
"weekly" - Get the first quote available at the beginning of each calendar week.
"monthly" - Get the first quote available at the beginning of each calendar month.
"yearly" - Get the first quote available at the beginning of each calendar year.

The second are relative time intervals.
"m": Get the first quote available every "m" minutes (60 second intervals). Supported minutes are: "5m", "10m", "15m", "30m", "45m".
"h": Get the first quote available every "h" hours (3600 second intervals). Supported hour intervals are: "1h", "2h", "3h", "4h", "6h", "12h".
"d": Get the first quote available every "d" days (86400 second intervals). Supported day intervals are: "1d", "2d", "3d", "7d", "14d", "15d", "30d", "60d", "90d", "365d".

This endpoint is available on the following API plans:

Basic
Hobbyist (1 month)
Startup (1 month)
Standard (3 month)
Professional (12 months)
Enterprise (Up to 6 years)
Cache / Update frequency: Every 5 minutes.
Plan credit use: 1 call credit per 100 historical data points returned (rounded up).
CMC equivalent pages: Our Total Market Capitalization global chart coinmarketcap.com/charts/.


PARAMETERS
Query Parameters ?
 time_start	
string
Timestamp (Unix or ISO 8601) to start returning quotes for. Optional, if not passed, we'll return quotes calculated in reverse from "time_end".

 time_end	
string
Timestamp (Unix or ISO 8601) to stop returning quotes for (inclusive). Optional, if not passed, we'll default to the current time. If no "time_start" is passed, we return quotes in reverse order starting from this time.

 count	
number [ 1 .. 10000 ]
10
The number of interval periods to return results for. Optional, required if both "time_start" and "time_end" aren't supplied. The default is 10 items. The current query limit is 10000.

 interval	
string
"1d"
"yearly""monthly""weekly""daily""hourly""5m""10m""15m""30m""45m""1h""2h""3h""4h""6h""12h""24h""1d""2d""3d""7d""14d""15d""30d""60d""90d""365d"
Interval of time to return data points for. See details in endpoint description.

 convert	
string
By default market quotes are returned in USD. Optionally calculate market quotes in up to 3 other fiat currencies or cryptocurrencies.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 aux	
string
"btc_dominance,eth_dominance,active_cryptocurrencies,active_exchanges,active_market_pairs,total_volume_24h,total_volume_24h_reported,altcoin_market_cap,altcoin_volume_24h,altcoin_volume_24h_reported"
Optionally specify a comma-separated list of supplemental data fields to return. Pass btc_dominance,eth_dominance,active_cryptocurrencies,active_exchanges,active_market_pairs,total_volume_24h,total_volume_24h_reported,altcoin_market_cap,altcoin_volume_24h,altcoin_volume_24h_reported,search_interval to include all auxiliary fields.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results of your query returned as an object.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/global-metrics/quotes/historical
Server URL

https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/historical

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"quotes": [
{
"timestamp": "2018-07-31T00:02:00.000Z",
"btc_dominance": 47.9949,
"active_cryptocurrencies": 2500,
"active_exchanges": 600,
"active_market_pairs": 1000,
"quote": {
"USD": {
"total_market_cap": 292863223827.394,
"total_volume_24h": 17692152629.7864,
"total_volume_24h_reported": 375179000000,
"altcoin_market_cap": 187589500000,
"altcoin_volume_24h": 375179000000,
"altcoin_volume_24h_reported": 375179000000,
"timestamp": "2018-07-31T00:02:00.000Z"
}
}
},
{
"timestamp": "2018-08-01T00:02:00.000Z",
"btc_dominance": 48.0585,
"active_cryptocurrencies": 2500,
"active_exchanges": 600,
"active_market_pairs": 1000,
"quote": {
"USD": {
"total_market_cap": 277770824530.303,
"total_volume_24h": 15398085549.0344,
"total_volume_24h_reported": 375179000000,
"altcoin_market_cap": 187589500000,
"altcoin_volume_24h": 375179000000,
"altcoin_volume_24h_reported": 375179000000,
"timestamp": "2018-07-31T00:02:00.000Z"
}
}
},
{
"timestamp": "2018-08-02T00:02:00.000Z",
"btc_dominance": 48.041,
"active_cryptocurrencies": 2500,
"active_exchanges": 600,
"active_market_pairs": 1000,
"quote": {
"USD": {
"total_market_cap": 273078776005.223,
"total_volume_24h": 14300071695.0547,
"total_volume_24h_reported": 375179000000,
"altcoin_market_cap": 187589500000,
"altcoin_volume_24h": 375179000000,
"altcoin_volume_24h_reported": 375179000000,
"timestamp": "2018-07-31T00:02:00.000Z"
}
}
}
]
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Quotes Latest
Returns the latest global cryptocurrency market metrics. Use the "convert" option to return market values in multiple fiat and cryptocurrency conversions in the same call.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Every 5 minute.
Plan credit use: 1 call credit per call and 1 call credit per convert option beyond the first.
CMC equivalent pages: The latest aggregate global market stats ticker across all CMC pages like coinmarketcap.com.


PARAMETERS
Query Parameters ?
 convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results object for your API call.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/global-metrics/quotes/latest
Server URL

https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"btc_dominance": 67.0057,
"eth_dominance": 9.02205,
"active_cryptocurrencies": 2941,
"total_cryptocurrencies": 4637,
"active_market_pairs": 21209,
"active_exchanges": 445,
"total_exchanges": 677,
"last_updated": "2019-05-16T18:47:00.000Z",
"quote": {
"active_cryptocurrencies": 4986,
"total_cryptocurrencies": 9607,
"active_market_pairs": 39670,
"active_exchanges": 372,
"total_exchanges": 1347,
"eth_dominance": 16.989007016505,
"btc_dominance": 45.002265776962,
"eth_dominance_yesterday": 17.25405255,
"btc_dominance_yesterday": 45.41455043,
"eth_dominance_24h_percentage_change": -0.265045533495,
"btc_dominance_24h_percentage_change": -0.412284653038,
"defi_volume_24h": 20443320643.718483,
"defi_volume_24h_reported": 20443320643.718483,
"defi_market_cap": 131290122769.1664,
"defi_24h_percentage_change": -17.648761478379,
"stablecoin_volume_24h": 209258420492.51562,
"stablecoin_volume_24h_reported": 209258420492.51562,
"stablecoin_market_cap": 95606043432.70901,
"stablecoin_24h_percentage_change": 2.518312658305,
"derivatives_volume_24h": 282420341063.98895,
"derivatives_volume_24h_reported": 282420341063.98895,
"derivatives_24h_percentage_change": -13.893947771549,
"quote": {
"USD": {
"total_market_cap": 2374432083905.6846,
"total_volume_24h": 262906061281.24,
"total_volume_24h_reported": 262906061281.24,
"altcoin_volume_24h": 195175095816.0813,
"altcoin_volume_24h_reported": 195175095816.0813,
"altcoin_market_cap": 1305883846812.9905,
"defi_volume_24h": 20443320643.718483,
"defi_volume_24h_reported": 20443320643.718483,
"defi_24h_percentage_change": -17.648761478379,
"defi_market_cap": 131290122769.1664,
"stablecoin_volume_24h": 209258420492.51562,
"stablecoin_volume_24h_reported": 209258420492.51562,
"stablecoin_24h_percentage_change": 2.518312658305,
"stablecoin_market_cap": 95606043432.70901,
"derivatives_volume_24h": 282420341063.98895,
"derivatives_volume_24h_reported": 282420341063.98895,
"derivatives_24h_percentage_change": -13.893947771549,
"last_updated": "2021-05-06T01:45:17.999Z",
"total_market_cap_yesterday": 2255175879567.3643,
"total_volume_24h_yesterday": 254911841723.5,
"total_market_cap_yesterday_percentage_change": 5.288111025788297,
"total_volume_24h_yesterday_percentage_change": 3.1360722607823135
}
},
"last_updated": "2021-05-06T01:45:17.999Z"
}
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Tools
API endpoints for convenience utilities. This category currently includes 1 endpoint:
/v2/tools/price-conversion - Price conversion tool
/v1/tools/postman - Postman tool

Postman Conversion v1
Convert APIs into postman format. You can reference the operation from this article.

This endpoint is available on the following API plans:

Free
Hobbyist
Startup
Standard
Professional
Enterprise
Technical Notes

Set the env variables in the postman: {{baseUrl}}, {{API_KEY}}

Responses
400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/tools/postman
Server URL

https://pro-api.coinmarketcap.com/v1/tools/postman

RESPONSE SAMPLES
400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"status": {
"timestamp": "2018-06-02T22:51:28.209Z",
"error_code": 400,
"error_message": "Invalid value for \"id\"",
"elapsed": 10,
"credit_count": 0
}
}
Price Conversion v2
Convert an amount of one cryptocurrency or fiat currency into one or more different currencies utilizing the latest market rate for each currency. You may optionally pass a historical timestamp as time to convert values based on historical rates (as your API plan supports).

Please note: This documentation relates to our updated V2 endpoint, which may be incompatible with our V1 versions. Documentation for deprecated endpoints can be found here.

Technical Notes

Latest market rate conversions are accurate to 1 minute of specificity. Historical conversions are accurate to 1 minute of specificity outside of non-USD fiat conversions which have 5 minute specificity.
You may reference a current list of all supported cryptocurrencies via the cryptocurrency/map endpoint. This endpoint also returns the supported date ranges for historical conversions via the first_historical_data and last_historical_data properties.
Conversions are supported in 93 different fiat currencies and 4 precious metals as outlined here. Historical fiat conversions are supported as far back as 2013-04-28.
A last_updated timestamp is included for both your source currency and each conversion currency. This is the timestamp of the closest market rate record referenced for each currency during the conversion.
This endpoint is available on the following API plans:

Basic (Latest market price conversions)
Hobbyist (Latest market price conversions + 1 month historical)
Startup (Latest market price conversions + 1 month historical)
Standard (Latest market price conversions + 3 months historical)
Professional (Latest market price conversions + 12 months historical)
Enterprise (Latest market price conversions + up to 6 years historical)
Cache / Update frequency: Every 60 seconds for the lastest cryptocurrency and fiat currency rates.
Plan credit use: 1 call credit per call and 1 call credit per convert option beyond the first.
CMC equivalent pages: Our cryptocurrency conversion page at coinmarketcap.com/converter/.


PARAMETERS
Query Parameters ?
 amount	
number [ 1e-8 .. 1000000000000 ] Required
An amount of currency to convert. Example: 10.43

 id	
string
The CoinMarketCap currency ID of the base cryptocurrency or fiat to convert from. Example: "1"

 symbol	
string
Alternatively the currency symbol of the base cryptocurrency or fiat to convert from. Example: "BTC". One "id" or "symbol" is required. Please note that starting in the v2 endpoint, due to the fact that a symbol is not unique, if you request by symbol each quote response will contain an array of objects containing all of the coins that use each requested symbol. The v1 endpoint will still return a single object, the highest ranked coin using that symbol.

 time	
string
Optional timestamp (Unix or ISO 8601) to reference historical pricing during conversion. If not passed, the current time will be used. If passed, we'll reference the closest historic values available for this conversion.

 convert	
string
Pass up to 120 comma-separated fiat or cryptocurrency symbols to convert the source amount to.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results object for your API call.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v2/tools/price-conversion
Server URL

https://pro-api.coinmarketcap.com/v2/tools/price-conversion

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"symbol": "BTC",
"id": "1",
"name": "Bitcoin",
"amount": 50,
"last_updated": "2018-06-06T08:04:36.000Z",
"quote": {
"GBP": {
"price": 284656.08465608465,
"last_updated": "2018-06-06T06:00:00.000Z"
},
"LTC": {
"price": 3128.7279766396537,
"last_updated": "2018-06-06T08:04:02.000Z"
},
"USD": {
"price": 381442,
"last_updated": "2018-06-06T08:06:51.968Z"
}
}
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Blockchain
API endpoints for blockchain data. This category currently includes 1 endpoint:
/v1/blockchain/statistics/latest - Latest statistics

Statistics Latest
Returns the latest blockchain statistics data for 1 or more blockchains. Bitcoin, Litecoin, and Ethereum are currently supported. Additional blockchains will be made available on a regular basis.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Every 15 seconds.
Plan credit use: 1 call credit per request.
CMC equivalent pages: Our blockchain explorer pages like blockchain.coinmarketcap.com/.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated cryptocurrency CoinMarketCap IDs to return blockchain data for. Pass 1,2,1027 to request all currently supported blockchains.

 symbol	
string
Alternatively pass one or more comma-separated cryptocurrency symbols. Pass BTC,LTC,ETH to request all currently supported blockchains.

 slug	
string
Alternatively pass a comma-separated list of cryptocurrency slugs. Pass bitcoin,litecoin,ethereum to request all currently supported blockchains.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
A map of blockchain objects by ID, symbol, or slug (as used in query parameters).

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/blockchain/statistics/latest
Server URL

https://pro-api.coinmarketcap.com/v1/blockchain/statistics/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"BTC": {
"id": 1,
"slug": "bitcoin",
"symbol": "BTC",
"block_reward_static": 12.5,
"consensus_mechanism": "proof-of-work",
"difficulty": "11890594958796",
"hashrate_24h": "85116194130018810000",
"pending_transactions": 1177,
"reduction_rate": "50%",
"total_blocks": 595165,
"total_transactions": "455738994",
"tps_24h": 3.808090277777778,
"first_block_timestamp": "2009-01-09T02:54:25.000Z"
}
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Content
API endpoints for content data. This category currently includes 4 endpoints:
/v1/content/latest - Content latest
/v1/content/posts/top - Content top posts
/v1/content/posts/latest - Content latest posts
/v1/content/posts/comments - Content post comments

Community
API endpoints for community data. This category currently includes 2 endpoints:
/v1/community/trending/topic - Community Trending Topics
/v1/community/trending/token - Community Trending Tokens

Key
API endpoints for managing your API key. This category currently includes 1 endpoint:
/v1/key/info - Key Info

Key Info
Returns API key details and usage stats. This endpoint can be used to programmatically monitor your key usage compared to the rate limit and daily/monthly credit limits available to your API plan. You may use the Developer Portal's account dashboard as an alternative to this endpoint.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: No cache, this endpoint updates as requests are made with your key.
Plan credit use: No API credit cost. Requests to this endpoint do contribute to your minute based rate limit however.
CMC equivalent pages: Our Developer Portal dashboard for your API Key at pro.coinmarketcap.com/account.


Responses
200 Successful

RESPONSE SCHEMA
 data 	
Details about your API key are returned in this object.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/key/info
Server URL

https://pro-api.coinmarketcap.com/v1/key/info

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"plan": {
"credit_limit_monthly": 120000,
"credit_limit_monthly_reset": "In 3 days, 19 hours, 56 minutes",
"credit_limit_monthly_reset_timestamp": "2019-09-01T00:00:00.000Z",
"rate_limit_minute": 60
},
"usage": {
"current_minute": {
"requests_made": 1,
"requests_left": 59
},
"current_day": {
"credits_used": 1,
"credits_left": 3999
},
"current_month": {
"credits_used": 1,
"credits_left": 119999
}
}
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Deprecated
Deprecated (V1) Endpoints


These endpoints have been replaced with their V2 versions, and are no longer being actively supported.
We strongly suggest migrating to V2 endpoints, and this documentation only exists for legacy purposes.


Metadata v1 (deprecated)
Returns all static metadata available for one or more cryptocurrencies. This information includes details like logo, description, official website URL, social links, and links to a cryptocurrency's technical documentation.

This endpoint is available on the following API plans:

Basic
Startup
Hobbyist
Standard
Professional
Enterprise
Cache / Update frequency: Static data is updated only as needed, every 30 seconds.
Plan credit use: 1 call credit per 100 cryptocurrencies returned (rounded up).
CMC equivalent pages: Cryptocurrency detail page metadata like coinmarketcap.com/currencies/bitcoin/.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated CoinMarketCap cryptocurrency IDs. Example: "1,2"

 slug	
string
Alternatively pass a comma-separated list of cryptocurrency slugs. Example: "bitcoin,ethereum"

 symbol	
string
Alternatively pass one or more comma-separated cryptocurrency symbols. Example: "BTC,ETH". At least one "id" or "slug" or "symbol" is required for this request. Please note that starting in the v2 endpoint, due to the fact that a symbol is not unique, if you request by symbol each data response will contain an array of objects containing all of the coins that use each requested symbol. The v1 endpoint will still return a single object, the highest ranked coin using that symbol.

 address	
string
Alternatively pass in a contract address. Example: "0xc40af1e4fecfa05ce6bab79dcd8b373d2e436c4e"

 skip_invalid	
boolean
false
Pass true to relax request validation rules. When requesting records on multiple cryptocurrencies an error is returned if any invalid cryptocurrencies are requested or a cryptocurrency does not have matching records in the requested timeframe. If set to true, invalid lookups will be skipped allowing valid cryptocurrencies to still be returned.

 aux	
string
"urls,logo,description,tags,platform,date_added,notice"
Optionally specify a comma-separated list of supplemental data fields to return. Pass urls,logo,description,tags,platform,date_added,notice,status to include all auxiliary fields.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results of your query returned as an object map.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/cryptocurrency/info
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/info

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"1": {
"urls": {
"website": [
"https://bitcoin.org/"
],
"technical_doc": [
"https://bitcoin.org/bitcoin.pdf"
],
"twitter": [ ],
"reddit": [
"https://reddit.com/r/bitcoin"
],
"message_board": [
"https://bitcointalk.org"
],
"announcement": [ ],
"chat": [ ],
"explorer": [
"https://blockchain.coinmarketcap.com/chain/bitcoin",
"https://blockchain.info/",
"https://live.blockcypher.com/btc/"
],
"source_code": [
"https://github.com/bitcoin/"
]
},
"logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"slug": "bitcoin",
"description": "Bitcoin (BTC) is a consensus network that enables a new payment system and a completely digital currency. Powered by its users, it is a peer to peer payment network that requires no central authority to operate. On October 31st, 2008, an individual or group of individuals operating under the pseudonym "Satoshi Nakamoto" published the Bitcoin Whitepaper and described it as: "a purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution."",
"date_added": "2013-04-28T00:00:00.000Z",
"date_launched": "2013-04-28T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"category": "coin"
},
"1027": {
"urls": {
"website": [
"https://www.ethereum.org/"
],
"technical_doc": [
"https://github.com/ethereum/wiki/wiki/White-Paper"
],
"twitter": [
"https://twitter.com/ethereum"
],
"reddit": [
"https://reddit.com/r/ethereum"
],
"message_board": [
"https://forum.ethereum.org/"
],
"announcement": [
"https://bitcointalk.org/index.php?topic=428589.0"
],
"chat": [
"https://gitter.im/orgs/ethereum/rooms"
],
"explorer": [
"https://blockchain.coinmarketcap.com/chain/ethereum",
"https://etherscan.io/",
"https://ethplorer.io/"
],
"source_code": [
"https://github.com/ethereum"
]
},
"logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
"id": 1027,
"name": "Ethereum",
"symbol": "ETH",
"slug": "ethereum",
"description": "Ethereum (ETH) is a smart contract platform that enables developers to build decentralized applications (dapps) conceptualized by Vitalik Buterin in 2013. ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.

Ethereum is the pioneer for blockchain based smart contracts. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met. On the blockchain, smart contracts allow for code to be run exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. The Ethereum network went live on July 30th, 2015 with 72 million Ethereum premined.",
"notice": null,
"date_added": "2015-08-07T00:00:00.000Z",
"date_launched": "2015-08-07T00:00:00.000Z",
"tags": [
"mineable"
],
"platform": null,
"category": "coin",
"self_reported_circulating_supply": null,
"self_reported_market_cap": null,
"self_reported_tags": null,
"infinite_supply": false
}
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Price Conversion v1 (deprecated)
Convert an amount of one cryptocurrency or fiat currency into one or more different currencies utilizing the latest market rate for each currency. You may optionally pass a historical timestamp as time to convert values based on historical rates (as your API plan supports).

Technical Notes

Latest market rate conversions are accurate to 1 minute of specificity. Historical conversions are accurate to 1 minute of specificity outside of non-USD fiat conversions which have 5 minute specificity.
You may reference a current list of all supported cryptocurrencies via the cryptocurrency/map endpoint. This endpoint also returns the supported date ranges for historical conversions via the first_historical_data and last_historical_data properties.
Conversions are supported in 93 different fiat currencies and 4 precious metals as outlined here. Historical fiat conversions are supported as far back as 2013-04-28.
A last_updated timestamp is included for both your source currency and each conversion currency. This is the timestamp of the closest market rate record referenced for each currency during the conversion.
This endpoint is available on the following API plans:

Basic (Latest market price conversions)
Hobbyist (Latest market price conversions + 1 month historical)
Startup (Latest market price conversions + 1 month historical)
Standard (Latest market price conversions + 3 months historical)
Professional (Latest market price conversions + 12 months historical)
Enterprise (Latest market price conversions + up to 6 years historical)
Cache / Update frequency: Every 60 seconds for the lastest cryptocurrency and fiat currency rates.
Plan credit use: 1 call credit per call and 1 call credit per convert option beyond the first.
CMC equivalent pages: Our cryptocurrency conversion page at coinmarketcap.com/converter/.


PARAMETERS
Query Parameters ?
 amount	
number [ 1e-8 .. 1000000000000 ] Required
An amount of currency to convert. Example: 10.43

 id	
string
The CoinMarketCap currency ID of the base cryptocurrency or fiat to convert from. Example: "1"

 symbol	
string
Alternatively the currency symbol of the base cryptocurrency or fiat to convert from. Example: "BTC". One "id" or "symbol" is required. Please note that starting in the v2 endpoint, due to the fact that a symbol is not unique, if you request by symbol each quote response will contain an array of objects containing all of the coins that use each requested symbol. The v1 endpoint will still return a single object, the highest ranked coin using that symbol.

 time	
string
Optional timestamp (Unix or ISO 8601) to reference historical pricing during conversion. If not passed, the current time will be used. If passed, we'll reference the closest historic values available for this conversion.

 convert	
string
Pass up to 120 comma-separated fiat or cryptocurrency symbols to convert the source amount to.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results object for your API call.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/tools/price-conversion
Server URL

https://pro-api.coinmarketcap.com/v1/tools/price-conversion

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"symbol": "BTC",
"id": "1",
"name": "Bitcoin",
"amount": 50,
"last_updated": "2018-06-06T08:04:36.000Z",
"quote": {
"GBP": {
"price": 284656.08465608465,
"last_updated": "2018-06-06T06:00:00.000Z"
},
"LTC": {
"price": 3128.7279766396537,
"last_updated": "2018-06-06T08:04:02.000Z"
},
"USD": {
"price": 381442,
"last_updated": "2018-06-06T08:06:51.968Z"
}
}
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Market Pairs Latest v1 (deprecated)
Lists all active market pairs that CoinMarketCap tracks for a given cryptocurrency or fiat currency. All markets with this currency as the pair base or pair quote will be returned. The latest price and volume information is returned for each market. Use the "convert" option to return market values in multiple fiat and cryptocurrency conversions in the same call.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Every 1 minute.
Plan credit use: 1 call credit per 100 market pairs returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Our active cryptocurrency markets pages like coinmarketcap.com/currencies/bitcoin/#markets.


PARAMETERS
Query Parameters ?
 id	
string
A cryptocurrency or fiat currency by CoinMarketCap ID to list market pairs for. Example: "1"

 slug	
string
Alternatively pass a cryptocurrency by slug. Example: "bitcoin"

 symbol	
string
Alternatively pass a cryptocurrency by symbol. Fiat currencies are not supported by this field. Example: "BTC". A single cryptocurrency "id", "slug", or "symbol" is required.

 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of items to return.

 limit	
integer [ 1 .. 5000 ]
100
Optionally specify the number of results to return. Use this parameter and the "start" parameter to determine your own pagination size.

 sort_dir	
string
"desc"
"asc""desc"
Optionally specify the sort direction of markets returned.

 sort	
string
"volume_24h_strict"
"volume_24h_strict""cmc_rank""cmc_rank_advanced""effective_liquidity""market_score""market_reputation"
Optionally specify the sort order of markets returned. By default we return a strict sort on 24 hour reported volume. Pass cmc_rank to return a CMC methodology based sort where markets with excluded volumes are returned last.

 aux	
string
"num_market_pairs,category,fee_type"
Optionally specify a comma-separated list of supplemental data fields to return. Pass num_market_pairs,category,fee_type,market_url,currency_name,currency_slug,price_quote,notice,cmc_rank,effective_liquidity,market_score,market_reputation to include all auxiliary fields.

 matched_id	
string
Optionally include one or more fiat or cryptocurrency IDs to filter market pairs by. For example ?id=1&matched_id=2781 would only return BTC markets that matched: "BTC/USD" or "USD/BTC". This parameter cannot be used when matched_symbol is used.

 matched_symbol	
string
Optionally include one or more fiat or cryptocurrency symbols to filter market pairs by. For example ?symbol=BTC&matched_symbol=USD would only return BTC markets that matched: "BTC/USD" or "USD/BTC". This parameter cannot be used when matched_id is used.

 category	
string
"all"
"all""spot""derivatives""otc""perpetual"
The category of trading this market falls under. Spot markets are the most common but options include derivatives and OTC.

 fee_type	
string
"all"
"all""percentage""no-fees""transactional-mining""unknown"
The fee type the exchange enforces for this market.

 convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results of your query returned as an object.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/cryptocurrency/market-pairs/latest
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/market-pairs/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"num_market_pairs": 7526,
"market_pairs": [
{
"exchange": {
"id": 157,
"name": "BitMEX",
"slug": "bitmex"
},
"market_id": 4902,
"market_pair": "BTC/USD",
"category": "derivatives",
"fee_type": "no-fees",
"market_pair_base": {
"currency_id": 1,
"currency_symbol": "BTC",
"exchange_symbol": "XBT",
"currency_type": "cryptocurrency"
},
"market_pair_quote": {
"currency_id": 2781,
"currency_symbol": "USD",
"exchange_symbol": "USD",
"currency_type": "fiat"
},
"quote": {
"exchange_reported": {
"price": 7839,
"volume_24h_base": 434215.85308502,
"volume_24h_quote": 3403818072.33347,
"last_updated": "2019-05-24T02:39:00.000Z"
},
"USD": {
"price": 7839,
"volume_24h": 3403818072.33347,
"last_updated": "2019-05-24T02:39:00.000Z"
}
}
},
{
"exchange": {
"id": 108,
"name": "Negocie Coins",
"slug": "negocie-coins"
},
"market_id": 3377,
"market_pair": "BTC/BRL",
"category": "spot",
"fee_type": "percentage",
"market_pair_base": {
"currency_id": 1,
"currency_symbol": "BTC",
"exchange_symbol": "BTC",
"currency_type": "cryptocurrency"
},
"market_pair_quote": {
"currency_id": 2783,
"currency_symbol": "BRL",
"exchange_symbol": "BRL",
"currency_type": "fiat"
},
"quote": {
"exchange_reported": {
"price": 33002.11,
"volume_24h_base": 336699.03559957,
"volume_24h_quote": 11111778609.7509,
"last_updated": "2019-05-24T02:39:00.000Z"
},
"USD": {
"price": 8165.02539531659,
"volume_24h": 2749156176.2491,
"last_updated": "2019-05-24T02:39:00.000Z"
}
}
}
]
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
OHLCV Historical v1 (deprecated)
Returns historical OHLCV (Open, High, Low, Close, Volume) data along with market cap for any cryptocurrency using time interval parameters. Currently daily and hourly OHLCV periods are supported. Volume is not currently supported for hourly OHLCV intervals before 2020-09-22.

Technical Notes

Only the date portion of the timestamp is used for daily OHLCV so it's recommended to send an ISO date format like "2018-09-19" without time for this "time_period".
One OHLCV quote will be returned for every "time_period" between your "time_start" (exclusive) and "time_end" (inclusive).
If a "time_start" is not supplied, the "time_period" will be calculated in reverse from "time_end" using the "count" parameter which defaults to 10 results.
If "time_end" is not supplied, it defaults to the current time.
If you don't need every "time_period" between your dates you may adjust the frequency that "time_period" is sampled using the "interval" parameter. For example with "time_period" set to "daily" you may set "interval" to "2d" to get the daily OHLCV for every other day. You could set "interval" to "monthly" to get the first daily OHLCV for each month, or set it to "yearly" to get the daily OHLCV value against the same date every year.
Implementation Tips

If querying for a specific OHLCV date your "time_start" should specify a timestamp of 1 interval prior as "time_start" is an exclusive time parameter (as opposed to "time_end" which is inclusive to the search). This means that when you pass a "time_start" results will be returned for the next complete "time_period". For example, if you are querying for a daily OHLCV datapoint for 2018-11-30 your "time_start" should be "2018-11-29".
If only specifying a "count" parameter to return latest OHLCV periods, your "count" should be 1 number higher than the number of results you expect to receive. "Count" defines the number of "time_period" intervals queried, not the number of results to return, and this includes the currently active time period which is incomplete when working backwards from current time. For example, if you want the last daily OHLCV value available simply pass "count=2" to skip the incomplete active time period.
This endpoint supports requesting multiple cryptocurrencies in the same call. Please note the API response will be wrapped in an additional object in this case.
Interval Options

There are 2 types of time interval formats that may be used for "time_period" and "interval" parameters. For "time_period" these return aggregate OHLCV data from the beginning to end of each interval period. Apply these time intervals to "interval" to adjust how frequently "time_period" is sampled.

The first are calendar year and time constants in UTC time:
"hourly" - Hour intervals in UTC.
"daily" - Calendar day intervals for each UTC day.
"weekly" - Calendar week intervals for each calendar week.
"monthly" - Calendar month intervals for each calendar month.
"yearly" - Calendar year intervals for each calendar year.

The second are relative time intervals.
"h": Get the first quote available every "h" hours (3600 second intervals). Supported hour intervals are: "1h", "2h", "3h", "4h", "6h", "12h".
"d": Time periods that repeat every "d" days (86400 second intervals). Supported day intervals are: "1d", "2d", "3d", "7d", "14d", "15d", "30d", "60d", "90d", "365d".

Please note that "time_period" currently supports the "daily" and "hourly" options. "interval" supports all interval options.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup (1 month)
Standard (3 months)
Professional (12 months)
Enterprise (Up to 6 years)
Cache / Update frequency: Latest Daily OHLCV record is available ~5 to ~10 minutes after each midnight UTC. The latest hourly OHLCV record is available 5 minutes after each UTC hour.
Plan credit use: 1 call credit per 100 OHLCV data points returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Our historical cryptocurrency data pages like coinmarketcap.com/currencies/bitcoin/historical-data/.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated CoinMarketCap cryptocurrency IDs. Example: "1,1027"

 slug	
string
Alternatively pass a comma-separated list of cryptocurrency slugs. Example: "bitcoin,ethereum"

 symbol	
string
Alternatively pass one or more comma-separated cryptocurrency symbols. Example: "BTC,ETH". At least one "id" or "slug" or "symbol" is required for this request.

 time_period	
string
"daily"
"daily""hourly"
Time period to return OHLCV data for. The default is "daily". If hourly, the open will be 01:00 and the close will be 01:59. If daily, the open will be 00:00:00 for the day and close will be 23:59:99 for the same day. See the main endpoint description for details.

 time_start	
string
Timestamp (Unix or ISO 8601) to start returning OHLCV time periods for. Only the date portion of the timestamp is used for daily OHLCV so it's recommended to send an ISO date format like "2018-09-19" without time.

 time_end	
string
Timestamp (Unix or ISO 8601) to stop returning OHLCV time periods for (inclusive). Optional, if not passed we'll default to the current time. Only the date portion of the timestamp is used for daily OHLCV so it's recommended to send an ISO date format like "2018-09-19" without time.

 count	
number [ 1 .. 10000 ]
10
Optionally limit the number of time periods to return results for. The default is 10 items. The current query limit is 10000 items.

 interval	
string
"daily"
"hourly""daily""weekly""monthly""yearly""1h""2h""3h""4h""6h""12h""1d""2d""3d""7d""14d""15d""30d""60d""90d""365d"
Optionally adjust the interval that "time_period" is sampled. For example with interval=monthly&time_period=daily you will see a daily OHLCV record for January, February, March and so on. See main endpoint description for available options.

 convert	
string
By default market quotes are returned in USD. Optionally calculate market quotes in up to 3 fiat currencies or cryptocurrencies.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 skip_invalid	
boolean
true
Pass true to relax request validation rules. When requesting records on multiple cryptocurrencies an error is returned if any invalid cryptocurrencies are requested or a cryptocurrency does not have matching records in the requested timeframe. If set to true, invalid lookups will be skipped allowing valid cryptocurrencies to still be returned.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results of your query returned as an object.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/cryptocurrency/ohlcv/historical
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/ohlcv/historical

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"quotes": [
{
"time_open": "2019-01-02T00:00:00.000Z",
"time_close": "2019-01-02T23:59:59.999Z",
"time_high": "2019-01-02T03:53:00.000Z",
"time_low": "2019-01-02T02:43:00.000Z",
"quote": {
"USD": {
"open": 3849.21640853,
"high": 3947.9812729,
"low": 3817.40949569,
"close": 3943.40933686,
"volume": 5244856835.70851,
"market_cap": 68849856731.6738,
"timestamp": "2019-01-02T23:59:59.999Z"
}
}
},
{
"time_open": "2019-01-03T00:00:00.000Z",
"time_close": "2019-01-03T23:59:59.999Z",
"time_high": "2019-01-02T03:53:00.000Z",
"time_low": "2019-01-02T02:43:00.000Z",
"quote": {
"USD": {
"open": 3931.04863841,
"high": 3935.68513083,
"low": 3826.22287069,
"close": 3836.74131867,
"volume": 4530215218.84018,
"market_cap": 66994920902.7202,
"timestamp": "2019-01-03T23:59:59.999Z"
}
}
}
]
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
OHLCV Latest v1 (deprecated)
Returns the latest OHLCV (Open, High, Low, Close, Volume) market values for one or more cryptocurrencies for the current UTC day. Since the current UTC day is still active these values are updated frequently. You can find the final calculated OHLCV values for the last completed UTC day along with all historic days using /cryptocurrency/ohlcv/historical.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Every 10 minutes. Additional OHLCV intervals and 1 minute updates will be available in the future.
Plan credit use: 1 call credit per 100 OHLCV values returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: No equivalent, this data is only available via API.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated cryptocurrency CoinMarketCap IDs. Example: 1,2

 symbol	
string
Alternatively pass one or more comma-separated cryptocurrency symbols. Example: "BTC,ETH". At least one "id" or "symbol" is required.

 convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 skip_invalid	
boolean
true
Pass true to relax request validation rules. When requesting records on multiple cryptocurrencies an error is returned if any invalid cryptocurrencies are requested or a cryptocurrency does not have matching records in the requested timeframe. If set to true, invalid lookups will be skipped allowing valid cryptocurrencies to still be returned.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
A map of cryptocurrency objects by ID or symbol (as passed in query parameters).

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/cryptocurrency/ohlcv/latest
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/ohlcv/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"1": {
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"last_updated": "2018-09-10T18:54:00.000Z",
"time_open": "2018-09-10T00:00:00.000Z",
"time_close": null,
"time_high": "2018-09-10T00:00:00.000Z",
"time_low": "2018-09-10T00:00:00.000Z",
"quote": {
"USD": {
"open": 6301.57,
"high": 6374.98,
"low": 6292.76,
"close": 6308.76,
"volume": 3786450000,
"last_updated": "2018-09-10T18:54:00.000Z"
}
}
}
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Price Performance Stats v1 (deprecated)
Returns price performance statistics for one or more cryptocurrencies including launch price ROI and all-time high / all-time low. Stats are returned for an all_time period by default. UTC yesterday and a number of rolling time periods may be requested using the time_period parameter. Utilize the convert parameter to translate values into multiple fiats or cryptocurrencies using historical rates.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Every 60 seconds.
Plan credit use: 1 call credit per 100 cryptocurrencies returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: The statistics module displayed on cryptocurrency pages like Bitcoin.

NOTE: You may also use /cryptocurrency/ohlcv/historical for traditional OHLCV data at historical daily and hourly intervals. You may also use /v1/cryptocurrency/ohlcv/latest for OHLCV data for the current UTC day.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated cryptocurrency CoinMarketCap IDs. Example: 1,2

 slug	
string
Alternatively pass a comma-separated list of cryptocurrency slugs. Example: "bitcoin,ethereum"

 symbol	
string
Alternatively pass one or more comma-separated cryptocurrency symbols. Example: "BTC,ETH". At least one "id" or "slug" or "symbol" is required for this request.

 time_period	
string
"all_time"
Specify one or more comma-delimited time periods to return stats for. all_time is the default. Pass all_time,yesterday,24h,7d,30d,90d,365d to return all supported time periods. All rolling periods have a rolling close time of the current request time. For example 24h would have a close time of now and an open time of 24 hours before now. Please note: yesterday is a UTC period and currently does not currently support high and low timestamps.

 convert	
string
Optionally calculate quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 skip_invalid	
boolean
true
Pass true to relax request validation rules. When requesting records on multiple cryptocurrencies an error is returned if no match is found for 1 or more requested cryptocurrencies. If set to true, invalid lookups will be skipped allowing valid cryptocurrencies to still be returned.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
An object map of cryptocurrency objects by ID, slug, or symbol (as used in query parameters).

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/cryptocurrency/price-performance-stats/latest
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/price-performance-stats/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"1": {
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"slug": "bitcoin",
"last_updated": "2019-08-22T01:51:32.000Z",
"periods": {
"all_time": {
"open_timestamp": "2013-04-28T00:00:00.000Z",
"high_timestamp": "2017-12-17T12:19:14.000Z",
"low_timestamp": "2013-07-05T18:56:01.000Z",
"close_timestamp": "2019-08-22T01:52:18.613Z",
"quote": {
"USD": {
"open": 135.3000030517578,
"open_timestamp": "2013-04-28T00:00:00.000Z",
"high": 20088.99609375,
"high_timestamp": "2017-12-17T12:19:14.000Z",
"low": 65.5260009765625,
"low_timestamp": "2013-07-05T18:56:01.000Z",
"close": 65.5260009765625,
"close_timestamp": "2019-08-22T01:52:18.618Z",
"percent_change": 7223.718930042746,
"price_change": 9773.691932798241
}
}
}
}
}
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Quotes Historical v1 (deprecated)
Returns an interval of historic market quotes for any cryptocurrency based on time and interval parameters.

Technical Notes

A historic quote for every "interval" period between your "time_start" and "time_end" will be returned.
If a "time_start" is not supplied, the "interval" will be applied in reverse from "time_end".
If "time_end" is not supplied, it defaults to the current time.
At each "interval" period, the historic quote that is closest in time to the requested time will be returned.
If no historic quotes are available in a given "interval" period up until the next interval period, it will be skipped.
Implementation Tips

Want to get the last quote of each UTC day? Don't use "interval=daily" as that returns the first quote. Instead use "interval=24h" to repeat a specific timestamp search every 24 hours and pass ex. "time_start=2019-01-04T23:59:00.000Z" to query for the last record of each UTC day.
This endpoint supports requesting multiple cryptocurrencies in the same call. Please note the API response will be wrapped in an additional object in this case.
Interval Options
There are 2 types of time interval formats that may be used for "interval".

The first are calendar year and time constants in UTC time:
"hourly" - Get the first quote available at the beginning of each calendar hour.
"daily" - Get the first quote available at the beginning of each calendar day.
"weekly" - Get the first quote available at the beginning of each calendar week.
"monthly" - Get the first quote available at the beginning of each calendar month.
"yearly" - Get the first quote available at the beginning of each calendar year.

The second are relative time intervals.
"m": Get the first quote available every "m" minutes (60 second intervals). Supported minutes are: "5m", "10m", "15m", "30m", "45m".
"h": Get the first quote available every "h" hours (3600 second intervals). Supported hour intervals are: "1h", "2h", "3h", "4h", "6h", "12h".
"d": Get the first quote available every "d" days (86400 second intervals). Supported day intervals are: "1d", "2d", "3d", "7d", "14d", "15d", "30d", "60d", "90d", "365d".

This endpoint is available on the following API plans:

Basic
Hobbyist (1 month)
Startup (1 month)
Standard (3 month)
Professional (12 months)
Enterprise (Up to 6 years)
Cache / Update frequency: Every 5 minutes.
Plan credit use: 1 call credit per 100 historical data points returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Our historical cryptocurrency charts like coinmarketcap.com/currencies/bitcoin/#charts.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated CoinMarketCap cryptocurrency IDs. Example: "1,2"

 symbol	
string
Alternatively pass one or more comma-separated cryptocurrency symbols. Example: "BTC,ETH". At least one "id" or "symbol" is required for this request.

 time_start	
string
Timestamp (Unix or ISO 8601) to start returning quotes for. Optional, if not passed, we'll return quotes calculated in reverse from "time_end".

 time_end	
string
Timestamp (Unix or ISO 8601) to stop returning quotes for (inclusive). Optional, if not passed, we'll default to the current time. If no "time_start" is passed, we return quotes in reverse order starting from this time.

 count	
number [ 1 .. 10000 ]
10
The number of interval periods to return results for. Optional, required if both "time_start" and "time_end" aren't supplied. The default is 10 items. The current query limit is 10000.

 interval	
string
"5m"
"yearly""monthly""weekly""daily""hourly""5m""10m""15m""30m""45m""1h""2h""3h""4h""6h""12h""24h""1d""2d""3d""7d""14d""15d""30d""60d""90d""365d"
Interval of time to return data points for. See details in endpoint description.

 convert	
string
By default market quotes are returned in USD. Optionally calculate market quotes in up to 3 other fiat currencies or cryptocurrencies.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 aux	
string
"price,volume,market_cap,circulating_supply,total_supply,quote_timestamp,is_active,is_fiat"
Optionally specify a comma-separated list of supplemental data fields to return. Pass price,volume,market_cap,circulating_supply,total_supply,quote_timestamp,is_active,is_fiat,search_interval to include all auxiliary fields.

 skip_invalid	
boolean
true
Pass true to relax request validation rules. When requesting records on multiple cryptocurrencies an error is returned if no match is found for 1 or more requested cryptocurrencies. If set to true, invalid lookups will be skipped allowing valid cryptocurrencies to still be returned.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Results of your query returned as an object map.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/cryptocurrency/quotes/historical
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/historical

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"is_active": 1,
"is_fiat": 0,
"quotes": [
{
"timestamp": "2018-06-22T19:29:37.000Z",
"quote": {
"USD": {
"price": 6242.29,
"volume_24h": 4681670000,
"market_cap": 106800038746.48,
"circulating_supply": 4681670000,
"total_supply": 4681670000,
"timestamp": "2018-06-22T19:29:37.000Z"
}
}
},
{
"timestamp": "2018-06-22T19:34:33.000Z",
"quote": {
"USD": {
"price": 6242.82,
"volume_24h": 4682330000,
"market_cap": 106809106575.84,
"circulating_supply": 4681670000,
"total_supply": 4681670000,
"timestamp": "2018-06-22T19:34:33.000Z"
}
}
}
]
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Quotes Latest v1 (deprecated)
Returns the latest market quote for 1 or more cryptocurrencies. Use the "convert" option to return market values in multiple fiat and cryptocurrency conversions in the same call.

This endpoint is available on the following API plans:

Basic
Startup
Hobbyist
Standard
Professional
Enterprise
Cache / Update frequency: Every 60 seconds.
Plan credit use: 1 call credit per 100 cryptocurrencies returned (rounded up) and 1 call credit per convert option beyond the first.
CMC equivalent pages: Latest market data pages for specific cryptocurrencies like coinmarketcap.com/currencies/bitcoin/.

NOTE: Use this endpoint to request the latest quote for specific cryptocurrencies. If you need to request all cryptocurrencies use /v1/cryptocurrency/listings/latest which is optimized for that purpose. The response data between these endpoints is otherwise the same.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated cryptocurrency CoinMarketCap IDs. Example: 1,2

 slug	
string
Alternatively pass a comma-separated list of cryptocurrency slugs. Example: "bitcoin,ethereum"

 symbol	
string
Alternatively pass one or more comma-separated cryptocurrency symbols. Example: "BTC,ETH". At least one "id" or "slug" or "symbol" is required for this request.

 convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 aux	
string
"num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,is_active,is_fiat"
Optionally specify a comma-separated list of supplemental data fields to return. Pass num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_active,is_fiat to include all auxiliary fields.

 skip_invalid	
boolean
true
Pass true to relax request validation rules. When requesting records on multiple cryptocurrencies an error is returned if no match is found for 1 or more requested cryptocurrencies. If set to true, invalid lookups will be skipped allowing valid cryptocurrencies to still be returned.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
A map of cryptocurrency objects by ID, symbol, or slug (as used in query parameters).

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/cryptocurrency/quotes/latest
Server URL

https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"1": {
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"slug": "bitcoin",
"is_active": 1,
"is_fiat": 0,
"circulating_supply": 17199862,
"total_supply": 17199862,
"max_supply": 21000000,
"date_added": "2013-04-28T00:00:00.000Z",
"num_market_pairs": 331,
"cmc_rank": 1,
"last_updated": "2018-08-09T21:56:28.000Z",
"tags": [
"mineable"
],
"platform": null,
"self_reported_circulating_supply": null,
"self_reported_market_cap": null,
"quote": {
"USD": {
"price": 6602.60701122,
"volume_24h": 4314444687.5194,
"volume_change_24h": -0.152774,
"percent_change_1h": 0.988615,
"percent_change_24h": 4.37185,
"percent_change_7d": -12.1352,
"percent_change_30d": -12.1352,
"market_cap": 852164659250.2758,
"market_cap_dominance": 51,
"fully_diluted_market_cap": 952835089431.14,
"last_updated": "2018-08-09T21:56:28.000Z"
}
}
}
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
FCAS Listings Latest (deprecated)
Returns a paginated list of FCAS scores for all cryptocurrencies currently supported by FCAS. FCAS ratings are on a 0-1000 point scale with a corresponding letter grade and is updated once a day at UTC midnight.

FCAS stands for Fundamental Crypto Asset Score, a single, consistently comparable value for measuring cryptocurrency project health. FCAS measures User Activity, Developer Behavior and Market Maturity and is provided by FlipSide Crypto. Find out more about FCAS methodology. Users interested in FCAS historical data including sub-component scoring may inquire through our CSV Data Delivery request form.

Disclaimer: Ratings that are calculated by third party organizations and are not influenced or endorsed by CoinMarketCap in any way.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Once a day at UTC midnight.
Plan credit use: 1 call credit per 100 FCAS scores returned (rounded up).
CMC equivalent pages: The FCAS ratings available under our cryptocurrency ratings tab like coinmarketcap.com/currencies/bitcoin/#ratings.

NOTE: Use this endpoint to request the latest FCAS score for all supported cryptocurrencies at the same time. If you require FCAS for only specific cryptocurrencies use /v1/partners/flipside-crypto/fcas/quotes/latest which is optimized for that purpose. The response data between these endpoints is otherwise the same.


PARAMETERS
Query Parameters ?
 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of items to return.

 limit	
integer [ 1 .. 5000 ]
100
Optionally specify the number of results to return. Use this parameter and the "start" parameter to determine your own pagination size.

 aux	
string
"point_change_24h,percent_change_24h"
Optionally specify a comma-separated list of supplemental data fields to return. Pass point_change_24h,percent_change_24h to include all auxiliary fields.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Array of cryptocurrency objects matching the list options.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/partners/flipside-crypto/fcas/listings/latest
Server URL

https://pro-api.coinmarketcap.com/v1/partners/flipside-crypto/fcas/listings/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": [
{
"id": 1027,
"name": "Ethereum",
"symbol": "ETH",
"slug": "ethereum",
"score": 971,
"grade": "S",
"last_updated": "2021-05-05T00:00:00Z"
},
{
"id": 2010,
"name": "Cardano",
"symbol": "ADA",
"slug": "cardano",
"score": 961,
"grade": "S",
"last_updated": "2021-05-05T00:00:00Z"
}
],
"status": {
"timestamp": "2018-06-02T22:51:28.209Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1
}
}
FCAS Quotes Latest (deprecated)
Returns the latest FCAS score for 1 or more cryptocurrencies. FCAS ratings are on a 0-1000 point scale with a corresponding letter grade and is updated once a day at UTC midnight.

FCAS stands for Fundamental Crypto Asset Score, a single, consistently comparable value for measuring cryptocurrency project health. FCAS measures User Activity, Developer Behavior and Market Maturity and is provided by FlipSide Crypto. Find out more about FCAS methodology. Users interested in FCAS historical data including sub-component scoring may inquire through our CSV Data Delivery request form.

Disclaimer: Ratings that are calculated by third party organizations and are not influenced or endorsed by CoinMarketCap in any way.

This endpoint is available on the following API plans:

Basic
Hobbyist
Startup
Standard
Professional
Enterprise
Cache / Update frequency: Once a day at UTC midnight.
Plan credit use: 1 call credit per 100 FCAS scores returned (rounded up).
CMC equivalent pages: The FCAS ratings available under our cryptocurrency ratings tab like coinmarketcap.com/currencies/bitcoin/#ratings.

NOTE: Use this endpoint to request the latest FCAS score for specific cryptocurrencies. If you require FCAS for all supported cryptocurrencies use /v1/partners/flipside-crypto/fcas/listings/latest which is optimized for that purpose. The response data between these endpoints is otherwise the same.


PARAMETERS
Query Parameters ?
 id	
string
One or more comma-separated cryptocurrency CoinMarketCap IDs. Example: 1,2

 slug	
string
Alternatively pass a comma-separated list of cryptocurrency slugs. Example: "bitcoin,ethereum"

 symbol	
string
Alternatively pass one or more comma-separated cryptocurrency symbols. Example: "BTC,ETH". At least one "id" or "slug" or "symbol" is required for this request.

 aux	
string
"point_change_24h,percent_change_24h"
Optionally specify a comma-separated list of supplemental data fields to return. Pass point_change_24h,percent_change_24h to include all auxiliary fields.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
A map of cryptocurrency objects by ID or symbol (as used in query parameters).

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/partners/flipside-crypto/fcas/quotes/latest
Server URL

https://pro-api.coinmarketcap.com/v1/partners/flipside-crypto/fcas/quotes/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"1": {
"id": 1,
"name": "Bitcoin",
"symbol": "BTC",
"slug": "bitcoin",
"score": 894,
"grade": "A",
"percent_change_24h": 0.56,
"point_change_24h": 5,
"last_updated": "2019-08-08T00:00:00Z"
}
},
"status": {
"timestamp": "2024-02-20T14:19:20.781Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1,
"notice": ""
}
}
Content Latest
Returns a paginated list of content pulled from CMC News/Headlines and Alexandria articles.

This endpoint is available on the following API plans:

Standard
Professional
Enterprise
Cache / Update frequency: Five Minutes Plan credit use: 0 credit


PARAMETERS
Query Parameters ?
 start	
integer >= 1
1
Optionally offset the start (1-based index) of the paginated list of items to return.

 limit	
integer [ 1 .. 200 ]
100
Optionally specify the number of results to return. Use this parameter and the "start" parameter to determine your own pagination size.

 id	
string
Optionally pass a comma-separated list of CoinMarketCap cryptocurrency IDs. Example: "1,1027"

 slug	
string
Optionally pass a comma-separated list of cryptocurrency slugs. Example: "bitcoin,ethereum"

 symbol	
string
Optionally pass a comma-separated list of cryptocurrency symbols. Example: "BTC,ETH". Optionally pass "id" or "slug" or "symbol" is required for this request.

 news_type	
string
"all"
Optionally specify a comma-separated list of supplemental data fields: news, community, or alexandria to filter news sources. Pass all or leave it blank to include all news types.

 content_type	
string
"all"
Optionally specify a comma-separated list of supplemental data fields: news, video, or audio to filter news's content. Pass all or leave it blank to include all content types.

 category	
string
Optionally pass a comma-separated list of categories. Example: "GameFi,NFT".

 language	
string
"en"
"en""zh""zh-tw""de""id""ja""ko""es""th""tr""vi""ru""fr""nl""ar""pt-br""hi""pl""uk""fil-rph""it"
Optionally pass a language code. Example: "en". If not specified the default value is "en".

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Array of content objects.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/content/latest
Server URL

https://pro-api.coinmarketcap.com/v1/content/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": [
{
"cover": "https://academy-public.coinmarketcap.com/optimized-uploads/0aec0502868046419ceace229f92601f.gif",
"assets": [
{
"id": 1027,
"name": "Ethereum",
"symbol": "ETH",
"slug": "ethereum"
}
],
"created_at": "2021-05-05T00:00:00Z",
"released_at": "2021-05-05T00:00:00Z",
"title": "Article Title",
"subtitle": "Article Subtitle",
"type": "alexandria",
"source_name": "Connor Sephton",
"source_url": "https://coinmarketcap.com/alexandria/article/coinmarketcap-news-august-9-u-s-comes-for-tornado-cash"
}
],
"status": {
"timestamp": "2018-06-02T22:51:28.209Z",
"error_code": 0,
"error_message": "",
"elapsed": 10,
"credit_count": 1
}
}
Community Trending Tokens
Returns the latest trending tokens from the CMC Community.

This endpoint is available on the following API plans:

Standard
Professional
Enterprise
Cache / Update frequency: One Minute Plan credit use: 0 credit


PARAMETERS
Query Parameters ?
 limit	
integer [ 1 .. 5 ]
5
Optionally specify the number of results to return.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Cntent objects.

 rank	
number
The community rank of the coin

 id	
integer
The unique CoinMarketCap ID for this cryptocurrency.

 name	
string
The name of this cryptocurrency.

 symbol	
string
The ticker symbol for this cryptocurrency.

 slug	
string
The web URL friendly shorthand version of this cryptocurrency name.

 cmc_rank	
integer
The cryptocurrency's CoinMarketCap rank by market cap.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/community/trending/token
Server URL

https://pro-api.coinmarketcap.com/v1/community/trending/token

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": [
{
"id": 7102,
"name": "Linear Finance",
"symbol": "LINA",
"slug": "linear",
"cmc_rank": 461,
"rank": 1
},
{
"id": 26265,
"name": "NiHao",
"symbol": "NIHAO",
"slug": "nihao",
"cmc_rank": 5000,
"rank": 2
},
{
"id": 22538,
"name": "T-mac DAO",
"symbol": "TMG",
"slug": "t-mac-dao",
"cmc_rank": 4802,
"rank": 3
},
{
"id": 2398,
"name": "SelfKey",
"symbol": "KEY",
"slug": "selfkey",
"cmc_rank": 753,
"rank": 4
},
{
"id": 3437,
"name": "ABBC Coin",
"symbol": "ABBC",
"slug": "abbc-coin",
"cmc_rank": 178,
"rank": 5
}
],
"status": {
"timestamp": "2022-09-08T16:08:52.641Z",
"error_code": "0",
"error_message": "SUCCESS",
"elapsed": "0",
"credit_count": 0
}
}
Community Trending Topics
Returns the latest trending topics from the CMC Community.

This endpoint is available on the following API plans:

Standard
Professional
Enterprise
Cache / Update frequency: One Minute Plan credit use: 0 credit


PARAMETERS
Query Parameters ?
 limit	
integer [ 1 .. 5 ]
5
Optionally specify the number of results to return.

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Cntent objects.

 rank	
number
The community rank of the topic

 topic	
string
The trending topic name

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/community/trending/topic
Server URL

https://pro-api.coinmarketcap.com/v1/community/trending/topic

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": [
{
"rank": 1,
"topic": "Tether"
},
{
"rank": 2,
"topic": "DebtCeiling"
},
{
"rank": 3,
"topic": "HongKong"
},
{
"rank": 4,
"topic": "AI"
},
{
"rank": 5,
"topic": "MIEX"
}
],
"status": {
"timestamp": "2022-09-08T16:08:52.641Z",
"error_code": "0",
"error_message": "SUCCESS",
"elapsed": "0",
"credit_count": 0
}
}
Content Post Comments
Returns comments of the CMC Community post.

This endpoint is available on the following API plans:

Standard
Professional
Enterprise
Cache / Update frequency: Five Minutes Plan credit use: 0 credit


PARAMETERS
Query Parameters ?
 post_id	
string Required
Required post ID. Example: 325670123

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Array of content objects.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/content/posts/comments
Server URL

https://pro-api.coinmarketcap.com/v1/content/posts/comments

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": [
{
"post_id": "317807035",
"owner": {
"nickname": "Amy",
"avatar_url": "https://s3.coinmarketcap.com/static/img/portraits/61359449293ccc2c4bcf07c7.png"
},
"text_content": "Someone's working on it!!",
"photos": [ ],
"comment_count": "0",
"like_count": "0",
"post_time": "1662640110429",
"language_code": "en"
},
{
"post_id": "317807862",
"owner": {
"nickname": "Wanda",
"avatar_url": "https://s3.coinmarketcap.com/static/img/portraits/6136cf1015b8f3308e283073.png"
},
"text_content": "yes sir!!",
"photos": [ ],
"comment_count": "0",
"like_count": "0",
"post_time": "1662635039889",
"language_code": "en"
}
],
"status": {
"timestamp": "2022-09-08T16:07:30.033Z",
"error_code": "0",
"error_message": "SUCCESS",
"elapsed": "0",
"credit_count": 0
}
}
Content Latest Posts
Returns the latest crypto-related posts from the CMC Community.

This endpoint is available on the following API plans:

Standard
Professional
Enterprise
Cache / Update frequency: Five Minutes Plan credit use: 0 credit


PARAMETERS
Query Parameters ?
 id	
string
Optional one cryptocurrency CoinMarketCap ID. Example: 1027

 slug	
string
Alternatively pass one cryptocurrency slug. Example: "ethereum"

 symbol	
string
Alternatively pass one cryptocurrency symbols. Example: "ETH"

 last_score	
string
Optional. The score is given in the response for finding next batch posts. Example: 1662903634322

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Cntent objects.

 list 	
 last_score	
number
400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/content/posts/latest
Server URL

https://pro-api.coinmarketcap.com/v1/content/posts/latest

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"list": [
{
"post_id": "123456789",
"comments_url": "{{baseUrl}}/v1/content/posts/comments?post_id=123456789",
"owner": {
"nickname": "CoinMarketCap",
"avatar_url": "https://s3.coinmarketcap.com/static/img/portraits/621c22097aafe46422aa1161.png"
},
"text_content": "$ETH regardless of merging or not merging...",
"photos": [
"https://s3.coinmarketcap.com/static/img/portraits/621c22097aafe46422aa1161.png"
],
"comment_count": "5",
"like_count": "5",
"post_time": "1662643031298",
"currencies": [
{
"id": 1027,
"symbol": "ETH",
"slug": "ethereum"
}
],
"language_code": "en"
},
{
"post_id": "123456790",
"comments_url": "{{baseUrl}}/v1/content/posts/comments?post_id=123456790",
"owner": {
"nickname": "John",
"avatar_url": "https://s3.coinmarketcap.com/static/img/portraits/61b9aaca1d79d0637758fdeb.png"
},
"text_content": "$ETH The success and the failure are almost...",
"photos": [
"https://s3.coinmarketcap.com/static/img/portraits/621c22097aafe46422aa1161.png"
],
"comment_count": "6",
"like_count": "60",
"post_time": "1662612816768",
"currencies": [
{
"id": 1027,
"symbol": "ETH",
"slug": "ethereum"
}
],
"repost_count": "0",
"language_code": "en"
}
],
"last_score": "1662903634322"
},
"status": {
"timestamp": "2022-09-08T16:08:52.641Z",
"error_code": "0",
"error_message": "SUCCESS",
"elapsed": "0",
"credit_count": 0
}
}
Content Top Posts
Returns the top crypto-related posts from the CMC Community.

This endpoint is available on the following API plans:

Standard
Professional
Enterprise
Cache / Update frequency: Five Minutes Plan credit use: 0 credit


PARAMETERS
Query Parameters ?
 id	
string
Optional one cryptocurrency CoinMarketCap ID. Example: 1027

 slug	
string
Alternatively pass one cryptocurrency slug. Example: "ethereum"

 symbol	
string
Alternatively pass one cryptocurrency symbols. Example: "ETH"

 last_score	
string
Optional. The score is given in the response for finding next batch of related posts. Example: 38507.8865

Responses
200 Successful

RESPONSE SCHEMA
 data 	
Cntent objects.

 status 	
Standardized status object for API calls.

400 Bad Request

401 Unauthorized

403 Forbidden

429 Too Many Requests

500 Internal Server Error

GET /v1/content/posts/top
Server URL

https://pro-api.coinmarketcap.com/v1/content/posts/top

RESPONSE SAMPLES
200 Successful400 Bad Request401 Unauthorized403 Forbidden429 Too Many Requests500 Internal Server Error
{
"data": {
"list": [
{
"post_id": "123456789",
"comments_url": "{{baseUrl}}/v1/content/posts/comments?post_id=123456789",
"owner": {
"nickname": "CoinMarketCap",
"avatar_url": "https://s3.coinmarketcap.com/static/img/portraits/621c22097aafe46422aa1161.png"
},
"text_content": "$ETH regardless of merging or not merging...",
"photos": [
"https://s3.coinmarketcap.com/static/img/portraits/621c22097aafe46422aa1161.png"
],
"comment_count": "5",
"like_count": "5",
"post_time": "1662643031298",
"currencies": [
{
"id": 1027,
"symbol": "ETH",
"slug": "ethereum"
}
],
"language_code": "en"
},
{
"post_id": "123456790",
"comments_url": "{{baseUrl}}/v1/content/posts/comments?post_id=123456790",
"owner": {
"nickname": "John",
"avatar_url": "https://s3.coinmarketcap.com/static/img/portraits/61b9aaca1d79d0637758fdeb.png"
},
"text_content": "$ETH The success and the failure are almost...",
"photos": [
"https://s3.coinmarketcap.com/static/img/portraits/621c22097aafe46422aa1161.png"
],
"comment_count": "6",
"like_count": "60",
"post_time": "1662612816768",
"currencies": [
{
"id": 1027,
"symbol": "ETH",
"slug": "ethereum"
}
],
"repost_count": "0",
"language_code": "en"
}
],
"last_score": "38507.8865"
},
"status": {
"timestamp": "2022-09-08T16:08:52.641Z",
"error_code": "0",
"error_message": "SUCCESS",
"elapsed": "0",
"credit_count": 0
}
}
Powered by ReDoc
© 2024 CoinMarketCap
PricingAPI DocumentationFAQAPI Status
