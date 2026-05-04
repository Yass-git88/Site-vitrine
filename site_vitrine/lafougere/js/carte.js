/* ================================================
   LA FOUGÈRE — carte.js
   Carte interactive clients · Leaflet.js + Cluster
================================================ */

(function () {
  'use strict';

  /* ── Catégories & couleurs ─────────────────── */
  var CAT = {
    atelier:    { label: 'Notre atelier',              couleur: '#3a6b4a' },
    particulier:{ label: 'Clients particuliers',       couleur: '#2ecc71' },
    mariage:    { label: 'Mariages & Événements',      couleur: '#e91e8c' },
    entreprise: { label: 'Entreprises & Institutions', couleur: '#0077ff' },
    abonnement: { label: 'Abonnés floraux',            couleur: '#ff9800' },
  };

  /* ── Données clients ─────────────────────────── */
  var CLIENTS = [
    { nom: 'La Fougère — Notre atelier',    lat: 45.7680, lng: 4.8332, categorie: 'atelier',     desc: '12, rue des Artisans, Lyon 1er' },
    { nom: 'Hôtel Collège',                 lat: 45.7662, lng: 4.8338, categorie: 'entreprise',  desc: 'Partenaire abonnement hebdomadaire' },
    { nom: 'Mairie du 1er Arrondissement',  lat: 45.7697, lng: 4.8356, categorie: 'entreprise',  desc: 'Décoration événements officiels' },
    { nom: 'Restaurant Le Passage',         lat: 45.7515, lng: 4.8480, categorie: 'entreprise',  desc: 'Tables fleuries chaque semaine' },
    { nom: 'Hôtel Le Royal',                lat: 45.7578, lng: 4.8325, categorie: 'entreprise',  desc: 'Décoration florale des espaces communs' },
    { nom: 'Galerie Lumière',               lat: 45.7558, lng: 4.8525, categorie: 'entreprise',  desc: 'Vernissages & expositions' },
    { nom: 'Jean-Pierre Moreau',            lat: 45.7535, lng: 4.8498, categorie: 'abonnement',  desc: 'Abonnement hebdomadaire' },
    { nom: 'Sophie & Thomas',               lat: 45.7788, lng: 4.8292, categorie: 'mariage',     desc: 'Mariage — Juin 2025' },
    { nom: 'Camille Deschamps',             lat: 45.7755, lng: 4.8340, categorie: 'particulier', desc: 'Cliente fidèle depuis 2018' },
    { nom: 'Clara & Marc',                  lat: 45.7748, lng: 4.8558, categorie: 'mariage',     desc: 'Mariage — Septembre 2025' },
    { nom: 'Cabinet Médical Dr. Faure',     lat: 45.7718, lng: 4.8592, categorie: 'entreprise',  desc: 'Plantes & compositions salle d\'attente' },
    { nom: 'Lucie Martin',                  lat: 45.7402, lng: 4.8478, categorie: 'abonnement',  desc: 'Abonnement mensuel' },
    { nom: 'Spa Sérénité',                  lat: 45.7598, lng: 4.8215, categorie: 'entreprise',  desc: 'Compositions zen pour l\'accueil' },
  ];

  /* ── Marqueur : cercle coloré sans emoji ─────── */
  function creerIcone(cat, isAtelier) {
    var size = isAtelier ? 22 : 16;
    var html =
      '<div style="' +
        'width:' + size + 'px;height:' + size + 'px;' +
        'border-radius:50%;' +
        'background:' + cat.couleur + ';' +
        'border:3px solid white;' +
        'box-shadow:0 2px 8px rgba(0,0,0,0.32);' +
        'transition:transform 0.2s;cursor:pointer;' +
      '"></div>';
    return L.divIcon({
      html: html,
      className: 'pf-pin',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -(size / 2 + 8)],
    });
  }

  /* ── Styles CSS cluster custom ───────────────── */
  function injecterStyles() {
    if (document.getElementById('pf-cluster-styles')) return;
    var s = document.createElement('style');
    s.id = 'pf-cluster-styles';
    s.textContent =
      '.pf-pin:hover > div { transform: scale(1.35); }' +
      '.pf-cluster {' +
        'background: white;' +
        'border: 3px solid #3a6b4a;' +
        'border-radius: 50%;' +
        'display: flex;align-items:center;justify-content:center;' +
        'font-family: sans-serif;font-size: 13px;font-weight: 700;' +
        'color: #3a6b4a;' +
        'box-shadow: 0 3px 12px rgba(0,0,0,0.22);' +
        'transition: transform 0.2s;' +
      '}' +
      '.pf-cluster:hover { transform: scale(1.1); }';
    document.head.appendChild(s);
  }

  /* ── Init carte ──────────────────────────────── */
  function initCarte() {
    var container = document.getElementById('carte-clients');
    if (!container) return;
    if (typeof L === 'undefined') { console.error('Leaflet non chargé'); return; }

    injecterStyles();

    var isMobile = window.innerWidth <= 480;
    var isTablet = window.innerWidth <= 768;
    var initialZoom = isMobile ? 12 : isTablet ? 12.5 : 13;

    var carte = L.map('carte-clients', {
      center: [45.762, 4.840],
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false,
      tap: true,
      dragging: !L.Browser.mobile,
      touchZoom: true,
      scrollWheelZoom: false,
    });

    L.control.zoom({ position: 'topleft' }).addTo(carte);

    carte.on('focus', function () { carte.scrollWheelZoom.enable(); });
    carte.on('blur', function () { carte.scrollWheelZoom.disable(); });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(carte);

    /* Groupe cluster */
    var cluster = L.markerClusterGroup({
      maxClusterRadius: 50,
      iconCreateFunction: function (grp) {
        var count = grp.getChildCount();
        /* Couleur dominante parmi les markers du groupe */
        var cats = {};
        grp.getAllChildMarkers().forEach(function (m) {
          var c = m.options._categorie || 'entreprise';
          cats[c] = (cats[c] || 0) + 1;
        });
        var dominant = Object.keys(cats).reduce(function (a, b) { return cats[a] > cats[b] ? a : b; });
        var couleur = (CAT[dominant] || CAT.entreprise).couleur;
        var size = count < 5 ? 36 : count < 10 ? 44 : 52;
        return L.divIcon({
          html: '<div class="pf-cluster" style="width:' + size + 'px;height:' + size + 'px;border-color:' + couleur + ';color:' + couleur + ';">' + count + '</div>',
          className: '',
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });
      },
    });

    /* Ajout des marqueurs */
    CLIENTS.forEach(function (client) {
      var cat = CAT[client.categorie] || CAT.particulier;
      var isAtelier = client.categorie === 'atelier';
      var popup =
        '<div class="pf-popup">' +
          '<span class="pf-popup-dot" style="background:' + cat.couleur + ';"></span>' +
          '<div>' +
            '<strong class="pf-popup-nom">' + client.nom + '</strong>' +
            '<span class="pf-popup-cat" style="color:' + cat.couleur + ';">' + cat.label + '</span>' +
            '<p class="pf-popup-desc">' + client.desc + '</p>' +
          '</div>' +
        '</div>';
      var marker = L.marker([client.lat, client.lng], {
        icon: creerIcone(cat, isAtelier),
        _categorie: client.categorie,
      }).bindPopup(popup, { className: 'pf-popup-wrap', maxWidth: 260 });
      cluster.addLayer(marker);
    });

    carte.addLayer(cluster);

    /* Légende */
    var legende = L.control({ position: 'bottomright' });
    legende.onAdd = function () {
      var div = L.DomUtil.create('div', 'pf-legende');
      var items = '<div class="pf-legende-titre">Légende</div>';
      Object.keys(CAT).forEach(function (k) {
        items +=
          '<div class="pf-legende-item">' +
            '<span class="pf-legende-dot" style="background:' + CAT[k].couleur + ';"></span>' +
            CAT[k].label +
          '</div>';
      });
      div.innerHTML = items;
      return div;
    };
    legende.addTo(carte);

    /* Légende mobile inline (visible ≤480px) */
    if (window.innerWidth <= 480) {
      var wrapper = container.closest('.carte-wrapper');
      if (wrapper && wrapper.parentNode) {
        var mLeg = document.createElement('div');
        mLeg.className = 'carte-legende-mobile';
        Object.keys(CAT).forEach(function (k) {
          mLeg.innerHTML +=
            '<span class="pf-legende-item">' +
              '<span class="pf-legende-dot" style="background:' + CAT[k].couleur + ';"></span>' +
              CAT[k].label +
            '</span>';
        });
        wrapper.parentNode.insertBefore(mLeg, wrapper.nextSibling);
      }
    }

    /* Recalcul au resize */
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { carte.invalidateSize(); }, 200);
    });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { carte.invalidateSize(); obs.disconnect(); } });
    }, { threshold: 0.1 });
    obs.observe(container);
    setTimeout(function () { carte.invalidateSize(); }, 800);
  }

  window.addEventListener('load', initCarte);
})();
