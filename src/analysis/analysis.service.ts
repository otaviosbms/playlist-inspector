import { Injectable } from '@nestjs/common';
import { SpotifyService } from '../spotify/spotify.service';
import { SpotifyPlaylistTrack } from '../types/tracks';
import { OpenaiService } from '../openai/openai.service';
import { formatPrompt } from '../utils';
import { prompt } from '../prompts/prompt';

@Injectable()
export class AnalysisService {
    constructor(private readonly spotifyService: SpotifyService, private readonly openaiService: OpenaiService) {
    }

    async analizePlaylist() {
        const tracks: SpotifyPlaylistTrack[] = await this.spotifyService.getPlaylistTracks('https://open.spotify.com/playlist/6NtOoCp8wzwDss0pkqKZZH?si=2665663dfe044510')

        const tracksName: string[] = tracks.map(item => item.track.name);

        const trackAndArtist: string = tracks.map(
            item => `${item.track.name} - ${item.track.artists[0].name}`
        ).join('\n');

        console.log(formatPrompt(prompt, trackAndArtist))

        // const aiResponse = this.openaiService.generateAiResponse(formatPrompt(prompt, tracksName))

        return true
    }
}
