export function convertToNumber(value: string): number | undefined {
	const number = +value
	return isNaN(number) ? undefined : number
}
