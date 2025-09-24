// Dodać unikalne ID i przechowywać informację o UUID
export default class Player {
    constructor(username, color, publicId) {
        this.username = username;
        this.color = color;
        this.publicId = publicId;
        this.data = {};
    }

    setData(dataName, updateField) {
        this.data[dataName] = updateField(this.data[dataName]);
        return this.data[dataName];
    }
    getData(dataName) {
        return this.data[dataName];
    }
}
