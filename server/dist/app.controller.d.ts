import { AppService } from './app.service';
import { I18nContext } from 'nestjs-i18n';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(i18n: I18nContext): string;
}
