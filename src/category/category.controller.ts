import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CategoryDto } from './dto/category.dto'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { UpdateCategoryDto } from './dto/update.category'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@UsePipes(new ValidationPipe())
	@Post()
	@Auth()
	create(@Body() dto: CategoryDto, @CurrentUser('id') userId: string) {
		return this.categoryService.createCategory(dto, +userId)
	}

	@Get('/by-id/:id')
	@Auth()
	getById(@Param('id') id: string) {
		return this.categoryService.getCategoryById(+id)
	}

	@Get('by-user')
	@Auth()
	getAllByUser(@CurrentUser('id') userId: string) {
		return this.categoryService.getAllCategoriesForUser(+userId)
	}

	@Get('favorite')
	@Auth()
	getFavorites(@CurrentUser('id') userId: string) {
		return this.categoryService.getFavoritesCategories(+userId)
	}

	@Put('/:id')
	@Auth()
	update(
		@Param('id') categoryId: string,
		@Body() dto: UpdateCategoryDto,
		@CurrentUser('id') userId: string
	) {
		return this.categoryService.updateCategory(+userId, +categoryId, dto)
	}

	@Delete(':id')
	@Auth()
	delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.categoryService.deleteCategory(+userId, +id)
	}

	@Patch(':id')
	@Auth()
	addToFavorite(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.categoryService.addCategoryToFavorite(+userId, +id)
	}

	@Patch('remove/:id')
	@Auth()
	removeFromFavorite(
		@Param('id') id: string,
		@CurrentUser('id') userId: string
	) {
		return this.categoryService.removeCategoryFromFavorite(+userId, +id)
	}
}
