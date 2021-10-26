import { findByID } from "../util.js";
import { Merp1eItem } from "./base-item.js";

export class Merp1eEquipmentItem extends Merp1eItem {
    static type = "equipment";
    static dummy = Merp1eItem.registeredTypes.push(this);

    get netWeight() {
        if(this.parent && this.data.data.isContainer) {
            return this.parent._getWeightByLocation(this.id);
        } else {
            return 0;
        }
    }
    get itemWeight() {
        return (this.data?.data?.quantity || 1) * (this.data?.data?.unitaryWeight || 0);
    }
    get weight() {
        return this.itemWeight + this.netWeight;
    }
    get isWearable() { return this.data.data.isWearable; }

    get isWeared()  {
        return this.data.data.location == "wearing";
    }
    get location()  {
        if(!this.parent) return null;

        if(!this.isContained) return findByID(game.merp1e.Merp1eRules.mainLocations, this.data.data.location);

        const item = this.parent.getEmbeddedDocument("Item", this.data.data.location);
        if(!item) return { name: "(unknown)", contained: false };
        return { name: item.name, contained: false, item: item };
    }
    get isContained() {
        return !(["wearing", "carrying", "stored"].includes(this.data.data.location));
    }
    get isContainer() {
        return this.data?.data?.isContainer || false;
    }
    get containedItems() {
        if(!this.parent) return null;
        if(!this.isContainer) return null;

        return Object.values(this.parent.equipments).filter((eqp) => eqp.data.data.location == this.id);
    }
    get value() {
        return (this.data?.data?.quantity || 1) * (this.data?.data?.unitaryValue || 0);
    }
    async _onDelete(options, userId) {
        const containedItems = this.containedItems;
        if(containedItems && containedItems?.length > 0) {

            new Dialog({
                title: game.i18n.localize("MERP1E.Equipments.DeleteConfirmationTitle"), 
                content: game.i18n.localize("MERP1E.Equipments.DeleteConfirmationText"), 
                buttons: {
                    Yes: {
                        icon: '<i class="fa fa-check"></i>', 
                        label: game.i18n.localize("MERP1E.Yes"), 
                        callback: async dlg => {
                            const containedIDs = containedItems.reduce((acc, itm) => { acc.push(itm.id); return acc;}, []);
                            await this.parent.deleteEmbeddedDocuments("Item", containedIDs);
                        }
                    },
                    No: {
                        icon: '<i class="fas fa-times"></i>', 
                        label: game.i18n.localize("MERP1E.No"),
                        callback: async dlg => {
                            const containedUpdates = containedItems.reduce((acc, itm) => { acc.push({ _id: itm.id, data: {location: "carrying"}}); return acc;}, []);
                            await this.parent.updateEmbeddedDocuments("Item", containedUpdates);
                        }
                    }
                }, default: 'Yes'
            }).render(true)
        }
    }

}


