import { Merp1eTimeStamp } from "./timestamp.js";

export class Merp1eOrigin {
    constructor(data) {
        if(!data) return null;

        this.uuid = data?.uuid;
        this.type = data?.type;
        this.name = data?.name;
        if(data?.timestamp) {
            this.timestamp = new Merp1eTimeStamp(data.timestamp)
        } else {
            this.timestamp = Merp1eTimeStamp.generateGameTimeStamp();
        }
    }

    toString() {
        if(!this?.name) return null;
        
        let name = this.name;
        let type = this.type;
        let timestampText = this.timestamp?.toString();
        if(this.uuid) {
            const originalEntity = fromUuid(this.uuid);
            name = originalEntity?.name;
            type = originalEntity?.type;
        }

        return `${type} ${name} ${timestampText}`;
    }
}