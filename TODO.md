# TODO
* Colocar o class="userentry" na damage-sheet, respeitando o applied. (e em todo o resto)
* Refazer o Applied
    Retirar o ícone de apply
    tirar o checkbox => quando cria sem ator é só o initial, quando tem ator é só o current.
* Colocar a tabela de dano como tabela com borda
* Colocar a constituição e uncounscious/destroyed
* Soul departure / stat deterioration

    * better treatment of weapon/shield arm. Use the weapon at hand, and if the player is using two weapons, choose randomly/heavier ou left/righ handed.

    Actor:
        Damage:
            Testar o heal();

            Testar damage e o cálculo automático
        Colocar os status (Stun, down, out, dead) no token
        Fazer com que as fichas atualizem quando mudar o flag de tipo de damage

        Implementar XP: effective, new XP e por item.

        Colocar "favorite skill" e colocar actions (skill, bonus, conditional bonus)

        Colocar class="userentry" em todos os campos de usuário

        Revisar os dados do actor
            description

        Fazer uma aba Combat/Actions
            Armor
            Greaves (Arm/Leg)
            DB
            Shield
        Fazer a aba de Heath & Power
            Fazer o controle de dano "automático" (com os damages)
                Consolidar os statuses
                Ajustar o botão de passa um round para acertar os damages
            Damage/Heal Button no HP
            Retestar a ficha de damage

            Consolidated Statuses
                Current Hit Points
                Activity Penalty
                Stunned
                Unconscious
                Paralyzed
                Blind
                Deaf
                Drop
                Dead for N rounds
            Fazer a lista de damage received criticals para acumular

        Aba Spells
            PP Multiplier
            Spell adder

        Fazer uma limpeza em rules.js e seus subitens.
        Melhorar o tratamento de criação/exclusão de items (aba Language, item, Spells)
        Fazer suporte a background options

    Colocar no generic-importer para importar Languages
        Usar o metadata para pegar os tipos de itens
        Pensar alguma maneira de fazer subdocumentos e ActiveEffects

    Fazer features (ActiveEffects). Tipos:
        Bonus em um skill
        Stat Increase (1 stat + 2)
        Stat Increase (3 stats + 1)
        Hobby skill rank - Increase one primary skill by 2 ranks or increase one secondary skill by 5 ranks	
        Extra Language -  Increase one language to skill rank 5 	
        Bonus on skill - always on
            A special +5 bonus to any one primary skill.
            A special +15 bonus in a secondary skill.
            Resistence: a special +10 bonus to RR's againt one type adversity, normally Essence spells, Channeling spells, Poisons or Disease
            Very observant: a special +10 bonus to preception and tracking
            a special +10 to leadership and influence
        Bonus on skill - on Item Use - (item add action with a bonus)
            Empathy with a type of animal. Start with one pet or loyal companion of that type (e.g. falcon, hawl, weasel, cat, dog, horse, etc.) Any maneuver on or with such an animal receives a special +25 bonus.
            +10 bonus magic item; +10 to any skill which the item is used (e.g. a +10 mace increate the mace OB by 10 when used in combat, a +10 lockpick would give a +10 bonus for picking locks, a +10 saddle would give a +10 bonus to riding, a +10 suit os armor woul
        Infravision: ability to see sources of heat in darkness. range up to 100' (alternatively, any one sense may be enhanced in similar manner)
        Extra spell list - Proficient with spells: start having one extra spell list (this background option may only be obtained once). The type of spell list is still limited by profession and race.
        Bonus on skill group
            Adept at moving maneuvers: a special +10 bonus to all moving maneuvers
            Lightining reactions: +5 to DB and +5 to all OBs
        Bonus per rank
            Resistaint to pain: +3 to each D10 roll for concussion hits from body development skill development
        Daily spell cast - item: an item which allows a spell to be cast a certain number os times a day without expending power points (see Section 4.56): a 1st level spell four times a day, a 2nd level spell thee times a day; a 3rd level spell twice a day, or a 4th level spell once a day. The player my choose the spell (4th level or loweer) and the type of the item (if the GM deems it appropriate) OR the gamemaster and the player may agree on a special magic item (e.g. a canteen that refils once a day, a rope that ties and unties itself, a backpack which is weightless regardless of contents, etc.)
        Spell adder
        Power Point Muitiplier

    Sheet: Race
        Reler raças e colocar os bonus condicionais de skill na planilha (ActiveEffects?)
        Importar as raças
        Retirar as características e colocar tudo em descrição
        Adicionar os efeitos da raça no actor
            skill bonuses (ActiveEffects?)
            adolescence skill rank - fazer ranks por set e colocar na tip do skill

    Sheet: Character
        Contabilizar os bonuses/PP/adder no skill (ActiveEffects?)
        Implementar uma parada para esconder os skills secundários que estão zerados (fazer no CSS com hidden?)
        Implementar um tooltip mostrando a conta
        Fazer um tratamento melhor de spelllist.data.data.chanceOfLearning (permitir só de 20 em 20, e marcar quando aprender)
        Aba spells:
            melhorar a diferença entre spelllist e spell (CSS?)
            Filtrar (ou colocar desabilitado os spells de nível acima do do personagem)
            Colocar botão de prepare, cast e roll

	Sheet: SpellLists
        Botão para atualizar os spells

    Sheet: Equipment
        Fazer um major revision para utilizar localização.

        Alterar um widget(part spell-chooser para permitir "receber" spell por drag & drop
            Se arrastar o spell em cima da barra (ou do +), cria um novo item.

        Fazer equipamento por sub tipo:
            Arma => roll de ataque
            Armadura => AT, DB e MM
            Greaves/Helm => Efeito no DB, critical, etc.
            Container =>
            Ferramenta => Permite roll
            Erva/Poção => Cura/effeito, com contagem de uso (use on Character, e diminui a contagem)
            Fazer o cálculo de DB e AT a partir da armadura helm greaves, etc.
        Fazer os itens com peso e calcular o encumbrance (wear/not wear)

        Colocar Special nos Itens:
            Daily Spell
            PP Multiplier (per realm)
            Spell Adder (per realm)
            Fixed number od uses spells (1 for potions and scrolls)
            Stat Bonus
            Always on Skill Bonus
            Conditional Stat Bonus

        Colocar botão de Roll
        Calacular peso por container/wear
        Fazer o "corpo", container base onde ficam as coisas que estão ativas.

    Sheet: Profession

    Fazer tela de passagem de nível/criação de personagem
        Distribuir os pontos de ranks de skills
        Deixar gastar só eles
        Transferir de um para o outro

    Fazer o widget de quadradinho para os ranks
        (mínimo (o que já tem dos níveis anteriores), máximo(2 por nível), máximo total(armor))
        Tratar o body devel
        (+1 +2 e zero a cada click. Click diteito aumenta, esquerdo diminui), separar em skills já existentes e novos

    Fazer as background options/itens
        Melhorar itens para ter "poderes"
            - permitir um bonus num skill sempre (item bonus)
            - permitir um bonus num skill quando executa pelo item
            - permitir lançar um spell (qtd de vezes por dia)
            - pp multiplier
            - spell adder
            
    Fazer os criticals

    Fazer os rolls
        SM
        MM
        RR
        Attack
        Spell

    Acertar o CSS

## Débito técnico
    [refactor] Abstrair raça e profissão em addUniqueItem/removeUniqueItem (se usar uma)

# Tricks & code

## Fazer com que o handlebars bata com o name= dos campos

yes, it's normal, but you can change it
If you want the value path to match the name path, you need to modify getData

let sheetData = super.getData()
sheetData.data = sheetData.data.data

## Reference Guides
    https://foundryvtt.wiki/en/development/guides
    https://foundryvtt.wiki/en/development/guides/System-Development-for-Beginners/System-Development-Part-1-I-Made-This

## Inicializar ator/item

    Use o _preCreate

Ethaks — Hoje às 20:22
Using createEmbeddedDocuments does indeed not work when it's called before the actor actually exists on the server.
If this is about adding some default items when an actor is created, I'd recommend using _preCreate however, as per this message: https://discord.com/channels/170995199584108546/811676497965613117/845358148142760016. Some messages down from that one there's also a link to an example of adding items, which involves getting an array of item data objects and adding them to the actor's data via this.data.update (yes, this update's the data, not to be confused with actor/this.update) – the data will be sent to the server in the end.

## Ver se todas as listas de spells estão completas: (calcula quantos itens tem em cada spelllist)
    game.items.entities.reduce((a,i) => { if(i.data.type == "spell") { a[i.data.data.spelllist.id] = a[i.data.data.spelllist.id] + 1 || 1; } return a;}, {})
    // mostra os spells
    game.items.entities.reduce((a,i) => { 
        if(i.data.type == "spell") { 
            let list = a[i.data.data.spelllist.id] || {};
            list[i.data.data.level] = i.data.name; 
            a[i.data.data.spelllist.id] = list;
        } return a;}, {})

    // mostra só as listas que não tem 10
    a = game.items.entities.reduce((a,i) => { 
            if(i.data.type == "spell") { 
                let list = a[i.data.data.spelllist.id] || {};
                list[i.data.data.level] = i.data.name; 
                a[i.data.data.spelllist.id] = list;
            } return a;}, {})

    Object.entries(a).filter((item) => { return Object.entries(item[1]).length != 10; });


## Apagar todos os skills que não estão num folder
for(item of game.data.items.filter((item) => { return item.type == "skill" && item.folder == null; })) { Item.delete([item._id]); console.log(item._id); }

## Apagar todos os atores
for(item of game.data.actors.filter((item) => { return item.type == "character" })) { Actor.delete([item._id]); console.log(item._id); }

# Criando novo tipo de Item

* Altera merp1e.js
  import { Merp1eLanguageSheet } from "./item/language-sheet.js";
  Items.registerSheet("merp1e", Merp1eLanguageSheet, { types: ['language'], makeDefault: true });
* Cria ./item/language-sheet.js
* Cria ./item/language-sheet.html
* Altera template.json (e recarrega o mundo)
* Criar o svg

# adicionando suporte de linguagens
    na xxx-sheet.js
        activateListeners(html) {
+           LanguageSheetHelper.activateListeners(html, this.actor || this.item);
        _updateObject(event, formData) {
+           formData = LanguageSheetHelper.updateLanguages(formData, this);

    na xxx-sheet.html crie uma aba:
        <nav class="sheet-tabs tabs" data-group="primary">
+            <a class="item" data-tab="languages">{{localize "MERP1E.Race.Languages"}}</a>
        <section class="sheet-body">
+       {{!-- Laguages Tab --}}
+       <div class="tab languages" data-group="primary" data-tab="languages">
+           {{> "systems/merp1e/templates/parts/character-sheet-language.html" actor=actor}}
+       </div>

# adicionando suporte ao array-sheet-helper
@xxx-sheet.js

+   import { ArraySheetHelper } from '../array-sheet-helper.js';

    export class Merp1eRaceSheet extends Merp1eBaseItemSheet {
+       languagesHelper = null;

    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;
        
+       this.languagesHelper = new ArraySheetHelper("languages", this, { name: "New Language", ranks: 0 });

    _updateObject(event, formData) {
+       formData = this.languagesHelper.updateObject(formData);
        return this.object.update(formData);
    }

@ xxx-sheet.html
        {{!-- Laguages Tab --}}
        <div class="tab" data-group="primary" data-tab="languages">
+            <div class="languages">
+                <header class="flexrow">
+                    <span class="flex4">{{localize "MERP1E.Languages.Language"}}</span>
+                    <span class="flex1">{{localize "MERP1E.Languages.Ranks"}}</span>
+                    <span class="flex1">
+                        <a class="languages-create" data-action="create-language" title="Create New Language"><i class="fas fa-plus"></i></a>
+                    </span>
+                </header>
+                <div class="languages-list">
+                    {{#each data.languages as |language languageIdx|}}
+                    <li class="languages-list-item item flexrow">
+                            <input class="flex4" name="data.languages.{{languageIdx}}.name" value="{{language.name}}" placeholder='{{localize "MERP1E.Languages.Language"}}' type="text" data-dtype="String"/>
+                            <input class="flex1" name="data.languages.{{languageIdx}}.ranks" value="{{language.ranks}}" min="1" max ="5" placeholder='-' type="number" data-dtype="Number"/>
+                            <span class="flex1">
+                                <a class="languages-delete" data-action="delete-language" title="Delete Item"><i class="fas fa-trash"></i></a>
+                            </span>
+                    </li>
+                    {{/each}}
+                </div>
+            </div>
        </div>

# Como usar o conttrole de criação/deleção/edição de itens da base-sheet.js
    Classes:
    .item-create => para o botão de criação
        <div class="item-controls flexrow">
            <a class="item-control item-create" title="{{localize 'MERP1E.Item.New'}}" option-renderSheet="true" data-type="XXX"><i class="fas fa-plus"></i></a>
        </div>
    .item-edit => para o botão de edição
    .item-delete => para o botão de deleção

    HTML:
    <ol class="item-list">
        <li class="item flexrow" data-item-id="{{item._id}}">
            <div class="item-name flexrow rollable">
                <div class="item-image" style="background-image: url('{{item.img}}')"></div>
                <h4>{{item.name}}</h4>
            </div>
            <div class="...">{{...}}</div>

            {{#if ../../owner}}
            <div class="item-controls flexrow">
                <a class="item-control item-edit" title="{{localize 'MERP1E.Item.Edit'}}"><i class="fas fa-edit"></i></a>
                <a class="item-control item-delete" title="{{localize 'MERP1E.Item.Delete'}}"><i class="fas fa-trash"></i></a>
            </div>
            {{/if}}
        </li>
    {{/each}}
    </ol>

## Font Awesome por damage type
AdditionalDamage: <i class="fas fa-heart"></i>
HitsTaken:  <i class="fas fa-heart-broken"></i> 
HitsPerRound: <i class="fas fa-tint"></i>
ActivityPenalty: <i class="fas fa-minus"></i> 
RoundsActivityPenalty: <i class="fas fa-user-minus"></i>
RoundsDown: <i class="far fa-meh"></i>
RoundsOut: <i class="far fa-dizzy"></i>
RoundsUntilDeath: <i class="fas fa-skull-crossbones"></i>
RoundsStunned: <i class="fas fa-ban"></i>
RoundsBlinded: <i class="fas fa-eye-slash"></i>
RoundsWeaponStuck: <i class="fas fa-gavel"></i>
UnconsciousComa: <i class="fas fa-dizzy"></i>
Arm": "Arm", <i class="far fa-hand-paper"></i>
Leg": "Leg", <i class="fas fa-shoe-prints"></i>
Left": [ok, useless, broken, severed] <i class="fas fa-check-circle"></i> <i class="fas fa-circle"></i> <i class="fas fa-minus-circle"></i> <i class="fas fa-times-circle"></i> 
Right": [useless, broken, severed] (idem)
Paralyzed: Waist, Shoulder, Neck <i class="fas fa-wheelchair"></i>
HearingLoss: [left, right, both] <i class="fas fa-check-circle"> <i class="fas fa-deaf"></i>
EyeLoss: [left, right, both] <i class="fas fa-eye"></i> </i> <i class="fas fa-eye-slash"></i> 


additionalHits
hitsPerRound
activityPenalty
activityPenaltyTemporary
roundsActivityPenalty
roundsDown
roundsOut
roundsUntilDeath
roundsStunned
roundsBlinded
roundsWeaponStuck
unconsciousComa
statusArm
statusLeg
paralzed
statusEars
statusEyes

### Documentation for Health & Damage

{
    "description": "",
    "damageType": "teste",
    "applied": false,
    "reference": "HEAT C 90",
    "text": "",
    "initial": {
        "additionalHits": 11,
        "hitsPerRound": 22,
        "activityPenalty": 33,
        "activityPenaltyTemporary": true,
        "roundsActivityPenalty": 44,
        "roundsDown": 55,
        "roundsOut": 66,
        "roundsUntilDeath": 77,
        "roundsStunned": 88,
        "roundsBlinded": 99,
        "roundsWeaponStuck": 100,
        "unconsciousComa": 101,
        "armDamage": "0",
        "armSide": "0",
        "legDamage": "2",
        "legSide": "1"
        "paralyzed": "1",
        "hearingLoss": "2",
        "eyeLoss": "3",
        "notes": "109"
    },
    "current": {
        "additionalHits": 20,
        "hitsPerRound": 2,
        "activityPenalty": -20,
        "activityPenaltyTemporary": true,
        "roundsActivityPenalty": 2,
        "roundsDown": 0,
        "roundsOut": 0,
        "roundsUntilDeath": 0,
        "roundsStunned": 0,
        "roundsBlinded": 0,
        "roundsWeaponStuck": 0,
        "unconsciousComa": 11,
        "leftArm": "2",
        "rightArm": "0",
        "leftLeg": "0",
        "rightLeg": "3",
        "paralyzed": "1",
        "hearingLoss": "3",
        "eyeLoss": "3",
        "notes": "19"
    }
}



## Geme Settings

Is there any documentation with all possible options for   game.settings.register? The API Docs shows examples for choice and slider, but is there any other options? BTW is there an easy way to put a slider in the character sheet? How is the HTML?

wildj79 — Ontem às 15:44
checkbox by setting data.type to Boolean, standard input text box by setting data.type to String with no choices object, and a number input box with data.type set to Number
there's an example of the slider in core settings, if you want to see how it'll render

## Handlebars

Handlebars.registerHelper({
  checked: HandlebarsHelpers.checked,
  colorPicker: HandlebarsHelpers.colorPicker,
  editor: HandlebarsHelpers.editor,
  filePicker: HandlebarsHelpers.filePicker,
  numberFormat: HandlebarsHelpers.numberFormat,
  localize: HandlebarsHelpers.localize,
  radioBoxes: HandlebarsHelpers.radioBoxes,
  rangePicker: HandlebarsHelpers.rangePicker,
  select: HandlebarsHelpers.select,
  selectOptions: HandlebarsHelpers.selectOptions,
  timeSince: timeSince,
  eq: (v1, v2) => v1 === v2,
  ne: (v1, v2) => v1 !== v2,
  lt: (v1, v2) => v1 < v2,
  gt: (v1, v2) => v1 > v2,
  lte: (v1, v2) => v1 <= v2,
  gte: (v1, v2) => v1 >= v2,
  and() { return Array.prototype.every.call(arguments, Boolean) },
  or() { return Array.prototype.slice.call(arguments, 0, -1).some(Boolean) }
});

## IsGM
agaringer — Ontem às 23:17
Someone else can probably answer your initial question better than I can, but to address what you're trying to do, the easiest thing is to enclose the relevant portion of the sheet in
{{#if isGM}}
...
{{/if}}

agaringer — Ontem às 23:30
Ah, my mistake, you also need to add
data.isGM = game.user.isGM;

to the getData() for that sheet.

## SelectOptions

    Hey, do you have any example selectOptions not working as you think it should ? 
    cuz all my translations are XXXX.xxx.xxx (sometimes more). And I got no issue.
    <select name="data.subType">
        {{selectOptions config.abilitySubTypes selected=data.subType localize=true nameAttr="key" labelAttr="label"}}
    </select>

    M20E.abilitySubTypes= [
    {key: "talent", label: "M20E.subType.talent"},
    {key: "skill", label: "M20E.subType.skill"},
    {key: "knowledge", label: "M20E.subType.knowledge"}
    ]


## Criando uma nova aba

Criar character-sheet-xp.html

Alterar character-sheet.html
```html
    {{!-- Sheet Tab Navigation --}}
    <nav class="sheet-tabs tabs" data-group="primary">
        <a class="item" data-tab="stats">{{localize "MERP1E.CharacterTab.Stats"}}</a>
        <a class="item" data-tab="skills">{{localize "MERP1E.CharacterTab.Skills"}}</a>
        <a class="item" data-tab="languages">{{localize "MERP1E.CharacterTab.Languages"}}</a>
        <a class="item" data-tab="description">{{localize "MERP1E.CharacterTab.Description"}}</a>
        <a class="item" data-tab="spells">{{localize "MERP1E.CharacterTab.Spells"}}</a>
        <a class="item" data-tab="items">{{localize "MERP1E.CharacterTab.Items"}}</a>
        <a class="item" data-tab="health">{{localize "MERP1E.CharacterTab.Health"}}</a>
+       <a class="item" data-tab="xp">{{localize "MERP1E.CharacterTab.XP"}}</a>
    </nav>
  (...)
    {{!-- Health & Damage Tab --}}
    <div class="tab health" data-group="primary" data-tab="health">
      {{> "systems/merp1e/templates/actor/parts/character-sheet-health.html" actor=actor}}
    </div>

+   {{!-- XP Tab --}}
+   <div class="tab xp" data-group="primary" data-tab="xp">
+     {{> "systems/merp1e/templates/actor/parts/character-sheet-xp.html" actor=actor}}
+   </div>
```

Alterar templates.js
```js
    // Define template paths to load
    const templatePaths = [
        // Attribute list partial.
        "systems/merp1e/templates/parts/active-effects.html",
        "systems/merp1e/templates/parts/skill-chooser.html",
        "systems/merp1e/templates/parts/realm-chooser.html",
        "systems/merp1e/templates/parts/spell-chooser.html",
        "systems/merp1e/templates/actor/parts/character-sheet-stat-line.html",
        "systems/merp1e/templates/actor/parts/character-sheet-stats.html",
        "systems/merp1e/templates/actor/parts/character-sheet-description.html",
        "systems/merp1e/templates/actor/parts/character-sheet-languages.html",
        "systems/merp1e/templates/actor/parts/character-sheet-skills.html",
        "systems/merp1e/templates/actor/parts/character-sheet-health.html",
+       "systems/merp1e/templates/actor/parts/character-sheet-xp.html",
        "systems/merp1e/templates/actor/parts/character-sheet-spells.html"
```


Alterar character-sheet.js

```js
  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

  (...)
    html.find(".health").on("click", ".health-control", this.onClickHealthControl.bind(this));
+   html.find(".xp").on("click", ".xp-control", this.onClickXPControl.bind(this));
  }

(...)

  async onClickXPControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;

    switch ( action ) {
    case "consolidate-xp":
      console.log("XXX TODO");
      break
    }
  }
```

Alterar actor.js para tratar os dados.



# DECISIONS

Why don't you implemented skill drap & drop on character sheet?
    I tried to be as faithful as possible on the record sheet. Maybe we can implement drag & drop on secondary skills, but I thought that having all the skills (specially the primary ones) alredy loaded would be better.

Why do skills have reference?
    So it could work flawless when importing itens. Maybe it was too much. Time will tell.

