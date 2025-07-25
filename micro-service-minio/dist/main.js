"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            port: 30004,
        },
    });
    console.log('🚀 micro-service-minio running on port 30004');
    app.listen();
}
bootstrap();
//# sourceMappingURL=main.js.map