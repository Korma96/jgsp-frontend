import { UserFrontend } from './user-frontend';

export interface AdminForBackend extends UserFrontend {
    password: string;
}
