import { JwtPayload } from "jsonwebtoken";
import { ValidatedUserProfile } from "chums-types";
export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    accountType: 0 | 1 | 2 | 4 | 8;
    active: 0 | 1 | boolean;
    notes: string | null;
    created: string | null;
    pwd_change_required: boolean | 1 | 0;
    logins: number;
    accounts?: UserAccount[];
    roles?: string[];
}
export interface UserAccount {
    id: number;
    userid: number;
    Company: string;
    ARDivisionNo: string;
    CustomerNo: string;
    CustomerName: string | null;
    isRepAccount: boolean | 1 | 0;
    SalespersonDivisionNo: string;
    SalespersonNo: string;
    SalespersonName: string;
    primaryAccount: boolean | 1 | 0;
    customers: number;
    shipToCustomers: number;
}
export interface UserProfile {
    user: User;
    accounts: UserAccount[];
    roles: string[];
    picture?: string | null;
}
export interface UserValidation {
    valid: boolean;
    error?: Error;
    status?: string;
    profile?: UserProfile;
}
export interface BaseJWTToken extends JwtPayload {
    aud?: string;
    iat?: number;
    exp?: number;
    iss?: string;
}
export interface UserJWTToken extends UserProfile, JwtPayload {
}
export interface GoogleJWTToken extends JwtPayload {
    email: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
}
export interface ValidatedUser {
    profile: ValidatedUserProfile;
    auth: {
        valid: boolean;
        status: 'OK' | string;
        profile: ValidatedUserProfile;
    };
}
