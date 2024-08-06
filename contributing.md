# Contributing to Space

First of all, thanks for taking interest in the project!

> [!IMPORTANT]
> Please use prettier with our provided config to all your changes, failure to do so will result in your changes getting rejected. Simply run `npm run format` to format the code with our config

## Frontend Contributions
All frontend contributions should use the provided files, and should avoid creating new ones. There are of course exceptions, but try to fit and organize your changes across the files. Heres a guide for the purpose of the frontend files:
- index.css is the only css file
  - If there is a new element added, you should add a new section and comment it similarly to the other sections

- All js changes should be split into the following files:
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
    "img": "external link to game/app thumbnail",
    "categories": ["all", "cat1", "cat2"]
}
```
> [!NOTE]
> The all category is required on all additions, however more descriptive ones are optional.

If you are unsure about something or want some clarification on any of these specifications, feel free to join the [discord](https://discord.gointospace.app) where a member of our team will gladly answer your questions!

Thanks for contributing! - crllect
