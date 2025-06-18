import { Injectable } from '@nestjs/common';
import { SpotifyService } from '../spotify/spotify.service';
import { SpotifyTrack } from '../types/spotifyTracks';
import { OpenaiService } from '../openai/openai.service';
import { calculateAverageDurationInMinutes, calculateDistinctAlbumsCount, calculateDistinctArtistsCount, calculatePlaylistYearDistribution, calculateReleaseYearStats, calculateTop10Albums, calculateTop10Artists, formatPlaylistSummary, formatPrompt, getTop10GenresFromPlaylist } from '../utils';
import { prompt } from '../prompts/prompt';

@Injectable()
export class AnalysisService {
    constructor(private readonly spotifyService: SpotifyService, private readonly openaiService: OpenaiService) {
    }

    async analizePlaylist(playlistUrl: string) {
        const tracks: SpotifyTrack[] = await this.spotifyService.getPlaylistTracks(playlistUrl)
        const playlistInfo: any = await this.spotifyService.getPlaylist(playlistUrl)

        const artistIdsSet = new Set<string>();
        for (const t of tracks) {
            for (const artist of t.track.artists) {
                artistIdsSet.add(artist.id);
            }
        }
        const allArtistIds: string[] = Array.from(artistIdsSet);

        const allArtists: any[] = [];
        for (let i = 0; i < allArtistIds.length; i += 50) {
            const batch = allArtistIds.slice(i, i + 50);
            const artists = await this.spotifyService.getSeveralArtists(batch);
            allArtists.push(...artists);
        }

        const parsedPlaylistSummary: string = this.createPlaylistSummary(tracks, allArtists)


        // console.log(formatPrompt(prompt, parsedPlaylistSummary))

        // const aiResponse = this.openaiService.generateAiResponse(formatPrompt(prompt, parsedPlaylistSummary))

        return true
    }

    private createPlaylistSummary(tracks: SpotifyTrack[], allArtists: any[]): string {
        const playlistAverageTracksDuration: number = calculateAverageDurationInMinutes(tracks)
        const playlistDistinctArtistsCount: number = calculateDistinctArtistsCount(tracks)
        const playlistDistinctAlbumsCount: number = calculateDistinctAlbumsCount(tracks)
        const top10Artists: { name: string; count: number }[] = calculateTop10Artists(tracks)
        const top10Albuns: { name: string; artist: string; count: number }[] = calculateTop10Albums(tracks)
        const top10Genres: { name: string; count: number }[] = getTop10GenresFromPlaylist(allArtists)
        const yearDistribution: Record<string, number> = calculatePlaylistYearDistribution(tracks)
        const releaseYearStats: {
            earliest_year: number,
            latest_year: number
        } = calculateReleaseYearStats(tracks)

        const parsedPlaylistSummary: string = formatPlaylistSummary({
            average_duration_min: playlistAverageTracksDuration,
            distinct_artists_count: playlistDistinctArtistsCount,
            distinct_albums_count: playlistDistinctAlbumsCount,
            top_10_artists: top10Artists,
            top_10_albums: top10Albuns,
            top_10_genres: top10Genres,
            year_distribution: yearDistribution,
            release_year_stats: releaseYearStats
        })

        return parsedPlaylistSummary
    }
}
