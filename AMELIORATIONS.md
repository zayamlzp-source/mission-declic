# Améliorations proposées pour Festival — Missions

## 🎯 Priorité Haute

### 1. **Remplacer `alert()` par un système de notifications**
**Problème** : Les `alert()` interrompent l'expérience utilisateur
**Solution** : Ajouter un système de toast notifications

```javascript
// Ajouter au début du script
const Toast = {
  show(message, type = "info", duration = 2000) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add("show");
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },
  success: (msg) => Toast.show(msg, "success"),
  error: (msg) => Toast.show(msg, "error"),
  info: (msg) => Toast.show(msg, "info")
};
```

**CSS à ajouter**:
```css
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--accent);
  color: white;
  padding: 14px 18px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s, transform 0.3s;
  z-index: 999;
  font-size: 0.95rem;
}

.toast.show {
  opacity: 1;
  transform: translateY(0);
}

.toast-success { background: #7a8f6f; }
.toast-error { background: #b76f53; }
.toast-info { background: #7a8f6f; }
```

### 2. **Refactoriser les rendus DOM (DRY principle)**

**Problème** : `renderJournal()`, `renderPhotos()`, etc. contiennent du code répétitif

**Solution** : Créer un helper générique
```javascript
function createListItem(data, template) {
  const item = document.createElement("div");
  item.className = data.className || "list-item";
  item.innerHTML = template(data);
  return item;
}

// Utilisation simplifie les renderJournal, renderPhotos, etc.
```

### 3. **Système de validation amélioré**

**Problème** : Les validations `if (!text)` sont basiques
**Solution** : Ajouter des validations avec messages clairs

```javascript
const Validator = {
  isEmpty: (value) => !value.trim(),
  isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  minLength: (value, min) => value.length < min,
  required: (value, fieldName) => {
    if (Validator.isEmpty(value)) {
      Toast.error(`${fieldName} est requis`);
      return false;
    }
    return true;
  }
};
```

---

## 🎨 Priorité Moyenne

### 4. **Améliorer l'accessibilité (A11y)**

**Ajouter des attributs ARIA pour les écrans:**
```html
<!-- Exemple -->
<section id="screen-journal" class="screen" role="region" aria-label="Mon journal">
```

**Améliorer les boutons:**
```html
<!-- Avant -->
<button id="start-btn" class="btn btn-primary">Je joue</button>

<!-- Après -->
<button id="start-btn" class="btn btn-primary" aria-label="Commencer une mission">Je joue</button>
```

### 5. **Ajouter une progression visuelle**

**Ajouter une barre de progression:**
```javascript
function getProgressPercentage() {
  const state = getProgressState();
  const totalMissions = MISSIONS.filter(m => m.active && !m.bonus).length;
  return Math.round((state.doneMissionIds.length / totalMissions) * 100);
}
```

**CSS:**
```css
.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.2);
  border-radius: 999px;
  overflow: hidden;
  margin: 8px 0;
}

.progress-bar-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.3s ease;
}
```

### 6. **Pagination pour les listes longues**

**Problème** : Les listes peuvent devenir très longues
**Solution** : Ajouter une pagination simple

```javascript
const Pagination = {
  itemsPerPage: 10,
  currentPage: 1,
  
  paginate(items) {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return items.slice(start, start + this.itemsPerPage);
  }
};
```

---

## 💾 Priorité Basse (Améliorations futures)

### 7. **Intégration Supabase**

Les notes déjà présentes dans le code:
```javascript
// Remplacer fileToLocalDataUrl par Supabase Storage
async function uploadPhotoToSupabase(file) {
  const { data, error } = await supabase
    .storage
    .from('festival-photos')
    .upload(`${getOrCreateSessionId()}/${uid()}.jpg`, file);
  
  if (error) Toast.error("Erreur upload");
  return data?.path;
}
```

### 8. **Statistiques avancées**
- Graphiques avec Chart.js
- Heatmap d'activité
- Recommandations personnalisées

### 9. **Export des données**
```javascript
function exportUserData() {
  const data = {
    profile: getUserProfile(),
    results: getOwnResults(),
    progress: getProgressState()
  };
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mon-festival.json';
  a.click();
}
```

### 10. **Mode sombre (Dark mode)**
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --bg-2: #2d2d2d;
    --card: rgba(255,255,255,0.1);
    --text: #f5f5f5;
    --muted: #b0b0b0;
    --line: #404040;
  }
}
```

---

## 🐛 Bugs à corriger

1. **Photo préviews avec images volumineuses** : Ajouter compression base64
2. **localStorage plein** : Gérer le cas où localStorage est plein (quota exceeded)
3. **Dates**: Vérifier que formatDateTime fonctionne bien sur tous les navigateurs

---

## 📋 Checklist d'implémentation

- [ ] Système de notifications Toast
- [ ] Refactoriser `renderJournal()` 
- [ ] Validator amélioré
- [ ] Attributs ARIA
- [ ] Barre de progression
- [ ] Pagination (si besoin)
- [ ] Tests de sécurité (XSS prevention)
- [ ] Performance optimization

---

## 📞 Besoin de détails ?

Je peux implémenter directement ces améliorations. Dites-moi lesquelles vous voulez que je fasse en priorité !
