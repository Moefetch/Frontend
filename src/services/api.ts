import util from "util";
import type {
  IAlbum,
  IPicture,
  INewAlbum,
  INewPic,
  ISettings,
  ISettingsErrorObject,
  IFilterObj,
  AlbumSchemaType,
  ILogicSpecialSettingsDictionary,
  ILogicSpecialParamsDictionary,
  IModelSpecialParam,
} from "./types";
import { stockSettings, defaultDatabase_url } from "./types";
import { Settings } from "./settings";
class API {
  public settings: Settings;
  constructor() {
    this.setBackendURL();

    this.getSpecialSettings().then((res) => {
      this.compareSpecialSettingsToDefault(
        this.localStorageSettings,
        "special_settings",
        res
      );
      this.getSpecialParamsDictionary().then((res) => {
        this.compareSpecialSettingsToDefault(
          this.localStorageSettings,
          "special_params",
          res
        );
        localStorage.setItem(
          "settings",
          JSON.stringify(this.localStorageSettings)
        );
      });
    });

    this.settings = new Settings(this.localStorageSettings);
    
    this.settings.createTree()
  }

  public backendUrl = "";
  /**
   * capitalize
   */
  public capitalize(input: string) {
    let output = input.substring(1)
    output = input[0].toUpperCase() + output
    return output
  }

  public localStorageSettingsJSONString = localStorage.getItem("settings"); //to see if exists

  public localStorageSettings: ISettings = this.getSettings();

  /**
   * setBackendURL
   */
  private setBackendURL() {
    if (this.localStorageSettingsJSONString) {
      this.localStorageSettings = JSON.parse(
        this.localStorageSettingsJSONString
      ) as ISettings;
      if (
        this.localStorageSettings.backend_url[
        this.localStorageSettings.backend_url.length - 1
        ] == "/"
      )
        this.localStorageSettings.backend_url =
          this.localStorageSettings.backend_url.substring(
            0,
            this.localStorageSettings.backend_url.length - 1
          );
    } else this.localStorageSettings.backend_url = "http://localhost:2234";
  }

  public addPicture(data: INewPic) {
    return this.backendRequest<[IPicture]>("post", "/add-picture", data);
  }
  public async createNewAlbum(data: INewAlbum) {
    const { name, album_thumbnail_file, type, isHidden } = data;

    const formData = new FormData();

    name && formData.append("name", name);
    type && formData.append("type", type);
    album_thumbnail_file &&
      formData.append("album_thumbnail_file", album_thumbnail_file);
    isHidden && formData.append("isHidden", isHidden ? "1" : "");

    return await this.backendRequest<IAlbum>("post", "/create-album", formData);
    //add error handling or whatever tf idk
  }

  /**
   * getBackendUrl
   */
  public getBackendUrl() {
    let backendUrl: string;
    const settings = this.getSettings();
    if (settings) {
      backendUrl = settings.backend_url;
      if (backendUrl[backendUrl.length - 1] != "/")
        backendUrl = backendUrl + "/";
    } else backendUrl = "http://127.0.0.1:2234/";

    return backendUrl;
  }

  /**
   * getSettings
   */
  public getSettings() {
    let settings: ISettings | undefined;
    const localStorageSettingsJSONString = localStorage.getItem("settings");
    if (localStorageSettingsJSONString) {
      settings = JSON.parse(localStorageSettingsJSONString);
    }
    return (
      settings ??
      ({
        backend_url: "http://127.0.0.1:2234/",
        database_url: defaultDatabase_url,

        stock_settings: stockSettings,
        special_settings: undefined,
        special_params: undefined,
      } as ISettings)
    );
  }

  public deletePicturesInAlbum = (album: string, entriesIDs: string[]) =>
    this.backendRequest("delete", "/delete-entry-by-id", {
      album: album,
      entriesIDs: entriesIDs,
    });

  public handleHidingPicturesInAlbum = (
    album: string,
    entriesIDs: string[],
    hide: boolean
  ) =>
    this.backendRequest("post", "/handle-hide-pictures", {
      album: album,
      entriesIDs: entriesIDs,
      hide: hide,
    });

  public getTagsForSearchAutocomplete = (
    tagSearch: string,
    type: AlbumSchemaType
  ) =>
    this.backendRequest<{ tags: string[] }>("post", "/autocomplete-tags", {
      tagSearch: tagSearch,
      type: type,
    });

  public getPicsInAlbum = (album: string, options: IFilterObj) => {
    return this.backendRequest<[IPicture]>("post", `/search`, {
      album: album,
      options,
    });
  };
/**
 * compareSpecialSettingsToDefault
 */
public compareSpecialSettingsToDefault(
  initialSettings: ISettings,
  divisionType: "special_settings" | "special_params",
  defaultSpecialSettingsOrParams: IModelSpecialParam
) {
  //the goal is get settings from default and if they dont exuist in settings object add (the else part is adding)

  let internalSettingVar = (JSON.parse(JSON.stringify({...initialSettings}))) as typeof initialSettings;
  if (!internalSettingVar[divisionType] || !Object.getOwnPropertyNames(internalSettingVar[divisionType]).length) {
    initialSettings[divisionType] = defaultSpecialSettingsOrParams;

    return internalSettingVar
  }
  
for (const param in defaultSpecialSettingsOrParams) {
  if (Object.prototype.hasOwnProperty.call(defaultSpecialSettingsOrParams, param)) {
    const element = internalSettingVar[divisionType]
    if (element && !element[param]) element[param] = defaultSpecialSettingsOrParams[param];
  }
}
  return internalSettingVar as typeof initialSettings
}




/* 
  public compareSpecialSettingsToDefault(
    initialSettings: ISettings,
    divisionType: "special_settings" | "special_params",
    defaultSpecialSettingsOrParams: { [key: string]: any }
  ) {
    //the flow is get settings from default and if they dont exist in settings object add (the else part is adding)

    let internalSettingVar = JSON.parse(JSON.stringify({ ...initialSettings }));
    if (initialSettings[divisionType]) {
      for (const categoryName in defaultSpecialSettingsOrParams) {
        if (!internalSettingVar[divisionType]) {
          internalSettingVar[divisionType] = defaultSpecialSettingsOrParams;
        } else if (
          Object.prototype.hasOwnProperty.call(
            defaultSpecialSettingsOrParams,
            categoryName
          ) &&
          Object.prototype.hasOwnProperty.call(
            internalSettingVar[divisionType],
            categoryName
          )
        ) {
          const categoryInDefault = defaultSpecialSettingsOrParams[categoryName];
          for (const hostOrCategorySpecific in categoryInDefault) {
            if (
              Object.prototype.hasOwnProperty.call(
                categoryInDefault,
                hostOrCategorySpecific
              ) &&
              Object.prototype.hasOwnProperty.call(
                internalSettingVar[divisionType][categoryName],
                hostOrCategorySpecific
              )
            ) {
              if (
                (internalSettingVar[divisionType][categoryName] as any)[
                hostOrCategorySpecific
                ]
              ) {
                for (const setting in categoryInDefault[hostOrCategorySpecific]) {
                  if (
                    Object.prototype.hasOwnProperty.call(
                      categoryInDefault[hostOrCategorySpecific],
                      setting
                    )
                  ) {
                    const settingObj =
                      categoryInDefault[hostOrCategorySpecific][setting];
                    (internalSettingVar[divisionType][categoryName] as any)[
                      hostOrCategorySpecific
                    ][setting] =
                      (
                        (internalSettingVar[divisionType][categoryName] as any)[
                        hostOrCategorySpecific
                        ] as any
                      )[setting] ?? settingObj;
                  }
                }
              }
            } else
              (internalSettingVar[divisionType][categoryName] as any)[
                hostOrCategorySpecific
              ] =
                defaultSpecialSettingsOrParams[categoryName][
                hostOrCategorySpecific
                ];
          }
        } else
          internalSettingVar[divisionType][categoryName] =
            defaultSpecialSettingsOrParams[categoryName];
      }
      if (!initialSettings[divisionType]) {
        initialSettings[divisionType] = internalSettingVar[divisionType];
      }

      if (
        Object.getPrototypeOf(initialSettings[divisionType]) !==
        Object.getPrototypeOf(internalSettingVar[divisionType])
      ) {
        Object.assign(initialSettings, internalSettingVar);
      }
      localStorage.setItem("settings", JSON.stringify(initialSettings));
    }

    return internalSettingVar as typeof initialSettings;
  }
 */
  public deleteAlbumsByUUIDS = (albumUUIDs: string[]) =>
    this.backendRequest("post", "/delete-albums-by-uuids", { albumUUIDs });

  public handleHidingAlbumsByUUIDS = (albumUUIDs: string[], hide: boolean) =>
    this.backendRequest("post", "/handle-hiding-albums", { albumUUIDs, hide });

  public getTableOfContents = () =>
    this.backendRequest<[IAlbum]>("get", "/albums");

  public getModelTypes = () =>
    this.backendRequest<[string]>("get", "/types-of-models");

  public getSpecialSettings = () =>
    this.backendRequest<IModelSpecialParam>(
      "get",
      "/special-settings"
    );

  public getSpecialParamsDictionary = () =>
    this.backendRequest<IModelSpecialParam>(
      "get",
      "/special-params-dictionary"
    );

  public connectToBackendAndDB = async (settings: ISettings) => {
    const oldBackendUrl = this.localStorageSettings.backend_url;
    this.localStorageSettings.backend_url = settings.backend_url;
    // if it ends with a / remove the /
    if (
      this.localStorageSettings.backend_url[
      this.localStorageSettings.backend_url.length - 1
      ] == "/"
    )
      this.localStorageSettings.backend_url =
        this.localStorageSettings.backend_url.substring(
          0,
          this.localStorageSettings.backend_url.length - 1
        );
    try {
      const req = await this.backendRequest<ISettingsErrorObject>(
        "post",
        "/connection-test",
        settings
      );
      console.log(req);

      return req;
    } catch (error) {
      this.localStorageSettings.backend_url = oldBackendUrl;
      return {
        backendUrlError: "Cannot connect to Backend, URL might be incorrect",
        hasError: true,
        responseSettings: settings,
      } as ISettingsErrorObject;
    }
  };

  private backendRequest<T>(
    method: string,
    endpoint: string,
    body?: object
  ): Promise<T> {
    const url = `${this.localStorageSettings.backend_url}${endpoint}`;
    return this.request(method, url, body);
  }

  public async request<T>(
    method: string,
    url: string,
    body?: object
  ): Promise<T> {
    // Very stupid, good job fetch API
    if (body instanceof FormData) {
      var headers = {
        Authorization: "unset",
      };
    } else {
      // @ts-ignore
      var headers = {
        "Content-Type":
          body instanceof FormData ? undefined : "application/json",
        Authorization: "unset",
      };
    }
    const options = {
      method: method.toUpperCase(),
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    };

    //console.log(url)  //was for debugging now bloat lmao
    const response = await fetch(url, options);
    const data = await response.json().catch((err) => {
      /* console.log(err); console.log(options) */
    });

    return data;
  }
}

export const api = new API();
