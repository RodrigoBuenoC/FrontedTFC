export interface UserResponse {
    message: string;
    user:    User;
    token:   string;
}

export interface User {
    name:       string;
    email:      string;
    puntos:     number;
    updated_at?: Date;
    created_at?: Date;
    id?:         number;
}
