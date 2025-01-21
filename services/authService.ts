import { supabase } from "../utils/supabase";
import { RegisterParams, LoginParams, User } from "../models/AuthModels";

export const authService = {
    // Inscription
    register: async ({ fullName, email, password }: RegisterParams): Promise<void> => {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName }, // Stocker le nom complet dans user_metadata
            },
        });

        if (authError) {
            throw new Error(`Register failed: ${authError.message}`);
        }

        if (!authData.user) {
            throw new Error("Failed to create user in Supabase Auth.");
        }
    },

    // Connexion
    login: async ({ email, password }: LoginParams): Promise<User> => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            throw new Error(`Login failed: ${error.message}`);
        }

        if (!data.user) {
            throw new Error("User data not found in Supabase Auth.");
        }

        return {
            id: data.user.id,
            fullName: data.user.user_metadata.full_name || "", // Récupérer full_name
            email: data.user.email!,
            emailConfirmed: !!data.user.email_confirmed_at,
            createdAt: data.user.created_at!,
        };
    },

    // Récupération de l'utilisateur actuel
    getCurrentUser: async (): Promise<User | null> => {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            throw new Error(error.message);
        }

        if (!data.user) {
            return null;
        }

        return {
            id: data.user.id,
            fullName: data.user.user_metadata.full_name || "",
            email: data.user.email!,
            emailConfirmed: !!data.user.email_confirmed_at,
            createdAt: data.user.created_at!,
        };
    },

    // Déconnexion
    logout: async (): Promise<void> => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error during logout:", error.message);
            throw new Error(`Logout failed: ${error.message}`);
        }
    },
};
