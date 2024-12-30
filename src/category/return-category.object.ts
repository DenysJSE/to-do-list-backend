import { Prisma } from '@prisma/client'

export const returnCategoryObject: Prisma.CategorySelect = {
	id: true,
	title: true,
	color: true,
	isFavorite: true,
	_count: {
		select: {
			tasks: {
				where: {
					task: {
						isDone: false
					}
				}
			}
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
