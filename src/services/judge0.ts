import type { IJudge0Provider, Judge0Config } from "./judge0-providers";
import { createJudge0Provider } from "./judge0-providers";

export class Judge0Service {
	private provider: IJudge0Provider;

	constructor(config: Judge0Config) {
		this.provider = createJudge0Provider(config);
	}

	async createSubmission(
		submission: Parameters<IJudge0Provider["createSubmission"]>[0],
	) {
		return this.provider.createSubmission(submission);
	}

	async getSubmission(token: string, wait = true) {
		return this.provider.getSubmission(token, wait);
	}

	async executeCode(
		sourceCode: string,
		languageId: number,
		input?: string,
		options?: Parameters<IJudge0Provider["executeCode"]>[3],
	) {
		return this.provider.executeCode(sourceCode, languageId, input, options);
	}

	async getLanguages() {
		return this.provider.getLanguages();
	}

	async getStatuses() {
		return this.provider.getStatuses();
	}

	async testConnection() {
		return this.provider.testConnection();
	}

	updateConfig(config: Judge0Config) {
		this.provider = createJudge0Provider(config);
	}
}

// Re-export types for backward compatibility
export type {
	Judge0Config,
	Judge0Language,
	Judge0Status,
	Judge0Submission,
	Judge0SubmissionResult,
} from "./judge0-providers";
