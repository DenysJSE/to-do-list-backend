import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const PORT = process.env.PORT || '7777'

	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')
	app.enableCors({
		origin: ['http://localhost:3000'],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		credentials: true
	})
	app.use(cookieParser())

	await app.listen(PORT, () =>
		console.log(`The server started in the port: ${PORT}`)
	)
}
bootstrap()
