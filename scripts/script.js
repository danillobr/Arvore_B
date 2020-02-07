const largura_chave = 32;
const altura_chave = 32;
const espaco_entre_nos = 32;
const deslocamento = 16;
const centro_raiz = 0;
const centro_no = 1;
const rolagem = 2;

function No(ordem) {
    this.ordem = ordem;
    this.pai = null; // Referência do pai do nó, null para a raiz.
    this.chaves = []; // Matriz de chaves do nó.
    this.filhos = []; // Matriz de nós filhos.

    // Configurações dos eixos x e y do nó na tela.
    this.x = 0;
    this.y = 0;

    // Verifica se um nó é uma folha, retorna "True" ou "False".
    this.folha = function () {
        return this.filhos.length == 0;
    }

    // Verifica se o nó tem mais chaves do que é permitido, retorna "True" se tiver ultrapassado ou "False".
    this.ultrapassou = function () {
        return this.ordem <= this.chaves.length;
    }

    // Divide o nó em dois e retorna a chave mediana do nó original. O novo nó é colocado no final do nó mais antigo da matriz de filhos.
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

    // Adiciona uma nova chave no nó e retorna a posição em que a chave foi inserida.
    this.adiciona_chave = function (chave) {
        var i = 0;
        while (i < this.chaves.length && this.chaves[i] < chave) {
            i++;
        }
        this.chaves.splice(i, 0, chave);
        return i;
    }

    // Remove uma chave do nó e retorna a posição em que a chave foi removida.
    this.remove_chave = function (chave) {
        var i = 0;
        while (i < this.chaves.length && this.chaves[i] < chave) {
            i++;
        }
        this.chaves.splice(i, 1);
        return i;
    }

    // Busca por uma chave na árvore e retorna o nó que contém a chave e o índice dela no nó, retona [null, 0] se a chave não for encontrada.
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

function ArvoreB(ordem) {
    this.ordem = ordem;
    this.raiz = new No(this.ordem);

    // Configurações dos eixos x e y do nó na tela.
    this.x_deslocamento = 0;
    this.y_deslocamento = 0;

    // Procura por um nó folha para realizar a inserção, retorna o nó folha no qual a chave deve ser inserida.
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

    // Busca por uma chave a partir de um valor informado, começando pela raiz da árvore.
    this.buscar_chave = function (chave) {
        return this.raiz.buscar(chave)
    }

    // Insere a nova chave na árvore, retornando o nó onde a chave foi inserida.
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

    // Remove uma chave que esteja em um nó folha e com a taxa de ocupação acima dos 50%, retornando a chave removida.
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

function DesenhaArvoreB(arvore, canvas) {
    this.arvore = arvore;
    this.canvas = canvas;
    this.contexto = canvas.getContext("2d");
    this.realcar = null;

    this.desenhar = function (modo, arg1, arg2) {
        if (modo == undefined)
            modo = centro_raiz;

        var canvas = this.canvas;
        var contexto = this.contexto;

        canvas.width = canvas.width;
        contexto.clearRect(0, 0, canvas.width, canvas.height);
        contexto.textAlign = "center";
        contexto.textBaseline = "middle";

        contexto.font = "18px arial";

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
            if (this.realcar != null) {
                modo = centro_no;
                arg1 = this.realcar[0];
                arg2 = this.realcar[1];
            }
        }

        this.desenhar_no(this.arvore.raiz, contexto);

        if (modo == centro_no) {
            contexto.lineWidth = 2;
            contexto.strokeStyle = "red";
            contexto.strokeRect(arg1.x + arg2 * largura_chave,
                arg1.y, largura_chave, altura_chave);
            this.realcar = [arg1, arg2];
        }

        contexto.fillStyle = "#000000";
        contexto.beginPath();
        contexto.clearRect(0, 0, canvas.width, deslocamento + 4);
        contexto.moveTo(canvas.width / 2, 0);
        contexto.lineTo((canvas.width / 2) - (deslocamento / 2), deslocamento);
        contexto.lineTo((canvas.width / 2) + (deslocamento / 2), deslocamento);

        contexto.clearRect(0, 0, deslocamento + 4, canvas.height);
        contexto.moveTo(0, canvas.height / 2);
        contexto.lineTo(deslocamento, canvas.height / 2 + (deslocamento / 2));
        contexto.lineTo(deslocamento, canvas.height / 2 - (deslocamento / 2));

        contexto.clearRect(0, canvas.height - deslocamento - 4,
            canvas.width, canvas.height);
        contexto.moveTo(canvas.width / 2, canvas.height);
        contexto.lineTo((canvas.width / 2) - (deslocamento / 2),
            canvas.height - deslocamento);
        contexto.lineTo((canvas.width / 2) + (deslocamento / 2),
            canvas.height - deslocamento);

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

    this.desenhar_no = function (no) {
        var contexto = this.contexto;

        contexto.lineWidth = 2;
        contexto.strokeStyle = "#000000";
        contexto.fillStyle = "#000000";

        var chave;
        var passo = largura_chave;
        for (var i = 0; i < no.chaves.length; i++) {
            chave = no.chaves[i];
            contexto.strokeRect(no.x + i * passo, no.y, largura_chave, altura_chave);
            contexto.fillText(chave, (no.x + i * passo) + (largura_chave / 2),
                no.y + (altura_chave / 2));
        }

        var filho;
        contexto.strokeStyle = "#000000";
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

    this.posicao_arvore = function (no, no_pai, cur_x) {
        if (no.filhos.length != 0) {
            cur_x = (cur_x == undefined) ? 0 : cur_x;
            if (no_pai != undefined)
                no.y = (no_pai.y + altura_chave) + espaco_entre_nos;
            var filho;
            for (var i = 0; i < no.filhos.length; i++) {
                filho = no.filhos[i];
                if (!filho.folha())
                    this.posicao_arvore(filho, no, cur_x);
                else {
                    filho.x = cur_x;
                    filho.y = no.y + altura_chave + espaco_entre_nos;
                }
                cur_x += this.pegar_largura_arvore(filho) + espaco_entre_nos;
            }
            if (!no.folha()) {
                var primeiro = no.filhos[0];
                var ultimo = no.filhos[no.filhos.length - 1];
                var largura = no.chaves.length * largura_chave;
                no.x = ((primeiro.x + ultimo.x +
                    (ultimo.chaves.length) * largura_chave) / 2) - largura / 2;
            }
        }
    }

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

    x = x - canvas.offsetLeft;
    y = y - canvas.offsetTop;

    var delta_x = 0;
    var delta_y = 0;
    var width = canvas.width;
    var height = canvas.height;
    meio_y = canvas.height / 2;
    meio_x = canvas.width / 2;

    if (x < deslocamento * 2 &&
        meio_y - deslocamento <= y && y <= meio_y + deslocamento)
        delta_x = deslocamento;

    else if (x > width - deslocamento * 2 &&
        meio_y - deslocamento <= y && y <= meio_y + deslocamento)
        delta_x = -deslocamento;

    else if (y < deslocamento * 2 &&
        meio_x - deslocamento <= x && x <= meio_x + deslocamento)
        delta_y = deslocamento;

    else if (y > height - deslocamento * 2 &&
        meio_x - deslocamento <= x && x <= meio_x + deslocamento)
        delta_y = -deslocamento;
    desenho.desenhar(rolagem, delta_x, delta_y);
}

function nova_arvore(ordem) {
    arvore = new ArvoreB(ordem);
    var canvas = document.getElementById("canvas");
    desenho = new DesenhaArvoreB(arvore, canvas);
    desenho.desenhar();
}

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