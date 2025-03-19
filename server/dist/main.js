"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({ origin: ['http://localhost:5173'] });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        exceptionFactory: (errors) => {
            const firstError = errors[0];
            const message = Object.values(firstError.constraints || {})[0];
            return new common_1.BadRequestException({
                field: firstError.property,
                message: message,
            });
        },
    }));
    await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map