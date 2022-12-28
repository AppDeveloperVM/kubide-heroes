import { Comic } from "./Comic.model";

export class Character {
    constructor(
        id : Number,
        name : string,
        description : string,
        resourceURI : string,
        thumbnail : string,
        comics : Comic, 
    ){ }
}