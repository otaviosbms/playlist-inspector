export type PlaylistSummary = {
    total_tracks: number;
    total_duration_ms: number;
    average_duration_ms: number;
    distinct_artists_count: number;
    distinct_albums_count: number;
    top_10_artists: { name: string; count: number }[];
    top_10_albums: { name: string; artist: string; count: number }[];
    top_10_genres: { name: string; count: number }[];
    year_distribution: Record<string, number>; // {"1970s": 120, "2000s": 230}
    release_year_stats: {
        earliest_year: number;
        latest_year: number;
        most_common_year: number;
    };
    language_distribution: Record<string, number>; // Ex: {"en": 890, "es": 10}
    // longest_tracks: { name: string; artist: string; duration_ms: number }[];
    // shortest_tracks: { name: string; artist: string; duration_ms: number }[];
};