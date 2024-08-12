# Contributing to Space

First of all, thanks for taking interest in the project!

> [!IMPORTANT]
> Please use prettier with our provided config to all your changes, failure to do so will result in your changes getting rejected. Simply run `pnpm format` to format the code with our config

## Frontend Contributions
All frontend contributions should use the provided files, and should avoid creating new ones. There are of course exceptions, but try to fit and organize your changes across the files. Heres a guide for the purpose of the frontend files:

### HTML:
- index.html is the homepage
- err.html is the 404 page, and the generic error page
- 500.html is for internal server errors in the proxy
- ~.html is for the settings page
- a.html is for the apps page
- g.html is for the games page
- &.html is for the proxy page

### CSS:
- index.css for all general and global changes
- ~.css for all settings changes
- ag.css for all apps and games changes
- &.css for all proxy related settings

### JS:
- index.js for all homepage related changes
- &.js for all proxy related changes
- ~.js for all settings related changes
- json-loader.js for all game frontend changes
- c.js for all general configs that will be applied to every page

## Backend Contributions
All backend changes should be reviewed by at least one or two team members to ensure compatibility and stability. If you create extra files for your changes without reason (adding a new proxy would be a good reason for extra files), then your changes will likely get rejected

## Adding Games and Apps
This should be a pretty straight forward process, simply add an entry to the end of the corresponding json file.

- a.json for apps
- g.json for games

Put your addition at the bottom of the list as they will automatically be alphabetically sorted on render.

The json files should follow this format:
```json
{
    "name": "game/app name",
    "url": "game/app url that will get proxied",
    "img": "/assets/imgs/{a or g for apps or games}/image.webp",
    "categories": ["all", "cat1", "cat2"]
}
```


When you add a game or app img, add the webp version to the corresponding directory: assets/imgs/a/appThatYouAdded.webp

If you want to use a link instead of a downloaded image or if you added a ton of games and dont want to bother downloading everything, converting downloads, etc., I wrote a script that does it for you. It downloads the images in the json file, converts them to webp, scales them to a lower resolution, and puts them in the right directory in `imgs`. The script is in `public/assets/imgs/download_urls.sh`

The script needs the following deps:
- jq
- wget
- imagemagick

cd into imgs, and run `chmod +x ./download_urls.sh` to give the script execution perms, then run the script like this: `/download_urls.sh ../../json/g.json ./g`
replace g.json with a if you are doing apps, and do the same for the second argument.

There is currently no windows version of the script, because I dont like batch and wrote the script after I hadnt slept for 2 days. Feel free to contribute a windows version or to contribute an updated more polished version of the script


> [!NOTE]
> The all category is required on all additions, however more descriptive ones are optional.

If you are unsure about something or want some clarification on any of these specifications, feel free to join the [discord](https://discord.gointospace.app) where a member of our team will gladly answer your questions!

<h1></h1>

### Thanks for contributing!
<h3> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- crllect</h3>
