export interface Sesion {
    id?:             number;
    user_id:        number;
    game_id:        number;
    puntos_ganados: number;
    created_at?:     Date;
    updated_at?:     Date;
}
