import { IUser } from './user'
import { IBase } from './base'

export interface ITheme<T = string> extends IBase {

    subscribers: string[];
    posts: T[];
    themeName: string;
    userId: IUser;
}