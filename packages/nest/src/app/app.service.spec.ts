import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { participants } from '../assets/mockData';
import configuration from './config/configuration';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
      ],
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getParticipants', () => {
    it('should return participants', () => {
      expect(service.getParticipants('anyString')).toEqual(participants);
    });
  });
});
