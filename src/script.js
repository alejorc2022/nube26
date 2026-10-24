// ===== CONFIGURACIÓN DE ENLACES =====
// 👇 EDITA AQUÍ TUS ENLACES
const driveLinks = [
    {
        name: "1",
        url: "https://drive.google.com/file/d/1rE-WArN_Ps_j50tkkcvLHohgkKoAQ9Rq/view?usp=sharing",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "2",
        url: " ",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "3",
        url: " ",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "4",
        url: " ",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "5",
        url: " ",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "6",
        url: " ",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "7",
        url: " ",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "8",
        url: " ",
        type: "archivo",
        icon: "📁"
    }
];

// ===== ELEMENTOS DEL DOM =====
const linksContainer = document.getElementById('linksContainer');
const searchInput = document.getElementById('searchInput');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ===== RENDERIZAR BOTONES =====
function renderLinks(links) {
    linksContainer.innerHTML = '';
    
    if (links.length === 0) {
        linksContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3Z"/>
                </svg>
                <p>No se encontraron archivos</p>
            </div>
        `;
        return;
    }
    
    links.forEach((link, index) => {
        const btn = document.createElement('a');
        btn.href = link.url && link.url.trim() !== '' ? link.url : '#';
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.className = 'link-btn';
        btn.setAttribute('aria-label', `Abrir ${link.name}`);
        
        // 🔑 CLAVE: tabindex permite que el foco llegue al botón con flechas
        btn.setAttribute('tabindex', String(index + 2)); // +2 porque el search es tabindex 1
        
        // Si el enlace está vacío, evitar que sea clickeable
        if (!link.url || link.url.trim() === '') {
            btn.setAttribute('aria-disabled', 'true');
            btn.classList.add('disabled');
        }
        
        btn.innerHTML = `
            <div class="file-icon ${link.type}">${link.icon}</div>
            <div class="file-name">${link.name}</div>
            <div class="file-type">${link.type}</div>
        `;
        
        btn.addEventListener('click', handleLinkClick);
        linksContainer.appendChild(btn);
    });
}

// ===== MANEJAR CLICK EN ENLACE =====
function handleLinkClick(e) {
    const btn = e.currentTarget;
    
    // Si el enlace está vacío, no hacer nada
    if (btn.classList.contains('disabled')) {
        e.preventDefault();
        return;
    }
    
    // Vibración háptica si está disponible
    if (navigator.vibrate) {
        navigator.vibrate(15);
    }
}

// ===== MOSTRAR TOAST =====
let toastTimeout;
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ===== BÚSQUEDA EN TIEMPO REAL =====
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    const filtered = driveLinks.filter(link => 
        link.name.toLowerCase().includes(query) ||
        link.type.toLowerCase().includes(query)
    );
    
    renderLinks(filtered);
});

// ========================================
// 🎮 NAVEGACIÓN CON FLECHAS (SMART TV)
// ========================================

/**
 * Calcula cuántas columnas tiene el grid actualmente
 */
function getGridColumns() {
    const container = linksContainer;
    const buttons = container.querySelectorAll('.link-btn');
    if (buttons.length < 2) return 1;
    
    const firstTop = buttons[0].getBoundingClientRect().top;
    let columns = 1;
    
    for (let i = 1; i < buttons.length; i++) {
        if (buttons[i].getBoundingClientRect().top === firstTop) {
            columns++;
        } else {
            break;
        }
    }
    
    return columns;
}

/**
 * Obtiene todos los elementos enfocables en orden
 */
function getFocusableElements() {
    const elements = [];
    
    // Añadir el input de búsqueda
    if (searchInput && !searchInput.disabled) {
        elements.push(searchInput);
    }
    
    // Añadir los botones de enlace (solo los no deshabilitados)
    const buttons = linksContainer.querySelectorAll('.link-btn:not(.disabled)');
    buttons.forEach(btn => elements.push(btn));
    
    return elements;
}

/**
 * Mueve el foco al siguiente elemento según la dirección
 */
function navigateFocus(direction) {
    const elements = getFocusableElements();
    if (elements.length === 0) return;
    
    const activeEl = document.activeElement;
    const currentIndex = elements.indexOf(activeEl);
    
    // Si no hay elemento enfocado, empezar desde el primero
    if (currentIndex === -1) {
        elements[0].focus();
        return;
    }
    
    let nextIndex = currentIndex;
    
    // Navegación lineal (izquierda/derecha)
    if (direction === 'right') {
        nextIndex = currentIndex + 1;
        if (nextIndex >= elements.length) nextIndex = 0; // Loop
    } 
    else if (direction === 'left') {
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) nextIndex = elements.length - 1; // Loop
    }
    // Navegación vertical (arriba/abajo) usando columnas del grid
    else if (direction === 'down' || direction === 'up') {
        const columns = getGridColumns();
        
        if (direction === 'down') {
            nextIndex = currentIndex + columns;
            if (nextIndex >= elements.length) {
                // Si está en la última fila, volver al principio
                nextIndex = currentIndex % columns;
            }
        } else {
            nextIndex = currentIndex - columns;
            if (nextIndex < 0) {
                // Si está en la primera fila, ir a la misma columna en la última fila
                const lastRowStart = Math.floor((elements.length - 1) / columns) * columns;
                nextIndex = lastRowStart + (currentIndex % columns);
                if (nextIndex >= elements.length) nextIndex = elements.length - 1;
            }
        }
    }
    
    if (nextIndex >= 0 && nextIndex < elements.length) {
        elements[nextIndex].focus();
        
        // Scroll suave para mantener el elemento visible en TV
        elements[nextIndex].scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest',
            inline: 'nearest'
        });
        
        // Feedback háptico
        if (navigator.vibrate) {
            navigator.vibrate(8);
        }
    }
}

/**
 * Manejador global de teclas para Smart TV
 */
document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    // Mapeo de teclas de control remoto de TV
    const keyMap = {
        'ArrowRight': 'right',
        'ArrowLeft': 'left',
        'ArrowDown': 'down',
        'ArrowUp': 'up',
        'Right': 'right',      // Algunos TVs antiguos
        'Left': 'left',
        'Down': 'down',
        'Up': 'up',
        'Enter': 'enter',
        'Spacebar': 'enter',   // Algunos TVs
        ' ': 'enter',
        'Return': 'enter'      // Samsung Tizen
    };
    
    const action = keyMap[key];
    if (!action) return;
    
    // Si estamos en el input de búsqueda, solo navegamos arriba/abajo
    // Izquierda/derecha se usan para mover el cursor dentro del texto
    if (document.activeElement === searchInput) {
        if (action === 'down' || action === 'up') {
            e.preventDefault();
            navigateFocus(action);
            searchInput.blur(); // Sale del input al navegar verticalmente
        }
        // Enter en el input no hace nada especial
        return;
    }
    
    // Prevenir scroll por defecto del navegador con las flechas
    if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(key)) {
        e.preventDefault();
    }
    
    if (action === 'enter') {
        // Enter activa el enlace actual
        const activeEl = document.activeElement;
        if (activeEl && activeEl.classList.contains('link-btn')) {
            activeEl.click();
        }
    } else {
        navigateFocus(action);
    }
});

// ===== PREVENIR ZOOM EN DOBLE TAP (iOS) =====
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    renderLinks(driveLinks);
    
    // 🔑 Enfocar el primer botón automáticamente en TV
    // Detectamos si es probable que sea un TV (pantalla grande + sin touch)
    const isTV = window.innerWidth >= 1280 && !('ontouchstart' in window);
    
    if (isTV) {
        const firstBtn = linksContainer.querySelector('.link-btn:not(.disabled)');
        if (firstBtn) {
            setTimeout(() => firstBtn.focus(), 300);
        }
    }
});

// ===== ESTILO ADICIONAL PARA BOTONES DESHABILITADOS =====
// Se añade dinámicamente para no modificar el CSS
const style = document.createElement('style');
style.textContent = `
    .link-btn.disabled {
        opacity: 0.4;
        cursor: not-allowed;
        pointer-events: none;
    }
    .link-btn.disabled:hover,
    .link-btn.disabled:focus {
        transform: none;
        box-shadow: none;
        border-color: var(--border);
        outline: none;
        background: var(--surface);
    }
`;
document.head.appendChild(style);