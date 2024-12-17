import { supabase } from "../utils/supabase";
import { RegisterParams, LoginParams, User } from "../models/AuthModels";

export const authService = {
    register: async ({ fullName, email, password }: RegisterParams): Promise<void> => {
        // 1. Créer un utilisateur dans Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
        });

        if (authError) throw new Error(`Register failed: ${authError.message}`);

        // 2. Ajouter également l'utilisateur en base de données (table User)
        const { error: dbError } = await supabase.from("User").insert([
            {
                userId: authData.user?.id, // Utiliser l'ID généré par Supabase Auth
                name: fullName,
                email,
                password: password, // Stocker un hash si nécessaire
            },
        ]);

        if (dbError) throw new Error(`Failed to save user in DB: ${dbError.message}`);
        return;
    },

    login: async ({ email, password }: LoginParams): Promise<User> => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) throw new Error(`Login failed: ${error.message}`);

        if (!data.user) throw new Error("User data not found.");

        return {
            id: data.user.id,
            fullName: data.user.user_metadata.full_name || "",
            email: data.user.email!,
            emailConfirmed: !!data.user.email_confirmed_at,
            createdAt: data.user.created_at!,
        };
    },

    getCurrentUser: async (): Promise<User | null> => {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw new Error(error.message);

        if (data.user) {
            return {
                id: data.user.id,
                fullName: data.user.user_metadata.full_name || "",
                email: data.user.email!,
                emailConfirmed: !!data.user.email_confirmed_at,
                createdAt: data.user.created_at!,
            };
        }

        return null;
    },
};
