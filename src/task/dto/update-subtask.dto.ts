import { PartialType } from '@nestjs/mapped-types'
import { SubtaskDto } from './subtask.dto'

export class UpdateSubtaskDto extends PartialType(SubtaskDto) {}
