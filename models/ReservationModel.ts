export type ReservationModel = {
    reservationId: string; // Identifiant unique de la réservation (PK)
    userId: string; // Clé étrangère référant l'utilisateur dans `auth.users` (FK)
    eventId: string; // Clé étrangère référant l'événement (FK)
    tickets: number; // Nombre de billets réservés
    totalPrice: number; // Prix total de la réservation
    timestamp: Date; // Date et heure de la réservation
};
