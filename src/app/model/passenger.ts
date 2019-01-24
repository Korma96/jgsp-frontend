import { UserFrontend } from './user-frontend';

export interface Passenger extends UserFrontend {
    firstName: String;
    lastName: String;
    email: String;
    passengerType: String;

}

