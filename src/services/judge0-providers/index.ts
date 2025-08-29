import { RapidAPIProvider } from "./rapidapi-provider";
import { SuluProvider } from "./sulu-provider";
import type { IJudge0Provider, Judge0Config } from "./types";
import { Judge0Providers } from "./types";

export { RapidAPIProvider, SuluProvider };
export type { Judge0Config, IJudge0Provider };
export * from "./types";

export function createJudge0Provider(config: Judge0Config): IJudge0Provider {
	switch (config.provider) {
		case Judge0Providers.RAPIDAPI:
			return new RapidAPIProvider(config);
		case Judge0Providers.SULU:
			return new SuluProvider(config);
		default:
			throw new Error(`Unknown provider: ${config.provider}`);
	}
}

export const JUDGE0_PROVIDERS = [
	{ value: Judge0Providers.RAPIDAPI, label: "RapidAPI" },
	{ value: Judge0Providers.SULU, label: "Sulu Platform" },
];
