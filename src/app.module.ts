import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EmployerModule } from './employers/employers.module';
import { JobModule } from './jobs/jobs.module';
import { WorkerModule } from './workers/workers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    EmployerModule,
    JobModule,
    WorkerModule,
  ],
})
export class AppModule {}
