import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Priority } from '@prisma/client'

export class TaskDto {
	@IsString()
	@IsNotEmpty()
	title: string

	@IsString()
	@IsNotEmpty()
	description: string

	@IsEnum(Priority)
	priority: Priority

	@IsNumber()
	@IsNotEmpty()
	categoryId: number
}
