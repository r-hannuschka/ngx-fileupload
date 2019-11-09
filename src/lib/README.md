# NgxFileupload

[![npm](https://img.shields.io/npm/v/@r-hannuschka/ngx-fileupload.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/@r-hannuschka/ngx-fileupload)
![](https://github.com/r-hannuschka/ngx-fileupload/workflows/ngx-fileupload/badge.svg?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/dc2f1a553c31471a95184d397bf72eb3)](https://www.codacy.com/app/r-hannuschka/ngx-fileupload?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=r-hannuschka/ngx-fileupload&amp;utm_campaign=Badge_Grade)
[![DeepScan grade](https://deepscan.io/api/teams/6017/projects/7879/branches/86957/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6017&pid=7879&bid=86957)
[![dependencies Status](https://david-dm.org/r-hannuschka/ngx-fileupload/status.svg?path=src)](https://david-dm.org/r-hannuschka/ngx-fileupload?path=src)

Angular 8+ async fileupload with progressbar

![ngx-fileupload.gif](https://raw.githubusercontent.com/r-hannuschka/ngx-fileupload/master/docs/ngx-fileupload.gif)

___

## Installation

npm

```bash
npm i --save @r-hannuschka/ngx-fileupload
```

## Demo

Watch [Demo](https://r-hannuschka.github.io/ngx-fileupload/#/) to see ngx fileupload in action, customizing views and add validations.

## Docs

See [Documentation](https://r-hannuschka.github.io/ngx-fileupload/documentation) for further details, auto generated with Compodoc

## Usage

```html
<ngx-fileupload [url]="'http://localhost:3000/upload'"></ngx-fileupload>
```

## Features 

### Version 3.0+

- **Upload Storage**

    Uploads will not longer store in ViewComponents this was a big mistake which leads to the problem that all uploads have to been stopped if the view has been left. So we deicide create a Storage which holds all Upload Requests, so it is very easy to create a new **InjectionToken** and inject your UploadStorage in any view you want. You can even leave the view and return later and see your uploads again.

- **Upload Queue**

    The Upload Queue is part of the storage and controls which upload could start and which should pending until we got a free space. So you can add 50 Files start them all but by default the queue will only allow 5 uploads on the same time, if one upload is completed, canceled or removed it will grab next from queue and starts it.

    This will only happens for Upload Requests which was started (upload all or start them one by one), so no File would uploaded if you just put them into the list.

- **Seperate View from Bussiness Logic**

    One other big change we completly seperate the view from bussiness logic, so you can allways build a complete own view just use the core classes (UploadStore, UploadQueue, UploadRequest, Validation) to create your own fileupload component.

    You dont have create a complete own view if you want to customize one view, you can allways just use the NgxFileUpload UI and customize them.

### Version 2.0+

- **Validation**

    We completly reworked the validation concept, so now validators are not Providers anymore and built in the Compositor Design Pattern. So you can create multiple validators and put them together into groups and combine multiple groups in one group.

### Version 1.0+

- **Async Uploads**

    All files will uploaded in a seperat request, so you can control them seperate (cancel, start ) and get informations about them

- **Full Customizeable**

    Even if we provide a default view you can allways create a own view, inject a custom template to ngx-fileupload or ngx-fileupload-item to bring up a complete new view for every upload request or just add ngxFileUpload Directive to any component which should be used as FileBrowser

To get more detailed informations please check out the docs

- [NgxFileUploadFactory](https://github.com/r-hannuschka/ngx-fileupload/blob/master/docs/factory.md)
- [Upload Component](https://github.com/r-hannuschka/ngx-fileupload/blob/master/docs/upload-component.md)
- [Upload Directive](https://github.com/r-hannuschka/ngx-fileupload/blob/master/docs/upload-directive.md)
- [Upload Item](https://github.com/r-hannuschka/ngx-fileupload/blob/master/docs/upload-item.md)
- [Upload Storage](https://github.com/r-hannuschka/ngx-fileupload/blob/master/docs/upload.storage.md)
- [Validation](https://github.com/r-hannuschka/ngx-fileupload/blob/master/docs/validation.md)

___

## Development

```bash
git clone https://github.com/r-hannuschka/ngx-fileupload
cd ngx-fileupload\src
npm i

# run simple express server for minimized rest api
# listen on localhost:3000
node src\server\upload-server.js

# start webpack server (angular app)
# listen on localhost:4200
npm start
```

## Tests

```bash
# end to end tests
npm run e2e
```

## Roadmap

- ~~reimplement e2e tests~~
- reimplement unit tests
- ~~better state management for uploads~~
- ~~add option to limit processing max uploads at once~~

## Credits

All icon fonts was created with [IconMoon App](https://icomoon.io/app/#/select)

Special thanks for code reviews, great improvements and ideas to

||||  
|:-:|:-:|:-:|
|[![alt Konrad Mattheis](https://avatars2.githubusercontent.com/u/1100969?s=60&v=4)](https://github.com/konne)<br />Konrad Mattheis| [<img src="https://avatars3.githubusercontent.com/u/17725886?s=60&v=4" width=60 alt="Thomas Haenig" />](https://github.com/thomashaenig)<br />Thomas Haenig| [![alt Alexander Görlich](https://avatars0.githubusercontent.com/u/13659581?s=60&v=4)](https://github.com/AlexanderGoerlich)  <br />Alexander Görlich|

## Author

Ralf Hannuschka [Github](https://github.com/r-hannuschka)

## Other Modules

- [ngx-responsivemenu](https://github.com/r-hannuschka/ngx-responsivemenu)

