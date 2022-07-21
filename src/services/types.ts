export interface ICollection {
    albumCoverImage: string;
    name: string;
    uuid: string | undefined;
    type?: string;
    estimatedPicCount: number;
}

export interface IPostLinks {
    pixiv?: string;
    danbooru?: string;
    twitter?: string;
    other?: string[];
    discord?: string;
}


export interface IArtist {
    pixiv?: {
        userId: string;
        userName: string; //japanese name i think
        userAccount: string; //english name usually
    };
    danbooru?: {

    }
}

export interface IAnimePic {
    id: string;
    file: string;
    alternative_names?: string[];
    old_file?: string;
    thumbnail_file: string;
    album: string;
    tags_pixiv?: string[];
    tags_danbooru?: string[];
    artist?: IArtist;
    links: IPostLinks;
    characters?: string[];
    has_results: boolean;
    pixiv_post_id?: number;
}
export type AlbumSchemaType = "Anime Pic";

export interface INewAlbum {
    name: string;
    type: AlbumSchemaType | undefined;
    thumbnail_file: "" | File ;
}

export interface INewPic {
    file?: string;
    old_file?: string;
    thumbnail_file?: string;
    url: string;
    has_results?: boolean;
    type?: AlbumSchemaType;
    album: string;
}

export type PicTypes = IAnimePic;

export interface ISettings {
    backend_url: string;
    database_url: string;
    prefered_quality_highest_bool: boolean;
    search_diff_sites: boolean;
    saucenao_api_key?: string;

}

/* export interface ITableOfContents extends ICollection {
    id:  string;
    name: string;
    thumbnail_file: string,
}

 */