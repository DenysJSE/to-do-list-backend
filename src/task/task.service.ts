import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { TaskDto } from './dto/task.dto'
import { checkIdIsNumber } from '../utils/id-is-number'
import { UpdateTaskDto } from './dto/update-task.dto'
import { UserService } from '../user/user.service'
import { CategoryService } from '../category/category.service'
import { SubtaskDto } from './dto/subtask.dto'
import { UpdateSubtaskDto } from './dto/update-subtask.dto'

@Injectable()
export class TaskService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService,
		private readonly categoryService: CategoryService
	) {}

	async create(userId: number, taskDto: TaskDto) {
		const { title, description, priority, categoryId } = taskDto

		await this.categoryService.getCategoryById(taskDto.categoryId)

		const userCategory = await this.prisma.userCategory.findUnique({
			where: {
				userId_categoryId: {
					userId,
					categoryId
				}
			}
		})

		if (!userCategory) {
			throw new ForbiddenException(
				"You don't have permission to create a task in this category."
			)
		}

		const task = await this.prisma.task.create({
			data: {
				title,
				description,
				priority
			}
		})

		await this.prisma.taskCategory.create({
			data: {
				taskId: task.id,
				categoryId
			}
		})

		await this.prisma.userTask.create({
			data: {
				userId,
				taskId: task.id
			}
		})

		return task
	}

	async getById(taskId: number) {
		const id = checkIdIsNumber(taskId)

		const task = await this.prisma.task.findUnique({
			where: { id }
		})

		if (!task)
			throw new NotFoundException('The task with such id was not found!')

		return task
	}

	async getAllByUser(userId: number) {
		await this.userService.getUserById(userId)

		return this.prisma.task.findMany({
			where: {
				users: {
					some: { userId }
				}
			}
		})
	}

	async getByCategory(userId: number, categoryId: number) {
		await this.categoryService.getCategoryById(categoryId)

		const userCategory = await this.prisma.userCategory.findUnique({
			where: {
				userId_categoryId: {
					userId,
					categoryId
				}
			}
		})

		if (!userCategory) {
			throw new ForbiddenException(
				'You are not authorized to access this category!'
			)
		}

		return this.prisma.task.findMany({
			where: {
				categories: {
					some: {
						categoryId
					}
				}
			}
		})
	}

	async update(userId: number, taskId: number, updateTaskDto: UpdateTaskDto) {
		await this.getById(taskId)

		const task = await this.prisma.userTask.findUnique({
			where: {
				taskId_userId: {
					userId,
					taskId
				}
			}
		})

		if (!task)
			throw new ForbiddenException(
				'You are not authorized to delete this task!'
			)

		return this.prisma.task.update({
			where: { id: taskId },
			data: {
				title: updateTaskDto.title,
				description: updateTaskDto.description,
				priority: updateTaskDto.priority
			}
		})
	}

	async delete(userId: number, taskId: number) {
		await this.getById(taskId)

		const task = await this.prisma.userTask.findUnique({
			where: {
				taskId_userId: {
					userId,
					taskId
				}
			}
		})

		if (!task)
			throw new ForbiddenException(
				'You are not authorized to delete this task!'
			)

		await this.prisma.task.delete({
			where: { id: taskId }
		})

		return { message: 'The task was deleted successfully!' }
	}

	async markTaskAsDone(userId: number, taskId: number) {
		await this.getById(taskId)

		const userTask = await this.prisma.userTask.findUnique({
			where: {
				taskId_userId: {
					userId,
					taskId
				}
			}
		})

		if (!userTask)
			throw new ForbiddenException(
				'You are not authorized to update this task.'
			)

		const task = await this.prisma.task.update({
			where: { id: taskId },
			data: { isDone: true }
		})

		return {
			message: `Task was completed!'}.`,
			task
		}
	}

	async createSubtask(userId: number, subtaskDto: SubtaskDto) {
		const { title, taskId } = subtaskDto

		await this.getById(taskId)

		const userTask = await this.prisma.userTask.findUnique({
			where: {
				taskId_userId: {
					userId,
					taskId
				}
			}
		})

		if (!userTask)
			throw new ForbiddenException(
				'You are not authorized to add a subtask to this task!'
			)

		return this.prisma.subtask.create({
			data: {
				title,
				taskId
			}
		})
	}

	async getSubtasksByTask(userId: number, taskId: number) {
		await this.getById(taskId)

		const userTask = await this.prisma.userTask.findUnique({
			where: {
				taskId_userId: {
					userId,
					taskId
				}
			}
		})

		if (!userTask) {
			throw new ForbiddenException(
				'You are not authorized to view subtasks for this task.'
			)
		}

		return this.prisma.subtask.findMany({
			where: {
				taskId
			}
		})
	}

	async updateSubtask(
		userId: number,
		subtaskId: number,
		updateDto: UpdateSubtaskDto
	) {
		const subtask = await this.prisma.subtask.findUnique({
			where: { id: subtaskId },
			include: {
				task: {
					include: {
						users: true
					}
				}
			}
		})

		if (!subtask)
			throw new NotFoundException('The subtask with such id was not found!')

		if (
			!subtask ||
			!subtask.task.users.some(userTask => userTask.userId === userId)
		)
			throw new ForbiddenException(
				'You are not authorized to update this subtask.'
			)

		return this.prisma.subtask.update({
			where: { id: subtaskId },
			data: updateDto
		})
	}

	async deleteSubtask(userId: number, subtaskId: number) {
		const subtask = await this.prisma.subtask.findUnique({
			where: { id: subtaskId },
			include: {
				task: {
					include: {
						users: true
					}
				}
			}
		})

		if (!subtask)
			throw new NotFoundException('The subtask with such id was not found!')

		if (
			!subtask ||
			!subtask.task.users.some(userTask => userTask.userId === userId)
		)
			throw new ForbiddenException(
				'You are not authorized to delete this subtask.'
			)

		await this.prisma.subtask.delete({
			where: { id: subtaskId }
		})

		return { message: 'Subtask was deleted successfully.' }
	}

	async markSubtaskAdDone(userId: number, subtaskId: number) {
		const subtask = await this.prisma.subtask.findUnique({
			where: { id: subtaskId },
			include: {
				task: {
					include: {
						users: true
					}
				}
			}
		})

		if (!subtask)
			throw new NotFoundException('The subtask with such id was not found!')

		if (
			!subtask ||
			!subtask.task.users.some(userTask => userTask.userId === userId)
		)
			throw new ForbiddenException(
				'You are not authorized to update this subtask.'
			)

		return this.prisma.subtask.update({
			where: { id: subtaskId },
			data: { isDone: true }
		})
	}
}
