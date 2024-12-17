import { supabase } from "../utils/supabase";
import { EventModel } from "../models/EventModel";

export const eventService = {
    // Créer un événement
    createEvent: async (event: Omit<EventModel, "eventId">): Promise<void> => {
        const { error } = await supabase.from("Event").insert([event]);

        if (error) throw new Error(`Failed to create event: ${error.message}`);
    },

    // Lire tous les événements
    getEvents: async (): Promise<EventModel[]> => {
        const { data, error } = await supabase.from("Event").select("*");

        if (error) {
            console.error("Error fetching events:", error.message);
            throw error;
        }
        return data as EventModel[];
    },

    // Lire un événement par ID
    getEventById: async (eventId: string): Promise<EventModel | null> => {
        const { data, error } = await supabase
            .from("Event")
            .select("*")
            .eq("eventid", eventId)
            .single();

        if (error) throw new Error(`Failed to fetch event: ${error.message}`);
        return data as EventModel | null;
    },

    // Mettre à jour un événement
    updateEvent: async (eventId: string, updates: Partial<EventModel>): Promise<void> => {
        const { error } = await supabase
            .from("Event")
            .update(updates)
            .eq("eventId", eventId);

        if (error) throw new Error(`Failed to update event: ${error.message}`);
    },

    // Supprimer un événement
    deleteEvent: async (eventId: string): Promise<void> => {
        const { error } = await supabase.from("Event").delete().eq("eventId", eventId);

        if (error) throw new Error(`Failed to delete event: ${error.message}`);
    },
};
