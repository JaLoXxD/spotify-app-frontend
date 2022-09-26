export interface UserFollowedArtistsResponse {
    artists: Artists;
}

export interface Artists {
    items: ArtistsItem[];
    next: null;
    total: number;
    cursors: Cursors;
    limit: number;
    href: string;
}

export interface Cursors {
    after: null;
}

export interface ArtistsItem {
    external_urls: ExternalUrls;
    followers: Followers;
    genres: string[];
    href: string;
    id: string;
    images: Image[];
    name: string;
    popularity: number;
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
    height: number;
    url: string;
    width: number;
}
