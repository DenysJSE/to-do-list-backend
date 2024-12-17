import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UserDto {
	@IsEmail()
	email: string

	@IsString()
	@IsOptional()
	@MinLength(8, { message: 'The password must contain at least 8 symbols.' })
	password: string

	@IsString()
	name: string
}
