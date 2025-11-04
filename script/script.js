document.addEventListener("DOMContentLoaded", () => {
  // FUNÇÃO PARA CONFIGURAR TURNOS (LOCAL POR BLOCO) //
  function configurarTurnos(container) {
    // PROCURA O SELECT DO TURNO DE FORMA ROBUSTA (CLASSE, NAME OU ID) //
    const select =
      container.querySelector(".turno") ||
      container.querySelector("select[name='TURNO']") ||
      container.querySelector("#turno") ||
      container.querySelector("select");  

    // PEGA APENAS AS .TURNO-OPCAO QUE PERTENCEM A ESSE CONTAINER //
    const opcoes = Array.from(container.querySelectorAll(".turno-opcao"));
    
    if (!select || opcoes.length === 0) return;

    // FUNÇÃO QUE APLICA A EXIBIÇÃO CORRETA COM BASE NO VALOR ATUAL //
    function aplicarValor(valor) {
      opcoes.forEach(o => (o.style.display = "none"));

      // TENTA IDENTIFICAR OS BLOCOS POR ATRIBUTO DATA-TURNO (SE EXISTIR) OU PELA ORDEM //
      const divIntegral = container.querySelector('[data-turno="integral"]') || opcoes[0];
      const divManha    = container.querySelector('[data-turno="manha"]')    || opcoes[1];
      const divTarde    = container.querySelector('[data-turno="tarde"]')    || opcoes[2];

      if (valor === "integral" && divIntegral) divIntegral.style.display = "flex";
      if (valor === "manha"    && divManha)    divManha.style.display = "flex";
      if (valor === "tarde"    && divTarde)    divTarde.style.display = "flex";
      if (valor === "manha_tarde") {
        if (divManha) divManha.style.display = "flex";
        if (divTarde) divTarde.style.display = "flex";
      }
    }

    // GARANTE ESTADO INICIAL (CASO O SELECT JÁ VENHA COM ALGO SELECIONADO) //
    aplicarValor(select.value);

    // REMOVE LISTENERS ANTIGOS (PROTEÇÃO CASO CONFIGURARTURNOS SEJA CHAMADO MAIS DE UMA VEZ) //
    // NOTE: NÃO HÁ FORMA DIRETA DE REMOVER LISTENERS ANÔNIMOS SEM REFERÊNCIA. //
    // PARA EVITAR MÚLTIPLOS HANDLERS, USAMOS UM FLAG DATA-* PARA INDICAR QUE JÁ CONFIGURAMOS ESSE SELECT. //
    if (select.dataset.turnoListener === "1") return;
    select.dataset.turnoListener = "1";

    // LISTENER LOCAL AO SELECT DESSE CONTAINER //
    select.addEventListener("change", () => {
      aplicarValor(select.value);
    });
  }

  // CONFIGURA O PRIMEIRO BLOCO (SE EXISTIR) //
  const primeiroBloco = document.querySelector(".especialidade-item");
  if (primeiroBloco) configurarTurnos(primeiroBloco);

  // ADICIONAR MAIS UMA ESPECIALIDADE //
  const botaoAdicionar = document.getElementById("adicionar-especialidade");
  const container = document.getElementById("container-especialidades");

  if (botaoAdicionar && container) {
    botaoAdicionar.addEventListener("click", () => {
      const novoItem = container.firstElementChild.cloneNode(true);

      // LIMPA CAMPOS: INPUTS, TEXTAREAS E SELECTS //
      novoItem.querySelectorAll("input").forEach(i => i.value = "");
      novoItem.querySelectorAll("textarea").forEach(t => t.value = "");
      novoItem.querySelectorAll("select").forEach(s => {
        s.selectedIndex = 0;
        // REMOVE FLAG DE LISTENER CASO CLONE TRAGA DATASET //
        delete s.dataset.turnoListener;
      });

      // ESCONDE BLOCOS DE TURNO NO CLONE ATÉ O USUÁRIO ESCOLHER //
      novoItem.querySelectorAll(".turno-opcao").forEach(div => {
        div.style.display = "none";
      });

      // REMOVE IDS DUPLICADOS DENTRO DO CLONE (PREVINE CONFLITO) //
      novoItem.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));

      container.appendChild(novoItem);

      // CONFIGURA OS TURNOS DO NOVO BLOCO (VAI USAR O SELECT DO CLONE) //
      configurarTurnos(novoItem);

      // FOCA NO PRIMEIRO SELECT DO BLOCO NOVO PARA UX //
      const foco = novoItem.querySelector("select, input");
      if (foco) foco.focus();
    });
  }
});