import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RouterModule } from "@angular/router";

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: "",
            component: DashboardComponent
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
