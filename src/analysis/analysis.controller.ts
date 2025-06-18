import { Controller, Get } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {
    constructor(private readonly AnalysisService: AnalysisService) { }

    @Get('/test')
    getHello() {
        return this.AnalysisService.analizePlaylist();
    }
}
