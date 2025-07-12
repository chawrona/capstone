import generateUUID from "../utils/generateUUID.js";

export default class User {
    constructor() {
        this.uuid = generateUUID();
        this.name = 1;
    }
}
