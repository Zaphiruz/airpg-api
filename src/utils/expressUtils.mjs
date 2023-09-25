

export const formatError = (error) => ({
	name: error.name,
	message: error.message,
	cause: error.cause,
	stack: error.stack
})