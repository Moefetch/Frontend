import util from "util";
import type {
  IAlbum,
  IEntry,
  INewAlbum,
  INewMediaSubmittionItem,
  ISettings,
  ISettingsErrorObject,
  IFilterObj,
  AlbumSchemaType,
  ILogicSpecialSettingsDictionary,
  ILogicSpecialParamsDictionary,
  IModelSpecialParam,
  IAutoCompleteTags,
  IMediaItem,
} from "./types";
import { stockSettings } from "./types";
import { Settings } from "./settings";


class API {
  public settings: Settings;
  constructor() {
    this.setBackendURL();
    this.settings = new Settings(this.localStorageSettings);
    this.getSpecialSettings().then((res) => {
      this.localStorageSettings = this.compareSpecialSettingsToDefault(
        this.localStorageSettings,
        "special_settings",
        res
      )
      this.getSpecialParamsDictionary().then((res) => {
        this.localStorageSettings = this.compareSpecialSettingsToDefault(
          this.localStorageSettings,
          "special_params",
          res
        );
        localStorage.setItem(
          "settings",
          JSON.stringify(this.localStorageSettings)
        );

        this.settings = new Settings(this.localStorageSettings);
        
        this.settings.createTree()
        

      });
    });
    
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

    this.backendUrl = this.localStorageSettings.backend_url;
  }

  public async addEntries(data: INewMediaSubmittionItem[]) {
    let filesArray: File[] = [];
    const formData = new FormData();
    data.forEach(entryFormElement => {
      entryFormElement.files = [];
      if (entryFormElement.tempFileStore?.length) {
        entryFormElement.tempFileStore.forEach((el, index) => {
          filesArray.push(el.fileBlob);
          entryFormElement.files?.push(el.fileName);
        })

        delete entryFormElement.tempFileStore;
        delete entryFormElement.createAlbumName;
        delete entryFormElement.createAlbumToggle;
      }
    })
    formData.append("entries", JSON.stringify(data));
    filesArray.forEach(file => formData.append("temp_download", file))
    
    //await this.backendRequest<void>("post", "/download-files", formData);
    return this.backendRequest<[IEntry]>("post", "/add-new-entries", formData);
  }
  private albumDataRawToFormData(data: INewAlbum){
    const { name, album_thumbnail_file, type, isHidden } = data;

    const formData = new FormData();

    name && formData.append("name", name);
    type && formData.append("type", type);
    album_thumbnail_file &&
    formData.append("album_thumbnail_file", album_thumbnail_file);
    isHidden && formData.append("isHidden", isHidden ? "1" : "");
    return formData;
  }

  /**
   * changeEntryThumbnail
   */
  public async changeEntryThumbnail(albumName: string, entryUUID: string,  newEntryThumbnailFile: string | File | undefined) {
    const formData = new FormData();
    formData.append("entryUUID", entryUUID);
    formData.append("albumName", albumName);

    newEntryThumbnailFile && formData.append("temp_download", newEntryThumbnailFile);

    return this.backendRequest<IEntry>("post", "/change-entry-thumbnail", formData);
  }

  /**
   * editEntry
   */
  public async editItem(item: IMediaItem, newItemThumbnailFile: string | File | undefined) {
    const formData = new FormData();
    formData.append("item", JSON.stringify(item));
    newItemThumbnailFile && formData.append("temp_download", newItemThumbnailFile);

    return await this.backendRequest<IMediaItem>("post", "/edit-media-item", formData);
  }
  public async editAlbum(uuid: string, data: INewAlbum, estimatedPicCount: number) {
    const formData = this.albumDataRawToFormData(data);
    uuid && formData.append("uuid", uuid);
    estimatedPicCount && formData.append("estimatedPicCount", `${estimatedPicCount}`);
    return await this.backendRequest<IAlbum>("post", "/edit-album", formData);
    //add error handling or whatever tf idk
  }

  public async createNewAlbum(data: INewAlbum) {
    const formData = this.albumDataRawToFormData(data);
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
        database: {
          type: "better-sqlite3",
          database: "database.sqlite"
        },
        stock_settings: stockSettings,
        special_settings: undefined,
        special_params: undefined,
      } as ISettings)
    );
  }

  public deleteEntriesInAlbum = (album: string, entriesIDs: string[]) =>
  {
    console.log(entriesIDs);
    
    this.backendRequest("delete", "/delete-entry-by-id", {
      album: album,
      entriesIDs: entriesIDs,
    });
  }

  public handleHidingEntriesInAlbum = (
    album: string,
    entriesIDs: string[],
    hide: boolean
  ) =>
    this.backendRequest("post", "/handle-hide-entries", {
      album: album,
      entriesIDs: entriesIDs,
      hide: hide,
    });

  public getTagsForSearchAutocomplete = (
    tagSearch: string,
    type: AlbumSchemaType
  ) =>
    this.backendRequest<{ tags: IAutoCompleteTags[] }>("post", "/autocomplete-tags", {
      tagSearch: tagSearch,
      type: type,
    });

  public getEntriesInAlbum = (album: string, options: IFilterObj) => {
    return this.backendRequest<[IEntry]>("post", `/search`, {
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
    internalSettingVar[divisionType] = defaultSpecialSettingsOrParams;
    
    return internalSettingVar
  }
  
for (const param in defaultSpecialSettingsOrParams) {
  if (Object.prototype.hasOwnProperty.call(defaultSpecialSettingsOrParams, param)) {
    const element = internalSettingVar[divisionType]
    if (element && !element[param]) element[param] = defaultSpecialSettingsOrParams[param];
    internalSettingVar[divisionType] = element;
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

  public getAlbums = () =>
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
