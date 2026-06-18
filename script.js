// Default Application State (Schema)
const defaultData = [
    {
        id: 'overview',
        title: 'Dashboard Overview',
        isSystem: true
    },
    {
        id: 'personal',
        title: 'Personal Details',
        fields: [
            { id: 'p1', label: 'Full Name', value: 'John Doe' },
            { id: 'p2', label: 'Date of Birth', value: '01/01/2000' },
            { id: 'p3', label: 'Gender', value: 'Male' },
            { id: 'p4', label: 'Nationality', value: 'Indian' },
            { id: 'p5', label: '[Aadhaar Redacted]', value: 'XXXX-XXXX-XXXX' },
            { id: 'p6', label: 'PAN Number', value: 'ABCDE1234F' },
            { id: 'p7', label: 'Passport Number', value: 'A1234567' }
        ]
    },
    {
        id: 'contact',
        title: 'Contact Information',
        fields: [
            { id: 'c1', label: 'Primary Phone', value: '+91 9876543210' },
            { id: 'c2', label: 'Personal Email', value: 'john.doe@email.com' },
            { id: 'c3', label: 'Academic Email', value: 'john.student@college.edu' },
            { id: 'c4', label: 'Current Address', value: '123 Campus Road, City, State' },
            { id: 'c5', label: 'PIN Code', value: '110001' }
        ]
    },
    {
        id: 'college',
        title: 'College Information',
        fields: [
            { id: 'col1', label: 'College Name', value: 'Institute of Technology' },
            { id: 'col2', label: 'Roll Number', value: '20CS1001' },
            { id: 'col3', label: 'Degree & Branch', value: 'B.Tech Computer Science' },
            { id: 'col4', label: 'CGPA', value: '8.5' }
        ]
    },
    {
        id: 'profiles',
        title: 'Online Profiles',
        fields: [
            { id: 'pr1', label: 'LinkedIn', value: 'linkedin.com/in/johndoe' },
            { id: 'pr2', label: 'GitHub', value: 'github.com/johndoe' },
            { id: 'pr3', label: 'LeetCode', value: 'leetcode.com/johndoe' }
        ]
    },
    {
        id: 'documents',
        title: 'Document Tracker',
        fields: [
            { id: 'doc1', label: 'Resume Drive Link', value: 'https://drive.google.com/...' },
            { id: 'doc2', label: '[Aadhaar Redacted] PDF Link', value: 'https://drive.google.com/...' },
            { id: 'doc3', label: 'Degree Certificate Link', value: 'https://drive.google.com/...' }
        ]
    }
];

// App Variables
let vaultData = [];
let activeSectionId = 'overview';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    loadData();
    renderSidebar();
    renderContent();
    setupEventListeners();
});

// Load / Save Data
function loadData() {
    const stored = localStorage.getItem('vaultOS_data');
    vaultData = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(defaultData));
}

function saveData() {
    localStorage.setItem('vaultOS_data', JSON.stringify(vaultData));
}

// Render Sidebar
function renderSidebar() {
    const nav = document.getElementById('sidebar-nav');
    nav.innerHTML = '';
    
    vaultData.forEach(section => {
        const div = document.createElement('div');
        div.className = `nav-item ${section.id === activeSectionId ? 'active' : ''}`;
        div.innerHTML = `<span>${section.title}</span>`;
        if(!section.isSystem) {
            div.innerHTML += `<i data-lucide="chevron-right" style="width:14px; height:14px"></i>`;
        }
        div.onclick = () => {
            activeSectionId = section.id;
            renderSidebar();
            renderContent();
            lucide.createIcons();
        };
        nav.appendChild(div);
    });
}

// Render Content Area
function renderContent() {
    const container = document.getElementById('content-area');
    container.innerHTML = '';

    const section = vaultData.find(s => s.id === activeSectionId);
    
    if (section.isSystem && section.id === 'overview') {
        renderOverview(container);
    } else {
        renderSectionFields(section, container);
    }
    lucide.createIcons();
}

function renderOverview(container) {
    let totalFields = 0;
    vaultData.forEach(s => { if(s.fields) totalFields += s.fields.length; });

    container.innerHTML = `
        <div class="section-header">
            <h1 class="section-title">Dashboard Overview</h1>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="field-label">Total Sections</div>
                <div class="stat-value">${vaultData.length - 1}</div>
            </div>
            <div class="stat-card">
                <div class="field-label">Total Fields stored</div>
                <div class="stat-value">${totalFields}</div>
            </div>
            <div class="stat-card">
                <div class="field-label">Storage Status</div>
                <div class="stat-value" style="color: var(--success-color)">Local Sync Active</div>
            </div>
        </div>
        <div style="color: var(--text-secondary); line-height: 1.6;">
            Welcome to your Personal Vault OS. Select a section from the sidebar to view, copy, and edit your information. 
            Everything is saved securely in your browser's local storage. No data is sent to any server.
        </div>
    `;
}

function renderSectionFields(section, container) {
    let html = `
        <div class="section-header">
            <h1 class="section-title">${section.title}</h1>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-primary" onclick="addField('${section.id}')">
                    <i data-lucide="plus"></i> Add Field
                </button>
                <button class="btn btn-ghost" style="border:1px solid var(--border-color); width:auto;" onclick="deleteSection('${section.id}')">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
        <div class="card-grid" id="field-grid">
    `;

    if(section.fields) {
        section.fields.forEach(field => {
            html += `
                <div class="field-card" id="card-${field.id}">
                    <div class="field-header">
                        <span class="field-label" id="label-text-${field.id}">${field.label}</span>
                        <div class="field-actions">
                            <button onclick="copyToClipboard('${field.value}')" title="Copy"><i data-lucide="copy" style="width:16px;"></i></button>
                            <button onclick="enableEdit('${section.id}', '${field.id}')" title="Edit"><i data-lucide="edit-2" style="width:16px;"></i></button>
                            <button onclick="deleteField('${section.id}', '${field.id}')" title="Delete"><i data-lucide="x" style="width:16px;"></i></button>
                        </div>
                    </div>
                    <div class="field-value" id="val-text-${field.id}">${field.value}</div>
                    
                    <div id="edit-form-${field.id}" style="display:none; margin-top:10px;">
                        <input type="text" class="field-input" id="edit-label-${field.id}" value="${field.label}" placeholder="Label">
                        <input type="text" class="field-input" id="edit-val-${field.id}" value="${field.value}" placeholder="Value">
                        <div style="display:flex; gap:8px; margin-top:8px;">
                            <button class="btn btn-primary" onclick="saveEdit('${section.id}', '${field.id}')" style="padding: 4px 12px; font-size:12px;">Save</button>
                            <button class="btn btn-ghost" onclick="cancelEdit('${field.id}')" style="padding: 4px 12px; font-size:12px; width:auto;">Cancel</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    html += `</div>`;
    container.innerHTML = html;
}

// Actions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast("Copied to clipboard!");
    });
}

function enableEdit(secId, fieldId) {
    document.getElementById(`val-text-${fieldId}`).style.display = 'none';
    document.getElementById(`label-text-${fieldId}`).style.display = 'none';
    document.getElementById(`edit-form-${fieldId}`).style.display = 'block';
}

function cancelEdit(fieldId) {
    document.getElementById(`val-text-${fieldId}`).style.display = 'block';
    document.getElementById(`label-text-${fieldId}`).style.display = 'block';
    document.getElementById(`edit-form-${fieldId}`).style.display = 'none';
}

function saveEdit(secId, fieldId) {
    const newLabel = document.getElementById(`edit-label-${fieldId}`).value;
    const newVal = document.getElementById(`edit-val-${fieldId}`).value;
    
    const section = vaultData.find(s => s.id === secId);
    const field = section.fields.find(f => f.id === fieldId);
    
    field.label = newLabel;
    field.value = newVal;
    
    saveData();
    renderContent();
    showToast("Field updated");
}

function addField(secId) {
    const section = vaultData.find(s => s.id === secId);
    const newId = 'f_' + Date.now();
    section.fields.push({ id: newId, label: 'New Field', value: 'Value' });
    saveData();
    renderContent();
    enableEdit(secId, newId);
}

function deleteField(secId, fieldId) {
    if(!confirm("Delete this field?")) return;
    const section = vaultData.find(s => s.id === secId);
    section.fields = section.fields.filter(f => f.id !== fieldId);
    saveData();
    renderContent();
}

function addSection() {
    const title = prompt("Enter section name:");
    if(!title) return;
    const newId = 'sec_' + Date.now();
    vaultData.push({ id: newId, title: title, fields: [] });
    saveData();
    activeSectionId = newId;
    renderSidebar();
    renderContent();
}

function deleteSection(secId) {
    if(!confirm("Delete this entire section?")) return;
    vaultData = vaultData.filter(s => s.id !== secId);
    saveData();
    activeSectionId = 'overview';
    renderSidebar();
    renderContent();
}

// Global Search
document.getElementById('global-search').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    if(term === '') {
        renderContent();
        return;
    }

    const container = document.getElementById('content-area');
    let html = `<div class="section-header"><h1 class="section-title">Search Results</h1></div><div class="card-grid">`;
    
    vaultData.forEach(sec => {
        if(!sec.fields) return;
        sec.fields.forEach(field => {
            if(field.label.toLowerCase().includes(term) || field.value.toLowerCase().includes(term)) {
                html += `
                    <div class="field-card">
                        <div class="field-header">
                            <span class="field-label">${sec.title} › ${field.label}</span>
                            <div class="field-actions" style="opacity:1">
                                <button onclick="copyToClipboard('${field.value}')"><i data-lucide="copy" style="width:16px;"></i></button>
                            </div>
                        </div>
                        <div class="field-value">${field.value}</div>
                    </div>
                `;
            }
        });
    });
    html += `</div>`;
    container.innerHTML = html;
    lucide.createIcons();
});

// Import / Export
document.getElementById('export-btn').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vaultData));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "vaultOS_backup.json");
    dlAnchorElem.click();
    showToast("Exported successfully!");
});

document.getElementById('import-btn').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            vaultData = JSON.parse(event.target.result);
            saveData();
            renderSidebar();
            renderContent();
            showToast("Data imported successfully!");
        } catch(err) {
            alert("Invalid JSON file");
        }
    };
    reader.readAsText(file);
});

// Theme Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
});

document.getElementById('add-section-btn').addEventListener('click', addSection);

// Keyboard Shortcut (Ctrl+K)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search').focus();
    }
});

// Toast System
function showToast(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="check-circle" style="color: var(--success-color);"></i> ${msg}`;
    container.appendChild(toast);
    lucide.createIcons();
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}