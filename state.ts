import {Album} from './src/services/album';
import {api} from './src/services/api';
import { reactive, ref } from "vue";
import { IFilterObj } from './src/services/types';
import { objectPick } from '@vueuse/core';

export class AppState {
    public stateVariables = reactive({
        isEditing: false,
        albums: {} as Record<string, Album>,
        popup: '',
        selectedEntriesIndexes: new Set<number>(),
        advancedSearch: false,
        advancedSearchOptions: {} as IFilterObj,
        showNSFW: true,
        showHidden: true,
        
    });

    /**
     * deleteSelectedEntries
     */
    public deleteSelectedEntries() {
        
    }

   /**
    * clearAdvancedSearchOptions
    */
   public clearAdvancedSearchOptions() {
    this.stateVariables.advancedSearchOptions = {
        showHidden: this.stateVariables.showHidden,
        showNSFW: this.stateVariables.showNSFW,
    }
   }
    
    public execute(functionToExecute: Function, idsArray: string[]) {
        this.stateVariables.selectedEntriesIndexes.forEach(index => {
        functionToExecute(idsArray[index])
      })
    }
    
    public async setResTable() {
        api.getTableOfContents().then((tablesContentRes) => {
            tablesContentRes.forEach( album => {
                this.stateVariables.albums[album.uuid] = new Album(album)   
            })
        }).catch(console.log);
        
    }

    /**
     * getSettingsFromLocalStorage
     */
    public getSettingsFromLocalStorage() {
        const settings = api.getSettings()
        if (settings) {
            this.stateVariables.showHidden = settings.show_hidden;
            this.stateVariables.showNSFW = settings.show_nsfw;
        }
    }

    /**
     * deleteSelectedAlbums
     */
    public deleteSelectedAlbums() {
        const ids = this.getSelectedAlbums().map(album => album.uuid)
        api.deleteAlbumsByUUIDS(ids);
        state.stateVariables.isEditing = false;
    }

   /**
    * handleHidingAlbumsByUUIDS
    */
   public handleHidingAlbumsByUUIDS(hide: boolean) {
    const ids = this.getSelectedAlbums().map(album => album.uuid)
    api.handleHidingAlbumsByUUIDS(ids, hide);
    state.stateVariables.isEditing = false;
   }
   /**
    * getSelectedAlbums
    */
   public getSelectedAlbums() {
    return Object.values(this.stateVariables.albums).filter(album => album.isSelected)
   }

    public constructor() {
        this.setResTable()
        this.getSettingsFromLocalStorage()
    }
}

export const state = new AppState()

