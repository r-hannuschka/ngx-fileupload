export interface ProgressbarCircle {

    /** svg height */
    height: number;

    /** svg width */
    width: number;

    /** circle radius */
    radius: number;
}

export interface MenuItem {
    label: string;
    route: string;
}

export const MainMenuItems: MenuItem[] = [
    {label: "Dashboard", route: "dashboard"},
    {label: "Customize", route: "customize"},
    {label: "Automatic NgxFileUpload", route: "auto-upload"},
    {label: "Validation", route: "validation"},
    {label: "Ngx File Drop", route: "drop-zone"},
    {label: "Ngx Dropzone", route: "ngx-dropzone"},
];
