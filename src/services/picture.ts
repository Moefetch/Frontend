import { api } from "./api";
import { SelectableItem } from "./selectableItem";
import { IImageDataArray, IPicture, IPostIds, IPostLinks } from "./types";

export class Picture extends SelectableItem implements IPicture {
  public id: string;
  public indexer: number;
  public imagesDataArray: IImageDataArray[];
  public thumbnailFile: string;
  public alternative_names?: string[] | undefined;
  public album: string;
  public artists?: string[] | undefined;
  public storedResult?: "danbooru" | "pixiv" | "yande" | undefined;
  public links: IPostLinks;
  public ids: IPostIds;
  public isHidden: boolean;
  public isNSFW: boolean;
  public hasResults?: boolean | undefined;
  public tags?: string[] | undefined;
  public isMultiSource: boolean;

  public constructor(parameters: IPicture) {
    super();
    this.id = parameters.id;
    this.indexer = parameters.indexer;
    this.thumbnailFile = parameters.thumbnailFile;
    this.imagesDataArray = parameters.imagesDataArray;
    this.alternative_names = parameters.alternative_names;
    this.album = parameters.album;
    this.artists = parameters.artists;
    this.storedResult = parameters.storedResult;
    this.links = parameters.links;
    this.ids = parameters.ids;
    this.isHidden = parameters.isHidden;
    this.isNSFW = parameters.isNSFW;
    this.hasResults = parameters.hasResults;
    this.tags = parameters.tags;
    this.isMultiSource = parameters.isMultiSource;
  }
  /**
   * delete
   */
  public delete() {
    api.deletePicturesInAlbum(this.album, [this.id]);
  }
}
