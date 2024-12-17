import { ColorEnum } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CategoryDto {
	@IsString()
	@IsNotEmpty()
	title: string

	@IsEnum(ColorEnum)
	color: ColorEnum
}
