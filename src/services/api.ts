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
        const { name, thumbnail_file, type } = data;

        const formData = new FormData();

        name && formData.append("name", name);
        type && formData.append("type", type);
        thumbnail_file && formData.append("thumbnail_file", thumbnail_file);


        await this.backendRequest("post", "/create-album", formData);
        //add error handling or whatever tf idk

    };



    public getPicsInAlbum = async (album: string) => {
        return this.backendRequest<[IAnimePic]>("get", `/album/${album}`)
    }

    public getTableOfContents = async () => this.backendRequest<[ICollection]>("get", "/albums");

    public getModelTypes = async () => this.backendRequest<[string]>("get", "/types-of-models");

    public connectToBackendAndDB = async (settings: ISettings) => {
        this.localStorageSettings.backend_url = settings.backend_url;
        if( this.localStorageSettings.backend_url[this.localStorageSettings.backend_url.length - 1] == "/")  this.localStorageSettings.backend_url = this.localStorageSettings.backend_url.substring(0, (this.localStorageSettings.backend_url.length - 1));
        return this.backendRequest<ISettingsErrorObject>("post", "/connection-test", settings);
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
