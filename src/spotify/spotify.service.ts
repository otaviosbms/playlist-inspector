import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SpotifyTrack } from '../types/spotifyTracks';

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

    private async getSpotifyAccessToken() {
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

    private extractPlaylistId(playlistUrl: string) {
        const match: RegExpMatchArray | null = playlistUrl.match(/playlist\/([a-zA-Z0-9]+)(\?.*)?/);
        return match ? match[1] : null;
    }

    async getPlaylist(playlistUrl: string): Promise<any> {
        try {
            const playlistId: string | null = this.extractPlaylistId(playlistUrl);
            if (!playlistId) {
                throw new Error('Invalid Spotify playlist URL');
            }

            const token: string = await this.getSpotifyAccessToken();
            const url = `${this.SPOTIFY_API_URL}/playlists/${playlistId}`;

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return response.data;
        } catch (error) {
            throw new Error(error)
        }
    }

    async getPlaylistTracks(playlistUrl: string): Promise<SpotifyTrack[]> {
        try {
            const playlistId: string | null = this.extractPlaylistId(playlistUrl)
            const token: string = await this.getSpotifyAccessToken()
            const tracksList: SpotifyTrack[] = [];
            let url: string = `${this.SPOTIFY_API_URL}/playlists/${playlistId}/tracks`;

            while (url) {
                const response: any = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                response.data.items.forEach((item: SpotifyTrack) => {
                    if (item.track) {
                        tracksList.push(item)
                    }
                });

                url = response.data.next
            }

            return tracksList.reverse()
        } catch (error) {
            throw new Error(error)
        }
    }

    async getSeveralArtists(ids: string[]): Promise<any[]> {
        try {
            const token = await this.getSpotifyAccessToken();
            const idsParam = ids.slice(0, 50).join(',')
            const url = `${this.SPOTIFY_API_URL}/artists?ids=${idsParam}`

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return response.data.artists;
        } catch (error) {
            throw new Error(error)
        }
    }

    async getSeveralAlbums(ids: string[]): Promise<any[]> {
        try {
            const token = await this.getSpotifyAccessToken()
            const idsParam = ids.slice(0, 20).join(',')
            const url = `${this.SPOTIFY_API_URL}/albums?ids=${idsParam}`

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return response.data.albums;
        } catch (error) {
            throw new Error(error)
        }
    }

}
