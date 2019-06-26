import { Component } from '@angular/core';
import { FileUpload } from 'lib/public-api';

@Component({
  selector: 'app-my-component',
  templateUrl: './my.component.html',
})
export class MyComponent {

    public uploads: FileUpload[] = [];

    public onUploadsAdd(uploads: FileUpload[]) {
        this.uploads.push(...uploads);
    }

    public stateChange(event) {
        console.log(event);
    }
}
