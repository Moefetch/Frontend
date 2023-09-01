import { Album } from "./src/services/album";
import { api } from "./src/services/api";
import { reactive, ref } from "vue";
import { IFilterObj } from "./src/services/types";
import { stockSettings, defaultDatabase_url } from "./src/services/types";
import { Settings } from "./src/services/settings";

const defaultSettings = new Settings({
  backend_url: "http://127.0.0.1:2234/",
  database_url: defaultDatabase_url,
  stock_settings: stockSettings,
  special_settings: undefined,
  special_params: undefined,
});

export class AppState {
  public stateVariables = reactive({
    isEditing: false,
    albums: {} as Record<string, Album>,
    popup: "",
    selectedEntriesIndexes: new Set<number>(),
    advancedSearch: false,
    advancedSearchOptions: {} as IFilterObj,
    showNSFW: true,
    showHidden: true,
    settingsInstance: api.settings,
  });
  /**
   * saveSettings
   */
  public saveSettings() {
    localStorage.setItem('settings', JSON.stringify(this.stateVariables.settingsInstance))
  }
  /**
   * useDefaultSettings
   */
  public useDefaultSettings() {
    localStorage.setItem('settings', JSON.stringify(defaultSettings))
  }
  
  /**
   * deleteSelectedEntries
   */
  public deleteSelectedEntries() {}

  /**
   * clearAdvancedSearchOptions
   */
  public clearAdvancedSearchOptions() {
    this.stateVariables.advancedSearchOptions = {
      showHidden: this.stateVariables.showHidden,
      showNSFW: this.stateVariables.showNSFW,
    };
  }

  public execute(functionToExecute: Function, idsArray: string[]) {
    this.stateVariables.selectedEntriesIndexes.forEach((index) => {
      functionToExecute(idsArray[index]);
    });
  }

  public async setResTable() {
    api
      .getTableOfContents()
      .then((tablesContentRes) => {
        tablesContentRes.forEach((album) => {
          this.stateVariables.albums[album.uuid] = new Album(album);
        });
      })
      .catch(console.log);
  }

  /**
   * getSettingsFromLocalStorage
   */
  public getSettingsFromLocalStorage() {
    const settings = api.getSettings();
    if (settings) {
      this.stateVariables.showHidden =
        !!settings.stock_settings.show_hidden.checkBox?.checkBoxValue;
      this.stateVariables.showNSFW =
        !!settings.stock_settings.show_nsfw.checkBox?.checkBoxValue;
    }
  }

  /**
   * deleteSelectedAlbums
   */
  public deleteSelectedAlbums() {
    const ids = this.getSelectedAlbums().map((album) => album.uuid);
    api.deleteAlbumsByUUIDS(ids);
    state.stateVariables.isEditing = false;
  }

  /**
   * handleHidingAlbumsByUUIDS
   */
  public handleHidingAlbumsByUUIDS(hide: boolean) {
    const ids = this.getSelectedAlbums().map((album) => album.uuid);
    api.handleHidingAlbumsByUUIDS(ids, hide);
    state.stateVariables.isEditing = false;
  }
  /**
   * getSelectedAlbums
   */
  public getSelectedAlbums() {
    return Object.values(this.stateVariables.albums).filter(
      (album) => album.isSelected
    );
  }

  public constructor() {
    this.setResTable();
    this.getSettingsFromLocalStorage();
  }
}

export const state = new AppState();
