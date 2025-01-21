import { supabase } from "../utils/supabase";
import { EventModel } from "../models/EventModel";

export const eventService = {
    createEvent: async (event: Omit<EventModel, "eventid">): Promise<void> => {
        const { error } = await supabase.from("event").insert([event]);
        if (error) throw new Error(`Failed to create event: ${error.message}`);
    },

    getEvents: async (): Promise<EventModel[]> => {
        const { data, error } = await supabase.from("event").select("*");
        if (error) throw new Error(`Error fetching events: ${error.message}`);
        return data as EventModel[];
    },

    getEventById: async (eventId: string): Promise<EventModel | null> => {
        const { data, error } = await supabase
            .from("event")
            .select("*")
            .eq("eventid", eventId)
            .single();
        if (error) throw new Error(`Failed to fetch event: ${error.message}`);
        return data as EventModel | null;
    },

    updateEvent: async (eventId: string, updates: Partial<EventModel>): Promise<void> => {
        const { error } = await supabase
            .from("event")
            .update(updates)
            .eq("eventid", eventId);
        if (error) throw new Error(`Failed to update event: ${error.message}`);
    },

    deleteEvent: async (eventId: string): Promise<void> => {
        const { error } = await supabase.from("event").delete().eq("eventid", eventId);
        if (error) throw new Error(`Failed to delete event: ${error.message}`);
    },
};
