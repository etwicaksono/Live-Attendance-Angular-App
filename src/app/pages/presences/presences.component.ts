import {Component, OnInit} from '@angular/core';
import {PresenceService, PresenceStatus} from "../../services/presence.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-presences',
  templateUrl: './presences.component.html',
  styleUrl: './presences.component.css'
})
export class PresencesComponent implements OnInit {
  presenceStatus: Observable<PresenceStatus>

  constructor(
    private readonly presenceSvc: PresenceService,
  ) {
    this.presenceStatus = this.presenceSvc.presenceStatus$
  }

  ngOnInit(): void {
    this.presenceSvc.checkStatus()
  }

  protected readonly PresenceStatus = PresenceStatus;
}
