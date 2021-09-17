//Hooks.on('renderSceneControls', Merp1eMenu.renderMenu);
// Base on COC7 version
export class Merp1eMenu {
	constructor(options) {
		this.options = options;
		this.controls = this._getControls();
	}
	
	static async renderMenu(controls, html ){
		// This could be made non static by moving the game.merp1e.menus initialization to getSceneControlButtons hook
		if( !game.merp1e.menus){
			game.merp1e.menus = new Merp1eMenu();
		}

		const menu = await renderTemplate( 'systems/merp1e/templates/menus.html', game.merp1e.menus.getData());
		const merp1eButton = $(menu);
		
		merp1eButton.find('.scene-control').click(game.merp1e.menus._onClickMenu.bind(game.merp1e.menus));
		merp1eButton.find('.control-tool').click(game.merp1e.menus._onClickTool.bind(game.merp1e.menus));

		if(game.merp1e.menus.activeControl) html.find('.scene-control').removeClass('active');

		html.find('.scene-control').click( game.merp1e.menus._clearActive.bind(game.merp1e.menus));

		html.append(merp1eButton);
		game.merp1e.menus.html = html;
	}

	get control(){
		if ( !this.controls ) return null;
		return this.controls.find(c => c.name === this.activeControl) || null;
	}

	_clearActive(event){
		event.preventDefault();
		const customMenuActive = !!this.activeControl;
		this.activeControl = '';
		const li = event.currentTarget;
		const controlName = li.dataset?.control;
		if( ui.controls.activeControl == controlName && customMenuActive){
			ui.controls.render();
		}
	}

	_onClickTool(event){
		event.preventDefault();
		if ( !canvas?.ready ) return;
		const li = event.currentTarget;
		const toolName = li.dataset.tool;
		const tool = this.control.tools.find(t => t.name === toolName);

		// ui.notifications.info( `found tool: ${tool.name}`);
	
		// Handle Toggles
		if ( tool.toggle ) {
			tool.active = !tool.active;
			if ( tool.onClick instanceof Function ) tool.onClick(tool.active);
		}
	
		// Handle Buttons
		else if ( tool.button ) {
			if ( tool.onClick instanceof Function ) tool.onClick(event);
		}
	
		// Handle Tools
		else {
			tool.activeTool = toolName;
			if ( tool.onClick instanceof Function ) tool.onClick();
		}
	}

	_onClickMenu(event){
		event.preventDefault();
		if ( !canvas?.ready ) return;
		const li = event.currentTarget;
		const controlName = li.dataset.control;
		const control = this.controls.find(t => t.name === controlName);

		if( control.button){
			if ( control.onClick instanceof Function ) control.onClick( event); //If control is a button, don't make it active.
			// ui.controls.render();
		} else {
			//If control is a menu and is not active.
			// html.find('.scene-control').removeClass('active'); // Deactivate other menu.
			// event.currentTarget.classList.add('active'); //Activate this menu.
			this.activeControl = controlName;//Set curstom active control to that control.
			ui.controls.render();
		} 
	}

	getData(){
		const isActive = !!canvas?.scene;

		// Filter to control tool sets which can be displayed
		let controls = this.controls.filter(s => s.visible !== false).map(s => {
			s = duplicate(s);

			// Add styling rules
			s.css = [
				'custom-control',
				s.button ? 'button' : null,
				isActive && (this.activeControl === s.name) ? 'active' : ''
			].filter(t => !!t).join(' ');

			// if( this.activeControl === s.name) ui.notifications.warn( `Active control: ${this.activeControl}`);

			if(s.button) return s;

			// Prepare contained tools
			s.tools = s.tools.filter(t => t.visible !== false).map(t => {
				let active = isActive && ((s.activeTool === t.name) || (t.toggle && t.active));
				t.css = [
					t.toggle ? 'toggle' : null,
					active ? 'active' : null,
					t.class ? t.class : null
				].filter(t => !!t).join(' ');
				return t;
			});
			return s;
		});

		// Return data for rendering
		return {
			active: isActive,
			cssClass: isActive ? '' : 'disabled',
			controls: controls//.filter(s => s.tools.length)
		};
	}

	_getControls(){
		const isGM = game.user.isGM;
		const controls = [];
		controls.push({
			icon: 'fas fa-dice-d20',
			name: 'main-menu',
			title: 'Merp1e.GmTools.Title',
			visible: isGM,
            tools: [
				{
					icon : 'fas fa-hammer',
					name: 'maneuvers',
					title: 'Merp1e.GmTools.Maneuvers',
                    button: true,
                    onClick: (event) => game.merp1e.Merp1eRules.maneuver(event)
                }
			]
		});
/*
		controls.push({
			icon: 'game-icon game-icon-d10',
			name: 'dice-roll',
			title: 'CoC7.RollDice',
			button: true,
			onClick: (event) => CoC7Utilities.rollDice(event)
		});

		controls.push({
			icon: 'fas fa-link',
			name: 'create-link',
			title: 'CoC7.CreateLink',
			visible: isGM,
			button: true,
			onClick: CoC7LinkCreationDialog.create
		});
*/		return controls;
	}
}
