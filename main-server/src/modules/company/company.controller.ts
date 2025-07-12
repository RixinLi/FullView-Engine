import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  HttpStatus,
  HttpCode,
  HttpException,
  UseInterceptors,
  filterLogLevels,
  Inject,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { QueryCompanyDto } from './dto/query-company.dto';
import { Result } from 'src/common/result';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { ResponseCompanyDto } from './dto/response-company.dto';
import { plainToClass } from 'class-transformer';
import { FilterQueryCompanyDto } from './dto/filter-query-company.dto';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '../user/user.entity';
import { Company } from './company.entity';
import { firstValueFrom } from 'rxjs';
import { createECDH } from 'crypto';

@Controller('company')
export class CompanyController {
  private readonly nameSpace: string = 'companies:';
  private readonly ttlTime: number = 3600;
  private readonly ttlUnit: string = 'EX';

  constructor(
    private readonly companyService: CompanyService,
    @Inject('MINIO_SERVICE') readonly RedisClient: ClientProxy /* 缓存的键选择为company_code */
  ) {}

  /*
  查询all 
  */
  @Get('findAll')
  async findAllCompanies() {
    const allData = await this.companyService.findAll();
    return Result.success(allData);
  }

  /*
  查询filter
  */
  @Post('findFilter')
  async findFilterCompanies(@Body() filterDto: FilterQueryCompanyDto) {
    // 取出数据优先filter

    if (!filterDto)
      throw new HttpException(
        Result.error('请带上合理请求', HttpStatus.INTERNAL_SERVER_ERROR.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    const allData = await this.companyService.findAll();

    // 开始处理信息
    const groupedData = {
      dimension: filterDto.dimension,
      data: {},
      filter: filterDto.filter, // 稍后实现
    };

    if (groupedData.dimension.length === 0) {
      groupedData.data = allData;
      return Result.success(groupedData);
    }

    let filteredData = allData;

    if (filterDto.filter) {
      filteredData = allData.filter((company) => {
        return (
          (!filterDto.filter?.level ||
            (company.level !== undefined && filterDto.filter.level.includes(company.level))) &&
          (!filterDto.filter?.country ||
            (company.country && filterDto.filter.country.includes(company.country))) &&
          (!filterDto.filter?.city ||
            (company.city !== undefined && filterDto.filter.city.includes(company.city))) &&
          (!filterDto.filter?.founded_year?.start ||
            (company.founded_year !== undefined &&
              company.founded_year >= filterDto.filter.founded_year.start)) &&
          (!filterDto.filter?.founded_year?.end ||
            (company.founded_year !== undefined &&
              company.founded_year <= filterDto.filter.founded_year.end)) &&
          (!filterDto.filter?.annual_revenue?.min ||
            (company.annual_revenue !== undefined &&
              company.annual_revenue >= filterDto.filter.annual_revenue.min)) &&
          (!filterDto.filter?.annual_revenue?.max ||
            (company.annual_revenue !== undefined &&
              company.annual_revenue <= filterDto.filter.annual_revenue.max)) &&
          (!filterDto.filter?.employees?.min ||
            (company.employees !== undefined &&
              company.employees >= filterDto.filter.employees.min)) &&
          (!filterDto.filter?.employees?.max ||
            (company.employees !== undefined &&
              company.employees <= filterDto.filter.employees.max))
        );
      });
    }

    // 按照单一维度（如 "country"）分组
    if (groupedData.dimension && typeof groupedData.dimension === 'string') {
      // 分组
      groupedData.data = filteredData.reduce((acc, company) => {
        const key = company[groupedData.dimension];
        if (!acc[key]) acc[key] = [];
        acc[key].push(company);
        return acc;
      }, {});

      // 排序
      Object.keys(groupedData.data).forEach((key) => {
        groupedData.data[key].sort((a, b) => {
          if (a[groupedData.dimension] < b[groupedData.dimension]) return -1;
          if (a[groupedData.dimension] > b[groupedData.dimension]) return 1;
          return 0;
        });
      });
    } else {
      groupedData.data = filteredData;
    }

    return Result.success(groupedData);
  }

  @Get('findOne')
  async findOneCompany(@Body() body: QueryCompanyDto) {
    // 先查看Redis缓存是否存在
    try {
      const val: Object = await firstValueFrom(
        this.RedisClient.send({ cmd: 'getCache' }, this.nameSpace + body.company_code)
      );
      if (val != null) {
        console.log(`使用缓存key:${this.nameSpace + body.company_code}`);
        return Result.success(
          plainToClass(ResponseCompanyDto, val, { excludeExtraneousValues: true })
        );
      }
    } catch (e) {
      console.log(e);
    }

    const res = await this.companyService.findOne(body);
    if (!res) {
      throw new HttpException(
        Result.error('未能找到对应的公司', HttpStatus.NOT_FOUND.toString()),
        HttpStatus.NOT_FOUND
      );
    }

    //打redis缓存
    try {
      this.RedisClient.emit('setCache', {
        key: this.nameSpace + body.company_code,
        val: res,
        ttlTime: this.ttlTime,
        ttlUnit: this.ttlUnit,
      });
    } catch (e) {
      console.log(e);
    }

    return Result.success(plainToClass(ResponseCompanyDto, res, { excludeExtraneousValues: true }));
  }

  /*
  创建 create
  */
  @Post('createOne')
  async insertOneCompany(@Body() body: CreateCompanyDto) {
    await this.companyService.createOneCompany(body);

    // 查询创建后的数据
    const createdCompany = await this.companyService.findOne(body);

    if (!createdCompany) {
      throw new HttpException(
        Result.error('创建公司失败', HttpStatus.BAD_REQUEST.toString()),
        HttpStatus.BAD_REQUEST
      );
    }

    // 创建公司成功后, 打入redis缓存
    //打redis缓存
    try {
      this.RedisClient.emit('setCache', {
        key: this.nameSpace + createdCompany.company_code,
        val: createdCompany,
        ttlTime: this.ttlTime,
        ttlUnit: this.ttlUnit,
      });
    } catch (e) {
      console.log(e);
    }

    return Result.success(createdCompany, HttpStatus.CREATED.toString(), '创建公司成功');
  }

  /*
  更新 update
  */
  @Patch('updateOne')
  async UpdateOneCompany(@Body() body: UpdateCompanyDto) {
    await this.companyService.updateOneCompany(body);

    // 重新查询更新后的数据
    const updatedCompany = await this.companyService.findOne(body);

    if (!updatedCompany) {
      throw new HttpException(
        Result.error('更新公司失败', HttpStatus.BAD_REQUEST.toString()),
        HttpStatus.BAD_REQUEST
      );
    }

    // 更新redis缓存
    try {
      this.RedisClient.emit('setCache', {
        key: this.nameSpace + updatedCompany.company_code,
        val: updatedCompany,
        ttlTime: this.ttlTime,
        ttlUnit: this.ttlUnit,
      });
    } catch (e) {
      console.log(e);
    }

    return Result.success(updatedCompany, HttpStatus.OK.toString(), '更新公司成功');
  }

  /*
  删除
  */
  @Delete('deleteOne')
  async deleteOneCompany(@Query('company_code') company_code: string) {
    if (!company_code) {
      throw new HttpException('请提供company_code', HttpStatus.BAD_REQUEST);
    }

    const res: DeleteResult = await this.companyService.deleteOneCompany(company_code);

    if (res.affected && res.affected > 0) {
      await this.RedisClient.emit('delCache', { key: this.nameSpace + company_code });
      return Result.success(
        res.affected,
        HttpStatus.OK.toString(),
        '删除成功,公司数目为：' + res.affected
      );
    } else {
      throw new HttpException(
        Result.error('删除公司失败', HttpStatus.BAD_REQUEST.toString()),
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
