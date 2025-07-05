import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {
    constructor(private readonly AnalysisService: AnalysisService) { }

    @Post()
    async getRecommendationsApi(@Body() body: { url: string }) {
        const url: string = body.url;
        const result = await this.AnalysisService.analizePlaylist(url);
        return { result };
    }

}
