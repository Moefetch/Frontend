class API {

    constructor(){
    

    };

    public shit = async (shit: string) => this.backendRequest("post", "/cbt");

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

        console.log(url)
        const response = await fetch(url, options);
        const data = await response.json().catch((err) => {console.log(err); console.log(options)});

        return data;
    }
}


const api = new API();

export default api;
