# NgxFileupload Validation

## NgxFileupload >= 2.0.0

This is just a pre validation a file could uploaded or not, for real validation u should allways validate serverside. If no Validators are submitted all Files could uploaded to server. We dont serve pre defined validators yet, since we dont know which validators you will need.

### implement

use [Fileupload Component](src/lib/ngx-fileupload/components/ngx-fileupload.component.ts) which is just a wrapper arround the file upload and provides a build in view for fileupload:

```html
<ngx-fileupload [url]="url" [validator]="validator"></ngx-fileupload>
```

or use [Fileupload Directive](../src/lib/ngx-fileupload/directives/ngx-fileuplad.ts) if we handle a customized view

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

---

### Validators

By default we dont have default validators since there are infinite possibilities how to validate a file, so you have to create your own validators.

You can create Validators in 2 ways:

1. Validation Functions for example [isImage Validator](../src/example/app/validators/image.validator.ts)

2. Validator Class which have to implement [Validator Interface](../src/lib/ngx-fileupload/validation/validation.ts) for example [Zip File Validator](../src/example/app/validators/only-zip.validator.ts)

Both have to return like Angular Validators [ValidationErrors](https://angular.io/api/forms/ValidationErrors) if upload is invalid or NULL if valid. We have just create a own Interface for ValidationErrors since we dont want include @angular/forms module just for a type.

> If you want to use default [Upload Item template](../src/lib/ngx-fileupload/components/ngx-fileupload-item.component.html) ValidationErrors should
> have following pattern
>
> ```json
> {
>    VALIDATOR_NAME: ERROR_MESSAGE
> }
> ```
>
> @example
>
> ```ts
> export function invalid(file: File): ValidationErrors | null {
>    return {
>       invalid: "This file seems to be invalid"
>    }
> }
> ```
>
> otherwise if u need to use an other ValidationErrors object u have to implement your own upload item component.

@example validation function

```ts
import {ValidationErrors} from '@r-hannuschka/ngx-fileupload';

export function customValidationFunction(file: File): ValidationErrors | null {
    /** @todo validate file informations */
}
```

@example validator class

```ts
import {Validator, ValidationErrors} from '@r-hannuschka/ngx-fileupload';

/** validation class */
export class CustomValidation implements Validator {

    public validate(file: File): ValidationErrors | null {
        /** @todo validate file informations */
    }
}
```

---

### Validation Groups

Validation groups uses multiple validators and return one combined result for validation, there exists allready 2 validation groups

1. [OrValidator](../src/lib/ngx-fileupload/validation/or.validator.ts) validates if at least one Validator has validated
2. [AndValidator](../src/lib/ngx-fileupload/validation/and.validator.ts) validates if all added Validators validate.

GroupedValidations are built in the __Compositor__ design pattern, so you can add a validation group to into another. For example max upload file size should be 1MByte and accepted file types are images and zip files.

```ts
import { Component, OnInit } from "@angular/core";
import { Validator, ValidationBuilder } from "@r-hannuschka/ngx-fileupload";
import { ZipFileValidator } from "./validators/zip-file.validator";
import { isImageFile } from "./validators/image-file.validator";
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
         * create a validator which validates if max
         * file size is below 1Mbyte AND (file type is a zip OR image file)
         */
        this.validator = ValidationBuilder.and([
            ValidationBuilder.or([
                new ZipFileValidator(),
                isImageFile
            ]),
            new MaxSizeValidator()
        ]);
    }
}
```

Create your own ValidationGroup you have to extend from [GroupedValidator](../src/lib/ngx-fileupload/validation/grouped.validator.ts) which just implements the Validator Interface.

```ts
import { GroupedValidator, ValidationErrors } from "@r-hannuschka/ngx-fileupload";

export class CustomValidationGroup extends GroupedValidator {

    public validate(file: File): ValidationErrors | null {

        let validationResult: ValidationErrors | null = {};
        for (const validator of this.validators) {
            /**
             * call helper method to execute the validator, if we handle a
             * validator class we have to call validate method else call it directly
             * since we handle a validation function
             */
            const result: ValidationErrors | null = this.execValidator(validator, file);

            if (result === null) {
                // @todo do something if the one validator validates
            } else {
                // @todo do something if validator not validate
            }
        }
        return validationResult;
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
