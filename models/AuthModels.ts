export interface RegisterParams {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginParams {
    email: string;
    password: string;
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    emailConfirmed: boolean;
    createdAt: string;
}
