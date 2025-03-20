import { ExecutionContext } from '@nestjs/common';
import { I18nResolver } from 'nestjs-i18n';
export declare class LangHeaderResolver implements I18nResolver {
    resolve(context: ExecutionContext): string | undefined;
}
