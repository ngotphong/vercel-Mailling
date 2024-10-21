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
			const response = await fetch("/api/sendingMail", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ docUrl, sheetUrl, range }),
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const data = await response.json();
			console.log(data.message);
		} catch (error) {
			console.error("Error during submission:", error);
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
