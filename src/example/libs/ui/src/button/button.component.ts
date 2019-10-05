import { Component, OnInit, Input, HostListener, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "app-ui--button",
    templateUrl: "button.component.html"
})

export class ButtonComponent implements OnInit {
    constructor() { }

    @Input()
    public label: string;

    @Output()
    public dispatch: EventEmitter<void> = new EventEmitter();

    ngOnInit() { }

    @HostListener("click", ["$event"])
    private handleClick(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
        this.dispatch.emit();
    }
}
