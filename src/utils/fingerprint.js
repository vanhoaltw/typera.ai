// Function to create a unique ID
function createUniqueID() {
	return "visitor_" + Math.random().toString(36).substr(2, 9);
}

// Function to set a cookie
function setCookie(name, value, days) {
	const expires = new Date();
	expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
	document.cookie =
		name + "=" + value + ";expires=" + expires.toUTCString() + ";path=/";
}

// Function to get a cookie value by name
function getCookie(name) {
	const cookieArray = document.cookie.split("; ");
	for (let i = 0; i < cookieArray.length; i++) {
		const cookie = cookieArray[i].split("=");
		if (cookie[0] === name) {
			return cookie[1];
		}
	}
	return null;
}

// Function to check if a unique ID exists in cookies, and create one if not
export function getUniqueID() {
	let uniqueID = getCookie("uniqueID");
	if (!uniqueID) {
		uniqueID = createUniqueID();
		setCookie("uniqueID", uniqueID, 365); // Setting the cookie to expire in 365 days
	}
	return uniqueID;
}
