import { Merp1eModifiers } from "../modifier.js";
import { Merp1eRollOpenEnded } from "../dice.js";

import { stripClassName, getAllSubclasses } from "../util.js";

export class Merp1eBaseChatCard {
    static createChatCard(className, data, options = {}, messageID = null) {
        switch(className) { // XXX refactor with something better (array)
            case "Merp1eTestChatCard":
                return new Merp1eTestChatCard(data, options, messageID);
            case "Merp1eStaticManeuverChatCard":
                return new Merp1eStaticManeuverChatCard(data, options, messageID);
            default:
                return new Merp1eBaseChatCard(data, options, messageID);
        }
    }

    constructor(data, options = {}, messageID = null) {
		this.options = mergeObject(this.constructor.defaultOptions, this.options);
        this.options.closed = this.options.closed || false;
		this.data = data;
        this.messageID = messageID;
    }

    static get defaultOptions() {
		return {};
	}
    
    get title() {
        return "Base Card";
    }

    set title(title) {
        return;
    }

    get template() {
        const path = "systems/merp1e/templates/chat";
        const filePrefix = stripClassName(this, null, "ChatCard").toLowerCase();
        return `${path}/${filePrefix}-chatcard.html`;
    }

    setClass(className) {
        return;
    }

    close(event) {
        this.options.closed = true;
        this.updateMessage(event);
    }

    getData() {
        return { data: expandObject(this.data) };
    }

    async _renderMessage() {
		const dataObject = escape(this.toJSON());
		const cardClass = this.constructor.name;
        const cardHTML = await renderTemplate(this.template, this.getData());

        const chatCardClass = this.options.closed ? "chat-card-closed" : "chat-card";
        const html = $(`<form class="${chatCardClass}" data-card-class='${cardClass}' data-object='${dataObject}'>${cardHTML}</form>`);

        if(this.options.closed) {
            html.find(':input').prop('disabled', true);
        } else { // open
            html.find(':input').addClass('chat-card');
            html.find('select').addClass('cc-select');
            html.find(':button').addClass('cc-button');
            html.find(':submit').addClass('cc-submit');
            html.find(':radio').addClass('cc-radio');
            html.find(':checkbox').addClass('cc-checkbox');
            html.find(':text').addClass('cc-text');
            html.find('input[type=number]').addClass('cc-number');
            if(!game.user.isGM) {
                html.find('.gm-select-only').prop('disabled', true);

            }
        }
        return html[0].outerHTML;
    }

    // called from hook
	static async bindListeners(html){
		const htmlMessageElement = html[0];
		const htmlCardElement = htmlMessageElement.querySelector('.chat-card');
		if( !htmlCardElement) return;
		const card = await Merp1eBaseChatCard.fromHTMLCardElement(htmlCardElement);

		//const typedCard = Object.assign( new game.CoC7.cards[htmlCardElement.dataset.cardClass], card);
		//typedCard.assignObject();
		card.activateListeners(html);
	}

    async _generateChatData(){
		const html = await this._renderMessage();

		let chatData = mergeObject({
			user: game.user.id,
			flavor: game.i18n.localize(this.title),
			content: html
        }, this.options);

		if ( ['gmroll', 'blindroll'].includes(this.rollMode) ) chatData['whisper'] = ChatMessage.getWhisperRecipients('GM');
		if ( this.rollMode === 'blindroll' ) chatData['blind'] = true;

		return chatData;
    }

	async sendMessage(){
        const chatData = await this._generateChatData();
        return await ChatMessage.create(chatData);
    }

	async updateMessage(event){
		if(Merp1eBaseChatCard.getMessageID(event.currentTarget)){
			const chatMessage = game.messages.get(this.messageID);
            const chatData = await this._generateChatData();
			const msg = await chatMessage.update({content: chatData.content});
			if(msg) return await ui.chat.updateMessage(msg, false);
        } else {
            return await this.sendMessage();
        }
}

    /* * overridable * */
	activateListeners(html) {
		html.on('click', '.chat-card .cc-radio', this._onClick.bind(this));
		html.on('click', '.chat-card .cc-select', this._onClick.bind(this));
		html.on('focusout', 'input', this._onClick.bind(this));
        html.on('click', '.chat-card .cc-checkbox', this._onToggleCheckbox.bind(this));
		html.on('click', '.chat-card .cc-submit', this._onSubmit.bind(this));
		html.on('click', '.chat-card .cc-button', this._onButton.bind(this)); 
		html.on('keydown', 'form', this._onKey.bind(this));
	}

    /* ************** Event Handlers ************** */
	async _onClick(event){
        if(event.currentTarget.type == "button") return; // Buttons has their own handlers
        console.log("_onClick");
		const target = event.currentTarget;
        this.data[target.name] = target.value;

        return this._onSubmit(event);
	}

	async _onToggleCheckbox( event){
        console.log("_onToggleCheckbox");
		const target = event.currentTarget;
        this.data[target.name] = !(!target.checked);

        return this._onSubmit(event);
	}

	/**
     * 
     * @param {*} event will check for an action (data-action)
     * if a method with that name exist it will be triggered.
     */
	_onButton(event){
        console.log("_onButton");
		event.preventDefault();

		const button = event.currentTarget;
		button.style.display = 'none'; //Avoid multiple push
		const action = button.dataset.action;
		if( this[action]) this[action](event, true);
	}

	/**
     * 
     * @param {*} event 
     * @returns false if key is enter to avoid global submission
     */
	_onKey( event){
		if( 'Enter' == event.key) this._onSubmit( event);
		return event.key != 'Enter';
	}

	_onSubmit(event){
        console.log("_onSubmit");
		event.preventDefault();

		const target = event.currentTarget;
		if( 'action' in target.dataset) return this._onButton(event);

        this.updateMessage(event);
	}

	toJSON(){
		return JSON.stringify({data: this.data, options: this._options }, (key,value)=>{
			if( null === value) return undefined;
			if( this.options.exclude?.includes(key)) return undefined;
			if( key.startsWith(this.options.excludeStartWith)) return undefined;
			return value;
		});
	}
/*
	get rollMode(){
		if( !this._rollMode) this._rollMode = game.settings.get('core', 'rollMode');
		return this._rollMode;
	}

	set rollMode(x){
		if( false === x) this._rollMode = game.settings.get('core', 'rollMode');
		this._rollMode = x;
	}
*/
    static getMessageID(element) {
        const message = element.closest( '.message');
        return message?.dataset?.messageId;
    }

	static async fromMessageID(messageID){
		const message = game.messages.get(messageID);
		if( !message) return undefined;
		const card = await this.fromMessage(message);
		card.messageID = messageID;
		return card;
	}
	
	static async fromMessage(message){
		const cardElement = $(message.data.content)[0];
		if( !cardElement) return undefined;
		return await this.fromHTMLCardElement(cardElement);
	}

	static async fromHTMLCardElement(card){
        if(!card.dataset?.object) return;
		const cardObject = JSON.parse(unescape(card.dataset.object));
        const cardClass = card.dataset?.cardClass;
		return await this.fromData(
            cardClass,
            cardObject.data,
            cardObject.options, Merp1eBaseChatCard.getMessageID(card)
            );
	}

	static async fromData(cardClass, data, options, messageID){
		return Merp1eBaseChatCard.createChatCard(cardClass, data, options, messageID);
	}

    /* SYSTEM DEPENDENT */
    rollOpenEnded(high = true, low = true) {
        const MARGIN = 40;
        let r = new Roll("1D100", {async: false});
        r.roll();
        r.toMessage();
        let total = r.total;
        let result = "".concat(r.total);
        console.log("first dice: " + r.total);
        let open = 0;
        if(high && r.total > (100 - MARGIN)) open = 1;
        if(low && r.total < (1 + MARGIN)) open = -1;
        while(open != 0) {
            let r = new Roll("1D100", {async: false});
            r.roll();
            r.toMessage();
            console.log("other dice: " + r.total);
            total += r.total * open;
            result = result.concat(open > 0 ? " + " : " - ").concat(r.total);
            if(r.total <= (100 - MARGIN)) open = 0;
        }
        this.data.rollResult = result;
        this.data.rollTotal = total;
    }
}
/*
	///////////////////////////////////
	setFlag( flagName){
		if( !flagName && !($.type(flagName) === 'string')) return;
		this[flagName] = true;
	}

	unsetFlag( flagName){
		if( !flagName && !($.type(flagName) === 'string')) return;
		this[flagName] = false;
	}

	toggleFlag( flagName){
		this[flagName] = !this[flagName];
	}

	//////////////////////////////////	

	get displayActorOnCard(){
		return game.settings.get('CoC7', 'displayActorOnCard');
	}
    
	get isBlind(){
		if( !this.rollMode) return null;
		if( undefined === this._isBlind) this._isBlind = 'blindroll' === this.rollMode;
		return this._isBlind;
	}

	set isBlind(x){
		this._isBlind = x;
	}

	get actor(){
		if( !this.actorKey) return null;
		return chatHelper.getActorFromKey( this.actorKey);//REFACTORING (2)
	}

	get token(){
		if( !this.actor) return null;
		return chatHelper.getTokenFromKey(this.actorKey);
	}

	get item(){
		if( !this.itemID) return null;
		return this.actor.items.get( this.itemID);
	}

	get weapon(){
		return this.item;
	}

	get targetedTokens(){
		return [...game.user.targets];
	}
    
	get target(){
		if( this.targetToken) return this.targetToken;
		return this.targetActor;
	}

	get isTargetOwner(){
		return  this.target.isOwner;
	}

	get isGM(){
		return game.user.isGM;
	}

	/**
     * If a targetKey was provided try to find a token with that key and use it.
     * If not targetKey provided return the first target.
     * /
	get targetToken(){
		if( !this._targetToken){
			if( this._targetKey)
			{
				this._targetToken = chatHelper.getTokenFromKey( this._targetKey);
			} else {
				this._targetToken = this.targetedTokens.pop();
				if( this._targetToken) this._targetKey = `${this._targetToken.scene.id}.${this._targetToken.id}`; //REFACTORING (2)
				else {
					this._targetToken = null;
				}
			}
		}
		return this._targetToken;
	}
    
	get targetActor(){
		if( !this._targetActor){
			if( this.targetToken) this._targetActor = this.targetToken.actor;
			else this._targetActor = chatHelper.getActorFromKey( this._targetKey);//REFACTORING (2)
		}
		return this._targetActor;
	}

	get targetKey(){
		if( !this.targetToken && !this.targetActor) return null;
		return this._targetKey;
	}
    
	get hasTarget(){
		if( !this.targetToken && !this.targetActor) return false;
		return true;
	}

	set targetKey(x){
		this._targetKey = x;
	}

	get skills(){
		return this.actor.getWeaponSkills( this.itemID);
	}

	get targetImg(){
		const img =  chatHelper.getActorImgFromKey( this.targetKey);
		if( img ) return img;
		return '../icons/svg/mystery-man-black.svg';
	}
    
	get name(){
		if( this.token) return this.token.name;
		return this.actor.name;
	}
    
	get targetName(){
		if( !this.target) return 'dummy';
		return this.target.name;
	}

	get actorImg(){
		const img =  chatHelper.getActorImgFromKey( this.actorKey);
		if( img ) return img;
		return '../icons/svg/mystery-man-black.svg';
	}

}
*/

export class Merp1eTestChatCard extends Merp1eBaseChatCard {
}

export class Merp1eStaticManeuverChatCard extends Merp1eBaseChatCard {
    get title() {
        return "Static Maneuver";
    }
    getData() {
        this.debounce = true;
        const data = super.getData();
        const actor = game.actors.get(data.data.actorID);
        if(!actor) return data;

        data.actor = actor;
        const skill = actor.items.get(data.data.skillID);

        if(!skill) return data;
        data.skill = skill;
        data.data.chosenDifficulty = data.data.chosenDifficulty || "Medium";
        data.difficulties = new Merp1eModifiers(game.merp1e.Merp1eRules.skill.modifiers.Difficulties, actor, skill);
        data.modifications = new Merp1eModifiers(game.merp1e.Merp1eRules.skill.modifiers.ReadRunesUseItens, actor, skill);
        data.total = skill.total + data.difficulties.value[data.data.chosenDifficulty] + data.modifications.getTotal(data.data.modifiersChecked, data.data.modifiersValue) + (data.data.rollTotal || 0);
        return data;
    }

    static create(actorID, skillID, conditions = [], options = {}) {
        return new Merp1eStaticManeuverChatCard(
            {
                actorID: actorID,
                skillID: skillID,
                conditions: conditions
            },
            options);
    }

    roll(event, update) {
        console.log("ROLL!!!");
        if(!debounce) {
            console.error("DEBOUNCE!");
            return;
        }
        this.debounce = false;
        //let r = new Merp1eRollOpenEnded();
        //r.roll();
        //r.toMessage();
        //this.data.rollResult = r.result;
        //this.data.rollTotal = r.total;
        this.rollOpenEnded();

        this.close(event);
    }

}

