export type ReservationModel = {
    reservationid: string; // Identifiant unique de la réservation (PK)
    userid: string; // Clé étrangère référant l'utilisateur dans `auth.users` (FK)
    eventid: string; // Clé étrangère référant l'événement (FK)
    tickets: number; // Nombre de billets réservés
    totalprice: number; // Prix total de la réservation
    timestamp: Date; // Date et heure de la réservation
};
