export const HTML = `
<!-- template for each upload -->
<ng-template #uploadTemplate let-upload="data" let-ctrl="ctrl">

    <div class="row">
        <div class="col col-auto progressbar">
            <app-ui--progressbar-circle
                [circleData]="{height: 45, width: 45, radius: 20}"
                [progress]="upload.progress" >
            </app-ui--progressbar-circle>
        </div>
        <div class="col details">
            <dl>
                <dt class="label">Name</dt>
                <dd class="value text-truncate">{{upload.name}}</dd>
                <dt class="label">Size</dt>
                <dd class="value">{{upload.size | fileSize}}</dd>
            </dl>
        </div>
        <div class="col col-auto actions">

            <div class="btn-group">
                <app-ui--button (dispatch)="ctrl.start()" [label]="'Upload'" *ngIf="upload.state !== 'error'">
                    <i class="icon-left icon-upload"></i>
                </app-ui--button>

                <app-ui--button (dispatch)="ctrl.stop()" [label]="'Abort'">
                    <i class="icon-left icon-cancel-outline"></i>
                </app-ui--button>
            </div>
        </div>
    </div>
</ng-template>

<!-- upload toolbar to add and handle all uploads -->
<app-ui--upload-toolbar
    (add)="onUploadAdd($event)"
    (completed)="uploadCompleted($event)"
    [url]="'http://localhost:3000/upload'"
></app-ui--upload-toolbar>

<div class="upload-items">
    <ng-container *ngFor="let upload of uploads">
        <!-- view for one upload, pass custom template -->
        <ngx-fileupload-item [template]="uploadTemplate" [upload]="upload"></ngx-fileupload-item>
    </ng-container>
</div>
`;

export const TYPESCRIPT = `
import { Component } from "@angular/core";
import { Upload } from "@r-hannuschka/ngx-fileupload";

@Component({
    selector: "app-item-template--circle-progressbar",
    templateUrl: "circle-progressbar.component.html",
    styleUrls: ["./circle-progressbar.component.scss"]
})
export class CircleProgressbarComponent {

    public uploads: Upload[] = [];

    public onUploadAdd(uploads: Upload[]) {
        this.uploads = [...this.uploads, ...uploads];
    }

    public uploadCompleted(completed: Upload) {
        if (!completed.hasError()) {
            this.uploads = this.uploads.filter((upload) => completed !== upload);
        }
    }
}
`;

export const SCSS = `
$icomoon-font-path: "../../../../../assets/fonts" !default;

@import "variables";
@import "icons";

:host {

    ngx-fileupload-item {
        display: block;

        &:not(:last-child) {
            padding: 0 0 .5rem;
            margin: 0 0 .5rem;
            border-bottom: 1px solid #CCC;
        }
    }

    ngx-fileupload-item .errors {
        list-style-type:none;
        margin: 0;
        padding: 0;

        li {
            font-size: .8rem;
            color: #AF0606;
            display: flex;
            align-items: center;

            &:before {
                @include icon;
                content: $icon-warning;
                font-size: 1.1rem;
                margin-right: .5rem;
            }
        }
    }

    .upload-items .details {

        dl {
            display: flex;
            flex-wrap: wrap;
            font-size: .8rem;
            margin-bottom: .5rem;
        }

        dt {
            flex: 0 0 4rem;
        }

        dd {
            flex: 0 0 calc(100% - 4rem);
            margin-bottom: 0;
        }
    }

    .upload-items .progressbar {
        display: flex;
    }

    ngx-fileupload-item::ng-deep {

        .actions {

            .btn {
                font-size: .85rem;
                display: flex;
                justify-content: center;
            }

            .btn i {
                font-size: 1.2rem;
            }

            app-ui--button:not(:last-child) .btn {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }

            app-ui--button:not(:first-child) .btn {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }

        .progressbar {

            svg circle {
                stroke-width: .2rem;

                &.progress {
                    stroke-width: .25rem;
                }
            }

            svg text {
                font-size: .7rem;
                transform: translate(0, .35rem);
            }
        }
    }
}
`;
