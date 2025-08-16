// Import the Google Cloud Vision client library
const vision = require("@google-cloud/vision");

// Create a client
const client = new vision.ImageAnnotatorClient({
	keyFilename: "alpine-sentry-468713-i3-42a0e4316ef1.json",
});

// Function to analyze an image and determine if it's attractive to children
async function isAttractiveToChildren(imagePath) {
	try {
		// Perform label detection
		const [labelResult] = await client.labelDetection(imagePath);
		const labels = labelResult.labelAnnotations.map((label) =>
			label.description.toLowerCase()
		);

		// Perform image properties detection
		const [propertiesResult] = await client.imageProperties(imagePath);
		const dominantColors =
			propertiesResult.imagePropertiesAnnotation.dominantColors.colors;

		// Check for child-attractive labels

		const childFriendlyLabels = [
			"earth",
			"sky",
			"water",
			"fire",
			"stars",
			"moon",
			"planets",
			"ocean",
			"sea",
			"snow",
			"bird",
			"animal",
			"creature",
			"artificial",
			"people",
			"vehicle",
			"machine",
			"forest",
			"tree",
			"fish",
			"sea creature",
		];
		const hasChildFriendlyLabels = labels.some((label) =>
			childFriendlyLabels.includes(label)
		);

		// Check for bright and vibrant colors
		const isColorful = dominentColors.some(
			(color) => color.score > 0.2 && color.pixelFraction > 0.1 && color.color
		);

		// Decide if the image is attractive to children
		if (hasChildFriendlyLabels || isColorful) {
			console.log("The image is likely attractive to children.");
			return true;
		} else {
			console.log("The image is not particularly attractive to children.");
			return false;
		}
	} catch (err) {
		console.error("Error analyzing image:", err);
		throw err;
	}
}

// (async () => {
// 	const imagePath =
// 		"https://images.theconversation.com/files/622347/original/file-20240930-18-ozn5tj.jpg?ixlib=rb-4.1.0&rect=0%2C0%2C4031%2C3024&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip"; // Replace with your image file path
// 	const result = await isAttractiveToChildren(imagePath);
// 	console.log("Attractive to children: ", result);
// })();

export default async function filterImage(imagePath) {
	const result = await isAttractiveToChildren(imagePath);
	console.log("Attractive to children: ", result);
	return result;
}
