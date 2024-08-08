import { IUser } from "./user.interface";

export interface INew {
    id: string;
    title: string;
    date: Date;
    summary: string;
    image: File | null;
    imageUrl: string;
    text: string;
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