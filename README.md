# NgxFileupload

[![npm](https://img.shields.io/npm/v/@r-hannuschka/ngx-fileupload.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/@r-hannuschka/ngx-fileupload)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/dc2f1a553c31471a95184d397bf72eb3)](https://www.codacy.com/app/r-hannuschka/ngx-fileupload?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=r-hannuschka/ngx-fileupload&amp;utm_campaign=Badge_Grade)

Angular 8+ async fileupload with progressbar

![ngx-fileupload.gif](./docs/ngx-fileupload.gif)

___

## Installation

npm

```bash
npm i --save @r-hannuschka/ngx-fileupload
```

## Demo

Watch [Demo](https://r-hannuschka.github.io/ngx-fileupload/#/) to see ngx fileupload in action, customizing views and add validations.

## Usage

```html
<ngx-fileupload [url]="'http://localhost:3000/upload'"></ngx-fileupload>
```

To get more detailed informations please check out the docs

- [Upload Component](./docs/upload-component.md)
- [Upload Directive](./docs/upload-directive.md)
- [Upload Item](./docs/upload-item.md)
- [Validation](./docs/validation.md)

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

# unit tests
ng test ngx-fileupload
```

## Roadmap

- reimplement e2e tests
- reimplement unit tests
- better state management for uploads
- add option to limit processing max uploads at once

## Credits

Special thanks for code reviews, great improvements and ideas to

||||  
|:-:|:-:|:-:|
|[![alt Konrad Mattheis](https://avatars2.githubusercontent.com/u/1100969?s=60&v=4)](https://github.com/konne)<br />Konrad Mattheis| [<img src="https://avatars3.githubusercontent.com/u/17725886?s=60&v=4" width=60 alt="Thomas Haenig" />](https://github.com/thomashaenig)<br />Thomas Haenig| [![alt Alexander Görlich](https://avatars0.githubusercontent.com/u/13659581?s=60&v=4)](https://github.com/AlexanderGoerlich)  <br />Alexander Görlich|

## Author

Ralf Hannuschka [Github](https://github.com/r-hannuschka)

## Other Modules

- [ngx-responsivemenu](https://github.com/r-hannuschka/ngx-responsivemenu)
