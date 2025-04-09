AFRAME.registerComponent('model-handler', {
  init: function() {
    const el = this.el;
    const modelIndex = parseInt(el.id.split('-')[1]) - 1;
    
    const handleInteraction = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      
      // Verificar se o clique foi no modelo
      if (evt.detail.intersection) {
        console.log(`Modelo ${modelIndex} clicado na posição:`, evt.detail.intersection.point);
        
        if (modelIndex !== currentIndex) {
          updateCarousel(modelIndex);
        }
      }
    };

    // Adicionar eventos de interação
    el.addEventListener('click', handleInteraction);
    el.addEventListener('mousedown', handleInteraction);
    
    // Para dispositivos móveis
    el.addEventListener('touchstart', (evt) => {
      evt.preventDefault();
      handleInteraction(evt);
    });
  }
});

// Constants and variables
const BASE_SCALE = 12;  // Escala base reduzida para 16
const SELECTED_SCALE = 16;  // Escala quando selecionado reduzida para 20
const MODEL_NAMES = {
  0: "IQOS ILUMA ONE",
  1: "IQOS ILUMA i",
  2: "IQOS ILUMA PRIME"
};

let currentIndex = 1;  // Começar com o modelo2 (índice 1)
let isModelClicked = false;
const ZOOM_FACTOR = 0.3;
const MIN_SCALE = 12.0;
const MAX_SCALE = 24.0;

// DOM Elements
const loading = document.querySelector('.loading');
const modelos = [
  document.querySelector("#modelo3d-1"),
  document.querySelector("#modelo3d-2"),
  document.querySelector("#modelo3d-3")
];
const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");
const personalizeBtn = document.querySelector(".model-info button");
const modelInfo = document.querySelector('.model-info');
const modelName = document.querySelector('#model-name');
const zoomInBtn = document.querySelector('#zoom-in');
const zoomOutBtn = document.querySelector('#zoom-out');
const carousel = document.querySelector('.carousel-container');

// Variables
let currentModel = 1;  // Começar com o modelo2 (índice 1)
const models = document.querySelectorAll('.model-container');

// Configuração do carrossel
const RADIUS = 4; // Aumentado o raio do círculo para 4
const ANGLE_STEP = 120; // 360 graus dividido por 3 modelos
const TRANSITION_DURATION = 1000; // Duração da transição em ms

// Configuração dos modelos com suas informações
const modelConfigs = {
    'modelo3d-1': {
        name: 'IQOS ILUMA ONE',
        buttonText: 'Personalizar',
        link: 'ilumaone.html'
    },
    'modelo3d-2': {
        name: 'IQOS ILUMA i',
        buttonText: 'Personalizar',
        link: 'ilumai.html'
    },
    'modelo3d-3': {
        name: 'IQOS ILUMA PRIME',
        buttonText: 'Personalizar',
        link: 'ilumaprime.html'
    }
};

// Função para calcular a posição do modelo baseado no ângulo
function calculatePosition(angle) {
    const radians = (angle * Math.PI) / 180;
    return {
        x: RADIUS * Math.sin(radians),
        z: -RADIUS * (1 - Math.cos(radians))
    };
}

// Função para atualizar o carrossel
function updateCarousel(newIndex) {
    currentIndex = newIndex;
    currentModel = newIndex; // Manter currentModel sincronizado com currentIndex
    const totalModels = modelos.length;
    
    // Calcular o ângulo base para a rotação
    let baseAngle = -currentIndex * ANGLE_STEP;
    
    modelos.forEach((modelo, index) => {
        // Calcular o ângulo relativo para cada modelo
        let angle = baseAngle + (index * ANGLE_STEP);
        let pos = calculatePosition(angle);
        
        // Definir a posição e rotação do modelo
        modelo.setAttribute('visible', 'true');
        
        // Determinar se este é o modelo central
        const isCentral = index === currentIndex;
        
        // Configurar a escala e classes
        if (isCentral) {
            modelo.setAttribute('scale', `${SELECTED_SCALE} ${SELECTED_SCALE} ${SELECTED_SCALE}`);
            modelo.classList.add('active');
            modelo.classList.remove('inactive', 'left', 'right');
            showModelInfo(modelo.getAttribute('id'));
        } else {
            modelo.setAttribute('scale', `${BASE_SCALE} ${BASE_SCALE} ${BASE_SCALE}`);
            modelo.classList.add('inactive');
            modelo.classList.remove('active');
            
            // Adicionar classes left/right baseado na posição
            if (pos.x < 0) {
                modelo.classList.add('left');
                modelo.classList.remove('right');
            } else {
                modelo.classList.add('right');
                modelo.classList.remove('left');
            }
        }
        
        // Aplicar a transformação com transição suave
        modelo.setAttribute('position', `${pos.x} 0 ${pos.z}`);
        modelo.setAttribute('rotation', `0 ${-angle} 0`);
    });
}

// Função para mover para o próximo modelo
function nextModel() {
    const nextIndex = (currentIndex + 1) % modelos.length;
    updateCarousel(nextIndex);
}

// Função para mover para o modelo anterior
function prevModel() {
    const prevIndex = (currentIndex - 1 + modelos.length) % modelos.length;
    updateCarousel(prevIndex);
}

function hideModelInfo() {
  const modelInfo = document.getElementById('model-info');
  modelInfo.style.display = 'none';
}

function updateModelPositions() {
  modelos.forEach((modelo, index) => {
    if (index === currentModel) {
      modelo.setAttribute('scale', `${SELECTED_SCALE} ${SELECTED_SCALE} ${SELECTED_SCALE}`);
    } else {
      modelo.setAttribute('scale', `${BASE_SCALE} ${BASE_SCALE} ${BASE_SCALE}`);
    }
  });
}

function changeModel(direction) {
  hideModelInfo();
  
  // Resetar escala do modelo atual
  modelos[currentModel].setAttribute('scale', `${BASE_SCALE} ${BASE_SCALE} ${BASE_SCALE}`);

  if (direction === 'next' && currentModel < 2) {
    currentModel++;
  } else if (direction === 'prev' && currentModel > 0) {
    currentModel--;
  }

  // Atualizar escala do novo modelo selecionado
  modelos[currentModel].setAttribute('scale', `${SELECTED_SCALE} ${SELECTED_SCALE} ${SELECTED_SCALE}`);
  
  // Atualizar o carrossel
  updateCarousel(currentModel);
}

// Event Listeners
window.addEventListener('load', function() {
    // Inicializar com o modelo2 como central
    updateCarousel(1);
});

const sceneEl = document.querySelector('a-scene');
sceneEl.addEventListener('renderstart', () => {
  loading.style.display = 'none';
});

// Button events
prevButton.addEventListener('click', prevModel);
nextButton.addEventListener('click', nextModel);

// Target detection events
const target = document.querySelector('a-entity[mindar-image-target]');

target.addEventListener("targetFound", event => {
    // Mostrar todos os modelos
    modelos.forEach((modelo, i) => {
        modelo.setAttribute('visible', 'true');
        modelo.setAttribute('scale', `${BASE_SCALE} ${BASE_SCALE} ${BASE_SCALE}`);
        modelo.classList.remove('blurred');
    });
    
    // Restaurar a posição correta do modelo selecionado
    updateCarousel(currentIndex);
});

target.addEventListener("targetLost", event => {
    // Manter os modelos visíveis
    modelos.forEach((modelo, i) => {
        modelo.setAttribute('visible', 'true');
        modelo.setAttribute('scale', `${BASE_SCALE} ${BASE_SCALE} ${BASE_SCALE}`);
        modelo.classList.remove('blurred');
    });
    
    // Selecionar o modelo 2 por padrão
    currentIndex = 1;
    updateCarousel(currentIndex);
});

// Adicionar eventos de teclado
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        prevModel();
    } else if (event.key === 'ArrowRight') {
        nextModel();
    }
});

// Remover eventos de zoom
if (zoomInBtn) zoomInBtn.remove();
if (zoomOutBtn) zoomOutBtn.remove();

// Adicionar eventos de zoom
zoomInBtn.addEventListener('click', () => {
  currentZoom = Math.min(currentZoom + 1, 10);
  updateZoom();
});

zoomOutBtn.addEventListener('click', () => {
  currentZoom = Math.max(currentZoom - 1, 3);
  updateZoom();
});

// Adicionar eventos de teclado
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        prevModel();
    } else if (event.key === 'ArrowRight') {
        nextModel();
    }
});

// Inicializar posições do carrossel
function initializeCarousel() {
    // Tentar recuperar o índice salvo, se não existir usar o modelo2 (ILUMA i) como padrão
    const savedIndex = localStorage.getItem('selectedModelIndex');
    currentIndex = savedIndex !== null ? parseInt(savedIndex) : 1;
    updateCarousel(currentIndex);
}

// Inicializar o carrossel quando a cena estiver carregada
sceneEl.addEventListener('loaded', () => {
    initializeCarousel();
    updateZoom();
});

// Remover eventos de zoom anteriores
models.forEach(model => {
    model.removeAttribute('event-set__mouseenter');
    model.removeAttribute('event-set__mouseleave');
});

function updateZoom() {
  // Implemente a lógica para atualizar o zoom com base no currentZoom
}

// Função para mostrar informações do modelo
function showModelInfo(modelId) {
    const modelConfig = modelConfigs[modelId];
    if (!modelConfig) return;

    if (modelInfo) {
        modelInfo.innerHTML = `
            <h2>${modelConfig.name}</h2>
            <button class="pulse-button" onclick="window.location.href='${modelConfig.link}'">${modelConfig.buttonText}</button>
        `;
        modelInfo.style.display = 'flex';
    }
} 