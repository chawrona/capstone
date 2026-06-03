export default class Craftsman {
    constructor(
        publicId,
        color,
        id,
        type = "craftsman",
        ringType = null,
        fieldId = null,
    ) {
        this.publicId = publicId;
        this.id = id;
        this.type = type;
        this.ringType = ringType;
        this.fieldId = fieldId;
        this.color = color;
    }

    setPosition(fieldId, ringType = null) {
        this.fieldId = fieldId;
        if (ringType) {
            this.ringType = ringType;
        }
    }

    getFieldId() {
        return this.fieldId;
    }

    getCraftsmanData() {
        return {
            id: this.id,
            color: this.color.hex,
            type: this.type,
        };
    }
}
