/* Demo-only bridge. No network, credentials, server actions or private sessions. */
(() => {
  const allowed = new Set(["pokelab.main-team.v1", "pokelab.motion"]);
  const memory = Object.create(null);
  try {
    const value = JSON.parse(
      new URL(location.href).searchParams.get("demoState") || "{}",
    );
    for (const [key, item] of Object.entries(value))
      if (allowed.has(key) && typeof item === "string" && item.length < 200)
        memory[key] = item;
  } catch {}
  try {
    void localStorage.length;
  } catch {
    try {
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: (key) => memory[key] ?? null,
          setItem: (key, value) => {
            if (allowed.has(key) && String(value).length < 200)
              memory[key] = String(value);
          },
          removeItem: (key) => delete memory[key],
        },
      });
    } catch {}
  }
  document.addEventListener("click", (event) => {
    const a = event.target.closest("a[href]");
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (
      url.origin === location.origin &&
      url.pathname.includes("/demos/pokelab/") &&
      Object.keys(memory).length
    ) {
      url.searchParams.set("demoState", JSON.stringify(memory));
      a.href = url.href;
    }
  });
  function formNotice(form) {
    let status=form.querySelector('[data-demo-feedback]');
    if(!status){status=document.createElement('p');status.dataset.demoFeedback='';status.setAttribute('role','status');form.append(status);}
    status.textContent='Prévia de formulário: nenhum dado foi enviado, nenhuma conta foi criada. Use a navegação para continuar explorando.';
  }
  document.addEventListener('submit',event=>{if(event.target.id==='task-form')return;event.preventDefault();event.stopImmediatePropagation();formNotice(event.target);},true);
  addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("form").forEach((form) => {
      if (form.id === "task-form") return;
      form.action = "#";
      form.noValidate = true;
      const note = document.createElement("p");
      note.className = "demo-form-notice";
      note.textContent =
        "Formulário ilustrativo. Não informe dados pessoais. Este recurso depende do servidor na aplicação original.";
      form.prepend(note);
      form.querySelectorAll('button:not([type]),button[type="submit"],input[type="submit"]').forEach(button=>{button.type='button';button.addEventListener('click',()=>formNotice(form));});
      form.querySelectorAll('label:not([for])').forEach((label,index)=>{const field=label.nextElementSibling;if(field?.matches('input,select,textarea')){field.id ||= 'demo-field-'+index;label.htmlFor=field.id;}});
      form
        .querySelectorAll("input[type=password],input[type=file]")
        .forEach((field) => {
          field.disabled = true;
          field.value = "";
        });
    });
    const b = document.querySelector("[data-presentation-pause]");
    let paused = matchMedia("(prefers-reduced-motion:reduce)").matches;
    function update() {
      if (window.worldMotion && window.worldMotion.enabled === paused)
        window.worldMotion.set(!paused);
      document.documentElement.classList.toggle("demo-motion-off", paused);
      document.dispatchEvent(new CustomEvent("presentation:motion",{detail:{paused}}));
      if (b) {
        b.textContent = paused ? "Retomar movimento" : "Pausar movimento";
        b.setAttribute("aria-pressed", String(paused));
      }
    }
    b?.addEventListener("click", () => {
      paused = !paused;
      update();
    });
    addEventListener("message", (event) => {
      if (
        event.source !== parent ||
        event.data?.type !== "portfolio-demo-motion"
      )
        return;
      paused =
        Boolean(event.data.paused) ||
        matchMedia("(prefers-reduced-motion:reduce)").matches;
      update();
    });
    update();
    document.documentElement.dataset.presentationReady="true";
  });
})();
