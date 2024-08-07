import { AppState } from "../../state";
import { queueDictionary } from "./types";

interface webSocketMessage {
  typeOfAction: string,
  id: string,
  content: any
}

  export class requestsWebSocketsWrapper {
    public state: AppState;
    /**
     * upsertRequest
     */
    public upsertRequest(messageJson: webSocketMessage) {
      this.state.stateVariables.queue.requests[messageJson.id] = messageJson.content;
    }
    
    /**
     * upsertDownloadProgress
     */
    public upsertDownloadProgress(messageJson: webSocketMessage) {
      this.state.stateVariables.queue.downloadProgressBars[messageJson.id] = messageJson.content;
    }
  
    private setFullQueue(queue: AppState["stateVariables"]["queue"]) {
      this.state.stateVariables.queue.requests = queue.requests;
      this.state.stateVariables.queue.downloadProgressBars = queue.downloadProgressBars;
    }
  
    public parseIncomingWebSocketMessage(message: MessageEvent<any>) {
      const messageJson: webSocketMessage = JSON.parse(message.data);
      switch (messageJson.typeOfAction) {
        case "send full queue":
          this.setFullQueue(messageJson.content);
          break;
        case "update request queue":
          this.upsertRequest(messageJson);
          break;
        case "update download progress bars dictionary":
          this.upsertDownloadProgress(messageJson)
          break;
  
        default:
          
          console.log("Warning: unparsed action of type: \n", messageJson.typeOfAction, " \nfull message: \n", messageJson);
          
          break;
      }      
    }
    
    public socket: WebSocket;
    constructor(state: AppState) {
      this.state = state;
      this.upsertRequest = this.upsertRequest.bind(this);
      this.upsertDownloadProgress = this.upsertDownloadProgress.bind(this);
      this.setFullQueue = this.setFullQueue.bind(this);
      this.parseIncomingWebSocketMessage = this.parseIncomingWebSocketMessage.bind(this);

      const url = state.stateVariables.settingsInstance.backend_url;
      this.socket = new WebSocket("ws://" + url.substring(url.indexOf("//") + 1));
      // Connection opened
      this.socket.addEventListener("open", (event) => {        
        this.socket.send(JSON.stringify({id: "", typeOfAction: "send full queue", content: {}} as webSocketMessage))
      });
      
      // Listen for messages
      this.socket.addEventListener("message", this.parseIncomingWebSocketMessage);

    }
  }


  const actions: "" | "update request queue" | "update download progress bars dictionary" = "";