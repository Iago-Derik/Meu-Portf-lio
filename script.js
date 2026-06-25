/* =====================================================================
   ARQUIVO: script.js
   DESCRIÇÃO: Interatividade do portfólio utilizando apenas JavaScript
   Vanilla (puro), sem nenhuma biblioteca ou framework externo.
   ===================================================================== */

/* Garante que o script só execute depois que todo o HTML estiver carregado,
   evitando erros de "elemento não encontrado" (null). */
document.addEventListener('DOMContentLoaded', function () {

    /* =================================================================
       1. SELEÇÃO DOS ELEMENTOS DO DOM
       Centralizamos aqui todas as referências aos elementos que serão
       manipulados, facilitando a leitura e manutenção do código.
    ================================================================= */
    const body = document.body;

    // Tema
    const botaoTema = document.getElementById('themeToggle');
    const iconeSol = document.getElementById('iconSun');
    const iconeLua = document.getElementById('iconMoon');

    // Menu hambúrguer / navegação mobile
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const linksNav = document.querySelectorAll('.nav__link');

    // Formulário de contato
    const formulario = document.getElementById('formContato');
    const campoNome = document.getElementById('nome');
    const campoEmail = document.getElementById('email');
    const campoMensagem = document.getElementById('mensagem');

    // Modal de sucesso
    const modal = document.getElementById('modalSucesso');
    const botaoFecharModal = document.getElementById('fecharModal');
    const botaoModalOk = document.getElementById('modalOk');


    /* =================================================================
       2. ALTERNÂNCIA DE TEMA (CLARO / ESCURO)
       Estratégia: adicionamos/removemos a classe "tema-escuro" no <body>.
       Como o CSS usa "var(--cor-x)", a troca de tema é refletida em todo
       o site automaticamente. Também salvamos a preferência do usuário
       no localStorage, para que o tema escolhido seja mantido entre
       visitas (persistência simples no navegador).
    ================================================================= */

    // Função responsável por aplicar visualmente o tema (ícones e classe do body)
    function aplicarTema(tema) {
        if (tema === 'escuro') {
            body.classList.add('tema-escuro');
            iconeSol.style.display = 'none';
            iconeLua.style.display = 'block';
        } else {
            body.classList.remove('tema-escuro');
            iconeSol.style.display = 'block';
            iconeLua.style.display = 'none';
        }
    }

    // Ao carregar a página, verificamos se já existe uma preferência salva
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo) {
        aplicarTema(temaSalvo);
    } else {
        // Caso não haja preferência salva, respeitamos a configuração do sistema operacional do usuário
        const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
        aplicarTema(prefereEscuro ? 'escuro' : 'claro');
    }

    // Evento de clique no botão de alternância de tema
    botaoTema.addEventListener('click', function () {
        const temaAtual = body.classList.contains('tema-escuro') ? 'escuro' : 'claro';
        const novoTema = temaAtual === 'escuro' ? 'claro' : 'escuro';

        aplicarTema(novoTema);
        localStorage.setItem('tema', novoTema); // Persiste a escolha do usuário
    });


    /* =================================================================
       3. MENU HAMBÚRGUER (RESPONSIVO MOBILE)
       Ao clicar no botão hambúrguer, alternamos a classe "ativo" tanto
       no botão (para animar o ícone em "X") quanto no <nav> (para
       deslizar o painel de navegação para dentro da tela).
    ================================================================= */
    hamburger.addEventListener('click', function () {
        const menuAberto = nav.classList.toggle('ativo');
        hamburger.classList.toggle('ativo');

        // Atualiza o atributo de acessibilidade indicando se o menu está expandido
        hamburger.setAttribute('aria-expanded', menuAberto);
    });

    // Fecha o menu mobile automaticamente ao clicar em qualquer link de navegação
    // (melhora a experiência do usuário, evitando que o menu fique aberto após a navegação)
    linksNav.forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('ativo');
            hamburger.classList.remove('ativo');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });


    /* =================================================================
       4. VALIDAÇÃO E ENVIO DO FORMULÁRIO DE CONTATO
       Interceptamos o evento "submit" para impedir o recarregamento
       padrão da página e realizar nossa própria validação dos campos.
    ================================================================= */

    // Expressão regular simples para validar o formato básico de um e-mail (usuario@dominio.com)
    const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /**
     * Exibe uma mensagem de erro abaixo de um campo específico e marca
     * visualmente o input como inválido (borda vermelha).
     */
    function mostrarErro(input, elementoErro, mensagem) {
        input.classList.add('invalido');
        elementoErro.textContent = mensagem;
    }

    /**
     * Remove a mensagem de erro e o estilo de inválido de um campo,
     * usado quando o campo passa a ser válido.
     */
    function limparErro(input, elementoErro) {
        input.classList.remove('invalido');
        elementoErro.textContent = '';
    }

    /**
     * Valida o campo Nome: verifica apenas se não está vazio
     * (após remover espaços em branco extras com trim()).
     */
    function validarNome() {
        const valor = campoNome.value.trim();
        const erro = document.getElementById('erroNome');

        if (valor === '') {
            mostrarErro(campoNome, erro, 'Por favor, informe seu nome.');
            return false;
        }

        limparErro(campoNome, erro);
        return true;
    }

    /**
     * Valida o campo E-mail: verifica se não está vazio E se possui
     * um formato válido, utilizando a expressão regular REGEX_EMAIL.
     */
    function validarEmail() {
        const valor = campoEmail.value.trim();
        const erro = document.getElementById('erroEmail');

        if (valor === '') {
            mostrarErro(campoEmail, erro, 'Por favor, informe seu e-mail.');
            return false;
        }

        if (!REGEX_EMAIL.test(valor)) {
            mostrarErro(campoEmail, erro, 'Informe um e-mail válido (ex: usuario@dominio.com).');
            return false;
        }

        limparErro(campoEmail, erro);
        return true;
    }

    /**
     * Valida o campo Mensagem: verifica apenas se não está vazio.
     */
    function validarMensagem() {
        const valor = campoMensagem.value.trim();
        const erro = document.getElementById('erroMensagem');

        if (valor === '') {
            mostrarErro(campoMensagem, erro, 'Por favor, escreva uma mensagem.');
            return false;
        }

        limparErro(campoMensagem, erro);
        return true;
    }

    // Validação "em tempo real": à medida que o usuário sai de um campo (evento blur),
    // já validamos aquele campo individualmente, dando feedback mais rápido.
    campoNome.addEventListener('blur', validarNome);
    campoEmail.addEventListener('blur', validarEmail);
    campoMensagem.addEventListener('blur', validarMensagem);

    // Evento principal de envio do formulário
    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault(); // Impede o comportamento padrão (recarregar a página)

        // Executamos as três validações. Usamos variáveis separadas (em vez de
        // "&&" direto) para garantir que TODOS os campos sejam validados e
        // exibam seus respectivos erros, mesmo que o primeiro já seja inválido.
        const nomeValido = validarNome();
        const emailValido = validarEmail();
        const mensagemValida = validarMensagem();

        // Só seguimos com o "envio" se absolutamente todos os campos forem válidos
        if (nomeValido && emailValido && mensagemValida) {

            // ---- SIMULAÇÃO DE ENVIO ----
            // Em um cenário real, aqui faríamos uma requisição (fetch) para um
            // servidor/API de e-mail. Como é uma simulação para fins didáticos,
            // apenas limpamos o formulário e exibimos a confirmação visual.

            formulario.reset(); // Limpa todos os campos do formulário

            abrirModal(); // Exibe o modal customizado de sucesso
        }
    });


    /* =================================================================
       5. MODAL DE SUCESSO (CONFIRMAÇÃO VISUAL CUSTOMIZADA)
       Em vez de usar o alert() simples do navegador, criamos um modal
       estilizado em HTML/CSS e controlamos sua exibição via JavaScript,
       adicionando/removendo a classe "ativo".
    ================================================================= */

    function abrirModal() {
        modal.classList.add('ativo');
        modal.setAttribute('aria-hidden', 'false');
    }

    function fecharModal() {
        modal.classList.remove('ativo');
        modal.setAttribute('aria-hidden', 'true');
    }

    // Fecha o modal ao clicar no "X" ou no botão "Fechar"
    botaoFecharModal.addEventListener('click', fecharModal);
    botaoModalOk.addEventListener('click', fecharModal);

    // Fecha o modal também ao clicar na área escura (overlay) fora da caixa de conteúdo
    modal.addEventListener('click', function (evento) {
        if (evento.target === modal) {
            fecharModal();
        }
    });

    // Permite fechar o modal pressionando a tecla "Esc", melhorando a acessibilidade
    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape' && modal.classList.contains('ativo')) {
            fecharModal();
        }
    });


    /* =================================================================
       6. RODAPÉ - ANO ATUAL DINÂMICO
       Pequeno detalhe de qualidade: atualiza automaticamente o ano
       exibido no copyright do footer, sem precisar editar o HTML
       manualmente todos os anos.
    ================================================================= */
    document.getElementById('anoAtual').textContent = new Date().getFullYear();


    /* =================================================================
       7. DESTAQUE DO LINK ATIVO NO MENU CONFORME O SCROLL (EXTRA)
       Utiliza a Intersection Observer API para detectar qual seção está
       visível na tela e adicionar uma classe de destaque ao link
       correspondente no menu de navegação, melhorando a usabilidade.
    ================================================================= */
    const secoes = document.querySelectorAll('section[id]');

    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                const idSecao = entrada.target.getAttribute('id');

                linksNav.forEach(function (link) {
                    link.classList.remove('ativo-scroll');
                    if (link.getAttribute('href') === '#' + idSecao) {
                        link.classList.add('ativo-scroll');
                    }
                });
            }
        });
    }, {
        threshold: 0.4, // Considera a seção "ativa" quando 40% dela estiver visível
        rootMargin: '-72px 0px 0px 0px' // Compensa a altura do header fixo
    });

    secoes.forEach(function (secao) {
        observador.observe(secao);
    });

});
