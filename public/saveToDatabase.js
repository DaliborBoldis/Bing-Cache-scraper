/**
Saves data to the database with additional processing and validation.
@param {object} data - The data to be saved to the database.
@returns {Promise} - A Promise that resolves to the response from the server after saving the data.
*/
async function SaveToDatabase(data) {
	// Check if the data contains "Page URL not found." and "Page title not found."
	if (data.facebookPageURL == "Page URL not found." && data.pageTitle == "Page title not found.")
		return data.index + " - Cannot save this contact";
	// Helper functions

	/**

	Removes non-digit characters from a string.
	@param {string} str - The input string.
	@returns {string} - The input string with non-digit characters removed.
	*/
	const removeNonDigits = (str) => str.replace(/\D/g, "");
	/**

	Removes duplicate values from an array.
	@param {Array} arr - The input array.
	@returns {Array} - A new array with duplicate values removed.
	*/
	const uniqueArray = (arr) => [...new Set(arr)];
	/**

	Formats a comma-separated phone number string by removing non-digit characters and filtering out empty values.
	@param {string} phoneString - The input phone number string.
	@returns {Array} - An array of formatted phone numbers.
	*/
	const formatPhoneNumbers = (phoneString) => phoneString.split(",").map(removeNonDigits).filter(Boolean);
	// Combine phone and web_phoneLinks into a single string
	const combinedPhoneString = data.phone + "," + data.web_phoneLinks;
	// Combine email and web_emailLinks into a single string
	const combinedEmailString = data.email + "," + data.web_emailLinks;

	// Destructure the data object and extract web_phoneLinks and web_emailLinks
	const { web_phoneLinks, web_emailLinks, ...restData } = data;

	// Create a new object for the database with processed and formatted data
	const dbObj = {
		...restData,
		phone: uniqueArray(formatPhoneNumbers(combinedPhoneString)).join(","),
		email: uniqueArray(combinedEmailString.split(",").filter(Boolean)).join(","),
		web_facebookLinks: uniqueArray(data.web_facebookLinks.split(",")).join(","),
		web_twitterLinks: uniqueArray(data.web_twitterLinks.split(",")).join(","),
		web_instagramLinks: uniqueArray(data.web_instagramLinks.split(",")).join(","),
	};

	// Process data conditions and highlight cells if a condition is met
	let dataConditions = [
		["Facebook URL: ", dbObj.facebookPageURL],
		["Website: ", dbObj.website],
		["Tags: ", dbObj.pageTags],
		["Email: ", dbObj.email],
		["Website errors: ", dbObj.web_errors],
	];

	let hasConditions = [false, undefined];

	for (let [label, data] of dataConditions) {
		if (highlightCells(label, data, {}, true)) {
			hasConditions = [true, data];
			break; // Stop looping as soon as one condition is met
		}
	}

	// Assign the condition data to dbObj
	if (hasConditions[0]) dbObj.hasConditions = hasConditions[1];
	if (!hasConditions[0]) dbObj.hasConditions = "";

	// Send the data to the server and save to the database
	const response = await fetch("/insertToDatabase", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ data: dbObj }),
	}).then((res) => {
		console.log(res);
		return res;
	});

	return response;
}
