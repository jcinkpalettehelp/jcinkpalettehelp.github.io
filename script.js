// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COLOR UTILITIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) { r = g = b = l; } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function adjustLightness(hex, amount) {
    const { h, s, l } = hexToHsl(hex);
    return hslToHex(h, s, Math.min(100, Math.max(0, l + amount)));
}

function shiftHue(hex, degrees) {
    const { h, s, l } = hexToHsl(hex);
    return hslToHex((h + degrees) % 360, s, l);
}

function getContrastColor(hex) {
    const { l } = hexToHsl(hex);
    return l > 55 ? '#0f172a' : '#f8fafc';
}

function randomColor() {
    const h = Math.floor(Math.random() * 360);
    const s = 55 + Math.random() * 40;
    const l = 35 + Math.random() * 35;
    return hslToHex(h, s, l);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PALETTE GENERATOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function generatePalette(primary, secondary, accent, shift = 12) {
    const primaryLight = adjustLightness(primary, shift);
    const primaryDark = adjustLightness(primary, -shift);
    const secondaryLight = adjustLightness(secondary, shift);
    const secondaryDark = adjustLightness(secondary, -shift);
    const accentLight = adjustLightness(accent, shift);
    const accentDark = adjustLightness(accent, -shift);

    const bgLight = '#f8fafc';
    const textLight = '#0f172a';
    const borderLight = '#e2e8f0';
    const row2Light = '#f1f5f9';

    const bgDark = '#0f172a';
    const textDark = '#f8fafc';
    const borderDark = '#334155';
    const row2Dark = '#1e293b';

    return {
        primary,
        primaryLight,
        primaryDark,
        primaryText: getContrastColor(primary),
        secondary,
        secondaryLight,
        secondaryDark,
        secondaryText: getContrastColor(secondary),
        accent,
        accentLight,
        accentDark,
        accentText: getContrastColor(accent),
        bgLight,
        textLight,
        borderLight,
        row2Light,
        bgDark,
        textDark,
        borderDark,
        row2Dark,
    };
}

function generateRandomPalette() {
    const primary = randomColor();
    const secondary = shiftHue(primary, 30 + Math.random() * 50);
    const accent = shiftHue(primary, 120 + Math.random() * 100);
    const shift = 10 + Math.floor(Math.random() * 15);
    return generatePalette(primary, secondary, accent, shift);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRESETS (Built-in)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const BUILTIN_PRESETS = [
    { name: 'Ocean Blue', primary: '#0ea5e9', secondary: '#3b82f6', accent: '#f59e0b', shift: 14 },
    { name: 'Purple Haze', primary: '#7c3aed', secondary: '#6d28d9', accent: '#ec4899', shift: 12 },
    { name: 'Forest Green', primary: '#10b981', secondary: '#059669', accent: '#f59e0b', shift: 12 },
    { name: 'Sunset', primary: '#f97316', secondary: '#f43f5e', accent: '#fbbf24', shift: 10 },
    { name: 'Midnight', primary: '#1e293b', secondary: '#334155', accent: '#3b82f6', shift: 15 },
    { name: 'Rose Gold', primary: '#f43f5e', secondary: '#e11d48', accent: '#fbbf24', shift: 10 },
    { name: 'Teal', primary: '#14b8a6', secondary: '#0d9488', accent: '#f97316', shift: 12 },
    { name: 'Indigo', primary: '#4f46e5', secondary: '#4338ca', accent: '#ec4899', shift: 12 },
    { name: 'Crimson', primary: '#dc2626', secondary: '#b91c1c', accent: '#fbbf24', shift: 10 },
    { name: 'Cyber', primary: '#06b6d4', secondary: '#8b5cf6', accent: '#f43f5e', shift: 14 },
    { name: 'Mint', primary: '#34d399', secondary: '#6ee7b7', accent: '#f59e0b', shift: 12 },
    { name: 'Lavender', primary: '#a78bfa', secondary: '#8b5cf6', accent: '#f472b6', shift: 12 },
    { name: 'Slate', primary: '#64748b', secondary: '#475569', accent: '#3b82f6', shift: 15 },
    { name: 'Coral', primary: '#fb7185', secondary: '#f43f5e', accent: '#fbbf24', shift: 10 },
    { name: 'Sapphire', primary: '#2563eb', secondary: '#1d4ed8', accent: '#f59e0b', shift: 12 },
    { name: 'Emerald', primary: '#059669', secondary: '#047857', accent: '#fbbf24', shift: 12 },
    { name: 'Ruby', primary: '#e11d48', secondary: '#be123c', accent: '#f59e0b', shift: 10 },
    { name: 'Sky', primary: '#38bdf8', secondary: '#0ea5e9', accent: '#fbbf24', shift: 14 },
    { name: 'Wine', primary: '#831843', secondary: '#4c0519', accent: '#f59e0b', shift: 12 },
    { name: 'Pastel Dream', primary: '#a5b4fc', secondary: '#c4b5fd', accent: '#fcd34d', shift: 16 },
    { name: 'Neon', primary: '#22d3ee', secondary: '#f472b6', accent: '#fbbf24', shift: 14 },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOCAL STORAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const STORAGE_KEY = 'jcink_palette_presets';

function loadSavedPresets() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function savePresetToStorage(preset) {
    const presets = loadSavedPresets();
    const existing = presets.findIndex(p => p.name.toLowerCase() === preset.name.toLowerCase());
    if (existing !== -1) {
        presets[existing] = preset;
    } else {
        presets.push(preset);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

function deletePresetFromStorage(name) {
    const presets = loadSavedPresets();
    const filtered = presets.filter(p => p.name !== name);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

function clearAllPresets() {
    localStorage.removeItem(STORAGE_KEY);
}

function getAllPresets() {
    const saved = loadSavedPresets();
    const all = [...BUILTIN_PRESETS];
    saved.forEach(savedPreset => {
        const idx = all.findIndex(p => p.name === savedPreset.name);
        if (idx !== -1) {
            all[idx] = savedPreset;
        } else {
            all.push(savedPreset);
        }
    });
    return all;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// APPLY PALETTE TO PREVIEW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let currentPalette = null;
let isDarkMode = false;

function applyPaletteToPreview(p, dark) {
    const isDark = dark;
    const bg = isDark ? p.bgDark : p.bgLight;
    const text = isDark ? p.textDark : p.textLight;
    const border = isDark ? p.borderDark : p.borderLight;
    const row2 = isDark ? p.row2Dark : p.row2Light;

    const preview = document.getElementById('forumPreview');
    preview.style.setProperty('--bg', bg);
    preview.style.setProperty('--text', text);
    preview.style.setProperty('--border', border);
    preview.style.setProperty('--row2', row2);
    preview.style.setProperty('--primary', p.primary);
    preview.style.setProperty('--primary-text', p.primaryText);
    preview.style.setProperty('--primary-light', p.primaryLight);
    preview.style.setProperty('--primary-dark', p.primaryDark);
    preview.style.setProperty('--secondary', p.secondary);
    preview.style.setProperty('--secondary-text', p.secondaryText);
    preview.style.setProperty('--secondary-dark', p.secondaryDark);
    preview.style.setProperty('--accent', p.accent);
    preview.style.setProperty('--accent-text', p.accentText);

    document.querySelectorAll('.forum-table .row1, .forum-table .row2').forEach(row => {
        row.style.backgroundColor = row.classList.contains('row1') ? bg : row2;
        row.style.color = text;
    });

    document.querySelectorAll('.forum-table a').forEach(link => {
        link.style.color = p.primary;
    });

    const header = document.querySelector('.forum-header');
    header.style.backgroundColor = p.primary;
    header.style.color = p.primaryText;

    const nav = document.querySelector('.forum-nav');
    nav.style.backgroundColor = p.secondary;
    nav.style.color = p.secondaryText;

    document.querySelectorAll('.forum-category').forEach(cat => {
        cat.style.backgroundColor = p.primary;
        cat.style.color = p.primaryText;
    });

    document.querySelectorAll('.forum-table th').forEach(th => {
        th.style.backgroundColor = p.primaryLight;
        th.style.color = p.primaryText;
    });

    document.querySelectorAll('.badge-count').forEach(badge => {
        badge.style.backgroundColor = p.accent;
        badge.style.color = p.accentText;
    });

    const input = document.querySelector('.forum-input');
    if (input) {
        input.style.backgroundColor = bg;
        input.style.color = text;
        input.style.borderColor = border;
    }

    document.querySelectorAll('.forum-btn:not(.forum-btn-secondary)').forEach(btn => {
        btn.style.backgroundColor = p.primary;
        btn.style.color = p.primaryText;
    });
    document.querySelectorAll('.forum-btn-secondary').forEach(btn => {
        btn.style.backgroundColor = p.secondary;
        btn.style.color = p.secondaryText;
    });

    const footer = document.querySelector('.forum-footer');
    footer.style.borderTopColor = border;
    footer.style.color = text;

    document.querySelectorAll('.pagination span').forEach(page => {
        if (page.classList.contains('active')) {
            page.style.backgroundColor = p.primary;
            page.style.color = p.primaryText;
        } else {
            page.style.backgroundColor = border;
            page.style.color = text;
        }
    });

    const toggleBtn = document.getElementById('toggleThemeBtn');
    toggleBtn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CSS EXPORTER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function paletteToCss(p) {
    return `/* ============================================
   JCINK SKIN PALETTE
   Paste this into your skin's custom CSS area
   ============================================ */

:root {
  /* ── Primary ── */
  --primary: ${p.primary};
  --primary-light: ${p.primaryLight};
  --primary-dark: ${p.primaryDark};

  /* ── Secondary ── */
  --secondary: ${p.secondary};
  --secondary-light: ${p.secondaryLight};
  --secondary-dark: ${p.secondaryDark};

  /* ── Accent ── */
  --accent: ${p.accent};
  --accent-light: ${p.accentLight};
  --accent-dark: ${p.accentDark};

  /* ── Neutrals (Light) ── */
  --bg: ${p.bgLight};
  --text: ${p.textLight};
  --border: ${p.borderLight};
  --row2: ${p.row2Light};

  /* ── Neutrals (Dark) ── */
  --bg-dark: ${p.bgDark};
  --text-dark: ${p.textDark};
  --border-dark: ${p.borderDark};
  --row2-dark: ${p.row2Dark};
}

/* ============================================
   DARK MODE — Add .dark-mode to <body>
   ============================================ */

body.dark-mode {
  --bg: var(--bg-dark);
  --text: var(--text-dark);
  --border: var(--border-dark);
  --row2: var(--row2-dark);
}

/* ─── Apply to everything ─── */

body {
  background: var(--bg);
  color: var(--text);
  transition: background 0.3s, color 0.3s;
}

/* Borders */
table, td, th, .border, hr {
  border-color: var(--border);
}

/* Links */
a, a:link, a:visited {
  color: var(--primary);
  transition: color 0.2s;
}
a:hover {
  color: var(--primary-dark);
}

/* Table rows */
.row1 { background: var(--bg); color: var(--text); }
.row2 { background: var(--row2); color: var(--text); }

/* Category bars */
.category {
  background: var(--primary);
  color: ${p.primaryText};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
}

/* Buttons */
.btn-primary {
  background: var(--primary);
  color: ${p.primaryText};
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.btn-secondary {
  background: var(--secondary);
  color: ${p.secondaryText};
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary:hover {
  background: var(--secondary-dark);
  transform: translateY(-2px);
}

/* Inputs */
input, textarea, select {
  background: var(--bg);
  color: var(--text);
  border: 2px solid var(--border);
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  transition: all 0.2s;
}
input:focus, textarea:focus, select:focus {
  border-color: var(--primary);
  outline: none;
}

/* ─── Utilities ─── */
.text-primary { color: var(--primary); }
.text-secondary { color: var(--secondary); }
.text-accent { color: var(--accent); }

.bg-primary { background: var(--primary); color: ${p.primaryText}; }
.bg-secondary { background: var(--secondary); color: ${p.secondaryText}; }
.bg-accent { background: var(--accent); color: ${p.accentText}; }`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UI RENDERER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const container = document.getElementById('paletteContainer');
const cssOutput = document.getElementById('cssOutput');
const toast = document.getElementById('toast');
const presetsGrid = document.getElementById('presetsGrid');

const roleLabels = {
    primary: 'Primary',
    primaryLight: 'Primary Light',
    primaryDark: 'Primary Dark',
    secondary: 'Secondary',
    secondaryLight: 'Secondary Light',
    secondaryDark: 'Secondary Dark',
    accent: 'Accent',
    accentLight: 'Accent Light',
    accentDark: 'Accent Dark',
};

const displayKeys = [
    'primary', 'primaryLight', 'primaryDark',
    'secondary', 'secondaryLight', 'secondaryDark',
    'accent', 'accentLight', 'accentDark',
];

function renderPalette(palette) {
    currentPalette = palette;
    container.innerHTML = '';

    displayKeys.forEach(key => {
        const hex = palette[key];
        if (!hex) return;
        const card = document.createElement('div');
        card.className = 'color-card';
        const contrast = getContrastColor(hex);
        if (contrast === '#0f172a') card.classList.add('dark-text');
        card.style.backgroundColor = hex;
        card.style.color = contrast;

        const label = roleLabels[key] || key;
        card.innerHTML = `
            <div class="hex">${hex}</div>
            <div class="role">${label}</div>
        `;
        card.title = `Click to copy ${hex}`;
        card.addEventListener('click', () => {
            navigator.clipboard.writeText(hex);
            showToast(`✅ Copied ${hex}`);
        });
        container.appendChild(card);
    });

    applyPaletteToPreview(palette, isDarkMode);

    const css = paletteToCss(palette);
    cssOutput.innerHTML = css + '\n';
    if (!cssOutput.querySelector('.copy-btn')) {
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.id = 'copyCssBtn';
        btn.textContent = '📋 Copy CSS';
        btn.addEventListener('click', () => {
            navigator.clipboard.writeText(css);
            showToast('✅ CSS copied!');
        });
        cssOutput.appendChild(btn);
    }
}

// ─── RENDER PRESETS ───

function renderPresets() {
    const allPresets = getAllPresets();
    const savedNames = loadSavedPresets().map(p => p.name);

    presetsGrid.innerHTML = '';

    if (allPresets.length === 0) {
        presetsGrid.innerHTML = '<span class="empty-presets">No presets yet. Create one above!</span>';
        document.getElementById('presetCount').textContent = '';
        return;
    }

    document.getElementById('presetCount').textContent =
        `(${allPresets.length} total · ${savedNames.length} saved)`;

    allPresets.forEach(preset => {
        const btn = document.createElement('button');
        btn.className = 'preset-btn';
        if (savedNames.includes(preset.name)) {
            btn.classList.add('saved');
        }

        const isSaved = savedNames.includes(preset.name);

        btn.innerHTML = `
            <span class="swatch-group">
                <span class="swatch" style="background:${preset.primary}"></span>
                <span class="swatch" style="background:${preset.secondary}"></span>
                <span class="swatch" style="background:${preset.accent}"></span>
            </span>
            ${preset.name}
            ${isSaved ? ' 💾' : ''}
            ${isSaved ? `<span class="delete-preset" data-name="${preset.name}">✕</span>` : ''}
        `;

        btn.title = `Load ${preset.name} palette`;

        btn.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-preset')) return;
            document.getElementById('primaryColor').value = preset.primary;
            document.getElementById('secondaryColor').value = preset.secondary;
            document.getElementById('accentColor').value = preset.accent;
            document.getElementById('shiftAmount').value = preset.shift || 12;
            const palette = generatePalette(
                preset.primary,
                preset.secondary,
                preset.accent,
                preset.shift || 12
            );
            renderPalette(palette);
            showToast(`🎨 Loaded "${preset.name}"`);
        });

        const deleteBtn = btn.querySelector('.delete-preset');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const name = deleteBtn.dataset.name;
                if (confirm(`Delete "${name}" from your saved presets?`)) {
                    deletePresetFromStorage(name);
                    renderPresets();
                    showToast(`🗑️ Deleted "${name}"`);
                }
            });
        }

        presetsGrid.appendChild(btn);
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

function getCurrentPresetData() {
    return {
        name: document.getElementById('presetNameInput').value.trim() || 'Unnamed Palette',
        primary: document.getElementById('primaryColor').value,
        secondary: document.getElementById('secondaryColor').value,
        accent: document.getElementById('accentColor').value,
        shift: parseInt(document.getElementById('shiftAmount').value) || 12,
    };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.getElementById('generateBtn').addEventListener('click', () => {
    const primary = document.getElementById('primaryColor').value;
    const secondary = document.getElementById('secondaryColor').value;
    const accent = document.getElementById('accentColor').value;
    const shift = parseInt(document.getElementById('shiftAmount').value) || 12;
    const palette = generatePalette(primary, secondary, accent, shift);
    renderPalette(palette);
});

document.getElementById('randomBtn').addEventListener('click', () => {
    const palette = generateRandomPalette();
    document.getElementById('primaryColor').value = palette.primary;
    document.getElementById('secondaryColor').value = palette.secondary;
    document.getElementById('accentColor').value = palette.accent;
    renderPalette(palette);
    showToast('🎲 Random palette generated!');
});

document.getElementById('toggleThemeBtn').addEventListener('click', function() {
    isDarkMode = !isDarkMode;
    if (currentPalette) {
        applyPaletteToPreview(currentPalette, isDarkMode);
    }
});

document.getElementById('savePresetBtn').addEventListener('click', () => {
    const data = getCurrentPresetData();
    if (!data.name || data.name === 'Unnamed Palette') {
        const name = prompt('Name your palette:', 'My Awesome Palette');
        if (!name) return;
        data.name = name;
        document.getElementById('presetNameInput').value = name;
    }

    const existing = loadSavedPresets().find(p => p.name === data.name);
    if (existing) {
        if (!confirm(`"${data.name}" already exists. Overwrite?`)) return;
    }

    savePresetToStorage(data);
    renderPresets();
    showToast(`💾 Saved "${data.name}" to your browser!`);
});

document.getElementById('clearPresetsBtn').addEventListener('click', () => {
    if (confirm('⚠️ Delete ALL saved presets? This cannot be undone.')) {
        clearAllPresets();
        renderPresets();
        showToast('🗑️ All presets cleared');
    }
});

document.getElementById('presetNameInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('savePresetBtn').click();
    }
});

// ─── INIT ───
renderPresets();
(function init() {
    const primary = document.getElementById('primaryColor').value;
    const secondary = document.getElementById('secondaryColor').value;
    const accent = document.getElementById('accentColor').value;
    const shift = parseInt(document.getElementById('shiftAmount').value) || 12;
    const palette = generatePalette(primary, secondary, accent, shift);
    renderPalette(palette);
})();
