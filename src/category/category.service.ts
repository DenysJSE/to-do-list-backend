import {
	BadRequestException,
	ForbiddenException,
	Injectable
} from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CategoryDto } from './dto/category.dto'
import { UpdateCategoryDto } from './dto/update.category'
import { checkIdIsNumber } from '../utils/id-is-number'
import { UserService } from '../user/user.service'

@Injectable()
export class CategoryService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService
	) {}

	async createCategory(categoryDto: CategoryDto, userId: number) {
		const category = await this.prisma.category.create({
			data: categoryDto
		})

		await this.prisma.userCategory.create({
			data: {
				userId: userId,
				categoryId: category.id
			}
		})

		return category
	}

	async getCategoryById(categoryId: number) {
		const id = checkIdIsNumber(categoryId)

		const category = await this.prisma.category.findUnique({
			where: { id }
		})
		if (!category)
			throw new BadRequestException('The category with such id was not found!')

		return category
	}

	async getAllCategoriesForUser(userId: number) {
		await this.userService.getUserById(userId)

		return this.prisma.category.findMany({
			where: {
				users: {
					some: { userId }
				}
			}
		})
	}

	async getFavoritesCategories(userId: number) {
		return this.prisma.category.findMany({
			where: {
				users: {
					some: { userId }
				},
				isFavorite: true
			}
		})
	}

	async updateCategory(
		userId: number,
		categoryId: number,
		updateCategoryDto: UpdateCategoryDto
	) {
		await this.getCategoryById(categoryId)

		const category = await this.prisma.userCategory.findUnique({
			where: {
				userId_categoryId: {
					userId,
					categoryId
				}
			}
		})

		if (!category)
			throw new ForbiddenException(
				'You are not authorized to update this category!'
			)

		return this.prisma.category.update({
			where: { id: categoryId },
			data: {
				title: updateCategoryDto.title,
				color: updateCategoryDto.color
			}
		})
	}

	async deleteCategory(userId: number, categoryId: number) {
		await this.getCategoryById(categoryId)

		const category = await this.prisma.userCategory.findUnique({
			where: {
				userId_categoryId: {
					userId,
					categoryId
				}
			}
		})

		if (!category) {
			throw new ForbiddenException(
				'You are not authorized to delete this category.'
			)
		}

		await this.prisma.category.delete({
			where: { id: categoryId }
		})

		return { message: 'The category was deleted successfully!' }
	}

	async addCategoryToFavorite(userId: number, categoryId: number) {
		await this.getCategoryById(categoryId)

		const category = await this.prisma.userCategory.findUnique({
			where: {
				userId_categoryId: {
					userId,
					categoryId
				}
			}
		})

		if (!category) {
			throw new ForbiddenException(
				'You are not authorized to update this category.'
			)
		}

		return this.prisma.category.update({
			where: { id: categoryId },
			data: {
				isFavorite: true
			}
		})
	}
}
