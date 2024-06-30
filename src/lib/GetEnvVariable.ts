export function getEnvVariable(envVariableName?: string) {
	if (!envVariableName) {
		if (process.env.NODE_ENV !== "production") {
			console.error(
				"Can not find the environment variable " + envVariableName
			);
		}
		throw new Error("can not access the environment variable");
	}
	return envVariableName;
}
