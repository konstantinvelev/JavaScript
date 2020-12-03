import { ITheme } from './theme';
import { IUser } from './user';
import { IBase} from './base';

export interface IPost extends IBase{
    likes: string[];
    text: string;
    userId: IUser;
    themeId: ITheme;
}