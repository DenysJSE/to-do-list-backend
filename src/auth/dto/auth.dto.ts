import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsEmail()
	email: string

	@IsString()
	@MinLength(8, { message: 'Password must contain at least 8 character!' })
	password: string
}
