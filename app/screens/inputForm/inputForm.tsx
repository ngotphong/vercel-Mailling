"use client";
import React, { useState } from "react";
import styles from "./inputFormStyle.module.css";
import { authenticateGmail, sendEmail } from "../../(apis)/sendingMail";

// Define the component
const InputForm: React.FC = () => {
	// State hooks to store input values
	const [docUrl, setDocUrl] = useState<string>("");
	const [sheetUrl, setSheetUrl] = useState<string>("");
	const [range, setRange] = useState<string>("");

	// Function to handle form submission
	const handleSubmit = async (): Promise<void> => {
		console.log(docUrl);
		console.log(sheetUrl);
		console.log(range);

		try {
			// First, initiate the auth flow

			const authResponse = await fetch("/api/auth", {
				method: "GET",
			});

			if (!authResponse.ok) {
				throw new Error("Failed to initiate auth flow");
			}

			const { authUrl } = await authResponse.json();

			// Open the auth URL in a new window

			const authWindow = window.open(
				authUrl,
				"_blank",
				"width=600,height=600"
			);

			// Poll to check if the auth window is closed

			const checkAuthWindowClosed = setInterval(async () => {
				if (authWindow?.closed) {
					clearInterval(checkAuthWindowClosed);

					// Auth window closed, now try to send the email

					const emailResponse = await fetch(
						"/api/sendingMail/route.js",
						{
							method: "POST",

							headers: {
								"Content-Type": "application/json",
							},

							body: JSON.stringify({ docUrl, sheetUrl, range }),
						}
					);

					if (!emailResponse.ok) {
						throw new Error("Failed to send email");
					}

					const result = await emailResponse.json();

					console.log(result.message);

					alert("Email sent successfully!");
				}
			}, 500);
		} catch (error) {
			console.error("Error:", error);

			alert("An error occurred. Please try again.");
		}
	};

	return (
		<div className={styles.container}>
			{/* Add form element with onSubmit */}
			<div style={{ marginBottom: "10px" }}>
				<label htmlFor="docUrl">Google Doc URL:</label>
				<input
					type="url"
					id="docUrl"
					value={docUrl}
					onChange={(e) => setDocUrl(e.target.value)}
					required
					className={styles.inputBar}
				/>
			</div>
			<div style={{ marginBottom: "10px" }}>
				<label htmlFor="sheetUrl">Google Sheet URL:</label>
				<input
					type="url"
					id="sheetUrl"
					value={sheetUrl}
					onChange={(e) => setSheetUrl(e.target.value)}
					required
					className={styles.inputBar}
				/>
			</div>
			<div style={{ marginBottom: "10px" }}>
				<label htmlFor="range">Range:</label>
				<input
					type="text"
					id="range"
					value={range}
					onChange={(e) => setRange(e.target.value)}
					required
					className={styles.inputBar}
				/>
			</div>
			{/* Submit button that triggers the handleSubmit function */}
			<button className={styles.sendButton} onClick={handleSubmit}>
				Send
			</button>
		</div>
	);
};

export default InputForm;
