export type PlaylistSummary = {
    average_duration_min: number;
    distinct_artists_count: number;
    distinct_albums_count: number;
    top_10_artists: { name: string; count: number }[];
    top_10_albums: { name: string; artist: string; count: number }[];
    top_10_genres: { name: string; count: number }[];
    year_distribution: Record<string, number>;
    release_year_stats: {
        earliest_year: number;
        latest_year: number;
    };
};