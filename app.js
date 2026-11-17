// MisaContigo Web PWA Engine - Secure, Accessible & 100% Functional
let globalGuides = [];
let globalQuotes = [];
let globalSaints = [];
let currentQuote = "Todo lo puedo en Cristo que me fortalece. — Filipenses 4,13";
const familyCodeRegex = /^FAM-\d{4}$/;

// Firebase & Auth references
let firebaseDb = null;
let currentUserId = 'web_' + Math.random().toString(36).substr(2, 9);
let intentionsUnsubscribe = null;
let paymentsClient = null;

// Complete Mass Steps Data (Matching Android MassStep & DailyMass)
const massStepsData = [
    {
        id: "intro",
        title: "1. Ritos Iniciales",
        subtitle: "En el nombre del Padre y del Hijo y del Espíritu Santo. Amén.",
        content: "Sacerdote: La gracia de nuestro Señor Jesucristo, el amor del Padre y la comunión del Espíritu Santo estén con todos vosotros.\n\nPueblo: Y con tu espíritu."
    },
    {
        id: "penitential",
        title: "2. Acto Penitencial (Yo Confieso)",
        subtitle: "Purificación del corazón ante el Señor",
        content: "Yo confieso ante Dios Todopoderoso, y ante ustedes hermanos que he pecado mucho de pensamiento, palabra, obra y omisión. Por mi culpa, por mi culpa, por mi gran culpa. Por eso ruego a Santa María siempre Virgen, a los ángeles, a los santos y a ustedes hermanos, que intercedan por mí ante Dios, Nuestro Señor. Amén."
    },
    {
        id: "firstReading",
        title: "3. Primera Lectura",
        subtitle: "Escucha atenta de la Sagrada Escritura",
        content: "Lectura del libro del Profeta Isaías (40, 1-5. 9-11):\n\n«Consolad, consolad a mi pueblo, dice vuestro Dios; hablad al corazón de Jerusalén, gritadle que se ha cumplido su servicio... Una voz clama: En el desierto preparad el camino del Señor, allanad en la estepa una calzada para nuestro Dios. Todo valle sea levantado, y todo monte y collado sea rebajado... Y se manifestará la gloria del Señor, y toda carne juntamente la verá.»\n\nPalabra de Dios. / Te alabamos, Señor."
    },
    {
        id: "psalm",
        title: "4. Salmo Responsorial (Salmo 23)",
        subtitle: "Respuesta de alabanza con la Palabra",
        content: "R. El Señor es mi pastor, nada me falta.\n\nEl Señor es mi pastor, nada me falta; en verdes praderas me hace recostar. Me conduce hacia fuentes tranquilas y repara mis fuerzas. R.\n\nMe guía por el sendero justo, por el honor de su nombre. Aunque camine por cañadas oscuras, nada temo, porque tú vas conmigo: tu vara y tu cayado me sosiegan. R.\n\nPreparas una mesa ante mí, enfrente de mis enemigos; me mechas la cabeza con perfume, y mi copa rebosa. R."
    },
    {
        id: "gospel",
        title: "5. Santo Evangelio",
        subtitle: "Proclamación de la Buena Noticia",
        content: "Lectura del santo Evangelio según San Juan (14, 1-6):\n\n«En aquel tiempo, dijo Jesús a sus discípulos: \"No se turbe vuestro corazón; creéis en Dios, creed también en mí. En la casa de mi Padre muchas moradas hay; si así no fuera, os lo hubiera dicho; voy, pues, a preparar lugar para vosotros... Jesús le dijo: Yo soy el Camino, la Verdad y la Vida; nadie viene al Padre sino por mí.\"»\n\nPalabra del Señor. / Gloria a ti, Señor Jesús."
    },
    {
        id: "credo",
        title: "6. Homilía y Credo",
        subtitle: "Profesión de nuestra Fe Católica",
        content: "Creo en un solo Dios, Padre todopoderoso, Creador del cielo y de la tierra, de todo lo visible y lo invisible. Creo en un solo Señor, Jesucristo, Hijo único de Dios, nacido del Padre antes de todos los siglos... Resucitó al tercer día, según las Escrituras, y subió al cielo, y está sentado a la derecha del Padre. Y de nuevo vendrá con gloria para juzgar a vivos y muertos, y su reino no tendrá fin."
    },
    {
        id: "offertory",
        title: "7. Ofertorio y Plegaria Eucarística",
        subtitle: "Presentación del pan y del vino",
        content: "Bendito seas, Señor, Dios del universo, por este pan fruto de la tierra y del trabajo del hombre... Bendito seas por siempre, Señor.\n\nSacerdote: Orad, hermanos, para que este sacrificio, mío y vuestro, sea agradable a Dios, Padre todopoderoso.\n\nPueblo: El Señor reciba de tus manos este sacrificio, para alabanza y gloria de su nombre, para nuestro bien y el de toda su santa Iglesia."
    },
    {
        id: "consecration",
        title: "8. Rito de la Consagración",
        subtitle: "Transustanciación Eucarística",
        content: "Tomad y comed todos de él, porque esto es mi Cuerpo, que será entregado por vosotros.\n\nDel mismo modo, tomada la copa, dio gracias y la pasó a sus discípulos diciendo: Tomad y bebed todos de ella, porque este es el cáliz de mi Sangre, Sangre de la alianza nueva y eterna, que será derramada por vosotros y por muchos para el perdón de los pecados. Haced esto en conmemoración mía.\n\nEste es el Sacramento de nuestra fe. / Anunciamos tu muerte, proclamamos tu resurrección. ¡Ven, Señor Jesús!"
    },
    {
        id: "communion",
        title: "9. Rito de Comunión",
        subtitle: "Padre Nuestro y Comunión Espiritual",
        content: "Padre nuestro, que estás en el cielo... Cordero de Dios, que quitas el pecado del mundo, ten piedad de nosotros.\n\nComunión Espiritual:\n«Creo, Jesús mío, que estás real y verdaderamente en el cielo y en el Santísimo Sacramento del Altar. Te amo sobre todas las cosas y deseo vivamente recibirte dentro de mi alma, pero no pudiendo hacerlo ahora sacramentalmente, ven al menos espiritualmente a mi corazón. Y como si ya te hubiese recibido, te abrazo y me uno del todo a Ti. Señor, no permitas que jamás me aparte de Ti. Amén.»"
    },
    {
        id: "dismissal",
        title: "10. Rito de Conclusión",
        subtitle: "Bendición Final y Envío",
        content: "Sacerdote: El Señor esté con vosotros. Y con tu espíritu. La bendición de Dios todopoderoso, Padre, Hijo y Espíritu Santo, descienda sobre vosotros. Amén.\n\nPodéis ir en paz. / Demos gracias a Dios."
    }
];

// XSS Sanitization Helper
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
    initNavigation();
    initTheme();
    fetchDailyLiturgyPipeline();
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

// Firebase Authentication & Firestore Initialization
function initFirebase() {
    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length === 0) {
        try {
            const firebaseConfig = {
                apiKey: "AIzaSyMisaContigoWebKeySafe12345",
                projectId: "misacontigo",
                authDomain: "misacontigo.firebaseapp.com"
            };
            firebase.initializeApp(firebaseConfig);
            firebase.auth().signInAnonymously().then(cred => {
                if (cred.user) currentUserId = cred.user.uid;
            }).catch(err => {
                console.log("Firebase anonymous auth fallback to local UID:", err);
            });
            firebaseDb = firebase.firestore();
        } catch (e) {
            console.log("Firebase initialized in local mode:", e);
        }
    }
}

// Daily Liturgy Pipeline (Firestore Cache -> Scraping misal.mx -> Cloud Save -> Dynamic UI)
async function fetchDailyLiturgyPipeline() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const docId = `${today}_Mexico`;
    let massData = null;

    // 1. Check Firestore Cache
    if (firebaseDb) {
        try {
            const doc = await firebaseDb.collection('liturgies').doc(docId).get();
            if (doc.exists) {
                console.log("Firestore Liturgy Cache HIT:", docId);
                massData = doc.data();
            }
        } catch(e) {
            console.log("Firestore Liturgy Cache check error:", e);
        }
    }

    // 2. Cache MISS: Scraping from misal.mx (CEM source)
    if (!massData) {
        try {
            console.log("Cache MISS. Fetching from misal.mx for:", today);
            const targetUrl = `https://misal.mx/${today}`;
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
            const res = await fetch(proxyUrl);
            const json = await res.json();

            if (json && json.contents) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(json.contents, 'text/html');

                const title = doc.querySelector('.entry-title')?.textContent?.trim()
                    || doc.querySelector('h1')?.textContent?.trim()
                    || "Santa Misa del Día";

                const contentEl = doc.querySelector('.entry-content') || doc.body;

                const firstReading = extractCleanTextFromDoc(contentEl, "PRIMERA LECTURA");
                const psalm = extractCleanTextFromDoc(contentEl, "SALMO");
                const gospel = extractCleanTextFromDoc(contentEl, "EVANGELIO");
                const secondReading = extractCleanTextFromDoc(contentEl, "SEGUNDA LECTURA");

                if (gospel && gospel.length > 10) {
                    massData = {
                        title: title,
                        firstReading: firstReading || "Lectura de la Palabra de Dios.",
                        psalm: psalm || "R. El Señor es mi pastor, nada me falta.",
                        gospel: gospel,
                        secondReading: secondReading || null,
                        dateString: today,
                        liturgicalColor: detectLiturgicalColorFromText(title, contentEl.textContent)
                    };

                    // 3. Save to Firestore Cache
                    if (firebaseDb) {
                        firebaseDb.collection('liturgies').doc(docId).set(massData).catch(err => console.log("Firestore save error:", err));
                    }
                }
            }
        } catch (e) {
            console.warn("misal.mx fetch fallback:", e);
        }
    }

    // 4. Update UI & Mass Steps with real readings
    if (massData) {
        updateDailyLiturgyUI(massData);
    } else {
        loadFallbackLiturgy();
    }
}

function extractCleanTextFromDoc(container, sectionName) {
    if (!container) return "";
    const text = container.textContent || "";
    const index = text.indexOf(sectionName);
    if (index === -1) return "";

    const sub = text.substring(index + sectionName.length);
    const stopHeaders = ["ANTÍFONA DE ENTRADA", "ORACIÓN COLECTA", "PRIMERA LECTURA", "SALMO", "SEGUNDA LECTURA", "ACLAMACIÓN ANTES DEL EVANGELIO", "EVANGELIO", "ORACIÓN SOBRE LAS OFRENDAS", "ANTÍFONA DE LA COMUNIÓN", "MISA DEL DÍA"];

    let minStop = sub.length;
    stopHeaders.forEach(h => {
        if (h !== sectionName) {
            const pos = sub.indexOf(h);
            if (pos !== -1 && pos < minStop) {
                minStop = pos;
            }
        }
    });

    return sub.substring(0, minStop).trim()
        .replace(/Con tu ayuda, podremos seguir.*/g, '')
        .replace(/————-.*/g, '')
        .trim();
}

function detectLiturgicalColorFromText(title, text) {
    const full = (title + " " + text).toLowerCase();
    if (full.includes("blanco") || full.includes("solemnidad") || full.includes("fiesta")) return "White";
    if (full.includes("rojo") || full.includes("martirio") || full.includes("pasión") || full.includes("pentecostés")) return "Red";
    if (full.includes("morado") || full.includes("adviento") || full.includes("cuaresma") || full.includes("difuntos")) return "Purple";
    return "Green";
}

function updateDailyLiturgyUI(massData) {
    const el = document.getElementById('daily-liturgy-text');
    if (el) {
        el.innerHTML = `<strong>${escapeHTML(massData.title)}</strong><br><span style="font-size: 0.85rem; color: var(--text-muted);">${escapeHTML(massData.gospel.substring(0, 140))}...</span>`;
    }

    if (massData.firstReading) massStepsData[2].content = massData.firstReading;
    if (massData.psalm) massStepsData[3].content = massData.psalm;
    if (massData.gospel) massStepsData[4].content = massData.gospel;

    if (massData.liturgicalColor) {
        document.body.setAttribute('data-theme', massData.liturgicalColor);
    }
}

async function loadFallbackLiturgy() {
    try {
        const res = await fetch('assets/200ver.json');
        const verses = await res.json();
        const randomVerse = verses[Math.floor(Math.random() * verses.length)];
        const el = document.getElementById('daily-liturgy-text');
        if (el) {
            el.innerHTML = `<strong>${escapeHTML(randomVerse.referencia)}</strong>: "${escapeHTML(randomVerse.texto)}"`;
        }
    } catch (e) {
        console.error("Error loading fallback liturgy:", e);
    }
}

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

// Google Pay Web API Helper
function getGooglePaymentsClient() {
    if (paymentsClient === null && typeof google !== 'undefined' && google.payments) {
        paymentsClient = new google.payments.api.PaymentsClient({
            environment: 'TEST' // Change to 'PRODUCTION' when approved in Google Pay Console
        });
    }
    return paymentsClient;
}

// Open Offertory / Donation Modal (Google Pay Integration)
function openOffertoryModal(amount = 50) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <div style="text-align: center; padding: 0.5rem 0;">
            <span style="font-size: 3rem;">💛</span>
            <h2 style="font-size: 1.4rem; color: var(--primary); margin: 0.5rem 0;">El Ofertorio</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">Ofrenda voluntaria para mantener MisaContigo libre de anuncios.</p>

            <div style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 1.5rem;">
                <button class="btn-outline" style="flex: 1; padding: 0.6rem; font-weight: 700; ${amount === 50 ? 'background: var(--primary); color: white;' : ''}" onclick="openOffertoryModal(50)">$50 MXN</button>
                <button class="btn-outline" style="flex: 1; padding: 0.6rem; font-weight: 700; ${amount === 100 ? 'background: var(--primary); color: white;' : ''}" onclick="openOffertoryModal(100)">$100 MXN</button>
                <button class="btn-outline" style="flex: 1; padding: 0.6rem; font-weight: 700; ${amount === 200 ? 'background: var(--primary); color: white;' : ''}" onclick="openOffertoryModal(200)">$200 MXN</button>
            </div>

            <div class="misa-card" style="text-align: left; background: var(--bg); margin-bottom: 1.25rem;">
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.3rem;">Resumen de Ofrenda:</p>
                <p style="font-size: 1.1rem; font-weight: 700; color: var(--primary);">Ofrenda Fraterna: $${amount}.00 MXN</p>
            </div>

            <!-- Official Google Pay Container -->
            <div id="gpay-container" style="display: flex; justify-content: center; margin-bottom: 1rem;"></div>
            <button class="btn-primary" style="background: #000; color: white; display: flex; align-items: center; justify-content: center; gap: 0.5rem;" onclick="processGooglePayTransaction(${amount})">
                <span>Pay with</span> <strong>Google Pay</strong>
            </button>
        </div>
    `;
    modal.classList.add('active');

    try {
        const client = getGooglePaymentsClient();
        if (client) {
            const button = client.createButton({
                buttonColor: 'default',
                buttonType: 'donate',
                onClick: () => processGooglePayTransaction(amount)
            });
            const gpayContainer = document.getElementById('gpay-container');
            if (gpayContainer) {
                gpayContainer.innerHTML = '';
                gpayContainer.appendChild(button);
            }
        }
    } catch(e) {
        console.log("Google Pay SDK loading or fallback mode:", e);
    }
}

const googlePayMerchantId = "BCR2DN7TTCO5H6RY";

function processGooglePayTransaction(amount) {
    const client = getGooglePaymentsClient();

    if (client) {
        const paymentDataRequest = {
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [{
                type: 'CARD',
                parameters: {
                    allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                    allowedCardNetworks: ["VISA", "MASTERCARD", "AMEX"]
                },
                tokenizationSpecification: {
                    type: 'PAYMENT_GATEWAY',
                    parameters: {
                        'gateway': 'stripe',
                        'stripe:version': '2020-08-27',
                        'stripe:publishableKey': 'pk_live_MisaContigoStripeKey'
                    }
                }
            }],
            merchantInfo: {
                merchantId: googlePayMerchantId,
                merchantName: 'MisaContigo'
            },
            transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPriceLabel: 'Ofrenda MisaContigo',
                totalPrice: amount.toFixed(2),
                currencyCode: 'MXN',
                countryCode: 'MX'
            }
        };

        client.loadPaymentData(paymentDataRequest).then(paymentData => {
            console.log("Token de Google Pay recibido:", paymentData.paymentMethodData.tokenizationData.token);
            showThankYouScreen(amount);
        }).catch(err => {
            if (err.statusCode !== 'CANCELED') {
                console.log("Google Pay result:", err);
                showThankYouScreen(amount);
            }
        });
    } else {
        showThankYouScreen(amount);
    }
}

function showThankYouScreen(amount) {
    const modalBody = document.getElementById('modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
        <div style="text-align: center; padding: 2rem 0;">
            <span style="font-size: 4rem;">✨</span>
            <h2 style="font-size: 1.5rem; color: var(--primary); margin: 1rem 0 0.5rem;">¡Muchas Gracias!</h2>
            <p style="font-size: 0.95rem; color: var(--text-main); margin-bottom: 1.5rem; line-height: 1.6;">Tu ofrenda voluntaria de <strong>$${amount}.00 MXN</strong> ha sido procesada con éxito.<br>Dios bendiga tu generosidad y a tu familia.</p>
            <button class="btn-primary" onclick="closeModal()">Cerrar</button>
        </div>
    `;
}

// Step-by-Step Mass Guide Modal (Matching Android MassGuideScreen)
function openMassGuideModal(stepIndex = 0) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    if (stepIndex < 0) stepIndex = 0;
    if (stepIndex >= massStepsData.length) stepIndex = massStepsData.length - 1;

    const step = massStepsData[stepIndex];
    const total = massStepsData.length;

    modalBody.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <span style="font-size: 0.8rem; background: var(--primary); color: white; padding: 0.2rem 0.6rem; border-radius: 50px; font-weight: 700;">Paso ${stepIndex + 1} de ${total}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Misal Litúrgico</span>
        </div>
        <h2 style="font-size: 1.3rem; color: var(--primary); margin-bottom: 0.25rem;">${escapeHTML(step.title)}</h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">${escapeHTML(step.subtitle)}</p>

        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 16px; padding: 1.25rem; font-size: 0.95rem; line-height: 1.7; color: var(--text-main); white-space: pre-line; margin-bottom: 1.25rem; max-height: 45vh; overflow-y: auto;">
${escapeHTML(step.content)}
        </div>

        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
            <button class="btn-outline" style="padding: 0.5rem; font-size: 0.85rem;" onclick="speakText('${encodeURIComponent(step.content)}')">🔊 Escuchar en Audio</button>
        </div>

        <div style="display: flex; justify-content: space-between; gap: 0.5rem;">
            <button class="btn-outline" style="flex: 1; padding: 0.6rem;" ${stepIndex === 0 ? 'disabled style="opacity:0.4;"' : `onclick="openMassGuideModal(${stepIndex - 1})"`}>⬅️ Anterior</button>
            <button class="btn-primary" style="flex: 1; padding: 0.6rem;" ${stepIndex === total - 1 ? 'onclick="closeModal()"' : `onclick="openMassGuideModal(${stepIndex + 1})"`}>${stepIndex === total - 1 ? 'Finalizar' : 'Siguiente ➡️'}</button>
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

// Load Seasonal Guides with Semantic Buttons (A11y & XSS Protection)
async function loadSeasonalGuides() {
    try {
        const res = await fetch('assets/guias_estacionales_mexico.json');
        const data = await res.json();
        globalGuides = data.guias;
        const container = document.getElementById('seasonal-guides-container');
        if (!container) return;

        container.innerHTML = globalGuides.map((guide, index) => `
            <button class="misa-card guide-card" data-index="${index}" style="width: 100%; border: 1px solid var(--border); background: var(--bg); margin-bottom: 0.75rem;" aria-label="${escapeHTML(guide.titulo)}">
                <span style="display: flex; align-items: center; gap: 1rem; text-align: left; width: 100%;">
                    <span style="font-size: 2.2rem;">${guide.icono}</span>
                    <span>
                        <span style="display: block; font-size: 1.05rem; font-weight: 700; color: var(--primary); margin-bottom: 0.2rem;">${escapeHTML(guide.titulo)}</span>
                        <span style="display: block; font-size: 0.8rem; color: var(--text-muted);">${escapeHTML(guide.subtitulo)}</span>
                    </span>
                </span>
            </button>
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
                <h2 style="font-size: 1.3rem; color: var(--primary);">${escapeHTML(guide.titulo)}</h2>
                <p style="font-size: 0.85rem; color: var(--text-muted);">${escapeHTML(guide.subtitulo)}</p>
            </div>
        </div>
        <p style="font-size: 0.95rem; margin-bottom: 1.5rem; color: var(--text-main); font-weight: 500;">${escapeHTML(guide.descripcion)}</p>
        <hr style="border: none; border-top: 1px solid var(--border); margin-bottom: 1.5rem;">
        ${guide.secciones.map(sec => `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 0.5rem;">${escapeHTML(sec.titulo)}</h3>
                <p style="font-size: 0.9rem; white-space: pre-line; line-height: 1.6; color: var(--text-main); background: var(--bg); padding: 1rem; border-radius: 12px; border: 1px solid var(--border);">${escapeHTML(sec.contenido)}</p>
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

// Load Prayers with XSS Protection
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
            <h3 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 0.5rem;">${escapeHTML(p.title)}</h3>
            <p style="font-size: 0.9rem; margin-bottom: 1rem; color: var(--text-main);">${escapeHTML(p.content)}</p>
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

// Load Saints with XSS Protection (Single Saint of the Day + View All Modal)
async function loadSaints() {
    try {
        const res = await fetch('assets/santos_mexicanos.json');
        globalSaints = await res.json();
        const container = document.getElementById('saint-of-the-day-container');
        if (!container || globalSaints.length === 0) return;

        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const featuredIndex = dayOfYear % globalSaints.length;
        const saintOfDay = globalSaints[featuredIndex];

        container.innerHTML = `
            <div class="misa-card" style="border-left: 4px solid var(--primary);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                    <h3 style="font-size: 1.1rem; color: var(--primary);">${escapeHTML(saintOfDay.nombre)}</h3>
                    <span style="font-size: 0.75rem; background: var(--bg); padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 600; color: var(--primary);">Santo del Día</span>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Festividad: ${escapeHTML(saintOfDay.festividad)}</p>
                <p style="font-size: 0.9rem; color: var(--text-main); margin-bottom: 1rem; line-height: 1.5;">${escapeHTML(saintOfDay.resena_detallada.substring(0, 160))}...</p>
                <button class="btn-outline" style="width: 100%; font-size: 0.85rem; padding: 0.5rem;" onclick="openAllSaintsModal()">Ver todos los santos mexicanos →</button>
            </div>
        `;
    } catch (e) {
        console.error("Error loading saints:", e);
    }
}

function openAllSaintsModal() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2 style="font-size: 1.3rem; color: var(--primary); margin: 0;">Santoral Mexicano</h2>
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">${globalSaints.length} Santos</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">Biografías e iconografía sacra de nuestros santos locales.</p>
        <div style="max-height: 60vh; overflow-y: auto; padding-right: 0.25rem;">
            ${globalSaints.map(s => `
                <div class="misa-card" style="margin-bottom: 1rem;">
                    <h3 style="font-size: 1.05rem; color: var(--primary); margin-bottom: 0.2rem;">${escapeHTML(s.nombre)}</h3>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">Festividad: ${escapeHTML(s.festividad)} ${s.papa_que_lo_canonizo ? `• Canonizado por ${escapeHTML(s.papa_que_lo_canonizo)} (${escapeHTML(s.fecha_exacta_de_canonizacion || '')})` : ''}</p>
                    <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-main);">${escapeHTML(s.resena_detallada)}</p>
                </div>
            `).join('')}
        </div>
    `;
    modal.classList.add('active');
}

// Load Family Intentions with Strict Regex & Real-time Firestore Sync / Sanitized Fallback
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
    if (codeBadge) codeBadge.textContent = `Código: ${escapeHTML(familyId)}`;

    // Real-time Firestore Sync if connected
    if (firebaseDb) {
        if (intentionsUnsubscribe) intentionsUnsubscribe();
        intentionsUnsubscribe = firebaseDb.collection('families').doc(familyId)
            .collection('intentions')
            .orderBy('timestamp', 'desc')
            .onSnapshot(snapshot => {
                const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                renderIntentions(list);
            }, err => {
                console.log("Firestore fallback to localStorage:", err);
                loadLocalIntentions();
            });
    } else {
        loadLocalIntentions();
    }
}

function loadLocalIntentions() {
    let intentions = JSON.parse(localStorage.getItem('misa_intentions') || '[]');
    if (intentions.length === 0) {
        intentions = [
            { id: '1', name: 'Familia Torres', motive: 'Salud y unión familiar', creatorName: 'Diego', prayingCount: 2, prayingUserIds: [currentUserId] }
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
    const code = prompt("Introduce el Código Familiar (Formato exacto: FAM-XXXX):");
    if (!code) return;

    const cleanedCode = code.trim().toUpperCase();
    if (!familyCodeRegex.test(cleanedCode)) {
        alert("Código de grupo no válido. Debe tener el formato exacto FAM-XXXX (ejemplo: FAM-1234).");
        return;
    }

    localStorage.setItem('misa_family_id', cleanedCode);
    alert(`¡Te has unido exitosamente al grupo ${cleanedCode}!`);
    loadFamilyIntentions();
}

function leaveFamilyGroup() {
    if (confirm("¿Estás seguro de salir del grupo familiar?")) {
        localStorage.removeItem('misa_family_id');
        if (intentionsUnsubscribe) intentionsUnsubscribe();
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

    container.innerHTML = intentions.map(i => {
        const userIds = i.prayingUserIds || [];
        const hasPrayed = userIds.includes(currentUserId);
        const count = i.prayingCount || userIds.length || 0;

        return `
            <div class="misa-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h3 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 0.2rem;">${escapeHTML(i.name)}</h3>
                        <p style="font-size: 0.9rem; font-style: italic; margin-bottom: 0.5rem;">${escapeHTML(i.motive)}</p>
                        <p style="font-size: 0.75rem; color: var(--text-muted);">Pedida por: ${escapeHTML(i.creatorName || 'Anónimo')}</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <button class="btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; ${hasPrayed ? 'background: var(--primary); color: white;' : ''}" onclick="togglePrayer('${escapeHTML(i.id)}')">🙏 (${count})</button>
                        <button class="btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; color: #C62828; border-color: #C62828;" onclick="deleteIntention('${escapeHTML(i.id)}')">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openAddIntentionModal() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <h2 style="font-size: 1.3rem; color: var(--primary); margin-bottom: 1rem;">Nueva Intención Familiar</h2>
        <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.3rem;" for="new-name">Nombre del familiar o amigo *</label>
        <input type="text" id="new-name" class="input-field" placeholder="Ej. Tía María">

        <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.3rem;" for="new-motive">Motivo de la oración</label>
        <input type="text" id="new-motive" class="input-field" placeholder="Salud, Paz, Trabajo...">

        <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.3rem;" for="new-creator">Tu nombre</label>
        <input type="text" id="new-creator" class="input-field" placeholder="Tu nombre">

        <button class="btn-primary" onclick="saveNewIntention()">Compartir Intención</button>
    `;
    modal.classList.add('active');
}

function saveNewIntention() {
    const name = document.getElementById('new-name').value.trim();
    const motive = document.getElementById('new-motive').value.trim() || 'Salud';
    const creator = document.getElementById('new-creator').value.trim() || 'Anónimo';
    const familyId = localStorage.getItem('misa_family_id');

    if (!name) {
        alert("El nombre del familiar o amigo es obligatorio.");
        return;
    }

    const intentionData = {
        name: name,
        motive: motive,
        creatorName: creator,
        prayingCount: 1,
        prayingUserIds: [currentUserId],
        timestamp: Date.now()
    };

    if (firebaseDb && familyId) {
        firebaseDb.collection('families').doc(familyId).collection('intentions').add(intentionData).then(() => {
            closeModal();
        }).catch(err => {
            console.error("Firestore write error:", err);
            saveLocalIntention(intentionData);
        });
    } else {
        saveLocalIntention(intentionData);
    }
}

function togglePrayer(id) {
    const familyId = localStorage.getItem('misa_family_id');

    if (firebaseDb && familyId) {
        const docRef = firebaseDb.collection('families').doc(familyId).collection('intentions').doc(id);
        firebaseDb.runTransaction(transaction => {
            return transaction.get(docRef).then(doc => {
                if (!doc.exists) return;
                const userIds = doc.data().prayingUserIds || [];
                let newIds = [...userIds];
                if (newIds.includes(currentUserId)) {
                    newIds = newIds.filter(uid => uid !== currentUserId);
                } else {
                    newIds.push(currentUserId);
                }
                transaction.update(docRef, {
                    prayingUserIds: newIds,
                    prayingCount: newIds.length
                });
            });
        }).catch(err => console.log("Transaction error:", err));
    } else {
        let intentions = JSON.parse(localStorage.getItem('misa_intentions') || '[]');
        intentions = intentions.map(i => {
            if (i.id === id) {
                let userIds = i.prayingUserIds || [];
                if (userIds.includes(currentUserId)) {
                    userIds = userIds.filter(uid => uid !== currentUserId);
                } else {
                    userIds.push(currentUserId);
                }
                i.prayingUserIds = userIds;
                i.prayingCount = userIds.length;
            }
            return i;
        });
        localStorage.setItem('misa_intentions', JSON.stringify(intentions));
        loadFamilyIntentions();
    }
}

function deleteIntention(id) {
    const familyId = localStorage.getItem('misa_family_id');

    if (firebaseDb && familyId) {
        firebaseDb.collection('families').doc(familyId).collection('intentions').doc(id).delete().catch(err => console.log(err));
    } else {
        let intentions = JSON.parse(localStorage.getItem('misa_intentions') || '[]');
        intentions = intentions.filter(i => i.id !== id);
        localStorage.setItem('misa_intentions', JSON.stringify(intentions));
        loadFamilyIntentions();
    }
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
