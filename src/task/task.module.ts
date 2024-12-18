import { Module } from '@nestjs/common'
import { TaskService } from './task.service'
import { TaskController } from './task.controller'
import { PrismaService } from '../prisma.service'
import { UserModule } from '../user/user.module'
import { CategoryModule } from '../category/category.module'

@Module({
	imports: [UserModule, CategoryModule],
	controllers: [TaskController],
	providers: [TaskService, PrismaService]
})
export class TaskModule {}
