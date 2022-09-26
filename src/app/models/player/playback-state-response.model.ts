export interface PlaybackStateResponse {
    device: Device;
    shuffle_state: boolean;
    repeat_state: string;
    timestamp: number;
    context: Context;
    progress_ms: number;
    item: Item;
    currently_playing_type: string;
    actions: Actions;
    is_playing: boolean;
}

export interface Actions {
    disallows: Disallows;
}

export interface Disallows {
    resuming: boolean;
}

export interface Context {
    external_urls: ExternalUrls;
    href: string;
    type: string;
    uri: string;
}

export interface ExternalUrls {
    spotify: string;
}

export interface Device {
    id: string;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: string;
    volume_percent: number;
}

export interface Item {
    album: Album;
    artists: Artist[];
    available_markets: any[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: ExternalIDS;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: null;
    track_number: number;
    type: string;
    uri: string;
}

export interface Album {
    album_type: string;
    artists: Artist[];
    available_markets: any[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: Date;
    release_date_precision: string;
    total_tracks: number;
    type: string;
    uri: string;
}

export interface Artist {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

export interface Image {
    height: number;
    url: string;
    width: number;
}

export interface ExternalIDS {
    isrc: string;
}

export class Convert {
    public static toPlaybackStateResponse(json: string): PlaybackStateResponse {
        return cast(JSON.parse(json), r('PlaybackStateResponse'));
    }

    public static playbackStateResponseToJson(
        value: PlaybackStateResponse
    ): string {
        return JSON.stringify(
            uncast(value, r('PlaybackStateResponse')),
            null,
            2
        );
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(
            `Invalid value for key "${key}". Expected type ${JSON.stringify(
                typ
            )} but got ${JSON.stringify(val)}`
        );
    }
    throw Error(
        `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`
    );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach(
            (p: any) => (map[p.json] = { key: p.js, typ: p.typ })
        );
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach(
            (p: any) => (map[p.js] = { key: p.json, typ: p.typ })
        );
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue('array', val);
        return val.map((el) => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue('Date', val);
        }
        return d;
    }

    function transformObject(
        props: { [k: string]: any },
        additional: any,
        val: any
    ): any {
        if (val === null || typeof val !== 'object' || Array.isArray(val)) {
            return invalidValue('object', val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach((key) => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key)
                ? val[key]
                : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === 'any') return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === 'object' && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === 'object') {
        return typ.hasOwnProperty('unionMembers')
            ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty('arrayItems')
            ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty('props')
            ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== 'number') return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    PlaybackStateResponse: o(
        [
            { json: 'device', js: 'device', typ: r('Device') },
            { json: 'shuffle_state', js: 'shuffle_state', typ: true },
            { json: 'repeat_state', js: 'repeat_state', typ: '' },
            { json: 'timestamp', js: 'timestamp', typ: 0 },
            { json: 'context', js: 'context', typ: r('Context') },
            { json: 'progress_ms', js: 'progress_ms', typ: 0 },
            { json: 'item', js: 'item', typ: r('Item') },
            {
                json: 'currently_playing_type',
                js: 'currently_playing_type',
                typ: '',
            },
            { json: 'actions', js: 'actions', typ: r('Actions') },
            { json: 'is_playing', js: 'is_playing', typ: true },
        ],
        false
    ),
    Actions: o(
        [{ json: 'disallows', js: 'disallows', typ: r('Disallows') }],
        false
    ),
    Disallows: o([{ json: 'resuming', js: 'resuming', typ: true }], false),
    Context: o(
        [
            {
                json: 'external_urls',
                js: 'external_urls',
                typ: r('ExternalUrls'),
            },
            { json: 'href', js: 'href', typ: '' },
            { json: 'type', js: 'type', typ: '' },
            { json: 'uri', js: 'uri', typ: '' },
        ],
        false
    ),
    ExternalUrls: o([{ json: 'spotify', js: 'spotify', typ: '' }], false),
    Device: o(
        [
            { json: 'id', js: 'id', typ: '' },
            { json: 'is_active', js: 'is_active', typ: true },
            { json: 'is_private_session', js: 'is_private_session', typ: true },
            { json: 'is_restricted', js: 'is_restricted', typ: true },
            { json: 'name', js: 'name', typ: '' },
            { json: 'type', js: 'type', typ: '' },
            { json: 'volume_percent', js: 'volume_percent', typ: 0 },
        ],
        false
    ),
    Item: o(
        [
            { json: 'album', js: 'album', typ: r('Album') },
            { json: 'artists', js: 'artists', typ: a(r('Artist')) },
            {
                json: 'available_markets',
                js: 'available_markets',
                typ: a('any'),
            },
            { json: 'disc_number', js: 'disc_number', typ: 0 },
            { json: 'duration_ms', js: 'duration_ms', typ: 0 },
            { json: 'explicit', js: 'explicit', typ: true },
            { json: 'external_ids', js: 'external_ids', typ: r('ExternalIDS') },
            {
                json: 'external_urls',
                js: 'external_urls',
                typ: r('ExternalUrls'),
            },
            { json: 'href', js: 'href', typ: '' },
            { json: 'id', js: 'id', typ: '' },
            { json: 'is_local', js: 'is_local', typ: true },
            { json: 'name', js: 'name', typ: '' },
            { json: 'popularity', js: 'popularity', typ: 0 },
            { json: 'preview_url', js: 'preview_url', typ: null },
            { json: 'track_number', js: 'track_number', typ: 0 },
            { json: 'type', js: 'type', typ: '' },
            { json: 'uri', js: 'uri', typ: '' },
        ],
        false
    ),
    Album: o(
        [
            { json: 'album_type', js: 'album_type', typ: '' },
            { json: 'artists', js: 'artists', typ: a(r('Artist')) },
            {
                json: 'available_markets',
                js: 'available_markets',
                typ: a('any'),
            },
            {
                json: 'external_urls',
                js: 'external_urls',
                typ: r('ExternalUrls'),
            },
            { json: 'href', js: 'href', typ: '' },
            { json: 'id', js: 'id', typ: '' },
            { json: 'images', js: 'images', typ: a(r('Image')) },
            { json: 'name', js: 'name', typ: '' },
            { json: 'release_date', js: 'release_date', typ: Date },
            {
                json: 'release_date_precision',
                js: 'release_date_precision',
                typ: '',
            },
            { json: 'total_tracks', js: 'total_tracks', typ: 0 },
            { json: 'type', js: 'type', typ: '' },
            { json: 'uri', js: 'uri', typ: '' },
        ],
        false
    ),
    Artist: o(
        [
            {
                json: 'external_urls',
                js: 'external_urls',
                typ: r('ExternalUrls'),
            },
            { json: 'href', js: 'href', typ: '' },
            { json: 'id', js: 'id', typ: '' },
            { json: 'name', js: 'name', typ: '' },
            { json: 'type', js: 'type', typ: '' },
            { json: 'uri', js: 'uri', typ: '' },
        ],
        false
    ),
    Image: o(
        [
            { json: 'height', js: 'height', typ: 0 },
            { json: 'url', js: 'url', typ: '' },
            { json: 'width', js: 'width', typ: 0 },
        ],
        false
    ),
    ExternalIDS: o([{ json: 'isrc', js: 'isrc', typ: '' }], false),
};
