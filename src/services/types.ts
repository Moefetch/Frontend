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
  isVideo?: boolean;
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
  hasVideo?: boolean;
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

export interface INewPic {
  file?: string;
  old_file?: string;
  thumbnail_file?: string;
  url: string;
  optionalOverrideParams?: IModelSpecialParam;
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
  special_settings?: IModelSpecialParam;
  special_params?: IModelSpecialParam;
}

export const defaultDatabase_url = {
  checkBox: {
    checkBoxValue: false,
    checkBoxDescription: "Use a mongoDB database",
    defaultValue: false
  },
  textField: {
    value: "",
    defaultValue: "",
    fieldPlaceholder: "Database URL, use the form mongodb://username:password@host:port/moefetch",
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
      checkBoxValue: false,
      checkBoxDescription: "Blur NSFW tagged posts",
      defaultValue: false
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
      checkBoxValue: false,
      checkBoxDescription: "Show NSFW tagged posts",
      defaultValue: false
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
