import type {ICollection, IAnimePic, INewAlbum, INewPic} from "./types";

class API {

    constructor(){
    

    };

    public getTableOfContents = async () => this.backendRequest<[ICollection]>("get", "/albums");

    public getModelTypes = async () => this.backendRequest<[string]>("get", "/types-of-models");

    public async addPicture(data: INewPic) {
        this.backendRequest("post", "/add-picture", data)
    }
    public async createNewAlbum(data: INewAlbum) {
        const {name, thumbnail_file, type} = data;
        
        const formData = new FormData();
        
        name && formData.append("name", name);
        type && formData.append("type", type);
        thumbnail_file && formData.append("thumbnail_file", thumbnail_file);

        
        await this.backendRequest("post", "/create-album" , formData);
        //add error handling or whatever tf idk

    };

    public getPicsInAlbum = async (album: string) => {
        return this.backendRequest<[IAnimePic]>("get", `/album/${album}`)
    }

    private async backendRequest<T>(method: string, endpoint: string, body?: object): Promise<T> {
        const url = `http://localhost:2234${endpoint}`;
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
        const data = await response.json().catch((err) => {/* console.log(err); console.log(options) */});

        return data;
    }
}


const api = new API();

export default api;
