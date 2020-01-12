import { ContentType } from './contenttype';

export class Content{
    type: ContentType;
    data: string;
    sub: Content[];
}