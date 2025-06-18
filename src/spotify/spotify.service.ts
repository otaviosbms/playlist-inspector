import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SpotifyPlaylistTrack } from '../types/tracks';

@Injectable()
export class SpotifyService {

    private readonly SPOTIFY_CLIENT_ID: string
    private readonly SPOTIFY_CLIENT_SECRET: string
    private readonly SPOTIFY_TOKEN_URL: string
    private readonly SPOTIFY_API_URL: string

    constructor(private readonly config: ConfigService) {
        this.SPOTIFY_CLIENT_ID = this.config.getOrThrow<string>('SPOTIFY_CLIENT_ID');
        this.SPOTIFY_CLIENT_SECRET = this.config.getOrThrow<string>('SPOTIFY_CLIENT_SECRET');
        this.SPOTIFY_TOKEN_URL = this.config.getOrThrow<string>('SPOTIFY_TOKEN_URL');
        this.SPOTIFY_API_URL = this.config.getOrThrow<string>('SPOTIFY_API_URL');
    }

    async getSpotifyAccessToken() {
        const response: any = await axios.post(
            this.SPOTIFY_TOKEN_URL,
            'grant_type=client_credentials',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization:
                        'Basic ' +
                        Buffer.from(`${this.SPOTIFY_CLIENT_ID}:${this.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
                },
            }
        );
        return response.data.access_token;
    }

    extractPlaylistId(playlistUrl: string) {
        const match: RegExpMatchArray | null = playlistUrl.match(/playlist\/([a-zA-Z0-9]+)(\?.*)?/);
        return match ? match[1] : null;
    }

    async getPlaylistTracks(playlistUrl: string): Promise<SpotifyPlaylistTrack[]> {
        const playlistId: string | null = this.extractPlaylistId(playlistUrl)
        const token: string = await this.getSpotifyAccessToken()
        const tracksList: SpotifyPlaylistTrack[] = [];
        let url: string = `${this.SPOTIFY_API_URL}/playlists/${playlistId}/tracks`;

        while (url) {
            const response: any = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            response.data.items.forEach((item: SpotifyPlaylistTrack) => {
                if (item.track) {
                    tracksList.push(item)
                }
            });

            url = response.data.next
        }

        console.log(tracksList[0])
        return tracksList.reverse()
    }

    async getSeveralArtists(ids: string[]): Promise<any[]> {
        const token = await this.getSpotifyAccessToken();
        const idsParam = ids.slice(0, 50).join(',')
        const url = `${this.SPOTIFY_API_URL}/artists?ids=${idsParam}`

        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data.artists;
    }

    async getSeveralAlbums(ids: string[]): Promise<any[]> {
        const token = await this.getSpotifyAccessToken()
        const idsParam = ids.slice(0, 20).join(',')
        const url = `${this.SPOTIFY_API_URL}/albums?ids=${idsParam}`

        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data.albums;
    }

}
