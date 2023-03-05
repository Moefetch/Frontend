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
  isMultiSource: boolean;
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

export interface IPicFormStockOverrides {
  thumbnailFile: IParam;
  compileAllLinksIntoOneEntry: IParam;
  addId: IParam;
  addTags: IParam;
  useProvidedFileName: IParam;
}

export const defaultPicFormStockOverrides: IPicFormStockOverrides = {
  thumbnailFile: {
    checkBoxDescription: "Use different link for cover image instead",
    checkBoxValue: false,
    containsString: true,
    stringValue: {
      value: "",
      stringPlaceholder: "URL to the cover image",
    },
  },
  compileAllLinksIntoOneEntry: {
    checkBoxDescription: "Add all URLs into one entry",
    checkBoxValue: false,
    containsString: false,
  },
  addId: {
    checkBoxDescription: "Add ID to entry",
    checkBoxValue: false,
    containsString: true,
    useTextArea: true,
    stringValue: {
      value: "",
      stringPlaceholder: "IDs seperated by new line",
    },
  },
  addTags: {
    checkBoxDescription: "Add Tags to entry",
    checkBoxValue: false,
    containsString: true,
    useTextArea: true,
    stringValue: {
      value: "",
      stringPlaceholder:
        "Tags for entry seperated by ',' and seperated by new line for each each entry",
    },
  },
  useProvidedFileName: {
    checkBoxDescription: "Use a specified File name instead",
    checkBoxValue: false,
    containsString: true,
    useTextArea: true,
    stringValue: {
      value: "",
      stringPlaceholder: "File names for each entry seperated by a new line",
    },
  },
};

export interface INewPic {
  file?: string;
  old_file?: string;
  thumbnail_file?: string;
  url: string;
  optionalOverrideParams?: ILogicCategorySpecialParamsDictionary;
  stockOptionalOverrides?: IPicFormStockOverrides;
  useSauceNao?: boolean;
  has_results?: boolean;
  type?: AlbumSchemaType;
  album: string;
  isHidden?: boolean;
}

export type PicTypes = IPicture; //probably wanted to go into a property of this but i forgot what it was about
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

  thumbnail_list_to_left: {
    containsString: false,
    checkBoxValue: false,
    checkBoxDescription:
      "Have the list of thumbnails on the left or on the bottom (in the preview popup)",
  },
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
  useTextArea?: boolean;
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
