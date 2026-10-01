// ===== CONFIGURACIÓN DE ENLACES =====
// 👇 EDITA AQUÍ TUS ENLACES
const driveLinks = [
    {
        name: "1",
        url: "https://drive.google.com/file/d/1JdVNYtTuz1b6HVFDoWS358RsUgT43m6k/view?usp=sharing",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "2",
        url: "https://drive.google.com/file/d/1FL2Ya0yd_v6TWvoylb3ssKr0ESKebdmn/view?usp=sharing",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "3",
        url: "https://drive.google.com/file/d/1UYc7Yj_3zBVs-E3WmqCtfcpt6qNoUFjh/view?usp=sharing",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "4",
        url: "https://drive.google.com/file/d/14QLHEisE9khrNRwO0TWyplP7d3XLsG-R/view?usp=sharing",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "5",
        url: "https://drive.google.com/file/d/1QkdsZLzIwEsImfmGkdoQgpO8nGYZj6jU/view?usp=sharing",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "6",
        url: "https://drive.google.com/file/d/1ZQbSapE-FJKU052BnlYPCg6pSHbzki9d/view?usp=sharing",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "7",
        url: "https://drive.google.com/file/d/1gmxPLan4LkEx5mEXVctij8zUPigIm7up/view?usp=sharing",
        type: "archivo",
        icon: "📁"
    },
    {
        name: "8",
        url: "https://drive.google.com/file/d/1rE-WArN_Ps_j50tkkcvLHohgkKoAQ9Rq/view?usp=sharing",
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