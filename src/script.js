// ===== CONFIGURACIÓN DE ENLACES =====
// 👇 EDITA AQUÍ TUS ENLACES DE GOOGLE DRIVE
const driveLinks = [
    {
        name: "1",
        url: "https://www.google.com",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "2",
        url: "https://www.youtube.com",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "3",
        url: "",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "4",
        url: "",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "5",
        url: "",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "6",
        url: "",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "7",
        url: "",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "8",
        url: "",
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
        btn.href = link.url;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.className = 'link-btn';
        btn.setAttribute('aria-label', `Abrir ${link.name}`);
        
        // ✅ Sin botón de copiar - solo el contenido principal
        btn.innerHTML = `
            <div class="file-icon ${link.type}">${link.icon}</div>
            <div class="file-name">${link.name}</div>
            <div class="file-type">${link.type}</div>
        `;
        
        // Click en el botón → abrir enlace con feedback háptico
        btn.addEventListener('click', handleLinkClick);
        
        linksContainer.appendChild(btn);
    });
}

// ===== MANEJAR CLICK EN ENLACE =====
function handleLinkClick(e) {
    // Vibración háptica si está disponible (feedback táctil móvil)
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
    
    // Focus automático en búsqueda en desktop
    if (window.innerWidth > 768) {
        searchInput.focus();
    }
});