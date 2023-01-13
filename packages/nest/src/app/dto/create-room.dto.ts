import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { regexStringRawName } from '@lotus/shared';

const Schema = z.object({
  name: z.string().nonempty().regex(new RegExp(regexStringRawName)),
  countdownStartValue: z.number().optional(),
});

export class CreateRoomDto extends createZodDto(Schema) {}
