import {Album} from './src/services/album';
import {api} from './src/services/api';
import { reactive, ref } from "vue";
import { IFilterObj } from './src/services/types';

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

    public constructor() {
        this.setResTable()
        this.getSettingsFromLocalStorage()
    }
}

export const state = new AppState()

