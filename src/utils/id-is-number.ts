import { BadRequestException } from '@nestjs/common'
import { convertToNumber } from './convert-to-number'

export const checkIdIsNumber = (id: number | string) => {
	const checkedId = convertToNumber(String(id))
	if (checkedId === undefined)
		throw new BadRequestException(
			'You provide incorrect format of id, be sure it is number!'
		)

	return checkedId
}
