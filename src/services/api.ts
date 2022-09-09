import type {ICollection, IAnimePic, INewAlbum, INewPic, ISettings, ISettingsErrorObject} from "./types";

class API {

    constructor(){
    this.setBackendURL()

    };


    public backendUrl = "";
        
    public localStorageSettingsJSONString = localStorage.getItem("settings") //to see if exists

    public localStorageSettings: ISettings = {  
        backend_url: "",
        database_url: "",
        search_diff_sites: false,
        pixiv_download_first_image_only: true,
        saucenao_api_key: undefined,
    };

    /**
     * setBackendURL
     */
    private setBackendURL() {
            
        if (this.localStorageSettingsJSONString) {
            this.localStorageSettings = JSON.parse(this.localStorageSettingsJSONString) as ISettings; 
            if( this.localStorageSettings.backend_url[this.localStorageSettings.backend_url.length -1 ] == "/")  this.localStorageSettings.backend_url = this.localStorageSettings.backend_url.substring(0, (this.localStorageSettings.backend_url.length - 1));
        }
        else this.localStorageSettings.backend_url = 'http://localhost:2234';

    }
    
    public async addPicture(data: INewPic) {
        this.backendRequest("post", "/add-picture", data)
    }
    public async createNewAlbum(data: INewAlbum) {
        const { name, album_thumbnail_file, type, isHidden } = data;

        const formData = new FormData();

        name && formData.append("name", name);
        type && formData.append("type", type);
        album_thumbnail_file && formData.append("album_thumbnail_file", album_thumbnail_file);
        isHidden && formData.append("isHidden", isHidden ? '1' : '' );


        return await this.backendRequest<ICollection>("post", "/create-album", formData)
        //add error handling or whatever tf idk

    };

/**
 * getBackendUrl
 */
public getBackendUrl() {
    let backendUrl: string;
    const localStorageSettingsJSONString = localStorage.getItem("settings") ;
    if (localStorageSettingsJSONString) {
        backendUrl = JSON.parse(localStorageSettingsJSONString).backend_url;
        if (backendUrl[backendUrl.length - 1] != '/') backendUrl = backendUrl + '/'
    } else backendUrl= 'http://127.0.0.1:2234/';
    
    return backendUrl;
}

    public getPicsInAlbum = async (album: string) => {
        return this.backendRequest<[IAnimePic]>("get", `/album/${album}`)
    }

    public getTableOfContents = async () => this.backendRequest<[ICollection]>("get", "/albums");

    public getModelTypes = async () => this.backendRequest<[string]>("get", "/types-of-models");

    public connectToBackendAndDB = async (settings: ISettings) => {
        const oldBackendUrl = this.localStorageSettings.backend_url;
        this.localStorageSettings.backend_url = settings.backend_url;
        // if it ends with a / remove the /
        if( this.localStorageSettings.backend_url[this.localStorageSettings.backend_url.length - 1] == "/")
          this.localStorageSettings.backend_url = this.localStorageSettings
          .backend_url
          .substring(0, (this.localStorageSettings.backend_url.length - 1));
          try {
              const req = await this.backendRequest<ISettingsErrorObject>("post", "/connection-test", settings);
              return req;
          } catch (error) {
            this.localStorageSettings.backend_url = oldBackendUrl;
            return {
                backendUrlError: "Cannot connect to Backend, URL might be incorrect",
                databaseUrlError: "",
                saucenaoApiKeyError: "",
            } as ISettingsErrorObject
          } 
    }


    private async backendRequest<T>(method: string, endpoint: string, body?: object): Promise<T> {
        const url = `${this.localStorageSettings.backend_url}${endpoint}`;
        return this.request(method, url, body);
    }

    public async request<T>(method: string, url: string, body?: object): Promise<T> {
        // Very stupid, good job fetch API
        if (body instanceof FormData) {
            var headers = {
                Authorization: "unset",
            };

        } else {
            // @ts-ignore
            var headers = {
                "Content-Type": body instanceof FormData ? undefined : "application/json",
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
        const data = await response.json().catch((err) => {/* console.log(err); console.log(options) */ });

        return data;
    }
}


const api = new API();

export default api;
