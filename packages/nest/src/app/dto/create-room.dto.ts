import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const Schema = z.object({
  name: z.string().nonempty(),
  countdownStartValue: z.number().optional(),
});

export class CreateRoomDto extends createZodDto(Schema) {}
