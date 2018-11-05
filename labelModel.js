const spinalCore = require("spinal-core-connectorjs");

class LabelModel extends Model {
    constructor() {
        super();

        this.add_attr({
            name: "",
            type: {},
            description: "",
            x: 0,
            y: 0,
            z: 0
        });
    }
}

class LabelTypeModel extends Model {
    constructor() {
        super();

        this.add_attr({
            name: "",
            meshSize: 0,
            geometry: "",
            color: ""
        });
    }
}

spinalCore.register_models([LabelModel, LabelTypeModel]);

export {
    LabelModel,
    LabelTypeModel
}
