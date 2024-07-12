export interface IDriver {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: Date;
    country: string;
    points: number;
    titles: number;
    team: null | string;
}