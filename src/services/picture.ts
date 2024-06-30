import { api } from "./api";
import { SelectableItem } from "./selectableItem";
import { IImageDataArray, IEntry, IPostIds, IPostLinks, IMediaItem, ISizeCalculationResult } from "./types";

export class Picture extends SelectableItem implements IEntry {
  public id: string;
  public indexer: number;
  public media: MediaItem[];
  public thumbnailFile: string;
  public album: string;
  public date_added?: number;  
  public isHidden: boolean;
  public hasNSFW: boolean;

  public constructor(parameters: IEntry) {
    super();
    this.id = parameters.id;
    this.indexer = parameters.indexer;
    this.thumbnailFile = parameters.thumbnailFile;
    this.media = parameters.media.map(m=> (new MediaItem(m)));
    
    this.album = parameters.album;
    
    
    
    
    this.isHidden = parameters.isHidden;
    this.hasNSFW = parameters.hasNSFW;
    
    
    
  }
  /**
   * delete
   */
  public delete() {
    api.deletePicturesInAlbum(this.album, [this.id]);
  }
}


export class MediaItem implements IMediaItem {
  public file: string;
  public thumbnailFile?: string;
  public isVideo: boolean;
  public alternative_names?: string[];
  public imageSize?: ISizeCalculationResult;
  public index: number;
  public tags?: string[];
  public artists?: string[];
  public isNSFW?: boolean;
  public links?: IPostLinks;
  public ids?: IPostIds;
  public date_created?: number;
  public text?: string;
  
  constructor(parameters: IMediaItem){
    this.file = parameters.file;
    this.thumbnailFile = parameters.thumbnailFile;
    this.isVideo = parameters.isVideo;
    this.alternative_names = parameters.alternative_names;
    this.imageSize = parameters.imageSize;
    this.index = parameters.index;
    this.tags = parameters.tags;
    this.artists = parameters.artists;
    this.isNSFW = parameters.isNSFW;
    this.links = parameters.links;
    this.ids = parameters.ids;
    this.date_created = parameters.date_created;
    this.text = parameters.text;
  }
}