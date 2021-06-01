# TODO
    Usar o meu número de registro e usar a versão mais nova.
    Atualizar a itemsheet de profissão e a actor sheet de ficha para pegar os skills do que estiverem disponíveis na biblioteca

    Sheet: Profession
        Colocar aba de development points
        Importar as profissões

    Sheet: Character
        Implementar uma parada para esconder os skills secundários que estão zerados.
        Implementar um tooltip mostrando a conta
        Fazer o cálculo de power points (nível, stat, e itens mágicos)
        Fazer o cálculo de pontos de vida (aba Health):
            Hits, Per round, Stun, penalidade na atividade, etc.
            Power Points (multiplier), spell adder

        
	Sheet: SpellLists
        Fazer as spells da lista aparecerem com mais detalhe, abaixo do spelllist
        Filtrar (ou colocar desabilitado os spells de nível acima do do personagem)
        Colocar o rank (20/40/60/80/lerned) e desabilitar enquanto estiver com número (e colocar o roll para aprender)
        Colocar botão de prepare e roll

    Sheet: Race
        Retirar alguns skills que não deveriam aparecer (Plate, Track, Directed Spells, Vários Misc)
        Deixar só os RRs
        Importar as raças

    Sheet: Equipment
        Fazer Itens mágicos:
            Daily Spell e o Numbered Uses Spell
			    Colocar Optgroup por grupo de spells
                Aceitar drag and drop no combo
                PP Multiplier
                Spell adder
    		Contabilizar os bonuses no skill
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

# Tricks & code

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


# DECISIONS

Why don't you implemented skill drap & drop on character sheet?
    I tried to be as faithful as possible on the record sheet. Maybe we can implement drag & drop on secondary skills, but I thought that having all the skills (specially the primary ones) alredy loaded would be better.

Why do skills have reference?
    So it could work flawless when importing itens. Maybe it was too much. Time will tell.

