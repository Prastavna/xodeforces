import { $fetch } from "ofetch";

export interface Judge0Config {
	baseUrl: string;
	apiKey?: string;
}

export interface Judge0Submission {
	source_code: string;
	language_id: number;
	stdin?: string;
	expected_output?: string;
	cpu_time_limit?: number;
	memory_limit?: number;
	compiler_options?: string;
	command_line_arguments?: string;
}

export interface Judge0SubmissionResult {
	token: string;
	status?: {
		id: number;
		description: string;
	};
	stdout?: string;
	stderr?: string;
	compile_output?: string;
	message?: string;
	time?: string;
	memory?: number;
	exit_code?: number;
}

export interface Judge0Language {
	id: number;
	name: string;
	is_archived?: boolean;
}

export interface Judge0Status {
	id: number;
	description: string;
}

export class Judge0Service {
	private config: Judge0Config;

	constructor(config: Judge0Config) {
		this.config = config;
	}

	private get headers() {
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};

		if (this.config.apiKey) {
			if (this.config.baseUrl.includes("rapidapi.com")) {
				headers["X-RapidAPI-Key"] = this.config.apiKey;
				headers["X-RapidAPI-Host"] = "judge0-ce.p.rapidapi.com";
			} else {
				headers["X-Auth-Token"] = this.config.apiKey;
			}
		}

		return headers;
	}

	async createSubmission(
		submission: Judge0Submission,
	): Promise<Judge0SubmissionResult> {
		try {
			const response = await $fetch<Judge0SubmissionResult>("/submissions", {
				baseURL: this.config.baseUrl,
				method: "POST",
				headers: this.headers,
				body: submission,
			});
			return response;
		} catch (error) {
			console.error("Failed to create submission:", error);
			throw new Error("Failed to create submission");
		}
	}

	async getSubmission(
		token: string,
		wait = true,
	): Promise<Judge0SubmissionResult> {
		try {
			const params = new URLSearchParams({
				fields:
					"stdout,stderr,status,compile_output,message,time,memory,exit_code",
			});

			if (wait) {
				params.append("base64_encoded", "false");
			}

			const response = await $fetch<Judge0SubmissionResult>(
				`/submissions/${token}`,
				{
					baseURL: this.config.baseUrl,
					headers: this.headers,
					query: Object.fromEntries(params),
				},
			);
			return response;
		} catch (error) {
			console.error("Failed to get submission:", error);
			throw new Error("Failed to get submission result");
		}
	}

	async executeCode(
		sourceCode: string,
		languageId: number,
		input?: string,
		options?: Partial<Judge0Submission>,
	): Promise<Judge0SubmissionResult> {
		const submission: Judge0Submission = {
			source_code: sourceCode,
			language_id: languageId,
			stdin: input || "",
			...options,
		};

		const { token } = await this.createSubmission(submission);

		// Poll for result
		let attempts = 0;
		const maxAttempts = 30; // 30 seconds max wait

		while (attempts < maxAttempts) {
			const result = await this.getSubmission(token);

			if (result.status && result.status.id > 2) {
				// Status > 2 means completed
				return result;
			}

			await new Promise((resolve) => setTimeout(resolve, 1000));
			attempts++;
		}

		throw new Error("Submission timed out");
	}

	async getLanguages(): Promise<Judge0Language[]> {
		try {
			return await $fetch<Judge0Language[]>("/languages", {
				baseURL: this.config.baseUrl,
				headers: this.headers,
			});
		} catch (error) {
			console.error("Failed to get languages:", error);
			throw new Error("Failed to get available languages");
		}
	}

	async getStatuses(): Promise<Judge0Status[]> {
		try {
			return await $fetch<Judge0Status[]>("/statuses", {
				baseURL: this.config.baseUrl,
				headers: this.headers,
			});
		} catch (error) {
			console.error("Failed to get statuses:", error);
			throw new Error("Failed to get status information");
		}
	}

	async testConnection(): Promise<boolean> {
		try {
			await this.getLanguages();
			return true;
		} catch {
			return false;
		}
	}

	updateConfig(config: Partial<Judge0Config>) {
		this.config = { ...this.config, ...config };
	}
}
