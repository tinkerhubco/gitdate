import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Body
} from '@nestjs/common';

import { UserCreateDto } from '../dtos';
import { UserService } from '../services';
import { ParseEntityPipe } from '../pipes';
import { Roles } from '../../core/decorators';
import { EveryoneRole } from '../roles';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public create(@Body(new ParseEntityPipe()) user: UserCreateDto) {}

  @Get()
  public get() {
    return this.userService.get();
  }

  @Roles(EveryoneRole)
  @Get(':id([0-9]+|me)')
  public getOne(@Param('id', ParseIntPipe) id: number) {}

  @Patch(':id([0-9]+|me)')
  public update(@Param('id', ParseIntPipe) id: number) {}

  @Delete(':id([0-9]+|me)')
  public remove(@Param('id', ParseIntPipe) id: number) {}
}
