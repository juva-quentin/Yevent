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
    id: string; // ID de l'utilisateur (provenant de auth.users.id)
    fullName: string; // Nom complet de l'utilisateur (provenant de user_metadata)
    email: string; // Email de l'utilisateur
    emailConfirmed: boolean; // Si l'email est confirmé ou non
    createdAt: string; // Date de création de l'utilisateur dans Supabase Auth
}
