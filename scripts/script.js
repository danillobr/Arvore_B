// Constantes
const largura_chave = 32; // Largura da chave
const altura_chave = 32; // Altura  da chave
const espaco_entre_nos = 32; // Espaçamento entre nós
const deslocamento = 16; // Deslocamento de rolagem
// Constantes para o método DesenhaArvoreB.draw
const centro_raiz = 0;
const centro_no = 1;
const rolagem = 2;

/*
No: representa um nó em uma árvore b
     ord: a ordem da árvore à qual o nó pertence.
*/
function No(ordem) {
    this.ordem = ordem;
    this.pai = null; // o nó pai do nó (nulo para o nó raiz).
    this.chaves = []; // a matriz de chaves do nó.
    this.filhos = []; // matriz de nós filhos classificados do nó
    this.x = 0; // coordenada x do nó na tela
    this.y = 0; // coordenada y do nó na tela

    /*
    folha: verifica se o nó é uma folha.
    Retorna: true se o nó for uma folha, caso contrário, retona false
    */
    this.folha = function () {
        return this.filhos.length == 0;
    }

    /*
    ultrapassou: verifica se o nó tem mais chaves do que a ordem permite
    Retorna: True se o nó tiver chaves em excesso.
    */
    this.ultrapassou = function () {
        return this.ordem <= this.chaves.length;
    }

    /*
    dividir: divide o nó em dois
    Retorna: a chave mediana do nó original.
    * nota: o novo nó é colocado no final do nó mais antigo da matriz de filhos.
    */
    this.dividir = function () {
        var chave_centro = Math.floor(this.ordem / 2) + 1;
        var novo_no = new No(this.ordem);
        novo_no.chaves = this.chaves.slice(chave_centro);
        novo_no.filhos = this.filhos.slice(chave_centro);
        for (var x in novo_no.filhos)
            novo_no.filhos[x].pai = novo_no;
        this.chaves = this.chaves.slice(0, chave_centro);
        this.filhos = this.filhos.slice(0, chave_centro);
        this.filhos.push(novo_no);
        return this.chaves.pop();
    }

    /*
    adiciona_chave: adiciona uma chave à matriz de chaves do nó (na posição correta
         para manter a matriz ordenada).
         chave: o valor a ser adicionado.
     Retorna: a posição em que a chave foi inserida na matriz.
    */
    this.adiciona_chave = function (chave) {
        var i = 0;
        while (i < this.chaves.length && this.chaves[i] < chave) {
            i++;
        }
        this.chaves.splice(i, 0, chave);
        return i;
    }

    /*
    remove_chave: remove uma chave à matriz de chaves do nó (na posição correta
         para manter a matriz ordenada).
         chave: o valor a ser adicionado.
     Retorna: a posição em que a chave foi removida na matriz.
    */
    this.remove_chave = function (chave) {
        var i = 0;
        while (i < this.chaves.length && this.chaves[i] < chave) {
            i++;
        }
        this.chaves.splice(i, 1);
        return i;
    }

    /*
    buscar: função recursiva para pesquisar o nó e seus filhos
        pela presença de um valor.
        chave: valor a ser pesquisado.
    Retorna: o nó que contém a chave e o índice no diretório
        matriz de chaves ou [nulo, 0] se a chave não for encontrada.
    */
    this.buscar = function (chave) {
        var i = 0;
        while (i < this.chaves.length) {
            if (this.chaves[i] == chave) {
                x = this.chaves[i];
                return [this, i];
            }
            else if (this.chaves[i] > chave) {
                if (this.folha())
                    return [null, 0];
                else
                    return this.filhos[i].buscar(chave);
            }
            else
                i++;
        }
        if (this.folha())
            return [null, 0];
        else
            return this.filhos[i].buscar(chave);
    }
}

/*
ArvoreB: uma árvore B.
     ordem: a ordem da árvore.
     raiz: o nó raiz da árvore.
*/
function ArvoreB(ordem) {
    this.ordem = ordem;
    this.raiz = new No(this.ordem);

    this.x_deslocamento = 0;
    this.y_deslocamento = 0;

    /*
         encontrar_folha: encontre o nó da folha correto para inserir uma chave.
             nó: raiz da subárvore a ser pesquisada.
             chave: valor usado para encontrar um nó folha.
         Retorna: o nó folha no qual a chave deve ser inserida.
         */
    this.encontrar_folha = function (no, chave) {
        if (no.folha()) {
            return no;
        }
        else {
            var i = 0;
            while (no.chaves.length > i && chave > no.chaves[i]) {
                i++;
            }
            return this.encontrar_folha(no.filhos[i], chave);
        }
    }

    /*
         encontrar_folha: encontre o nó da folha correto para inserir uma chave.
             nó: raiz da subárvore a ser pesquisada.
             chave: valor usado para encontrar um nó folha.
         Retorna: o nó folha no qual a chave deve ser inserida.
         */
    this.encontrar_tipo_no = function (no, chave) {
        if (no.folha()) {
            return no;
        }
        else {
            var i = 0;
            while (no.chaves.length > i && chave > no.chaves[i]) {
                i++;
            }
            return this.encontrar_folha(no.filhos[i], chave);
        }
    }

    /*
    buscar_chave: pesquisa a existência e posição de uma chave na árvore
    chave: o valor a ser pesquisado.
    Retorna: o nó que contém a chave e o índice no diretório da matriz de chaves ou [nulo, 0] se a chave não for encontrada.
    */
    this.buscar_chave = function (chave) {
        return this.raiz.buscar(chave)
    }

    /*
     inserir_chave: insere uma nova chave na árvore
     chave: a nova chave a ser inserida
     Retorna: o nó no qual a chave foi inserida.
    */
    this.inserir_chave = function (chave) {
        var insere_nesse_no = this.encontrar_folha(this.raiz, chave);
        insere_nesse_no.adiciona_chave(chave);

        while (insere_nesse_no.ultrapassou()) {
            var chave_centro_insere_nesse_no = insere_nesse_no.dividir();
            var insere_no_filhos = insere_nesse_no.filhos.pop();

            if (insere_nesse_no.pai != null) {
                insere_nesse_no = insere_nesse_no.pai;
                var indice = insere_nesse_no.adiciona_chave(chave_centro_insere_nesse_no);
                insere_nesse_no.filhos.splice(indice + 1, 0, insere_no_filhos);
                insere_no_filhos.pai = insere_nesse_no;
            } else {
                this.raiz = new No(this.ordem);
                this.raiz.adiciona_chave(chave_centro_insere_nesse_no);
                this.raiz.filhos.push(insere_nesse_no);
                this.raiz.filhos.push(insere_no_filhos);
                insere_no_filhos.pai = this.raiz;
                insere_nesse_no.pai = this.raiz;
                insere_nesse_no = insere_nesse_no.pai;
            }
        }
    }

    /*
     remover_chave: remove uma nova chave na árvore
     chave: a chave a ser removida
     Retorna: o nó no qual a chave foi removida.
    */
    this.remover_chave = function (chave) {
        var taxa_ocupacao = Math.round(this.ordem / 2) - 1;
        var resultado = this.buscar_chave(chave);
        remove_nesse_no = resultado[0];
        posicao = resultado[1];

        if (remove_nesse_no.folha() && taxa_ocupacao < remove_nesse_no.chaves.length) {
            remove_nesse_no.remove_chave(chave);
        } else {
            alert("A chave não pode ser removida, pois o nó em que ela se encontra não é folha e/ou já está com o limite minimo de chaves no nó.");
        }
    }
}

/*
DesenhaArvoreB: um desenho de um objeto ArvoreB
árvore: o ArvoreB a ser representado
tela: uma tela na qual a árvore será representada
*/
function DesenhaArvoreB(arvore, canvas) {
    this.arvore = arvore;
    this.canvas = canvas;
    this.contexto = canvas.getContext("2d");
    this.realcar = null;

    /*
    desenhar: (re) pinta a árvore
         modo: descreve o motivo do (re) desenho
         centro_raiz: centralizando a raiz na parte superior
         centro_no: centralizar totalmente um nó e, opcionalmente, destacando-o
         rolagem: rolando a árvore, mova-a
         Para cada modo, arg1 e arg2 assumem valores diferentes:
            centro_raiz: arg1 e arg2 não são usados;
            centro_no: arg1 é o nó central e arg2 é a chave de destaque
         rolagem: arg1 é o delta x e arg2 é o delta y
     Devoluções: -
    */
    this.desenhar = function (modo, arg1, arg2) {
        if (modo == undefined)
            modo = centro_raiz;

        // Localize variáveis para facilitar o acesso
        var canvas = this.canvas;
        var contexto = this.contexto;

        canvas.width = canvas.width;
        contexto.clearRect(0, 0, canvas.width, canvas.height);
        contexto.textAlign = "center";
        contexto.textBaseline = "middle";

        contexto.font = "18px arial";

        // Centralize na raiz se centro_no for indefinido
        // A raiz está centralizada de maneira diferente: no centro, na parte superior
        var deltas;
        if (modo != rolagem) {
            function pegar_pontos_do_delta(No, x, y) {
                var meio = (No.chaves.length * largura_chave) / 2;
                return [x - No.x - meio, y - No.y - altura_chave / 2];
            }

            this.posicao_arvore(this.arvore.raiz);
            if (modo == centro_raiz)
                deltas = pegar_pontos_do_delta(this.arvore.raiz,
                    canvas.width / 2,
                    deslocamento * 2 + 8);
            else if (modo == centro_no)
                deltas = pegar_pontos_do_delta(arg1,
                    canvas.width / 2,
                    canvas.height / 2);
            this.mover_arvore(deltas[0], deltas[1]);
            this.realcar = null;
        }
        else {
            this.mover_arvore(arg1 * 5, arg2 * 5);
            // Se estiver rolando, mantenha o realce
            if (this.realcar != null) {
                modo = centro_no;
                arg1 = this.realcar[0];
                arg2 = this.realcar[1];
            }
        }

        this.desenhar_no(this.arvore.raiz, contexto);

        if (modo == centro_no) {
            contexto.lineWidth = 2;
            contexto.strokeStyle = "red"; // lembrete: cor vermelho
            contexto.strokeRect(arg1.x + arg2 * largura_chave,
                arg1.y, largura_chave, altura_chave);
            this.realcar = [arg1, arg2];
        }

        // (Re) desenhe o quadro da tela
        contexto.fillStyle = "#000000"; // lembrete: cor Alumínio
        contexto.beginPath();
        // Seta superior
        contexto.clearRect(0, 0, canvas.width, deslocamento + 4);
        contexto.moveTo(canvas.width / 2, 0);
        contexto.lineTo((canvas.width / 2) - (deslocamento / 2), deslocamento);
        contexto.lineTo((canvas.width / 2) + (deslocamento / 2), deslocamento);

        // Seta da esquerda
        contexto.clearRect(0, 0, deslocamento + 4, canvas.height);
        contexto.moveTo(0, canvas.height / 2);
        contexto.lineTo(deslocamento, canvas.height / 2 + (deslocamento / 2));
        contexto.lineTo(deslocamento, canvas.height / 2 - (deslocamento / 2));

        // Seta de inferior
        contexto.clearRect(0, canvas.height - deslocamento - 4,
            canvas.width, canvas.height);
        contexto.moveTo(canvas.width / 2, canvas.height);
        contexto.lineTo((canvas.width / 2) - (deslocamento / 2),
            canvas.height - deslocamento);
        contexto.lineTo((canvas.width / 2) + (deslocamento / 2),
            canvas.height - deslocamento);

        // Seta da direita
        contexto.clearRect(canvas.width - deslocamento - 4, 0,
            canvas.width, canvas.height);
        contexto.moveTo(canvas.width, canvas.height / 2);
        contexto.lineTo(canvas.width - deslocamento,
            canvas.height / 2 + (deslocamento / 2));
        contexto.lineTo(canvas.width - deslocamento,
            canvas.height / 2 - (deslocamento / 2));

        contexto.closePath();
        contexto.fill();
    }

    /*
    desenhar_no: desenha uma árvore enraizada no nó fornecido em um contexto de tela.
         nó: o nó que será desenhado
    Devoluções: -
    */
    this.desenhar_no = function (no) {
        // Localize variáveis para facilitar o acesso
        var contexto = this.contexto;

        // Desenha o nó
        contexto.lineWidth = 2;
        contexto.strokeStyle = "#000000"; // lembrete: preto
        contexto.fillStyle = "#000000";

        var chave;
        var passo = largura_chave;
        for (var i = 0; i < no.chaves.length; i++) {
            chave = no.chaves[i];
            contexto.strokeRect(no.x + i * passo, no.y, largura_chave, altura_chave);
            contexto.fillText(chave, (no.x + i * passo) + (largura_chave / 2),
                no.y + (altura_chave / 2));
        }

        // Desenhar e conectar os filhos
        var filho;
        contexto.strokeStyle = "#000000"; // lembrete: cor preto
        for (var i = 0; i < no.filhos.length; i++) {
            contexto.beginPath();
            filho = no.filhos[i];
            this.desenhar_no(filho, contexto);
            contexto.moveTo(no.x + i * passo, no.y + altura_chave);
            contexto.lineTo(filho.x + ((filho.chaves.length * largura_chave) / 2),
                filho.y - 1);
            contexto.lineWidth = 1;
            contexto.stroke();
            contexto.closePath();
        }
    }

    /*
    pegar_largura_arvore: calcula a largura de uma árvore com base na extremidade esquerda e filhos mais à direita.
    nó: a raiz da árvore cuja largura será calculada
    Retorna: a largura da árvore.
    */
    this.pegar_largura_arvore = function (no) {
        if (no.filhos.length > 0) {
            var lm = no.filhos[0];
            while (lm.filhos.length > 0)
                lm = lm.filhos[0];
            var rm = no.filhos[no.filhos.length - 1];
            while (rm.filhos.length > 0)
                rm = rm.filhos[rm.filhos.length - 1];
            return (rm.x - lm.x) + largura_chave * rm.chaves.length;
        }
        return largura_chave * no.chaves.length;
    }

    /*
    posicao_arvore: coloque uma árvore para desenhar.
         no: a raiz da árvore a ser apresentada
         no_pai: o nó pai (o padrão é indefinido)
         cur_x: a coordenada x atual (o padrão é 0)
    Devoluções: -
    */
    this.posicao_arvore = function (no, no_pai, cur_x) {
        if (no.filhos.length != 0) {
            cur_x = (cur_x == undefined) ? 0 : cur_x;
            // Ajuste a coordenada y para colocar o nó abaixo do seu
            // pai
            if (no_pai != undefined)
                no.y = (no_pai.y + altura_chave) + espaco_entre_nos;
            // Para cada criança ...
            var filho;
            for (var i = 0; i < no.filhos.length; i++) {
                filho = no.filhos[i];

                // Se não for uma folha, coloque o sutree em conformidade                
                if (!filho.folha())
                    this.posicao_arvore(filho, no, cur_x);
                // Se é uma folha, disponha-a com base em seus irmãos
                else {
                    filho.x = cur_x;
                    filho.y = no.y + altura_chave + espaco_entre_nos;
                }
                // Aumente a coordenada x com base na largura da sutree
                cur_x += this.pegar_largura_arvore(filho) + espaco_entre_nos;
            }
            // Ajuste a coordenada x para centralizar acima dos filhos
            if (!no.folha()) {
                var primeiro = no.filhos[0];
                var ultimo = no.filhos[no.filhos.length - 1];
                var largura = no.chaves.length * largura_chave;
                no.x = ((primeiro.x + ultimo.x +
                    (ultimo.chaves.length) * largura_chave) / 2) - largura / 2;
            }
        }
    }

    /*
    mover_arvore: move os nós de uma árvore com base em determinados deltas
         nó: o nó a ser movido (se indefinido, torna-se a raiz)
         delta_x: delta x (horizontal)
         delta_y: delta y (vertical)
    Devoluções: -
    */
    this.mover_arvore = function (delta_x, delta_y, no) {
        if (no == undefined) {
            no = this.arvore.raiz;
            this.deslocamento_x += delta_x;
            this.deslocamento_y += delta_y;
        }

        no.x += delta_x;
        no.y += delta_y;
        for (var i = 0; i < no.filhos.length; i++)
            this.mover_arvore(delta_x, delta_y, no.filhos[i]);
    }
}

/* Manipuladores de eventos */
function on_botao_inserir_chave_clicked() {
    var chave = parseInt(document.getElementById("entrada_inserir_chave").value);
    if (chave || chave == 0) {
        arvore.inserir_chave(chave);
        desenho.desenhar();
    }
}

function on_botao_remover_chave_clicked() {
    var chave = parseInt(document.getElementById("entrada_remover_chave").value);
    if (chave || chave == 0) {
        arvore.remover_chave(chave);
        desenho.desenhar();
    }
}

function on_botao_buscar_chave_clicked() {
    var chave = parseInt(document.getElementById("buscar_chave").value);
    if (isNaN(chave))
        alert("A chave deve ser um inteiro");
    else {
        var resultado, no, posicao;
        resultado = arvore.buscar_chave(chave);
        var xx = resultado[0];
        no = resultado[0]; posicao = resultado[1];
        if (no != null) {
            desenho.desenhar(centro_no, no, posicao);
        }
        else
            alert("A chave " + chave + " não está na árvore");
    }
}

function on_botao_limpar_arvore_clicked() {
    nova_arvore(arvore.ordem);
}

function on_botao_criar_arvore_clicked() {
    var ordem = parseInt(document.getElementById("entrada_ordem").value)
    if (isNaN(ordem) || ordem < 3) {
        alert("Deve-se inserir um valor maior ou igual a 3!");
        return;
    }
    nova_arvore(ordem);
}

function on_canvas_clicked(e) {
    var x = 0;
    var y = 0;
    var canvas = document.getElementById("canvas");
    if (!e) var e = window.event;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        x = e.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
    // Obter as coordenadas relativamente à tela (canvas)
    x = x - canvas.offsetLeft;
    y = y - canvas.offsetTop;

    var delta_x = 0;
    var delta_y = 0;
    var width = canvas.width;
    var height = canvas.height;
    meio_y = canvas.height / 2;
    meio_x = canvas.width / 2;
    // Rolar para a esquerda
    if (x < deslocamento * 2 &&
        meio_y - deslocamento <= y && y <= meio_y + deslocamento)
        delta_x = deslocamento;
    // Rolar para a direita
    else if (x > width - deslocamento * 2 &&
        meio_y - deslocamento <= y && y <= meio_y + deslocamento)
        delta_x = -deslocamento;
    // Rolar para baixo
    else if (y < deslocamento * 2 &&
        meio_x - deslocamento <= x && x <= meio_x + deslocamento)
        delta_y = deslocamento;
    // Rolar para cima
    else if (y > height - deslocamento * 2 &&
        meio_x - deslocamento <= x && x <= meio_x + deslocamento)
        delta_y = -deslocamento;
    desenho.desenhar(rolagem, delta_x, delta_y);
}

/* Cria uma nova árvore */
function nova_arvore(ordem) {
    arvore = new ArvoreB(ordem);
    var canvas = document.getElementById("canvas");
    desenho = new DesenhaArvoreB(arvore, canvas);
    desenho.desenhar();
}

/* Libera os botões de inserir e remover chave para o uso */
function liberar_botoes() {
    var ordem = parseInt(document.getElementById("entrada_ordem").value);
    if (ordem >= 3) {
        document.getElementById('inserir_chave').innerHTML =
            '<div class="form-group">' +
            '<input type="number" id="entrada_inserir_chave" name="entrada_inserir_chave" class="form-control" placeholder="chave">' +
            '</div>' +
            '<button id="botao_inserir_chave" onclick="on_botao_inserir_chave_clicked()" class="btn btn-default">Inserir</button>';
        document.getElementById('remover_chave').innerHTML =
            '<div class="form-group">' +
            '<input type="number" id="entrada_remover_chave" name="entrada_remover_chave" class="form-control" placeholder="chave">' +
            '</div>' +
            '<button id="botao_remover_chave" onclick="on_botao_remover_chave_clicked()" class="btn btn-default">Remover</button>';

    }
}