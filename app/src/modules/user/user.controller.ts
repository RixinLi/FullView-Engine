import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, HttpStatus, HttpCode, HttpException, UseInterceptors, filterLogLevels } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { Result } from 'src/common/result';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { ResponseUserDto } from './dto/response-user.dto';
import { plainToClass } from 'class-transformer';

@Controller('user')
export class UserController {
  
  constructor(private readonly userService: UserService) {}

  /*
  查询
  */
  @Get('findAll')
  async findAll(){
    const allData = await this.userService.findAll();
        
    return Result.success(allData);
  }

  @Get('findOne')
  async findOneUser(@Body() body: QueryUserDto){
    const res = await this.userService.findOne(body);
    if(!res){
      throw new HttpException(Result.error('未能找到对应的用户', HttpStatus.NOT_FOUND.toString()), HttpStatus.NOT_FOUND);
    }
    return Result.success(plainToClass(ResponseUserDto,res,{ excludeExtraneousValues: true }));
  }


  /*
  创建 create
  */
 @Post('create')
 async insertOneUser(@Body() body: CreateUserDto){
    
    // 查询创建后的数据
    const createdUser = await this.userService.createOneUser(body);
    
    if (!createdUser) {
        throw new HttpException(Result.error('创建用户失败', HttpStatus.BAD_REQUEST.toString()), HttpStatus.BAD_REQUEST);
    }
    return Result.success(createdUser,HttpStatus.CREATED.toString(),'创建用户成功');
 }


 /*
  更新 update
  */
 @Patch('update')
 async UpdateOneUser(@Body() body: UpdateUserDto){

    // 重新查询更新后的数据
    const updatedUser = await this.userService.update(body);

    return Result.success(updatedUser,HttpStatus.OK.toString(),'更新用户成功');
 }

  /*
  删除
  */
  @Delete('delete')
  async deleteOneUser(@Query('id') id:string){
      const deleteUser = await this.userService.delete(id);

      return Result.success(deleteUser,"200","删除用户成功");

  }
}
