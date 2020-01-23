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
function No(ord) {
    this.ordem = ord;
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
        var aux = Math.floor(this.ordem / 2) + 1;
        var novo_no = new No(this.ordem);
        novo_no.chaves = this.chaves.slice(aux);
        novo_no.filhos = this.filhos.slice(aux);
        for (var x in novo_no.filhos)
            novo_no.filhos[x].pai = novo_no;
        this.chaves = this.chaves.slice(0, aux);
        this.filhos = this.filhos.slice(0, aux);
        this.filhos.push(novo_no);
        return this.chaves.pop();
    }

    /*
    add_key: adiciona uma chave à matriz de chaves do nó (na posição correta
         para manter a matriz ordenada).
         chave: o valor a ser adicionado.
     Retorna: a posição em que a chave foi inserida na matriz.
    */
    this.add_key = function (key) {
        var i = 0;
        while (i < this.chaves.length && this.chaves[i] < key) i++;
        this.chaves.splice(i, 0, key);
        return i;
    }

    /*
    search: função recursiva para pesquisar o nó e seus filhos
        pela presença de um valor.
        chave: valor a ser pesquisado.
    Retorna: o nó que contém a chave e o índice no diretório
        matriz de chaves ou [nulo, 0] se a chave não for encontrada.
    */
    this.search = function (key) {
        var i = 0;
        while (i < this.chaves.length) {
            if (this.chaves[i] == key)
                return [this, i];
            else if (this.chaves[i] > key) {
                if (this.folha())
                    return [null, 0];
                else
                    return this.filhos[i].search(key);
            }
            else
                i++;
        }
        if (this.folha())
            return [null, 0];
        else
            return this.filhos[i].search(key);
    }
}

/*
ArvoreB: uma árvore B.
     ordem: a ordem da árvore.
     raiz: o nó raiz da árvore.
     qtd_chaves: número de chaves na árvore.
*/
function ArvoreB(ord) {
    this.ordem = ord;
    this.raiz = new No(this.ordem);
    this.qtd_chaves = 0;
    this.x_offset = 0;
    this.y_offset = 0;

    /*
     inserir_chave: insere uma nova chave na árvore
     chave: a nova chave a ser inserida
     Retorna: o nó no qual a chave foi inserida.
    */
    this.inserir_chave = function (chave) {
        var ins_No = this.find_leaf(this.raiz, key);
        ins_No.add_key(chave);
        while (ins_No.ultrapassou()) {
            var up_val = ins_No.dividir();
            var n_No = ins_No.filhos.pop();
            if (ins_No.pai != null) {
                ins_No = ins_No.pai;
                var ind = ins_No.add_key(up_val);
                ins_No.filhos.splice(ind + 1, 0, n_No);
                n_No.pai = ins_No;
            }
            else {
                this.raiz = new No(this.ordem);
                this.raiz.add_key(up_val);
                this.raiz.filhos.push(ins_No);
                this.raiz.filhos.push(n_No);
                n_No.pai = this.raiz;
                ins_No.pai = this.raiz;
                ins_No = ins_No.pai;
            }
        }
        this.qtd_chaves++;
    }

    /*
     find_leaf: encontre o nó da folha correto para inserir uma chave.
         nó: raiz da subárvore a ser pesquisada.
         chave: valor usado para encontrar um nó folha.
     Retorna: o nó folha no qual a chave deve ser inserida.
     */
    this.find_leaf = function (No, chave) {
        if (No.folha()) return No;
        else {
            var i = 0;
            while (i < No.chaves.length && No.chaves[i] < chave) i++;
            return this.find_leaf(No.filhos[i], chave);
        }
    }

    /*
    search_key: pesquisa a existência e posição de uma chave na árvore
    chave: o valor a ser pesquisado.
    Retorna: o nó que contém a chave e o índice no diretório da matriz de chaves ou [nulo, 0] se a chave não for encontrada.
    */
    this.search_key = function (chave) {
        return this.raiz.search(chave)
    }
}

/*
DesenhaArvoreB: um desenho de um objeto ArvoreB
árvore: o ArvoreB a ser representado
tela: uma tela na qual a árvore será representada
*/
function DesenhaArvoreB(tree, canvas) {
    this.tree = tree;
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.highlight = null;


    /*
    draw: (re) pinta a árvore
         mode: descreve o motivo do (re) desenho
         centro_raiz: centralizando a raiz na parte superior
         centro_no: centralizar totalmente um nó e, opcionalmente, destacando-o
         rolagem: rolando a árvore, mova-a
         Para cada modo, arg1 e arg2 assumem valores diferentes:
         centro_raiz: arg1 e arg2 não são usados;
         centro_no: arg1 é o nó central e arg2 é a chave de destaque
         rolagem: arg1 é o delta x e arg2 é o delta y
     Devoluções: -
    */
    this.draw = function (mode, arg1, arg2) {
        if (mode == undefined)
            mode = centro_raiz;

        // Localize variáveis para facilitar o acesso
        var canvas = this.canvas;
        var context = this.context;

        canvas.width = canvas.width;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "12px arial";

        // Centralize na raiz se centro_no for indefinido
        // A raiz está centralizada de maneira diferente: no centro, na parte superior
        var deltas;
        if (mode != rolagem) {
            function get_delta_to_point(No, x, y) {
                var middle = (No.chaves.length * largura_chave) / 2;
                return [x - No.x - middle, y - No.y - altura_chave / 2];
            }

            this.position_tree(this.tree.raiz);
            if (mode == centro_raiz)
                deltas = get_delta_to_point(this.tree.raiz,
                    canvas.width / 2,
                    deslocamento * 2 + 8);
            else if (mode == centro_no)
                deltas = get_delta_to_point(arg1,
                    canvas.width / 2,
                    canvas.height / 2);
            this.move_tree(deltas[0], deltas[1]);
            this.highlight = null;
        }
        else {
            this.move_tree(arg1 * 5, arg2 * 5);
            // Se estiver rolando, mantenha o realce
            if (this.highlight != null) {
                mode = centro_no;
                arg1 = this.highlight[0];
                arg2 = this.highlight[1];
            }
        }
        this.draw_No(this.tree.raiz, context);

        if (mode == centro_no) {
            context.lineWidth = 2;
            context.strokeStyle = "#F57900"; // lembrete: cor laranja
            context.strokeRect(arg1.x + arg2 * largura_chave,
                arg1.y, largura_chave, altura_chave);
            this.highlight = [arg1, arg2];
        }

        // (Re) desenhe o quadro da tela
        context.fillStyle = "#555753"; // lembrete: cor Alumínio
        context.beginPath();
        // Seta superior
        context.clearRect(0, 0, canvas.width, deslocamento + 4);
        context.moveTo(canvas.width / 2, 0);
        context.lineTo((canvas.width / 2) - (deslocamento / 2), deslocamento);
        context.lineTo((canvas.width / 2) + (deslocamento / 2), deslocamento);

        // Seta da esquerda
        context.clearRect(0, 0, deslocamento + 4, canvas.height);
        context.moveTo(0, canvas.height / 2);
        context.lineTo(deslocamento, canvas.height / 2 + (deslocamento / 2));
        context.lineTo(deslocamento, canvas.height / 2 - (deslocamento / 2));

        // Seta de inferior
        context.clearRect(0, canvas.height - deslocamento - 4,
            canvas.width, canvas.height);
        context.moveTo(canvas.width / 2, canvas.height);
        context.lineTo((canvas.width / 2) - (deslocamento / 2),
            canvas.height - deslocamento);
        context.lineTo((canvas.width / 2) + (deslocamento / 2),
            canvas.height - deslocamento);

        // Seta da direita
        context.clearRect(canvas.width - deslocamento - 4, 0,
            canvas.width, canvas.height);
        context.moveTo(canvas.width, canvas.height / 2);
        context.lineTo(canvas.width - deslocamento,
            canvas.height / 2 + (deslocamento / 2));
        context.lineTo(canvas.width - deslocamento,
            canvas.height / 2 - (deslocamento / 2));

        context.closePath();
        context.fill();
    }

    /*
    draw_No: desenha uma árvore enraizada no nó fornecido em um contexto de tela.
         nó: o nó que será desenhado
    Devoluções: -
    */
    this.draw_No = function (No) {
        // Localize variáveis para facilitar o acesso
        var context = this.context;

        // Desenha o nó
        context.lineWidth = 2;
        context.strokeStyle = "#729FCF"; // lembrete: azul céu
        context.fillStyle = "#000000";

        var key;
        var step = largura_chave;
        for (var i = 0; i < No.chaves.length; i++) {
            key = No.chaves[i];
            context.strokeRect(No.x + i * step, No.y, largura_chave, altura_chave);
            context.fillText(key, (No.x + i * step) + (largura_chave / 2),
                No.y + (altura_chave / 2));
        }

        // Desenhar e conectar os filhos
        var child;
        context.strokeStyle = "#73D216"; // lembrete: cor verde qualquer
        for (var i = 0; i < No.filhos.length; i++) {
            context.beginPath();
            child = No.filhos[i];
            this.draw_No(child, context);
            context.moveTo(No.x + i * step, No.y + altura_chave);
            context.lineTo(child.x + ((child.chaves.length * largura_chave) / 2),
                child.y - 1);
            context.lineWidth = 1;
            context.stroke();
            context.closePath();
        }
    }

    /*
    get_tree_width: calcula a largura de uma árvore com base na extremidade esquerda e filhos mais à direita.
    nó: a raiz da árvore cuja largura será calculada
    Retorna: a largura da árvore.
    */
    this.get_tree_width = function (No) {
        if (No.filhos.length > 0) {
            var lm = No.filhos[0];
            while (lm.filhos.length > 0)
                lm = lm.filhos[0];
            var rm = No.filhos[No.filhos.length - 1];
            while (rm.filhos.length > 0)
                rm = rm.filhos[rm.filhos.length - 1];
            return (rm.x - lm.x) + largura_chave * rm.chaves.length;
        }
        return largura_chave * No.chaves.length;
    }

    /*
    position_tree: coloque uma árvore para desenhar.
         nó: a raiz da árvore a ser apresentada
         pNo: o nó pai (o padrão é indefinido)
         cur_x: a coordenada x atual (o padrão é 0)
    Devoluções: -
    */
    this.position_tree = function (No, pNo, cur_x) {
        if (No.filhos.length != 0) {
            cur_x = (cur_x == undefined) ? 0 : cur_x;
            // Ajuste a coordenada y para colocar o nó abaixo do seu
            // pai
            if (pNo != undefined)
                No.y = (pNo.y + altura_chave) + espaco_entre_nos;
            // Para cada criança ...
            var child;
            for (var i = 0; i < No.filhos.length; i++) {
                child = No.filhos[i];

                // Se não for uma folha, coloque o sutree em conformidade                
                if (!child.folha())
                    this.position_tree(child, No, cur_x);
                // Se é uma folha, disponha-a com base em seus irmãos
                else {
                    child.x = cur_x;
                    child.y = No.y + altura_chave + espaco_entre_nos;
                }
                // Aumente a coordenada x com base na largura da sutree
                cur_x += this.get_tree_width(child) + espaco_entre_nos;
            }
            // Ajuste a coordenada x para centralizar acima dos filhos
            if (!No.folha()) {
                var first = No.filhos[0];
                var last = No.filhos[No.filhos.length - 1];
                var width = No.chaves.length * largura_chave;
                No.x = ((first.x + last.x +
                    (last.chaves.length) * largura_chave) / 2) - width / 2;
            }
        }
    }

    /*
    move_tree: move os nós de uma árvore com base em determinados deltas
         nó: o nó a ser movido (se indefinido, torna-se a raiz)
         delta_x: delta x (horizontal)
         delta_y: delta y (vertical)
    Devoluções: -
    */
    this.move_tree = function (delta_x, delta_y, No) {
        if (No == undefined) {
            No = this.tree.raiz;
            this.offset_x += delta_x;
            this.offset_y += delta_y;
        }

        No.x += delta_x;
        No.y += delta_y;
        for (var i = 0; i < No.filhos.length; i++)
            this.move_tree(delta_x, delta_y, No.filhos[i]);
    }
}

/* Manipuladores de eventos */
function on_botao_inserir_chave_clicked() {
    var chave = parseInt(document.getElementById("entrada_inserir_chave").value);
    if (chave || chave == 0) {
        tree.inserir_chave(chave);
        drawing.draw();
        clear_error_message("insert");
    }
}

function on_botao_buscar_chave_clicked() {
    var n = parseInt(document.getElementById("search_key").value);
    if (isNaN(n))
        alert("A chave deve ser um inteiro");
    else {
        var result, No, position;
        result = tree.search_key(n);
        No = result[0]; hl_position = result[1];
        if (No != null) {
            drawing.draw(centro_no, No, hl_position);
        }
        else
            alert("A chave " + n + " não está na árvore");
    }
}

function on_botao_limpar_arvore_clicked() {
    nova_arvore(tree.ordem);
}

function on_botao_cria_nova_arvore_clicked() {
    var ordem = parseInt(document.getElementById("entrada_ordem").value)
    if (isNaN(ordem) || ordem < 3) {
        alert("Deve-se inserir um valor maior que 3!");
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
    middle_y = canvas.height / 2;
    middle_x = canvas.width / 2;
    // Rolar para a esquerda
    if (x < deslocamento * 2 &&
        middle_y - deslocamento <= y && y <= middle_y + deslocamento)
        delta_x = deslocamento;
    // Rolar para a direita
    else if (x > width - deslocamento * 2 &&
        middle_y - deslocamento <= y && y <= middle_y + deslocamento)
        delta_x = -deslocamento;
    // Rolar para baixo
    else if (y < deslocamento * 2 &&
        middle_x - deslocamento <= x && x <= middle_x + deslocamento)
        delta_y = deslocamento;
    // Rolar para cima
    else if (y > height - deslocamento * 2 &&
        middle_x - deslocamento <= x && x <= middle_x + deslocamento)
        delta_y = -deslocamento;
    drawing.draw(rolagem, delta_x, delta_y);
}

/* Cria uma nova árvore */
function nova_arvore(ordem) {
    arvore = new ArvoreB(ordem);
    var canvas = document.getElementById("canvas");
    drawing = new DesenhaArvoreB(arvore, canvas);
    drawing.draw();
}

/* Libera os botões de inserir e remover chave para o uso */
function liberar_botoes() {
    var ordem = parseInt(document.getElementById("entrada_ordem").value);
    if (ordem > 3) {
        document.getElementById('inserir_chave').innerHTML =
            '<div class="form-group">' +
            '<input type="number" id="entrada_inserir_chave" name="entrada_inserir_chave" class="form-control" placeholder="chave">' +
            '</div>' +
            '<button id="botao_inserir_chave" onclick="on_botao_inserir_chave_clicked()" class="btn btn-default">Inserir</button>';
    }
}