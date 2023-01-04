import { Module } from '@nestjs/common';

import { AppGateway } from './app.gateway';
import { AppService } from './app.service';

@Module({
  imports: [],
  providers: [AppService, AppGateway],
})
export class AppModule {}
