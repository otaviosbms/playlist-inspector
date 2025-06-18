type Recommendation = {
    analysis: string;
    recommendations: {
        artists: {
            name: string;
            reason: string;
        }[]
        albums: {
            title: string;
            artist: string;
            reason: string;
        }[]
        songs: {
            title: string;
            artist: string;
            reason: string;
        }[]
    };
};