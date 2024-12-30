import { Prisma } from '@prisma/client'

export const returnTaskObject: Prisma.TaskSelect = {
	id: true,
	title: true,
	description: true,
	priority: true,
	isDone: true,
	subtasks: true,
	categories: {
		select: {
			category: true
		}
	},
	users: {
		select: {
			user: {
				select: {
					id: true,
					name: true,
					email: true
				}
			}
		}
	}
}
