/* Widget « version bêta » + signalement de bug — Les Gones du Market'
   Les messages sont envoyés par email via Web3Forms (https://web3forms.com).
   -> Remplace ACCESS_KEY par la clé reçue en créant une clé gratuite avec
      l'adresse emmanuelmichel@gmail.com. Tant que la clé n'est pas valide,
      le formulaire bascule automatiquement sur un lien mailto. */
(function () {
  "use strict";

  var ACCESS_KEY = "b8426c1f-5c62-4cda-a141-763e8bfb705a";
  var ENDPOINT   = "https://api.web3forms.com/submit";
  var CONTACT    = "emmanuelmichel@gmail.com";
  var SEEN_KEY   = "gdm_beta_seen";

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
    + '.beta-panel[hidden],.beta-toast[hidden]{display:none}'
    + '.beta-panel-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}'
    + '.beta-panel-head strong{font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#E8614A}'
    + '.beta-close{background:none;border:none;font-size:22px;line-height:1;cursor:pointer;color:#888;padding:0 4px}'
    + '.beta-intro{margin:0 0 12px;color:#555;font-size:13px}'
    + '.beta-form{display:grid;gap:10px}'
    + '.beta-form label{display:grid;gap:4px;font-size:12px;font-weight:600;color:#333}'
    + '.beta-form label span{font-weight:400;color:#999}'
    + '.beta-form textarea,.beta-form input{width:100%;font:inherit;padding:9px 10px;border:1px solid #ddd;'
    +   'border-radius:8px;resize:vertical;background:#fafafa;color:#1A1A1A}'
    + '.beta-form textarea:focus,.beta-form input:focus{outline:none;border-color:#E8614A;background:#fff}'
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
    +     '<label>Votre email <span>(facultatif, pour vous répondre)</span>'
    +       '<input type="email" name="email" placeholder="vous@exemple.com" autocomplete="email"></label>'
    +     '<button class="beta-submit" type="submit">Envoyer</button>'
    +     '<p class="beta-status" role="status" aria-live="polite"></p>'
    +   '</form></div>';
  document.body.appendChild(wrap);

  var fab    = wrap.querySelector(".beta-fab");
  var panel  = wrap.querySelector(".beta-panel");
  var form   = wrap.querySelector(".beta-form");
  var status = wrap.querySelector(".beta-status");
  var toast  = null;

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

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = form.querySelector(".beta-submit");
    var keyMissing = !ACCESS_KEY || ACCESS_KEY.indexOf("REMPLACER") === 0;

    if (keyMissing) { showMailtoFallback(); return; }

    var fd = new FormData(form);
    fd.append("access_key", ACCESS_KEY);
    fd.append("subject", "Bug signalé — lesgonesdumarket.fr (bêta)");
    fd.append("from_name", "Formulaire bêta — Les Gones du Market'");
    fd.append("page", location.href);
    fd.append("navigateur", navigator.userAgent);
    fd.append("ecran", (window.screen ? screen.width + "×" + screen.height : ""));

    btn.disabled = true;
    status.className = "beta-status";
    status.textContent = "Envoi…";

    fetch(ENDPOINT, { method: "POST", body: fd, headers: { Accept: "application/json" } })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.success) throw new Error(data && data.message);
        form.reset();
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
    var href = "mailto:" + CONTACT
      + "?subject=" + encodeURIComponent("Bug lesgonesdumarket.fr (bêta)")
      + "&body=" + encodeURIComponent(body + "\n\n---\nPage : " + location.href + "\nNavigateur : " + navigator.userAgent);
    status.className = "beta-status err";
    status.innerHTML = 'Envoi automatique indisponible — <a href="' + href + '">envoyer par email</a>.';
  }

  // Annonce « version bêta » : une seule fois par navigateur, et pas sur petit écran
  // (le bouton flottant porte déjà le message « Version bêta · Signaler un bug »)
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
      setTimeout(dismissToast, 11000); // disparaît tout seul
    }, 1800);
  } else if (!seen && smallScreen) {
    markSeen();
  }
})();
