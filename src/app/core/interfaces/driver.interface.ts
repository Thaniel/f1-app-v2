export interface IDriver {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    country: string;
    points: number;
    titles: number;
    team: null | string;
    image: File | null;
    imageUrl: string;
}