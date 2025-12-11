import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AllExceptionsFilter } from '@/common/filters/all-exception.filter';
import { ZodExceptionFilter } from '@/common/filters/zod-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const config = new DocumentBuilder()
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'apiKey',
        scheme: 'Bearer',
        bearerFormat: 'authorization',
        name: 'authorization',
        description: 'Enter authorization token',
        in: 'header',
      },
      'access-token', // 这里给它起个名字，后面要用到
    )
    .addSecurityRequirements('access-token')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(documentFactory()));
  app.useGlobalFilters(new AllExceptionsFilter(), new ZodExceptionFilter());
  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
