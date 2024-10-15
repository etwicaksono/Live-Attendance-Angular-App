import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  getInitials(fullName: string): string {
    if (!fullName) return '';

    // Split the full name into words
    const names = fullName.split(' ');

    // Get the first letter of each word and join them
    const initials = names.map(name => name.charAt(0).toUpperCase()).join('');

    return initials.substring(0, 2); // Return only the first two initials
  }

}
