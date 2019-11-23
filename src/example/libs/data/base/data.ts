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
    {label: "Automatic Upload", route: "auto-upload"},
    {label: "Ngx File Drop", route: "drop-zone"},
    {label: "Validation", route: "validation"},
];
