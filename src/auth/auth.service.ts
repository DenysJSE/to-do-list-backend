import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { UserService } from '../user/user.service'
import { UserDto } from '../user/dto/user.dto'
import { AuthDto } from './dto/auth.dto'
import { Response } from 'express'

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService,
		private readonly jwt: JwtService
	) {}

	async register(userDto: UserDto) {
		const emailExist = await this.userService.getUserByEmail(userDto.email)
		if (emailExist)
			throw new BadRequestException(
				`The email: ${userDto.email} you provided already exist!`
			)

		const user = await this.userService.createUser(userDto)
		const tokens = await this.createTokens(user)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async login(authDto: AuthDto) {
		const user = await this.validateUser(authDto)
		const tokens = await this.createTokens(user)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async createTokens(user: User) {
		const data = { id: user.id }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '60d'
		})

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getUserByEmail(dto.email)
		if (!user)
			throw new NotFoundException(
				`The user with email: "${dto.email}" was not found!`
			)

		const isValid = await bcrypt.compare(dto.password, user.password)
		if (!isValid) throw new BadRequestException('Invalid password!')

		return user
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new BadRequestException('Invalid token!')

		const user = await this.userService.getUserById(result.id)

		const tokens = await this.createTokens(user)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(
			expiresIn.getDate() + Number(process.env.EXPIRE_DAY_REFRESH_TOKEN)
		)

		res.cookie(process.env.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: process.env.API_DOMAIN,
			expires: expiresIn,
			secure: true,
			sameSite: 'none'
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(process.env.REFRESH_TOKEN_NAME, {
			httpOnly: true,
			domain: process.env.API_DOMAIN,
			expires: new Date(0),
			secure: true,
			sameSite: 'none'
		})
	}

	private returnUserFields(user: Partial<User>) {
		return {
			id: user.id,
			email: user.email,
			name: user.name
		}
	}
}
