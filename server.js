// This imports the necessary packages for this code
const Queue = require("better-queue");
const http = require("http");
const WebSocket = require("ws");
const express = require("express");

// These import the custom modules that are used in this code
const BingScraper = require("./src/BingScraper");
const CacheLinksScraper = require("./src/CacheLinksScraper");
const dbConnection = require("./src/db_connection");

const nodemailer = require("nodemailer");

var stringSimilarity = require("string-similarity");

// This creates a new instance of the Express application
const app = express();

// This sets the port number for the application to listen on
const port = 8080;

// These are middleware functions that allow for parsing of JSON and serving static files
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "/public/css"));

// This creates an HTTP server instance using the Express application instance
const server = http.createServer(app);

// This creates a new WebSocket server instance using the HTTP server instance
const wss = new WebSocket.Server({ server });

let similarity_URLS = [];

// This function is called when the server is successfully listening on the specified port
server.listen(port, () => {
	console.log(`Server listening on port ${port}`);

	dbConnection.query(`SELECT facebook_pageURL FROM ai_contacts;`, (err, result) => {
		if (err) {
			console.error("Error retrieving Facebook URLs:", err);
			server.closeAllConnections();
		} else {
			similarity_URLS = result.map((row) => row.facebook_pageURL);

			if (similarity_URLS.length === 0) similarity_URLS.push("text1", "text2", "text3");

			console.log("Similarity URLs loaded");
		}
	});
});

// This function is called when a new WebSocket client connects to the server
wss.on("connection", (ws) => {
	console.log("WebSocket client connected.");
});

// This function handles a POST request to retrieve random keywords from a database table called 'bing_keywords'
app.post("/getKeywords", async (req, res) => {
	const randomKeywordsCount = req.body.count || 5; // Default to 5 if count is not provided
	// A query is constructed to retrieve 5 random keywords from the 'column_keyword' column in the 'bing_keywords' table using the ORDER BY RAND() and LIMIT 5 SQL clauses
	dbConnection.query(
		`SELECT column_keyword FROM bing_keywords ORDER BY RAND() LIMIT ?;`,
		[randomKeywordsCount],
		(err, result) => {
			if (err) {
				// If there's an error executing the query, log the error and send an error message with a 500 status code
				console.error("Error retrieving keywords:", err);
				res.status(500).send("Error retrieving keywords");
			} else {
				// If the query is successful, send the results as a response
				res.send(result);
			}
		}
	);
});

// Initialize an empty array to store cached links
let cacheLinks = [];

// This function handles a POST request to process Bing search results for a set of keywords provided in the request body
app.post("/processBingKeywords", async (req, res) => {
	try {
		// Extract the 'keywords' array from the request body
		const { keywords } = req.body;

		const bingKeywordURLQueue = createBingKeywordURLQueue(keywords[0].options.bing.concurrent, keywords[0].options.bing.delay);

		// Clear the array of cached links
		cacheLinks = [];
		// Create a new instance of a BingScraper object
		const scraper = new BingScraper();
		// Initialize the scraper object
		await scraper.init();
		// Create a promise that resolves when all URLs in the bingKeywordURLQueue have been processed by the scraper object
		const BingQueueFinished = createBingQueueFinishedPromise(scraper, bingKeywordURLQueue);

		// Iterate over each keyword in the 'keywords' array and push its corresponding URL to the bingKeywordURLQueue
		keywords.forEach(({ index, encodedKeywordURL, encodedKeyword }) => {
			bingKeywordURLQueue.push({ scraper, index, URL: encodedKeywordURL, encodedKeyword });
		});

		// Wait for the BingQueueFinished promise to resolve, then send a response with the cached links as part of a success object
		await BingQueueFinished.then(() => res.json({ success: true, cacheLinks }));
	} catch (err) {
		// If an error occurs during the processing, log the error and send a response with a 500 status code and a failure object
		console.error("Error processing keywords:", err);
		res.status(500).json({ success: false });
	}
});

/**
 * This function creates a queue of URLs for Bing search results based on a set of keywords
 */
function createBingKeywordURLQueue(c, d) {
	// Create a new instance of a Queue object with a function called 'processBingQueue' as the callback for each task
	// The Queue object is configured to process tasks based on the settings parsed as concurent (c) count, and delay(d) value in miliseconds
	const queue = new Queue(processBingQueue, {
		concurrent: c,
		afterProcessDelay: d,
	});

	// Register event listeners for the queue object to handle task statuses and errors

	// 'task_started' event: When a task starts, log a message indicating that it has started
	queue.on("task_started", sendTaskStatus("Started", "bing"));
	// 'task_finish' event: When a task finishes successfully, log a message indicating that it has finished
	queue.on("task_finish", sendTaskStatus("Finished", "bing"));
	// 'task_failed' event: When a task fails, log an error message indicating that it has failed
	queue.on("task_failed", sendTaskErrorStatus("bing"));

	// Return the queue object
	return queue;
}

/**
 * This asynchronous function processes a single task in the Bing queue.
 * @param {*} input - Takes an input of scraper instance, URL, and encodedKeyword.
 * @param {*} cb - Used to indicate the queue has been finished.
 */
async function processBingQueue(input, cb) {
	console.log(input.URL);
	// Call the 'scrape' method of the scraper object provided in the 'input' object, passing in the URL and encoded keyword
	// The scrape method returns an array of links, which are then added to the cacheLinks array
	let links = await input.scraper.scrape(input.URL, input.encodedKeyword);
	cacheLinks.push(...links);
	// Call the callback function provided in the 'input' object with a null error and the input object itself
	cb(null, input);
}

// This function creates a promise that resolves when all tasks in the Bing queue have been processed
function createBingQueueFinishedPromise(scraper, bingKeywordURLQueue) {
	return new Promise((resolve, reject) => {
		// Register event listeners for the Bing queue to handle completion and error states
		// 'drain' event: When the queue is empty, close the scraper object and resolve the promise
		bingKeywordURLQueue.on("drain", async () => {
			await scraper.close();
			resolve();
		});
		// 'error' event: When an error occurs, close the scraper object and reject the promise with the error object
		bingKeywordURLQueue.on("error", async (err) => {
			await scraper.close();
			reject(err);
		});
	});
}

// Initialize an empty array to store scraped data
let scrapedData = [];

// Call a function called 'createCacheLinksQueue' which returns a queue of URLs for cached web pages

// This function handles a POST request to process cached web pages based on a set of links provided in the request body
app.post("/processCacheLinks", async (req, res) => {
	try {
		// Extract the 'cacheLinks' array from the request body
		const { cacheLinks } = req.body;

		const CacheLinksQueue = createCacheLinksQueue(cacheLinks[0].options.cache.concurrent, cacheLinks[0].options.cache.delay);

		// Clear the array of scraped data
		scrapedData = [];
		// Create a new instance of a CacheLinksScraper object
		const scraper = new CacheLinksScraper();
		// Initialize the scraper object
		await scraper.init();

		// Create a promise that resolves when all URLs in the CacheLinksQueue have been processed by the scraper object
		const CacheLinksQueueFinished = createCacheLinksQueueFinishedPromise(scraper, CacheLinksQueue);

		// Iterate over each link in the 'cacheLinks' array and push it to the CacheLinksQueue
		cacheLinks.forEach(({ index, URL }) => {
			CacheLinksQueue.push({ scraper, index, URL });
		});

		// Wait for the CacheLinksQueueFinished promise to resolve, then send a response with the scraped data as part of a success object
		await CacheLinksQueueFinished.then(() => res.json({ success: true, scrapedData }));
	} catch (err) {
		// If an error occurs during the processing, log the error and send a response with a 500 status code and a failure object
		console.error("Error processing cache links:", err);
		res.status(500).json({ success: false });
	}
});

/**
 * This function creates a queue of URLs for cached web pages to be processed by a CacheLinksScraper object
 * @returns queue - Returns queue object
 */
function createCacheLinksQueue(c, d) {
	// Create a new instance of a Queue object with a function called 'processCacheQueue' as the callback for each task
	// The Queue object is configured to process up to 'c' tasks concurrently, with a delay of 'd' ms after each task is completed
	const queue = new Queue(processCacheQueue, {
		concurrent: c,
		afterProcessDelay: d,
	});

	// Register event listeners for the queue object to handle task statuses and errors
	// 'task_started' event: When a task starts, log a message indicating that it has started
	queue.on("task_started", sendTaskStatus("Started", "cache"));
	// 'task_finish' event: When a task finishes successfully, log a message indicating that it has finished
	queue.on("task_finish", sendTaskStatus("Finished", "cache"));
	// 'task_failed' event: When a task fails, log an error message indicating that it has failed
	queue.on("task_failed", sendTaskErrorStatus("cache"));

	// Return the queue object
	return queue;
}

/**
 * This asynchronous function processes a single task in the CacheLinks queue
 * @param {*} input
 * @param {*} cb
 */
async function processCacheQueue(input, cb) {
	// Call the 'scrape' method of the scraper object provided in the 'input' object, passing in the index and URL
	// The scrape method returns an object of scraped data, which is then added to the scrapedData array
	let data = await input.scraper.scrape(input.index, input.URL);
	scrapedData.push(data);
	// Add data into the input object
	input.data = data;
	// Call the callback function provided in the 'input' object with a null error and the input object itself
	cb(null, input);
}

/**
 * This function creates a promise that resolves when all tasks in the CacheLinks queue have been processed
 * @param {*} scraper A Puppeteer scraper instance.
 * @param {*} CacheLinksQueue Array of links in the queue.
 * @returns Resolves a promise indicating when queue is empty, and rejects the promise with error.
 */
function createCacheLinksQueueFinishedPromise(scraper, CacheLinksQueue) {
	return new Promise((resolve, reject) => {
		// Register event listeners for the CacheLinks queue to handle completion and error states
		// 'drain' event: When the queue is empty, close the scraper object and resolve the promise

		CacheLinksQueue.on("drain", async () => {
			await scraper.close();
			resolve();
		});
		// 'error' event: When an error occurs, close the scraper object and reject the promise with the error object
		CacheLinksQueue.on("error", async (err) => {
			await scraper.close();
			reject(err);
		});
	});
}

// This function sends a status update for a task to all WebSocket clients
function sendTaskStatus(status, type) {
	return (taskId, task) => {
		// Iterate over each WebSocket client and send a JSON string with the task index, status, type, and data
		wss.clients.forEach((client) => client.send(JSON.stringify([task.index, status, type, task.data])));
	};
}

// This function sends an error status update for a task to all WebSocket clients
function sendTaskErrorStatus(type) {
	return (task, errorMessage) => {
		// Iterate over each WebSocket client and send a JSON string with the task index, error message, and type
		wss.clients.forEach((client) => client.send(JSON.stringify([task.index, `Failed: ${errorMessage}`, type])));
	};
}

/**
 * Function to insert data into the 'cache_contacts' mysql table.
 * Takes in data object and a callback function, constructs a SQL query with the necessary table columns and values.
 * @param {*} data
 * @param {*} callback
 */
const insertData = (data, callback) => {
	// SQL query to insert data into 'cache_contacts' table
	const query = `
    INSERT INTO ai_contacts (
      facebook_pageURL, facebook_pageTitle, facebook_pageDescription, facebook_pageTags,
      website, email, address, phone,
      facebook_links, instagram_links, twitter_links, address_links,
      website_errors, fb_likes, fb_talking, fb_wereHere, hasConditions
    ) VALUES (
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?
    );
  `;

	// Values to be inserted into the table
	const values = [
		data.facebookPageURL,
		data.pageTitle,
		data.pageDescription,
		data.pageTags,
		data.website,
		data.email,
		data.address,
		data.phone,
		data.web_facebookLinks,
		data.web_instagramLinks,
		data.web_twitterLinks,
		data.web_addressLinks,
		data.web_errors,
		data.likes,
		data.talking,
		data.wereHere,
		data.hasConditions,
	];

	// Execute the query using the dbConnection object
	// Handle any errors and return the insert ID on success
	dbConnection.query(query, values, (err, results) => {
		if (err) {
			console.error("Error inserting data:", err);
			callback(err, null);
			return;
		}

		console.log(data.facebookPageURL + " inserted successfully. Insert ID:", results.insertId);
		callback(null, results.insertId);
	});
};

const emailSendingQueue = createEmailSendingQueue(1, 5000);

function createEmailSendingQueue(c, d) {
	// Create a new instance of a Queue object with a function called 'processBingQueue' as the callback for each task
	// The Queue object is configured to process tasks based on the settings parsed as concurent (c) count, and delay(d) value in miliseconds
	const queue = new Queue(sendQueuedEmail, {
		concurrent: c,
		afterProcessDelay: d,
	});

	// Return the queue object
	return queue;
}

// HTTP POST route to insert data into database
app.post("/insertToDatabase/", async (req, res) => {
	// extract data object from request body
	const { data } = req.body;

	console.log("*************************");
	console.log("Case: " + data.facebookPageURL);
	var matches = stringSimilarity.findBestMatch(data.facebookPageURL, similarity_URLS);
	console.log(matches.bestMatch);
	// This means we already have this match in the database
	if (matches.bestMatch.rating > 0.9) {
		console.log(data.facebookPageURL + " already exists in the database");
		res.send(data.facebookPageURL + " already exists in the database");
	} else {
		// Compare entry name as well before inserting
		let dbPageTitle = await getPageTitle(matches.bestMatch.target)
			.then((result) => {
				if (result.length === 0) return "database empty";
				if (result.length > 0) return result[0].facebook_pageTitle;
			})
			.catch((err) => console.error("Error:", err));

		let compareNames = stringSimilarity.compareTwoStrings(data.pageTitle, dbPageTitle);

		console.log("Comparing: " + data.pageTitle + " ----------- " + dbPageTitle + " === RESULT: === " + compareNames);

		if (compareNames < 0.9) {
			insertData(data, async (err, insertId) => {
				if (err) {
					// handle any errors during data insertion
					console.error("Failed to insert data:", err);

					// send success message with the insert ID on successful insertion
					res.status(500).send("Failed to insert data");
					return;
				}
				similarity_URLS.push(data.facebookPageURL);

				try {
					await SendMail(data);
				} catch (error) {
					console.log("Failed to send email:", error);
				}

				res.send(data.facebookPageURL + " inserted successfully. Insert ID: " + insertId);
			});
		} else {
			console.log(data.facebookPageURL + " already exists in the database - Similar Title found");
			res.send(data.facebookPageURL + " already exists in the database - Similar Title found");
		}
	}
});

async function SendMail(data) {
	return new Promise((resolve, reject) => {
		if (data.hasConditions) {
			console.log("Has conditions: " + data.hasConditions);
			console.log("Skipping this contact...");
			resolve("Skipping this contact"); // Promise is resolved here
		} else {
			console.log("No conditions, sending email...");
			console.log("Case: " + data.pageTitle);
			if (data.email) {
				var emails = data.email.split(",");
				emails.forEach(async (email) => {
					console.log("Sending email to: " + email.trim());

					try {
						emailQueue.push({ email: email, data: data });

						let currentTimestamp = new Date().toLocaleString("en-GB");

						const emailData = [data.pageTitle, email.trim(), data.facebookPageURL, currentTimestamp];

						insertEmailData(emailData, async (err, insertId) => {
							if (err) {
								// handle any errors during data insertion
								console.error("Failed to insert data:", err);

								// send success message with the insert ID on successful insertion
								res.status(500).send("Failed to insert data");
								return;
							}
							return;
						});
					} catch (error) {
						console.log("Failed to send email: " + error);
					}
				});
				resolve("Emails sent"); // Promise is resolved here
			} else {
				reject("No emails to send"); // Promise is rejected here
			}
		}
	});
}

const insertEmailData = (data, callback) => {
	// SQL query to insert data into 'ai_emailsSent' table
	const query = `
    INSERT INTO ai_emailsSent (
      title, email, fb_link, time_sent
    ) VALUES (
      ?, ?, ?, ?
    );
  `;

	// Values to be inserted into the table
	const values = [data[0], data[1], data[2], data[3]];

	// Execute the query using the dbConnection object
	// Handle any errors and return the insert ID on success
	dbConnection.query(query, values, (err, results) => {
		if (err) {
			console.error("Error inserting data:", err);
			callback(err, null);
			return;
		}

		console.log(data[1] + " inserted successfully.");
		callback(null, results.insertId);
	});
};

async function getPageTitle(facebookPageUrl) {
	return new Promise((resolve, reject) => {
		// A query is constructed to retrieve a row where the 'facebook_pageURL' equals the provided URL and return the 'facebook_pageTitle' column
		dbConnection.query(
			`SELECT facebook_pageTitle FROM ai_contacts WHERE facebook_pageURL = ?;`,
			[facebookPageUrl],
			(err, result) => {
				if (err) {
					// If there's an error executing the query, log the error and reject the promise
					console.error("Error retrieving page title:", err);
					reject(err);
				} else {
					// If the query is successful, resolve the promise with the result
					resolve(result);
				}
			}
		);
	});
}
