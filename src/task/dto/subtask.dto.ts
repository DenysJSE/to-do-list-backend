import { IsNotEmpty, IsString, IsNumber } from 'class-validator'

export class SubtaskDto {
	@IsString()
	@IsNotEmpty()
	title: string

	@IsNumber()
	@IsNotEmpty()
	taskId: number
}
