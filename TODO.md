# TODO
Fazer o active effect (aproveita para colocar o part do skill chooser)


Modifier:
* Colocar condições nos skills
    Colocar active effect no skill para fazer bonus opcionais e puxar dos skills globais
    Ao copiar, instanciar no ator, apagar os modificadores "globais"

*    Criar active Effect de adicionar modifier em skill (o condicional)

* Fazer o rolamento na tabela (static, moving)
    escolher qual a rolltable no skill
    colocar conditions
        valor Fixo/Fórmula
        opcional?
        enableFunction
        texto

* criar um item "configuration" com active effects válidos para todo mundo
* fazer com que outros lugares usem o part de skill-chooser
* fazer os outros tipos de rolamento (MM, RR, SP, e ataque)

* Colocar o class="userentry" em todo o resto
* Reorganizar spell
    * colocar só as listas e permitir criar ações favoritas?


    ## Someday/Maybe
        * Melhorar os botões SceneControls#_getControlButtons
        * Refatorar o dado Open Ended:
            - Mudar a fórmula dos dados subsequentes para somar/subtrair direto
            - Permitir/testar assíncrono
            - Fazer uma classe (filha da Roll)  com o dado Open Ended
            - Ou tirar o dice.js de vez (e testar com o dice3d).
            - Retirar a classe mer1eOpenEnded do dice.js ou fazer o tipo de rolamento direito.

    Criar Aba de Actions:
        Colocar uma linha para rolar qualquer skill "self"
        Lista de skills permitidos por itens
        Lista de ataques (dados pelos itens)
        Lista de spells que o personagem pode lançar.

    Effect:
        *? Colocar conditions no skill?
            * Fazer um atualizador de ficha para copiar os skills
        * Fazer novos Active Effects de Action
            ActionSkill / SkillUse
                * cria uma action que permite rolar o skill com um eventual bonus
                - skill
                - bonus
                - condicional (vários)
                - tipo de rolamento (default o do skill): MM/SM/RR/etc.
            Attack
                * cria uma action que permite rolar um ataque skill com um eventual bonus
                ? seria baseado no skillUse to tipo OB?
                - colocar bonus por tipo de armadura
                - colocar tabela de ataque (e de critical)
            ActionSpell / SpellCast
                - spells
                - skill (base spell/directed spells)
            
            Quantidade de usos:
                Daily (max, current, *renew*)
                Charged (max, current)
                Indefinite

        * Melhorar o tratamento se tiverem dois helm types, ar types, leg types, armor types.
        *   colocar uma ordem no active effect - hoje é por ordem de tipo de efeito (sequindo a effectTypes)
        *   Permitir configurar quantos itens são possíveis em cada local

        ActiveEffect skill:
            Colocar Conditional (text to show)

        Criar subclasses: 
            Bonus on static/moving Maneuvers (all)
            Infravision: set dark/light vision
            stunned?
            knocked out?
            down?
            bleeding?

    Actor:
        Aba Status:
            * Melhorar Hitpoint and Statuses (colocar penalidade na atividade, etc.)

        Aba Damage:
            * Testar o heal();
            * fazer os statuses por activeEffect do damage?
            * Refazer o Applied
                Retirar o ícone de apply
                tirar o checkbox => quando cria sem ator é só o initial, quando tem ator é só o current.
            * Colocar a tabela de dano como tabela com borda
            * Colocar a constituição e uncounscious/destroyed
            * Soul departure / stat deterioration
            Colocar os status (Stun, down, out, dead) no token
            Fazer com que as fichas atualizem quando mudar o flag de tipo de damage
            * better treatment of weapon/shield arm. Use the weapon at hand, and if the player is using two weapons, choose randomly/heavier ou left/righ handed.

        Aba skill:
        ?    Colocar "favorite skill" e colocar actions (skill, bonus, conditional bonus)

        Aba description:

        Aba Equipment:
        *   Colocar usable/werable no item (marcado)
        *   Especificar um local onde o item "veste"
            Criar locais para guardar os itens. Criar uma hierarquia
                Body
                +-- Head
                |   +-- Face
                |   +-- Top
                |   +-- Neck
                |   +-- Ears
                |       +-- Left
                |       +-- Right
                +-- Torso
                +-- Arms
                |   +-- Left
                |       +-- Hand
                |       +-- Fingers
                |           +-- Thumb
                |           +-- Index
                |           +-- Middle
                |           +-- Ring
                |           +-- Little
                |   +-- Right
                |           (... same ...)
                +-- Legs
                    +-- Left
                    |   +-- Thigh
                    |   +-- Calf
                    |   +-- Foot
                    +-- Right
                        (... same ...)
                
                Carrying
                Backpack
                Sack
                Room
                ...

        Aba Spells:
            Permitir preparar/Lançar os spells
            Esconder os spells condicionalmente

        Aba language:
            Padronizar o tratamento de criação/exclusão de items (aba Language, item, Spells)

        Aba actions:

        Fazer uma limpeza em rules.js e seus subitens.
        
        Fazer suporte a background options

    Colocar no generic-importer para importar Languages
        Usar o metadata para pegar os tipos de itens
        Pensar alguma maneira de fazer subdocumentos e ActiveEffects

    Fazer features (ActiveEffects). Tipos:
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

    Sheet: Damage
        Colocar o tipo de dano (burn, muscle, bone, etc.)

    Sheet: Race
        Reler raças e colocar os bonus condicionais de skill na planilha (ActiveEffects?)
        Importar as raças
        Retirar as características e colocar tudo em descrição
        Adicionar os efeitos da raça no actor
            skill bonuses (ActiveEffects?)
            adolescence skill rank - fazer ranks por set e colocar na tip do skill

    Sheet: Character
        
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
+       this.languagesHelper.activateListeners(html);

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



## Game Settings

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

Alterar handlehasr-utils.js
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

## Alterando Active Effects
CONFIG.ActiveEffect.sheetClass = WFRPActiveEffectConfig
CONFIG.ActiveEffect.documentClass = ActiveEffectWfrp4e

https://github.com/moo-man/WFRP4e-FoundryVTT/blob/master/modules/apps/active-effect.js
https://github.com/moo-man/WFRP4e-FoundryVTT/blob/master/modules/system/effect-wfrp4e.js

I went a pretty similar route than @Moo Man's, but extended a DocumentSheet rather than the ActiveEffectConfig mostly to get the same feel as any item or actor sheet. (ie: get rid of submit buttons, have EA icon be click editable, etc...)

    Effect:
        Label
        Icon
        Effect Suspended?
        Transfer to Actor?
        


        Duration
            Duration (seconds)
            Effect Start Time
            Effect Duration (rounds/turns)
            Combat Encounter
            Effect Start Turn (rounds/turns)

        Effects
            Attribute Key
            Change Mode (add/multiply/Downgrade/Upgrade/Override)
            Value

        WFRP:
            Effect type: (Manually Invoked, Immediate, Dialog Choice, Prefill Dialog, Pre-prepare Data, Pre-prepare Actor Item, Prepare Data, Pre-wound Calculation, Wound Calculation, Pré-apply Damage, Apply Damage, Pre-Take Damage, Take Damage, Pre-aply condition, Apply Condition, Pre-prepare item, Prepare item, Pre-roll Test, Pre-roll woeapon test)

            Effect:
                Actor
                When Item equipped
                Apply with targeting
                Apply when item applies damage
            
            Hide from players
            Prevent duplicate effect

        On item use/continuous?
        On wear/yield?

## Colocar special effects em um item:

On equipament-sheet.html:
```html
    {{!-- Sheet Tab Navigation --}}
    <nav class="sheet-tabs tabs" data-group="primary">
+       <a class="item" data-tab="specialEffects">{{localize "MERP1E.Effect.SpecialEffects"}}</a>
        <a class="item" data-tab="description">Description</a>
        <a class="item" data-tab="attributes">Attributes</a>
    </nav>

    {{!-- Sheet Body --}}
    <section class="sheet-body">
        {{!-- Special Effect }}
+       <div class="tab" data-group="primary" data-tab="specialEffect">
+           {{> "systems/merp1e/templates/item/parts/special-effect.html" item=item}}
+       </div>
```

On equipment-sheet.js:
```js
import { ArraySheetHelper } from '../array-sheet-helper.js';
+import { Merp1eActiveEffectHelper } from '../active-effect-helper.js';
import { Merp1eBaseItemSheet } from './base-sheet.js';

(...)

export class Merp1eEquipmentSheet extends Merp1eBaseItemSheet {
  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

+   Merp1eActiveEffectHelper.activateListeners(html, this.item);
  }

(...)
}
```

## Criando active Effect novo

* active-effect-sheet.html

```html
    <section class="sheet-body">
        <div class="tab" data-group="primary" data-tab="details">
+           {{#if (eq effect.flags.merp1e.effectType "RankSkillBonus")}}
+               <div class="form-group">
+                   <label>{{ localize "MERP1E.Effect.RankSkillBonus" }}</label>
+                   <div class="form-fields">
+                       <input type="number" name="flags.merp1e.SkillRankBonus.value" value="{{effect.flags.merp1e.SkillRankBonus.value }}"/>
+                   </div>
+               </div>
+               <div class="form-group">
+                   <label>{{ localize "MERP1E.Effect.Skill" }}</label>
+                   <div class="form-fields">
+                       <select name="flags.merp1e.SkillRankBonus.skillReference">
+                           {{#unless effect.flags.merp1e.SkillRankBonus.skillReference}}<option></option>{{/unless}}
+                           {{#each skills as | skillGroup | }}
+                           <optgroup label="{{skillGroup.name}}">
+                               {{#select ../effect.flags.merp1e.SkillRankBonus.skillReference}}
+                                   {{#each skillGroup.skills as | skill | }}
+                                   <option value="{{skill.data.data.reference}}">{{skill.name}}</option>
+                                   {{/each}}
+                               {{/select}} 
+                           </optgroup>
+                           {{/each}}
+                       </select>
+                   </div>
+               </div>
+           {{/if}}
```

* active-effect.js
```js
+class Merp1eActiveEffectRankSkillBonus extends Merp1eActiveEffectBase {
+    static label = "MERP1E.EffectType.RankSkillBonus";
+    static effectName = "RankSkillBonus";
+
+    generateDescription() {
+        let bonus = parseInt(this.data.flags.merp1e?.SkillRankBonus?.value || 0);
+        if(bonus == 0 || this.data.flags.merp1e?.SkillRankBonus?.skillReference == null) {
+            return "Rank Skill Bonus Effect not configured yet";
+        }
+
+        return formatBonus(bonus) + " per rank on skills with reference " + this.data.flags.merp1e?.SkillRankBonus?.skillReference; // XXX I18
+    }
+
+    applyEffect(actor) {
+        Object.values(actor.skills).forEach( skill => {
+            if(skill.data.data.reference == this.data.flags.merp1e?.SkillRankBonus?.skillReference ) {
+                skill.bonuses.itemBonuses.push({ value: this.data.flags.merp1e.SkillRankBonus.value * skill.data.data.ranks }); // put id, and/or a description
+            }
+        });
+    }
+}

(...)

    static effectTypes = [
        Merp1eActiveEffectSkillBonus,
        Merp1eActiveEffectSkillGroupBonus,
+        Merp1eActiveEffectRankSkillBonus
    ];
```

* en.json
```json
    "MERP1E.Effect.New": "New Effect",
    "MERP1E.EffectType.SkillBonus": "Skill Bonus",
    "MERP1E.EffectType.SkillGroupBonus": "Skill Group Bonus",
+   "MERP1E.EffectType.RankSkillBonus": "Skill Rank Bonus",
+   "MERP1E.Effect.RankSkillBonus": "Skill Bonus per Rank",
    "MERP1E.Effect.SkillBonus": "Skill Bonus",
    "MERP1E.Effect.Skill": "Skill",
```

## 
you could CONFIG.debug.hooks = true and see if there's an update happening.

## Instanciar a classe certa

Carter_DC — 16/07/2021
So, I got inspired by the pf2e classes and made this snip (it's for my items atm, cuz I only got 1 actor type atm^^) but works all the same.
```js
export default class M20eItem extends Item {

  /** @override */
  constructor(data, context) {
    //useless in the present case but cool
    //creates a derived class for specific item types
    if ( data.type in CONFIG.Item.documentClasses && !context?.isExtendedClass) {
        // specify our custom item subclass here
        // when the constructor for the new class will call it's super(),
        // the isExtendedClass flag will be true, thus bypassing this whole process
        // and resume default behavior
        return new CONFIG.Item.documentClasses[data.type](data,{...{isExtendedClass: true}, ...context});
    }    
    //default behavior, just call super and do random item inits.
    super(data, context);
  }
```

documentClasses are defined in the init hook with st like : 
```js
  CONFIG.Actor.documentClass = M20eActor;
  CONFIG.Item.documentClass = M20eItem;
  //add references to subclasses for use in the M20eItem constructor
  //proprty names must be valid item types
  CONFIG.Item.documentClasses = {"paradigm": M20eParadigmItem};
```

and lastly, custom item class in it's own file : 
```js
/**
 * Implements M20eParadigmItem as an extension of the M20eItem class
 * Adds specific methods for paradigm items only.
 * @extends {M20eItem}
 */
export default class M20eParadigmItem extends M20eItem {

  /** @override */
  constructor(data, context) {
    super(data, context);
  }

  /** @override */
  async _preCreate(data, options, user){
    log("Je suis un item de paradigme !");
    await super._preCreate(data, options, user);
  }
```

Obviously you'd need some imports, for extended classes in your main (to populate the documentClasses) and your baseItemClass in each of the extended class.
it does debug as

## How to make a new Effect

1) create a new class on active-effect.js
    (check Merp1eItemEffectSkillModifier for example)

2) on active-effect-sheet.js

    check in getData() if sheetData it has all info you need.

3) Create a part named the class "effectName in Kebab Case"-item-effect-part.html. in templates/effect. The part is added automatically by the class.

4) Add the part on active-effect-sheet.js
```js
            {{#if (eq effect.flags.merp1e.effectType "SkillModifier")}}
                {{> "systems/merp1e/templates/effect/skill-modifier-item-effect-part.html" effect=effect rules=rules}}
            {{/if}}
+            {{#if (eq effect.flags.merp1e.effectType "**EFFECTNAME**")}}
+                {{> "systems/merp1e/templates/effect/**EFFECT NAME IN KEBABCASE**-item-effect-part.html" effect=effect rules=rules}}
+            {{/if}}
```

##################
Tommycore — Hoje às 07:36
About custom dice/formulas/etc.
My system will always have exactly two kinds of rolls, which both rely on the same formula: ([POOL]d6cs>4) +/- [MOD]. If more than half the rolled dies showed a 1, it's a fumble (crit fumble if you also didn't roll any successes). There's the simple roll like that, and the extended roll, where you do a series of simple rolls, each with one die less than the previous one until you're satisfied with the result, run out of die, or fumble. Also, players should be allowed to reroll single dies up to a certain amount.
So for convenience I'd like to be able to do something like /r 13s+5/4 for "Roll 13, get result, add 5, allow 4 rerolls.
As far as I understand it, I can register new DiceTerms (like the FateDie is one). But how would I go about that? How can I make sure that by default my custom formula as outlined above will be used? Or at least whenever an "s" term occurs in any roll? How can I have multiple rolls on a single chat card?
I have solutions for my problems, but they're hacky, unelegant, break the system, and/or force me to reimplement parts by myself that are already there. Like catching message that start with /sr and use them for my systemrolls. Which doesn't necessarily always work.
I'm at my wit's end. I know those are a load of questions with probably quite complex answers, but I have no idea what or where to search anymore. Any trail I can pick up on would be much appreciated.
Carter_DC — Hoje às 07:55
how I add a custom modifer usable in a formula : 
/**
 * Adds the custom die modifier 'xs' explodeSuccess, that allows for added auto success on a 10 roll
 */
export function registerDieModifier() {
  //add the modifer to the list with corresponding function name
  Die.prototype.constructor.MODIFIERS["xs"] = "explodeSuccess";
  //add said function to the Die prototype
  Die.prototype.explodeSuccess = function(modifier) {
  //inside is a modified version of the vanilla explode() function
  }
}

That's a start ^^.
I use it in various formulas like one would a regular 'x' or 'xo' modifier.


# DECISIONS

Why don't you implemented skill drap & drop on character sheet?
    I tried to be as faithful as possible on the record sheet. Maybe we can implement drag & drop on secondary skills, but I thought that having all the skills (specially the primary ones) alredy loaded would be better.

Why do skills have reference?
    So it could work flawless when importing itens. Maybe it was too much. Time will tell.


# Chat documentation:

## Chat card (hides on click)
```html
		<div class="chat-card">
			<div class="card-title">Title
			</div>
			<div class="card-content">Details ...
			</div>
		</div>
```
