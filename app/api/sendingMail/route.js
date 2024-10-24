import { NextResponse } from "next/server";
import { google } from "googleapis";
import { authenticateGmail, sendEmail } from "../../(apis)/sendingMail";

export async function POST(req) {
	const { docUrl, sheetUrl, range } = await req.json();

	try {
		const creds = await authenticateGmail();
		await sendEmail({
			creds,
			to: "phongunin@gmail.com", // Replace with actual recipient
			subject: "Test Email",
			messageText: "This is a test email",
			htmlContent: "<h1>Test Email</h1><p>",
		});
	} catch (error) {
		console.log(error);
	}
}
