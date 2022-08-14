import { Merp1eCalendar } from "../calendar.js";

export class Merp1eTimeControlApplication extends Application {
	constructor(options) {
		super(options);
		this.data = {};
	}
	/** @override */
	get template() {
		return 'systems/merp1e/templates/apps/time-control-app.html';
	}

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
		classes: ["merp1e", "app", "maneuver"],
		title: "Time Control", // XXX I18
		width: 700,
		height: 600,
		tabs: [{ navSelector: ".app-tabs", contentSelector: ".app-body", initial: "time" }]
		});
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners( html);
		//html.on('change', 'input', this._onChangeInput.bind(this));
		//html.on('change', 'select', this._onChangeInput.bind(this));
        //html.find(".settings").on("change", "input", this._onChangeInput.bind(sheet));
		html.on('click', 'button', this._onButton.bind(this));
	}
    
	_onChangeTab(event, tabs, active) {
		super._onChangeTab(event, tabs, active);
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
        game.settings.set("merp1e", "calendar", this.data.calendar );
		this.render(true);
	}



	_onButton(event) {
        event.preventDefault();

        const a = event.currentTarget;

        const func = this[a.dataset.action];

        if(func) func.call(this, event);
	}

	/** @override */
	getData() {
        let sheetData = super.getData();
        sheetData.calendar = Merp1eCalendar.getCalendar();
		const now = Merp1eCalendar.world2date(game.time.worldTime);
		sheetData.time = {
			Hour: now.hour,
			Minute: now.minute,
			Second:  now.second,
			Day: now.day,
			Month: now.month,
			Year: now.year,
		}; 
		sheetData.worldTime = game.time.worldTime;
		return sheetData;
	}

	get _choosenWorldData() {
		const window = this.element[0];
		const now = Merp1eCalendar.world2date(game.time.worldTime);
		now.hour = parseInt(window.querySelector("[name='time.Hour']").value);
		now.minute = parseInt(window.querySelector("[name='time.Minute']").value);
		now.second = parseInt(window.querySelector("[name='time.Second']").value);
		now.day = parseInt(window.querySelector("[name='time.Day']").value);
		now.month = parseInt(window.querySelector("[name='time.Month']").value);
		now.year = parseInt(window.querySelector("[name='time.Year']").value);
		
		return Merp1eCalendar.date2world(now);
	}

	async save(event) {
		await game.time.advance(this._choosenWorldData - game.time.worldTime);
		await this.render(true);
	}

	async nextRound() {
		const secondPerRound = Merp1eCalendar.getCalendar().SecondsPerRound;
		const now = game.time.worldTime;
		const nR = (Math.trunc(now / secondPerRound) + 1) * secondPerRound;
		await game.time.advance(nR - game.time.worldTime);
		await this.render(true);
	}

	async nextMinute() {
		const secondsPerMinute = Merp1eCalendar.getCalendar().SecondsPerMinute;
		const now = game.time.worldTime;
		const nR = (Math.trunc(now / secondsPerMinute) + 1) * secondsPerMinute;
		await game.time.advance(nR - game.time.worldTime);
		await this.render(true);
	}

	async nextHour() {
		const calendar = Merp1eCalendar.getCalendar();
		const secondsPerHour = calendar.SecondsPerMinute * calendar.MinutesPerHour;
		const now = game.time.worldTime;
		const nR = (Math.trunc(now / secondsPerHour) + 1) * secondsPerHour;
		await game.time.advance(nR - game.time.worldTime);
		await this.render(true);
	}

	async nextMidnight(addHours = 0) {
		const calendar = Merp1eCalendar.getCalendar();
		const secondsPerDay = calendar.SecondsPerMinute * calendar.MinutesPerHour * calendar.HoursPerDay;
		const now = game.time.worldTime;
		const nR = (Math.trunc(now / secondsPerDay) + 1) * secondsPerDay + addHours * calendar.SecondsPerMinute * calendar.MinutesPerHour;
		await game.time.advance(nR - game.time.worldTime);
		await this.render(true);
	}

	async setNextHour(hour) {
		const now = Merp1eCalendar.world2date(game.time.worldTime);
		if(now.hour >= hour) {
			await this.nextMidnight(hour);
		} else {
			const window = this.element[0];
			window.querySelector("[name='time.Hour']").value = hour;
			await this.save();
		}
	}

	async nextMorning() {
		return await this.setNextHour(7); // XXX Morning at 7:00
	}

	async nextEvening() {
		return await this.setNextHour(12); // XXX Evening at 12:00
	}

	async nextAfternoon() {
		return await this.setNextHour(18); // XXX Afternoon at 18:00
	}

	async nextWeek() {
		const window = this.element[0];

		const day = window.querySelector("[name='time.Day']").value;
		window.querySelector("[name='time.Day']").value = parseInt(day) + 7;
		await this.save();
	}
	async nextMonth() {
		const window = this.element[0];

		const calendar = Merp1eCalendar.getCalendar();
		const month = window.querySelector("[name='time.Month']").value;
		window.querySelector("[name='time.Day']").value = 1;
		if(month > calendar.calendarConfig.length) { // first month of next year
			const year = window.querySelector("[name='time.Year']").value;
			window.querySelector("[name='time.Month']").value = 1;
			window.querySelector("[name='time.Year']").value = parseInt(year) + 1;
		} else { // next Month
			window.querySelector("[name='time.Month']").value = parseInt(month) + 1;
		}
	}
	async nextYear() {
		const window = this.element[0];

		const year = window.querySelector("[name='time.Year']").value;
		window.querySelector("[name='time.Day']").value = 1;
		window.querySelector("[name='time.Month']").value = 1;
		window.querySelector("[name='time.Year']").value = parseInt(year) + 1;
	}
	static async create(data){ 
		return new Merp1eTimeControlApplication(data).render(true);
	}
}
