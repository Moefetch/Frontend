export interface ICollection {
    albumCoverImage: string;
    name: string;
    uuid: string;
    type?: string;
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

export interface INewAlbum {
    name: string;
    type: string;
    thumbnail_file: "" | File ;
}




/* export interface ITableOfContents extends ICollection {
    id:  string;
    name: string;
    thumbnail_file: string,
}

 */