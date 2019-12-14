import { Component, OnInit, Input, HostListener, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "app-ui--button",
    templateUrl: "button.component.html"
})

export class ButtonComponent implements OnInit {
    constructor() { }

    @Input()
    public icon: string;

    @Input()
    public label: string;

    @Input()
    public disabled = false;

    @Input()
    public class = "";

    @Output()
    public dispatch: EventEmitter<void> = new EventEmitter();

    ngOnInit() { }

    @HostListener("click", ["$event"])
    public handleClick(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
        this.dispatch.emit();
    }
}
