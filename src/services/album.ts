import { api } from "./api";
import { Entry } from "./entry";
import { IAlbum, IEntry } from "./types";
import { SelectableItem } from "./selectableItem";

import { state } from "../../state";

export class Album extends SelectableItem implements IAlbum {
  public albumCoverImage: string;
  public name: string;
  public uuid: string;
  public type: string;
  public estimatedPicCount: number;
  public isHidden: boolean;

  public pictures: Entry[] = [];

  public constructor(properties: IAlbum) {
    super();
    this.albumCoverImage = properties.albumCoverImage;
    this.name = properties.name;
    this.uuid = properties.uuid;
    this.type = properties.type;
    this.estimatedPicCount = properties.estimatedPicCount;
    this.isHidden = properties.isHidden;
  }

  public getPictures(options?: {
    sortBy?: string;
    tags?: string[];
    nameIncludes?: string;
  }) {
    api
      .getEntriesInAlbum(this.uuid, {
        showNSFW: state.stateVariables.showNSFW,
        showHidden: state.stateVariables.showHidden,
        sortBy: options?.sortBy ?? "Newest First",
        tags: options?.tags,
        nameIncludes: options?.nameIncludes,
      })
      .then((pictures) => {
        this.pictures = pictures.map((pic) => new Entry(pic));
      })
      .catch(console.log);
  }

  /**
   * deleteSelectedPics
   */
  public deleteSelectedPics() {
    let picIDs:string[] = [];
    //inverted search; from last to first
    for (let index = this.pictures.length-1; index >= 0; index--) {
       if (this.pictures[index].isSelected) {
        const id = this.pictures.splice(index,1)[0].id;
        picIDs.push(id);
      }
    }

    api.deleteEntriesInAlbum(
      this.name, picIDs
    );

    state.stateVariables.isEditing = false;
  }
  /**
   * addPictures
   */
  public addPictures(pictures: IEntry[]) {
    pictures.forEach((pic) => {
      const pictureInstance = new Entry(pic);
      this.pictures.unshift(pictureInstance);
    });
  }
  /**
   * deleteSelectedPics
   */
  public handleHiding(hide: boolean) {
    api.handleHidingEntriesInAlbum(
      this.name,
      this.pictures.filter((p) => p.isSelected).map((p) => p.id),
      hide
    );
    state.stateVariables.isEditing = false;
  }
}
