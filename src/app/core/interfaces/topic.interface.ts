import { IComment } from "./comment.interface";
import { IUser } from "./user.interface";

export interface ITopic {
    id: string;
    title: string;
    date: Date;
    author: IUser | null;
    commentsCount: number;
    comments: IComment[] | null;
}