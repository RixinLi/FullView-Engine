import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  HttpStatus,
  HttpException,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { Result } from 'src/common/result';
import { ResponseUserDto } from './dto/response-user.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { CheckPolicies, Roles } from '../auth/common/auth.decorator';
import { PoliciesGuard } from '../auth/policies.guard';
import { AppAbility } from '../auth/casl/casl-ability.factory';
import { Action } from '../auth/common/auth.constants';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*
  查询所有
  */
  @Get('findAll')
  async findAll() {
    const allData = await this.userService.findAll();
    return Result.success(
      plainToInstance(ResponseUserDto, allData, { excludeExtraneousValues: true })
    );
  }

  /*
  查询单个
  */
  @Get('findOne')
  async findOneUser(@Body() body: QueryUserDto) {
    const res = await this.userService.findOne(body);
    if (!res) {
      throw new HttpException(
        Result.error('未能找到对应的用户', HttpStatus.NOT_FOUND.toString()),
        HttpStatus.NOT_FOUND
      );
    }
    return Result.success(plainToClass(ResponseUserDto, res, { excludeExtraneousValues: true }));
  }

  /*
  创建 create
  */
  @Post('create')
  async insertOneUser(@Body() body: CreateUserDto) {
    await this.userService.createOneUser(body);
    // 查询创建后的数据
    const createdUser = this.userService.findOne(body);
    if (!createdUser) {
      throw new HttpException(
        Result.error('创建用户失败', HttpStatus.BAD_REQUEST.toString()),
        HttpStatus.BAD_REQUEST
      );
    }
    return Result.success(createdUser, HttpStatus.CREATED.toString(), '创建用户成功');
  }

  /*
  更新 update
  */
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility, request: any) => {
    // 如果用户具有 Manage 权限，直接允许
    if (ability.can(Action.Manage, 'all')) {
      return true;
    }

    // 待解决
    // const targerUser: User = { id: request.body.id };
    // // 检查 Update 权限
    // if (!ability.can(Action.Update, targerUser)) {
    //   console.log(targerUser);
    //   throw new ForbiddenException('你没有权限更新该用户信息');
    // }
    return true;
  })
  @Patch('update')
  async UpdateOneUser(@Body() body: UpdateUserDto) {
    await this.userService.update(body);
    const updatedUser = await this.userService.findOne(body);
    if (!updatedUser) {
      throw new HttpException(
        Result.error('更新用户失败,用户名和id无法更改', HttpStatus.BAD_REQUEST.toString()),
        HttpStatus.BAD_REQUEST
      );
    }
    return Result.success(updatedUser, HttpStatus.OK.toString(), '更新用户成功');
  }

  /*
  删除
  */
  @Delete('delete')
  async deleteOneUser(@Query('id') id: string) {
    const deleteUser = await this.userService.delete(id);

    return Result.success(deleteUser, '200', '删除用户成功');
  }
}
