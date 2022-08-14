# Instalation

	WARNING: this code is an very very early ALPHA. Actually I never runned a game with it. Use at your own risk. Better, don't use it to play a game, but use it to improve until it gets in a reasonable state.

## Requirements

* Foundry 0.8.8 (Didn't test in any other version. SHould work on minor upgrades (i.e. 0.8.x), souldn't work on major updates (0.9.x).

I use it on docker fow Windows with no hassle. Should work theorically in a local instalation.

## How to

Find the Data/systems directory. Is is something like ../data/Data/systems. On a regular instalation if the "UserDataPath".
Shutdown Foundry. It may work on live installations, but you shouldn't push you luck.
Clone the git repository: git clone https://github.com/ranaur/foundry-merp.git
you shoould have a directory names foundry-merp. Rename it to merp1e.
Run Foundry. Create a New campaign, the system Merp1e should be there.

The campagn begins very empty. You should load/type the Items. When I mean Item, it is not only magic/mundane equipment, but anything an actor (PC/NPC) can "have": Skills, Professions, Races, Backgorund Options, Spells, Spell Lists and, of course, equipment.

While you can type everything, I recommend you to use the importer. You should make some TXTs files (tab separated) and import it using "Game Settings/COnfigure Settings/System Setting/Import Data". Make the data once and use on any game.

