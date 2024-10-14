import {Employee} from "./employee";

export class Presence {
  presenceId?: number;
  userId?: number;
  checkIn?: string;
  checkOut?: string;
  checkInCoordinates?: string;
  checkOutCoordinates?: string;
  checkInImages?: File[];
  checkOutImages?: File[];
  Employee?: Employee;
}
