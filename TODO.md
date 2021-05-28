# TODO
    Alterar as profissões
        para pegarem os skills-itens NA LISTA
        para pegarem os skills-itens por drag & drop e delete
        para permitirem exclusão


    Importar as profissões
    Fazer tela para skills (e deixá-los como Itens)
        Atualizar a itemsheet de profissão e a actor sheet de ficha para pegar os skills do que estiverem disponíveis na biblioteca
	SpellLists
		Atualizar planilha de importção para tratar restricted e restrictedTo e reimportar tudo
    ItemSheet
        Fazer o Daily Spell e o Numbered Spell
			Colocar Optgroup por grupo de spells
            aceitar drag and drop no combo
		COntabilizar os bonuses
    Fazer Tela de Raça 
        Retirar alguns skills que não deveriam aparecer (Plate, Track, Directed Spells, Vários Misc)
        Deixar só os RRs
    Fazer as spellists com X mostre as spells com mais detalhe
    Fazer tela de passagem de nível
        Distribuir os pontos de ranks de skills
        Deixar gastar só eles
        Transferir de um para o outro
    Importar as raças
    Fazer o widget de quadradinho para os ranks
        (mínimo (o que já tem dos níveis anteriores), máximo(2 por nível), máximo total(armor))
        Tratar o body devel
    Fazer as background options/itens
        Melhorar itens para ter "poderes"
            - permitir um bonus num skill sempre (item bonus)
            - permitir um bonus num skill quando executa pelo item
            - permitir lançar um spell (qtd de vezes por dia)
            - pp multiplier
            - spell adder
            
    Fazer health and power
        Hits, Per round, Stun, penalidade na atividade, etc.
        Power Points (multiplier), spell adder

    Fazer os itens com peso e calcular o encumbrance (wear/not wear)
    Fazer os criticals
    Fazer as armas
    Fazer as armas mágicas (+ no skill)
    Fazer os rolls
        SM
        MM
        RR
        Attack
        Spell

Ver se todas as listas estão completas: (calcula quantos itens tem em cada spelllist)
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
