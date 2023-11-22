import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from './../loader.service';
import { LoaderState } from './../loader';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  animations: [
    trigger('valueChanged', [
        transition('void => *', []),   // when the item is created
        transition('* => void', []),   // when the item is removed
        transition('* => *', [         // when the item is changed
            animate(1000, keyframes([  // animate for 1200 ms
                style ({ opacity: 0 }),
                style ({ opacity: 1 }),
            ])),
        ]),
    ])
  ]
})
export class SpinnerComponent 
  implements OnInit, OnDestroy {

  @Input() loaderType: string = "overlay-spinner";

  show = false;

  i: number = 0;

  message: string;


  private subscription: Subscription;
  constructor(
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.subscription = this.loaderService.loaderState
    .subscribe((state: LoaderState) => {
      this.show = state.show;
      this.message = state.message;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }

}
