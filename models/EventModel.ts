export type Coordinates = {
    latitude: number;
    longitude: number;
};

export type EventModel = {
    eventid: string; // Identifiant unique de l'événement (PK)
    title: string; // Titre de l'événement
    description: string; // Description de l'événement
    location: string; // Adresse ou localisation textuelle
    date: Date; // Date de l'événement
    capacity: number; // Capacité maximale de l'événement
    ticketsremaining: number; // Tickets restants
    maplocation: Coordinates; // Coordonnées géographiques de l'événement
    ticketprice: number; // Prix du billet
};
