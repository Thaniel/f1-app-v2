import { DocumentReference } from "firebase/firestore";
import { ITeam } from "./team.interface";

export interface IDriver {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    country: string;
    points: number;
    titles: number;
    team: DocumentReference | ITeam | null;
    image: File | null;
    imageUrl: string;
}