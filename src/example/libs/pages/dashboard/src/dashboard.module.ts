import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RouterModule } from "@angular/router";
import { NgxFileUploadModule } from "projects/ngx-fileupload/public-api";
import { UiModule } from "@ngx-fileupload-example/ui";

@NgModule({
    imports: [
        NgxFileUploadModule,
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
