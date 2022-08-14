class CalendarConfig extends FormApplication {
	get template() {
		return 'systems/merp1e/templates/apps/calendar-config.html';
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
		classes: ["merp1e", "app", "calendar"],
		title: game.i18n.localize("MERP1E.CalendarConfig.Name"),
		tabs: [{ navSelector: ".app-tabs", contentSelector: ".app-body", initial: "calendar" }],
		width: 700,
		height: 600
		});
	}

    activateListeners(html) {
		super.activateListeners( html);
		//html.on('change', 'input', this._onChangeInput.bind(this));
		//html.on('change', 'select', this._onChangeInput.bind(this));
        html.on('click', '.calendar-control', this._onButton.bind(this));
		html.on('click', 'button', this._onButton.bind(this));
	}

    getData() {
        let sheetData = super.getData();
        sheetData.calendarConfig = game.settings.get("merp1e", "CalendarConfig");
        sheetData.calendarConfig.forEach((mth) => mth.leapStr = mth?.leapYears?.join?.(","));
        return sheetData;
    }

    _onButton(event) {
        event.preventDefault();

        const a = event.currentTarget;

        const func = this[a.dataset.action];

        if(func) func.call(this, event);
    }

    get _calendarConfig() {
        const calendarConfig = [];
        const tableBody = this.element[0].getElementsByTagName("tbody");
        Array.from(tableBody[0].children).forEach((row) => {
            const rowData = {};
            rowData.name = row.querySelector("[name='name']").value;
            rowData.numDays = parseInt(row.querySelector("[name='numDays']").value);
            const leapStr = row.querySelector("[name='leapStr']").value;
            if(leapStr) {
                rowData.leapYears = leapStr.split(",");
                rowData.leapYears = rowData.leapYears.map(element => {
                    return element.trim();
                });
            }
            calendarConfig.push(rowData);
        });

        return calendarConfig;
    }
    save(event) {
        game.settings.set("merp1e", "CalendarConfig", this._calendarConfig);
    }
    async addMonth(event) {
        const calendarConfig = this._calendarConfig;
        calendarConfig.push({name: "", numDays: 30, leapYears: ""});
        await game.settings.set("merp1e", "CalendarConfig", calendarConfig);
        this.render(true);
    }
    async delMonth(event) {
        const calendarConfig = this._calendarConfig;
        calendarConfig.pop();
        await game.settings.set("merp1e", "CalendarConfig", calendarConfig);
        this.render(true);
    }
}

export class Merp1eCalendar {
    static ReckoningOfMerp = [
        "Yestarë", 1,
        "Narwain", 
        "Ninui", 
        "Gwaeron", 
        "Gwirith", 
        "Lothron",
        "Nórui",
        "Loénde", 1,
        "Cerveth", 
        "Úrui", 
        "Ivanneth", 
        "Narbeleth", 
        "Hithui", 
        "Girithron", 
        "Mettaré", 1
    ];

    static ReckoningOfRivendell = [
        { name: "Yestarë", numDays: 1, sindarin: "" },
        { name: "Tuilë", numDays: 54, sindarin: "Ethuil" },
        { name: "Lairë", numDays: 72, sindarin: "Laer" },
        { name: "Yávië", numDays: 54, sindarin: "Iavas" },
        { name: "Enderi", numDays: 3, leapYears: [1, 12, 144*3 ] },
        { name: "Enderi", numDays: 6, leapYears: [12, 144*3 ] },
        { name: "Quellë", numDays: 54, sindarin: "Firith" },
        { name: "Hrívë", numDays: 72, sindarin: "Rhîw" },
        { name: "Coirë", numDays: 54, sindarin: "Echuir" },
        { name: "Mettarë", numDays: 1, sindarin: "" },
    ];

    static ShireReckoning = [
        { name: "Yule", numDays: 1 },
        { name: "Afteryule", numDays: 30 },
        { name: "Solmath", numDays: 30 },
        { name: "Rethe", numDays: 30 },
        { name: "Astron", numDays: 30 },
        { name: "Thrimidge", numDays: 30 },
        { name: "Forelithe", numDays: 30 },
        { name: "Lithe", numDays: 1 },
        { name: "Mid", numDays: 1 },
        { name: "Lithe", numDays: 1 },
        { name: "Overlithe", numDays: 1, leapYears: [4, 100, 3240] },
        { name: "Afterlithe", numDays: 30 },
        { name: "Wedmath", numDays: 30 },
        { name: "Halimath", numDays: 30 },
        { name: "Winterfilth", numDays: 30 },
        { name: "Blotmath", numDays: 30 },
        { name: "Foreyule", numDays: 30 },
        { name: "Yule", numDays: 1 },
    ];

    static KingsReckoning = [ 
        { name: "yestarë", numDays: 1 },
        { name: "january", numDays: 30 },
        { name: "february", numDays: 30 },
        { name: "march", numDays: 30 },
        { name: "april", numDays: 30 },
        { name: "may", numDays: 30 },
        { name: "june", numDays: 31 },
        { name: "loëndë", numDays: 1, leapYears: [1, 4, 100] },
        { name: "enderi", numDays: 2, leapYears: [4, 100] },
        { name: "july", numDays: 31 },
        { name: "august", numDays: 30 },
        { name: "september", numDays: 30 },
        { name: "october", numDays: 30 },
        { name: "november", numDays: 30 },
        { name: "december", numDays: 30 },
        { name: "mettarë", numDays: 1 },
    ];
    static StewardsReckoning = [ 
        { name: "yestarë", numDays: 1 },
        { name: "january", numDays: 30 },
        { name: "february", numDays: 30 },
        { name: "march", numDays: 30 },
        { name: "tuilérë", numDays: 1 },
        { name: "april", numDays: 30 },
        { name: "may", numDays: 30 },
        { name: "june", numDays: 30 },
        { name: "loëndë", numDays: 1, leapYears: [1, 4, 100] },
        { name: "enderi", numDays: 2, leapYears: [4, 100] },
        { name: "july", numDays: 30 },
        { name: "august", numDays: 30 },
        { name: "september", numDays: 30 },
        { name: "yáviérë", numDays: 1 },
        { name: "october", numDays: 30 },
        { name: "november", numDays: 30 },
        { name: "december", numDays: 30 },
        { name: "mettarë", numDays: 1 },
    ];

    static daysOfWeek = [
        "Sterday",
        "Sunday",
        "Monday",
        "Trewsday",
        "Hevensday",
        "Mersday",
        "Highday",
    ];

    static ages = [
        { id: "yt", label: "MERP1E.Ages.YearsTrees", labelAbbr: "MERP1E.Ages.YearsTrees", length: 14373 },
        { id: "yl", label: "MERP1E.Ages.YearsLamps", labelAbbr: "MERP1E.Ages.YearsLamps", length: 15331.2 },
        // Years of the Sun
        { id: "1a", label: "MERP1E.Ages.FirstAge", labelAbbr: "MERP1E.Ages.FirstAge", length: 590 },
        { id: "2a", label: "MERP1E.Ages.SecondAge", labelAbbr: "MERP1E.Ages.SecondAge", length: 3441 },
        { id: "3a", label: "MERP1E.Ages.ThirdAge", labelAbbr: "MERP1E.Ages.ThirdAge", length: 3021 },
        { id: "4a", label: "MERP1E.Ages.FourthAge", labelAbbr: "MERP1E.Ages.FourthAge", length: 3021 },
        { id: "5a", label: "MERP1E.Ages.FifthAge", labelAbbr: "MERP1E.Ages.FifthAge", length: 10000 },
    ];
    static _registerCalendar(name, type, def, data = {}) {
        game.settings.register("merp1e", name, mergeObject({
            name: game.i18n.localize("MERP1E.CalendarSettings." + name),
            hint: game.i18n.localize("MERP1E.CalendarSettingsHint." + name),
            scope: "world",
            config: true,
            restricted: true,
            icon: "fas fa-calendar",
            type: type,
            default: def,         // The default value for the setting
          }, data));
    }
    static registerSettings() {
        this._registerCalendar("HoursPerDay", Number, 24);
        this._registerCalendar("MinutesPerHour", Number, 60);
        this._registerCalendar("SecondsPerMinute", Number, 60);
        this._registerCalendar("SecondsPerRound", Number, 10, { onChange: value => { CONFIG.time.roundTime = value; } } );
        CONFIG.time.roundTime = game.settings.get("merp1e", "SecondsPerRound");
        this._registerCalendar("FirstYear", Number, 1);
        this._registerCalendar("FirstYearAge", String, "4a", { choices: this.ages.reduce((acc, itm) => { acc[itm.id] = game.i18n.localize(itm.label); return acc; }, {} ) } );
        this._registerCalendar("CalendarConfig", Object, this.KingsReckoning, { config: false });
            // Permissions Control Menu
        game.settings.registerMenu("merp1e", "CalendarConfigurator", {
            name: game.i18n.localize("MERP1E.CalendarConfig.Name"),
            label: game.i18n.localize("MERP1E.CalendarConfig.Label"),
            hint: game.i18n.localize("MERP1E.CalendarConfig.Hint"),
            icon: "fas fa-user-lock",
            type: CalendarConfig,
            restricted: true
        });
  
    }

    static getCalendar() {
        const o = {};
        o.HoursPerDay = game.settings.get("merp1e", "HoursPerDay");
        o.MinutesPerHour = game.settings.get("merp1e", "MinutesPerHour");
        o.SecondsPerMinute = game.settings.get("merp1e", "SecondsPerMinute");
        o.SecondsPerRound = game.settings.get("merp1e", "SecondsPerRound");
        o.FirstYear = game.settings.get("merp1e", "FirstYear");
        o.FirstYearAge = game.settings.get("merp1e", "FirstYearAge");
        o.calendarConfig = game.settings.get("merp1e", "CalendarConfig");
        o.daysPerYear = game.settings.get("merp1e", "CalendarConfig");
        return o;
    }
    /**
     * 
     * @param {*} year => year
     * @param {*} leapYears => array of multiple years that this month has may have leap day. The odd indices (first, third, fifth ...) decides it has a leap day. The even (second, forth ...) defines it don't has. Example: February in this world [4, 100, 3240]
     * @returns 
     */
    static isLeapMonth(year, leapYears) {
        if(!leapYears) return true;
        let isLeapYear = 0;
        for(let idx = 0; idx < leapYears.length; idx++) {
            const ly = leapYears[idx];
            if((year % ly) == 0) {
                isLeapYear = (idx + 1) % 2;
            }
        }
        return isLeapYear == 1;
    }
    static daysPerYears(year, calendar) {
        return calendar.calendarConfig.reduce((acc, mth) => acc + (Merp1eCalendar.isLeapMonth(year, mth.leapYears) ? mth.numDays : 0), 0);
    } 
    static world2date(worldTime) {
        if(!Number.isNumeric(worldTime)) return null;
        const calendar = this.getCalendar(); /// XXX cache?
        const ret = {};
        let rem = worldTime;
        ret.second = rem % calendar.SecondsPerMinute; rem = Math.trunc(rem / calendar.SecondsPerMinute);
        ret.minute = rem % calendar.MinutesPerHour; rem = Math.trunc(rem / calendar.MinutesPerHour);
        ret.hour = rem % calendar.HoursPerDay; rem = Math.trunc(rem / calendar.HoursPerDay);
        ret.daysSinceEpoch = rem;
        
        for(let y = calendar.FirstYear; rem >= 0; y++) {
            const daysThisYear = this.daysPerYears(y, calendar);
            if(rem > daysThisYear) {
                rem -= daysThisYear;
            } else {
                ret.year = y;
                for(let m = 0; m < calendar.calendarConfig.length; m++) {
                    const monthInfo = calendar.calendarConfig[m];
                    
                    if(!this.isLeapMonth(y, monthInfo.leapYears)) continue;

                    const dayThisMonth = monthInfo.numDays;
                    if(rem >= dayThisMonth) {
                        rem -= dayThisMonth;
                    } else {
                        ret.month = m + 1;
                        ret.monthName = monthInfo.name;
                        ret.day = rem + 1;
                        rem = -1; // end year loop
                        break; // end month
                    }
                }
            }
        }
        let th;
        switch(ret.day) {
            case 1: th = "st"; break;
            case 2: th = "nd"; break;
            case 3: th = "rd"; break;
            default: th = "th"; break;
        }
        ret.strDate = `${ret.day}${th} day of ${ret.monthName} on ${ret.year} ${calendar.FirstYearAge}`;
        ret.strTime = ret.hour.toString().padStart(2, "0") + ":" + ret.minute.toString().padStart(2, "0") + ":" + ret.second.toString().padStart(2, "0");
        ret.str = ret.strTime + " " + ret.strDate;
        return ret;
    }
    static date2world(date) {
        const calendar = this.getCalendar(); /// XXX cache?
        let ret = 0;       

        let daysSinceEpoch = 0;
        for(let y = calendar.FirstYear; y < date.year; y++) {
            const daysThisYear = this.daysPerYears(y, calendar);
            daysSinceEpoch += daysThisYear;
        }


        for(let m = 0; m < date.month - 1; m++) {
            const monthInfo = calendar.calendarConfig[m];
            
            if(!this.isLeapMonth(date.year, monthInfo.leapYears)) continue;

            const dayThisMonth = monthInfo.numDays;
            daysSinceEpoch += dayThisMonth
        }

        daysSinceEpoch += date.day - 1;

        date.daysSinceEpoch = daysSinceEpoch;

        ret += date.daysSinceEpoch;
        ret *= calendar.HoursPerDay;
        ret += date.hour;
        ret *= calendar.MinutesPerHour;
        ret += date.minute
        ret *= calendar.SecondsPerMinute;
        ret += date.second;

        return ret;
    }
}