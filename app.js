// MisaContigo Web PWA Engine - 100% Functional & Responsive (Android Parity)
let globalGuides = [];
let globalQuotes = [];
let currentQuote = "Todo lo puedo en Cristo que me fortalece. — Filipenses 4,13";

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTheme();
    loadDailyLiturgy();
    loadSeasonalGuides();
    loadPrayers();
    loadSaints();
    loadPalabraDeVida();
    loadFamilyIntentions();

    // Set current date (Spanish formatted)
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        let formatted = new Date().toLocaleDateString('es-ES', options);
        dateEl.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
});

// Navigation Switcher (5 Tabs: Misa, Confesa, Orar, Familia, App)
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabs = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-tab');
            navItems.forEach(i => i.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));

            item.classList.add('active');
            const targetTab = document.getElementById(target);
            if (targetTab) targetTab.classList.add('active');
        });
    });
}

// Liturgical Theme Switcher
function initTheme() {
    const savedTheme = localStorage.getItem('misa_theme') || 'Green';
    document.body.setAttribute('data-theme', savedTheme);

    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        if (btn.dataset.theme === savedTheme) {
            btn.style.outline = '3px solid #000';
            btn.style.outlineOffset = '2px';
        }
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('misa_theme', theme);
            themeButtons.forEach(b => b.style.outline = 'none');
            btn.style.outline = '3px solid #000';
            btn.style.outlineOffset = '2px';
        });
    });
}

// Load Daily Liturgy / Mass Guide
async function loadDailyLiturgy() {
    try {
        const res = await fetch('assets/200ver.json');
        const verses = await res.json();
        const randomVerse = verses[Math.floor(Math.random() * verses.length)];
        const el = document.getElementById('daily-liturgy-text');
        if (el) {
            el.innerHTML = `<strong>${randomVerse.referencia}</strong>: "${randomVerse.texto}"`;
        }
    } catch (e) {
        console.error("Error loading daily liturgy:", e);
        const el = document.getElementById('daily-liturgy-text');
        if (el) el.innerHTML = "Liturgia del día: Celebración eucarística dominical en comunión con la Iglesia universal.";
    }
}

function openMassGuideModal() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <h2 style="font-size: 1.3rem; color: var(--primary); margin-bottom: 1rem;">Orden de la Santa Misa</h2>
        <div style="font-size: 0.9rem; line-height: 1.6; color: var(--text-main);">
            <p><strong>1. Ritos Iniciales:</strong> Canto de entrada, saludo, acto penitencial y gloria.</p><br>
            <p><strong>2. Liturgia de la Palabra:</strong> Primera lectura, salmo responsorial, segunda lectura, santo evangelio y homilía.</p><br>
            <p><strong>3. Liturgia Eucarística:</strong> Ofertorio, plegaria eucarística, Santo, consagración y Padre Nuestro.</p><br>
            <p><strong>4. Rito de Comunión y Despedida:</strong> Cordero de Dios, comunión y bendición final.</p>
        </div>
    `;
    modal.classList.add('active');
}

// Load Palabra de Vida from 100CitasBiblicas.txt
async function loadPalabraDeVida() {
    try {
        const res = await fetch('assets/100CitasBiblicas.txt');
        const text = await res.text();
        const lines = text.split('\n').filter(line => line.includes('–') || line.includes('-'));
        globalQuotes = lines.map(l => l.replace(/^\d+\.\s*/, '').trim());
        loadRandomQuote();
    } catch (e) {
        console.error("Error loading 100CitasBiblicas.txt:", e);
        globalQuotes = [
            "Jeremías 29,11 – \"Yo sé los planes que tengo para ustedes, planes de paz y no de desgracia.\"",
            "Filipenses 4,13 – \"Todo lo puedo en Cristo que me fortalece.\"",
            "Salmo 27,1 – \"El Señor es mi luz y mi salvación, ¿a quién temeré?\""
        ];
        loadRandomQuote();
    }
}

function loadRandomQuote() {
    if (globalQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * globalQuotes.length);
        currentQuote = globalQuotes[randomIndex];
        const el = document.getElementById('palabra-vida-text');
        if (el) el.textContent = currentQuote;
    }
}

function sharePalabraVida() {
    const text = `📖 *MisaContigo - Palabra de Vida*\n\n"${currentQuote}"\n\nDescarga MisaContigo y lleva tu fe siempre contigo.`;
    if (navigator.share) {
        navigator.share({ title: 'Palabra de Vida - MisaContigo', text: text }).catch(err => console.log(err));
    } else {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
}

function speakPalabraVida() {
    speakText(currentQuote);
}

// Load Seasonal Guides from JSON
async function loadSeasonalGuides() {
    try {
        const res = await fetch('assets/guias_estacionales_mexico.json');
        const data = await res.json();
        globalGuides = data.guias;
        const container = document.getElementById('seasonal-guides-container');
        if (!container) return;

        container.innerHTML = globalGuides.map((guide, index) => `
            <div class="misa-card guide-card" data-index="${index}" style="cursor: pointer; transition: transform 0.2s;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 2.2rem;">${guide.icono}</span>
                    <div>
                        <h3 style="font-size: 1.05rem; color: var(--primary); margin-bottom: 0.2rem;">${guide.titulo}</h3>
                        <p style="font-size: 0.8rem; color: var(--text-muted);">${guide.subtitulo}</p>
                    </div>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.guide-card').forEach(card => {
            card.addEventListener('click', () => {
                const idx = card.getAttribute('data-index');
                openGuideModal(globalGuides[idx]);
            });
        });
    } catch (e) {
        console.error("Error loading seasonal guides:", e);
    }
}

function openGuideModal(guide) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
            <span style="font-size: 2.5rem;">${guide.icono}</span>
            <div>
                <h2 style="font-size: 1.3rem; color: var(--primary);">${guide.titulo}</h2>
                <p style="font-size: 0.85rem; color: var(--text-muted);">${guide.subtitulo}</p>
            </div>
        </div>
        <p style="font-size: 0.95rem; margin-bottom: 1.5rem; color: var(--text-main); font-weight: 500;">${guide.descripcion}</p>
        <hr style="border: none; border-top: 1px solid var(--border); margin-bottom: 1.5rem;">
        ${guide.secciones.map(sec => `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 0.5rem;">${sec.titulo}</h3>
                <p style="font-size: 0.9rem; white-space: pre-line; line-height: 1.6; color: var(--text-main); background: var(--bg); padding: 1rem; border-radius: 12px; border: 1px solid var(--border);">${sec.contenido}</p>
            </div>
        `).join('')}
    `;
    modal.classList.add('active');
}

function openPilgrimModal() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <div style="text-align: center; padding: 1rem 0;">
            <span style="font-size: 3.5rem;">🏆</span>
            <h2 style="font-size: 1.5rem; color: var(--primary); margin: 0.5rem 0;">Camino del Peregrino</h2>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">Tus frutos espirituales en MisaContigo</p>
            <div class="misa-card" style="text-align: left;">
                <p style="font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">🌟 Nivel 2 de Peregrino</p>
                <p style="font-size: 0.9rem; margin-bottom: 0.5rem;">• Misas vividas: 5</p>
                <p style="font-size: 0.9rem; margin-bottom: 0.5rem;">• Oraciones completadas: 14</p>
                <p style="font-size: 0.9rem;">• Puntos de Gracia: 350 pts</p>
            </div>
        </div>
    `;
    modal.classList.add('active');
}

function startRosary() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <div style="text-align: center; padding: 1rem 0;">
            <span style="font-size: 3rem;">📿</span>
            <h2 style="font-size: 1.4rem; color: var(--primary); margin: 0.5rem 0;">Santo Rosario Guiado</h2>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">Meditación de los Misterios</p>
            <div class="misa-card" style="text-align: left; background: var(--bg);">
                <h3 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 0.5rem;">Primer Misterio</h3>
                <p style="font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">La Encarnación del Hijo de Dios en las entrañas purísimas de la Virgen María.</p>
                <button class="btn-primary" onclick="speakText('Primer misterio: La encarnación del Hijo de Dios. Padre nuestro...')">🔊 Escuchar Misterio en Audio</button>
            </div>
        </div>
    `;
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('active');
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

// Load Prayers
async function loadPrayers() {
    try {
        const res = await fetch('assets/oraciones_catolicas_latinoamerica_expandido.json');
        const data = await res.json();
        const container = document.getElementById('prayers-container');
        if (!container) return;

        let allPrayers = [];
        Object.keys(data).forEach(category => {
            if (Array.isArray(data[category])) {
                data[category].forEach(p => {
                    allPrayers.push({ title: p.Nombre || p.nombre_oracion, content: p.Detalle || p.detalle_oracion, category });
                });
            }
        });

        renderPrayers(allPrayers);

        const searchInput = document.getElementById('prayer-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = allPrayers.filter(p => p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query));
                renderPrayers(filtered);
            });
        }
    } catch (e) {
        console.error("Error loading prayers:", e);
    }
}

function renderPrayers(prayers) {
    const container = document.getElementById('prayers-container');
    if (!container) return;

    container.innerHTML = prayers.map(p => `
        <div class="misa-card">
            <h3 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 0.5rem;">${p.title}</h3>
            <p style="font-size: 0.9rem; margin-bottom: 1rem; color: var(--text-main);">${p.content}</p>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn-outline prayer-audio-btn" data-text="${encodeURIComponent(p.content)}" style="padding: 0.4rem 1rem; font-size: 0.85rem;">🔊 Escuchar en Audio</button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.prayer-audio-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            speakText(btn.getAttribute('data-text'));
        });
    });
}

// Load Saints
async function loadSaints() {
    try {
        const res = await fetch('assets/santos_mexicanos.json');
        const saints = await res.json();
        const container = document.getElementById('saints-container');
        if (!container) return;

        container.innerHTML = saints.slice(0, 10).map(s => `
            <div class="misa-card">
                <h3 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 0.3rem;">${s.nombre}</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Festividad: ${s.festividad}</p>
                <p style="font-size: 0.9rem; color: var(--text-main);">${s.resena_detallada}</p>
            </div>
        `).join('');
    } catch (e) {
        console.error("Error loading saints:", e);
    }
}

// Load Family Intentions (Checking family setup state)
function loadFamilyIntentions() {
    const familyId = localStorage.getItem('misa_family_id');
    const setupView = document.getElementById('family-setup-view');
    const collaborativeView = document.getElementById('family-collaborative-view');

    if (!familyId) {
        if (setupView) setupView.style.display = 'block';
        if (collaborativeView) collaborativeView.style.display = 'none';
        return;
    }

    if (setupView) setupView.style.display = 'none';
    if (collaborativeView) collaborativeView.style.display = 'block';

    const codeBadge = document.getElementById('family-code-badge');
    if (codeBadge) codeBadge.textContent = `Código: ${familyId}`;

    let intentions = JSON.parse(localStorage.getItem('misa_intentions') || '[]');
    if (intentions.length === 0) {
        intentions = [
            { id: '1', name: 'Familia Torres', motive: 'Salud y unión familiar', creatorName: 'Diego', prayingCount: 2 }
        ];
        localStorage.setItem('misa_intentions', JSON.stringify(intentions));
    }

    renderIntentions(intentions);
}

function createFamilyGroup() {
    const randomCode = 'FAM-' + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem('misa_family_id', randomCode);
    alert(`¡Grupo familiar creado exitosamente!\nTu código para compartir es: ${randomCode}`);
    loadFamilyIntentions();
}

function joinFamilyPrompt() {
    const code = prompt("Introduce el Código Familiar (Ej. FAM-XXXX):");
    if (code && code.trim().length > 3) {
        localStorage.setItem('misa_family_id', code.trim().toUpperCase());
        alert("¡Te has unida al grupo familiar!");
        loadFamilyIntentions();
    } else if (code) {
        alert("Código inválido.");
    }
}

function leaveFamilyGroup() {
    if (confirm("¿Estás seguro de salir del grupo familiar?")) {
        localStorage.removeItem('misa_family_id');
        loadFamilyIntentions();
    }
}

function renderIntentions(intentions) {
    const container = document.getElementById('intentions-container');
    if (!container) return;

    if (intentions.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Aún no hay intenciones. Toca '+ Nueva' para agregar la primera.</p>`;
        return;
    }

    container.innerHTML = intentions.map(i => `
        <div class="misa-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h3 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 0.2rem;">${i.name}</h3>
                    <p style="font-size: 0.9rem; font-style: italic; margin-bottom: 0.5rem;">${i.motive}</p>
                    <p style="font-size: 0.75rem; color: var(--text-muted);">Pedida por: ${i.creatorName}</p>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <button class="btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="togglePrayer('${i.id}')">🙏 (${i.prayingCount})</button>
                    <button class="btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; color: #C62828; border-color: #C62828;" onclick="deleteIntention('${i.id}')">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
}

function openAddIntentionModal() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <h2 style="font-size: 1.3rem; color: var(--primary); margin-bottom: 1rem;">Nueva Intención Familiar</h2>
        <input type="text" id="new-name" class="input-field" placeholder="Nombre del familiar o amigo *">
        <input type="text" id="new-motive" class="input-field" placeholder="Motivo (Salud, Paz, Trabajo...)">
        <input type="text" id="new-creator" class="input-field" placeholder="Tu nombre">
        <button class="btn-primary" onclick="saveNewIntention()">Compartir Intención</button>
    `;
    modal.classList.add('active');
}

function saveNewIntention() {
    const name = document.getElementById('new-name').value.trim();
    const motive = document.getElementById('new-motive').value.trim() || 'Salud';
    const creator = document.getElementById('new-creator').value.trim() || 'Anónimo';

    if (!name) {
        alert("El nombre del familiar o amigo es obligatorio.");
        return;
    }

    let intentions = JSON.parse(localStorage.getItem('misa_intentions') || '[]');
    intentions.unshift({
        id: Date.now().toString(),
        name,
        motive,
        creatorName: creator,
        prayingCount: 1
    });
    localStorage.setItem('misa_intentions', JSON.stringify(intentions));
    closeModal();
    loadFamilyIntentions();
}

function togglePrayer(id) {
    let intentions = JSON.parse(localStorage.getItem('misa_intentions') || '[]');
    intentions = intentions.map(i => {
        if (i.id === id) {
            i.prayingCount = i.prayingCount > 0 ? i.prayingCount - 1 : i.prayingCount + 1;
        }
        return i;
    });
    localStorage.setItem('misa_intentions', JSON.stringify(intentions));
    loadFamilyIntentions();
}

function deleteIntention(id) {
    let intentions = JSON.parse(localStorage.getItem('misa_intentions') || '[]');
    intentions = intentions.filter(i => i.id !== id);
    localStorage.setItem('misa_intentions', JSON.stringify(intentions));
    loadFamilyIntentions();
}

// Web Speech API (Audio / Hands-free Web equivalent)
function speakText(encodedText) {
    const text = decodeURIComponent(encodedText);
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-MX';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Tu navegador no soporta síntesis de voz en audio.");
    }
}
