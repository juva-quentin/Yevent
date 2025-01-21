import { supabase } from "../utils/supabase";
import {ReservationModel} from "../models/ReservationModel";

export const reservationService = {
    createReservation: async (reservation: {
        userid: string;
        eventid: string;
        tickets: number;
        totalprice: number;
        timestamp: Date;
    }): Promise<void> => {
        const { error } = await supabase.from("reservation").insert([reservation]);
        if (error) throw new Error(`Failed to create reservation: ${error.message}`);
    },

    getReservationsByUser: async (userId: string): Promise<any[]> => {
        const { data, error } = await supabase
            .from("reservation")
            .select("*")
            .eq("userid", userId);
        if (error) throw new Error(`Failed to fetch reservations: ${error.message}`);
        return data || [];
    },

    getReservationById: async (reservationId: string): Promise<ReservationModel | null> => {
        const { data, error } = await supabase
            .from("reservation")
            .select("*")
            .eq("reservationid", reservationId)
            .single();
        if (error) throw new Error(`Failed to fetch reservation: ${error.message}`);
        return data as ReservationModel | null;
    },
};
