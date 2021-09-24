import { Merp1eApplication } from "./app.js";

export class Merp1eRollChooserApplication extends Merp1eApplication {
	constructor(options) {
		super(options);
		this.rules = game.merp1e.Merp1eRules;
		this.appData = mergeObject(this.appData, {
			rollTypes: this.rules.rollTypes,
			actors: this.rules.getActors()
		});
	}
	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
		classes: ["merp1e", "app", "rollchooser"],
		title: game.i18n.localize("MERP1E.RollChooser.Title"),
		width: 350,
		height: 200
		});
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners( html);
	}
    
	_onButton(event) {
		event.preventDefault();

		const action = event.currentTarget.dataset.action;

		game.merp1e.Merp1eRules.rollManeuver(this.appData.skill, this.appData.rollType);

		this.close();
	}

	/** @override */
	getData() {
		const data = super.getData();
		data.actor = data.actors.find((a)=>a.id == data?.actorID); // game.actors.get(actorID); // data.actors.find((a)=>a.id == actorID);
		if(data.actor) {
			data.skills = data.actor.getAvaliableSkills();
		} else {
			data.skills = this.rules.skill.getAvaliable();
		}
		data.sheetOrder = this.rules.skill.generateSheetOrder(data.skills);

		data.skill = data.actor.getSkillByID(data?.skillID);

		data.rollType ??= data.skill?.data?.data?.rollType;

		return data;
	}

	static async create(data, options = {}){ 
		options.data = data;
		return new this(options).render(true);
	}
}