export interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}
