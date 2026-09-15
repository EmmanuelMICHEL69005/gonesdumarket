/* Widget « version bêta » + signalement de bug — Les Gones du Market'
   Les messages (et captures d'écran) sont envoyés par email via Web3Forms.
   -> ACCESS_KEY = clé Web3Forms liée à emmanuelmichel@gmail.com.
      Sans clé valide, le formulaire bascule sur un lien mailto (sans image). */
(function () {
  "use strict";

  var ACCESS_KEY = "b8426c1f-5c62-4cda-a141-763e8bfb705a";
  var ENDPOINT   = "https://api.web3forms.com/submit";
  var CONTACT    = "emmanuelmichel@gmail.com";
  var SEEN_KEY   = "gdm_beta_seen";
  var MAX_FILES  = 3;
  var MAX_DIM    = 1600; // les captures sont réduites à 1600px max avant envoi

  var css = ''
    + '.beta-widget,.beta-widget *{box-sizing:border-box}'
    + '.beta-fab{position:fixed;right:16px;bottom:16px;z-index:9999;display:inline-flex;align-items:center;gap:8px;'
    +   'background:#111827;color:#fff;border:2px solid #d4f84a;cursor:pointer;font:700 13px/1 -apple-system,BlinkMacSystemFont,'
    +   '"Segoe UI",Roboto,Helvetica,Arial,sans-serif;padding:10px 16px;border-radius:100px;'
    +   'box-shadow:0 6px 24px rgba(0,0,0,.35);transition:transform .15s,background .2s}'
    + '.beta-fab:hover{background:#000;transform:translateY(-2px)}'
    + '.beta-dot{width:9px;height:9px;border-radius:50%;background:#d4f84a;animation:beta-pulse 2s infinite}'
    + '@keyframes beta-pulse{0%{box-shadow:0 0 0 0 rgba(212,248,74,.7)}70%{box-shadow:0 0 0 9px rgba(212,248,74,0)}100%{box-shadow:0 0 0 0 rgba(212,248,74,0)}}'
    + '.beta-panel{position:fixed;right:16px;bottom:72px;z-index:9999;width:340px;max-width:calc(100vw - 32px);'
    +   'max-height:calc(100vh - 96px);overflow-y:auto;'
    +   'background:#fff;color:#1A1A1A;border-radius:16px;box-shadow:0 16px 50px rgba(0,0,0,.28);padding:18px;'
    +   'font:400 14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}'
    + '.beta-panel.drag{outline:2px dashed #E8614A;outline-offset:-6px}'
    + '.beta-panel[hidden],.beta-toast[hidden],.beta-thumbs[hidden]{display:none}'
    + '.beta-panel-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}'
    + '.beta-panel-head strong{font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#E8614A}'
    + '.beta-close{background:none;border:none;font-size:22px;line-height:1;cursor:pointer;color:#888;padding:0 4px}'
    + '.beta-intro{margin:0 0 12px;color:#555;font-size:13px}'
    + '.beta-form{display:grid;gap:10px}'
    + '.beta-form label{display:grid;gap:4px;font-size:12px;font-weight:600;color:#333}'
    + '.beta-form label span{font-weight:400;color:#999}'
    + '.beta-form textarea,.beta-form input[type=email]{width:100%;font:inherit;padding:9px 10px;border:1px solid #ddd;'
    +   'border-radius:8px;resize:vertical;background:#fafafa;color:#1A1A1A}'
    + '.beta-form textarea:focus,.beta-form input[type=email]:focus{outline:none;border-color:#E8614A;background:#fff}'
    // — zone captures —
    + '.beta-attach{display:flex;align-items:center;gap:8px;flex-wrap:wrap}'
    + '.beta-form .beta-attach-btn{display:inline-flex;align-items:center;gap:6px;cursor:pointer;'
    +   'font:600 12px/1 inherit;color:#C94D38;background:#FBEDE9;border:1px dashed #E8614A;'
    +   'padding:8px 12px;border-radius:8px}'
    + '.beta-attach-hint{font-size:11px;color:#999;font-weight:400}'
    + '.beta-thumbs{display:flex;gap:8px;flex-wrap:wrap}'
    + '.beta-thumb{position:relative;width:58px;height:58px;border-radius:8px;overflow:hidden;'
    +   'border:1px solid #e0d9d0;background:#fafafa}'
    + '.beta-thumb img{width:100%;height:100%;object-fit:cover;display:block}'
    + '.beta-thumb button{position:absolute;top:2px;right:2px;width:18px;height:18px;border-radius:50%;'
    +   'border:none;background:rgba(0,0,0,.6);color:#fff;font:700 12px/1 inherit;cursor:pointer;'
    +   'display:grid;place-items:center;padding:0}'
    + '.beta-submit{background:#E8614A;color:#fff;border:none;border-radius:8px;padding:10px;font:700 13px/1 inherit;'
    +   'cursor:pointer;transition:background .2s}'
    + '.beta-submit:hover{background:#C94D38}.beta-submit:disabled{opacity:.6;cursor:default}'
    + '.beta-status{margin:4px 0 0;font-size:12px;min-height:1em}'
    + '.beta-status.ok{color:#1a7f37}.beta-status.err{color:#c9333a}.beta-status a{color:#E8614A}'
    + '.beta-toast{position:fixed;right:16px;bottom:72px;z-index:9998;width:320px;max-width:calc(100vw - 32px);'
    +   'background:#1A1A1A;color:#fff;border-radius:12px;padding:14px 16px;box-shadow:0 12px 40px rgba(0,0,0,.3);'
    +   'font:400 13px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;'
    +   'animation:beta-slide .3s ease}'
    + '@keyframes beta-slide{from{transform:translateY(12px);opacity:0}to{transform:none;opacity:1}}'
    + '.beta-toast strong{display:block;margin-bottom:2px}'
    + '.beta-toast-actions{display:flex;gap:8px;margin-top:10px}'
    + '.beta-toast button{font:700 12px/1 inherit;border-radius:6px;padding:7px 10px;cursor:pointer;border:none}'
    + '.beta-toast .t-report{background:#E8614A;color:#fff}'
    + '.beta-toast .t-dismiss{background:rgba(255,255,255,.15);color:#fff}'
    + '@media (max-width:620px){.beta-fab{right:12px;bottom:16px;font-size:12px;padding:10px 14px}'
    +   '.beta-fab .beta-fab-long{display:none}'
    +   '.beta-panel{right:12px;left:12px;width:auto;bottom:70px}}';

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var wrap = document.createElement("div");
  wrap.className = "beta-widget";
  wrap.innerHTML = ''
    + '<button class="beta-fab" type="button" aria-haspopup="dialog" aria-expanded="false">'
    +   '<span class="beta-dot"></span> <span class="beta-fab-long">Version bêta &middot; </span>Signaler un bug</button>'
    + '<div class="beta-panel" role="dialog" aria-modal="false" aria-label="Signaler un bug" hidden>'
    +   '<div class="beta-panel-head"><strong>Version bêta</strong>'
    +     '<button class="beta-close" type="button" aria-label="Fermer">&times;</button></div>'
    +   '<p class="beta-intro">Ce site est en version bêta. Un bug, un texte bizarre, un lien cassé&nbsp;? Dites-nous tout.</p>'
    +   '<form class="beta-form">'
    +     '<label>Votre message'
    +       '<textarea name="message" rows="4" required placeholder="Décrivez le problème…"></textarea></label>'
    +     '<div class="beta-attach">'
    +       '<label class="beta-attach-btn">📎 Joindre une capture'
    +         '<input type="file" accept="image/*" multiple hidden></label>'
    +       '<span class="beta-attach-hint">ou collez (Cmd/Ctrl+V) · glissez une image</span>'
    +     '</div>'
    +     '<div class="beta-thumbs" hidden></div>'
    +     '<label>Votre email <span>(facultatif, pour vous répondre)</span>'
    +       '<input type="email" name="email" placeholder="vous@exemple.com" autocomplete="email"></label>'
    +     '<button class="beta-submit" type="submit">Envoyer</button>'
    +     '<p class="beta-status" role="status" aria-live="polite"></p>'
    +   '</form></div>';
  document.body.appendChild(wrap);

  var fab     = wrap.querySelector(".beta-fab");
  var panel   = wrap.querySelector(".beta-panel");
  var form    = wrap.querySelector(".beta-form");
  var status  = wrap.querySelector(".beta-status");
  var fileIn  = wrap.querySelector('.beta-attach input[type=file]');
  var thumbs  = wrap.querySelector(".beta-thumbs");
  var toast   = null;
  var attachments = []; // { blob, name, url }

  function openPanel() {
    panel.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    panel.querySelector("textarea").focus();
    if (toast) { toast.remove(); toast = null; markSeen(); }
  }
  function closePanel() {
    panel.hidden = true;
    fab.setAttribute("aria-expanded", "false");
  }
  function markSeen() { try { localStorage.setItem(SEEN_KEY, "1"); } catch (e) {} }

  fab.addEventListener("click", function () { panel.hidden ? openPanel() : closePanel(); });
  wrap.querySelector(".beta-close").addEventListener("click", closePanel);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) closePanel();
  });

  /* ── Captures d'écran : compression + aperçus ── */
  function compress(file, cb) {
    var img = new Image();
    var url = URL.createObjectURL(file);
    img.onload = function () {
      URL.revokeObjectURL(url);
      var w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
      if (w > MAX_DIM || h > MAX_DIM) {
        var r = Math.min(MAX_DIM / w, MAX_DIM / h);
        w = Math.round(w * r); h = Math.round(h * r);
      }
      try {
        var c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        c.toBlob(function (blob) { cb(blob || file); }, "image/jpeg", 0.85);
      } catch (e) { cb(file); }
    };
    img.onerror = function () { URL.revokeObjectURL(url); cb(file); };
    img.src = url;
  }

  function addImage(file) {
    if (!file || !/^image\//.test(file.type || "")) return;
    if (attachments.length >= MAX_FILES) {
      status.className = "beta-status err";
      status.textContent = "3 captures maximum.";
      return;
    }
    compress(file, function (blob) {
      if (attachments.length >= MAX_FILES) return;
      var item = { blob: blob, name: "capture-" + (attachments.length + 1) + ".jpg", url: URL.createObjectURL(blob) };
      attachments.push(item);
      renderThumbs();
    });
  }

  function renderThumbs() {
    thumbs.innerHTML = "";
    attachments.forEach(function (a, i) {
      var t = document.createElement("div");
      t.className = "beta-thumb";
      var im = document.createElement("img");
      im.src = a.url; im.alt = "Capture " + (i + 1);
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("aria-label", "Retirer la capture"); b.textContent = "×";
      b.addEventListener("click", function () {
        URL.revokeObjectURL(a.url);
        attachments.splice(i, 1);
        renderThumbs();
      });
      t.appendChild(im); t.appendChild(b);
      thumbs.appendChild(t);
    });
    thumbs.hidden = attachments.length === 0;
  }

  function clearAttachments() {
    attachments.forEach(function (a) { URL.revokeObjectURL(a.url); });
    attachments = [];
    renderThumbs();
  }

  // bouton fichier
  fileIn.addEventListener("change", function () {
    Array.prototype.forEach.call(fileIn.files || [], addImage);
    fileIn.value = "";
  });

  // coller (Cmd/Ctrl+V) une image
  panel.addEventListener("paste", function (e) {
    var items = (e.clipboardData && e.clipboardData.items) || [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].type && items[i].type.indexOf("image") === 0) {
        var f = items[i].getAsFile();
        if (f) { addImage(f); e.preventDefault(); }
      }
    }
  });

  // glisser-déposer
  ["dragenter", "dragover"].forEach(function (ev) {
    panel.addEventListener(ev, function (e) { e.preventDefault(); panel.classList.add("drag"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    panel.addEventListener(ev, function (e) { e.preventDefault(); if (ev === "drop" || e.target === panel) panel.classList.remove("drag"); });
  });
  panel.addEventListener("drop", function (e) {
    var files = (e.dataTransfer && e.dataTransfer.files) || [];
    Array.prototype.forEach.call(files, addImage);
  });

  /* ── Envoi ── */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = form.querySelector(".beta-submit");
    var keyMissing = !ACCESS_KEY || ACCESS_KEY.indexOf("REMPLACER") === 0;

    if (keyMissing) { showMailtoFallback(); return; }

    var fd = new FormData();
    fd.append("message", form.message.value);
    if (form.email.value) fd.append("email", form.email.value);
    fd.append("access_key", ACCESS_KEY);
    fd.append("subject", "Bug signalé — lesgonesdumarket.fr (bêta)");
    fd.append("from_name", "Formulaire bêta — Les Gones du Market'");
    fd.append("page", location.href);
    fd.append("navigateur", navigator.userAgent);
    fd.append("ecran", (window.screen ? screen.width + "×" + screen.height : ""));
    fd.append("captures", String(attachments.length));
    attachments.forEach(function (a, i) { fd.append("capture" + (i + 1), a.blob, a.name); });

    btn.disabled = true;
    status.className = "beta-status";
    status.textContent = attachments.length ? "Envoi de la capture…" : "Envoi…";

    fetch(ENDPOINT, { method: "POST", body: fd, headers: { Accept: "application/json" } })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.success) throw new Error(data && data.message);
        form.reset();
        clearAttachments();
        status.className = "beta-status ok";
        status.textContent = "Merci ! Votre message a bien été envoyé.";
        markSeen();
        setTimeout(closePanel, 2500);
      })
      .catch(showMailtoFallback)
      .finally(function () { btn.disabled = false; });
  });

  function showMailtoFallback() {
    var body = form.message ? form.message.value : "";
    var note = attachments.length ? "\n\n(Les captures ne peuvent pas être jointes par ce lien : renvoyez-les en pièce jointe à votre email.)" : "";
    var href = "mailto:" + CONTACT
      + "?subject=" + encodeURIComponent("Bug lesgonesdumarket.fr (bêta)")
      + "&body=" + encodeURIComponent(body + note + "\n\n---\nPage : " + location.href + "\nNavigateur : " + navigator.userAgent);
    status.className = "beta-status err";
    status.innerHTML = 'Envoi automatique indisponible — <a href="' + href + '">envoyer par email</a>.';
  }

  // Annonce « version bêta » : une seule fois par navigateur, et pas sur petit écran
  var seen = false;
  try { seen = localStorage.getItem(SEEN_KEY) === "1"; } catch (e) {}
  var smallScreen = (window.innerWidth || document.documentElement.clientWidth) < 620;
  if (!seen && !smallScreen) {
    setTimeout(function () {
      if (!panel.hidden || toast) return;
      toast = document.createElement("div");
      toast.className = "beta-toast";
      toast.innerHTML = ''
        + '<div><strong>🐛 Site en version bêta</strong>'
        + 'Aidez-nous à l\'améliorer en signalant les bugs.'
        + '<div class="beta-toast-actions">'
        +   '<button class="t-report" type="button">Signaler un bug</button>'
        +   '<button class="t-dismiss" type="button">Plus tard</button>'
        + '</div></div>';
      wrap.appendChild(toast);
      function dismissToast() { if (toast) { toast.remove(); toast = null; } markSeen(); }
      toast.querySelector(".t-report").addEventListener("click", openPanel);
      toast.querySelector(".t-dismiss").addEventListener("click", dismissToast);
      setTimeout(dismissToast, 11000);
    }, 1800);
  } else if (!seen && smallScreen) {
    markSeen();
  }
})();
