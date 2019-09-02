# NgxFileupload Validation

## NgxFileupload >= 2.0.0

This is just a pre validation a file could uploaded or not, for real validation u should allways validate serverside. If no Validators are submitted all Files could uploaded to server. We dont serve pre defined validators yet, since we dont know which validators you will need.

### implement

use __fileupload component__ which is just a wrapper arround the file upload and provides a build in view for fileupload:

```html
<ngx-fileupload [url]="url" [validator]="validator"></ngx-fileupload>
```

or use __fileupload directive__ if u want to use a customized view

```html
<div [ngxFileUpload]="url" [validator]="validator" >
```

and then in the __app.component.ts__

```ts
import { Component, OnInit } from "@angular/core";
import { Validator } from "@r-hannuschka/ngx-fileupload";
import { ZipFileValidator } from "./validators/zip-file.validator";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

    public validator: Validator;

    public ngOnInit() {
        // add a validator
        this.validator = new ZipFileValidator();
    }
}
```

Any file will added to upload queue he will pre validate if we handle a zip file. If this is not the case the Upload will marked as invalid and will not uploaded.

### Validators

All Validators have to implement Validator Interface, and implement a method validate which resolves 1 parameter the uploaded file and returns __NULL__ if valid or [ValidationErrors](https://angular.io/api/forms/ValidationErrors) if not.
We have created a own interface for that which is pretty much the same as this from __@angular/forms__ but we dont want load a module only for a type.

```ts
import { Validator, ValidationErrors } from "@r-hannuschka/ngx-fileupload";

export class MaxUploadSizeValidator implements Validator {

    public validate(file: File): ValidationErrors | null {
        const valid = (file.size / (1024 * 1024)) < 1;
        return !valid ? { maxFileSizeValidator: "max file size 1MByte" } : null;
    }
}
```

---

### Validation Groups

Since version 2.0 validation could be grouped and combined together via [Compositor Design Pattern](https://en.wikipedia.org/wiki/Composite_pattern) . So you can create single validators or a validation group and put them together like you want. All Validation Errors inside a group will merged together if validation fails.

To create Group import __Validation Builder__

```ts
import { Validator, ValidationBuilder } from "@r-hannuschka/ngx-fileupload";

class MyUploadComponent implements OnInit {

    public ngOnInit() {
        // create or group at least one validator have to validate
        const orGroup  = ValidationBuilder.or(Validator1, Validator2);

        // create and group all validators have to validate
        const andGroup = ValidationBuilder.and(Validator3, Validator4);
    }
}
```

You can also add groups to other groups

```ts
import { Validator, ValidationBuilder } from "@r-hannuschka/ngx-fileupload";

class MyUploadComponent implements OnInit {

    ...

    public ngOnInit() {
        // Validator1 OR Validator2 has to validated so whole group will be valid
        const innerOrGroup  = ValidationBuilder.or(Validator1, Validator2);

        // only validtes if innerOrGroup AND Validator3 validate
        const fullValidator = ValidationBuilder.and(innerOrGroup, Validator3);
    }

    ...
}
```

---

### OR Validation Group

Assume we want allow Image and Zip files to upload for this we have to create a validation group which validates with OR Operator, since a Image could not be a zip file and a zip file could not be a image.

```ts
import { Component, OnInit } from "@angular/core";
import { Validator, ValidationBuilder } from "@r-hannuschka/ngx-fileupload";
import { ZipFileValidator } from "./validators/zip-file.validator";
import { ImageFileValidator } from "./validators/image-file.validator";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

    public validator: Validator;

    public ngOnInit() {
        const fileTypeValidator = ValidationBuilder.or([
            new ZipFileValidator(),
            new ImageFileValidator()
        ]);

        // apply validation group
        this.validator = fileTypeValidator;
    }
}
```

---

### AND Validation Group

As Opposite u can take the AND Operator which validates only if all Validators inside this group validate.

You can compose Validators and Groups together, a Validation Group can contain other Validation Groups. So we could create a group which validates for a zip OR image file and if this group validates it will combined together with an max size validator. If both validates then the file could uploaded.

So for this example we want to allow Image and Zip Files (OR) but both should not greater than 1MByte in size.

```ts
import { Component, OnInit } from "@angular/core";
import { Validator, ValidationBuilder } from "@r-hannuschka/ngx-fileupload";
import { ZipFileValidator } from "./validators/zip-file.validator";
import { ImageFileValidator } from "./validators/image-file.validator";
import { MaxSizeValidator } from "./validators/max-size.validator";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

    public validator: Validator;

    public ngOnInit() {

        /**
         * zip file OR image file
         */
        const fileTypeValidators = ValidationBuilder.or([
            new ZipFileValidator(),
            new ImageFileValidator()
        ]);

        /** max size validator */
        const maxSizeValidator = new MaxSizeValidator();

        /** bring it together */
        this.validator = ValidationBuilder.and([
            fileTypeValidators,
            maxSizeValidator
        ]);
    }
}
```

---

## NgxFileupload 1.0.x

validators/max-size.validator.ts

```ts
import {
    NgxFileUploadValidation,
    ValidationResult
} from "@r-hannuschka/ngx-fileupload";

export class MaxUploadSizeValidator implements NgxFileUploadValidator {

    /**
     * validate max upload size to 1MB
     */
    public validate(file: File): ValidationResult {
        const valid = (file.size / (1024 * 1024)) < 1;
        const error = !valid ? "Max file size 1MByte" : "";
        return { valid, error };
    }
}
```

app-upload.module.ts

We create a own module for validation to keep main module clean, you can add as many validators you want if needed. If no Validators are passed all files will uploaded to server.

```ts
import { NgModule } from "@angular/core";
import {
    NgxFileUploadModule,
    NGX_FILEUPLOAD_VALIDATOR
} from "@r-hannuschka/ngx-fileupload";
import { MaxUploadSizeValidator } from "./validators/max-size.validator";

@NgModule({
    exports: [ NgxFileUploadModule ],
    imports: [ NgxFileUploadModule ],
    providers: [{
        provide: NGX_FILEUPLOAD_VALIDATOR,
        useClass: MaxUploadSizeValidator,
        multi: true
    }, {
        provide: NGX_FILEUPLOAD_VALIDATOR,
        useClass: SomeOtherValidator,
        multi: true
    }],
})
export class AppUploadModule { }
```

app.module.ts

simply import AppUploadModule into main module

```ts
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { AppUploadModule } from "./app-upload.module";

@NgModule( {
    declarations: [
        AppComponent
    ],
    imports: [
        AppUploadModule,
        BrowserModule
    ],
    bootstrap: [AppComponent],
} )
export class AppModule { }
```
