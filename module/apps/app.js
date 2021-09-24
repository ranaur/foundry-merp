import { stripClassName, toKebabCase } from "../util.js";

export class Merp1eApplication extends Application {
	constructor(options) {
		super(options);
		this.appData = options.data || {};
		this.isGM = game.user.isGM;
	}
	/** @override */
	get template() {
        const path = "systems/merp1e/templates/apps";
        const filename = toKebabCase(stripClassName(this, null, "Application")) + "-app.html";
        return `${path}/${filename}`;
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners( html);
		html.on('change', 'input', this._onChangeInput.bind(this));
		html.on('change', 'select', this._onChangeInput.bind(this));
		html.on('click', 'button', this._onButton.bind(this));
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
		this.appData = mergeObject(this.appData, expandObject(newData)?.data)
		this.render(true);
	}

	_onButton(event) {
	}

	/** @override */
	getData() {
		return this.appData;
	}

	static async create(options){ 
		return new this(options).render(true);
	}
}