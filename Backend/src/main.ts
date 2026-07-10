import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
const app = await NestFactory.create(AppModule);

// Permitir que Railway asigne el puerto dinámico
const port = process.env.PORT || 3000;

await app.listen(port, '0.0.0.0');
console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
