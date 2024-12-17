export const convertName = (name: string) => {
	if (name.length === 0) {
		return ''
	}
	return name[0].toUpperCase() + name.slice(1).toLowerCase()
}
