export enum Judge0Providers {
	RAPIDAPI = "rapidapi",
	SULU = "sulu",
}

export interface Judge0Config {
	apiKey?: string;
	provider: Judge0Providers;
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

export interface IJudge0Provider {
	createSubmission(
		submission: Judge0Submission,
	): Promise<Judge0SubmissionResult>;
	getSubmission(token: string, wait?: boolean): Promise<Judge0SubmissionResult>;
	executeCode(
		sourceCode: string,
		languageId: number,
		input?: string,
		options?: Partial<Judge0Submission>,
	): Promise<Judge0SubmissionResult>;
	getLanguages(): Promise<Judge0Language[]>;
	getStatuses(): Promise<Judge0Status[]>;
	testConnection(): Promise<boolean>;
}
