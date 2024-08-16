import { IUser } from "./user.interface";

export interface IComment {
    id: string;
    author: IUser | null;
    text: string;
    date: Date;
    isEditing: boolean;
}
