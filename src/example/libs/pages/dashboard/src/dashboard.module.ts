import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RouterModule } from "@angular/router";
import { NgxFileUploadUiModule } from '@ngx-file-upload/ui';
import { UiModule } from "@ngx-fileupload-example/ui";

@NgModule({
    imports: [
        NgxFileUploadUiModule,
        UiModule,
        RouterModule.forChild([
        {
            path: "",
            redirectTo: "dashboard",
            pathMatch: "full"
        },
        {
            path: "dashboard",
            component: DashboardComponent
        }
    ])],
    exports: [RouterModule],
    declarations: [DashboardComponent],
    entryComponents: [DashboardComponent],
    providers: [],
})
export class Dashboard { }
