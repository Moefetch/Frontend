import { api } from "./api";
import { Picture } from "./picture";
import { IAlbum } from "./types";
import { state } from '../../state'

export class Album implements IAlbum {
  public albumCoverImage: string;
  public name: string;
  public uuid: string;
  public type: string;
  public estimatedPicCount: number;

  public pictures: Picture[] = []
  
  public constructor(properties: IAlbum) {
      this.albumCoverImage = properties.albumCoverImage;            
      this.name = properties.name;
      this.uuid = properties.uuid;
      this.type = properties.type;
      this.estimatedPicCount = properties.estimatedPicCount;            
  }

  public getPictures(options?: {sortBy?: string, tags?: string[], nameIncludes?: string}) {
    api.getPicsInAlbum(
      this.uuid,
      {
        showNSFW: state.stateVariables.showNSFW,
        showHidden: state.stateVariables.showHidden,
        sortBy: options?.sortBy ?? 'date_added',
        tags: options?.tags,
        nameIncludes: options?.nameIncludes,
      }
    ).then((pictures) => {
      this.pictures = pictures.map((pic)=> new Picture(pic))
    }).catch(console.log)
  }

  /**
  * deleteSelectedPics
  */
  public deleteSelectedPics() {
    api.deletePicturesInAlbum(this.name, 
      this.pictures.filter( (p, index) => p.isSelected && this.pictures.splice(index, 1)).map(p => p.id)
    )
    
    state.stateVariables.isEditing = false;
  }

  /**
  * deleteSelectedPics
  */
  public handleHiding(hide: boolean) {
    api.handleHidingPicturesInAlbum(this.name, 
      this.pictures.filter(p => p.isSelected).map(p => p.id),
      hide
    )
    state.stateVariables.isEditing = false;
  }

  
}