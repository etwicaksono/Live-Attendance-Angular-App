import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Presence} from "../../models/presence";
import {Employee} from "../../models/employee";
import {WebcamImage} from "ngx-webcam";
import {Observable, Subject} from "rxjs";
import {environment} from "../../../environment/environment";
import {GoogleMap, MapInfoWindow} from "@angular/google-maps";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {PresenceService} from "../../services/presence.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-presence-modal',
  templateUrl: './presence-modal.component.html',
  styleUrl: './presence-modal.component.css'
})
export class PresenceModalComponent implements OnInit {

  @Input() mode: 'checkin' | 'checkout' | 'view' = 'checkin';
  @Input() presence: Presence = {};
  @Input() employees: Employee[] = [];
  @Output() refreshData = new EventEmitter<void>();
  errors: { [key: string]: string } = {};
  latitude: number = -6.200000; // Default coordinate (Jakarta)
  longitude: number = 106.816666; // Default coordinate (Jakarta)
  coordinates: any = ""; // Variable for two-way binding
  public webcamImage: WebcamImage | null = null;
  public showWebcam = true;
  private trigger: Subject<void> = new Subject<void>();
  isCameraExist: boolean = true;
  allowCameraSwitch: boolean = true;
  deviceId: string = '';
  currentImage?: WebcamImage;
  checkInCoordinate: any = {};
  checkOutCoordinate: any = {};
  baseUriApi = environment.apiURl + '/';

  @ViewChild(GoogleMap, {static: false}) map: GoogleMap | any;
  @ViewChild(MapInfoWindow, {static: false}) infoWindow: MapInfoWindow | any;

  constructor(
    public activeModal: NgbActiveModal,
    private readonly presenceSvc: PresenceService,
  ) {
  }

  ngOnInit(): void {
    if (this.mode !== "view") {
      this.getCurrentLocation();
    } else {

      this.checkInCoordinate = this.splitCoordinates(this.presence.checkInCoordinates);
      this.checkOutCoordinate = this.splitCoordinates(this.presence.checkOutCoordinates);
      console.log(this.checkInCoordinate, this.checkOutCoordinate)
    }
  }


  onSubmit(): void {
    this.coordinates.replace(/"/g, '');
    if (this.mode === 'checkin') {
      if (!this.presence.checkInCoordinates) {
        this.presence.checkInCoordinates = this.coordinates;
      }
      this.presenceSvc.checkIn(this.presence).subscribe(
        () => {
          this.refreshData.emit();
          this.activeModal.close();
        },
        (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      );
    } else {
      if (!this.presence.checkOutCoordinates) {
        this.presence.checkOutCoordinates = this.coordinates;
      }
      this.presenceSvc.checkOut(this.presence).subscribe(
        () => {
          this.refreshData.emit();
          this.activeModal.close();
        },
        (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      );
    }
  }

  private handleError(error: HttpErrorResponse): void {
    if (error?.error?.errors) {
      this.errors = {};
      error.error.errors.forEach((err: any) => {
        this.errors[err.path] = err.msg;
      });
    } else {
      this.errors = {general: 'An unexpected error occurred.'};
    }
  }

  splitCoordinates(coordinates: any) {
    const coordinateObject: any = {};
    if (coordinates.coordinates) {
      const [lat, lng] = coordinates.coordinates.map(Number);
      coordinateObject.latitude = lat;
      coordinateObject.longitude = lng;
    }
    return coordinateObject;
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.latitude = event.latLng.lat();
      this.longitude = event.latLng.lng();
      this.coordinates = `${this.latitude},${this.longitude}`;
      if (this.mode === 'checkin') {
        this.presence.checkInCoordinates = this.coordinates;
      } else {
        this.presence.checkOutCoordinates = this.coordinates;
      }
    }
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.coordinates = `${this.latitude},${this.longitude}`;
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation not supported by this browser.');
    }
  }

  onFileChange(event: any, type: 'checkIn' | 'checkOut'): void {
    const files = event.target.files;
    if (type === 'checkIn') {
      this.presence.checkInImages = Array.from(files);
    } else {
      this.presence.checkOutImages = Array.from(files);
    }
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  resetPhoto(): void {
    this.webcamImage = null;
  }


  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    const file = this.dataURItoFile(webcamImage.imageAsDataUrl, this.mode === 'checkin' ? 'checkInImage.jpg' : 'checkOutImage.jpg');
    if (this.mode === 'checkin') {
      this.presence.checkInImages = [file];
    } else {
      this.presence.checkOutImages = [file];
    }
  }

  dataURItoFile(dataURI: string, fileName: string): File {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], fileName, {type: mimeString});
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
}
