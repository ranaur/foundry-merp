# Tips
    game.merp1e.Merp1eRules
    game.i18n.localize("MERP1E.EffectDescription.ShieldUnset");
    console.log(game.merp1e.Merp1eRules.injury.types.reduce((acc, item) => { const x = item.label.split(".")[2]; acc.push(`"${item.label}": "${x}",`); return acc; }, []).join("\n"));
    console.log(game.merp1e.Merp1eRules.timeframes.reduce((acc, item) => { const x = item.label.split(".")[2]; acc.push(`"${item.abbr}": "${x}",`); return acc; }, []).join("\n"));

    Fazer o resto das raças (depois de Noldor)
    Postar sobre em https://www.youtube.com/watch?v=qj43xV1Edto

# TODO

## Publicar
* Permitir o delete quando o efeito não estiver mais ativo


* Fazer as durations para qualquer efeito (duration)
* Testar duration do tipo combat
* Permitir editar o initial baseado em uma opção do sistema
    Colocar os totais como campos do ator (editáveis dependendo da configuração)
* Aplicar a penalidade nos rolamentos (modifier, ou geral)
* Fazer Die in X rounds
* Fazer death/soul departure
    * Soul Departed
    * Stat Deterioration
    * Preserved

* Implementar o OnTimeInterval/OnRound

## Futuro

* Fazer filmes para mostrar as capacidades:
    Mostrar os detalhas de raça, profissão
    Mostrar os efeitos
    Money


* Fazer combate:

    * Auto naming do encounter
    scene.name/id/number
    encounter number
    world date
    real date
    #participants/pcs/npcs

    * Como escolher quem será o target.
        * Buscar a lista dos combatentes
        * Buscar a lista dos targets
        * Permitir só um target
        * Pedir para o cara clicar no target
        * Fazer com que o target seja escolhido pelo mouse
    * Fazer com que os parries venham da ficha (na aba action)
    * Testar item que aumenta DB (colocar no Dwarf A)
    * Continuar o rolamento do critical
    * Aplicar o dano/critical

* Aplicar XP:
    * Calcular o XP

* Corrigir o skill do throw

* Fazer aba de ação
    * Fazer Missle
        * Encontrar os targets
    (e o card) de prepare/cast spell
    * Prepare na aba de spells
        * Prepare marca no spell que está preparado (active effect no spelllist/ator?) e a quanto tempo
    * Cast spell
        * vê a quantos rounds está preparado
        * posta um card de cast spell.

* Refactoring do dano
    * Criar um tipo de item CriticalStrike
        - descrição
            ? table (heat, cold, grappling&ambalancing, crush, etc.)
            ? roll on table
        - referência (tabela, pág, num
        ? location
        - Effects
            1) Extra Damage/Hits Taken
            2) Activity Penalty (damage type: bone, muscle, organ, etc.)
            3) Stun N rounds
            4) Break/Useless/Sever/Destroy
                - Hand (L/R)
                - Arm (L/R)
                - Upper Leg (L/R)
                - Lower Leg (L/R)
                - Eye (L/R)
                - Ear (L/R)
                - Nose
            - Break Shield
            - Coma/Unconscious
                - duration: rounds, days, indefinite
            - Knock Down: N rounds
            - Paralyzed
                - Shoulder Down
                - Neck Down
                - duration:
                    - duration: rounds, days, indefinite
                    - while with shield
                    - for the combat
            - Dies in X rounds
                - Dies Immediately (0 rounds?)
            - hits/round (location)
                - duration:
            - Weapon Struck
            - Weapon Break
            - Shield Break
            - Destroy Footwear
            - Destroy back itens
            - Destroy armor (fuse)
            - A Critical on target
            - A Critical on attacker
            - Mute
                - duration
            - Blind
                - duration
            - Knock X feets away
            - Drop weapon
                - X Feets away
            - Damage Attacker
            - Pin Attacker
            



* Fazer o calendário (CalendarApp)
    game.time.advance(-10)
    game.time.worldTime
        Setar o dia/mês/ano
        Configurar o calendário
        Setar/adiantar/atrasar o relógio
        Próximo round/turno/dia


* Fazer os outros tipos de rolamento:
    * Fazer overload de RollableTable
        Fazer com que os active effects usem o mesmo part
        Fazer com que o active effect adicione um grupo de modifiers?
        Colocar o Modifiers no skill?
        Colocar um campo descrevendo as colunas
        Fazer o tratamento do Modifier no Chatcard
        @ Permitir colocar Type (attack table, maneuver Table, etc.)
        @ Permitir colocar reference (e mudar a busca)
        Ajustar os chatcards

    * Colocar Maximum Attack Size no Attack-Effect
    * Processar o Critical Máximo e o Secondary Critical

    * No controle de quais spells mostrar, levar em conta o limite da profissão (warrior até o 3o, rogue 50, etc.)
        character-sheet-spells.html
            {{#if (le spell.level ../../actor.level)}} deve ser algo mais sofisticado, perguntando pro spell se ele "pode" ser lancádo pelo ator.

    * ?fazer o wear funcionar dentro do container (na scabard weared aceita, se for carried, não )

    * Conditions
        : flank Attack
        : rear Attack
        : distance
        : Defender surprised.*					
        : Defender stunned or down.*					
        : For each 10' that the attacker has moved.					
        : If attacker drawing, changing weapons, or unslinging a shield.					
        : If attacker has taken over half of his hits.					

    Actor:
        Aba action:
            Implementar Melee
                Adicionar um combo de target
                    Combo com os targets no combate
                    Botão para buxar quem ele marcou como target (ou colocar um hook na hora de escolher o target)
                Mapear na tabela de Ataque
                Tratar os criticals (rolar novamente)
                Implementar de aplicar o critical no target
            Implementar Throw/MIssile
                No throw o objeto, 
                    ** mudar o skill para throw
                    ** se for um objeto fungível, procura um item com mesmo nome (droppped) e adiciona lá, diminuindo a quantidade do item original (arma)
                    ** se não for, mudar o lugar para stored/dropped
            Fazer o mesmo com o Spell em Directed Spells (isMIssile vai virar, attack typoe: Melee/Throw, Missile, Spell)

            Permitir colocar o escudo (se tiver)

            Armas de missile devem ter load/reload/unload
                * Listar todos os objetos com propriedade de flechas
                * Colocar ammonition type no tipo de ataque da arma
             
             
             (o mesmo vai ser com os spells aprendidos)
        Implementar um container dropped e adicionar um texto com location
            Criar um método drop que coloca o item como dropped e no location coloca a cena/célula
             
    Ataque:
        Tables:
            Range Table
    OK      Attack Tables
            Critical Tables

    OK  Effect:
            Attack:
                Attack Table
                Maximum attack size
                Skill
                Can Use with Shield?

                Weapon Bonus, Critical Table
                Fumble Number
                Fumble Crit? none => A-E
                Primary Crit
                Secondary Crit
                (Throw/Missile) Base Range 
                Missile Weapon?
                #rounds Load
                #rounds Reload
                load/reload Penalty
                Melee Range
                Armor Modification
                    PL, CH, RL, SL, NO

        * Fazer as tabelas de Critical (gerando Item Damage)
            * Roll de critical deve poder alterar o resultado pelo Ambush

        CARD:
            Attacant:
                Weapon => Table, Skill, Weapon Bonus, Critical Table
                Offensive Bonus
                Parry
            Target:
                Defensive Bonus
                Parry
            Bonus/Penalty:
            
            ROLL:

            Result:
                Damage, Critical

            If Critical:
                Second Roll
                Result

        Ver a distância do alvo (target) e usar a tabela de distância.

    Base Spell
    Directed Spell Cast
* Reorganizar spells para aceitarem ActiveEffects e aplicarem no target
    O spelllist importaria todos os spells de dentro dela para o personagem (com os efeitos).
    Tem que ver se faz isso faz fentido
* Fazer com que os itens permitam fazer rolls de skills (com bonus) ou ataques, ou lançar spells
* impedir alteração de skill por quem não é GM nas raças e profissões (colocar classe gm-select-only)
* Explorar actor.getActiveTokens() => e mudar no caso de infravision
    * fazer o infravision para alterar a visão do personagem automaticamente. 
* Colocar um link para a tabela de fumble no caso de MM (fumble) e para o efeitos de static maneuver
* Combat Tracker (permitir adicionar um nome)
    Choose action fase
        Telinha para escolherem o que fazer
            Ação
            Podem repetir o round anterior
            Podem evoluir prepare para cast
            Podem pedir auto reload de missile
            Podem pedir para trocar de arma
            Quem estiver de melee pode escolher quanto de parry vão dar
        Botao para o GM mudar a fase: trava e ordenar tudo pelas ações e rola as iniciativas

        Missile/Spell phase Primeiro
        Meele phase
        Static Maneuver
        Movement

    Quando virar o round: Upkeeping phase
        Todo dano (stun, etc) tem o combat/ round/turn que ocorreu
        Fase de upkeeping vê se o personagem agiu antes do dano (stun etc. para diminuir)

* Fazer NPC

    ## New
        Fazer um "controlador do tempo"

    ## Someday/Maybe
        * Consertar language para escolher de uma lista
        * Alterar a estrutura da ChatMessage para honrar a permissão do ator, e não do usuário
            - vai precisar herdar de ChaMessage e reconfigurar no CONFIG
            - alterar o _canUpdate para, se tiver um actorID no data, fazer 
            - retirar o código do Merp1eBaseChatCard._generateChatData com XXX (linha 102: // XXX: Change the update control ...)

        * Ver se a mensagem de chatcard pode virar um roll
            ? talvez, para isso eu precisasse criar o DiceRoll para o open ended e assoaiar à mensagem

        * Criar o flag dos maneuvers serem em whisper e só publicarem o resultado.

        * Colocar o class="userentry" em todo o resto
        * colocar no resistence roll a possibilidade de escolher o ator (se estiver em uma luta, ou listar os atores da cena se for GM)
        * Melhorar os botões SceneControls#_getControlButtons
        * Refatorar o dado Open Ended:
            - Mudar a fórmula dos dados subsequentes para somar/subtrair direto
            - Permitir/testar assíncrono
            - Fazer uma classe (filha da Roll)  com o dado Open Ended
            - Ou tirar o dice.js de vez (e testar com o dice3d).
            - Retirar a classe mer1eOpenEnded do dice.js ou fazer o tipo de rolamento direito.
        * Colocar um valueFunction que permite substituir os dados (@stBonus + 10)

    Criar Aba de Actions:
        Colocar uma linha para rolar qualquer skill "self"
        Lista de skills permitidos por itens
        Lista de ataques (dados pelos itens)
        Lista de spells que o personagem pode lançar.

    Effect:
        * Fazer novos Active Effects de Action
            ActionSkill / SkillUse
                * cria uma action que permite rolar o skill com um eventual bonus
                - skill
                - bonus
                - modificadores
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

        Novo Efeito: 
            Infravision: set dark/light vision no token doi personagem

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

        Aba Skill:
            Colocar um botão para reimportar todos os skills.
            Colocar para esconder os skills com rank 0.

        Aba Description:

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
            Esconder os spells condicionalmente (ver o chatcard)

        Aba language:
            Padronizar o tratamento de criação/exclusão de items (aba Language, item, Spells)

        Aba actions:

        Fazer uma limpeza em rules.js e seus subitens.
        
    Colocar no generic-importer para importar Languages
        Usar o metadata para pegar os tipos de itens
        Pensar alguma maneira de fazer subdocumentos e ActiveEffects

    Sheet: Damage
        Colocar o tipo de dano (burn, muscle, bone, etc.)

    Sheet: Race

    Sheet: Character
        Implementar um tooltip mostrando os efeitos
        Permitir que o jogador reimporte a raça/profissão. Ou o GM edite.
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

        Calacular peso por container/wear
        Fazer o "corpo", container base onde ficam as coisas que estão ativas.

    Sheet: Profession

    Fazer tela de passagem de nível/criação de personagem
        Distribuir os pontos de ranks de skills
        Deixar gastar só eles
        Transferir de um para o outro

    Fazer os criticals

    Acertar o CSS

    * tela de combate
        Next round => publicar no chat um card dizendo qual o round
        set action
    * tela de controle de tempo
        set date
            configura calendar
                no. meses
                dias por mês
                dias intercalados (critério)
        set hour
            num horas por dia
            num minutos por horas
        set round
        next round
        next turn
        

## Débito técnico

    ## Item size/Max item size of container
        * max item size (tiny, small, medium, large)

    ## Places to wear
        * Fazer teste para ver se é possível "wear" o item.
    {{!--
        <div class="resource flexrow">
            <label class="resource-label">{{localize "MERP1E.Equipment.PlacesAllowedToWear"}}</label>
            <select name="data.placesAllowedToWear" multiple size="{{bodyPlaces.length}}" {{gmonly}}>
                {{#each bodyPlaces as | bodyPlace | }}
                <option value="{{bodyPlace.id}}" {{#if (in bodyPlace.id ../data.data.placesAllowedToWear)}}selected{{/if}}>{{localize bodyPlace.label}}</option>
                {{/each}}
            </select>
        </div>
    --}}

    /*
    static bodyPlaces = [
        { id: "none", label: "MERP1E.BodyPlaces.None" },
        { id: "fingers", label: "MERP1E.BodyPlaces.Fingers", numAllowedItems: 2 },
        { id: "mainhand", label: "MERP1E.BodyPlaces.MainHand", numAllowedItems: 1 },
        { id: "offhand", label: "MERP1E.BodyPlaces.OffHand", numAllowedItems: 1 },
        { id: "hands", label: "MERP1E.BodyPlaces.Hand", numAllowedItems: 1 },
        { id: "arms", label: "MERP1E.BodyPlaces.Arm", numAllowedItems: 1 },
        { id: "torso", label: "MERP1E.BodyPlaces.Torso", numAllowedItems: 1 },
        { id: "back", label: "MERP1E.BodyPlaces.Back", numAllowedItems: 1 },
        { id: "neck", label: "MERP1E.BodyPlaces.Neck", numAllowedItems: 1 },
        { id: "head", label: "MERP1E.BodyPlaces.Head", numAllowedItems: 1 },
        { id: "legs", label: "MERP1E.BodyPlaces.Legs", numAllowedItems: 1 },
        { id: "feet", label: "MERP1E.BodyPlaces.Feet", numAllowedItems: 1 },
    ];
    */

    "MERP1E.BodyPlaces.None": "None",
    "MERP1E.BodyPlaces.Fingers": "Fingers",
    "MERP1E.BodyPlaces.MainHand": "Main Hand",
    "MERP1E.BodyPlaces.OffHand": "Off Hand",
    "MERP1E.BodyPlaces.Hand": "Hand",
    "MERP1E.BodyPlaces.Arm": "Arm",
    "MERP1E.BodyPlaces.Back": "Back",
    "MERP1E.BodyPlaces.Torso": "Torso",
    "MERP1E.BodyPlaces.Neck": "Neck",
    "MERP1E.BodyPlaces.Head": "Head",
    "MERP1E.BodyPlaces.Legs": "Legs",
    "MERP1E.BodyPlaces.Feet": "Feet",




# Tricks & code

## Fazer um novo card

templates/chat/xxx-chatcard.html
    (use parts, if possible)
modules/chat/xxx-chatcard.js


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

* Cria ./item/language-sheet.js
* Cria ./item/language-sheet.html
* Altera merp1e.js
  import { Merp1eLanguageSheet } from "./item/language-sheet.js";
  Items.registerSheet("merp1e", Merp1eLanguageSheet, { types: ['language'], makeDefault: true });
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
+                   <label>{{ localize "MERP1E.EffectItem.RankSkillBonus" }}</label>
+                   <div class="form-fields">
+                       <input type="number" name="flags.merp1e.SkillRankBonus.value" value="{{effect.flags.merp1e.SkillRankBonus.value }}"/>
+                   </div>
+               </div>
+               <div class="form-group">
+                   <label>{{ localize "MERP1E.EffectItem.Skill" }}</label>
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
+   "MERP1E.EffectItem.RankSkillBonus": "Skill Bonus per Rank",
    "MERP1E.EffectItem.SkillBonus": "Skill Bonus",
    "MERP1E.EffectItem.Skill": "Skill",
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

* Mostrar uma tela para os jogadores
Can you initiate an event and have a screen pop up for another player? If a player rolls an attribute, it would open up a screen for the GM to input a TN, and then proceed with further calculations?

This also interests me. Can you point some code in some system that does this, please? :slight_smile:
Skimble — Hoje às 15:00
@ranaur I use a socket in my code for XCard, that's a pretty straightforward example of a module, but the approach is the same for a system
Skimble — Hoje às 15:28
https://github.com/sk1mble/xcard

See the socket:true declaration in the JSON, the game.socket.emit syntax on line 56 of XCard.js, and the hook in line 64- that sets up the hook response.

* object comparison

https://stackoverflow.com/questions/1068834/object-comparison-in-javascript

function deepCompare () {
  var i, l, leftChain, rightChain;

  function compare2Objects (x, y) {
    var p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
         return true;
    }

    // Compare primitives and functions.     
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
        return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
       (x instanceof Date && y instanceof Date) ||
       (x instanceof RegExp && y instanceof RegExp) ||
       (x instanceof String && y instanceof String) ||
       (x instanceof Number && y instanceof Number)) {
        return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
        return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
        return false;
    }

    if (x.constructor !== y.constructor) {
        return false;
    }

    if (x.prototype !== y.prototype) {
        return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
         return false;
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
            return false;
        }
    }

    for (p in x) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
            return false;
        }

        switch (typeof (x[p])) {
            case 'object':
            case 'function':

                leftChain.push(x);
                rightChain.push(y);

                if (!compare2Objects (x[p], y[p])) {
                    return false;
                }

                leftChain.pop();
                rightChain.pop();
                break;

            default:
                if (x[p] !== y[p]) {
                    return false;
                }
                break;
        }
    }

    return true;
  }

  if (arguments.length < 1) {
    return true; //Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {

      leftChain = []; //Todo: this can be cached
      rightChain = [];

      if (!compare2Objects(arguments[0], arguments[i])) {
          return false;
      }
  }

  return true;
}

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


### ActiveEffect

<!--
        <div>
            <h2>Category & Localization</h2>
            <div class="form-group">
                <label>{{ localize "Location" }}</label>
                <div class="form-fields">
                    <select name="flags.merp1e.Injury.location">
                        {{#unless effect.flags.merp1e.Injury.location}}<option></option>{{/unless}}
                        {{selectOptions injuryLocations selected=effect.flags.merp1e.Injury.location localize=true nameAttr="id" labelAttr="label"}}
                    </select>
                </div>
            </div>
        </div>

        {{!-- Duration Tab --}}
        <div>
            <h2>Duration</h2>
            <div class="form-group">
                <label>{{ localize "Type" }}</label>
                <div class="form-fields">
                    <select name="flags.merp1e.duration">
                        {{selectOptions injuryDurations selected=effect.flags.merp1e.duration localize=true nameAttr="id" labelAttr="label"}}
                    </select>
                </div>
            </div>
            <hr/>
            {{#if (eq effect.flags.merp1e.duration "time")}}
            <div class="form-group">
                <label>{{ localize "EFFECT.DurationSecs" }}</label>
                <div class="form-fields">
                    <input type="number" name="duration.seconds" value="{{ effect.duration.seconds }}"/>
                </div>
            </div>
                {{#if effect.applied}}
                <hr/>
                <div class="form-group">
                    <label>{{ localize "EFFECT.StartTime" }}</label>
                    <div class="form-fields">
                        <input type="number" name="duration.startTime" value="{{ effect.duration.startTime }}"/>
                    </div>
                </div>
                {{/if}}
            {{/if}}
            {{#if (eq effect.flags.merp1e.duration "combat")}}
            <div class="form-group">
                <label>{{ localize "EFFECT.DurationTurns" }}</label>
                <div class="form-fields">
                    <label>{{ localize "COMBAT.Rounds" }}</label>
                    <input type="number" name="duration.rounds" value="{{ effect.duration.rounds }}"/>
                    <label>{{ localize "COMBAT.Turns" }}</label>
                    <input type="number" name="duration.turns" value="{{ effect.duration.turns }}"/>
                </div>
            </div>
                {{#if effect.applied}}
                <hr/>
                <div class="form-group">
                    <label>{{ localize "EFFECT.Combat" }}</label>
                    <div class="form-fields">
                        <input type="text" name="duration.combat" value="{{ effect.duration.combat }}" disabled/>
                    </div>
                </div>
                <div class="form-group">
                    <label>{{ localize "EFFECT.StartTurns" }}</label>
                    <div class="form-fields">
                        <label>{{ localize "COMBAT.Round" }}</label>
                        <input type="number" name="duration.startRound" value="{{ effect.duration.startRound }}"/>
                        <label>{{ localize "COMBAT.Turn" }}</label>
                        <input type="number" name="duration.startTurn" value="{{ effect.duration.startTurn }}"/>
                    </div>
                </div>
                {{/if}}
            {{/if}}
        </div>

        {{!-- Details Tab --}}
        <div class="tab flexcol" data-group="primary" data-tab="details">
            <div>
                <label>{{ localize "EFFECT.Label" }}</label>
                <div class="form-fields">
                    <input type="text" name="label" value="{{ effect.label }}"/>
                </div>
            </div>
    
            <div>
                <label>{{ localize "EFFECT.Icon" }}</label>
                <div class="form-fields">
                    {{filePicker target="icon" type="image"}}
                    <input class="image" type="text" name="icon" placeholder="path/image.png" value="{{effect.icon}}"/>
                </div>
            </div>
    
            <div>
                <label>{{ localize "EFFECT.IconTint" }}</label>
                <div class="form-fields">
                    <input class="color" type="text" name="tint" value="{{effect.tint}}"/>
                    <input type="color" value="{{effect.tint}}" data-edit="tint"/>
                </div>
            </div>
    
            <div>
                <label>{{ localize "EFFECT.Disabled" }}</label>
                <input type="checkbox" name="disabled" {{ checked effect.disabled }}/>
            </div>
    
            {{#if isActorEffect}}
            <div class="form-group">
                <label>{{ localize "EFFECT.Origin" }}</label>
                <div class="form-fields">
                    <input type="text" name="origin" value="{{ effect.origin }}" disabled/>
                </div>
            </div>
            {{/if}}
    
            {{!--#if isItemEffect --}}
            <div class="form-group">
                <label>{{ localize "EFFECT.Transfer" }}</label>
                <div class="form-fields">
                    <input type="checkbox" name="transfer" {{checked effect.transfer}}/>
                </div>
            </div>
            {{!-- /if --}}
        </div>
    </section>
--> 
<!--
    <section class="tab" data-tab="details">
    </section>


    <section class="tab" data-tab="effects">
        <header class="effect-change effects-header flexrow">
            <div class="key">{{ localize "EFFECT.ChangeKey" }}</div>
            <div class="mode">{{ localize "EFFECT.ChangeMode" }}</div>
            <div class="value">{{ localize "EFFECT.ChangeValue" }}</div>
            <div class="effect-controls">
                <a class="effect-control" data-action="add"><i class="far fa-plus-square"></i></a>
            </div>
        </header>
        <ol class="changes-list">
            {{#each effect.changes as |change i|}}
            <li class="effect-change flexrow" data-index="{{i}}">
                <div class="key">
                    <input type="text" name="changes.{{i}}.key" value="{{change.key}}"/>
                </div>
                <div class="mode">
                    <select name="changes.{{i}}.mode" data-dtype="Number">
                        {{selectOptions ../modes selected=change.mode}}
                    </select>
                </div>
                <div class="value">
                    <input type="text" name="changes.{{i}}.value" value="{{change.value}}"/>
                </div>
                <div class="effect-controls">
                    <a class="effect-control" data-action="delete"><i class="fas fa-trash"></i></a>
                </div>
            </li>
            {{/each}}
        </ol>
    </section>

    <section class="tab" data-tab="wfrp">
        <div class="form-group">
            <label class="label-text">{{localize "EFFECT.adapterName"}}</label>
            <select class="effect-type" {{#if disableTrigger}} disabled {{/if}}>
              {{#select effect.flags.wfrp4e.effectTrigger}}
              <option value=""></option>
              {{#each effectTriggers as |label key|}}
              <option value="{{key}}">{{label}}</option>
              {{/each}}
              {{/select}}
            </select>
        </div>

        {{#if showEditor}}
        <textarea name="flags.wfrp4e.script" placeholder="{{placeholder}}">{{effect.flags.wfrp4e.script}}</textarea>
        {{/if}}

        {{#if (eq effect.flags.wfrp4e.effectTrigger "dialogChoice")}}
            <div class="form-group">
                <label class="label-text">{{localize "Description"}}</label>
                <input name="flags.wfrp4e.effectData.description" value="{{effect.flags.wfrp4e.effectData.description}}" data-dtype="String"/>
            </div>

            <div class="form-group">
                <label class="label-text">{{localize "Modifier"}}</label>
                <input name="flags.wfrp4e.effectData.modifier" value="{{effect.flags.wfrp4e.effectData.modifier}}"data-dtype="Number"/>
            </div>

            <div class="form-group">
                <label class="label-text">{{localize "DIALOG.SLBonus"}}</label>
                <input name="flags.wfrp4e.effectData.slBonus" value="{{effect.flags.wfrp4e.effectData.slBonus}}"data-dtype="Number"/>
            </div>

            <div class="form-group">
                <label class="label-text">{{localize "DIALOG.SuccessBonus"}}</label>
                <input name="flags.wfrp4e.effectData.successBonus" value="{{effect.flags.wfrp4e.effectData.successBonus}}"data-dtype="Number"/>
            </div>

            <div class="form-group">
                <label class="label-text">{{localize "DIALOG.DifficultyStep"}}</label>
                <input name="flags.wfrp4e.effectData.difficultyStep" value="{{effect.flags.wfrp4e.effectData.difficultyStep}}"data-dtype="Number"/>
            </div>
        {{/if}}
        <div class="form-group">
            <label class="label-text">{{localize "EFFECT.EffectApplication"}}</label>
            <select class="effect-application" name="flags.wfrp4e.effectApplication">
              {{#select effect.flags.wfrp4e.effectApplication}}
              {{#each effectApplication as |label key|}}
              <option value="{{key}}">{{label}}</option>
              {{/each}}
              {{/select}}
            </select>
        </div>

        <div class="form-group">
            <label>{{ localize "EFFECT.HideEffect" }}</label>
            <div class="form-fields">
                <input type="checkbox" name="flags.wfrp4e.hide" {{checked effect.flags.wfrp4e.hide}}/>
            </div>
        </div>

        <div class="form-group">
            <label>{{ localize "EFFECT.PreventDuplicate" }}</label>
            <div class="form-fields">
                <input type="checkbox" name="flags.wfrp4e.preventDuplicateEffects" {{checked effect.flags.wfrp4e.preventDuplicateEffects}}/>
            </div>
        </div>

        {{!-- Description Tab --}}
        <div class="tab" data-group="primary" data-tab="description">
            {{editor content=data.data.description target="data.description" button=true owner=owner editable=editable}}
        </div>
    </section>
-->



