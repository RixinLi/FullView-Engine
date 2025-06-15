"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./appModule/app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            port: 30003,
        },
    });
    console.log('🚀 micro-service-redis running on port 30003');
    app.listen();
}
bootstrap();
//# sourceMappingURL=main.js.map