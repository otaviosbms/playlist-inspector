import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class StatusController {
    @Get()
    getStatus() {
        return {
            status: 'ok',
            message: 'Aplicação funcionando',
            timestamp: new Date().toISOString(),
        };
    }
}
