import { TracksResponse } from './tracks-response.model';
export interface PlaylistInfoResponse {
    collaborative: boolean;
    description: string;
    external_urls: ExternalUrls;
    followers: Followers;
    href: string;
    id: string;
    images: Image[];
    name: string;
    owner: Owner;
    primary_color: null;
    public: boolean;
    snapshot_id: string;
    tracks: TracksResponse;
    type: string;
    uri: string;
}

export interface ExternalUrls {
    spotify: string;
}

export interface Followers {
    href: null;
    total: number;
}

export interface Image {
    height: number | null;
    url: string;
    width: number | null;
}

export interface Owner {
    display_name?: string;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    type: OwnerType;
    uri: string;
    name?: string;
}

export enum OwnerType {
    Artist = 'artist',
    User = 'user',
}
