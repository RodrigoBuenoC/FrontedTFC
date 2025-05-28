export interface Usuario {
    id?:                number;
    name:              string;
    email:             string;
    email_verified_at?: Date | null;
    created_at?:        Date;
    updated_at?:        Date;
    puntos:            number;
}
