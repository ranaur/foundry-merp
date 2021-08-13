# TODO
    Actor:
        Retestar Languages (create, edit e del)
        Diferenciar o header dos skills (bold+mudar cor) / fazer em tabela
        Retirar skills e itens da aba de itens
...     Fazer a parte de magia (PP, realm, etc.)
        Fazer a parte de HP/Dano, etc.

    Atualizar a itemsheet de profissão e a actor sheet de ficha para pegar os skills do que estiverem disponíveis na biblioteca

    Colocar no generic-importer para importar Languages
        Usar o metadata para pegar os tipos de itens
        Pensar alguma maneira de fazer subdocumentos

    Fazer features (ActiveEvents). Tipos:
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
        Reler raças e colocar os bonus condicionais de skill na planilha
        Importar as raças
        Retirar as características e colocar tudo em descrição
        Adicionar os efeitos da raça no actor
            stat bonuses
            skill bonuses (fazer feature?)
            adolescence skill rank
            languages

    Sheet: Character
        Contabilizar os bonuses/PP/adder no skill
        Implementar uma parada para esconder os skills secundários que estão zerados.
        Implementar um tooltip mostrando a conta
        Fazer o cálculo de power points (nível, stat, e itens mágicos)
        Fazer o cálculo de pontos de vida (aba Health):
            Hits, Per round, Stun, penalidade na atividade, etc.
            Power Points (multiplier), spell adder
        Fazer um tratamento melhor de spelllist.data.data.chanceOfLearning (permitir só de 20 em 20, e marcar quando aprender)

	Sheet: SpellLists
        Filtrar (ou colocar desabilitado os spells de nível acima do do personagem)
        Colocar botão de prepare e roll

    Sheet: Equipment
        Fazer um major revision para utilizar localização.

        Alterar um widget(part spell-chooser para permitir "receber" spell por drag & drop
            Se arrastar o spell em cima da barra (ou do +), cria um novo item.

        Fazer equipamento por tipo:
            Arma => roll de ataque
            Armadura => AT, DB e MM
            Greaves/Helm => Efeito no DB, critical, etc.
            Container =>
            Ferramenta => Permite roll
            Erva/Poção => Cura/effeito, com contagem de uso (use on Character, e diminui a contagem)
            Fazer o cálculo de DB e AT a partir da armadura helm greaves, etc.
        Fazer os itens com peso e calcular o encumbrance (wear/not wear)

        Colocar botão de Roll
        Calacular peso por container/wear
        Fazer o "corpo", container base onde ficam as coisas que estão ativas.


    Sheet: Profession

    Fazer tela de passagem de nível
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

# DECISIONS

Why don't you implemented skill drap & drop on character sheet?
    I tried to be as faithful as possible on the record sheet. Maybe we can implement drag & drop on secondary skills, but I thought that having all the skills (specially the primary ones) alredy loaded would be better.

Why do skills have reference?
    So it could work flawless when importing itens. Maybe it was too much. Time will tell.

