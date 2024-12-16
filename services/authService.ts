import { supabase } from "../utils/supabase";
import { RegisterParams, LoginParams, User } from "../models/AuthModels";

export const authService = {
    register: async ({ fullName, email, password }: RegisterParams): Promise<void> => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
        });

        if (error) throw new Error(`Register failed: ${error.message}`);
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
