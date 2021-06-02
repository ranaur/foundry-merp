export class MerpSpell {
    static realms = ["Essence", "Channeling"];
    static classes = {
        "E": { name: "Elemental", description: "These spells use the force of the spell to manipulate physical elements (heat, cold, wind, light, water, earth, sound, smell, taste, touch). These elements (and not the spell) are used to either directly attack a target or to af f ect the senses of a target. Since the elements are real, no Resistance Rolls are normally allowed. Elemental attack spells and illusion spells fall into this class." },
        "F": { name: "Force", description: "These spells involve the direct manipulation of matter, energy, the elements, or living being through the use of a spell’s force. If the spell has a target capable of resisting, it must make a Resistance Roll to see if it is affected by the spell. Most base attack spells fall into this class." },
        "P": { name: "Passive", description: "These spells usually only indirectly or passively affect a target. Thus if a Resistance Roll (Gamemaster’s decision) is allowed, its purpose is only to determine if the target is aware of the spell. Many detection spells and protection spells fall into this class." },
        "U": { name: "Utility", description: "These spells only affect the caster, a willing target, or a target incapable of resistance. Thus, Resistance Rolls are usually not neccessary. A willing target who is capable of resisting may still be required to make a Resistance Roll, but it is modified by -50. Most healing spells fall into this class." },
        "I": { name: "Informational", description: "These spells involve gathering information through means that do not require any Resistance Rolls." }
    };
    static getSpellHierarchy() {
        let res = [];
        for(let [groupKey, group] of Object.entries(MerpSpellList.getAvaliableGroups())) {
            let newgroup = {};
            newgroup.reference = groupKey;
            newgroup.name = group.name;
            newgroup.realm = group.realm;
            newgroup.profession = group.profession;
            newgroup.spellLists = MerpSpellList.getAvaliableSpellLists(group);
            res.push(newgroup);
        }
        return res;
    }
};
export class MerpSpellList {
    static restrictions = {
        "realm": "Open Realm",
        "profession": "Professional List",
    }
    static groups = {
        EOL: { name: "Essence Open Lists", realm: "Essence" },
        ML: { name: "Mage Lists", profession: "Mage" }, 
        BL: { name: "Bard Lists", profession: "Bard" }, 
        COL: { name: "Channeling Open Lists", realm: "Channeling" }, 
        AL: { name: "Animist Lists", profession: "Animist" }, 
        RL: { name: "Ranger Lists", profession: "Ranger" }
    };
    static getAvaliable() {
        return game.items.filter((item) => { return item.type == "spelllist"});
    }
    static getAvaliableSpellLists(group) {
        return game.items.filter((item) => { 
            if(group.realm) {
                return item.type == "spelllist" && item.data.data.restriction == "realm" && item.data.data.realm == group.realm;
            } else { // profession
                return item.type == "spelllist" && item.data.data.restriction == "profession" && item.data.data.restrictedto == group.profession;
            }
        });
    }
    static getAvaliableGroups() {
        return this.groups;
    }
}
