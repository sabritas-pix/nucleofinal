/**
 * NÚCLEO CRM - PLATAFORMA INTEGRAL DE SEGUROS Y COBRANZA
 * Controlador Principal del Frontend (SPA)
 */

document.addEventListener('DOMContentLoaded', () => {
    initUserSession();
    initGlobalEventListeners();
    loadDashboardAnalytics();
    preloadAgentesYClientes();
});

// Formateadores globales
const currencyFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
});

// Monedas soportadas en pólizas: Pesos (MXN), Dólares (USD) y UDIS (UDI)
const MONEDAS = ['MXN', 'USD', 'UDI'];
const MONEDA_LABELS = { MXN: 'Pesos', USD: 'Dólares', UDI: 'UDIS' };

const SVG_ICONS = {
    whatsapp: `<svg viewBox="0 0 24 24" class="icon-svg"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.05-1.07l-.29-.17-3.12.82.83-3.04-.19-.3a8.21 8.21 0 0 1-1.26-4.48c0-4.54 3.7-8.24 8.24-8.24m4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.41 1.02 2.58.13.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.17-.48-.29z"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" class="icon-svg"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`,
    envelope: `<svg viewBox="0 0 24 24" class="icon-svg"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
    upload: `<svg viewBox="0 0 24 24" class="icon-svg"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>`,
    edit: `<svg viewBox="0 0 24 24" class="icon-svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" class="icon-svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
    download: `<svg viewBox="0 0 24 24" class="icon-svg"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>`,
    pdf: `<svg viewBox="0 0 24 24" class="icon-svg"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zm4.5 2h1v-3h-1v3zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/></svg>`,
    file: `<svg viewBox="0 0 24 24" class="icon-svg"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`
};

function formatMoney(amount, moneda = 'MXN') {
    const n = parseFloat(amount) || 0;
    const m = (moneda || 'MXN').toUpperCase();
    const num = n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (m === 'USD') return `US$${num} USD`;
    if (m === 'UDI') return `${num} UDIS`;
    return `$${num} MXN`;
}

/**
 * Pinta en un KPI los montos separados por moneda.
 * porMoneda = { MXN: {pendiente:{monto,cantidad},...}, USD: {...}, UDI: {...} }
 */
function renderMoneyBreakdown(elId, porMoneda, key, monedaFiltro = 'todas') {
    const el = document.getElementById(elId);
    if (!el) return { cantidad: 0 };
    const lista = monedaFiltro !== 'todas' ? [monedaFiltro] : MONEDAS;
    let cantidad = 0;
    const lines = [];
    lista.forEach(m => {
        const d = (porMoneda[m] && porMoneda[m][key]) || { monto: 0, cantidad: 0 };
        cantidad += d.cantidad || 0;
        // Siempre se muestra MXN; USD y UDIS solo si tienen movimientos (o si están filtradas)
        if (m === 'MXN' || d.monto > 0 || d.cantidad > 0 || monedaFiltro !== 'todas') {
            lines.push(`<div class="kpi-money-line">${formatMoney(d.monto, m)}</div>`);
        }
    });
    el.innerHTML = lines.join('');
    return { cantidad };
}

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
});

// Estado global de la aplicación
const AppState = {
    currentView: 'dashboard',
    agentes: [],
    aseguradoras: [],
    clientes: [],
    polizas: [],
    cobranzas: [],
    documentos: [],
    equipos: [],
    todosMiembros: [],
    settingsSubtab: 'contactos',
    contactos: [],
    filtroTimeout: null,
    // Calendario y Recordatorios
    calYear: new Date().getFullYear(),
    calMonth: new Date().getMonth() + 1,
    calSelectedDay: null,
    calEvents: [],
    calFilterCliente: 'todos',
    calFilterTipo: 'todos'
};

/* ==========================================================================
   1. SESIÓN Y PERFIL DE USUARIO
   ========================================================================== */

function initUserSession() {
    const userFullname = localStorage.getItem('nucleo_fullname');
    const userEmail = localStorage.getItem('nucleo_user');

    const displayNameEl = document.getElementById('user-display-name');
    const welcomeTitleEl = document.getElementById('welcome-title');
    const avatarCharEl = document.getElementById('user-avatar-char');

    let name = userFullname || userEmail || 'Agente';
    if (displayNameEl) displayNameEl.textContent = name;
    // El título del dashboard se mantiene solo como "Dashboard" (sin saludo ni descripción).
    if (welcomeTitleEl) {
        welcomeTitleEl.textContent = 'Dashboard';
    }
    if (avatarCharEl && name) {
        avatarCharEl.textContent = name.charAt(0).toUpperCase();
    }

    // Verificar sesión PHP
    fetch('check_session.php')
        .then(res => res.json())
        .then(data => {
            if (data.authenticated && data.user) {
                const fullName = data.user.fullname || data.user.email;
                if (displayNameEl) displayNameEl.textContent = fullName;
                if (avatarCharEl) avatarCharEl.textContent = fullName.charAt(0).toUpperCase();
                localStorage.setItem('nucleo_fullname', data.user.fullname || '');
                localStorage.setItem('nucleo_user', data.user.email || '');
            }
        })
        .catch(() => { });
}

async function logoutUser() {
    localStorage.removeItem('nucleo_user');
    localStorage.removeItem('nucleo_fullname');
    try {
        await fetch('logout.php');
    } catch (e) { }
    window.location.href = 'index.html';
}

/* ==========================================================================
   2. NAVEGACIÓN ENTRE VISTAS (SPA ROUTING)
   ========================================================================== */

function switchView(viewName) {
    AppState.currentView = viewName;

    // Actualizar sidebar nav items
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => {
        el.classList.remove('active');
    });
    const targetNav = document.getElementById(`nav-${viewName}`);
    if (targetNav) targetNav.classList.add('active');

    // Cambiar paneles visibles
    document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    const targetPanel = document.getElementById(`view-${viewName}`);
    if (targetPanel) targetPanel.classList.add('active');

    // Actualizar título breadcrumb (minimalista, sin iconos)
    const breadcrumb = document.getElementById('breadcrumb-title');
    const titles = {
        dashboard: 'Dashboard',
        polizas: 'Pólizas',
        cobranza: 'Cobranza',
        tramites: 'Trámites',
        clientes: 'Clientes',
        calendario: 'Calendario',
        documentos: 'Documentos',
        agentes: 'Agentes',
        aseguradoras: 'Aseguradoras',
        settings: 'Equipo'
    };
    if (breadcrumb && titles[viewName]) {
        breadcrumb.textContent = titles[viewName];
    }

    // Cerrar sidebar en pantallas pequeñas si estaba abierto
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
    }

    // Cargar información de la vista seleccionada
    if (viewName === 'dashboard') {
        loadDashboardAnalytics();
    } else if (viewName === 'polizas') {
        loadPolizas();
    } else if (viewName === 'cobranza') {
        loadCobranzas();
    } else if (viewName === 'tramites') {
        loadTramites();
    } else if (viewName === 'clientes') {
        loadClientes();
    } else if (viewName === 'calendario') {
        loadCalendarEvents();
    } else if (viewName === 'documentos') {
        loadDocumentos();
    } else if (viewName === 'agentes') {
        loadAgentes();
    } else if (viewName === 'aseguradoras') {
        loadAseguradoras();
    } else if (viewName === 'settings') {
        loadSettings();
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
}

function handleGlobalSearch(term) {
    term = term.trim().toLowerCase();
    if (!term) return;

    // Si busca algo y estamos en dashboard, cambiar a la vista relevante
    if (AppState.currentView === 'dashboard') {
        switchView('polizas');
        const polSearch = document.getElementById('polizas-search');
        if (polSearch) {
            polSearch.value = term;
            filterPolizasTable();
        }
    } else if (AppState.currentView === 'polizas') {
        const polSearch = document.getElementById('polizas-search');
        if (polSearch) {
            polSearch.value = term;
            filterPolizasTable();
        }
    } else if (AppState.currentView === 'cobranza') {
        const cobSearch = document.getElementById('cobranza-search');
        if (cobSearch) {
            cobSearch.value = term;
            loadCobranzas();
        }
    } else if (AppState.currentView === 'tramites') {
        const tramSearch = document.getElementById('tramites-search');
        if (tramSearch) {
            tramSearch.value = term;
            loadTramites();
        }
    } else if (AppState.currentView === 'clientes') {
        const cliSearch = document.getElementById('clientes-search');
        if (cliSearch) {
            cliSearch.value = term;
            loadClientes();
        }
    } else if (AppState.currentView === 'documentos') {
        const docSearch = document.getElementById('docs-search');
        if (docSearch) {
            docSearch.value = term;
            loadDocumentos();
        }
    } else if (AppState.currentView === 'agentes') {
        const agSearch = document.getElementById('agentes-search');
        if (agSearch) {
            agSearch.value = term;
            filterAgentesGrid();
        }
    } else if (AppState.currentView === 'aseguradoras') {
        const asegSearch = document.getElementById('aseguradoras-search');
        if (asegSearch) {
            asegSearch.value = term;
            filterAseguradorasGrid();
        }
    }
}

/* ==========================================================================
   3. MÓDULO 1: DASHBOARD ANALYTICS
   ========================================================================== */

async function loadDashboardAnalytics() {
    const agente = document.getElementById('filter-agente')?.value || 'todos';
    const aseguradora = document.getElementById('filter-aseguradora')?.value || 'todas';
    const ramo = document.getElementById('filter-ramo')?.value || 'todos';
    const periodo = document.getElementById('filter-periodo')?.value || 'todas';
    const fechaInicio = document.getElementById('filter-fecha-inicio')?.value || '';
    const fechaFin = document.getElementById('filter-fecha-fin')?.value || '';
    const moneda = document.getElementById('filter-moneda')?.value || 'todas';

    const params = new URLSearchParams({
        action: 'get_dashboard_analytics',
        agente, aseguradora, ramo, periodo, moneda,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
    });

    try {
        const res = await fetch(`api.php?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
            AppState.dashMoneda = moneda;
            renderKPIs(data.summary, data.por_moneda || {}, data.resumen_divisas || {});
            renderAlertasUrgentes(data.alertas_cobranza || [], data.alertas_renovaciones || []);
            renderRamosMetrics(data.cobranza_por_ramo || []);
            renderAseguradorasMetrics(data.cobranza_por_aseguradora || []);
            renderAgentesMetrics(data.cobranza_por_agente || []);

            populateAgentesSelect(data.lista_agentes || []);
            populateAseguradorasSelect(data.lista_aseguradoras || []);
        }
    } catch (err) {
        console.error('Error al cargar analítica de dashboard:', err);
    }
}

function setDashboardMoneda(moneda) {
    const sel = document.getElementById('filter-moneda');
    if (sel) sel.value = moneda;
    loadDashboardAnalytics();
}

function renderKPIs(s, porMoneda = {}, resumenDivisas = {}) {
    if (!s) return;
    const filtro = document.getElementById('filter-moneda')?.value || 'todas';

    // Tarjetas KPI Principales
    if (filtro !== 'todas' && resumenDivisas[filtro]) {
        const cur = resumenDivisas[filtro];
        setElemText('kpi-vendido-monto', formatMoney(cur.total_vendido, filtro));
        setElemText('kpi-vendido-subtext', `${cur.total_polizas || 0} pólizas en total`);

        setElemText('kpi-realizada-monto', formatMoney(cur.realizada_monto, filtro));
        setElemText('kpi-realizada-cant', `${cur.realizada_cant || 0} recibos pagados`);

        setElemText('kpi-pendiente-monto', formatMoney(cur.pendiente_monto, filtro));
        setElemText('kpi-pendiente-cant', `${cur.pendiente_cant || 0} recibos por cobrar`);

        setElemText('kpi-vencida-monto', formatMoney(cur.vencida_monto, filtro));
        setElemText('kpi-vencida-cant', `${cur.vencida_cant || 0} recibos vencidos`);

        setElemText('kpi-eficiencia', `${cur.eficiencia || 0}%`);
        setElemText('kpi-total-polizas', cur.total_polizas || 0);
        setElemText('kpi-polizas-subtext', `${cur.polizas_activas || 0} vigentes, ${cur.polizas_vencidas || 0} vencidas`);
    } else {
        // En "Todas", mostramos los montos por divisa
        const vLines = [];
        MONEDAS.forEach(m => {
            const d = resumenDivisas[m];
            if (d && (d.total_vendido > 0 || m === 'MXN')) {
                vLines.push(`<div class="kpi-money-line">${formatMoney(d.total_vendido, m)}</div>`);
            }
        });
        const elVendido = document.getElementById('kpi-vendido-monto');
        if (elVendido) elVendido.innerHTML = vLines.length > 0 ? vLines.join('') : formatMoney(0, 'MXN');
        setElemText('kpi-vendido-subtext', `${s.total_polizas || 0} pólizas en total`);

        const r = renderMoneyBreakdown('kpi-realizada-monto', porMoneda, 'realizada', filtro);
        setElemText('kpi-realizada-cant', `${r.cantidad} recibos pagados`);

        const p = renderMoneyBreakdown('kpi-pendiente-monto', porMoneda, 'pendiente', filtro);
        setElemText('kpi-pendiente-cant', `${p.cantidad} recibos por cobrar`);

        const v = renderMoneyBreakdown('kpi-vencida-monto', porMoneda, 'vencida', filtro);
        setElemText('kpi-vencida-cant', `${v.cantidad} recibos vencidos`);

        setElemText('kpi-eficiencia', `${s.eficiencia_porcentaje}%`);
        setElemText('kpi-total-polizas', s.total_polizas || 0);
        setElemText('kpi-polizas-subtext', `${s.polizas_activas || 0} vigentes, ${s.polizas_vencidas || 0} vencidas`);
    }

    setElemText('kpi-total-clientes', s.total_clientes || 0);
}

function renderAlertasUrgentes(alertasCobranza = [], alertasRenovaciones = []) {
    const panel = document.getElementById('panel-alertas-urgentes');
    const container = document.getElementById('lista-alertas-urgentes');
    const contador = document.getElementById('alertas-contador');
    if (!panel || !container) return;

    const totalAlertas = (alertasCobranza ? alertasCobranza.length : 0) + (alertasRenovaciones ? alertasRenovaciones.length : 0);
    if (totalAlertas === 0) {
        panel.style.display = 'none';
        return;
    }

    panel.style.display = 'block';
    if (contador) contador.textContent = `${totalAlertas} recordatorios activos`;

    let html = '';

    // Recordatorios de Cobranza (1 semana antes y día de pago)
    if (alertasCobranza && alertasCobranza.length > 0) {
        alertasCobranza.forEach(item => {
            const dias = parseInt(item.dias_para_vencer, 10);
            let diasText = '';
            let cardClass = 'urgent-card';

            if (dias < 0) {
                diasText = `Venció hace ${Math.abs(dias)}d`;
                cardClass += ' urgent-today';
            } else if (dias === 0) {
                diasText = 'VENCE HOY';
                cardClass += ' urgent-today';
            } else if (dias <= 7) {
                diasText = `Cobro en ${dias}d (1 sem.)`;
                cardClass += ' urgent-7d';
            } else {
                diasText = `Cobro en ${dias}d`;
            }

            const cleanWa = cleanPhoneForWhatsApp(item.whatsapp || item.telefono);
            const msgWa = encodeURIComponent(`Hola ${item.cliente_nombre}, le contactamos de Núcleo Seguros para recordarle que el recibo de su póliza ${item.numero_poliza} (${item.aseguradora}) por un monto de ${currencyFormatter.format(item.monto)} tiene fecha de vencimiento ${formatDateMX(item.fecha_vencimiento)}. Por favor realice su pago para mantener su cobertura vigente.`);
            const wspLink = cleanWa ? `https://wa.me/${cleanWa}?text=${msgWa}` : '#';

            html += `
                <div class="${cardClass}">
                    <div class="urgent-card-top">
                        <div>
                            <div class="urgent-title">${escapeHtml(item.cliente_nombre)}</div>
                            <div class="urgent-sub">Póliza ${escapeHtml(item.numero_poliza)} · ${escapeHtml(item.aseguradora)}</div>
                        </div>
                        <span class="badge-status ${dias <= 0 ? 'badge-vencida' : 'badge-pendiente'}">${diasText}</span>
                    </div>
                    <div class="urgent-monto">${currencyFormatter.format(item.monto)}</div>
                    <div class="urgent-footer">
                        <span style="font-size: 0.75rem; color: #64748b;">Recibo #${escapeHtml(item.numero_recibo)} · Vence ${formatDateMX(item.fecha_vencimiento)}</span>
                        <div style="display: flex; gap: 8px;">
                            ${cleanWa ? `
                                <a href="${wspLink}" target="_blank" class="btn-clean" title="WhatsApp">
                                    WhatsApp
                                </a>
                            ` : ''}
                            <button type="button" class="btn-clean btn-clean-primary" onclick="abrirMarcarPago(${item.id}, '${escapeHtml(item.numero_recibo)}', '${escapeHtml(item.cliente_nombre)}', ${item.monto}, 'Póliza: ${escapeHtml(item.numero_poliza)}')">
                                Cobrar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // Recordatorios de Renovación (1 mes antes)
    if (alertasRenovaciones && alertasRenovaciones.length > 0) {
        alertasRenovaciones.forEach(item => {
            const dias = parseInt(item.dias_para_vencer, 10);
            let diasText = dias <= 0 ? 'Venció vigencia' : `Renueva en ${dias}d (1 mes)`;

            html += `
                <div class="urgent-card urgent-30d">
                    <div class="urgent-card-top">
                        <div>
                            <div class="urgent-title">${escapeHtml(item.cliente_nombre)}</div>
                            <div class="urgent-sub">Póliza ${escapeHtml(item.numero_poliza)} · ${escapeHtml(item.aseguradora)} (${escapeHtml(item.ramo)})</div>
                        </div>
                        <span class="badge-status badge-vigente">${diasText}</span>
                    </div>
                    <div class="urgent-footer" style="margin-top: 0.25rem;">
                        <span style="font-size: 0.75rem; color: #64748b;">Fin de vigencia: ${formatDateMX(item.vigencia_fin)}</span>
                        <button type="button" class="btn-clean btn-clean-primary" onclick="switchView('polizas'); verDetallePoliza(${item.id})">
                            Ver Póliza
                        </button>
                    </div>
                </div>
            `;
        });
    }

    container.innerHTML = html;
}

function renderRamosMetrics(ramos) {
    const tbody = document.getElementById('ramo-metrics-body');
    const barsContainer = document.getElementById('ramo-bars-container');
    if (!tbody) return;

    if (!ramos || ramos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 2rem;">Sin datos de ramos para este período.</td></tr>`;
        if (barsContainer) barsContainer.innerHTML = `<div style="text-align:center; color:#94a3b8; padding: 2rem;">Sin distribución para mostrar</div>`;
        return;
    }

    tbody.innerHTML = ramos.map(r => `
        <tr>
            <td><span class="cell-bold">${escapeHtml(r.ramo)}</span></td>
            <td><span class="cell-bold">${r.total_recibos}</span></td>
            <td><span class="cell-bold" style="color: #b45309;">${currencyFormatter.format(r.pendiente_monto)}</span></td>
            <td><span class="cell-bold" style="color: #047857;">${currencyFormatter.format(r.realizada_monto)}</span></td>
            <td><span class="cell-bold">${currencyFormatter.format(r.total_monto)}</span></td>
        </tr>
    `).join('');

    // Renderizar barras visuales de ramos
    if (barsContainer) {
        const totalGlobal = ramos.reduce((acc, cur) => acc + parseFloat(cur.total_monto || 0), 0);
        barsContainer.innerHTML = ramos.map(r => {
            const monto = parseFloat(r.total_monto) || 0;
            const pct = totalGlobal > 0 ? ((monto / totalGlobal) * 100).toFixed(1) : 0;
            return `
                <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.825rem; font-weight: 600; margin-bottom: 4px;">
                        <span>${escapeHtml(r.ramo)}</span>
                        <span>${currencyFormatter.format(monto)} (${pct}%)</span>
                    </div>
                    <div style="background: #e2e8f0; border-radius: 9999px; height: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(90deg, #192918, #22c55e); height: 100%; width: ${pct}%; border-radius: 9999px; transition: width 0.5s ease;"></div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function renderAseguradorasMetrics(aseguradoras) {
    const tbody = document.getElementById('aseguradora-metrics-body');
    if (!tbody) return;

    if (!aseguradoras || aseguradoras.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 2rem;">Sin aseguradoras registradas.</td></tr>`;
        return;
    }

    tbody.innerHTML = aseguradoras.map(a => `
        <tr>
            <td><span class="cell-bold">${escapeHtml(a.aseguradora)}</span></td>
            <td>${a.total_recibos}</td>
            <td style="color: #b45309;">${currencyFormatter.format(a.pendiente_monto)}</td>
            <td style="color: #047857;">${currencyFormatter.format(a.realizada_monto)}</td>
            <td><span class="cell-bold">${currencyFormatter.format(a.total_monto)}</span></td>
        </tr>
    `).join('');
}

function renderAgentesMetrics(agentes) {
    const tbody = document.getElementById('agente-metrics-body');
    if (!tbody) return;

    if (!agentes || agentes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 2rem;">Sin agentes con movimientos.</td></tr>`;
        return;
    }

    tbody.innerHTML = agentes.map(u => `
        <tr>
            <td><span class="cell-bold">${escapeHtml(u.agente_nombre)}</span></td>
            <td><span class="cell-subtext">${escapeHtml(u.agente_empresa || 'Agencia')}</span></td>
            <td>${u.total_recibos}</td>
            <td style="color: #047857;">${currencyFormatter.format(u.realizada_monto)}</td>
            <td><span class="cell-bold">${currencyFormatter.format(u.total_monto)}</span></td>
        </tr>
    `).join('');
}

function toggleCustomDateFields() {
    const periodo = document.getElementById('filter-periodo').value;
    const dateBox = document.getElementById('date-range-inputs');

    if (periodo === 'personalizado') {
        dateBox.style.display = 'block';
    } else {
        dateBox.style.display = 'none';
        loadDashboardAnalytics();
    }
}

function handleFilterChange() {
    clearTimeout(AppState.filtroTimeout);
    AppState.filtroTimeout = setTimeout(() => {
        loadDashboardAnalytics();
    }, 250);
}

function resetFilters() {
    document.getElementById('filter-agente').value = 'todos';
    document.getElementById('filter-aseguradora').value = 'todas';
    document.getElementById('filter-ramo').value = 'todos';
    document.getElementById('filter-periodo').value = 'todas';
    const monedaDash = document.getElementById('filter-moneda');
    if (monedaDash) monedaDash.value = 'todas';
    document.getElementById('filter-fecha-inicio').value = '';
    document.getElementById('filter-fecha-fin').value = '';
    document.getElementById('date-range-inputs').style.display = 'none';
    loadDashboardAnalytics();
}

function populateAgentesSelect(agentes, selectedId = null) {
    if (agentes) AppState.agentes = agentes;
    const list = AppState.agentes || [];
    const selects = ['filter-agente', 'polizas-filter-agente', 'cobranza-filter-agente', 'poliza-agente-id'];
    selects.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const currentVal = selectedId !== null ? selectedId : el.value;
        const isFilter = id.includes('filter');
        el.innerHTML = isFilter ? '<option value="todos">Todos los Agentes</option>' : '<option value="">-- Selecciona el agente --</option>';
        list.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a.id;
            opt.textContent = `${a.fullname} (${a.company || 'Agencia'})`;
            el.appendChild(opt);
        });
        if (currentVal) el.value = currentVal;
    });
}

function populateAseguradorasSelect(aseguradoras, selectedVal = null) {
    if (aseguradoras) AppState.aseguradoras = aseguradoras;
    const list = AppState.aseguradoras || [];
    const selects = ['filter-aseguradora', 'polizas-filter-aseguradora', 'cobranza-filter-aseguradora', 'contactos-filter-aseguradora', 'poliza-aseguradora'];
    selects.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const currentVal = selectedVal !== null ? selectedVal : el.value;
        const isPolicySelect = id === 'poliza-aseguradora';
        el.innerHTML = isPolicySelect ? '<option value="">-- Selecciona aseguradora --</option>' : '<option value="todas">Todas las Aseguradoras</option>';
        list.forEach(item => {
            const name = typeof item === 'string' ? item : item.nombre;
            if (!name) return;
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            el.appendChild(opt);
        });
        if (currentVal) el.value = currentVal;
    });
}

/* ==========================================================================
   4. MÓDULO 2: GESTIÓN DE PÓLIZAS
   ========================================================================== */

async function loadPolizas() {
    const q = document.getElementById('polizas-search')?.value || '';
    const estado = document.getElementById('polizas-filter-estado')?.value || 'todos';
    const ramo = document.getElementById('polizas-filter-ramo')?.value || 'todos';
    const aseguradora = document.getElementById('polizas-filter-aseguradora')?.value || 'todas';
    const moneda = document.getElementById('polizas-filter-moneda')?.value || 'todas';
    const agente_id = document.getElementById('polizas-filter-agente')?.value || 'todos';

    const params = new URLSearchParams({
        action: 'get_polizas',
        q, estado, ramo, aseguradora, moneda
    });
    if (agente_id && agente_id !== 'todos') {
        params.append('agente_id', agente_id);
    }

    try {
        const res = await fetch(`api.php?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
            AppState.polizas = data.polizas || [];
            renderPolizasTable(AppState.polizas);
        }
    } catch (err) {
        console.error('Error al cargar pólizas:', err);
    }
}

function filterPolizasTable() {
    clearTimeout(AppState.filtroTimeout);
    AppState.filtroTimeout = setTimeout(() => {
        loadPolizas();
    }, 250);
}

function renderPolizasTable(polizas) {
    const tbody = document.getElementById('polizas-table-body');
    if (!tbody) return;

    if (!polizas || polizas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 3rem; color: #94a3b8;">
                    No se encontraron pólizas con los filtros seleccionados.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = polizas.map(p => {
        return `
            <tr>
                <td>
                    <span class="cell-bold" style="font-size: 0.9rem; color: #0284c7; cursor: pointer; text-decoration: underline;" onclick="verDetallePoliza(${p.id})" title="Ver Carátula y Detalle Completo">
                        ${escapeHtml(p.numero_poliza)}
                    </span>
                </td>
                <td>
                    <span class="cell-bold" style="color: #0f172a;">${escapeHtml(p.cliente_nombre)}</span>
                </td>
                <td>
                    <span class="badge-ramo">${escapeHtml(p.ramo)}</span>
                </td>
                <td>
                    <span class="badge-aseguradora">${escapeHtml(p.aseguradora)}</span>
                </td>
                <td>
                    <span class="cell-bold">${formatMoney(p.prima_total, p.moneda)}</span>
                </td>
                <td>
                    <span class="badge-status ${p.badge_class}">
                        ${p.estatus_visual}
                    </span>
                </td>
                <td>
                    <div class="actions-cell" style="justify-content: flex-end; gap: 6px;">
                        <button type="button" class="btn-clean" onclick="verDetallePoliza(${p.id})" title="Ver Expediente y Detalle">
                            Detalle
                        </button>
                        <button type="button" class="btn-clean" onclick="abrirHistoricoPagos(${p.id})" title="Histórico de Cuotas y Pagos">
                            Pagos
                        </button>
                        <button type="button" class="btn-clean" onclick="abrirModalRenovar(${p.id})" title="Generar Renovación">
                            Renovar
                        </button>
                        <button type="button" class="btn-clean" onclick="openModalEditarPoliza(${p.id})" title="Editar Póliza">
                            Editar
                        </button>
                        <button type="button" class="btn-clean btn-clean-danger" onclick="eliminarPoliza(${p.id}, '${escapeHtml(p.numero_poliza)}')" title="Eliminar">
                            Eliminar
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function openModalNuevaPoliza(clienteIdPreselect = null) {
    document.getElementById('form-poliza').reset();
    document.getElementById('poliza-id').value = '';
    document.getElementById('modal-poliza-title').innerHTML = 'Registrar Nueva Póliza';
    document.getElementById('poliza-file-name').textContent = 'Haz clic o arrastra aquí la carátula de póliza';
    document.getElementById('poliza-total-display').textContent = '$0.00';
    document.getElementById('preview-cuotas-text').textContent = '1 pago de $0.00';

    // Establecer fecha de hoy como vigencia desde
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('poliza-vigencia-desde').value = hoy;
    autoCalculateVigenciaFin();

    // Poblar selectores de clientes, agentes y aseguradoras
    populateClientesSelect('poliza-cliente-id', clienteIdPreselect);
    populateAgentesSelect(AppState.agentes);
    populateAseguradorasSelect(AppState.aseguradoras);

    openModal('modal-poliza');
}

async function openModalEditarPoliza(id) {
    try {
        const res = await fetch(`api.php?action=get_poliza&id=${id}`);
        const data = await res.json();

        if (data.success && data.poliza) {
            const p = data.poliza;
            document.getElementById('form-poliza').reset();
            document.getElementById('poliza-id').value = p.id;
            document.getElementById('modal-poliza-title').innerHTML = `Editar Póliza ${escapeHtml(p.numero_poliza)}`;

            populateClientesSelect('poliza-cliente-id', p.cliente_id);
            populateAgentesSelect(AppState.agentes, p.usuario_id);
            populateAseguradorasSelect(AppState.aseguradoras, p.aseguradora);
            document.getElementById('poliza-numero').value = p.numero_poliza;
            document.getElementById('poliza-aseguradora').value = p.aseguradora;
            document.getElementById('poliza-ramo').value = p.ramo;
            document.getElementById('poliza-vigencia-desde').value = p.vigencia_desde;
            document.getElementById('poliza-vigencia-hasta').value = p.vigencia_hasta;
            document.getElementById('poliza-forma-pago').value = p.forma_pago || 'Transferencia SPEI';
            document.getElementById('poliza-periodicidad').value = p.periodicidad || 'Anual';

            document.getElementById('poliza-prima-neta').value = p.prima_neta || '';
            document.getElementById('poliza-recargo').value = p.recargo_fraccionado || '';
            document.getElementById('poliza-derecho').value = p.derecho_poliza || '';
            document.getElementById('poliza-iva').value = p.iva || '';
            document.getElementById('poliza-moneda').value = p.moneda || 'MXN';
            document.getElementById('poliza-descripcion').value = p.descripcion_cobertura || '';

            calculateTotalPremium();
            openModal('modal-poliza');
        }
    } catch (err) {
        showToast('Error al cargar datos de la póliza', 'error');
    }
}

function autoCalculateVigenciaFin() {
    const fDesde = document.getElementById('poliza-vigencia-desde').value;
    if (!fDesde) return;

    const d = new Date(fDesde);
    d.setFullYear(d.getFullYear() + 1);
    document.getElementById('poliza-vigencia-hasta').value = d.toISOString().split('T')[0];
}

function calculateTotalPremium() {
    const neta = parseFloat(document.getElementById('poliza-prima-neta').value) || 0;
    const recargo = parseFloat(document.getElementById('poliza-recargo').value) || 0;
    const derecho = parseFloat(document.getElementById('poliza-derecho').value) || 0;
    const iva = parseFloat(document.getElementById('poliza-iva').value) || 0;

    const total = neta + recargo + derecho + iva;
    document.getElementById('poliza-prima-total').value = total.toFixed(2);
    document.getElementById('poliza-total-display').textContent = formatMoney(total, document.getElementById('poliza-moneda')?.value || 'MXN');

    calculateCuotasPreview();
}

function autoComputeIVA() {
    const neta = parseFloat(document.getElementById('poliza-prima-neta').value) || 0;
    const recargo = parseFloat(document.getElementById('poliza-recargo').value) || 0;
    const derecho = parseFloat(document.getElementById('poliza-derecho').value) || 0;

    const subtotal = neta + recargo + derecho;
    const iva = subtotal * 0.16;
    document.getElementById('poliza-iva').value = iva.toFixed(2);
    calculateTotalPremium();
}

function calculateCuotasPreview() {
    const total = parseFloat(document.getElementById('poliza-prima-total').value) || 0;
    const peri = document.getElementById('poliza-periodicidad').value;
    const previewEl = document.getElementById('preview-cuotas-text');

    let cuotas = 1;
    let desc = 'pago único anual';

    if (peri === 'Semestral') {
        cuotas = 2;
        desc = 'pagos semestrales';
    } else if (peri === 'Trimestral') {
        cuotas = 4;
        desc = 'pagos trimestrales';
    } else if (peri === 'Mensual') {
        cuotas = 12;
        desc = 'pagos mensuales';
    }

    const montoCuota = (total / cuotas).toFixed(2);
    if (previewEl) {
        previewEl.textContent = `${cuotas} ${desc} de ${currencyFormatter.format(montoCuota)}`;
    }
}

async function handleSavePoliza(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-save-poliza');
    btn.disabled = true;
    btn.innerHTML = 'Guardando...';

    const formData = new FormData(document.getElementById('form-poliza'));
    formData.append('action', 'save_poliza');

    try {
        const res = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();

        if (data.success) {
            showToast(data.message || 'Póliza guardada exitosamente', 'success');
            closeModal('modal-poliza');
            loadPolizas();
            loadDashboardAnalytics();
            preloadAgentesYClientes();
        } else {
            showToast(data.message || 'Error al guardar póliza', 'error');
        }
    } catch (err) {
        showToast('Error de conexión al guardar la póliza', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Guardar Póliza y Generar Recibos';
    }
}

function formatDateMX(str) {
    if (!str) return '-';
    const dStr = String(str).split(' ')[0];
    const parts = dStr.split('-');
    if (parts.length === 3) {
        const meses = ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'];
        const dia = parseInt(parts[2], 10);
        const mesIdx = parseInt(parts[1], 10) - 1;
        const mes = meses[mesIdx] || parts[1];
        const anio = parts[0];
        return `${dia} ${mes} ${anio}`;
    }
    return str;
}

/* ==========================================================================
   HISTÓRICO DE PAGOS DE LA PÓLIZA (SEGÚN SCREENSHOT DEL USUARIO)
   ========================================================================== */

async function abrirHistoricoPagos(id) {
    AppState.activePolizaId = id;
    try {
        const res = await fetch(`api.php?action=get_poliza&id=${id}`);
        const data = await res.json();

        if (data.success && data.poliza) {
            const p = data.poliza;
            const recibos = data.recibos || [];
            const resumen = data.resumen_pagos || {
                total_cuotas: recibos.length,
                cuotas_pagadas: 0,
                monto_total: parseFloat(p.prima_total) || 0,
                monto_pagado: 0,
                monto_pendiente: parseFloat(p.prima_total) || 0
            };

            // 1. Título y Badge de Vigencia en Encabezado
            const encabezado = document.getElementById('historico-poliza-encabezado');
            if (encabezado) {
                encabezado.textContent = `HISTÓRICO DE PAGOS DE LA POLIZA: ${p.numero_poliza} (${formatDateMX(p.vigencia_desde)})`;
            }

            const badgeVig = document.getElementById('historico-badge-vigente');
            if (badgeVig) {
                const esVigente = p.estado_poliza === 'activa';
                badgeVig.textContent = esVigente ? 'Vigente' : 'Vencida';
                badgeVig.className = `badge-status ${esVigente ? 'badge-vigente' : 'badge-vencida'}`;
            }

            // 2. Barra Azul Marino con Metadatos
            setElemText('historico-contratante', p.cliente_nombre.toUpperCase());
            setElemText('historico-prima-total', `${formatMoney(p.prima_total, p.moneda)}`);
            setElemText('historico-pagos-resumen', `Pagado: ${formatMoney(resumen.monto_pagado, p.moneda)} (${resumen.cuotas_pagadas} de ${resumen.total_cuotas} cuotas)`);
            setElemText('historico-frecuencia', p.periodicidad || 'Mensual');
            setElemText('historico-conducto', `Conducto: ${p.forma_pago || 'Cargo a tarjeta'}`);

            // 3. Tabla de Recibos y Cuotas idéntica a la Captura
            const tbody = document.getElementById('historico-pagos-tbody');
            if (tbody) {
                if (recibos.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="9" style="text-align: center; padding: 2.5rem; color: #94a3b8; background: #ffffff;">
                                No hay recibos generados para esta póliza aún.
                            </td>
                        </tr>
                    `;
                } else {
                    tbody.innerHTML = recibos.map((r, idx) => {
                        const isPaid = (r.estado === 'realizada');
                        const serie = r.numero_recibo || `${idx + 1}/${recibos.length}`;
                        const inicioVig = formatDateMX(r.fecha_inicio_recibo || r.fecha_vencimiento);
                        const fLimite = formatDateMX(r.fecha_limite_pago || r.fecha_vencimiento);
                        const montoFmt = `${formatMoney(r.monto, p.moneda)}`;
                        const metodo = r.metodo_pago || p.forma_pago || 'Tarjeta de crédito';
                        const notas = r.notas || '';

                        // Estilo de fila (Verde menta si pagada, Rosa si vencida/pendiente)
                        const trClass = isPaid ? 'historico-tr-pagado' : 'historico-tr-vencido';

                        // Columna Fecha Real
                        let fechaRealHtml = '';
                        if (isPaid) {
                            const fRealStr = r.fecha_pago ? formatDateMX(r.fecha_pago) : 'Pagado';
                            fechaRealHtml = `<span class="badge-check-real">${fRealStr}</span>`;
                        } else {
                            fechaRealHtml = `<span class="badge-alerta-real"><i class="fa-solid fa-clock"></i></span>`;
                        }

                        // Columna Archivo
                        let archivoHtml = 'S/C';
                        if (r.comprobante_archivo) {
                            archivoHtml = `
                                <button class="historico-action-btn" onclick="previewDocumento('Comprobante ${serie}', '${r.comprobante_archivo}', 'pdf')" title="Ver Comprobante"><i class="fa-solid fa-eye"></i></button>
                            `;
                        }

                        // Columna Acciones
                        let accionesHtml = '';
                        if (isPaid) {
                            accionesHtml = `
                                <button class="historico-action-btn" onclick="openModalUploadDoc(${p.cliente_id}, ${p.id})" title="Adjuntar Documento"><i class="fa-solid fa-paperclip"></i></button>
                                <button class="historico-action-btn" onclick="revertirPagoEnHistorico(${r.id}, ${p.id})" title="Revertir Pago"><i class="fa-solid fa-rotate-left"></i></button>
                                <button class="historico-action-btn" onclick="openModalUploadDoc(${p.cliente_id}, ${p.id})" title="Expediente Digital"><i class="fa-solid fa-folder-open"></i></button>
                            `;
                        } else {
                            accionesHtml = `
                                <button class="historico-action-btn btn-pay-cuota" onclick="abrirMarcarPagoDesdeHistorico(${r.id}, '${escapeHtml(serie)}', '${escapeHtml(p.cliente_nombre)}', ${r.monto}, 'Póliza: ${escapeHtml(p.numero_poliza)}', ${p.id})" title="Marcar como Pagado y registrar método"><i class="fa-solid fa-check"></i></button>
                                <button class="historico-action-btn" onclick="showToast('Cuota pendiente de pago', 'info')" title="Pendiente"><i class="fa-solid fa-clock"></i></button>
                                <button class="historico-action-btn" onclick="openModalUploadDoc(${p.cliente_id}, ${p.id})" title="Expediente Digital"><i class="fa-solid fa-folder-open"></i></button>
                            `;
                        }

                        return `
                            <tr class="${trClass}">
                                <td class="historico-td"><strong>${escapeHtml(serie)}</strong></td>
                                <td class="historico-td">${inicioVig}</td>
                                <td class="historico-td">${fLimite}</td>
                                <td class="historico-td">${fechaRealHtml}</td>
                                <td class="historico-td"><strong>${montoFmt}</strong></td>
                                <td class="historico-td">${escapeHtml(metodo)}</td>
                                <td class="historico-td">${archivoHtml}</td>
                                <td class="historico-td"><span style="font-size: 0.775rem;">${escapeHtml(notas)}</span></td>
                                <td class="historico-td" style="text-align: right; white-space: nowrap;">
                                    ${accionesHtml}
                                </td>
                            </tr>
                        `;
                    }).join('');
                }
            }

            // 4. Barra Total Inferior
            setElemText('historico-resumen-inferior', `Van ${resumen.cuotas_pagadas} de ${resumen.total_cuotas} pagos realizados (${formatMoney(resumen.monto_pagado, p.moneda)}) · Saldo pendiente: ${formatMoney(resumen.monto_pendiente, p.moneda)}`);
            setElemText('historico-total-monto-inferior', `${formatMoney(p.prima_total, p.moneda)}`);

            openModal('modal-historico-pagos');
        }
    } catch (err) {
        showToast('Error al abrir histórico de pagos', 'error');
    }
}

function abrirMarcarPagoDesdeHistorico(reciboId, numRecibo, clienteNombre, monto, polizaInfo, polizaId) {
    AppState.activePolizaId = polizaId;
    abrirMarcarPago(reciboId, numRecibo, clienteNombre, monto, polizaInfo);
}

async function revertirPagoEnHistorico(reciboId, polizaId) {
    if (!confirm('¿Deseas revertir este pago a pendiente?')) return;
    try {
        const res = await fetch(`api.php?action=anular_pago&recibo_id=${reciboId}`);
        const data = await res.json();
        if (data.success) {
            showToast('Pago revertido a pendiente', 'info');
            abrirHistoricoPagos(polizaId);
            loadPolizas();
            loadCobranzas();
            loadDashboardAnalytics();
        } else {
            showToast(data.message || 'Error al revertir', 'error');
        }
    } catch (e) {
        showToast('Error de conexión', 'error');
    }
}

/* ==========================================================================
   RENOVAR PÓLIZA (BOTÓN RENOVAR)
   ========================================================================== */

async function abrirModalRenovar(polizaId) {
    try {
        const res = await fetch(`api.php?action=get_poliza&id=${polizaId}`);
        const data = await res.json();
        if (data.success && data.poliza) {
            const p = data.poliza;
            document.getElementById('form-renovar-poliza').reset();
            document.getElementById('renovar-poliza-id').value = p.id;
            document.getElementById('renovar-modal-title').innerHTML = `Renovar Póliza: ${escapeHtml(p.numero_poliza)}`;
            document.getElementById('renovar-poliza-actual-info').textContent = `${p.numero_poliza} · ${p.aseguradora} (${p.ramo})`;
            document.getElementById('renovar-cliente-nombre').textContent = `Cliente: ${p.cliente_nombre}`;
            document.getElementById('renovar-vigencia-anterior').textContent = `Vigencia previa: ${p.vigencia_desde} al ${p.vigencia_hasta}`;

            // Nuevo número sugerido
            const anioActual = new Date().getFullYear();
            document.getElementById('renovar-nuevo-numero').value = `${p.numero_poliza}-R${anioActual + 1}`;

            // Nueva vigencia inicial (comienza donde termina la anterior)
            const fDesde = p.vigencia_hasta || new Date().toISOString().split('T')[0];
            document.getElementById('renovar-vigencia-desde').value = fDesde;

            const dHasta = new Date(fDesde);
            dHasta.setFullYear(dHasta.getFullYear() + 1);
            document.getElementById('renovar-vigencia-hasta').value = dHasta.toISOString().split('T')[0];

            document.getElementById('renovar-forma-pago').value = p.forma_pago || 'Transferencia SPEI';
            document.getElementById('renovar-periodicidad').value = p.periodicidad || 'Anual';
            document.getElementById('renovar-prima-total').value = p.prima_total;
            document.getElementById('renovar-notas').value = `Renovación de póliza ${p.numero_poliza} (${p.vigencia_hasta} a ${dHasta.toISOString().split('T')[0]}).`;

            openModal('modal-renovar-poliza');
        }
    } catch (e) {
        showToast('Error al preparar renovación', 'error');
    }
}

function autoCalculateRenovacionVigenciaFin() {
    const fDesde = document.getElementById('renovar-vigencia-desde').value;
    if (!fDesde) return;
    const d = new Date(fDesde);
    d.setFullYear(d.getFullYear() + 1);
    document.getElementById('renovar-vigencia-hasta').value = d.toISOString().split('T')[0];
}

async function handleConfirmarRenovacion(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-do-renovar');
    btn.disabled = true;
    btn.innerHTML = 'Renovando...';

    const formData = new FormData(document.getElementById('form-renovar-poliza'));
    formData.append('action', 'renovar_poliza');

    try {
        const res = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();

        if (data.success) {
            showToast(data.message || 'Póliza renovada con éxito', 'success');
            closeModal('modal-renovar-poliza');
            loadPolizas();
            loadDashboardAnalytics();
            if (data.nueva_poliza_id) {
                abrirHistoricoPagos(data.nueva_poliza_id);
            }
        } else {
            showToast(data.message || 'Error al renovar póliza', 'error');
        }
    } catch (err) {
        showToast('Error de conexión', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Confirmar y Generar Renovación';
    }
}

/* ==========================================================================
   RECIBO EXTRA MANUAL DENTRO DEL HISTÓRICO (+ Recibo)
   ========================================================================== */

function abrirModalReciboManual() {
    if (!AppState.activePolizaId) {
        showToast('Selecciona una póliza primero', 'warning');
        return;
    }
    document.getElementById('form-recibo-manual').reset();
    document.getElementById('manual-poliza-id').value = AppState.activePolizaId;

    const countRec = document.querySelectorAll('#historico-pagos-tbody tr').length;
    document.getElementById('manual-numero-recibo').value = `${countRec + 1}/${countRec + 1} Extra`;

    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('manual-inicio-vigencia').value = hoy;
    autoCalculateManualLimite();

    openModal('modal-recibo-manual');
}

function autoCalculateManualLimite() {
    const fInicio = document.getElementById('manual-inicio-vigencia').value;
    if (!fInicio) return;
    const d = new Date(fInicio);
    d.setMonth(d.getMonth() + 1);
    document.getElementById('manual-limite-pago').value = d.toISOString().split('T')[0];
}

async function handleGuardarReciboManual(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-save-manual-recibo');
    btn.disabled = true;
    btn.innerHTML = 'Guardando...';

    const formData = new FormData(document.getElementById('form-recibo-manual'));
    formData.append('action', 'agregar_recibo_manual');

    try {
        const res = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (data.success) {
            showToast(data.message || 'Recibo extra agregado', 'success');
            closeModal('modal-recibo-manual');
            abrirHistoricoPagos(AppState.activePolizaId);
            loadPolizas();
            loadDashboardAnalytics();
        } else {
            showToast(data.message || 'Error al agregar recibo', 'error');
        }
    } catch (err) {
        showToast('Error de conexión', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Guardar Recibo';
    }
}

async function verDetallePoliza(id) {
    try {
        const res = await fetch(`api.php?action=get_poliza&id=${id}`);
        const data = await res.json();
        if (!data.success || !data.poliza) {
            showToast(data.message || 'Error al obtener póliza', 'error');
            return;
        }

        const p = data.poliza;
        const recibos = data.recibos || [];
        const resumen = data.resumen_pagos || {
            total_cuotas: recibos.length,
            cuotas_pagadas: 0,
            monto_total: parseFloat(p.prima_total) || 0,
            monto_pagado: 0,
            monto_pendiente: parseFloat(p.prima_total) || 0
        };
        const docs = data.documentos || [];

        const titleEl = document.getElementById('detalle-poliza-title');
        if (titleEl) {
            titleEl.innerHTML = `Póliza ${escapeHtml(p.numero_poliza)} · ${escapeHtml(p.aseguradora)}`;
        }

        const contentEl = document.getElementById('detalle-poliza-content');
        if (!contentEl) return;

        const isVigente = p.estado_poliza === 'activa';
        const badgeClass = isVigente ? 'badge-vigente' : 'badge-vencida';
        const badgeText = isVigente ? 'Activa / Vigente' : (p.estado_poliza === 'cancelada' ? 'Cancelada' : 'Vencida');

        // Cálculo de vigencia
        const fDesde = formatDateMX(p.vigencia_desde);
        const fHasta = formatDateMX(p.vigencia_hasta);
        const hoy = new Date();
        const fFinDate = new Date(p.vigencia_hasta);
        const diffDays = Math.ceil((fFinDate - hoy) / (1000 * 60 * 60 * 24));
        const vigenciaDiasText = diffDays > 0 ? `Vigente (${diffDays} días restantes)` : `Vencida hace ${Math.abs(diffDays)} días`;

        // Datos del contratante
        const cleanWa = cleanPhoneForWhatsApp(p.cliente_whatsapp || p.cliente_telefono);
        const msgWa = encodeURIComponent(`Hola ${p.cliente_nombre}, le saludamos de Núcleo Seguros respecto a su póliza ${p.numero_poliza} (${p.aseguradora}).`);
        const wspLink = cleanWa ? `https://wa.me/${cleanWa}?text=${msgWa}` : '';

        // Porcentaje cobrado
        const totalMonto = parseFloat(p.prima_total) || 0;
        const pctCobrado = totalMonto > 0 ? Math.min(100, Math.round((resumen.monto_pagado / totalMonto) * 100)) : 0;

        contentEl.innerHTML = `
            <!-- Banner Superior con Resumen -->
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 1.25rem 1.5rem; border-radius: 10px; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div>
                    <div style="font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; font-weight: 600; letter-spacing: 0.05em;">Póliza de Seguros</div>
                    <div style="font-size: 1.35rem; font-weight: 800; font-family: var(--font-heading); margin-top: 2px;">
                        ${escapeHtml(p.numero_poliza)}
                    </div>
                    <div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 4px;">
                        ${escapeHtml(p.aseguradora)} · Ramo: <strong>${escapeHtml(p.ramo)}</strong>
                    </div>
                </div>
                <div style="text-align: right;">
                    <span class="badge-status ${badgeClass}" style="font-size: 0.85rem; padding: 5px 12px;">${badgeText}</span>
                    <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 6px;">${vigenciaDiasText}</div>
                </div>
            </div>

            <div class="form-grid-2" style="margin-bottom: 1.25rem;">
                <!-- Contratante -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem;">
                    <div style="font-size: 0.775rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        Datos del Contratante
                    </div>
                    <div style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
                        ${escapeHtml(p.cliente_nombre)}
                    </div>
                    ${p.cliente_rfc ? `<div style="font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">RFC: <strong>${escapeHtml(p.cliente_rfc)}</strong></div>` : ''}
                    <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px; font-size: 0.825rem;">
                        ${p.cliente_telefono ? `<div><a href="tel:${p.cliente_telefono}">${escapeHtml(p.cliente_telefono)}</a></div>` : ''}
                        ${cleanWa ? `<div><a href="${wspLink}" target="_blank" style="color: #16a34a; font-weight: 600;">WhatsApp Directo</a></div>` : ''}
                        ${p.cliente_email ? `<div><a href="mailto:${p.cliente_email}">${escapeHtml(p.cliente_email)}</a></div>` : ''}
                        ${p.cliente_direccion ? `<div>${escapeHtml(p.cliente_direccion)}</div>` : ''}
                    </div>
                </div>

                <!-- Desglose de Primas y Pagos -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem;">
                    <div style="font-size: 0.775rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        Desglose de Prima & Vigencia
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.825rem; margin-bottom: 4px; color: #475569;">
                        <span>Prima Neta:</span>
                        <span>${formatMoney(p.prima_neta || 0, p.moneda)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.825rem; margin-bottom: 4px; color: #475569;">
                        <span>Recargo Fraccionado:</span>
                        <span>${formatMoney(p.recargo_fraccionado || 0, p.moneda)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.825rem; margin-bottom: 4px; color: #475569;">
                        <span>Derecho de Póliza:</span>
                        <span>${formatMoney(p.derecho_poliza || 0, p.moneda)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.825rem; margin-bottom: 4px; color: #475569;">
                        <span>IVA (16%):</span>
                        <span>${formatMoney(p.iva || 0, p.moneda)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.95rem; font-weight: 700; color: #0f172a; border-top: 1px dashed #cbd5e1; padding-top: 6px; margin-top: 6px;">
                        <span>Prima Total:</span>
                        <span style="color: #059669;">${formatMoney(p.prima_total || 0, p.moneda)}</span>
                    </div>
                    <div style="font-size: 0.775rem; color: #64748b; margin-top: 6px;">
                        Periodicidad: <strong>${escapeHtml(p.periodicidad || 'Anual')}</strong> · Forma: <strong>${escapeHtml(p.forma_pago || 'Transferencia')}</strong>
                    </div>
                    <div style="font-size: 0.775rem; color: #64748b; margin-top: 2px;">
                        Vigencia: <strong>${fDesde}</strong> al <strong>${fHasta}</strong>
                    </div>
                </div>
            </div>

            <!-- Progreso de Cobranza -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div style="font-size: 0.85rem; font-weight: 700; color: #0f172a;">
                        Estado de Cobranza (${resumen.cuotas_pagadas} de ${resumen.total_cuotas} cuotas cobradas)
                    </div>
                    <div style="font-size: 0.85rem; font-weight: 700; color: #059669;">
                        ${pctCobrado}% Pagado
                    </div>
                </div>
                <div style="background: #e2e8f0; border-radius: 9999px; height: 10px; overflow: hidden; margin-bottom: 8px;">
                    <div style="background: #059669; height: 100%; width: ${pctCobrado}%; border-radius: 9999px; transition: width 0.4s ease;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #64748b;">
                    <span>Cobrado: <strong style="color: #059669;">${formatMoney(resumen.monto_pagado, p.moneda)}</strong></span>
                    <span>Pendiente: <strong style="color: #b45309;">${formatMoney(resumen.monto_pendiente, p.moneda)}</strong></span>
                </div>
            </div>

            ${p.descripcion_cobertura ? `
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1.25rem;">
                    <div style="font-size: 0.775rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 6px;">
                        Cobertura y Observaciones
                    </div>
                    <p style="font-size: 0.85rem; color: #334155; margin: 0; white-space: pre-line;">${escapeHtml(p.descripcion_cobertura)}</p>
                </div>
            ` : ''}

            <!-- Documentos de esta póliza -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="font-size: 0.85rem; font-weight: 700; color: #0f172a;">
                        Expediente de la Póliza (${docs.length} archivos)
                    </div>
                    <button type="button" class="btn-clean" onclick="closeModal('modal-detalle-poliza'); openModalUploadDoc(${p.cliente_id}, ${p.id});" style="font-size: 0.775rem;">
                        Subir Archivo
                    </button>
                </div>
                ${docs.length === 0 ? `
                    <div style="font-size: 0.8rem; color: #94a3b8; text-align: center; padding: 1rem;">
                        No hay documentos adjuntos a esta póliza aún.
                    </div>
                ` : `
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        ${docs.map(d => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: #f8fafc; border-radius: 6px; font-size: 0.8rem;">
                                <div>
                                    <strong>${escapeHtml(d.titulo)}</strong>
                                    <span style="color: #94a3b8; font-size: 0.725rem;">(${formatBytes(d.archivo_tamano)})</span>
                                </div>
                                <div style="display: flex; gap: 6px;">
                                    <button type="button" class="btn-clean" style="padding: 2px 6px; font-size: 0.725rem;" onclick="previewDocumento('${escapeHtml(d.titulo)}', '${d.archivo_ruta}', '${d.archivo_extension}')">Ver</button>
                                    <a href="${d.archivo_ruta}" download class="btn-clean" style="padding: 2px 6px; font-size: 0.725rem;">Descargar</a>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;

        const footerEl = document.getElementById('detalle-poliza-footer');
        if (footerEl) {
            footerEl.innerHTML = `
                <button type="button" class="btn-secondary-action" onclick="closeModal('modal-detalle-poliza')">Cerrar</button>
                <button type="button" class="btn-clean" onclick="closeModal('modal-detalle-poliza'); openModalUploadDoc(${p.cliente_id}, ${p.id})">
                    Subir Archivo
                </button>
                <button type="button" class="btn-clean" onclick="closeModal('modal-detalle-poliza'); openModalEditarPoliza(${p.id})">
                    Editar Póliza
                </button>
                <button type="button" class="btn-clean btn-clean-primary" onclick="closeModal('modal-detalle-poliza'); abrirHistoricoPagos(${p.id})">
                    Historial de Pagos
                </button>
                <button type="button" class="btn-primary-action" style="background-color: #059669;" onclick="closeModal('modal-detalle-poliza'); abrirModalRenovar(${p.id})">
                    Renovar Póliza
                </button>
            `;
        }

        openModal('modal-detalle-poliza');
    } catch (err) {
        console.error(err);
        showToast('Error al cargar detalle de póliza', 'error');
    }
}

async function eliminarPoliza(id, num) {
    if (!confirm(`¿Estás seguro de eliminar la póliza ${num}? Esta acción borrará también sus recibos de cobranza.`)) return;

    try {
        const res = await fetch(`api.php?action=delete_poliza&id=${id}`);
        const data = await res.json();
        if (data.success) {
            showToast('Póliza eliminada exitosamente', 'success');
            loadPolizas();
            loadDashboardAnalytics();
        } else {
            showToast(data.message || 'Error al eliminar', 'error');
        }
    } catch (err) {
        showToast('Error al eliminar póliza', 'error');
    }
}

/* ==========================================================================
   5. MÓDULO 3: COBRANZA Y RECIBOS DE PAGO
   ========================================================================== */

async function loadCobranzas() {
    const q = document.getElementById('cobranza-search')?.value || '';
    const estado = document.getElementById('cobranza-filter-estado')?.value || 'todos';
    const periodo = document.getElementById('cobranza-filter-periodo')?.value || 'todos';
    const moneda = document.getElementById('cobranza-filter-moneda')?.value || 'todas';

    const params = new URLSearchParams({
        action: 'get_cobranzas',
        q, estado, periodo, moneda
    });

    try {
        const res = await fetch(`api.php?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
            AppState.cobranzas = data.cobranzas || [];
            renderCobranzasTable(AppState.cobranzas);
            updateCobranzasKPIs(AppState.cobranzas);
        }
    } catch (err) {
        console.error('Error al cargar cobranzas:', err);
    }
}

function updateCobranzasKPIs(items) {
    // Totales separados por moneda (MXN, USD, UDIS)
    const porMoneda = {};
    MONEDAS.forEach(m => {
        porMoneda[m] = {
            pendiente: { monto: 0, cantidad: 0 },
            realizada: { monto: 0, cantidad: 0 },
            vencida: { monto: 0, cantidad: 0 }
        };
    });

    items.forEach(c => {
        const m = MONEDAS.includes((c.moneda || '').toUpperCase()) ? c.moneda.toUpperCase() : 'MXN';
        const monto = parseFloat(c.monto) || 0;
        if (porMoneda[m][c.estado]) {
            porMoneda[m][c.estado].monto += monto;
            porMoneda[m][c.estado].cantidad++;
        }
    });

    const filtro = document.getElementById('cobranza-filter-moneda')?.value || 'todas';

    const p = renderMoneyBreakdown('cobranza-kpi-pendiente', porMoneda, 'pendiente', filtro);
    setElemText('cobranza-kpi-pendiente-sub', `${p.cantidad} recibos pendientes`);

    const r = renderMoneyBreakdown('cobranza-kpi-realizada', porMoneda, 'realizada', filtro);
    setElemText('cobranza-kpi-realizada-sub', `${r.cantidad} recibos pagados`);

    const v = renderMoneyBreakdown('cobranza-kpi-vencida', porMoneda, 'vencida', filtro);
    setElemText('cobranza-kpi-vencida-sub', `${v.cantidad} recibos vencidos`);
}

function renderCobranzasTable(cobranzas) {
    const tbody = document.getElementById('cobranzas-table-body');
    if (!tbody) return;

    if (!cobranzas || cobranzas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 3rem; color: #94a3b8;">
                    No hay recibos de cobranza que coincidan con la búsqueda.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = cobranzas.map(c => {
        const dias = parseInt(c.dias_para_vencer, 10);
        let plazoBadge = '';
        if (c.estado === 'realizada') {
            plazoBadge = `<span class="badge-status badge-realizada">Pagado</span>`;
        } else if (dias < 0) {
            plazoBadge = `<span class="badge-status badge-vencida">Vencido hace ${Math.abs(dias)}d</span>`;
        } else if (dias === 0) {
            plazoBadge = `<span class="badge-status badge-vencida">¡Vence HOY!</span>`;
        } else {
            plazoBadge = `<span class="badge-status badge-pendiente">Vence en ${dias}d</span>`;
        }

        const cleanWa = cleanPhoneForWhatsApp(c.cliente_whatsapp || c.cliente_telefono);
        const msgWa = encodeURIComponent(`Hola ${c.cliente_nombre}, le enviamos un recordatorio de pago para el recibo #${c.numero_recibo} de su póliza ${c.numero_poliza} (${c.aseguradora}) por ${formatMoney(c.monto, c.moneda)}, con fecha límite ${c.fecha_vencimiento}. Por favor envíenos su comprobante para mantener su póliza vigente.`);
        const wspLink = cleanWa ? `https://wa.me/${cleanWa}?text=${msgWa}` : '#';

        return `
            <tr>
                <td>
                    <span class="cell-bold">Recibo #${escapeHtml(c.numero_recibo)}</span>
                </td>
                <td>
                    <span class="cell-bold">${escapeHtml(c.numero_poliza)}</span>
                    <span class="badge-aseguradora" style="display:inline-block; margin-top: 2px;">${escapeHtml(c.aseguradora)}</span>
                </td>
                <td>
                    <span class="cell-bold">${escapeHtml(c.cliente_nombre)}</span>
                    <span class="cell-subtext">${escapeHtml(c.cliente_telefono || c.cliente_email || 'Sin datos')}</span>
                </td>
                <td>
                    <span class="cell-bold" style="font-size: 0.95rem; color: #0f172a;">${formatMoney(c.monto, c.moneda)}</span>
                </td>
                <td>
                    <span class="cell-bold">${c.fecha_vencimiento}</span>
                </td>
                <td>
                    ${plazoBadge}
                </td>
                <td>
                    <span class="badge-status ${c.estado === 'realizada' ? 'badge-realizada' : (c.estado === 'vencida' ? 'badge-vencida' : 'badge-pendiente')}">
                        ${c.estado === 'realizada' ? 'Cobrado' : (c.estado === 'vencida' ? 'Vencido' : 'Pendiente')}
                    </span>
                </td>
                <td>
                    ${c.fecha_pago ? `
                        <span style="font-size: 0.8rem; font-weight: 600; color: #047857;">${c.fecha_pago}</span>
                        <span class="cell-subtext">${escapeHtml(c.metodo_pago || 'Pago registrado')}</span>
                    ` : '<span style="color: #94a3b8; font-size: 0.8rem;">Pendiente de cobro</span>'}
                </td>
                <td>
                    ${c.comprobante_archivo ? `
                        <button type="button" class="btn-clean" style="padding: 2px 8px; font-size: 0.75rem;" onclick="previewDocumento('Comprobante Recibo #${escapeHtml(c.numero_recibo)}', '${c.comprobante_archivo}', 'pdf')">
                            Ver
                        </button>
                    ` : '<span style="color: #cbd5e1; font-size: 0.8rem;">Sin adjunto</span>'}
                </td>
                <td>
                    <div class="actions-cell" style="justify-content: flex-end; gap: 6px;">
                        ${cleanWa ? `
                            <a href="${wspLink}" target="_blank" class="btn-clean" title="Recordatorio por WhatsApp">
                                WhatsApp
                            </a>
                        ` : ''}

                        ${c.estado !== 'realizada' ? `
                            <button type="button" class="btn-clean btn-clean-primary" onclick="abrirMarcarPago(${c.id}, '${escapeHtml(c.numero_recibo)}', '${escapeHtml(c.cliente_nombre)}', ${c.monto}, 'Póliza: ${escapeHtml(c.numero_poliza)}')">
                                Cobrar
                            </button>
                        ` : `
                            <button type="button" class="btn-clean" onclick="revertirPago(${c.id})" title="Revertir Pago">
                                Revertir
                            </button>
                        `}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function abrirMarcarPago(reciboId, numRecibo, clienteNombre, monto, polizaInfo) {
    document.getElementById('form-marcar-pago').reset();
    document.getElementById('pago-recibo-id').value = reciboId;
    document.getElementById('pago-recibo-num').textContent = `Recibo #${numRecibo}`;
    document.getElementById('pago-cliente-nombre').textContent = clienteNombre;
    document.getElementById('pago-monto-display').textContent = currencyFormatter.format(monto);
    document.getElementById('pago-poliza-info').textContent = polizaInfo;
    document.getElementById('pago-comp-name').textContent = 'Adjuntar Comprobante (PDF o Imagen)';

    // Fecha de hoy por defecto
    document.getElementById('pago-fecha').value = new Date().toISOString().split('T')[0];

    openModal('modal-marcar-pago');
}

async function handleConfirmarPago(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-confirm-pago');
    btn.disabled = true;
    btn.innerHTML = 'Registrando...';

    const formData = new FormData(document.getElementById('form-marcar-pago'));
    formData.append('action', 'marcar_pago');

    try {
        const res = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();

        if (data.success) {
            showToast(data.message || 'Pago registrado exitosamente', 'success');
            closeModal('modal-marcar-pago');
            if (AppState.activePolizaId) {
                abrirHistoricoPagos(AppState.activePolizaId);
            }
            loadCobranzas();
            loadPolizas();
            loadDashboardAnalytics();
        } else {
            showToast(data.message || 'Error al registrar pago', 'error');
        }
    } catch (err) {
        showToast('Error de conexión al marcar pago', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Confirmar Pago y Poner Vigente';
    }
}

async function revertirPago(reciboId) {
    if (!confirm('¿Deseas revertir este pago a pendiente? La póliza recalculará su estatus automáticamente.')) return;

    try {
        const res = await fetch(`api.php?action=anular_pago&recibo_id=${reciboId}`);
        const data = await res.json();
        if (data.success) {
            showToast('Pago revertido correctamente', 'info');
            loadCobranzas();
            loadPolizas();
            loadDashboardAnalytics();
        } else {
            showToast(data.message || 'Error al revertir', 'error');
        }
    } catch (err) {
        showToast('Error de conexión', 'error');
    }
}

function resetCobranzaFilters() {
    document.getElementById('cobranza-search').value = '';
    document.getElementById('cobranza-filter-estado').value = 'todos';
    document.getElementById('cobranza-filter-periodo').value = 'todos';
    const monedaCob = document.getElementById('cobranza-filter-moneda');
    if (monedaCob) monedaCob.value = 'todas';
    loadCobranzas();
}

/* ==========================================================================
   6. MÓDULO 4: CLIENTES (CONTRATANTES)
   ========================================================================== */

async function loadClientes() {
    const q = document.getElementById('clientes-search')?.value || '';
    const params = new URLSearchParams({
        action: 'get_clientes',
        q
    });

    try {
        const res = await fetch(`api.php?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
            AppState.clientes = data.clientes || [];
            renderClientesGrid(AppState.clientes);
            setElemText('clientes-counter', `${AppState.clientes.length} contratantes registrados`);
        }
    } catch (err) {
        console.error('Error al cargar clientes:', err);
    }
}

function renderClientesGrid(clientes) {
    const container = document.getElementById('clientes-grid-container');
    if (!container) return;

    if (!clientes || clientes.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #94a3b8;">
                No se encontraron clientes registrados. Haz clic en "Nuevo Cliente" para agregar uno.
            </div>
        `;
        return;
    }

    container.innerHTML = clientes.map(c => {
        const cleanWa = cleanPhoneForWhatsApp(c.whatsapp || c.telefono);
        const msgWa = encodeURIComponent(`Hola ${c.nombre}, le saludamos de Núcleo Seguros. Estamos a su disposición para cualquier duda sobre sus pólizas y coberturas.`);
        const wspLink = cleanWa ? `https://wa.me/${cleanWa}?text=${msgWa}` : '';
        const phoneLink = c.telefono ? `tel:${c.telefono.replace(/[^0-9]/g, '')}` : '';
        const mailLink = c.email ? `mailto:${c.email}` : '';

        const initial = (c.nombre || 'C').charAt(0).toUpperCase();

        return `
            <div class="client-card">
                <div style="cursor: pointer;" onclick="openDetalleCliente(${c.id})" title="Clic para ver la información del cliente">
                    <div class="client-card-header">
                        <div class="client-avatar-name">
                            <div class="client-avatar">${initial}</div>
                            <div class="client-name-box">
                                <h4>${escapeHtml(c.nombre)}</h4>
                                <span class="badge-persona">${c.tipo_persona === 'moral' ? 'Persona Moral' : 'Persona Física'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="client-info-list">
                        ${c.whatsapp ? `
                            <div class="client-info-item">
                                <span>WhatsApp: <strong>${escapeHtml(c.whatsapp)}</strong></span>
                            </div>
                        ` : ''}
                        ${c.telefono ? `
                            <div class="client-info-item">
                                <span>Tel: <strong>${escapeHtml(c.telefono)}</strong></span>
                            </div>
                        ` : ''}
                        ${c.email ? `
                            <div class="client-info-item">
                                <span>${escapeHtml(c.email)}</span>
                            </div>
                        ` : ''}
                        ${c.rfc ? `
                            <div class="client-info-item">
                                <span>RFC: <strong>${escapeHtml(c.rfc)}</strong></span>
                            </div>
                        ` : ''}
                        ${c.direccion ? `
                            <div class="client-info-item">
                                <span>${escapeHtml(c.direccion)}</span>
                            </div>
                        ` : ''}
                    </div>

                    <div class="client-stats-bar" style="cursor: pointer;" onclick="event.stopPropagation(); openDetalleCliente(${c.id}, 'polizas')" title="Clic para ver las pólizas de este cliente">
                        <div class="client-stat">
                            <div class="client-stat-value">${c.total_polizas || 0}</div>
                            <div class="client-stat-label">Pólizas</div>
                        </div>
                        <div class="client-stat">
                            <div class="client-stat-value" style="color: #059669;">${c.polizas_activas || 0}</div>
                            <div class="client-stat-label">Vigentes</div>
                        </div>
                        <div class="client-stat">
                            <div class="client-stat-value" style="color: #dc2626;">${c.polizas_vencidas || 0}</div>
                            <div class="client-stat-label">Vencidas</div>
                        </div>
                        <div class="client-stat">
                            <div class="client-stat-value" style="font-size: 0.85rem;">${currencyFormatter.format(c.saldo_pendiente || 0)}</div>
                            <div class="client-stat-label">Por Cobrar</div>
                        </div>
                    </div>
                </div>

                <!-- Barra de Acciones a 1 Clic Directas -->
                <div class="client-card-actions">
                    <div style="display: flex; gap: 6px;">
                        ${cleanWa ? `
                            <a href="${wspLink}" target="_blank" class="btn-action btn-wsp" title="Enviar WhatsApp a 1 Clic">${SVG_ICONS.whatsapp}</a>
                        ` : ''}
                        ${phoneLink ? `
                            <a href="${phoneLink}" class="btn-action btn-call" title="Llamar con 1 Clic">${SVG_ICONS.phone}</a>
                        ` : ''}
                        ${mailLink ? `
                            <a href="${mailLink}" class="btn-action btn-mail" title="Enviar Correo con 1 Clic">${SVG_ICONS.envelope}</a>
                        ` : ''}
                        <button class="btn-action btn-doc" onclick="openModalUploadDoc(${c.id})" title="Subir Documento (INE / CSF / Comprobante) a 1 Clic">${SVG_ICONS.upload}</button>
                    </div>

                    <div style="display: flex; gap: 6px;">
                        <button class="btn-clean" style="padding: 2px 8px; font-size: 0.75rem; font-weight: 600;" onclick="openDetalleCliente(${c.id}, 'polizas')" title="Ver solo las pólizas de este cliente">
                            Ver Pólizas
                        </button>
                        <button class="btn-action btn-edit" onclick="openModalEditarCliente(${c.id})" title="Editar Cliente">${SVG_ICONS.edit}</button>
                        <button class="btn-action btn-del" onclick="eliminarCliente(${c.id}, '${escapeHtml(c.nombre)}')" title="Eliminar Cliente">${SVG_ICONS.trash}</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/* --- Ficha de cliente: información, pólizas propias y archivos guardados --- */
async function openDetalleCliente(id, seccion = 'polizas') {
    try {
        const res = await fetch(`api.php?action=get_cliente&id=${id}`);
        const data = await res.json();
        if (!data.success || !data.cliente) {
            showToast(data.message || 'No se pudo obtener la información del cliente.', 'error');
            return;
        }

        const c = data.cliente;
        const polizas = data.polizas || [];
        const docs = data.documentos || [];

        setElemText('cdet-avatar', (c.nombre || 'C').charAt(0).toUpperCase());
        setElemText('cdet-nombre', c.nombre || '--');
        setElemText('cdet-tipo', c.tipo_persona === 'moral' ? 'Persona Moral' : 'Persona Física');

        const infoItems = [
            ['WhatsApp', c.whatsapp],
            ['Teléfono', c.telefono],
            ['Correo', c.email],
            ['RFC', c.rfc],
            ['CURP', c.curp],
            ['Dirección', c.direccion]
        ].filter(([, v]) => v);
        document.getElementById('cdet-info').innerHTML = infoItems.length
            ? infoItems.map(([k, v]) => `<div class="cliente-det-item"><span>${k}</span><strong>${escapeHtml(String(v))}</strong></div>`).join('')
            : '<div style="color:#94a3b8; font-size:0.85rem;">Sin datos de contacto registrados.</div>';

        const vigentes = polizas.filter(p => p.estado_poliza === 'activa').length;
        const vencidas = polizas.filter(p => p.estado_poliza === 'vencida').length;
        setElemText('cdet-stat-total', polizas.length);
        setElemText('cdet-stat-vigentes', vigentes);
        setElemText('cdet-stat-vencidas', vencidas);
        setElemText('cdet-stat-docs', docs.length);

        // Lista de pólizas SOLO de este cliente
        const polEl = document.getElementById('cdet-sec-polizas');
        polEl.innerHTML = polizas.length ? polizas.map(p => {
            const badge = p.estado_poliza === 'activa' ? 'badge-vigente' : (p.estado_poliza === 'vencida' ? 'badge-vencida' : 'badge-pendiente');
            const estadoTxt = p.estado_poliza === 'activa' ? 'Vigente' : (p.estado_poliza === 'vencida' ? 'Vencida' : escapeHtml(p.estado_poliza || ''));
            return `
                <div class="cliente-det-row">
                    <div style="min-width: 0;">
                        <div style="font-weight: 700; color: #0f172a;">${escapeHtml(p.numero_poliza)}</div>
                        <div style="font-size: 0.775rem; color: #64748b;">
                            ${escapeHtml(p.aseguradora || '')}${p.ramo ? ' · ' + escapeHtml(p.ramo) : ''}
                            · Vigencia ${formatDateMX(p.vigencia_desde)} al ${formatDateMX(p.vigencia_hasta)}
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <strong>${currencyFormatter.format(parseFloat(p.prima_total) || 0)}</strong>
                        <span class="badge-status ${badge}">${estadoTxt}</span>
                        <button type="button" class="btn-clean" onclick="verDetallePoliza(${p.id})">Ver detalle</button>
                    </div>
                </div>`;
        }).join('') : '<div class="cliente-det-empty">Este cliente aún no tiene pólizas registradas.</div>';

        // Archivos guardados
        const docEl = document.getElementById('cdet-sec-docs');
        docEl.innerHTML = docs.length ? docs.map(d => `
            <div class="cliente-det-row">
                <div style="min-width: 0;">
                    <div style="font-weight: 700; color: #0f172a;">${escapeHtml(d.titulo || d.archivo_nombre_original || 'Documento')}</div>
                    <div style="font-size: 0.775rem; color: #64748b;">
                        ${escapeHtml(d.archivo_nombre_original || '')}${d.archivo_tamano ? ' · ' + formatBytes(d.archivo_tamano) : ''}
                    </div>
                </div>
                <div style="display: flex; gap: 6px;">
                    <button type="button" class="btn-clean" onclick="previewDocumento('${escapeHtml(d.titulo || 'Documento')}', '${d.archivo_ruta}', '${d.archivo_extension}')">Previsualizar</button>
                    <a href="${d.archivo_ruta}" download class="btn-action btn-view" title="Descargar">${SVG_ICONS.download}</a>
                </div>
            </div>`).join('') : '<div class="cliente-det-empty">Este cliente no tiene archivos guardados.</div>';

        const btnP = document.getElementById('cdet-btn-polizas');
        const btnD = document.getElementById('cdet-btn-docs');
        btnP.textContent = `Ver Pólizas (${polizas.length})`;
        btnD.textContent = `Ver Archivos (${docs.length})`;
        btnD.style.display = docs.length ? '' : 'none';

        document.getElementById('cdet-btn-editar').onclick = () => { closeModal('modal-detalle-cliente'); openModalEditarCliente(c.id); };
        document.getElementById('cdet-btn-nueva-poliza').onclick = () => { closeModal('modal-detalle-cliente'); openModalNuevaPoliza(c.id); };

        polEl.style.display = 'none';
        docEl.style.display = 'none';
        btnP.classList.remove('active');
        btnD.classList.remove('active');

        openModal('modal-detalle-cliente');
        if (seccion) toggleClienteSeccion(seccion);
    } catch (err) {
        console.error(err);
        showToast('Error de conexión al cargar el cliente.', 'error');
    }
}

function toggleClienteSeccion(seccion) {
    const map = { polizas: ['cdet-sec-polizas', 'cdet-btn-polizas'], docs: ['cdet-sec-docs', 'cdet-btn-docs'] };
    Object.entries(map).forEach(([key, [secId, btnId]]) => {
        const sec = document.getElementById(secId);
        const btn = document.getElementById(btnId);
        const show = key === seccion && sec.style.display === 'none';
        sec.style.display = show ? 'block' : 'none';
        btn.classList.toggle('active', show);
    });
}

function openModalNuevoCliente(fromPolizaModal = false) {
    document.getElementById('form-cliente').reset();
    document.getElementById('cliente-id').value = '';
    document.getElementById('modal-cliente-title').innerHTML = 'Registrar Cliente (Contratante)';
    document.getElementById('cli-ine-name').textContent = 'Adjuntar INE (PDF/Imagen)';
    document.getElementById('cli-csf-name').textContent = 'Adjuntar CSF (PDF)';

    openModal('modal-cliente');
}

async function openModalEditarCliente(id) {
    try {
        const res = await fetch(`api.php?action=get_cliente&id=${id}`);
        const data = await res.json();

        if (data.success && data.cliente) {
            const c = data.cliente;
            document.getElementById('form-cliente').reset();
            document.getElementById('cliente-id').value = c.id;
            document.getElementById('modal-cliente-title').innerHTML = `Editar Cliente: ${escapeHtml(c.nombre)}`;

            document.getElementById('cliente-tipo-persona').value = c.tipo_persona || 'fisica';
            document.getElementById('cliente-nombre').value = c.nombre;
            document.getElementById('cliente-whatsapp').value = c.whatsapp || c.telefono || '';
            document.getElementById('cliente-telefono').value = c.telefono || '';
            document.getElementById('cliente-email').value = c.email || '';
            document.getElementById('cliente-rfc').value = c.rfc || '';
            document.getElementById('cliente-direccion').value = c.direccion || '';
            document.getElementById('cliente-notas').value = c.notas || '';

            openModal('modal-cliente');
        }
    } catch (err) {
        showToast('Error al cargar datos del cliente', 'error');
    }
}

async function handleSaveCliente(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-save-cliente');
    btn.disabled = true;
    btn.innerHTML = 'Guardando...';

    const formData = new FormData(document.getElementById('form-cliente'));
    formData.append('action', 'save_cliente');

    try {
        const res = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();

        if (data.success) {
            showToast(data.message || 'Cliente guardado correctamente', 'success');
            closeModal('modal-cliente');
            loadClientes();
            loadDashboardAnalytics();
            preloadAgentesYClientes();

            // Si el modal de póliza está abierto, seleccionar al nuevo cliente de inmediato
            const polCliSelect = document.getElementById('poliza-cliente-id');
            if (polCliSelect && data.cliente_id) {
                populateClientesSelect('poliza-cliente-id', data.cliente_id);
            }
        } else {
            showToast(data.message || 'Error al guardar cliente', 'error');
        }
    } catch (err) {
        showToast('Error de conexión', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Guardar Cliente';
    }
}

async function eliminarCliente(id, nombre) {
    if (!confirm(`¿Estás seguro de eliminar a "${nombre}"? Sus pólizas y cobranzas también se eliminarán.`)) return;

    try {
        const res = await fetch(`api.php?action=delete_cliente&id=${id}`);
        const data = await res.json();
        if (data.success) {
            showToast('Cliente eliminado correctamente', 'success');
            loadClientes();
            loadPolizas();
            loadDashboardAnalytics();
            preloadAgentesYClientes();
        } else {
            showToast(data.message || 'Error al eliminar cliente', 'error');
        }
    } catch (err) {
        showToast('Error al eliminar cliente', 'error');
    }
}

/* ==========================================================================
   7. MÓDULO 5: EXPEDIENTE DIGITAL Y DOCUMENTOS
   ========================================================================== */

async function loadDocumentos() {
    const q = document.getElementById('docs-search')?.value || '';
    const tipo = document.getElementById('docs-filter-tipo')?.value || 'todos';

    const params = new URLSearchParams({
        action: 'get_documentos',
        q,
        tipo_documento: tipo
    });

    try {
        const res = await fetch(`api.php?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
            AppState.documentos = data.documentos || [];
            renderDocumentosGrid(AppState.documentos);
            setElemText('docs-counter', `${AppState.documentos.length} archivos en expediente`);
        }
    } catch (err) {
        console.error('Error al cargar documentos:', err);
    }
}

function renderDocumentosGrid(docs) {
    const container = document.getElementById('documentos-grid-container');
    if (!container) return;

    if (!docs || docs.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #94a3b8;">
                No se encontraron documentos en el expediente digital.
            </div>
        `;
        return;
    }

    const typeIcons = {
        poliza: 'fa-shield-halved',
        identificacion: 'fa-id-card',
        csf: 'fa-file-invoice',
        comprobante_pago: 'fa-receipt',
        comprobante_domicilio: 'fa-house',
        otro: 'fa-file'
    };

    container.innerHTML = docs.map(d => {
        const isPdf = d.archivo_extension === 'pdf';
        const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(d.archivo_extension);
        const iconType = isPdf ? 'pdf' : (isImage ? 'image' : 'file');
        const mainIcon = typeIcons[d.tipo_documento] || 'fa-file';

        return `
            <div class="doc-card">
                <div>
                    <div class="doc-card-top">
                        <div class="doc-icon-box ${iconType}">${isPdf ? SVG_ICONS.pdf : SVG_ICONS.file}</div>
                        <div class="doc-meta">
                            <h4 title="${escapeHtml(d.titulo)}">${escapeHtml(d.titulo)}</h4>
                            <p>${escapeHtml(d.archivo_nombre_original)}</p>
                        </div>
                    </div>

                    <div style="font-size: 0.775rem; color: #64748b; margin-bottom: 0.75rem;">
                        ${d.cliente_nombre ? `<div>${escapeHtml(d.cliente_nombre)}</div>` : ''}
                        ${d.numero_poliza ? `<div>${escapeHtml(d.numero_poliza)} (${escapeHtml(d.aseguradora || '')})</div>` : ''}
                        <div style="margin-top: 4px; font-size: 0.7rem; color: #94a3b8;">
                            Subido el ${d.fecha_subida} · ${formatBytes(d.archivo_tamano)}
                        </div>
                    </div>
                </div>

                <div class="doc-card-footer">
                    <button class="btn-clean" style="padding: 2px 8px; font-size: 0.75rem;" onclick="previewDocumento('${escapeHtml(d.titulo)}', '${d.archivo_ruta}', '${d.archivo_extension}')">
                        Previsualizar
                    </button>
                    <div style="display: flex; gap: 4px;">
                        <a href="${d.archivo_ruta}" download class="btn-action btn-view" title="Descargar">${SVG_ICONS.download}</a>
                        <button class="btn-action btn-del" onclick="eliminarDocumento(${d.id}, '${escapeHtml(d.titulo)}')" title="Eliminar Archivo">${SVG_ICONS.trash}</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openModalUploadDoc(preselectedClienteId = null, preselectedPolizaId = null) {
    document.getElementById('form-upload-doc').reset();
    document.getElementById('upload-file-label').textContent = 'Selecciona o arrastra el archivo aquí';

    populateClientesSelect('upload-cliente-id', preselectedClienteId);
    if (preselectedClienteId) {
        populatePolizasPorCliente(preselectedClienteId, 'upload-poliza-id', preselectedPolizaId);
    } else {
        document.getElementById('upload-poliza-id').innerHTML = '<option value="">-- Sin vincular a póliza específica --</option>';
    }

    openModal('modal-upload-doc');
}

function handleFileSelectUpload(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        document.getElementById('upload-file-label').textContent = `${file.name} (${formatBytes(file.size)})`;
        const tituloInput = document.getElementById('upload-titulo');
        if (!tituloInput.value) {
            tituloInput.value = file.name.replace(/\.[^\/.]+$/, "");
        }
    }
}

async function handleUploadDocumento(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-do-upload');
    btn.disabled = true;
    btn.innerHTML = 'Subiendo...';

    const formData = new FormData(document.getElementById('form-upload-doc'));
    formData.append('action', 'upload_documento');

    try {
        const res = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();

        if (data.success) {
            showToast(data.message || 'Documento subido exitosamente', 'success');
            closeModal('modal-upload-doc');
            loadDocumentos();
            loadDashboardAnalytics();
        } else {
            showToast(data.message || 'Error al subir archivo', 'error');
        }
    } catch (err) {
        showToast('Error de conexión al subir', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Subir Documento';
    }
}

function previewDocumento(titulo, ruta, ext) {
    const titleEl = document.getElementById('preview-doc-title');
    const bodyEl = document.getElementById('preview-doc-body');
    const dlLink = document.getElementById('preview-download-link');

    titleEl.innerHTML = `${titulo}`;
    dlLink.href = ruta;

    ext = (ext || '').toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
        bodyEl.innerHTML = `<img src="${ruta}" alt="${titulo}" style="max-width: 100%; max-height: 100%; object-fit: contain;">`;
    } else if (ext === 'pdf') {
        bodyEl.innerHTML = `<iframe src="${ruta}" style="width: 100%; height: 100%; border: none;"></iframe>`;
    } else {
        bodyEl.innerHTML = `
            <div style="text-align: center; color: #ffffff; padding: 3rem;">
                <p style="margin-bottom: 1rem;">La vista previa en pantalla no está disponible para este tipo de archivo (.${ext}).</p>
                <a href="${ruta}" download class="btn-primary-action">
                    Descargar Archivo Directamente
                </a>
            </div>
        `;
    }

    openModal('modal-preview-doc');
}

async function eliminarDocumento(id, titulo) {
    if (!confirm(`¿Eliminar el documento "${titulo}" del expediente digital?`)) return;

    try {
        const res = await fetch(`api.php?action=delete_documento&id=${id}`);
        const data = await res.json();
        if (data.success) {
            showToast('Documento eliminado correctamente', 'success');
            loadDocumentos();
            loadDashboardAnalytics();
        } else {
            showToast(data.message || 'Error al eliminar', 'error');
        }
    } catch (err) {
        showToast('Error al eliminar', 'error');
    }
}

/* ==========================================================================
   8. HELPERS, SELECTORES Y PRECARGAS
   ========================================================================== */

async function preloadAgentesYClientes() {
    try {
        const [resCli, resAge] = await Promise.all([
            fetch('api.php?action=get_clientes'),
            fetch('api.php?action=get_agentes')
        ]);
        const dataCli = await resCli.json();
        const dataAge = await resAge.json();

        if (dataCli.success) {
            AppState.clientes = dataCli.clientes || [];
            populateClientesCalendarSelect(AppState.clientes);
        }
        if (dataAge.success) {
            AppState.agentes = dataAge.agentes || [];
            populateAgentesSelect(AppState.agentes);
        }
    } catch (e) { }
}

function populateClientesSelect(selectId, selectedId = null) {
    const el = document.getElementById(selectId);
    if (!el) return;

    const isUpload = selectId.includes('upload');
    el.innerHTML = isUpload ? '<option value="">-- Sin vincular a cliente específico --</option>' : '<option value="">-- Selecciona el contratante --</option>';

    AppState.clientes.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.nombre} (${c.rfc || c.telefono || 'Sin RFC'})`;
        if (String(c.id) === String(selectedId)) opt.selected = true;
        el.appendChild(opt);
    });
}

async function populatePolizasPorCliente(clienteId, selectId, selectedPolizaId = null) {
    const el = document.getElementById(selectId);
    if (!el) return;

    el.innerHTML = '<option value="">-- Sin vincular a póliza específica --</option>';
    if (!clienteId) return;

    try {
        const res = await fetch(`api.php?action=get_polizas&cliente_id=${clienteId}`);
        const data = await res.json();
        if (data.success && data.polizas) {
            data.polizas.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.textContent = `${p.numero_poliza} (${p.aseguradora} - ${p.ramo})`;
                if (String(p.id) === String(selectedPolizaId)) opt.selected = true;
                el.appendChild(opt);
            });
        }
    } catch (e) { }
}

function initGlobalEventListeners() {
    // Cerrar modal con tecla Escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-backdrop.active').forEach(m => m.classList.remove('active'));
        }
    });

    // Cerrar modal al hacer clic en el backdrop
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                backdrop.classList.remove('active');
            }
        });
    });
}

function openModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.add('active');
}

function closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove('active');
    if (modalId === 'modal-historico-pagos') {
        AppState.activePolizaId = null;
    }
}

function displaySelectedFileName(input, targetElId) {
    const el = document.getElementById(targetElId);
    if (!el) return;
    if (input.files && input.files[0]) {
        el.textContent = `Archivo: ${input.files[0].name} (${formatBytes(input.files[0].size)})`;
    }
}

function cleanPhoneForWhatsApp(phone) {
    if (!phone) return '';
    let digits = String(phone).replace(/[^0-9]/g, '');
    if (digits.length === 10) {
        digits = '52' + digits; // Prefijo México si tiene 10 dígitos
    }
    return digits;
}

function formatBytes(bytes, decimals = 1) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function setElemText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-circle-xmark';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation';

    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/* ==========================================================================
   7. EQUIPOS Y CONFIGURACIÓN DEL CRM (SETTINGS CRM)
   ========================================================================== */

function switchSettingsSubtab(subtab) {
    AppState.settingsSubtab = subtab;

    document.querySelectorAll('.settings-subtab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.settings-tab-panel').forEach(p => p.classList.remove('active'));

    const activeBtn = document.getElementById(`subtab-btn-${subtab}`);
    const activePanel = document.getElementById(`panel-settings-${subtab}`);

    if (activeBtn) activeBtn.classList.add('active');
    if (activePanel) activePanel.classList.add('active');
}

async function loadContactos() {
    try {
        const res = await fetch('api.php?action=get_contactos_apoyo');
        const data = await res.json();
        if (data.success) {
            AppState.contactos = data.contactos || [];
            populateContactosFilters(AppState.contactos);
            filterContactosTable();
        } else {
            showToast(data.message || 'No se pudieron cargar los contactos.', 'error');
        }
    } catch (err) {
        console.error('Error al cargar contactos:', err);
    }
}

function populateContactosFilters(contactos) {
    const fill = (id, key, allValue) => {
        const el = document.getElementById(id);
        if (!el) return;
        const current = el.value;
        const values = [...new Set(contactos.map(c => (c[key] || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
        el.innerHTML = `<option value="${allValue}">Todas</option>` +
            values.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
        if (current && values.includes(current)) el.value = current;
    };
    fill('contactos-filter-aseguradora', 'aseguradora', 'todas');
    fill('contactos-filter-area', 'area', 'todas');
}

function filterContactosTable() {
    const term = (document.getElementById('contactos-search')?.value || '').trim().toLowerCase();
    const aseg = document.getElementById('contactos-filter-aseguradora')?.value || 'todas';
    const area = document.getElementById('contactos-filter-area')?.value || 'todas';

    let lista = AppState.contactos || [];
    if (aseg !== 'todas') lista = lista.filter(c => (c.aseguradora || '').trim() === aseg);
    if (area !== 'todas') lista = lista.filter(c => (c.area || '').trim() === area);
    if (term) {
        lista = lista.filter(c => [c.nombre, c.email, c.telefono, c.aseguradora, c.area, c.notas]
            .some(v => (v || '').toLowerCase().includes(term)));
    }
    renderContactosTable(lista);
}

function renderContactosTable(contactos) {
    const tbody = document.getElementById('contactos-table-body');
    if (!tbody) return;
    setElemText('contactos-counter', `${contactos.length} ${contactos.length === 1 ? 'contacto' : 'contactos'}`);

    if (!contactos.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2.5rem; color: #94a3b8;">
                    Aún no hay contactos. Usa "Agregar Contacto" para registrar a las personas que te apoyan en cada aseguradora.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = contactos.map(c => {
        const initial = (c.nombre || 'C').charAt(0).toUpperCase();
        const cleanWa = cleanPhoneForWhatsApp(c.telefono);
        return `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="user-avatar" style="width: 32px; height: 32px; font-weight: 700;">${initial}</div>
                        <div style="font-weight: 600; color: #0f172a; font-size: 0.875rem;">${escapeHtml(c.nombre)}</div>
                    </div>
                </td>
                <td style="font-size: 0.85rem;">${c.email ? `<a href="mailto:${escapeHtml(c.email)}" style="color: #192918;">${escapeHtml(c.email)}</a>` : '--'}</td>
                <td style="font-size: 0.85rem;">${c.telefono ? escapeHtml(c.telefono) : '--'}</td>
                <td>${c.aseguradora ? `<span class="team-badge-chip" style="font-weight: 600;">${escapeHtml(c.aseguradora)}</span>` : '--'}</td>
                <td>${c.area ? `<span class="badge-role badge-role-auditor">${escapeHtml(c.area)}</span>` : '--'}</td>
                <td style="font-size: 0.8rem; color: #64748b; max-width: 220px;">${c.notas ? escapeHtml(c.notas) : ''}</td>
                <td style="text-align: right; white-space: nowrap;">
                    <div style="display: inline-flex; gap: 6px;">
                        ${cleanWa ? `<a href="https://wa.me/${cleanWa}" target="_blank" class="btn-action btn-wsp" title="Escribir por WhatsApp">${SVG_ICONS.whatsapp}</a>` : ''}
                        <button type="button" class="btn-action btn-edit" onclick="openModalContacto(${c.id})" title="Editar contacto">${SVG_ICONS.edit}</button>
                        <button type="button" class="btn-action btn-del" onclick="eliminarContacto(${c.id}, '${escapeHtml(c.nombre)}')" title="Eliminar contacto">${SVG_ICONS.trash}</button>
                    </div>
                </td>
            </tr>`;
    }).join('');
}

function openModalContacto(id = null) {
    const form = document.getElementById('form-contacto');
    if (form) form.reset();
    document.getElementById('contacto-id').value = '';
    setElemText('modal-contacto-title', 'Agregar Contacto de Apoyo');

    if (id) {
        const c = (AppState.contactos || []).find(x => String(x.id) === String(id));
        if (c) {
            document.getElementById('contacto-id').value = c.id;
            document.getElementById('contacto-nombre').value = c.nombre || '';
            document.getElementById('contacto-email').value = c.email || '';
            document.getElementById('contacto-telefono').value = c.telefono || '';
            document.getElementById('contacto-aseguradora').value = c.aseguradora || '';
            document.getElementById('contacto-area').value = c.area || '';
            document.getElementById('contacto-notas').value = c.notas || '';
            setElemText('modal-contacto-title', 'Editar Contacto de Apoyo');
        }
    }
    openModal('modal-contacto');
}

async function handleSaveContacto(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-save-contacto');
    if (btn) btn.disabled = true;

    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());

    try {
        const res = await fetch('api.php?action=save_contacto_apoyo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (btn) btn.disabled = false;
        if (data.success) {
            closeModal('modal-contacto');
            showToast(data.message || 'Contacto guardado.', 'success');
            loadContactos();
        } else {
            showToast(data.message || 'No se pudo guardar el contacto.', 'error');
        }
    } catch (err) {
        if (btn) btn.disabled = false;
        showToast('Error de conexión al guardar el contacto.', 'error');
    }
}

async function eliminarContacto(id, nombre) {
    if (!confirm(`¿Eliminar a "${nombre}" del directorio de contactos?`)) return;
    try {
        const res = await fetch('api.php?action=delete_contacto_apoyo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.success) {
            showToast(data.message || 'Contacto eliminado.', 'success');
            loadContactos();
        } else {
            showToast(data.message || 'No se pudo eliminar.', 'error');
        }
    } catch (err) {
        showToast('Error de conexión.', 'error');
    }
}

async function loadSettings() {
    loadContactos();
    try {
        const [eqRes, empRes] = await Promise.all([
            fetch('api.php?action=get_equipos'),
            fetch('api.php?action=get_empresa_settings')
        ]);

        const eqData = await eqRes.json();
        const empData = await empRes.json();

        if (eqData.success) {
            AppState.equipos = eqData.equipos || [];
            AppState.todosMiembros = eqData.todos_miembros || [];

            // Resumen de Equipos y Colaboradores
            const res = eqData.resumen || {};
            setElemText('kpi-eq-total-equipos', res.total_equipos || AppState.equipos.length);
            setElemText('kpi-eq-total-miembros', res.total_miembros || AppState.todosMiembros.length);
            setElemText('kpi-eq-invitaciones', res.invitaciones_pendientes || 0);

            const counterEl = document.getElementById('miembros-counter');
            if (counterEl) {
                counterEl.textContent = `${AppState.todosMiembros.length} colaboradores registrados`;
            }

            renderEquiposGrid(AppState.equipos);
            populateEquiposFilterSelect(AppState.equipos);
            renderMiembrosTable(AppState.todosMiembros);
        }

        if (empData.success && empData.empresa) {
            const emp = empData.empresa;
            const compEl = document.getElementById('empresa-company');
            const fnEl = document.getElementById('empresa-fullname');
            const emEl = document.getElementById('empresa-email');
            const rfcEl = document.getElementById('empresa-rfc');
            const telEl = document.getElementById('empresa-telefono');
            const monEl = document.getElementById('empresa-moneda');

            if (compEl) compEl.value = emp.company || '';
            if (fnEl) fnEl.value = emp.fullname || '';
            if (emEl) emEl.value = emp.email || '';
            if (rfcEl) rfcEl.value = emp.rfc || '';
            if (telEl) telEl.value = emp.telefono || '';
            if (monEl && emp.moneda) monEl.value = emp.moneda;
        }
    } catch (err) {
        console.error('Error al cargar equipo y empresa:', err);
        showToast('Error al conectar con la configuración.', 'error');
    }
}

function renderEquiposGrid(equipos) {
    const container = document.getElementById('equipos-grid-container');
    if (!container) return;

    if (!equipos || equipos.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #94a3b8; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 12px;">
                No hay equipos configurados aún. Haz clic en "+ Agregar Equipo" para crear el primero.
            </div>
        `;
        return;
    }

    const modLabels = {
        dashboard: 'Dashboard',
        polizas: 'Pólizas',
        cobranza: 'Cobranza',
        clientes: 'Clientes',
        calendario: 'Calendario',
        documentos: 'Documentos'
    };

    container.innerHTML = equipos.map(eq => {
        const miembros = eq.miembros || [];
        const mCount = miembros.length;
        const color = eq.color || '#10b981';
        const liderNombre = eq.lider_nombre || 'Por Asignar';
        const liderEmail = eq.lider_email || '';
        const liderInitial = liderNombre.charAt(0).toUpperCase();

        const modulos = Array.isArray(eq.permisos_modulos) ? eq.permisos_modulos : [];
        const chipsHtml = modulos.map(m => `
            <span class="team-badge-chip">
                ${modLabels[m] || m}
            </span>
        `).join('');

        // Avatares apilados
        const visibleAvatars = miembros.slice(0, 4);
        const extraCount = mCount - visibleAvatars.length;
        let avatarsHtml = visibleAvatars.map(m => {
            const init = (m.nombre || 'U').charAt(0).toUpperCase();
            return `<div class="member-stacked-avatar" style="background: ${color};" title="${escapeHtml(m.nombre)}">${init}</div>`;
        }).join('');
        if (extraCount > 0) {
            avatarsHtml += `<div class="member-stacked-avatar extra">+${extraCount}</div>`;
        }

        return `
            <div class="equipo-card">
                <div class="equipo-card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="equipo-color-icon" style="background: ${color}; color: #ffffff;"><i class="fa-solid fa-users"></i></div>
                        <div>
                            <div class="equipo-title">${escapeHtml(eq.nombre)}</div>
                            <span style="font-size: 0.725rem; color: #64748b; font-weight: 600;">
                                ${eq.compartir_cartera === 'equipo' ? 'Cartera Exclusiva' : 'Cartera de Empresa'}
                            </span>
                        </div>
                    </div>
                    <div class="equipo-quick-actions">
                        <button type="button" class="btn-action-round" onclick="openModalEditarEquipo(${eq.id})" title="Editar Equipo"><i class="fa-solid fa-pen"></i></button>
                        <button type="button" class="btn-action-round btn-danger-round" onclick="eliminarEquipo(${eq.id}, '${escapeHtml(eq.nombre)}')" title="Eliminar Equipo"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>

                <div class="equipo-card-body">
                    <p class="equipo-desc">${escapeHtml(eq.descripcion || 'Equipo administrativo sin descripción definida.')}</p>

                    <div class="equipo-leader-box">
                        <div class="leader-avatar-circle" style="background: ${color};">
                            ${liderInitial}
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="font-size: 0.7rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Líder de Equipo</div>
                            <div style="font-size: 0.85rem; font-weight: 600; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${escapeHtml(liderNombre)}
                            </div>
                            ${liderEmail ? `<div style="font-size: 0.75rem; color: #64748b;">${escapeHtml(liderEmail)}</div>` : ''}
                        </div>
                    </div>

                    <div style="margin-bottom: 12px;">
                        <div style="font-size: 0.7rem; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 6px;">Módulos Asignados</div>
                        <div class="team-chips-wrap">
                            ${chipsHtml || '<span style="font-size: 0.75rem; color: #94a3b8;">Todos los módulos</span>'}
                        </div>
                    </div>

                    <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center;">
                            <div class="stacked-avatars-group">
                                ${avatarsHtml || '<span style="font-size: 0.75rem; color: #94a3b8;">Sin miembros</span>'}
                            </div>
                            <span style="font-size: 0.775rem; color: #64748b; font-weight: 600; margin-left: 8px;">
                                ${mCount} ${mCount === 1 ? 'miembro' : 'miembros'}
                            </span>
                        </div>
                        <button type="button" class="btn-invite-team" onclick="openModalInvitarColaborador(${eq.id})">
                            Invitar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function populateEquiposFilterSelect(equipos) {
    const el = document.getElementById('miembros-filter-equipo');
    if (!el) return;

    const currentVal = el.value;
    let opts = '<option value="todos">Todos los Equipos</option>';
    equipos.forEach(eq => {
        opts += `<option value="${eq.id}">${escapeHtml(eq.nombre)}</option>`;
    });
    el.innerHTML = opts;
    if (currentVal) el.value = currentVal;
}

function populateEquiposSelect(selectId, selectedId = null) {
    const el = document.getElementById(selectId);
    if (!el) return;

    el.innerHTML = '';
    AppState.equipos.forEach(eq => {
        const opt = document.createElement('option');
        opt.value = eq.id;
        opt.textContent = eq.nombre;
        if (String(eq.id) === String(selectedId)) opt.selected = true;
        el.appendChild(opt);
    });
}

function openModalNuevoEquipo() {
    const form = document.getElementById('form-equipo');
    if (form) form.reset();

    const idEl = document.getElementById('equipo-id');
    if (idEl) idEl.value = '';

    const titleEl = document.getElementById('modal-equipo-title');
    if (titleEl) {
        titleEl.innerHTML = 'Crear Nuevo Equipo';
    }

    // Check all module checkboxes
    document.querySelectorAll('#modal-equipo input[name="permisos_modulos[]"]').forEach(cb => {
        cb.checked = true;
    });

    openModal('modal-equipo');
}

function openModalEditarEquipo(id) {
    const eq = AppState.equipos.find(e => e.id == id);
    if (!eq) return;

    const form = document.getElementById('form-equipo');
    if (form) form.reset();

    document.getElementById('equipo-id').value = eq.id;
    document.getElementById('equipo-nombre').value = eq.nombre || '';
    document.getElementById('equipo-descripcion').value = eq.descripcion || '';
    document.getElementById('equipo-color').value = eq.color || '#10b981';
    document.getElementById('equipo-compartir').value = eq.compartir_cartera || 'empresa';
    document.getElementById('equipo-lider-nombre').value = eq.lider_nombre || '';
    document.getElementById('equipo-lider-email').value = eq.lider_email || '';

    const titleEl = document.getElementById('modal-equipo-title');
    if (titleEl) {
        titleEl.innerHTML = `Editar Equipo: ${escapeHtml(eq.nombre)}`;
    }

    const mods = Array.isArray(eq.permisos_modulos) ? eq.permisos_modulos : [];
    document.querySelectorAll('#modal-equipo input[name="permisos_modulos[]"]').forEach(cb => {
        cb.checked = mods.includes(cb.value);
    });

    openModal('modal-equipo');
}

async function handleSaveEquipo(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-save-equipo');
    if (btn) btn.disabled = true;

    const form = e.target;
    const formData = new FormData(form);

    const permisos = [];
    form.querySelectorAll('input[name="permisos_modulos[]"]:checked').forEach(cb => {
        permisos.push(cb.value);
    });

    const payload = {
        id: formData.get('id') || 0,
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        color: formData.get('color') || '#10b981',
        lider_nombre: formData.get('lider_nombre'),
        lider_email: formData.get('lider_email'),
        compartir_cartera: formData.get('compartir_cartera') || 'empresa',
        permisos_modulos: permisos.length > 0 ? permisos : ['dashboard', 'polizas', 'cobranza', 'clientes', 'documentos']
    };

    try {
        const res = await fetch('api.php?action=save_equipo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (btn) btn.disabled = false;

        if (data.success) {
            closeModal('modal-equipo');
            showToast(data.message || 'Equipo guardado exitosamente.', 'success');
            loadSettings();
        } else {
            showToast(data.message || 'Error al guardar equipo.', 'error');
        }
    } catch (err) {
        if (btn) btn.disabled = false;
        console.error(err);
        showToast('Error al conectar con el servidor.', 'error');
    }
}

async function eliminarEquipo(id, nombre) {
    if (!confirm(`¿Eliminar el equipo "${nombre}"? Sus miembros conservarán su cuenta pero deberán ser reasignados.`)) {
        return;
    }

    try {
        const res = await fetch(`api.php?action=delete_equipo&id=${id}`);
        const data = await res.json();
        if (data.success) {
            showToast(data.message || 'Equipo eliminado.', 'success');
            loadSettings();
        } else {
            showToast(data.message || 'Error al eliminar equipo.', 'error');
        }
    } catch (err) {
        showToast('Error de conexión.', 'error');
    }
}

function renderMiembrosTable(miembros) {
    const tbody = document.getElementById('miembros-table-body');
    if (!tbody) return;

    if (!miembros || miembros.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2.5rem; color: #94a3b8;">
                    No se encontraron colaboradores registrados con los filtros aplicados.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = miembros.map(m => {
        const initial = (m.nombre || 'U').charAt(0).toUpperCase();
        const isPendiente = (m.estado === 'pendiente');
        const statusBadge = isPendiente
            ? `<span class="badge-status badge-pendiente" style="cursor: pointer;" onclick="toggleEstadoMiembro(${m.id}, '${m.estado}')" title="Clic para marcar como Activo">Pendiente</span>`
            : `<span class="badge-status badge-vigente" style="cursor: pointer;" onclick="toggleEstadoMiembro(${m.id}, '${m.estado}')" title="Clic para pausar acceso">Activo</span>`;

        const rolesMap = {
            admin: '<span class="badge-role badge-role-admin">Administrador</span>',
            agente: '<span class="badge-role badge-role-agente">Asesor / Agente</span>',
            auditor: '<span class="badge-role badge-role-auditor">Auditor</span>'
        };

        const eqColor = m.equipo_color || '#10b981';
        const eqNombre = m.equipo_nombre || 'Equipo Principal';

        return `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="user-avatar" style="background: ${eqColor}; color: #ffffff; width: 32px; height: 32px; font-weight: 700;">
                            ${initial}
                        </div>
                        <div>
                            <div style="font-weight: 600; color: #0f172a; font-size: 0.875rem;">${escapeHtml(m.nombre)}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="team-badge-chip" style="border-left: 3px solid ${eqColor}; font-weight: 600;">
                        ${escapeHtml(eqNombre)}
                    </span>
                </td>
                <td style="font-size: 0.85rem; color: #334155;">
                    ${escapeHtml(m.email)}
                </td>
                <td style="font-size: 0.85rem; color: #334155;">
                    ${m.telefono ? escapeHtml(m.telefono) : '--'}
                </td>
                <td>
                    ${rolesMap[m.rol] || escapeHtml(m.rol)}
                </td>
                <td>
                    ${statusBadge}
                </td>
                <td style="text-align: right;">
                    <button type="button" class="btn-clean btn-clean-danger" onclick="eliminarMiembro(${m.id}, '${escapeHtml(m.nombre)}')">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterMiembrosTable() {
    const term = (document.getElementById('miembros-search')?.value || '').trim().toLowerCase();
    const filtroEq = document.getElementById('miembros-filter-equipo')?.value || 'todos';
    const filtroRol = document.getElementById('miembros-filter-rol')?.value || 'todos';

    let filtrados = AppState.todosMiembros;

    if (filtroEq !== 'todos') {
        filtrados = filtrados.filter(m => String(m.equipo_id) === String(filtroEq));
    }

    if (filtroRol !== 'todos') {
        filtrados = filtrados.filter(m => m.rol === filtroRol);
    }

    if (term) {
        filtrados = filtrados.filter(m => {
            const nom = (m.nombre || '').toLowerCase();
            const email = (m.email || '').toLowerCase();
            const tel = (m.telefono || '').toLowerCase();
            return nom.includes(term) || email.includes(term) || tel.includes(term);
        });
    }

    renderMiembrosTable(filtrados);
}

function openModalInvitarColaborador(equipoId = null) {
    const form = document.getElementById('form-invitar-miembro');
    if (form) form.reset();

    populateEquiposSelect('invitar-equipo-id', equipoId);
    openModal('modal-invitar-miembro');
}

async function handleSendInvitacion(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-invitar');
    if (btn) btn.disabled = true;

    const form = e.target;
    const formData = new FormData(form);

    const payload = {
        equipo_id: parseInt(formData.get('equipo_id') || 0, 10),
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        rol: formData.get('rol') || 'agente',
        estado: formData.get('estado') || 'activo'
    };

    try {
        const res = await fetch('api.php?action=invitar_miembro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (btn) btn.disabled = false;

        if (data.success) {
            closeModal('modal-invitar-miembro');
            showToast(data.message || 'Colaborador incorporado con éxito.', 'success');
            loadSettings();
        } else {
            showToast(data.message || 'Error al invitar al colaborador.', 'error');
        }
    } catch (err) {
        if (btn) btn.disabled = false;
        console.error(err);
        showToast('Error de red al enviar la invitación.', 'error');
    }
}

async function eliminarMiembro(id, nombre) {
    if (!confirm(`¿Remover a "${nombre}" del equipo?`)) {
        return;
    }

    try {
        const res = await fetch('api.php?action=eliminar_miembro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.success) {
            showToast(data.message || 'Miembro removido.', 'success');
            loadSettings();
        } else {
            showToast(data.message || 'No se pudo eliminar.', 'error');
        }
    } catch (err) {
        showToast('Error de conexión.', 'error');
    }
}

async function toggleEstadoMiembro(id, currentEstado) {
    const nuevoEstado = currentEstado === 'activo' ? 'pendiente' : 'activo';
    try {
        const res = await fetch('api.php?action=cambiar_estado_miembro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, estado: nuevoEstado })
        });
        const data = await res.json();
        if (data.success) {
            showToast(`Estado cambiado a ${nuevoEstado}.`, 'success');
            loadSettings();
        }
    } catch (err) { }
}

async function handleSaveEmpresaSettings(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-save-empresa');
    if (btn) btn.disabled = true;

    const form = e.target;
    const formData = new FormData(form);

    const payload = {
        company: formData.get('company'),
        fullname: formData.get('fullname'),
        email: formData.get('email'),
        rfc: formData.get('rfc'),
        telefono: formData.get('telefono'),
        moneda: formData.get('moneda')
    };

    try {
        const res = await fetch('api.php?action=save_empresa_settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (btn) btn.disabled = false;

        if (data.success) {
            showToast(data.message || 'Configuración guardada exitosamente.', 'success');
            if (payload.fullname) {
                const displayNameEl = document.getElementById('user-display-name');
                if (displayNameEl) displayNameEl.textContent = payload.fullname;
                localStorage.setItem('nucleo_fullname', payload.fullname);
            }
        } else {
            showToast(data.message || 'Error al guardar configuración.', 'error');
        }
    } catch (err) {
        if (btn) btn.disabled = false;
        showToast('Error al conectar con el servidor.', 'error');
    }
}


/* ==========================================================================
   8. CALENDARIO Y TAREAS (CALENDAR, RECORDATORIOS DE PAGO Y RENOVACIONES)
   ========================================================================== */

function populateClientesCalendarSelect(clientes) {
    if (!clientes) return;

    // Selector en barra de filtro del calendario
    const calFilterCli = document.getElementById('cal-filter-cliente');
    if (calFilterCli) {
        const currentVal = calFilterCli.value;
        let opts = '<option value="todos">Todos los Contratantes</option>';
        clientes.forEach(c => {
            opts += `<option value="${c.id}">${escapeHtml(c.nombre)}</option>`;
        });
        calFilterCli.innerHTML = opts;
        if (currentVal) calFilterCli.value = currentVal;
    }

    // Selector dentro del modal de crear tarea
    const tareaCli = document.getElementById('tarea-cliente-id');
    if (tareaCli) {
        let opts = '<option value="">-- Sin vincular a cliente específico --</option>';
        clientes.forEach(c => {
            opts += `<option value="${c.id}">${escapeHtml(c.nombre)}</option>`;
        });
        tareaCli.innerHTML = opts;
    }
}

async function loadCalendarEvents() {
    const mes = AppState.calMonth;
    const anio = AppState.calYear;
    const clienteId = document.getElementById('cal-filter-cliente')?.value || 'todos';

    try {
        const res = await fetch(`api.php?action=get_calendario_eventos&mes=${mes}&anio=${anio}&cliente_id=${clienteId}`);
        const data = await res.json();

        if (data.success) {
            // Los recordatorios de cobranza y renovaciones se generan automáticamente desde las pólizas/recibos.
            const eventos = [];
            (data.tareas || []).forEach(t => eventos.push({
                ...t, tipo: 'tarea', completada: Number(t.completada) === 1 ? 1 : 0
            }));
            (data.recordatorios_cobranza || []).forEach(r => eventos.push({
                ...r,
                id: r.recibo_id,
                tipo: r.tipo === 'pago_dia_vencimiento' ? 'pago_hoy' : 'aviso_pago_7d',
                monto: parseFloat(r.monto) || 0
            }));
            (data.renovaciones || []).forEach(r => eventos.push({
                ...r,
                id: r.poliza_id,
                tipo: 'renovacion_30d',
                es_fin: r.tipo === 'fin_vigencia_poliza',
                vigencia_fin: r.vigencia_hasta
            }));
            AppState.calEvents = eventos;
            renderCalendarGrid();
            if (AppState.calSelectedDay) {
                renderCalendarDayDetails(AppState.calSelectedDay);
            }
        } else {
            showToast('No se pudieron cargar los eventos del calendario.', 'error');
        }
    } catch (err) {
        console.error('Error al cargar calendario:', err);
    }
}

function renderCalendarGrid() {
    const grid = document.getElementById('cal-days-grid');
    const labelEl = document.getElementById('cal-current-month-label');
    if (!grid) return;

    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    if (labelEl) {
        labelEl.textContent = `${meses[AppState.calMonth - 1]} ${AppState.calYear}`;
    }

    const tipoFiltro = document.getElementById('cal-filter-tipo')?.value || 'todos';

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const daysInMonth = new Date(AppState.calYear, AppState.calMonth, 0).getDate();
    const firstDay = new Date(AppState.calYear, AppState.calMonth - 1, 1).getDay();
    const firstDayIndex = (firstDay + 6) % 7; // Lunes = 0, Domingo = 6
    const prevDays = new Date(AppState.calYear, AppState.calMonth - 1, 0).getDate();

    let html = '';

    // Días del mes anterior (padding)
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const dayNum = prevDays - i;
        html += `
            <div class="cal-day-cell other-month">
                <div class="cal-day-header">
                    <span class="cal-day-num">${dayNum}</span>
                </div>
            </div>
        `;
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${AppState.calYear}-${String(AppState.calMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = (dateStr === todayStr);
        const isSelected = (dateStr === AppState.calSelectedDay);

        let dayEvents = AppState.calEvents.filter(ev => ev.fecha === dateStr);
        if (tipoFiltro === 'tareas') {
            dayEvents = dayEvents.filter(ev => ev.tipo === 'tarea');
        } else if (tipoFiltro === 'cobranza') {
            dayEvents = dayEvents.filter(ev => ev.tipo === 'aviso_pago_7d' || ev.tipo === 'pago_hoy');
        } else if (tipoFiltro === 'renovaciones') {
            dayEvents = dayEvents.filter(ev => ev.tipo === 'renovacion_30d');
        }

        const visibleEvents = dayEvents.slice(0, 3);
        const extraCount = dayEvents.length - visibleEvents.length;

        let pillsHtml = '';
        visibleEvents.forEach(ev => {
            if (ev.tipo === 'tarea') {
                const compClass = ev.completada ? 'completed' : '';
                const timeStr = ev.hora ? `${ev.hora.substring(0, 5)} ` : '';
                pillsHtml += `<div class="cal-event-pill badge-cal-tarea ${compClass}" title="${escapeHtml(ev.titulo)}">${timeStr}${escapeHtml(ev.titulo)}</div>`;
            } else if (ev.tipo === 'aviso_pago_7d') {
                pillsHtml += `<div class="cal-event-pill badge-cal-aviso" title="Aviso pago (1 sem.): ${currencyFormatter.format(ev.monto)} - ${escapeHtml(ev.cliente_nombre)}">Aviso: ${currencyFormatter.format(ev.monto)}</div>`;
            } else if (ev.tipo === 'pago_hoy') {
                pillsHtml += `<div class="cal-event-pill badge-cal-pago" title="¡Día de pago!: ${currencyFormatter.format(ev.monto)} - ${escapeHtml(ev.cliente_nombre)}">Pago: ${currencyFormatter.format(ev.monto)}</div>`;
            } else if (ev.tipo === 'renovacion_30d') {
                pillsHtml += `<div class="cal-event-pill badge-cal-renovacion" title="Renovación (1 mes): Póliza ${escapeHtml(ev.numero_poliza)}">Renov: ${escapeHtml(ev.numero_poliza)}</div>`;
            }
        });

        if (extraCount > 0) {
            pillsHtml += `<div class="cal-more-events">+${extraCount} más</div>`;
        }

        const cellClasses = ['cal-day-cell'];
        if (isToday) cellClasses.push('today');
        if (isSelected) cellClasses.push('selected');

        html += `
            <div class="${cellClasses.join(' ')}" onclick="selectCalendarDay('${dateStr}')">
                <div class="cal-day-header">
                    <span class="cal-day-num">${day}</span>
                </div>
                <div class="cal-day-events">
                    ${pillsHtml}
                </div>
            </div>
        `;
    }

    // Días del próximo mes (padding para completar filas de 7)
    const totalCells = firstDayIndex + daysInMonth;
    const remaining = (7 - (totalCells % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
        html += `
            <div class="cal-day-cell other-month">
                <div class="cal-day-header">
                    <span class="cal-day-num">${d}</span>
                </div>
            </div>
        `;
    }

    grid.innerHTML = html;
}

function selectCalendarDay(dateStr) {
    AppState.calSelectedDay = dateStr;
    renderCalendarGrid();
    renderCalendarDayDetails(dateStr);
}

function renderCalendarDayDetails(dateStr) {
    const panel = document.getElementById('cal-day-details');
    const titleEl = document.getElementById('cal-selected-day-title');
    const listEl = document.getElementById('cal-day-events-list');
    if (!panel || !listEl) return;

    panel.style.display = 'block';
    if (titleEl) {
        titleEl.textContent = `Eventos del ${formatDateMX(dateStr)}`;
    }

    const events = AppState.calEvents.filter(ev => ev.fecha === dateStr);

    if (events.length === 0) {
        listEl.innerHTML = `
            <div style="padding: 1.5rem; text-align: center; color: #64748b; font-size: 0.875rem;">
                No hay tareas ni recordatorios para esta fecha.
                <div style="margin-top: 10px;">
                    <button type="button" class="btn-clean btn-clean-primary" onclick="openModalNuevaTarea('${dateStr}')">
                        + Agregar Tarea para este día
                    </button>
                </div>
            </div>
        `;
        return;
    }

    let itemsHtml = `
        <div style="display: flex; justify-content: flex-end; margin-bottom: 0.75rem;">
            <button type="button" class="btn-clean btn-clean-primary" onclick="openModalNuevaTarea('${dateStr}')">
                + Agregar Tarea para este día
            </button>
        </div>
    `;

    itemsHtml += events.map(ev => {
        if (ev.tipo === 'tarea') {
            const comp = ev.completada == 1;
            return `
                <div class="cal-day-event-card">
                    <div style="display: flex; align-items: flex-start; gap: 12px; flex: 1;">
                        <input type="checkbox" ${comp ? 'checked' : ''} onchange="toggleTarea(${ev.id})" style="margin-top: 3px; accent-color: #0f172a; cursor: pointer; width: 16px; height: 16px;">
                        <div>
                            <div style="font-weight: 600; font-size: 0.9rem; color: #0f172a; ${comp ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                                ${escapeHtml(ev.titulo)}
                            </div>
                            <div style="font-size: 0.775rem; color: #64748b; margin-top: 2px;">
                                ${ev.cliente_nombre ? `Contratante: <strong>${escapeHtml(ev.cliente_nombre)}</strong> · ` : ''}
                                ${ev.hora ? `Hora: ${ev.hora.substring(0, 5)}` : 'Sin hora fija'}
                            </div>
                            ${ev.notas ? `<div style="font-size: 0.75rem; color: #475569; margin-top: 4px; background: #f8fafc; padding: 4px 8px; border-radius: 4px;">${escapeHtml(ev.notas)}</div>` : ''}
                        </div>
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <button type="button" class="btn-clean" onclick="openModalEditarTarea(${ev.id})">Editar</button>
                        <button type="button" class="btn-clean btn-clean-danger" onclick="deleteTarea(${ev.id})">Eliminar</button>
                    </div>
                </div>
            `;
        } else if (ev.tipo === 'aviso_pago_7d' || ev.tipo === 'pago_hoy') {
            const isHoy = ev.tipo === 'pago_hoy';
            const cleanWa = cleanPhoneForWhatsApp(ev.whatsapp || ev.telefono);
            const msgWa = encodeURIComponent(`Hola ${ev.cliente_nombre}, le contactamos de Núcleo Seguros para recordarle que el recibo de su póliza ${ev.numero_poliza} (${ev.aseguradora}) por un monto de ${currencyFormatter.format(ev.monto)} tiene fecha de vencimiento ${formatDateMX(ev.fecha_vencimiento)}. Por favor realice su pago para mantener su cobertura vigente.`);
            const wspLink = cleanWa ? `https://wa.me/${cleanWa}?text=${msgWa}` : '#';

            return `
                <div class="cal-day-event-card" style="border-left: 4px solid ${isHoy ? '#ef4444' : '#f59e0b'};">
                    <div>
                        <span class="badge-status ${isHoy ? 'badge-vencida' : 'badge-pendiente'}" style="margin-bottom: 4px; display: inline-block;">
                            ${isHoy ? '¡Día de Pago!' : 'Aviso de Pago (1 semana antes)'}
                        </span>
                        <div style="font-weight: 600; font-size: 0.9rem; color: #0f172a;">
                            ${escapeHtml(ev.cliente_nombre)} · ${currencyFormatter.format(ev.monto)}
                        </div>
                        <div style="font-size: 0.775rem; color: #64748b; margin-top: 2px;">
                            Póliza ${escapeHtml(ev.numero_poliza)} · ${escapeHtml(ev.aseguradora)} · Recibo #${escapeHtml(ev.numero_recibo)}
                        </div>
                    </div>
                    <div style="display: flex; gap: 6px;">
                        ${cleanWa ? `<a href="${wspLink}" target="_blank" class="btn-clean">WhatsApp</a>` : ''}
                        <button type="button" class="btn-clean btn-clean-primary" onclick="abrirMarcarPago(${ev.id}, '${escapeHtml(ev.numero_recibo)}', '${escapeHtml(ev.cliente_nombre)}', ${ev.monto}, 'Póliza: ${escapeHtml(ev.numero_poliza)}')">
                            Cobrar
                        </button>
                    </div>
                </div>
            `;
        } else if (ev.tipo === 'renovacion_30d') {
            return `
                <div class="cal-day-event-card" style="border-left: 4px solid #10b981;">
                    <div>
                        <span class="badge-status badge-vigente" style="margin-bottom: 4px; display: inline-block;">
                            ${ev.es_fin ? 'Vence la póliza hoy' : 'Aviso de Renovación (1 mes antes)'}
                        </span>
                        <div style="font-weight: 600; font-size: 0.9rem; color: #0f172a;">
                            ${escapeHtml(ev.cliente_nombre)} · Póliza ${escapeHtml(ev.numero_poliza)}
                        </div>
                        <div style="font-size: 0.775rem; color: #64748b; margin-top: 2px;">
                            Aseguradora: ${escapeHtml(ev.aseguradora)} · Ramo: ${escapeHtml(ev.ramo)} · Fin de vigencia: ${formatDateMX(ev.vigencia_fin)}
                        </div>
                    </div>
                    <button type="button" class="btn-clean btn-clean-primary" onclick="switchView('polizas'); verDetallePoliza(${ev.id})">
                        Ver Póliza
                    </button>
                </div>
            `;
        }
    }).join('');

    listEl.innerHTML = itemsHtml;
}

function closeCalendarDayDetails() {
    AppState.calSelectedDay = null;
    const panel = document.getElementById('cal-day-details');
    if (panel) panel.style.display = 'none';
    renderCalendarGrid();
}

function prevCalendarMonth() {
    if (AppState.calMonth === 1) {
        AppState.calMonth = 12;
        AppState.calYear--;
    } else {
        AppState.calMonth--;
    }
    loadCalendarEvents();
}

function nextCalendarMonth() {
    if (AppState.calMonth === 12) {
        AppState.calMonth = 1;
        AppState.calYear++;
    } else {
        AppState.calMonth++;
    }
    loadCalendarEvents();
}

function goToCurrentCalendarMonth() {
    const now = new Date();
    AppState.calYear = now.getFullYear();
    AppState.calMonth = now.getMonth() + 1;
    loadCalendarEvents();
}

function filterCalendarDisplay() {
    renderCalendarGrid();
    if (AppState.calSelectedDay) {
        renderCalendarDayDetails(AppState.calSelectedDay);
    }
}

function openModalNuevaTarea(preselectDate = null) {
    const form = document.getElementById('form-tarea');
    if (form) form.reset();

    const idEl = document.getElementById('tarea-id');
    if (idEl) idEl.value = '';

    const titleModal = document.getElementById('modal-tarea-title');
    if (titleModal) titleModal.textContent = 'Nueva Tarea';

    const fechaEl = document.getElementById('tarea-fecha');
    if (fechaEl) {
        if (preselectDate) {
            fechaEl.value = preselectDate;
        } else {
            const now = new Date();
            fechaEl.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        }
    }

    populateClientesCalendarSelect(AppState.clientes);
    openModal('modal-tarea');
}

function openModalEditarTarea(id) {
    const tarea = AppState.calEvents.find(ev => ev.tipo === 'tarea' && ev.id == id);
    if (!tarea) return;

    const idEl = document.getElementById('tarea-id');
    const titleEl = document.getElementById('tarea-titulo');
    const cliEl = document.getElementById('tarea-cliente-id');
    const fechaEl = document.getElementById('tarea-fecha');
    const horaEl = document.getElementById('tarea-hora');
    const notasEl = document.getElementById('tarea-notas');
    const titleModal = document.getElementById('modal-tarea-title');

    if (titleModal) titleModal.textContent = 'Editar Tarea';
    if (idEl) idEl.value = tarea.id;
    if (titleEl) titleEl.value = tarea.titulo || '';
    if (cliEl) cliEl.value = tarea.cliente_id || '';
    if (fechaEl) fechaEl.value = tarea.fecha || '';
    if (horaEl) horaEl.value = tarea.hora ? tarea.hora.substring(0, 5) : '';
    if (notasEl) notasEl.value = tarea.notas || '';

    openModal('modal-tarea');
}

async function handleSaveTarea(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-save-tarea');
    if (btn) btn.disabled = true;

    const form = e.target;
    const formData = new FormData(form);

    const payload = {
        id: formData.get('id') || null,
        titulo: formData.get('titulo'),
        cliente_id: formData.get('cliente_id') || null,
        fecha: formData.get('fecha'),
        hora: formData.get('hora') || null,
        notas: formData.get('notas') || null
    };

    try {
        const res = await fetch('api.php?action=save_tarea', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (btn) btn.disabled = false;

        if (data.success) {
            closeModal('modal-tarea');
            showToast(data.message || 'Tarea guardada con éxito.', 'success');
            loadCalendarEvents();
        } else {
            showToast(data.message || 'Error al guardar la tarea.', 'error');
        }
    } catch (err) {
        if (btn) btn.disabled = false;
        console.error(err);
        showToast('Error al conectar con el servidor.', 'error');
    }
}

async function toggleTarea(id) {
    try {
        const res = await fetch('api.php?action=toggle_tarea', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.success) {
            loadCalendarEvents();
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteTarea(id) {
    if (!confirm('¿Eliminar esta tarea del calendario?')) return;

    try {
        const res = await fetch('api.php?action=delete_tarea', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.success) {
            showToast(data.message || 'Tarea eliminada.', 'success');
            loadCalendarEvents();
        } else {
            showToast(data.message || 'Error al eliminar tarea.', 'error');
        }
    } catch (err) {
        showToast('Error de conexión.', 'error');
    }
}

/* ==========================================================================
   9. EXPORTACIÓN A EXCEL (CSV) Y UTILIDADES
   ========================================================================== */

function exportarPolizasCSV() {
    if (!AppState.polizas || AppState.polizas.length === 0) {
        showToast('No hay pólizas para exportar.', 'info');
        return;
    }
    const headers = ['No. Poliza', 'Contratante', 'Aseguradora', 'Ramo', 'Vigencia Desde', 'Vigencia Hasta', 'Prima Neta', 'IVA', 'Prima Total', 'Moneda', 'Periodicidad', 'Forma Pago', 'Estatus'];
    const rows = AppState.polizas.map(p => [
        `"${(p.numero_poliza || '').replace(/"/g, '""')}"`,
        `"${(p.cliente_nombre || '').replace(/"/g, '""')}"`,
        `"${(p.aseguradora || '').replace(/"/g, '""')}"`,
        `"${(p.ramo || '').replace(/"/g, '""')}"`,
        `"${p.vigencia_desde || ''}"`,
        `"${p.vigencia_hasta || ''}"`,
        parseFloat(p.prima_neta || 0).toFixed(2),
        parseFloat(p.iva || 0).toFixed(2),
        parseFloat(p.prima_total || 0).toFixed(2),
        `"${p.moneda || 'MXN'}"`,
        `"${p.periodicidad || 'Anual'}"`,
        `"${(p.forma_pago || '').replace(/"/g, '""')}"`,
        `"${p.estado_poliza || 'activa'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Polizas_Nucleo_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Reporte de pólizas exportado correctamente.', 'success');
}

function exportarCobranzaCSV() {
    if (!AppState.cobranzas || AppState.cobranzas.length === 0) {
        showToast('No hay recibos de cobranza para exportar.', 'info');
        return;
    }
    const headers = ['No. Recibo', 'No. Poliza', 'Aseguradora', 'Contratante', 'Monto', 'Fecha Vencimiento', 'Estado', 'Fecha Pago', 'Metodo Pago', 'Referencia'];
    const rows = AppState.cobranzas.map(c => [
        `"${(c.numero_recibo || '').replace(/"/g, '""')}"`,
        `"${(c.numero_poliza || '').replace(/"/g, '""')}"`,
        `"${(c.aseguradora || '').replace(/"/g, '""')}"`,
        `"${(c.cliente_nombre || '').replace(/"/g, '""')}"`,
        parseFloat(c.monto || 0).toFixed(2),
        `"${c.fecha_vencimiento || ''}"`,
        `"${c.estado || 'pendiente'}"`,
        `"${c.fecha_pago || ''}"`,
        `"${(c.metodo_pago || '').replace(/"/g, '""')}"`,
        `"${(c.referencia_pago || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cobranza_Nucleo_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Reporte de cobranza exportado correctamente.', 'success');
}

function exportarClientesCSV() {
    if (!AppState.clientes || AppState.clientes.length === 0) {
        showToast('No hay clientes para exportar.', 'info');
        return;
    }
    const headers = ['Nombre / Razon Social', 'Tipo Persona', 'RFC', 'CURP', 'Email', 'Telefono', 'WhatsApp', 'Direccion', 'Total Polizas', 'Polizas Vigentes', 'Saldo Pendiente'];
    const rows = AppState.clientes.map(c => [
        `"${(c.nombre || '').replace(/"/g, '""')}"`,
        `"${c.tipo_persona === 'moral' ? 'Moral' : 'Fisica'}"`,
        `"${(c.rfc || '').replace(/"/g, '""')}"`,
        `"${(c.curp || '').replace(/"/g, '""')}"`,
        `"${(c.email || '').replace(/"/g, '""')}"`,
        `"${(c.telefono || '').replace(/"/g, '""')}"`,
        `"${(c.whatsapp || '').replace(/"/g, '""')}"`,
        `"${(c.direccion || '').replace(/"/g, '""')}"`,
        parseInt(c.total_polizas || 0, 10),
        parseInt(c.polizas_activas || 0, 10),
        parseFloat(c.saldo_pendiente || 0).toFixed(2)
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Clientes_Nucleo_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Directorio de clientes exportado correctamente.', 'success');
}

function verPolizasDeCliente(clienteNombre) {
    switchView('polizas');
    const input = document.getElementById('polizas-search');
    if (input) {
        input.value = clienteNombre;
        loadPolizas();
    }
}

/* ==========================================================================
   10. MÓDULO 8: GESTIÓN DE AGENTES ENCARGADOS DE PÓLIZAS
   ========================================================================== */

let _agenteFromPolicyModal = false;

async function loadAgentes() {
    const container = document.getElementById('agentes-grid-container');
    const counter = document.getElementById('agentes-counter');
    if (!container) return;

    try {
        const res = await fetch('api.php?action=get_agentes');
        const data = await res.json();
        if (data.success && data.agentes) {
            AppState.agentes = data.agentes;
            if (counter) counter.textContent = `${data.agentes.length} agentes registrados`;
            renderAgentesGrid(data.agentes);
            populateAgentesSelect(data.agentes);
        } else {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #dc2626;">${escapeHtml(data.message || 'Error al cargar agentes.')}</div>`;
        }
    } catch (err) {
        console.error('Error al cargar agentes:', err);
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #dc2626;">Error de conexión al cargar agentes.</div>`;
    }
}

function renderAgentesGrid(agentes) {
    const container = document.getElementById('agentes-grid-container');
    if (!container) return;

    if (!agentes || agentes.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #94a3b8;">
                No hay agentes registrados. Haz clic en "+ Nuevo Agente" para agregar uno.
            </div>
        `;
        return;
    }

    container.innerHTML = agentes.map(a => {
        const initial = (a.fullname || 'A').charAt(0).toUpperCase();
        const cleanWa = cleanPhoneForWhatsApp(a.telefono);
        const wspLink = cleanWa ? `https://wa.me/${cleanWa}?text=${encodeURIComponent(`Hola ${a.fullname}, te contacto de la administración de Núcleo Seguros.`)}` : '';
        const phoneLink = a.telefono ? `tel:${a.telefono.replace(/[^0-9]/g, '')}` : '';
        const mailLink = a.email ? `mailto:${a.email}` : '';

        return `
            <div class="client-card">
                <div>
                    <div class="client-card-header">
                        <div class="client-avatar-name">
                            <div class="client-avatar" style="background:#192918; color:#fff5de;">${initial}</div>
                            <div class="client-name-box">
                                <h4>${escapeHtml(a.fullname)}</h4>
                                <span class="badge-persona" style="background: #e2e8f0; color: #334155;">${escapeHtml(a.company || 'Agencia')}</span>
                            </div>
                        </div>
                    </div>

                    <div class="client-info-list">
                        ${a.email ? `
                            <div class="client-info-item">
                                <span>Correo: <strong>${escapeHtml(a.email)}</strong></span>
                            </div>
                        ` : ''}
                        ${a.telefono ? `
                            <div class="client-info-item">
                                <span>Teléfono: <strong>${escapeHtml(a.telefono)}</strong></span>
                            </div>
                        ` : ''}
                        ${a.rfc ? `
                            <div class="client-info-item">
                                <span>RFC: <strong>${escapeHtml(a.rfc)}</strong></span>
                            </div>
                        ` : ''}
                    </div>

                    <div class="client-stats-bar" style="cursor: pointer;" onclick="verPolizasDeAgente(${a.id})" title="Ver pólizas de este agente">
                        <div class="client-stat">
                            <div class="client-stat-value">${a.total_polizas || 0}</div>
                            <div class="client-stat-label">Pólizas</div>
                        </div>
                        <div class="client-stat">
                            <div class="client-stat-value" style="color: #059669;">${a.polizas_activas || 0}</div>
                            <div class="client-stat-label">Vigentes</div>
                        </div>
                        <div class="client-stat">
                            <div class="client-stat-value" style="font-size: 0.85rem;">${currencyFormatter.format(a.total_vendido || 0)}</div>
                            <div class="client-stat-label">Vendido</div>
                        </div>
                    </div>
                </div>

                <div class="client-card-actions">
                    <div style="display: flex; gap: 6px;">
                        ${cleanWa ? `
                            <a href="${wspLink}" target="_blank" class="btn-action btn-wsp" title="WhatsApp">${SVG_ICONS.whatsapp}</a>
                        ` : ''}
                        ${phoneLink ? `
                            <a href="${phoneLink}" class="btn-action btn-call" title="Llamar">${SVG_ICONS.phone}</a>
                        ` : ''}
                        ${mailLink ? `
                            <a href="${mailLink}" class="btn-action btn-mail" title="Correo">${SVG_ICONS.envelope}</a>
                        ` : ''}
                    </div>

                    <div style="display: flex; gap: 6px;">
                        <button class="btn-clean" style="padding: 2px 8px; font-size: 0.75rem; font-weight: 600;" onclick="verPolizasDeAgente(${a.id})" title="Ver pólizas de este agente">
                            Ver Pólizas
                        </button>
                        <button class="btn-action btn-edit" onclick="openModalEditarAgente(${a.id})" title="Editar Agente">${SVG_ICONS.edit}</button>
                        ${parseInt(a.id, 10) !== 1 ? `
                            <button class="btn-action btn-del" onclick="eliminarAgente(${a.id}, '${escapeHtml(a.fullname)}')" title="Eliminar Agente">${SVG_ICONS.trash}</button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterAgentesGrid() {
    const term = (document.getElementById('agentes-search')?.value || '').toLowerCase().trim();
    if (!term) {
        renderAgentesGrid(AppState.agentes);
        return;
    }
    const filtered = (AppState.agentes || []).filter(a => {
        return (a.fullname || '').toLowerCase().includes(term) ||
            (a.company || '').toLowerCase().includes(term) ||
            (a.email || '').toLowerCase().includes(term) ||
            (a.telefono || '').toLowerCase().includes(term) ||
            (a.rfc || '').toLowerCase().includes(term);
    });
    renderAgentesGrid(filtered);
}

function verPolizasDeAgente(agenteId) {
    switchView('polizas');
    const filterSelect = document.getElementById('polizas-filter-agente');
    if (filterSelect) {
        filterSelect.value = agenteId;
        loadPolizas();
    }
}

function openModalNuevoAgente(fromPolicy = false) {
    _agenteFromPolicyModal = fromPolicy;
    const form = document.getElementById('form-agente');
    if (form) form.reset();
    document.getElementById('agente-id').value = '';
    setElemText('modal-agente-title', 'Registrar Nuevo Agente');
    openModal('modal-agente');
}

function openModalEditarAgente(id) {
    _agenteFromPolicyModal = false;
    const agente = (AppState.agentes || []).find(a => parseInt(a.id, 10) === parseInt(id, 10));
    if (!agente) return;

    document.getElementById('agente-id').value = agente.id;
    document.getElementById('agente-fullname').value = agente.fullname || '';
    document.getElementById('agente-company').value = agente.company || '';
    document.getElementById('agente-email').value = agente.email || '';
    document.getElementById('agente-telefono').value = agente.telefono || '';
    document.getElementById('agente-rfc').value = agente.rfc || '';
    document.getElementById('agente-password').value = '';
    setElemText('modal-agente-title', 'Editar Agente');
    openModal('modal-agente');
}

async function handleSaveAgente(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-save-agente');
    if (btn) btn.disabled = true;

    const form = document.getElementById('form-agente');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch('api.php?action=save_agente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
            showToast(result.message, 'success');
            closeModal('modal-agente');
            await loadAgentes();

            if (_agenteFromPolicyModal) {
                const selectAg = document.getElementById('poliza-agente-id');
                if (selectAg && AppState.agentes.length > 0) {
                    const match = AppState.agentes.find(a => a.email === data.email);
                    if (match) selectAg.value = match.id;
                }
            }
        } else {
            showToast(result.message || 'Error al guardar agente.', 'error');
        }
    } catch (err) {
        console.error('Error al guardar agente:', err);
        showToast('Error de conexión al guardar agente.', 'error');
    } finally {
        if (btn) btn.disabled = false;
    }
}

async function eliminarAgente(id, nombre) {
    if (!confirm(`¿Estás seguro de que deseas eliminar al agente "${nombre}"? Esta acción no se puede deshacer.`)) {
        return;
    }

    try {
        const res = await fetch('api.php?action=delete_agente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const result = await res.json();
        if (result.success) {
            showToast(result.message, 'success');
            await loadAgentes();
        } else {
            showToast(result.message || 'No se pudo eliminar el agente.', 'error');
        }
    } catch (err) {
        console.error('Error al eliminar agente:', err);
        showToast('Error de conexión al eliminar agente.', 'error');
    }
}

/* ==========================================================================
   11. MÓDULO 9: GESTIÓN DE COMPAÑÍAS ASEGURADORAS
   ========================================================================== */

let _asegFromPolicyModal = false;

async function loadAseguradoras() {
    const container = document.getElementById('aseguradoras-grid-container');
    const counter = document.getElementById('aseguradoras-counter');
    if (!container) return;

    try {
        const res = await fetch('api.php?action=get_aseguradoras');
        const data = await res.json();
        if (data.success && data.aseguradoras) {
            AppState.aseguradoras = data.aseguradoras;
            if (counter) counter.textContent = `${data.aseguradoras.length} aseguradoras registradas`;
            renderAseguradorasGrid(data.aseguradoras);
            populateAseguradorasSelect(data.aseguradoras);
        } else {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #dc2626;">${escapeHtml(data.message || 'Error al cargar aseguradoras.')}</div>`;
        }
    } catch (err) {
        console.error('Error al cargar aseguradoras:', err);
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #dc2626;">Error de conexión al cargar aseguradoras.</div>`;
    }
}

function renderAseguradorasGrid(aseguradoras) {
    const container = document.getElementById('aseguradoras-grid-container');
    if (!container) return;

    if (!aseguradoras || aseguradoras.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #94a3b8;">
                No hay aseguradoras registradas. Haz clic en "+ Nueva Aseguradora" para agregar una.
            </div>
        `;
        return;
    }

    container.innerHTML = aseguradoras.map(a => {
        const initial = (a.nombre || 'S').charAt(0).toUpperCase();
        const dias = parseInt(a.dias_pago, 10) || 30;

        return `
            <div class="client-card">
                <div>
                    <div class="client-card-header">
                        <div class="client-avatar-name">
                            <div class="client-avatar" style="background:#192918; color:#fff5de;">${initial}</div>
                            <div class="client-name-box">
                                <h4>${escapeHtml(a.nombre)}</h4>
                                <span class="badge-persona" style="background: #e2e8f0; color: #1e293b; font-weight: 700;">${dias} días de pago</span>
                            </div>
                        </div>
                    </div>

                    <div class="client-stats-bar" style="cursor: pointer; margin-top: 10px;" onclick="verPolizasDeAseguradora('${escapeHtml(a.nombre)}')" title="Ver pólizas de esta aseguradora">
                        <div class="client-stat">
                            <div class="client-stat-value">${a.total_polizas || 0}</div>
                            <div class="client-stat-label">Pólizas</div>
                        </div>
                        <div class="client-stat">
                            <div class="client-stat-value" style="color: #059669;">${a.polizas_activas || 0}</div>
                            <div class="client-stat-label">Vigentes</div>
                        </div>
                    </div>
                </div>

                <div class="client-card-actions" style="margin-top: 10px; justify-content: flex-end; gap: 8px;">
                    <button class="btn-clean" style="padding: 4px 10px; font-size: 0.8rem; font-weight: 600;" onclick="verPolizasDeAseguradora('${escapeHtml(a.nombre)}')" title="Ver pólizas de esta aseguradora">
                        Ver Pólizas
                    </button>
                    <button class="btn-action btn-edit" onclick="openModalEditarAseguradora(${a.id})" title="Editar Aseguradora">${SVG_ICONS.edit}</button>
                    <button class="btn-action btn-del" onclick="eliminarAseguradora(${a.id}, '${escapeHtml(a.nombre)}')" title="Eliminar Aseguradora">${SVG_ICONS.trash}</button>
                </div>
            </div>
        `;
    }).join('');
}

function filterAseguradorasGrid() {
    const term = (document.getElementById('aseguradoras-search')?.value || '').toLowerCase().trim();
    if (!term) {
        renderAseguradorasGrid(AppState.aseguradoras);
        return;
    }
    const filtered = (AppState.aseguradoras || []).filter(a => {
        return (a.nombre || '').toLowerCase().includes(term);
    });
    renderAseguradorasGrid(filtered);
}

function verPolizasDeAseguradora(aseguradoraNombre) {
    switchView('polizas');
    const filterSelect = document.getElementById('polizas-filter-aseguradora');
    if (filterSelect) {
        filterSelect.value = aseguradoraNombre;
        loadPolizas();
    }
}

function openModalNuevaAseguradora(fromPolicy = false) {
    _asegFromPolicyModal = fromPolicy;
    const form = document.getElementById('form-aseguradora');
    if (form) form.reset();
    document.getElementById('aseguradora-id').value = '';
    const inputDias = document.getElementById('aseguradora-dias-pago');
    if (inputDias) inputDias.value = '30';
    setElemText('modal-aseguradora-title', 'Registrar Nueva Aseguradora');
    openModal('modal-aseguradora');
}

function openModalEditarAseguradora(id) {
    _asegFromPolicyModal = false;
    const aseg = (AppState.aseguradoras || []).find(a => parseInt(a.id, 10) === parseInt(id, 10));
    if (!aseg) return;

    document.getElementById('aseguradora-id').value = aseg.id;
    document.getElementById('aseguradora-nombre').value = aseg.nombre || '';
    document.getElementById('aseguradora-dias-pago').value = aseg.dias_pago || 30;
    setElemText('modal-aseguradora-title', 'Editar Aseguradora');
    openModal('modal-aseguradora');
}

async function handleSaveAseguradora(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-save-aseguradora');
    if (btn) btn.disabled = true;

    const form = document.getElementById('form-aseguradora');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch('api.php?action=save_aseguradora', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
            showToast(result.message, 'success');
            closeModal('modal-aseguradora');
            await loadAseguradoras();

            if (_asegFromPolicyModal) {
                const selectAseg = document.getElementById('poliza-aseguradora');
                if (selectAseg) {
                    selectAseg.value = data.nombre;
                }
            }
        } else {
            showToast(result.message || 'Error al guardar aseguradora.', 'error');
        }
    } catch (err) {
        console.error('Error al guardar aseguradora:', err);
        showToast('Error de conexión al guardar aseguradora.', 'error');
    } finally {
        if (btn) btn.disabled = false;
    }
}

async function eliminarAseguradora(id, nombre) {
    if (!confirm(`¿Estás seguro de que deseas eliminar la aseguradora "${nombre}" del catálogo?`)) {
        return;
    }

    try {
        const res = await fetch('api.php?action=delete_aseguradora', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const result = await res.json();
        if (result.success) {
            showToast(result.message, 'success');
            await loadAseguradoras();
        } else {
            showToast(result.message || 'No se pudo eliminar la aseguradora.', 'error');
        }
    } catch (err) {
        console.error('Error al eliminar aseguradora:', err);
        showToast('Error de conexión al eliminar aseguradora.', 'error');
    }
}

/* ==========================================================================
   11. MÓDULO: CONTROL DE TRÁMITES Y OPERACIONES (KANBAN & COMENTARIOS)
   ========================================================================== */

let _tramiteActualId = null;
let _tramiteTimeout = null;

function filterTramitesDebounce() {
    clearTimeout(_tramiteTimeout);
    _tramiteTimeout = setTimeout(() => {
        loadTramites();
    }, 300);
}

function filterTramitesKanban() {
    filterTramitesDebounce();
}

async function loadTramites() {
    const q = document.getElementById('tramites-search')?.value || '';
    const prioridad = document.getElementById('tramites-filter-prioridad')?.value || 'todas';
    const tipo = document.getElementById('tramites-filter-tipo')?.value || 'todos';

    const params = new URLSearchParams({
        action: 'get_tramites',
        q,
        prioridad,
        tipo_tramite: tipo
    });

    try {
        const res = await fetch(`api.php?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
            const list = data.tramites || [];
            const counts = data.counts || { total: list.length, pendiente: 0, proceso: 0, terminado: 0 };

            // Actualizar contadores
            setElemText('tramites-counter', `${counts.total} trámites registrados`);
            setElemText('kanban-count-pendiente', counts.pendiente || 0);
            setElemText('kanban-count-proceso', counts.proceso || 0);
            setElemText('kanban-count-terminado', counts.terminado || 0);

            // Filtrar por columnas
            const pendientes = list.filter(t => (t.estado || '').toLowerCase() === 'pendiente');
            const enProceso = list.filter(t => {
                const est = (t.estado || '').toLowerCase();
                return est === 'proceso' || est === 'en proceso';
            });
            const terminados = list.filter(t => (t.estado || '').toLowerCase() === 'terminado');

            renderKanbanColumn('kanban-col-pendiente', pendientes, 'pendiente');
            renderKanbanColumn('kanban-col-proceso', enProceso, 'proceso');
            renderKanbanColumn('kanban-col-terminado', terminados, 'terminado');
        } else {
            showToast(data.message || 'Error al cargar trámites.', 'error');
        }
    } catch (err) {
        console.error('Error al cargar trámites:', err);
        showToast('Error de conexión al obtener los trámites.', 'error');
    }
}

function renderKanbanColumn(containerId, items, colType) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!items || items.length === 0) {
        let msg = 'No hay trámites pendientes';
        if (colType === 'proceso') msg = 'No hay trámites en proceso actualmente';
        if (colType === 'terminado') msg = 'No hay trámites completados';

        container.innerHTML = `<div class="kanban-empty-hint">${msg}</div>`;
        return;
    }

    const html = items.map(t => renderTramiteCard(t)).join('');
    container.innerHTML = html;
}

function renderTramiteCard(t) {
    const safeTitle = escapeHtml(t.titulo || 'Sin título');
    const safeCliente = escapeHtml(t.cliente_nombre || 'Sin cliente asignado');
    const safeTipo = escapeHtml(t.tipo_tramite || 'Trámite');
    const prioridad = (t.prioridad || 'Media').toLowerCase();
    const prioridadClass = `prioridad-${prioridad}`;

    // Tag póliza
    let polizaHtml = '';
    if (t.numero_poliza || t.poliza_numero) {
        const numPol = escapeHtml(t.numero_poliza || t.poliza_numero);
        polizaHtml = `<span class="card-poliza-tag">Póliza: ${numPol}${t.aseguradora ? ' (' + escapeHtml(t.aseguradora) + ')' : ''}</span>`;
    }

    // Último comentario preview
    let commentPreviewHtml = '';
    if (t.ultimo_comentario) {
        const autor = typeof t.ultimo_comentario === 'object'
            ? escapeHtml(t.ultimo_comentario.autor_nombre || 'Colaborador')
            : escapeHtml(t.ultimo_comentario_autor || 'Colaborador');
        const text = typeof t.ultimo_comentario === 'object'
            ? escapeHtml(t.ultimo_comentario.comentario || '')
            : escapeHtml(t.ultimo_comentario || '');
        const snippet = text.length > 85 ? text.substring(0, 85) + '...' : text;
        commentPreviewHtml = `
            <div class="card-comment-preview" title="Última actualización por ${autor}">
                <strong>${autor}:</strong> ${snippet}
            </div>
        `;
    } else if (t.descripcion) {
        const desc = escapeHtml(t.descripcion);
        const snippet = desc.length > 85 ? desc.substring(0, 85) + '...' : desc;
        commentPreviewHtml = `
            <div class="card-comment-preview" style="border-left-color: #e2e8f0;">
                <em>${snippet}</em>
            </div>
        `;
    }

    // Botones de acción rápida de cambio de estado
    const rawEstado = (t.estado || 'pendiente').toLowerCase();
    const estado = (rawEstado === 'en proceso' || rawEstado === 'proceso') ? 'proceso' : rawEstado;
    let moveButtonsHtml = '';
    if (estado === 'pendiente') {
        moveButtonsHtml = `
            <button type="button" class="btn-move-step btn-move-proceso" onclick="cambiarEstadoTramite(${t.id}, 'proceso')" title="Iniciar gestión del trámite">
                Mover a Proceso
            </button>
            <button type="button" class="btn-move-step btn-move-terminado" onclick="cambiarEstadoTramite(${t.id}, 'terminado')" title="Marcar como resuelto">
                Terminar
            </button>
        `;
    } else if (estado === 'proceso') {
        moveButtonsHtml = `
            <button type="button" class="btn-move-step btn-move-pendiente" onclick="cambiarEstadoTramite(${t.id}, 'pendiente')" title="Regresar a pendientes">
                Regresar
            </button>
            <button type="button" class="btn-move-step btn-move-terminado" onclick="cambiarEstadoTramite(${t.id}, 'terminado')" title="Marcar como terminado">
                Marcar Terminado
            </button>
        `;
    } else {
        moveButtonsHtml = `
            <button type="button" class="btn-move-step btn-move-proceso" onclick="cambiarEstadoTramite(${t.id}, 'proceso')" title="Reabrir trámite para gestión">
                Reabrir en Proceso
            </button>
        `;
    }

    const numComentarios = parseInt(t.total_comentarios || t.num_comentarios || 0, 10);
    const commentLabel = numComentarios === 1 ? '1 nota' : `${numComentarios} notas`;

    return `
        <div class="kanban-card" id="tramite-card-${t.id}">
            <div class="card-meta-bar">
                <span class="badge-tipo-tramite">${safeTipo}</span>
                <span class="badge-prioridad ${prioridadClass}">${escapeHtml(t.prioridad || 'Media')}</span>
            </div>

            <h4 class="card-title" onclick="abrirDetalleTramite(${t.id})" title="Ver detalles y notas">${safeTitle}</h4>

            <div class="card-client-wrap">
                <span class="card-client-name">${safeCliente}</span>
                ${polizaHtml}
            </div>

            ${commentPreviewHtml}

            <div class="card-footer-actions">
                <button type="button" class="card-comments-trigger" onclick="abrirDetalleTramite(${t.id})">
                    <i class="fa-regular fa-comment-dots"></i> ${commentLabel}
                </button>
                <div class="quick-move-pills">
                    ${moveButtonsHtml}
                </div>
            </div>
        </div>
    `;
}

async function cambiarEstadoTramite(id, nuevoEstado, nota = '') {
    try {
        const res = await fetch('api.php?action=update_tramite_estado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, estado: nuevoEstado, nota })
        });
        const result = await res.json();
        if (result.success) {
            showToast(`Trámite actualizado a "${nuevoEstado}"`, 'success');
            await loadTramites();

            // Si el modal de detalle está abierto con este trámite, refrescar su vista
            if (_tramiteActualId === id) {
                await abrirDetalleTramite(id);
            }
        } else {
            showToast(result.message || 'No se pudo cambiar el estado.', 'error');
        }
    } catch (err) {
        console.error('Error al actualizar estado:', err);
        showToast('Error de conexión al cambiar estado.', 'error');
    }
}

async function abrirDetalleTramite(id) {
    _tramiteActualId = id;
    try {
        const res = await fetch(`api.php?action=get_tramite&id=${id}`);
        const data = await res.json();

        if (!data.success || !data.tramite) {
            showToast(data.message || 'No se encontró el trámite.', 'error');
            return;
        }

        const t = data.tramite;
        const comentarios = data.comentarios || [];

        // Encabezado y meta
        setElemText('detalle-tramite-titulo', t.titulo || 'Detalle del Trámite');
        setElemText('detalle-tramite-subtitulo', `Trámite #${t.id} - Registrado el ${formatFechaVisual(t.created_at)}`);

        // Badge de estado actual
        const badgeEstado = document.getElementById('detalle-tramite-badge-estado');
        if (badgeEstado) {
            const raw = (t.estado || 'pendiente').toLowerCase();
            const estLabel = (raw === 'proceso' || raw === 'en proceso') ? 'En Proceso' : (raw === 'terminado' ? 'Terminado' : 'Pendiente');
            badgeEstado.textContent = estLabel;
            badgeEstado.className = 'tramite-badge';
            if (raw === 'pendiente') badgeEstado.classList.add('prioridad-alta');
            else if (raw === 'proceso' || raw === 'en proceso') badgeEstado.classList.add('prioridad-media');
            else badgeEstado.classList.add('pill-terminado');
        }

        // Ficha técnica
        setElemText('detalle-tramite-cliente', t.cliente_nombre || 'Sin contratante');
        if (t.poliza_numero) {
            setElemText('detalle-tramite-poliza', `${t.poliza_numero}${t.aseguradora ? ' (' + t.aseguradora + ')' : ''}`);
        } else {
            setElemText('detalle-tramite-poliza', 'Sin póliza específica');
        }
        setElemText('detalle-tramite-tipo', t.tipo_tramite || 'Trámite');
        setElemText('detalle-tramite-prioridad', t.prioridad || 'Media');
        setElemText('detalle-tramite-autor', t.creador_nombre || 'Colaborador');
        setElemText('detalle-tramite-fecha-limite', t.fecha_limite ? formatFechaVisual(t.fecha_limite) : 'No definida');

        // Descripción inicial
        const descWrapper = document.getElementById('detalle-tramite-desc-wrapper');
        const descEl = document.getElementById('detalle-tramite-descripcion');
        if (t.descripcion && t.descripcion.trim()) {
            if (descWrapper) descWrapper.style.display = 'block';
            if (descEl) descEl.textContent = t.descripcion;
        } else {
            if (descWrapper) descWrapper.style.display = 'none';
        }

        // Contador de notas
        const countLabel = comentarios.length === 1 ? '1 nota registrada' : `${comentarios.length} notas registradas`;
        setElemText('detalle-tramite-count-comentarios', countLabel);

        // Renderizar lista de comentarios
        renderComentariosTimeline(comentarios);

        // Configurar form de nuevo comentario
        const inputHiddenId = document.getElementById('detalle-tramite-id');
        if (inputHiddenId) inputHiddenId.value = t.id;

        const inputNuevoComentario = document.getElementById('tramite-nuevo-comentario');
        if (inputNuevoComentario) inputNuevoComentario.value = '';

        openModal('modal-detalle-tramite');
    } catch (err) {
        console.error('Error al abrir detalle:', err);
        showToast('Error de conexión al cargar el trámite.', 'error');
    }
}

function renderComentariosTimeline(comentarios) {
    const container = document.getElementById('tramite-comentarios-lista');
    if (!container) return;

    if (!comentarios || comentarios.length === 0) {
        container.innerHTML = '<div class="no-comments-msg">Aún no hay comentarios en este trámite. Puedes escribir la primera actualización abajo.</div>';
        return;
    }

    const html = comentarios.map(c => {
        const safeAutor = escapeHtml(c.autor_nombre || 'Colaborador');
        const safeTexto = escapeHtml(c.comentario || '');
        const safeFecha = formatFechaHoraVisual(c.created_at);
        const isStatusChange = safeTexto.startsWith('Estado cambiado de');

        return `
            <div class="comment-bubble ${isStatusChange ? 'is-status-change' : ''}">
                <div class="comment-top">
                    <span class="comment-author-name">${safeAutor}</span>
                    <span class="comment-time">${safeFecha}</span>
                </div>
                <div class="comment-body">${safeTexto}</div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
    // Auto-scroll al final del timeline
    container.scrollTop = container.scrollHeight;
}

function cambiarEstadoDesdeDetalle(nuevoEstado) {
    if (!_tramiteActualId) return;
    const est = (nuevoEstado || '').toLowerCase();
    const cleanEstado = (est === 'en proceso' || est === 'proceso') ? 'proceso' : est;
    cambiarEstadoTramite(_tramiteActualId, cleanEstado);
}

async function handleAgregarComentarioTramite(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('detalle-tramite-id')?.value || _tramiteActualId;
    const input = document.getElementById('tramite-nuevo-comentario');
    const comentario = input ? input.value.trim() : '';

    if (!id || !comentario) return;

    const btn = document.getElementById('btn-add-comentario');
    if (btn) btn.disabled = true;

    try {
        const res = await fetch('api.php?action=add_tramite_comentario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tramite_id: id, comentario })
        });
        const result = await res.json();
        if (result.success) {
            showToast('Comentario agregado con éxito.', 'success');
            if (input) input.value = '';

            // Refrescar modal y kanban
            await abrirDetalleTramite(id);
            loadTramites();
        } else {
            showToast(result.message || 'No se pudo guardar el comentario.', 'error');
        }
    } catch (err) {
        console.error('Error al agregar comentario:', err);
        showToast('Error de conexión al guardar comentario.', 'error');
    } finally {
        if (btn) btn.disabled = false;
    }
}

async function asegurarCatalogosParaTramites() {
    // Si no tenemos clientes en cache, cargarlos
    if (!AppState.clientes || AppState.clientes.length === 0) {
        try {
            const res = await fetch('api.php?action=get_clientes');
            const data = await res.json();
            if (data.success) AppState.clientes = data.clientes || [];
        } catch (e) {
            console.error(e);
        }
    }

    // Si no tenemos pólizas en cache, cargarlas
    if (!AppState.polizas || AppState.polizas.length === 0) {
        try {
            const res = await fetch('api.php?action=get_polizas');
            const data = await res.json();
            if (data.success) AppState.polizas = data.polizas || [];
        } catch (e) {
            console.error(e);
        }
    }
}

async function openModalNuevoTramite(clienteId = null, polizaId = null) {
    await asegurarCatalogosParaTramites();

    const form = document.getElementById('form-tramite');
    if (form) form.reset();

    document.getElementById('tramite-id').value = '';
    setElemText('modal-tramite-title', 'Registrar Nuevo Trámite');

    // Poblar clientes en el select
    const selectCliente = document.getElementById('tramite-cliente-id');
    if (selectCliente) {
        selectCliente.innerHTML = '<option value="">-- Seleccionar Contratante --</option>' +
            (AppState.clientes || []).map(c => `
                <option value="${c.id}">${escapeHtml(c.nombre)}</option>
            `).join('');

        if (clienteId) {
            selectCliente.value = clienteId;
        }
    }

    // Poblar pólizas asociadas
    poblarPolizasParaTramite(clienteId, polizaId);

    openModal('modal-tramite');
}

function onTramiteClienteChange() {
    const selectCliente = document.getElementById('tramite-cliente-id');
    const clienteId = selectCliente ? selectCliente.value : null;
    poblarPolizasParaTramite(clienteId);
}

function poblarPolizasParaTramite(clienteId = null, polizaSeleccionada = null) {
    const selectPoliza = document.getElementById('tramite-poliza-id');
    if (!selectPoliza) return;

    let polizas = AppState.polizas || [];
    if (clienteId) {
        polizas = polizas.filter(p => String(p.cliente_id) === String(clienteId));
    }

    let options = '<option value="">(Sin póliza específica / En trámite general)</option>';
    polizas.forEach(p => {
        const num = escapeHtml(p.numero_poliza || 'S/N');
        const aseg = escapeHtml(p.aseguradora || '');
        const ramo = escapeHtml(p.ramo || '');
        options += `<option value="${p.id}">${num} - ${aseg} (${ramo})</option>`;
    });

    selectPoliza.innerHTML = options;
    if (polizaSeleccionada) {
        selectPoliza.value = polizaSeleccionada;
    }
}

async function openModalEditarTramite(id) {
    await asegurarCatalogosParaTramites();

    try {
        const res = await fetch(`api.php?action=get_tramite&id=${id}`);
        const data = await res.json();

        if (!data.success || !data.tramite) {
            showToast('No se encontró el trámite a editar.', 'error');
            return;
        }

        const t = data.tramite;

        // Poblar clientes
        const selectCliente = document.getElementById('tramite-cliente-id');
        if (selectCliente) {
            selectCliente.innerHTML = '<option value="">-- Seleccionar Contratante --</option>' +
                (AppState.clientes || []).map(c => `
                    <option value="${c.id}">${escapeHtml(c.nombre)}</option>
                `).join('');
            selectCliente.value = t.cliente_id || '';
        }

        // Poblar pólizas
        poblarPolizasParaTramite(t.cliente_id, t.poliza_id);

        // Llenar campos
        document.getElementById('tramite-id').value = t.id;
        document.getElementById('tramite-tipo').value = t.tipo_tramite || 'Endoso';
        document.getElementById('tramite-prioridad').value = t.prioridad || 'Media';
        document.getElementById('tramite-titulo').value = t.titulo || '';
        document.getElementById('tramite-estado').value = t.estado || 'Pendiente';
        document.getElementById('tramite-fecha-limite').value = t.fecha_limite ? t.fecha_limite.substring(0, 10) : '';
        document.getElementById('tramite-descripcion').value = t.descripcion || '';

        setElemText('modal-tramite-title', 'Editar Trámite');
        openModal('modal-tramite');
    } catch (err) {
        console.error('Error al abrir editor de trámite:', err);
        showToast('Error de conexión al cargar trámite.', 'error');
    }
}

function editarTramiteActual() {
    if (!_tramiteActualId) return;
    closeModal('modal-detalle-tramite');
    openModalEditarTramite(_tramiteActualId);
}

async function handleSaveTramite(e) {
    if (e) e.preventDefault();

    const form = document.getElementById('form-tramite');
    if (!form) return;

    const formData = new FormData(form);
    const data = {
        id: formData.get('id') || null,
        cliente_id: formData.get('cliente_id'),
        poliza_id: formData.get('poliza_id') || null,
        tipo_tramite: formData.get('tipo_tramite'),
        prioridad: formData.get('prioridad'),
        titulo: formData.get('titulo'),
        estado: formData.get('estado'),
        fecha_limite: formData.get('fecha_limite') || null,
        descripcion: formData.get('descripcion') || ''
    };

    if (!data.cliente_id) {
        showToast('Por favor selecciona un contratante.', 'warning');
        return;
    }
    if (!data.titulo || !data.titulo.trim()) {
        showToast('Por favor ingresa el título o asunto del trámite.', 'warning');
        return;
    }

    const btn = document.getElementById('btn-save-tramite');
    if (btn) btn.disabled = true;

    try {
        const res = await fetch('api.php?action=save_tramite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();

        if (result.success) {
            closeModal('modal-tramite');
            showToast(result.message || 'Trámite guardado correctamente.', 'success');
            await loadTramites();

            // Si estábamos viendo el detalle de este trámite, refrescarlo
            if (_tramiteActualId && String(_tramiteActualId) === String(data.id)) {
                await abrirDetalleTramite(_tramiteActualId);
            }
        } else {
            showToast(result.message || 'No se pudo guardar el trámite.', 'error');
        }
    } catch (err) {
        console.error('Error al guardar trámite:', err);
        showToast('Error de conexión al guardar trámite.', 'error');
    } finally {
        if (btn) btn.disabled = false;
    }
}

async function eliminarTramite(id, titulo = '') {
    const label = titulo ? `el trámite "${titulo}"` : 'este trámite';
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente ${label} y todos sus comentarios?`)) {
        return;
    }

    try {
        const res = await fetch('api.php?action=delete_tramite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const result = await res.json();
        if (result.success) {
            showToast(result.message || 'Trámite eliminado correctamente.', 'success');
            closeModal('modal-detalle-tramite');
            _tramiteActualId = null;
            await loadTramites();
        } else {
            showToast(result.message || 'No se pudo eliminar el trámite.', 'error');
        }
    } catch (err) {
        console.error('Error al eliminar trámite:', err);
        showToast('Error de conexión al eliminar trámite.', 'error');
    }
}

function eliminarTramiteActual() {
    if (!_tramiteActualId) return;
    eliminarTramite(_tramiteActualId);
}

function formatFechaVisual(fechaStr) {
    if (!fechaStr) return '';
    const parts = fechaStr.substring(0, 10).split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return fechaStr;
}

function formatFechaHoraVisual(fechaHoraStr) {
    if (!fechaHoraStr) return '';
    try {
        const d = new Date(fechaHoraStr.replace(' ', 'T'));
        if (isNaN(d.getTime())) return fechaHoraStr;
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const anio = d.getFullYear();
        let horas = d.getHours();
        const mins = String(d.getMinutes()).padStart(2, '0');
        const ampm = horas >= 12 ? 'pm' : 'am';
        horas = horas % 12;
        horas = horas ? horas : 12;
        return `${dia}/${mes}/${anio} ${horas}:${mins} ${ampm}`;
    } catch (e) {
        return fechaHoraStr;
    }
}
