import {JwtPayload} from "jsonwebtoken";
import {UserValidationResponse} from "chums-types";
export {ValidatedUser} from 'chums-types'


export interface UserValidation extends UserValidationResponse{
    error?: Error;
}

export interface GoogleJWTToken extends JwtPayload {
    email: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
}

