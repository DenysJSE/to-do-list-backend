import { Module } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import { PrismaService } from '../prisma.service'
import { UserModule } from '../user/user.module'

@Module({
	imports: [UserModule],
	controllers: [CategoryController],
	providers: [CategoryService, PrismaService]
})
export class CategoryModule {}
