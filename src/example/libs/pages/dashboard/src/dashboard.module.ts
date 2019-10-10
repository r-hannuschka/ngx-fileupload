import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RouterModule } from "@angular/router";
import { NgxFileUploadModule } from "@r-hannuschka/ngx-fileupload";

@NgModule({
    imports: [
        NgxFileUploadModule,
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
