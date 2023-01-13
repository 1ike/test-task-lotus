import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

import { RoomName } from '@lotus/shared';
import { AppService } from './app.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    return this.appService.createRoom(createRoomDto);
  }

  @Get()
  async findAll() {
    return this.appService.findAllRoomNames();
  }

  @Delete(':roomName')
  async delete(@Param('roomName') roomName: RoomName) {
    return this.appService.deleteRoom(roomName);
  }
}
