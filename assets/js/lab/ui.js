export function mount(panel) {
  const form = panel.querySelector(".ui-controls"),
    preview = panel.querySelector("[data-ui-preview]"),
    code = panel.querySelector("[data-ui-code]"),
    status = panel.querySelector("[data-ui-status]");
  const defaults = {
    color: "#709bff",
    radius: 14,
    border: 1,
    spacing: 24,
    shadow: 20,
    format: "button",
    animation: "lift",
  };
  const controls = [...panel.querySelectorAll("[data-ui-control]")];
  function update() {
    const v = Object.fromEntries(
      controls.map((c) => [c.dataset.uiControl, c.value]),
    );
    for (const k of ["radius", "border", "spacing", "shadow"]) {
      const c = controls.find((c) => c.dataset.uiControl === k);
      v[k] = Math.max(
        Number(c.min),
        Math.min(Number(c.max), Number(v[k]) || 0),
      );
      preview.style.setProperty(`--ui-${k}`, `${v[k]}px`);
      panel.querySelector(`[data-ui-output="${k}"]`).textContent = `${v[k]} px`;
    }
    v.color = /^#[0-9a-f]{6}$/i.test(v.color) ? v.color : defaults.color;
    preview.style.setProperty("--ui-color", v.color);
    preview.dataset.animation = v.animation;
    panel
      .querySelectorAll("[data-ui-shape]")
      .forEach((s) => (s.hidden = s.dataset.uiShape !== v.format));
    const shapeStyles =
      v.format === "panel"
        ? "  flex-direction: column;\n  align-items: flex-start;\n"
        : "";
    const transform =
      { lift: "translateY(-4px)", scale: "scale(1.04)", none: "none" }[
        v.animation
      ] || "none";
    const css = getComputedStyle(preview);
    const ink = css.getPropertyValue("--ui-ink").trim() || "#f1f5ff",
      surface = css.getPropertyValue("--ui-surface").trim() || "#0d1525";
    const shadow = css.getPropertyValue("--sample-shadow").trim() || "#0005";
    code.textContent = `.playground-component {\n  display: inline-flex;\n  align-items: center;\n${shapeStyles}\n  font: 12px/1.7 "DM Sans", sans-serif;\n  gap: 12px;\n  padding: ${v.spacing}px;\n  border: ${v.border}px solid ${v.color};\n  border-radius: ${v.radius}px;\n  color: ${ink};\n  background: ${surface};\n  box-shadow: 0 calc(${v.shadow}px / 3) ${v.shadow}px ${shadow};\n  transition: transform 240ms ease-out;\n}\n.playground-component:is(:hover, :focus-visible) {\n  transform: ${transform};\n}\n@media (prefers-reduced-motion: reduce) {\n  .playground-component { transition: none; }\n  .playground-component:is(:hover, :focus-visible) { transform: none; }\n}`;
  }
  form.addEventListener("submit", (e) => e.preventDefault());
  controls.forEach((c) => c.addEventListener("input", update));
  panel.querySelector("[data-ui-reset]").addEventListener("click", () => {
    controls.forEach((c) => (c.value = defaults[c.dataset.uiControl]));
    update();
    status.textContent = "Valores restaurados.";
  });
  panel.querySelector("[data-copy-css]").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code.textContent);
      status.textContent = "CSS copiado.";
    } catch {
      const selection = getSelection(),
        range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent =
        "Código selecionado. Use o comando copiar do seu navegador.";
    }
  });
  update();
  new MutationObserver(update).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return {};
}
