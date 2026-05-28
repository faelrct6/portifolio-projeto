function calcularDias() {
    // Data de início do curso: 01 de Fevereiro de 2025
    const dataInicio = new Date(2025, 1, 1); 
    const dataAtual = new Date();

    // Diferença em milissegundos
    const diferencaTempo = dataAtual - dataInicio;
    
    // Convertendo milissegundos matematicamente em dias inteiros
    const diferencaDias = Math.floor(diferencaTempo / (1000 * 60 * 60 * 24));

    const elementoContador = document.getElementById('days-count');
    
    if (elementoContador) {
        if (diferencaDias >= 0) {
            elementoContador.innerText = diferencaDias;
        } else {
            elementoContador.innerText = "0";
        }
    }
}

// FUNÇÃO PARA FAZER A NAVBAR SUMIR AO ROLAR PARA BAIXO
function gerenciarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Se rolar mais de 40px para baixo, adiciona a classe que esconde a barra
    if (window.scrollY > 40) {
        navbar.classList.add('esconder');
    } else {
        navbar.classList.remove('esconder');
    }
}

// GERAÇÃO DINÂMICA DAS TAGS DE HABILIDADES
function inicializarHabilidades() {
    let habilidadesTecnicas = [
        "Python", "CSS", "HTML", "JavaScript", "SQL (MySQL / SQL Server)", "Git / GitHub", 
        "Lógica de programação", "Pacote Office", "VS Code"
    ];

    const containerHabilidades = document.getElementById("lista-habilidades");
    if (!containerHabilidades) return;
    
    containerHabilidades.innerHTML = "";
    habilidadesTecnicas.forEach(hab => {
        containerHabilidades.innerHTML += `<li class="tag-habilidade">${hab}</li>`;
    });
}

// Executa as funções principais assim que a página carregar
window.onload = function() {
    calcularDias();
    inicializarHabilidades();
};

// Monitora a rolagem do usuário em tempo real
window.onscroll = function() {
    gerenciarScroll();
};