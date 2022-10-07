export class SelectableItem {
    public isSelected: boolean = false
    
    constructor() {
        
    }
   /**
    * selectItem
    */
   public select() {
    this.isSelected = true;
   }
  /**
   * deselect
   */
  public deselect() {
    this.isSelected = false;
  }
}