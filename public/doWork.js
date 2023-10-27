/**
Returns the encoded URL for performing a Bing search with specific criteria.
@param {string} keyword - The keyword to search for.
@returns {string} - The encoded URL for the Bing search.
*/
const getEncodedURL = (keyword) =>
	`https://www.bing.com/search?q=${encodeURIComponent(
		keyword
	)}+site%3Ahttps%3A%2F%2Ffacebook.com+prefer%3Abusiness+-biz+loc%3AUS&qs=n&form=QBRE&sp=-1&pq=${encodeURIComponent(
		keyword
	)}+site%3Ahttps%3A%2F%2Ffacebook.com`;

/**
Toggles the disabled state of the settings form inputs.
@param {boolean} isDisabled - Determines whether the inputs should be disabled or enabled.
If true, the inputs will be disabled. If false, the inputs will be enabled.
*/
const toggleSettingsForm = (isDisabled) => {
	const inputs = document.querySelectorAll("#settings form input");
	inputs.forEach((input) => (input.disabled = isDisabled));
};

/**
Creates a header row in a table and inserts cells with specified header text.
@param {HTMLTableElement} table - The table element to which the header row will be added.
@param {Array<string>} headers - An array of strings representing the header text for each cell.
*/
const createHeaderRow = (table, headers) =>
	headers.forEach((headerText) => (table.insertRow().insertCell().innerHTML = `<b>${headerText}</b>`));

/**
Fetches data from a server using the provided URL and data.
@async
@param {string} url - The URL to fetch data from.
@param {object} data - The data to send in the request body.
@returns {Promise} - A Promise that resolves to the JSON response from the server.
*/
const fetchFromServer = async (url, data) => {
	const response = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	return response.json();
};

/**
Generates a table with the provided tableId, headers, data, and row callback function.
@param {string} tableId - The ID of the HTML element where the table will be generated.
@param {Array} headers - An array of strings representing the table headers.
@param {Array} data - An array of objects representing the data for each table row.
@param {Function} rowCallback - A callback function that is called for each row to generate its content.
*/
const GenerateTable = (tableId, headers, data, rowCallback) => {
	const table = document.getElementById(tableId);
	table.innerHTML = "";
	createHeaderRow(table, headers);
	data.forEach((row, index) => rowCallback(table, row, index));
};

/**
Retrieves settings from the HTML elements and returns them as an object.
@returns {object} - An object containing the settings for the "bing" and "cache" queues.
*/
const getSettings = () => ({
	bing: {
		concurrent: document.getElementById("bing-queue-concurrent").value,
		delay: document.getElementById("bing-queue-delay").value,
	},
	cache: {
		concurrent: document.getElementById("cache-queue-concurrent").value,
		delay: document.getElementById("cache-queue-delay").value,
	},
});

/**
Retrieves keywords and performs related operations asynchronously.
Updates the tables "keywordsTable" and "CacheLinksTable" with the obtained data.
@async
@returns {void}
*/
async function processKeywords() {
	toggleSettingsForm(true);

	// Retrieve keywords from the server
	const response = await fetchFromServer("/getKeywords", {
		count: parseInt(document.getElementById("random-keywords-count").value),
	});
	const town = document.getElementById("town").value;

	// Process the response data and generate keyword objects
	const keywords = response.map((row, index) => ({
		index: index + 1,
		keyword: row.column_keyword,
		status: "Not Started",
		encodedKeywordURL: getEncodedURL(`${row.column_keyword} in "${town}"`),
		encodedKeyword: encodeURIComponent(row.column_keyword),
	}));

	// Generate the "keywordsTable" using the generated keyword data
	GenerateTable("keywordsTable", ["Index", "Combined Keywords", "Status", "Bing URL"], keywords, (table, row) => {
		const rowElement = table.insertRow();
		const indexCell = rowElement.insertCell();
		indexCell.innerHTML = row.index;
		const keywordCell = rowElement.insertCell();
		const combinedKeyword = `${row.keyword} in "${town}"`;
		keywordCell.innerHTML = `${combinedKeyword}`;
		const statusCell = rowElement.insertCell();
		statusCell.innerHTML = row.status;
		const displayedUrl =
			row.encodedKeywordURL.length > 50 ? row.encodedKeywordURL.substring(0, 50) + "..." : row.encodedKeywordURL;
		const bingURL = rowElement.insertCell();
		bingURL.innerHTML = `<a href="${row.encodedKeywordURL}" target="_blank">${displayedUrl}</a>`;
	});

	// Process keywords with Bing and retrieve cache links
	const bingData = await fetchFromServer("/processBingKeywords", {
		keywords: keywords.map((row) => ({ ...row, options: getSettings() })),
	});

	console.log(bingData);

	// Generate the "CacheLinksTable" using the obtained cache links
	GenerateTable("CacheLinksTable", ["Index", "Links", "Status"], bingData.cacheLinks, (table, row, index) => {
		const rowElement = table.insertRow();
		const indexCell = rowElement.insertCell();
		indexCell.innerHTML = index;
		const displayedUrl = row.length > 50 ? row.substring(0, 50) + "..." : row;
		const linksCell = rowElement.insertCell();
		linksCell.innerHTML = `<a href="${row}" target="_blank">${displayedUrl}</a>`;
		const statusCell = rowElement.insertCell();
		statusCell.innerHTML = "Not started";
	});

	// Process cache links
	const cacheLinksResponse = await fetchFromServer("/processCacheLinks", {
		cacheLinks: bingData.cacheLinks.map((row, index) => ({ index, URL: row, options: getSettings() })),
	});

	console.log(cacheLinksResponse);
	toggleSettingsForm(false);
}
