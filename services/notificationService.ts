import {supabase} from "../utils/supabase";

export const notificationService = {
    createNotification: async (userId: string, message: string) => {
        const { data, error } = await supabase
            .from("notifications")
            .insert({ user_id: userId, message });

        if (error) throw new Error(error.message);

        return data;
    },

    markAsRead: async (notificationId: string) => {
        const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("notification_id", notificationId);

        if (error) throw new Error(error.message);

        return true;
    },

    getUserNotifications: async (userId: string) => {
        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", userId);

        if (error) throw new Error(error.message);

        return data;
    },
};
