import { Body, HttpException, HttpStatus, Inject, Injectable, Param, Res } from '@nestjs/common';
import { Between, DeleteResult, In, InsertResult, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { Repository_Dependency_Constants } from 'src/common/constants';
import { Result } from 'src/common/result';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  
  constructor(
    @Inject(Repository_Dependency_Constants.user)
    private readonly userRepository: Repository<User>,
  ) {}

  /*
  查询
  */
  async findAll(): Promise<User[]> {
    
    try{
      return await this.userRepository.find();
    
    }catch(error){
      console.error('查询所有用户失败:'+error.message);
      throw new HttpException(
        Result.error('数据库错误'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    
  }

  async findOne(@Body() body:QueryUserDto): Promise<User | null>{
    

    try{
      return await this.userRepository.findOne({
      where:{
        id: body.id,
        username: body.username
      }
    });
    }catch(error){
      console.error('查询对应用户失败:'+error.message);
      throw new HttpException(
         Result.error('数据库错误'),
         HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /*
  创建
  */
  async createOneUser(@Body() body:CreateUserDto): Promise<User | null>{

      // **先检查 UUID 是否已存在**
      const existingUser = await this.userRepository.findOne({ where: { id: body.id } });
      if (existingUser) {
        throw new HttpException(Result.error('用户唯一 UUID 已存在', HttpStatus.CONFLICT.toString()), HttpStatus.CONFLICT);
      }

      try {
        return await this.userRepository.save(body)
      } catch (error) {
        console.error('创建用户失败:'+error.message);
        // 根据错误类型返回不同的 HTTP 状态码
        if (error.code === 'ER_DUP_ENTRY' || error.code === '1062') {
          throw new HttpException(Result.error('用户名已存在',HttpStatus.CONFLICT.toString()), HttpStatus.CONFLICT);
        }
        throw new HttpException(
          Result.error('数据库错误'),
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
  }

  /*
  更新
  */
  async update(@Body() body:UpdateUserDto): Promise<User | null>{
      // 确保 body 里有 id 或其他唯一标识符
      if (!body.id) {
        throw new HttpException(Result.error('缺少用户的ID',HttpStatus.BAD_REQUEST.toString()), HttpStatus.BAD_REQUEST);
      }
      // **先检查 UUID 是否已存在**
      const existingUser = await this.userRepository.findOne({ where: { id: body.id } });
      if (!existingUser) {
        throw new HttpException(Result.error('用户不存在,更新失败', HttpStatus.CONFLICT.toString()), HttpStatus.CONFLICT);
      }
      try {
        // 数据库进行更新操作
        return await this.userRepository.save(body);
      } catch (error) {
        console.error('更新用户失败:'+error.message);
        if (error.code === 'ER_DUP_ENTRY' || error.code === '1062') {
          throw new HttpException(Result.error('尝试更新账户名，但账户不能重复',HttpStatus.CONFLICT.toString()), HttpStatus.CONFLICT);
        }
        // 根据错误类型返回不同的 HTTP 状态码
        throw new HttpException(
          Result.error('数据库错误'),
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
  }


  /*
  删除
  */
  async delete(id: string): Promise<User | null>{
    
      // 判断是否为空
      
      if (!id) {
        throw new HttpException(Result.error('用户uuid不能为空',HttpStatus.BAD_REQUEST.toString()), HttpStatus.BAD_REQUEST);
      }

      // 先找到用户
      const existingUser = await this.userRepository.findOne({ where: { id: id } });
      if(!existingUser){
        throw new HttpException(Result.success({},'未找到用户',HttpStatus.NOT_FOUND.toString()), HttpStatus.NOT_FOUND);
      }

      // 数据库进行删除操作
      const result =  await this.userRepository.delete({id});
    
      // 操作result
      if (result.affected === 0) {
        throw new HttpException(Result.error('删除失败',HttpStatus.NOT_FOUND.toString()), HttpStatus.CONFLICT);
      }
      
      return existingUser;
  }

}


