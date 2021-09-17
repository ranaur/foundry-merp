import { Merp1eBaseChatCard } from "./chat/chat-card.js";

export class Merp1eChat {
    /*
        Name	Type	Attributes	Default	Description
        _id     string	                    The _id which uniquely identifies this ChatMessage document
        type	number	<optional>  0       The message type from CONST.CHAT_MESSAGE_TYPES
        user	string			            The _id of the User document who generated this message
        timestamp	number			        The timestamp at which point this message was generated
        flavor	string	<optional>          An optional flavor text message which summarizes this message
        content	string			            The HTML content of this chat message
        speaker	data.ChatSpeakerData        A ChatSpeakerData object which describes the origin of the ChatMessage
        whisper	Array.<string>              An array of User _id values to whom this message is privately whispered
        blind	boolean	<optional>  false	Is this message sent blindly where the creating User cannot see it?
        roll	string	<optional>          The serialized content of a Roll instance which belongs to the ChatMessage
        sound	string	<optional>          The URL of an audio file which plays when this message is received
        emote	boolean	<optional>  false	Is this message styled as an emote?
        flags	object	<optional>  {}	    An object of optional key/value flags
     */
	static async createMessage(message, options = {}){
		const messageData = {};
		if(options.title) { messageData.flavor = options.title };
		messageData.speaker = options.speaker || ChatMessage.getSpeaker();
		if(options.whisper){
			messageData.type = CONST.CHAT_MESSAGE_TYPES.WHISPER;
			messageData.whisper = options.whisper;
		}
		messageData.user = game.user.id;
		messageData.content = message;

		return await ChatMessage.create(messageData);
	}

	static async createCard(card){
		return await Merp1eChat.createMessage(card.message, card.options);
	}
		
	static renderChatMessageHook(chatMessage, html){
	}

	// static onMessage( data) {
	// 	console.log('-->Merp1eChat.onMessage');
	// 	console.log(`message received send&er :${data.user} message type : ${data.action} for message :${data.messageId}`);
	// }

	static chatListeners(app, html) {
		html.on('click', '.card-title', Merp1eChat._onChatCardToggleContent.bind(this));
		html.on('click', '.radio-switch', Merp1eChat._onChatCardRadioSwitch.bind(this));
		/*
		html.on('click', '.card-buttons button', Merp1eChat._onChatCardAction.bind(this));
		// html.on('click', '.card-buttons button', Merp1eChat._onChatCardTest.bind(this));
		html.on('click', '.panel-switch', Merp1eChat._onChatCardToggleSwitch.bind(this));

		html.on('click', '.simple-flag', Merp1eChat._onChatCardToggleSwitch.bind(this));
		html.on('click', '.volley-size', Merp1eChat._onChatCardVolleySize.bind(this));

		html.on('click', '.dropdown-element', Merp1eChat._onDropDownElementSelected.bind(this));
		html.on('click', '.simple-toggle', Merp1eChat._onToggleSelected.bind(this));
		// html.on('click', '.is-outnumbered', Merp1eChat._onOutnumberedSelected.bind(this));

		html.on('click', '.target-selector', Merp1eChat._onTargetSelect.bind(this));

		html.on('dblclick', '.open-actor', Merp1eChat._onOpenActor.bind(this));
		
		html.on('click', '.coc7-link', CoC7Parser._onCheck.bind(this));
		html.on('dragstart', 'a.coc7-link', CoC7Parser._onDragCoC7Link.bind(this));

		html.on('click', 'coc7-inline-result', Merp1eChat._onInline.bind(this));
		*/
		// RollCard.bindListerners(html);
		// OpposedCheckCard.bindListerners(html);
		// CombinedCheckCard.bindListerners(html);
	}


	static _onOpenActor(event){
		event.preventDefault();
		const actorKey = event.currentTarget.dataset.actorKey;
		if( actorKey){
			const actor = chatHelper.getActorFromKey( actorKey); //REFACTORING (2)
			if(actor.isOwner) actor.sheet.render(true);
		}
	}

	static async onUpdateChatMessage(chatMessage){
		ui.chat.scrollBottom();

		if( game.user.isGM){
			const card = $(chatMessage.data.content)[0];
		}
		
	}

	static async renderMessageHook(message, html) {
		ui.chat.scrollBottom();
		Merp1eBaseChatCard.bindListeners(html);

		/*

		//Handle showing dropdown selection
		html.find('.dropbtn').click(event => event.currentTarget.closest('.dropdown').querySelector('.dropdown-content').classList.toggle('show'));
		html.find('.dropdown').mouseleave( event => event.currentTarget.querySelector('.dropdown-content').classList.remove('show'));

		// console.log('************************************************************-->Merp1eChat.messageListeners message :' + message.id);
		// message.data.content = "";
		// data.message.content = "";

		//When a new card is published, check wether it's a roll that modifies an other card.
		if( game.user.isGM){
			const card = html[0].querySelector('.coc7.chat-card');
			if( card){
				if( card.classList.contains('roll-card') && !(card.dataset.processed == 'true') && card.dataset.refMessageId){

					const roll = CoC7Roll.getFromElement( card);

					if( card.dataset.side =='target') roll.defendantId = card.dataset.tokenId ? card.dataset.tokenId : card.dataset.actorId;
					if( card.dataset.side =='initiator') roll.initiatorId = card.dataset.tokenId ? card.dataset.tokenId : card.dataset.actorId;
					card.dataset.processed = 'true';

					Merp1eChat.updateCombatCardTarget( roll);
				}
			}
		}

		const userOnly = html.find('.target-only');
		for( let element of userOnly )
		{
			if( !game.user.isGM){
				element.style.display = 'none';
				const actorId = element.getAttribute('data-actor-id');
				if( actorId ){ 
					if( game.actors.get(actorId).isOwner)
					{ element.style.display = 'block';}
				}
			}
		}

		const gmOnly = html.find('.gm-only');
		for( let zone of gmOnly )
		{
			if( !game.user.isGM){ zone.style.display = 'none';}
		}

		const userVisibleOnly = html.find('.user-visible-only');
		for( let elem of userVisibleOnly)
		{
			if( game.user.isGM) elem.style.display='none';
		}

		const gmVisibleOnly = html.find('.gm-visible-only');
		for( let elem of gmVisibleOnly)
		{
			if( !game.user.isGM) elem.style.display='none';
		}

		const ownerVisibleOnly = html.find('.owner-visible-only');
		for( let zone of ownerVisibleOnly )
		{
			//Try retrieving actor
			let actor = Merp1eChat._getActorFromKey( zone.dataset?.actorKey);//Try with self.
			if( !actor) actor = Merp1eChat._getChatCardActor(zone.closest('.chat-card'));//Try with closest chat card.
			if( !actor) actor = Merp1eChat._getActorFromKey( zone.parentElement.dataset.actorKey);//Try with parent element.
			if( !actor) actor = Merp1eChat._getActorFromKey( zone.closest('[data-actor-key]')?.dataset.actorKey);//Try with closest data-actor-key
			if( !actor) actor = Merp1eChat._getActorFromKey( zone.closest('[data-token-key]')?.dataset.actorKey);//Try with closest data-token-key
			
			// const actor = game.actors.get( actorId);
			if((actor && !actor.isOwner) || game.user.isGM) {zone.style.display = 'none';} //if current user doesn't own this he can't interract
			// if( !Merp1eChat.isCardOwner( zone.closest('.chat-card'))) {zone.style.display = 'none';}
		}

		if( !game.user.isGM) // GM can see everything
		{
			const ownerOnly = html.find('.owner-only');
			for( let zone of ownerOnly )
			{
				//Try retrieving actor
				let actor = Merp1eChat._getActorFromKey( zone.dataset?.actorKey);//Try with self.
				if( !actor) actor = Merp1eChat._getChatCardActor(zone.closest('.chat-card'));//Try with closest chat card.
				if( !actor) actor = Merp1eChat._getActorFromKey( zone.parentElement.dataset.actorKey);//Try with parent element.
				if( !actor) actor = Merp1eChat._getActorFromKey( zone.closest('[data-actor-key]')?.dataset.actorKey);//Try with closest data-actor-key
				if( !actor) actor = Merp1eChat._getActorFromKey( zone.closest('[data-token-key]')?.dataset.actorKey);//Try with closest data-token-key
				
				// const actor = game.actors.get( actorId);
				if( (actor && !actor.isOwner) || (!actor && !game.user.isGM)) {zone.style.display = 'none';} //if current user doesn't own this he can't interract
				// if( !Merp1eChat.isCardOwner( zone.closest('.chat-card'))) {zone.style.display = 'none';}
			}

			const gmSelectOnly = html.find('.gm-select-only');
			for( let select of gmSelectOnly)
			{
				select.classList.add( 'inactive');
				select.classList.remove('simple-flag');
			}
		}
		*/
	}

	static _onTargetSelect( event){
		const index = parseInt(event.currentTarget.dataset.key);
		const targetsSelector = event.currentTarget.closest('.targets-selector');
		targetsSelector.querySelectorAll('img').forEach( i =>{
			i.style.border='none';
		});
		targetsSelector.querySelector(`[data-key="${index}"]`).querySelector('img').style.border='1px solid #000';
		const targets = event.currentTarget.closest('.targets');
		targets.querySelectorAll('.target').forEach( t => {
			t.style.display='none';
			t.dataset.active='false';
		});
		const targetToDisplay = targets.querySelector(`[data-target-key="${index}"]`);
		targetToDisplay.style.display='block';
		targetToDisplay.dataset.active='true';
		// const chatCard = event.currentTarget.closest('.chat-card.range');
		// const rangeInitiator = CoC7RangeInitiator.getFromCard( chatCard);
	}

	static _onDropDownElementSelected( event){

		event.preventDefault();

		const card = event.currentTarget.closest('.chat-card');
		if( card.classList.contains('target')){
			CoC7MeleeTarget.updateSelected( card, event);
			return;
		}

		//clear all drop down and highlight this particular one
		const dropDownBoxes = event.currentTarget.closest('.response-selection').querySelectorAll('.toggle-switch');
		[].forEach.call( dropDownBoxes, dpdnBox => dpdnBox.classList.remove('switched-on'));
		event.currentTarget.closest('.toggle-switch').classList.add('switched-on');

		//close dropdown
		event.currentTarget.closest('.dropdown-content').classList.toggle('show');

		//Display the roll button
		const selectedBox = event.currentTarget.closest('.defender-action-select').querySelector('.selected-action');
		selectedBox.style.display = 'block';
		const button = selectedBox.querySelector('button');

		//Pass the initiator Id - Build can be retrieved from that

		//Pass the initiator item
		
		//Pass the defendant Id

		//Pass the defendant action
		button.dataset.action = 'defending';
		button.dataset.actionType = event.currentTarget.dataset.action;
		button.dataset.defenderChoice = event.currentTarget.dataset.action;
		button.dataset.skillId = event.currentTarget.dataset.skillId;
		button.dataset.skillValue = event.currentTarget.dataset.skillValue;
		button.dataset.skillName = event.currentTarget.dataset.skillName;
		button.dataset.itemId = event.currentTarget.dataset.weaponId;
		button.dataset.itemName = event.currentTarget.dataset.weaponName;

		//Put some text in the button
		switch (event.currentTarget.dataset.action) {
		case 'maneuver':
			button.innerText = `${game.i18n.localize(COC7.combatCards[event.currentTarget.dataset.action])} : ${event.currentTarget.dataset.skillName} (${event.currentTarget.dataset.skillValue}%)`;
			break;
		case 'fightBack':
			button.innerText = `${game.i18n.localize(COC7.combatCards[event.currentTarget.dataset.action])} : ${event.currentTarget.dataset.weaponName} (${event.currentTarget.dataset.skillValue}%)`;
			break;
		
		default:
			break;
		}
		//Save action for the roll
	}

	static async _onInline( event){
		event.preventDefault();
		const a = event.currentTarget;
		
		if ( a.classList.contains('inline-result') ) {
			if ( a.classList.contains('expanded') ) {
				return CoC7Check._collapseInlineResult(a);
			} else {
				return CoC7Check._expandInlineResult(a);
			}
		}
	}

	static _onToggleSelected( event){

		const card = event.currentTarget.closest('.chat-card');
		if( card.classList.contains('target')){
			CoC7MeleeTarget.updateSelected( card, event);
			return;
		}

		if( event.currentTarget.dataset.skillId == ''){
			ui.notifications.error(game.i18n.localize('CoC7.ErrorNoDodgeSkill'));
			return;
		}

		//clear all drop down and highlight this particular one
		const dropDownBoxes = event.currentTarget.closest('.response-selection').querySelectorAll('.toggle-switch');
		[].forEach.call( dropDownBoxes, dpdnBox => dpdnBox.classList.remove('switched-on'));
		event.currentTarget.classList.add('switched-on'); //Need to test if it's really a dodge !!!

		//Save action for the roll
		const selectedBox = event.currentTarget.closest('.defender-action-select').querySelector('.selected-action');
		selectedBox.style.display = 'block';
		const button = selectedBox.querySelector('button');

		button.dataset.action = 'defending';
		button.dataset.actionType = 'dodging';
		button.dataset.defenderChoice = event.currentTarget.dataset.action;
		button.dataset.skillId = event.currentTarget.dataset.skillId;
		button.dataset.skillValue = event.currentTarget.dataset.skillValue;
		button.dataset.skillName = event.currentTarget.dataset.skillName;

		button.innerText = `${game.i18n.localize(COC7.combatCards[event.currentTarget.dataset.action])} : ${event.currentTarget.dataset.skillName} (${event.currentTarget.dataset.skillValue}%)`;
	}


	static _onChatCardRadioSwitch( event){
		// console.log('-->Merp1eChat._onChatCardRadioSwitch');
		event.preventDefault();
		let optionList = event.currentTarget.parentElement.getElementsByClassName('radio-switch');	
		let index;
		for (index = 0; index < optionList.length; index++) {
			let element = optionList[index];
			if( element.dataset.property == event.currentTarget.dataset.property){
				element.classList.add('switched-on');
			}
			else{
				element.classList.remove('switched-on');
			}
		}
		event.currentTarget.parentElement.dataset.selected = event.currentTarget.dataset.property;
	}

	static async _onChatCardVolleySize( event){
		const card = event.currentTarget.closest('.chat-card');
		
		if( card.classList.contains( 'range')){
			if( card.classList.contains('initiator')){
				const rangeCard = CoC7RangeInitiator.getFromCard( card);
				if( event.currentTarget.classList.contains('increase')) rangeCard.changeVolleySize( 1);
				else if( event.currentTarget.classList.contains('decrease'))  rangeCard.changeVolleySize( -1);
			}
		}

	}

	static async _onChatCardToggleSwitch( event){
		event.preventDefault();

		const card = event.currentTarget.closest('.chat-card');
		if( card.classList.contains( 'melee')){
			if( card.classList.contains('initiator')){
				CoC7MeleeInitiator.updateCardSwitch( event);
			}

			if( card.classList.contains('target')){
				CoC7MeleeTarget.updateCardSwitch( event);
			}
		}

		if( card.classList.contains( 'range')){
			if( card.classList.contains('initiator')){
				CoC7RangeInitiator.updateCardSwitch( event);
			}
		}

		if( card.classList.contains('damage')){
			// CoC7Item.updateCardSwitch( event);
		}

		if( card.classList.contains('roll-card')){
			CoC7Check.updateCardSwitch(event);
		}
	}

	/**
	 * Get the Actor which is the author of a chat card
	 * @param {HTMLElement} card    The chat card being used
	 * @return {Actor|null}         The Actor entity or null
	 * @private
	 */
	static _getChatCardActor(card) {

		//if dataset.object is there => need to unescape things !!
		//if not use the dataset directly.
		const cardData = card.dataset.object?JSON.parse(unescape((card.dataset.object))):card.dataset;

		if( cardData.actorKey) return Merp1eChat._getActorFromKey( cardData.actorKey);

		// Case 1 - a synthetic actor from a Token
		const tokenKey = cardData.tokenId;
		if (tokenKey) {
			const [sceneId, tokenId] = tokenKey.split('.');
			if( 'TOKEN' == sceneId){
				return game.actors.tokens[tokenId];//REFACTORING (2)
			} else {
				const scene = game.scenes.get(sceneId);
				if (!scene) return null;
				const token = scene.getEmbeddedDocument('Token', tokenId);
				if (!token) return null;
				return token.actor || new Token(tokenData).actor;
			}
		}

		// Case 2 - use Actor ID directory
		const actorId = cardData.actorId;
		if( actorId) return game.actors.get(actorId);

		const message = card.closest('.message');
		const messageId = message? message.dataset.messageId: null;
		if( messageId){
			const chatMessage = game.messages.get( messageId);
			if( chatMessage.user) return chatMessage.user.character;
		}

		return null;

	}

	static isCardOwner( card){
		const message = card.closest('.message');
		const messageId = message? message.dataset.messageId: null;
		if( messageId){
			const chatMessage = game.messages.get( messageId);
			return chatMessage.ownner  || false;
		}

		return false;
	}

	static _getActorFromKey(key) {

		if( !key) return undefined;
		// Case 1 - a synthetic actor from a Token
		if (key.includes('.')) { //REFACTORING (2)
			const [sceneId, tokenId] = key.split('.');
			if( 'TOKEN' == sceneId){
				return game.actors.tokens[tokenId];//REFACTORING (2)
			} else {
				const scene = game.scenes.get(sceneId);
				if (!scene) return null;
				const token = scene.getEmbeddedDocument('Token', tokenId);
				if (!token) return null;
				return token.actor || new Token(tokenData).actor;
			}
		}

		// Case 2 - use Actor ID directory
		return game.actors.get(key) || null;
	}

	static getActorFromToken( tokenKey)
	{
		const token = Merp1eChat.getToken( tokenKey);
		return token ? token.actor : null;
	}

	static getToken(tokenKey){
		if (tokenKey) {
			const [sceneId, tokenId] = tokenKey.split('.');
			if( 'TOKEN' == sceneId){
				return game.actors.tokens[tokenId]?.token;//REFACTORING (2)
			} else {
				const scene = game.scenes.get(sceneId);
				if (!scene) return null;
				const token = scene.getEmbeddedDocument('Token', tokenId);
				if (!token) return null;
				return token|| new Token(tokenData);
			}
		}
		return null;
	}

	/**
	 * update a chat message with a new HTML content and populate it.
	 * @param {HTMLElement} card 
	 */
	static async updateChatCard( card, messId = null){
		const messageId = messId == null ? card.closest('.message').dataset.messageId: messId;
		let message = game.messages.get( messageId);

		const msg = await message.update({ content: card.outerHTML });
		await ui.chat.updateMessage( msg, false);
		return msg;
	}

	/**
	 * Handle toggling the visibility of chat card content when the name is clicked
	 * @param {Event} event   The originating click event
	 * @private
	*/
	static _onChatCardToggleContent(event) {
		event.preventDefault();
		const header = event.currentTarget;
		const card = header.closest('.chat-card');
		const content = card.querySelector('.card-content');
		if( content){
			if( !content.style.display) content.style.display = 'block';
			else content.style.display = content.style.display === 'none' ? 'block' : 'none';
		}
	}
}