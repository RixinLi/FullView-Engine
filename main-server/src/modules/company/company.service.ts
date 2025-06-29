import { Body, HttpException, HttpStatus, Inject, Injectable, Param, Res } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Between, DeleteResult, In, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Company } from './company.entity';
import { Repository_Dependency_Constants } from 'src/common/constants';
import { QueryCompanyDto } from './dto/query-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Result } from 'src/common/result';
import { FilterQueryCompanyDto } from './dto/filter-query-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @Inject(Repository_Dependency_Constants.company)
    private readonly companyRepository: Repository<Company>
  ) {}

  /*
  查询
  */
  async findAll(): Promise<Company[]> {
    try {
      return await this.companyRepository.find();
    } catch (error) {
      console.error('查询所有公司失败:' + error.message);
      throw new HttpException(Result.error('数据库错误'), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(@Body() body: QueryCompanyDto): Promise<Company | null> {
    try {
      return await this.companyRepository.findOne({
        where: {
          company_code: body.company_code,
          company_name: body.company_name,
        },
      });
    } catch (error) {
      console.error('查询对应公司失败:' + error.message);
      throw new HttpException(Result.error('数据库错误'), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /*
  创建
  */
  async createOneCompany(@Body() body: CreateCompanyDto): Promise<InsertResult> {
    try {
      const newCompany = this.companyRepository.create(body);
      return await this.companyRepository.insert(newCompany);
    } catch (error) {
      console.error('创建公司失败:' + error.message);
      // 根据错误类型返回不同的 HTTP 状态码
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          Result.error('公司唯一ID已存在', HttpStatus.CONFLICT.toString()),
          HttpStatus.CONFLICT
        );
      }
      throw new HttpException(Result.error('数据库错误'), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /*
  更新
  */
  async updateOneCompany(@Body() body: UpdateCompanyDto): Promise<UpdateResult> {
    try {
      // 确保 body 里有 id 或其他唯一标识符
      if (!body.company_code) {
        throw new HttpException(
          Result.error('缺少公司的ID', HttpStatus.BAD_REQUEST.toString()),
          HttpStatus.BAD_REQUEST
        );
      }

      // 数据库进行更新操作
      const result = await this.companyRepository.update({ company_code: body.company_code }, body);

      // 操作result
      if (result.affected === 0) {
        throw new HttpException(
          Result.error('未找到公司或更新失败', HttpStatus.NOT_FOUND.toString()),
          HttpStatus.NOT_FOUND
        );
      }
      return result;
    } catch (error) {
      console.error('更新公司失败:' + error.message);
      // 根据错误类型返回不同的 HTTP 状态码
      throw new HttpException(Result.error('数据库错误'), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /*
  删除
  */
  async deleteOneCompany(@Param('company_code') company_code: string): Promise<DeleteResult> {
    try {
      // 判断是否为空
      if (!company_code) {
        throw new HttpException(
          Result.error('公司代码不能为空', HttpStatus.BAD_REQUEST.toString()),
          HttpStatus.BAD_REQUEST
        );
      }
      // 数据库进行更新操作
      const result = await this.companyRepository.delete({
        company_code: company_code,
      });

      // 操作result
      if (result.affected === 0) {
        throw new HttpException(
          Result.error('未找到公司或删除失败', HttpStatus.NOT_FOUND.toString()),
          HttpStatus.NOT_FOUND
        );
      }
      return result;
    } catch (error) {
      console.error('删除公司失败:' + error.message);
      // 根据错误类型返回不同的 HTTP 状态码
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new HttpException(
          Result.error('公司仍被引用，无法删除', HttpStatus.CONFLICT.toString()),
          HttpStatus.CONFLICT
        );
      }
      throw new HttpException(Result.error('数据库错误'), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
