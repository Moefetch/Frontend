export interface IAutoCompleteTags {
  tag: string;
  category?: string;
}



export interface IAlbum {
  albumCoverImage: string;
  name: string;
  uuid: string;
  type: string;
  estimatedPicCount: number;
  isHidden: boolean;
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
  isVideo?: boolean;
  thumbnailFile: string;
  imageSize?: ISizeCalculationResult;
}
export interface IPostIds {
  danbooru?: number;
  yande?: number;
  pixiv?: number;
}

export interface IMediaItem  {
  file: string;
  thumbnailFile?: string;
  isVideo: boolean;
  alternative_names?: string[];
  imageSize?: ISizeCalculationResult;
  index: number;
  tags?: string[];
  artists?: string[];
  isNSFW?: boolean;
  links?: IPostLinks;
  ids?: IPostIds;
  date_created?: number;
  text?: string;
}

export interface IOldMedia  {
  file: string;
  isVideo: boolean;
  thumbnailFile?: string;
  imageSize?: ISizeCalculationResult;
}

export interface IDBEntry {
  id: string;
  indexer: number;
  //name?: string;
  //hasVideo?: boolean;
  media: IMediaItem[];
  thumbnailFile: string;
  //alternative_names?: string[];
  oldMedia?: IOldMedia[];
  album: string;
  //tags_pixiv?: string[];
  //tags_danbooru?: string[];
  //artists?: string[];
  //storedResult?: string;
  //links?: IPostLinks;
  //ids?: IPostIds;
  isHidden: boolean;
  hasNSFW: boolean;
  //hasResults?: boolean;
  //pixiv_post_id?: number;

  //compatability with INewAnimePic
  //tags?: string[];
  date_added?: number;
  //date_created?: number;
  //imageSize?: ISizeCalculationResult;
}

export interface IEntry {
  id: string;
  indexer: number;
  media: IMediaItem[];
  thumbnailFile: string;
  
  album: string;
  //tags_pixiv?: string[];
  //tags_danbooru?: string[];
  //artists?: string[];
  //storedResult?: "danbooru" | "pixiv" | "yande";
  //links: IPostLinks;
  //ids: IPostIds;
  isHidden: boolean;
  hasNSFW: boolean;
  //hasResults?: boolean;
  //pixiv_post_id?: number;
  date_added?: number;

  //compatability with INewAnimePic
  //tags?: string[];
  //imageSize?: ISizeCalculationResult;
  //isMultiSource: boolean;
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
export type AlbumSchemaType = string;

export interface INewAlbum {
  name: string;
  type: AlbumSchemaType | undefined;
  album_thumbnail_file: string | File;
  isHidden: boolean;
}

export interface IMediaSubmitFormStockOverrides {
  thumbnailFile: IParam;
  compileAllLinksIntoOneEntry: IParam;
  addId: IParam;
  addTags: IParam;
  useProvidedFileName: IParam;
}

export const defaultPicFormStockOverrides: IMediaSubmitFormStockOverrides = {
  thumbnailFile: {
    checkBox: {
      checkBoxDescription: "Use different link for cover image instead",
      checkBoxValue: false,
      defaultValue: false,
    },
    type: "param",
    valueType: "both",
    textField: {
      value: "",
      defaultValue: "",
      fieldPlaceholder: "URL to the cover image",

    }
  },
  compileAllLinksIntoOneEntry: {
    checkBox: {
      checkBoxDescription: "Add all URLs into one entry",
      checkBoxValue: false,
      defaultValue: false,
    },
    type: "param",
    valueType: "both",
  },
  addId: {
    checkBox: {
      checkBoxDescription: "Add ID to entry",
      checkBoxValue: false,
      defaultValue: false,
    },
    type: "param",
    valueType: "both",
    useTextArea: true,
    textField: {
      value: "",
      defaultValue: "",
      fieldPlaceholder: "IDs seperated by new line",
    },
  },
  addTags: {
    checkBox: {
      checkBoxDescription: "Add Tags to entry",
      checkBoxValue: false,
      defaultValue: false,
    },
    type: "param",
    valueType: "both",
    useTextArea: true,
    textField: {
      value: "",
      defaultValue:"",
      fieldPlaceholder:
        "Tags for entry seperated by ',' and seperated by new line for each each entry",
    },
  },
  useProvidedFileName: {
    checkBox: {
      checkBoxDescription: "Use a specified File name instead",
      checkBoxValue: false,
      defaultValue: false,
    },
    type: "param",
    valueType: "both",
    useTextArea: true,
    textField: {
      value: "",
      defaultValue:"",
      fieldPlaceholder: "File names for each entry seperated by a new line",
    },
  },
};

export interface requestsQueueDictionary {
  [id:string]: IRequestStatus
}
export interface downloadProgressbarsQueueDictionary {
  [id:string]: number
}
export interface queueDictionary {
  requests: requestsQueueDictionary;
  downloadProgressBars: downloadProgressbarsQueueDictionary;
}


export interface IRequestStatus {
  //add something like original input/ request so that you can retry 
  id: string;
  currentIndex?: number;
  numberOfEntries?: number;
  url?: string;
  status: string;
  error?: any;
  thumbnail?: string;
  //newSubmittion: INewMediaSubmittionItem;
}

export interface INewMediaSubmittionItem {
  files?: string[];
  tempFileStore?: {
    fileName: string,
    filePreviewURL: string,
    fileBlob: File,
  }[];
  createAlbumToggle?: boolean;
  createAlbumName?: string;
  old_file?: string;
  thumbnailFile?: string;
  url: string;
  optionalOverrideParams?: IModelSpecialParam;
  stockOptionalOverrides?: IMediaSubmitFormStockOverrides;
  type?: AlbumSchemaType;
  album: string;
  isHidden?: boolean;
}

//export type PicTypes = IEntry; //probably wanted to go into a property of this but i forgot what it was about
export type StockSettingsProps =
  | "show_nsfw"
  | "blur_nsfw"
  | "show_hidden"
  | "thumbnail_list_to_left";
type IStockSettings = {
  show_nsfw: IParam;
  blur_nsfw: IParam;
  show_hidden: IParam;
  thumbnail_list_to_left: IParam;
  immidiately_apply_settings_after_import: IParam;
};

export interface ISettings {
  backend_url: string;
  database: ITypeORMDatabase;

  stock_settings: IStockSettings;
  special_settings?: IModelSpecialParam;
  special_params?: IModelSpecialParam;
  paramsTree?: IParamsTree;
}

export interface ITypeORMDatabase {
  type?: "sqlite" | "mysql" | "postgres" |"cockroachdb" | "sap" | "spanner" | "mariadb" | "better-sqlite3";
  host?: string;
  port?: number;
  useLogin?: boolean;
  database: string;
  username?: string;
  password?:string;
}

export interface IParamsTree {
  [category: string] : IModelSpecialParam;
}

export const stockSettings: IStockSettings = {
  /* database_url: {
    containsString: true,
    checkBoxValue: false,
    checkBoxDescription: "Use a mongoDB database",
    stringValue: {
      fieldPlaceholder:
        "Database URL, use the form mongodb://username:password@host:port/moefetch",
      value: "",
    },
  }, */

  thumbnail_list_to_left: {
    type: "setting",
    valueType: "checkBox",
    checkBox: {
      checkBoxValue: false,
      checkBoxDescription:
      "Have the list of thumbnails on the left or on the bottom (in the preview popup)",
      defaultValue: false
    },
  },
  blur_nsfw: {
    type: "setting",
    valueType: "checkBox",
    checkBox: {
      checkBoxValue: true,
      checkBoxDescription: "Blur NSFW tagged posts",
      defaultValue: true
    },
  },
  show_hidden: {
    type: "setting",
    valueType: "checkBox",
    checkBox: {
      checkBoxValue: false,
      checkBoxDescription: "Show hidden posts and albums",
      defaultValue: false
    },
  },
  show_nsfw: {
    type: "setting",
    valueType: "checkBox",
    checkBox: {
      checkBoxValue: true,
      checkBoxDescription: "Show NSFW tagged posts",
      defaultValue: true
    },
  },
  immidiately_apply_settings_after_import: {
    type: "setting",
    valueType: "checkBox",
    checkBox: {
      checkBoxValue: true,
      checkBoxDescription: "Immidiately apply settings after import",
      defaultValue: true
    },
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
    category?: string; //if undefined it's a global setting for all categories
    hostname?: string; //if undefined it's a category specific setting
    type: string; //cookie, setting, default parameter etc, use case would to to group settings later
    valueType: "checkBox" | "textField" | "both"
    useTextArea?: boolean;
    checkBox?: {
        checkBoxValue: boolean;
        checkBoxDescription: string;
        defaultValue: boolean;
    }
    textField?: {
        value: string;
        fieldPlaceholder: string;
        defaultValue: string;
    }
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
