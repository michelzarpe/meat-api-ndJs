import { User } from './users/user.model';

// merge com a interface da lib
declare module 'restify' {
    export interface Request{
        authenticated: User
    }
}