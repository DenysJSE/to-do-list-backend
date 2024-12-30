import { Prisma } from '@prisma/client'

export const returnUserObject: Prisma.UserSelect = {
	id: true,
	email: true,
	name: true,
	password: false,
	tasks: {
		select: {
			task: true
		}
	},
	categories: {
		select: {
			category: true
		}
	}
}
