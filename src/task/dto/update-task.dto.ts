import { PartialType } from '@nestjs/mapped-types'
import { TaskDto } from './task.dto'

export class UpdateTaskDto extends PartialType(TaskDto) {}
