const catalog = document.querySelector("[data-project-catalog]");
if (catalog) {
  const controls = [...catalog.querySelectorAll("[data-project-filter]")],
    entries = [...catalog.querySelectorAll("[data-project-entry]")];
  function update() {
    let count = 0;
    entries.forEach((entry) => {
      const show = controls.every(
        (c) =>
          c.value === "all" ||
          (c.dataset.projectFilter === "technologies"
            ? entry.dataset.technologies.split("|").includes(c.value)
            : entry.dataset[c.dataset.projectFilter] === c.value),
      );
      entry.hidden = !show;
      if (show) count++;
    });
    catalog.querySelector("[data-project-count]").textContent =
      `${count} ${count === 1 ? "projeto para explorar" : "projetos para explorar"}`;
    catalog.querySelector("[data-project-empty]").hidden = count !== 0;
    const archive = catalog.querySelector(".project-archive");
    archive.hidden = ![
      ...archive.querySelectorAll("[data-project-entry]"),
    ].some((e) => !e.hidden);
  }
  controls.forEach((c) => c.addEventListener("change", update));
  catalog.querySelectorAll("[data-reset-filters]").forEach((b) =>
    b.addEventListener("click", () => {
      controls.forEach((c) => (c.value = "all"));
      update();
    }),
  );
}
for (const container of document.querySelectorAll("[data-demo-container]")) {
  const load = container.querySelector("[data-load-demo]"),
    close = container.querySelector("[data-close-demo]"),
    mount = container.querySelector("[data-demo-mount]"),
    status = container.querySelector("[data-demo-status]");
  let frame;
  const sendMotion = () =>
    frame?.contentWindow?.postMessage(
      {
        type: "portfolio-demo-motion",
        paused:
          document.documentElement.classList.contains("motion-paused") ||
          document.hidden,
      },
      "*",
    );
  load.addEventListener("click", () => {
    const url = new URL(load.dataset.loadDemo, location.href);
    if (
      url.origin !== location.origin ||
      ![
        "demos/aranhaverso/index.html",
        "demos/nexusfc/index.html",
        "demos/hogwarts/index.html",
      ].includes(load.dataset.loadDemo)
    ) {
      status.textContent =
        "Demonstração indisponível. Use o link para abrir em outra aba.";
      return;
    }
    frame = document.createElement("iframe");
    frame.title = load.dataset.demoTitle;
    frame.setAttribute(
      "sandbox",
      "allow-scripts allow-popups allow-popups-to-escape-sandbox",
    );
    frame.referrerPolicy = "no-referrer";
    frame.src = url.href;
    frame.className = "project-demo-frame";
    status.textContent = "Carregando demonstração…";
    frame.addEventListener("load", () => {
      status.textContent =
        "Demo visual carregada. Para sair dela pelo teclado, avance até “Fechar demonstração”.";
      sendMotion();
    });
    mount.replaceChildren(frame);
    load.hidden = true;
    close.hidden = false;
    close.focus();
  });
  close.addEventListener("click", () => {
    mount.replaceChildren();
    frame = null;
    load.hidden = false;
    close.hidden = true;
    status.textContent = "Demonstração fechada.";
    load.focus();
  });
  document.addEventListener("portfolio-motion", sendMotion);
  document.addEventListener("visibilitychange", sendMotion);
  if ("IntersectionObserver" in window)
    new IntersectionObserver(([entry]) => {
      frame?.contentWindow?.postMessage(
        {
          type: "portfolio-demo-motion",
          paused:
            !entry.isIntersecting ||
            document.documentElement.classList.contains("motion-paused"),
        },
        "*",
      );
    }).observe(container);
}
