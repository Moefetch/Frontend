export interface IAlbum {
  albumCoverImage: string;
  name: string;
  uuid: string;
  type: string;
  estimatedPicCount: number;
}
export interface IPostLinks {
  pixiv?: string;
  danbooru?: string;
  yande?: string;
  twitter?: string;
  other?: string[];
}

export interface IFilterObj {
  sortBy?: string;
  nameIncludes?: string;
  artists?: string[];
  tags?: string[];
  showHidden: boolean;
  showNSFW: boolean;
}

export interface IArtist {
  pixiv?: {
    userId: string;
    userName: string; //japanese name i think
    userAccount: string; //english name usually
  };
  danbooru?: {};
}
export interface IImageDataArray {
  file: string;
  thumbnail_file: string;
  imageSize?: ISizeCalculationResult;
}
export interface IPostIds {
  danbooru?: number;
  yande?: number;
  pixiv?: number;
}

export interface IPicture {
  id: string;
  indexer: number;
  imagesDataArray: IImageDataArray[];
  alternative_names?: string[];
  thumbnailFile: string;
  album: string;
  //tags_pixiv?: string[];
  //tags_danbooru?: string[];
  artists?: string[];
  storedResult?: "danbooru" | "pixiv" | "yande";
  links: IPostLinks;
  ids: IPostIds;
  isHidden: boolean;
  isNSFW: boolean;
  hasResults?: boolean;
  //pixiv_post_id?: number;

  //compatability with INewAnimePic
  tags?: string[];
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
  optionalOverrideParams?: ILogicCategorySpecialParamsDictionary;
  useSauceNao?: boolean;
  has_results?: boolean;
  type?: AlbumSchemaType;
  album: string;
  isHidden?: boolean;
}

export type PicTypes = IPicture;

export type StockSerrings = "show_nsfw" | "blur_nsfw" | "show_hidden";
type IStockSettings = {
  [setting in StockSerrings]: IParam;
};

export interface ISettings {
  backend_url: string;
  database_url: IParam;

  stock_settings: IStockSettings;
  special_settings?: ILogicSpecialSettingsDictionary;
  special_params?: ILogicSpecialParamsDictionary;
}

export const defaultDatabase_url = {
  containsString: true,
  checkBoxValue: false,
  checkBoxDescription: "Use a mongoDB database",
  stringValue: {
    stringPlaceholder:
      "Database URL, use the form mongodb://username:password@host:port/moefetch",
    value: "",
  },
  checkValid: (enabledBool: boolean, stringValue?: string) => {
    if (enabledBool && !stringValue) return "No Database url was provided";

    const HOSTS_REGEX =
      /(?<protocol>mongodb(?:\+srv|)):\/\/(?:(?<username>[^:]*)(?::(?<password>[^@]*))?@)?(?<hosts>(?!:)[^\/?@]+)(?<rest>.*)/;

    if (enabledBool && stringValue && !HOSTS_REGEX.test(stringValue))
      return "Database url invalid";
  },
} as IParam;
if (defaultDatabase_url.checkValid) {
  defaultDatabase_url.checkValid(true, "sex");
}

export const stockSettings: IStockSettings = {
  /* database_url: {
    containsString: true,
    checkBoxValue: false,
    checkBoxDescription: "Use a mongoDB database",
    stringValue: {
      stringPlaceholder:
        "Database URL, use the form mongodb://username:password@host:port/moefetch",
      value: "",
    },
  }, */
  blur_nsfw: {
    containsString: false,
    checkBoxValue: false,
    checkBoxDescription: "Blur NSFW tagged posts",
  },
  show_hidden: {
    containsString: false,
    checkBoxValue: false,
    checkBoxDescription: "Show hidden posts and albums",
  },
  show_nsfw: {
    containsString: false,
    checkBoxValue: false,
    checkBoxDescription: "how NSFW tagged posts",
  },
};
export interface ILogicSpecialSettingsDictionary {
  [category: string]: ILogicCategorySpecialSettingsDictionary;
}

export interface ILogicCategorySpecialSettingsDictionary {
  specialCategorySettings?: IModelSpecialParam;
  specialHostnameSpecificSettings?: {
    [hostname: string]: IModelSpecialParam;
  };
}

export interface ILogicSpecialParamsDictionary {
  [logicCategory: string]: ILogicCategorySpecialParamsDictionary;
}

export interface ILogicCategorySpecialParamsDictionary {
  specialCategoryParams?: IModelSpecialParam;
  specialHostnameSpecificParams?: {
    [hostname: string]: IModelSpecialParam;
  };
}
export interface IParam {
  containsString: boolean;
  checkBoxValue: boolean;
  checkBoxDescription: string;
  stringValue?: {
    stringPlaceholder: string;
    value: string;
  };
  errorMessage?: string;
  checkValid?: (
    enabledBool: boolean,
    stringValue?: string
  ) => string | undefined;
}
export interface IModelSpecialParam {
  [name: string]: IParam;
}

export interface IErrorObject {
  backendErrors: string;

  databaseErrors: string;

  saucenaoAPIErrors: string;
}

export interface IResponseSettings {
  database_url: IParam;
  stock_settings: ISettings["stock_settings"];
  special_settings: ISettings["special_settings"];
  special_params: ISettings["special_params"];
}

export interface ISettingsErrorObject {
  backendUrlError?: string;

  hasError: boolean;
  responseSettings: IResponseSettings;
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

export interface IHelpElement {
  image: boolean;
  content: string;
}
export interface IHelpContent {
  [index: string]: {
    clicked: boolean;
    content: IHelpElement[];
  };
}

/* export interface ITableOfContents extends IAlbum {
    id:  string;
    name: string;
    thumbnail_file: string,
}

 */
