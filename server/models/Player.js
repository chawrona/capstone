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

    getPlayerData() {
        const convert = (value) => {
            if (value instanceof Set) {
                return Array.from(value);
            }
            if (value instanceof Map) {
                return Object.fromEntries(value);
            }
            return value;
        };

        const convertedData = {};
        for (const key in this.data) {
            convertedData[key] = convert(this.data[key]);
        }

        return {
            username: this.username,
            color: this.color,
            publicId: this.publicId,
            ...convertedData,
        };
    }
}
