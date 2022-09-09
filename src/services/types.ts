export interface ICollection {
    albumCoverImage: string;
    name: string;
    uuid: string | undefined;
    type: string;
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
export interface IImageDataArray  {
    file: string;
    thumbnail_file: string;
    imageSize?: ISizeCalculationResult;
}
export interface IPostIds {
    danbooru?: number;
    yande?: number;
    pixiv?: number;
}

export interface IAnimePic {
    id: string;
    indexer: number;
    imagesDataArray: IImageDataArray[];
    alternative_names?: string[];
    oldFile?: string;
    album: string;
    //tags_pixiv?: string[];
    //tags_danbooru?: string[];
    artist?: IArtist;
    storedResult?: string;
    links: IPostLinks;
    ids: IPostIds;
    isHidden: boolean;
    isNSFW: boolean;
    hasResults?: boolean;
    //pixiv_post_id?: number;

    //compatability with INewAnimePic
    tags?: ITagsObject;
    //imageSize?: ISizeCalculationResult;
}
export interface ITagsObject {
    pixiv?: IPixivTag[];
    danbooru?: IDanbooruTags;
    yande?: IYandeTags;
}

export interface IYandeTags extends IDanbooruTags {}

export interface IDanbooruTags {
    artists?: string[];
    copyrights?: string[];
    characters?: string[];
    general?: string[];
}
export interface IPixivTag {
    tag: string;
    romaji?: string;
    enTranslation?: string;
}
export type AlbumSchemaType = "Anime Pic";

export interface INewAlbum {
    name: string;
    type: AlbumSchemaType | undefined;
    album_thumbnail_file: "" | File;
    isHidden: boolean;
}

export interface INewPic {
    file?: string;
    old_file?: string;
    thumbnail_file?: string;
    url: string;
    useSauceNao?: boolean;
    has_results?: boolean;
    type?: AlbumSchemaType;
    album: string;
}

export type PicTypes = IAnimePic;

export interface ISettings {
    backend_url: string;
    database_url: string;
    search_diff_sites: boolean;
    pixiv_download_first_image_only: boolean;
    saucenao_api_key?: string;

}


export interface IErrorObject {
    backendErrors: string;
    
    databaseErrors: string;
    
    saucenaoAPIErrors: string
}

export interface ISettingsErrorObject {
    backendUrlError: string;
    
    databaseUrlError: string;
    
    saucenaoApiKeyError: string
}

export interface ISizeCalculationResult extends ISize {
    images?: ISize[];
}

export interface ISize {
    width: number | undefined;
    height: number | undefined;
    orientation?: number;
    type?: string;
}
/* export interface ITableOfContents extends ICollection {
    id:  string;
    name: string;
    thumbnail_file: string,
}

 */