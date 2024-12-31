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
import { TaskService } from './task.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { TaskDto } from './dto/task.dto'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { UpdateTaskDto } from './dto/update-task.dto'
import { SubtaskDto } from './dto/subtask.dto'
import { UpdateSubtaskDto } from './dto/update-subtask.dto'

@Controller('tasks')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@UsePipes(new ValidationPipe())
	@Post()
	@Auth()
	createTask(@Body() dto: TaskDto, @CurrentUser('id') userId: string) {
		return this.taskService.create(+userId, dto)
	}

	@Get('by-id/:id')
	@Auth()
	getTaskById(@Param('id') taskId: string) {
		return this.taskService.getById(+taskId)
	}

	@Get('by-user')
	@Auth()
	getAllUserTasks(@CurrentUser('id') userId: string) {
		return this.taskService.getAllByUser(+userId)
	}

	@Get('by-category/:category_id')
	@Auth()
	getAllByCategory(
		@Param('category_id') categoryId: string,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.getByCategory(+userId, +categoryId)
	}

	@Patch('complete-task/:task_id')
	@Auth()
	markTaskAsDone(
		@Param('task_id') taskId: string,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.markTaskAsDone(+userId, +taskId)
	}

	@Patch('incomplete-task/:task_id')
	@Auth()
	markTaskAsUndone(
		@Param('task_id') taskId: string,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.markTaskAsUndone(+userId, +taskId)
	}

	@Put(':taskId')
	@Auth()
	update(
		@Param('taskId') taskId: string,
		@Body() updateDto: UpdateTaskDto,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.update(+userId, +taskId, updateDto)
	}

	@Delete(':taskId')
	@Auth()
	delete(@Param('taskId') taskId: string, @CurrentUser('id') userId: string) {
		return this.taskService.delete(+userId, +taskId)
	}

	@UsePipes(new ValidationPipe())
	@Post('create-subtask')
	@Auth()
	createSubtask(@CurrentUser('id') userId: string, @Body() dto: SubtaskDto) {
		return this.taskService.createSubtask(+userId, dto)
	}

	@Get('subtask-by-task/:task_id')
	@Auth()
	getSubtasksByTask(
		@Param('task_id') taskId: string,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.getSubtasksByTask(+userId, +taskId)
	}

	@Put('subtask/:subtaskId')
	@Auth()
	updateSubtask(
		@Param('subtaskId') subtaskId: string,
		@Body() updateDto: UpdateSubtaskDto,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.updateSubtask(+userId, +subtaskId, updateDto)
	}

	@Delete('subtask/:subtaskId')
	@Auth()
	deleteSubtask(
		@Param('subtaskId') subtaskId: string,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.deleteSubtask(+userId, +subtaskId)
	}

	@Patch('complete-subtask/:subtask_id')
	@Auth()
	markSubtaskAsDone(
		@Param('subtask_id') subtaskId: string,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.markSubtaskAdDone(+userId, +subtaskId)
	}

	@Patch('incomplete-subtask/:subtask_id')
	@Auth()
	markSubtaskAsUndone(
		@Param('subtask_id') subtaskId: string,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.markSubtaskAdUndone(+userId, +subtaskId)
	}

	@Get('done-tasks/:category_id')
	@Auth()
	getUserDoneTasksByCategory(
		@Param('category_id') categoryId: string,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.getUserDoneTasksByCategory(+userId, +categoryId)
	}
}
