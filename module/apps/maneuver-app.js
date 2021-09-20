//import { Merp1eChat } from "../chat.js";
import { Merp1eStaticManeuverChatCard } from "../chat/static-maneuver-card.js";

export class Merp1eManeuverApplication extends Application {
	constructor(options) {
		super(options);
		this.rules = game.merp1e.Merp1eRules;
		this.data = { // default
			rollType: "SM",
			actors: null,
			actorID: null,
			skill: null,
			skillReference: null,
			skillID: null,
			value: null,
			conditions: [],
			actors: this.rules.getActors(),
			rollTypes: this.rules.rollTypes,
			isGM: game.user.isGM,
			mm: {
				skillID: "MM",
				skillsAll: false,
				difficulties: this.rules.skill.difficulties,
				movementModifiers: this.rules.skill.modifiers.Movement,
			},
		};
	}
	/** @override */
	get template() {
		return 'systems/merp1e/templates/apps/maneuver-app.html';
	}

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
		classes: ["merp1e", "app", "maneuver"],
		title: "Maneuver", // XXX I18
		width: 700,
		height: 600,
		tabs: [{ navSelector: ".app-tabs", contentSelector: ".app-body", initial: "SM" }]
		});
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners( html);
		html.on('change', 'input', this._onChangeInput.bind(this));
		html.on('change', 'select', this._onChangeInput.bind(this));
/*
		html.on('submit', 'form', this._onSubmit.bind(this));
		html.on('click', '.roll-characteristic', this._onRollCharacteristic.bind(this));
		html.on('click', '.increase-characteristic', this._onIncreaseCharacteristic.bind(this));
		html.on('click', '.decrease-characteristic', this._onDecreaseCharacteristic.bind(this));
		html.on('click', '.reset-characteristic', this._onResetCharacteristic.bind(this));
		
*/
		html.on('click', 'button', this._onButton.bind(this));
	}
    
	_onChangeTab(event, tabs, active) {
		super._onChangeTab(event, tabs, active);
		this.data.rollType = active;
	}

	async _onChangeInput(event){
		event.preventDefault();

		let eventName = event.target.name;
		let eventValue;
		let eventType = event.target.type;
		switch(eventType) {
			case "checkbox":
				eventValue = event.target.checked;
				break;
			case "number":
				eventValue = event.target.valueAsNumber;
				break;
			case "select-one":
			case "text":
				eventValue = event.target.value;
				break;
		}

		let newData = {}; newData[eventName] = eventValue;
		this.data = mergeObject(this.data, expandObject(newData)?.data)
		this.render(true);
	}

	get total() {
	}

	_onButton(event) {
		event.preventDefault();

		const action = event.currentTarget.dataset.action;

		let total = 0;
		for(let bonusNode of event.currentTarget.form.getElementsByClassName("mm-bonus")) {
			let value = bonusNode.valueAsNumber;
			if(isNaN(value)) value = 0;
			total += value;
		}
		/*
		let title = "Title";
		let message = `
		<div class="chat-card">
			<div class="card-title"><b>Total</b> ${total}
			</div>
			<div class="card-content">Details ...
				<input class="radio-switch" id="easy" type="radio" name="difficulty" value="easy">
				<label for="easy">easy</label>
				<input class="radio-switch" id="hard" type="radio" name="difficulty" value="medium">
				<label for="medium">medium</label>
				<input class="radio-switch" id="hard" type="radio" name="difficulty" value="hard">
				<label for="hard">hard</label>
			</div>
		</div>
		`;
		Merp1eChat.createMessage(title, message);
		*/

		/*
		const card = new Merp1eTestChatCard({ key: "value"});
		console.log(card);
		card.sendMessage();
		*/
		const card = new Merp1eStaticManeuverChatCard({ actorID: this.data.actorID, skillID: this.data.mm.skill.id });
		card.sendMessage();
	}
	/** @override */
	getData() {
		if(this.data.actorID !== null) { // lookup actor
			let actors = this.data.actors.filter((a) => a.id == this.data.actorID);
			if(actors.length > 0) {
				this.data.actor = actors[0];
			} else {
				this.data.actor = null;
			}
		} else {
			this.data.actor = null;
		}
		
		let skills = null
		if(this.data.actor === null) {
			skills = this.rules.skill.getAvaliable();
			this.data.mm.skill = null;
		} else {
			skills = this.data.actor.getSkills();
			if(this.data.mm?.skillID == "MM")
				this.data.mm.skill = this.data.actor.getSkillMovement();
			else this.data.mm.skill = this.data.actor.getOwnedItem(this.data.mm?.skillID);
		}
		this.data.sheetOrder = this.rules.skill.generateSheetOrder(skills);

		this.data.mm.difficultyValue = this.rules.skill.getModifierValue(this.data.mm.difficulties, this.data.mm?.difficultyID);
		this.data.mm.modifiers = [];
/* old modifier code
		for(let modifier of this.data.mm.movementModifiers) {
			let isEnabled;
			let isOptional;
			if("enableFunction" in modifier) {
				isEnabled = this.data.actor ? modifier.enableFunction(this.data.actor) : false;
				isOptional = false;
			} else {
				isEnabled = true;
				isOptional = modifier.optional || false;
			}
			this.data.mm.modifiers.push({
				value: modifier.value,
				label: modifier.label,
				enabled: isEnabled,
				optional: isOptional
			})
		}
*/
		return this.data;
	}

	static async create(data){ 
		return new Merp1eManeuverApplication(data).render(true);
	}
}