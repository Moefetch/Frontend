import { IHelpElement, IHelpContent } from "./types";
const basePath = '/help_pictures'

//{image: true, content:`${basePath}/`},
//{image: false, content: ""},
export const helpContent: IHelpContent = {
    //---------------------------
    "Getting set up": {
        clicked: false,
        content: [
            {image: false, content: "To change setup options click on this icon in the top right of the header"},
            {image: true, content:`${basePath}/getting-set-up_showing-settings.png`},
            {image: false, content: "which opens this popu: p"},
            {image: true, content:`${basePath}/getting-set-up_settings-popup-full.png`},
            {image: false, content: "you can set a couple of things in here:"},
            {image: false, content: "1) the backend url is the web address of the backend whether it's locally hosted or remote, if you are hosting the backend you get the url from the terminal, for example:"},
            {image: true, content:`${basePath}/getting-set-up_settings-backend-url-example.png`},
            {image: false, content:"you copy the value from there and put it in the field, \nthe default value is 'http://127.0.0.1:2234/' which is the same as 'http://localhost:2234' ."},
            {image: false, content: "2) the mongoDB url is the web address of the mongobd databse relative to the backend if you are using one, the Moefetch backend uses an NeDB databse by default if you do not use mongodb."},
            {image: false, content: "3) this toggle decides if you want to download all the images in the pixiv post the main image is from."},
            {image: false, content: "4) use SauceNao to get integrated SauceNao functionality, get your SauceNao API key from this page after signing up https://saucenao.com/user.php?page=search-api ."},
            {image: false, content: "5) the show hidden, nsfw and blur nsfw are exactly what they say they are."},

        ]},
    //---------------------------
    "Creating albums": {
        clicked: false,
        content: [
            {image: false, content: "There are two ways to create albums:"},
            {image: false, content: "1) Is using the create album card in the Home page:"},
            {image: true, content:`${basePath}/creating-albums_album-create-card.png`},
            {image: true, content:`${basePath}/creating-albums_create-album-popup.png`},
            {image: false, content: "2) Is within the add picture popup:"},
            {image: true, content:`${basePath}/creating-albums_add-picture-popup.png`},
            {image: true, content:`${basePath}/creating-albums_add-picture-popup-field.png`},
    ]}, 
    //---------------------------
    "Adding pictures": {
        clicked: false,
        content:[
            {image: false, content: "You can add pictures using the add picture button at the top right:"},
            {image: true, content:`${basePath}/adding-pictures_add-picture-button.png`},
            {image: true, content:`${basePath}/adding-pictures_add-picture-popup.png`},
            {image: false, content: "You can give it links from the following sites"},
            {image: false, content: "Pixiv.net, danbooru.donmai.us and yande.re"},
            {image: false, content: "If you have included a sauceNao api in settings you can also insert direct image links and it will use the SauceNao api to automatically get the source, for example a dicord image link."},
    ]},
    //---------------------------
    "Editing": {
        clicked: false,
        content: [
            {image: false, content: "you can select pictures in an album to delete, hide or unhide them."},
            {image: false, content: "you can enter edit mode by clicking the edit button at the top right corner:"},
            {image: true, content:`${basePath}/editing_editing-button.png`},
            {image: true, content:`${basePath}/editing_selecting-pictures.png`},
            {image: false, content: "or by holding down click on a picture and dragging to another"},
            {image: true, content:`${basePath}/editing_selction-by-dragging-1.png`},
            {image: true, content:`${basePath}/editing_selction-by-dragging-2.png`},
            {image: false, content: "in edit mode you get an edit menu at the bottom where you can delete, hide and unhide selected images."},
            {image: true, content:`${basePath}/editing_edit-menu.png`},

    ]},
    //---------------------------
    "Searching": {
        clicked: false,
        content: [
            {image: false, content: "you can search using advanced search bar with different filters, which you can access by pressing the filter button next to the search bar:"},
            {image: true, content:`${basePath}/searching_advanced-search-button.png`},
            {image: true, content:`${basePath}/searching_advanced-search-show.png`},
            {image: false, content: "you can search by optional paramaters such as tags which have auto complete if an album is selected:"},
            {image: true, content:`${basePath}/searching_advanced-search-tags-autocomplete.png`},
    ]},/* */
    //---------------------------
    

}
