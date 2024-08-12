import { IUser } from "./user.interface";

export interface ITopic {
    id: string;
    title: string;
    date: Date;
    author: IUser | null;
    comments: IComment[] | null;
}

export interface IComment {
    id: string;
    author: IUser | null;
    text: string;
    date: Date;
    isEditing: boolean;
}
