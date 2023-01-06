import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppGateway } from './app.gateway';
import { AppService } from './app.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'packages', 'react'),
    }),
  ],
  providers: [AppService, AppGateway],
})
export class AppModule {}
