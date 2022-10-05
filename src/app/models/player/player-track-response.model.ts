export interface PlayerTrackResponse {
    album: Album;
    artists: Entity[];
    duration_ms: number;
    id: string | null;
    is_playable: boolean;
    name: string;
    uid: string;
    uri: string;
    media_type: 'audio' | 'video';
    type: 'track' | 'episode' | 'ad';
    track_type: 'audio' | 'video';
    linked_from: {
        uri: string | null;
        id: string | null;
    };
}

interface Album {
    name: string;
    uri: string;
    images: Image[];
}

interface Image {
    height?: number | null | undefined;
    url: string;
    size?: string | null | undefined;
    width?: number | null | undefined;
}

interface Entity {
    name: string;
    uri: string;
    url: string;
}
