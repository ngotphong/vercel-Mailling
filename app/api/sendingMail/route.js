// app/api/sendEmail/route.js
import { authenticateGmail, sendEmail } from "../../(apis)/sendingMail";

export async function POST(req) {
	const { docUrl, sheetUrl, range } = await req.json();

	try {
		const creds = await authenticateGmail(); // Authenticate with Gmail
		await sendEmail({
			creds,
			to: "phongunin@gmail.com", // Replace with actual recipient
			subject: "Test Email",
			messageText: "This is a plain text email message",
			htmlContent: "<h1>This is an HTML email message</h1>",
			// You can add other fields here as needed
		});
		return new Response(
			JSON.stringify({ message: "Email sent successfully!" }),
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error during authentication or sending email:", error);
		return new Response(JSON.stringify({ error: "Failed to send email" }), {
			status: 500,
		});
	}
}
