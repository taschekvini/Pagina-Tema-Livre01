/**
 * Script da página do Joinville Esporte Clube (JEC).
 * Realiza a validação dos dados informados pelo torcedor, aplica tratamento
 * de exceções e calcula o aproveitamento percentual em vitórias.
 */

const formulario = document.getElementById("form-jec");
const caixaFeedback = document.getElementById("resultado-jec");

/**
 * Exibe mensagem de retorno visual (erro ou sucesso) na página.
 * @param {string} mensagem - Texto informativo para o usuário.
 * @param {string} tipo - Classe CSS ('erro' ou 'sucesso').
 */
function exibirFeedback(mensagem, tipo) {
  caixaFeedback.textContent = mensagem;
  caixaFeedback.className = `feedback ${tipo}`;
}

/**
 * Valida e converte os campos do formulário.
 * Lança exceções caso os valores estejam ausentes ou incoerentes.
 * @param {string} nome - Nome do torcedor.
 * @param {string} jogosTexto - Total de jogos acompanhados (string).
 * @param {string} vitoriasTexto - Total de vitórias presenciadas (string).
 * @returns {{ jogos: number, vitorias: number }} Valores numéricos validados.
 */
function validarDadosTorcedor(nome, jogosTexto, vitoriasTexto) {
  // 1. Valida o nome
  if (!nome || nome.trim().length < 2) {
    throw new Error("Por favor, digite seu nome (mínimo de 2 letras).");
  }

  // 2. Valida o número total de jogos
  if (!jogosTexto || jogosTexto.trim() === "") {
    throw new Error("Informe o total de jogos que você acompanhou.");
  }

  const jogos = Number(jogosTexto);
  if (Number.isNaN(jogos) || !Number.isInteger(jogos) || jogos < 1 || jogos > 100) {
    throw new Error("O total de jogos deve ser um número inteiro entre 1 e 100.");
  }

  // 3. Valida o número de vitórias
  if (!vitoriasTexto || vitoriasTexto.trim() === "") {
    throw new Error("Informe quantas vitórias do JEC você viu.");
  }

  const vitorias = Number(vitoriasTexto);
  if (Number.isNaN(vitorias) || !Number.isInteger(vitorias) || vitorias < 0) {
    throw new Error("O número de vitórias deve ser um inteiro maior ou igual a zero.");
  }

  // Regra de negócio: vitórias não podem ultrapassar o total de jogos
  if (vitorias > jogos) {
    throw new Error("O número de vitórias não pode ser maior que o total de jogos acompanhados.");
  }

  return { jogos, vitorias };
}

/**
 * Classifica o nível de sorte do torcedor conforme o percentual de vitórias.
 * @param {number} percentual - Porcentagem de vitórias (0 a 100).
 * @returns {string} Classificação temática do torcedor.
 */
function classificarTorcedor(percentual) {
  if (percentual >= 70) {
    return "Talismã da Arena! Com você na torcida o Coelho quase não perde.";
  } else if (percentual >= 40) {
    return "Torcedor Fiel! Bom aproveitamento empurrando o Tricolor.";
  } else {
    return "Guerreiro Tricolor! Mesmo nas fases difíceis, nunca abandona o JEC.";
  }
}

// Listener de envio do formulário
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  try {
    // Captura os valores dos inputs
    const nomeInput = document.getElementById("torcedor").value;
    const jogosInput = document.getElementById("total-jogos").value;
    const vitoriasInput = document.getElementById("vitorias").value;

    // Valida os dados (dispara erro se algo estiver errado)
    const { jogos, vitorias } = validarDadosTorcedor(nomeInput, jogosInput, vitoriasInput);

    // Cálculo de aproveitamento em vitórias e pontos mínimos somados
    const aproveitamento = (vitorias / jogos) * 100;
    const pontosVitorias = vitorias * 3;
    const perfil = classificarTorcedor(aproveitamento);

    // Exibe o resultado na tela
    exibirFeedback(
      `Salve, ${nomeInput.trim()}! Em ${jogos} jogo(s) acompanhado(s), você viu ${vitorias} vitória(s) do JEC (${pontosVitorias} pontos garantidos), um aproveitamento de ${aproveitamento.toFixed(1)}%. ${perfil}`,
      "sucesso"
    );
  } catch (erro) {
    // Trata qualquer erro de validação exibindo orientação clara na página
    exibirFeedback(`Atenção: ${erro.message}`, "erro");
  }
});