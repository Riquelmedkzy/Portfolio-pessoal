const lab = document.querySelector("[data-lab]");
if (lab) {
  const loaders = {
    ui: () => import("./lab/ui.js"),
    animation: () => import("./lab/animation.js"),
    terminal: () => import("./lab/terminal.js"),
  };
  const instances = new Map(),
    tabs = [...lab.querySelectorAll("[data-experiment]")],
    panels = [...lab.querySelectorAll("[data-experiment-panel]")];
  let current = "ui",
    request = 0;
  async function activate(id) {
    if (!Object.hasOwn(loaders, id)) id = "ui";
    const token = ++request;
    current = id;
    instances.forEach((instance, key) => instance.setActive?.(key === id));
    tabs.forEach((t) => {
      const active = t.dataset.experiment === id;
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
    });
    panels.forEach((p) => (p.hidden = p.dataset.experimentPanel !== id));
    try {
      if (!instances.has(id)) {
        const module = await loaders[id]();
        if (token !== request) return;
        instances.set(
          id,
          module.mount(lab.querySelector(`[data-experiment-panel="${id}"]`)),
        );
      }
      instances.get(id).setActive?.(true);
      lab.querySelector("[data-lab-status]").textContent = "";
    } catch {
      lab.querySelector("[data-lab-status]").textContent =
        "Não foi possível carregar o experimento. Recarregue a página para tentar novamente.";
    }
  }
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      history.replaceState(null, "", `#${tab.dataset.experiment}`);
      activate(tab.dataset.experiment);
    }),
  );
  lab.querySelector("[role=tablist]").addEventListener("keydown", (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let next = i;
    if (["ArrowDown", "ArrowRight"].includes(e.key))
      next = (i + 1) % tabs.length;
    else if (["ArrowUp", "ArrowLeft"].includes(e.key))
      next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    tabs[next].focus();
    tabs[next].click();
  });
  addEventListener("hashchange", () => activate(location.hash.slice(1)));
  activate(location.hash.slice(1) || "ui");
}
