import { PlaylistMetadata } from "../types/playlistMetadata";
import { PlaylistSummary } from "../types/playlistSummary";
import { SpotifyTrack } from "../types/spotifyTracks";

export function formatPrompt(prompt: string, playlistSummary: string): string {
    prompt = prompt.replace('{playlistSummary}', playlistSummary);

    return prompt
}

export function formatPlaylistSummary(data: PlaylistSummary): string {
    const formatList = (items: { name: string; count: number }[]) =>
        items.map((item, i) => `      ${i + 1}. ${item.name} (${item.count})`).join('\n');

    const formatAlbumList = (items: { name: string; artist: string; count: number }[]) =>
        items.map((item, i) => `      ${i + 1}. "${item.name}" - ${item.artist} (${item.count})`).join('\n');

    const formatYearDistribution = (distribution: Record<string, number>) => {
        const sorted = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
        return sorted.map(([decade, count]) => `      ${decade}: ${count}`).join('\n');
    };

    const summary: string = `
    - Média de tempo em minutos: ${data.average_duration_min.toFixed(2)}

    - Quantidade de Artistas diferentes: ${data.distinct_artists_count}

    - Quantidade de Álbuns diferentes: ${data.distinct_albums_count}

    - Top 10 Artistas:
${formatList(data.top_10_artists)}

    - Top 10 Álbuns:
${formatAlbumList(data.top_10_albums)}

    - Top 10 Gêneros:
${formatList(data.top_10_genres)}

    - Quantidade de Músicas por Década:
${formatYearDistribution(data.year_distribution)}

    - Status de Lançamento de Músicas:
        - Ano de Lançamento da Música mais antiga: ${data.release_year_stats.earliest_year}
        - Ano de Lançamento da Música mais nova: ${data.release_year_stats.latest_year}
`.trim();

    return summary;
}


export function calculateAverageDurationInMinutes(tracks: SpotifyTrack[]): number {
    if (tracks.length === 0) return 0;

    const totalDurationMs: number = tracks.reduce((sum, item) => {
        return sum + item.track.duration_ms;
    }, 0);

    const averageDurationMs: number = totalDurationMs / tracks.length;

    const averageDurationMinutes: number = averageDurationMs / 60000;

    return Number(averageDurationMinutes.toFixed(2));
}

export function calculateDistinctArtistsCount(tracks: SpotifyTrack[]): number {
    const artistIds: Set<String> = new Set<string>();

    for (const item of tracks) {
        for (const artist of item.track.artists) {
            artistIds.add(artist.id);
        }
    }

    return artistIds.size;
}

export function calculateDistinctAlbumsCount(tracks: SpotifyTrack[]): number {
    const albumIds: Set<String> = new Set<string>();

    for (const item of tracks) {
        if (item.track.album?.id) {
            albumIds.add(item.track.album.id);
        }
    }

    return albumIds.size;
}

export function calculateTop10Artists(tracks: SpotifyTrack[]): { name: string; count: number }[] {
    const artistCountMap = new Map<string, { name: string; count: number }>();

    for (const item of tracks) {
        for (const artist of item.track.artists) {
            if (!artistCountMap.has(artist.id)) {
                artistCountMap.set(artist.id, { name: artist.name, count: 1 });
            } else {
                const entry = artistCountMap.get(artist.id)!;
                entry.count += 1;
            }
        }
    }

    const sorted = Array.from(artistCountMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return sorted;
}

export function calculateTop10Albums(tracks: SpotifyTrack[]): { name: string; artist: string; count: number }[] {
    const albumCountMap = new Map<string, { name: string; artist: string; count: number }>();

    for (const item of tracks) {
        const album: any = item.track.album;
        const albumId: string = album.id;

        if (!albumId) continue;

        if (!albumCountMap.has(albumId)) {
            albumCountMap.set(albumId, {
                name: album.name,
                artist: album.artists[0]?.name || 'Desconhecido',
                count: 1,
            });
        } else {
            albumCountMap.get(albumId)!.count += 1;
        }
    }

    const sorted: any = Array.from(albumCountMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return sorted;
}

export function getTop10GenresFromPlaylist(allArtists: any[]): { name: string; count: number }[] {
    const genreCount = new Map<string, number>();
    for (const artist of allArtists) {
        if (!artist.genres || artist.genres.length === 0) continue;

        for (const genre of artist.genres) {
            genreCount.set(genre, (genreCount.get(genre) || 0) + 1);
        }
    }

    const top10Genres: any[] = Array.from(genreCount.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return top10Genres;
}

export function calculatePlaylistYearDistribution(tracks: SpotifyTrack[]): Record<string, number> {
    const distributionMap: Map<string, number> = new Map();

    for (const track of tracks) {
        const releaseDate: string = track.track.album?.release_date
        if (!releaseDate) continue

        const year: number = parseInt(releaseDate.slice(0, 4))
        if (isNaN(year)) continue

        const decade: string = `${Math.floor(year / 10) * 10}s`;
        distributionMap.set(decade, (distributionMap.get(decade) || 0) + 1);
    }

    const sortedTop5 = Array.from(distributionMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const top5Distribution: Record<string, number> = {}
    for (const [decade, count] of sortedTop5) {
        top5Distribution[decade] = count
    }

    return top5Distribution;
}

export function calculateReleaseYearStats(tracks: SpotifyTrack[]): {
    earliest_year: number
    latest_year: number
} {
    const yearCounts: Record<number, number> = {}
    const years: number[] = []

    for (const track of tracks) {
        const releaseDate = track.track.album?.release_date
        if (!releaseDate) continue

        const year: number = parseInt(releaseDate.slice(0, 4))
        if (isNaN(year)) continue

        years.push(year);
        yearCounts[year] = (yearCounts[year] || 0) + 1
    }

    if (years.length === 0) {
        return {
            earliest_year: 0,
            latest_year: 0,
        };
    }

    const earliest: number = Math.min(...years)
    const latest: number = Math.max(...years)

    return {
        earliest_year: earliest,
        latest_year: latest,
    }
}

export function formatPlaylistMetadata(playlistInfo: any): PlaylistMetadata {

    return {
        image: playlistInfo.images?.[1]?.url ?? playlistInfo.images?.[0]?.url,
        playlistName: playlistInfo.name ?? '',
        playlistDescription: playlistInfo.description ?? '',
        playlistOwner: playlistInfo.owner?.display_name ?? '',
        playlistFollowers: playlistInfo.followers?.total ?? 0,
    };
}

