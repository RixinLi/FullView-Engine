"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const app_dto_1 = require("./app.dto");
const redis_service_1 = require("./redis.service");
let RedisController = class RedisController {
    redisService;
    constructor(redisService) {
        this.redisService = redisService;
    }
    async redisKeyValue(requestDto) {
        return this.redisService.redisKeyValue(requestDto);
    }
};
exports.RedisController = RedisController;
__decorate([
    (0, microservices_1.MessagePattern)('redis'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_dto_1.RedisRequestDto]),
    __metadata("design:returntype", Promise)
], RedisController.prototype, "redisKeyValue", null);
exports.RedisController = RedisController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], RedisController);
//# sourceMappingURL=redis.controller.js.map