import { reactive } from "vue";
import { 
    ICollection 
    } 
from './src/services/types';

export default class AppState {
    public state = reactive({
        isEditing: false,
        collectionArray: getAlbumArrayFromLocalStorage() as ICollection[],
    });

}

function getAlbumArrayFromLocalStorage(): ICollection[] {
    const localRes = localStorage.getItem("albums");

    return localRes ? JSON.parse(localRes) as ICollection[] : [];
}

let defaultAlbumCollection: ICollection = {
    albumCoverImage: "",
    name: "Home",
    estimatedPicCount: 0,
    type: "",
    uuid: undefined,
};
