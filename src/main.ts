import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AllExceptionsFilter } from '@/common/filters/http-exception.filter';
import { ZodExceptionFilter } from '@/common/filters/zod-exception.filter';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(documentFactory()));
  app.useGlobalFilters(new AllExceptionsFilter(), new ZodExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
