(() => {
  const seed = [
    {
      id: 1,
      title: "Explorar o catálogo do PokéLab",
      category: "Estudos",
      priority: "normal",
      done: false,
    },
    {
      id: 2,
      title: "Organizar a semana",
      category: "Pessoal",
      priority: "alta",
      done: false,
    },
    {
      id: 3,
      title: "Conhecer os projetos do portfólio",
      category: "Trabalho",
      priority: "baixa",
      done: true,
    },
  ];
  let tasks = structuredClone(seed),
    editing = null,
    next = 4;
  const $ = (id) => document.getElementById(id),
    feedback = (text) => ($("feedback").textContent = text);
  const priorityName = { alta: "Alta", normal: "Normal", baixa: "Baixa" };
  function render() {
    $("total").textContent = tasks.length;
    $("pending").textContent = tasks.filter((t) => !t.done).length;
    $("done").textContent = tasks.filter((t) => t.done).length;
    const shown = tasks.filter(
      (t) =>
        t.title
          .toLocaleLowerCase("pt-BR")
          .includes($("search").value.trim().toLocaleLowerCase("pt-BR")) &&
        ($("status-filter").value === "all" ||
          t.done === ($("status-filter").value === "done")) &&
        ($("category-filter").value === "all" ||
          t.category === $("category-filter").value) &&
        ($("priority-filter").value === "all" ||
          t.priority === $("priority-filter").value),
    );
    $("tasks").replaceChildren();
    $("empty").hidden = shown.length > 0;
    for (const task of shown) {
      const li = document.createElement("li");
      li.dataset.done = task.done;
      const toggle = document.createElement("input");
      toggle.type = "checkbox";
      toggle.id = `task-${task.id}`;
      toggle.checked = task.done;
      toggle.addEventListener("change", () => {
        task.done = toggle.checked;
        render();
        feedback(task.done ? "Tarefa concluída." : "Tarefa reaberta.");
      });
      const content = document.createElement("div"),
        label = document.createElement("label");
      label.htmlFor = toggle.id;
      label.textContent = task.title;
      const meta = document.createElement("small");
      meta.textContent = `${task.category} · prioridade ${priorityName[task.priority]}`;
      const actions = document.createElement("div");
      actions.className = "actions";
      for (const [name, handler] of [
        [
          "Editar",
          () => {
            editing = task.id;
            $("title").value = task.title;
            $("category").value = task.category;
            $("priority").value = task.priority;
            $("save").textContent = "Salvar alteração";
            $("cancel").hidden = false;
            $("title").focus();
          },
        ],
        [
          "Excluir",
          () => {
            tasks = tasks.filter((t) => t.id !== task.id);
            if (editing === task.id) resetForm();
            render();
            feedback("Tarefa de teste excluída.");
          },
        ],
      ]) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = name;
        button.setAttribute("aria-label", `${name} ${task.title}`);
        button.addEventListener("click", handler);
        actions.append(button);
      }
      content.append(label, meta, actions);
      li.append(toggle, content);
      $("tasks").append(li);
    }
  }
  function resetForm() {
    editing = null;
    $("task-form").reset();
    $("save").textContent = "Adicionar tarefa";
    $("cancel").hidden = true;
  }
  // Capture before the shared preview guard: this specific form edits only in-memory demo data.
  function saveTask() {
      const title = $("title").value.trim();
      if (!title || title.length > 100) {
        feedback("Escreva um título de até 100 caracteres.");
        return;
      }
      const values = {
        title,
        category: $("category").value,
        priority: $("priority").value,
      };
      if (editing !== null)
        Object.assign(
          tasks.find((t) => t.id === editing),
          values,
        );
      else tasks.push({ id: next++, ...values, done: false });
      resetForm();
      render();
      feedback("Tarefa de teste salva nesta aba.");
  }
  $("save").addEventListener("click",saveTask);
  $("task-form").addEventListener("submit",event=>{event.preventDefault();saveTask();});
  $("title").addEventListener("keydown",event=>{if(event.key==='Enter'){event.preventDefault();saveTask();}});
  $("cancel").addEventListener("click", resetForm);
  for (const id of [
    "search",
    "status-filter",
    "category-filter",
    "priority-filter",
  ])
    $(id).addEventListener("input", render);
  $("reset").addEventListener("click", () => {
    tasks = structuredClone(seed);
    next = 4;
    resetForm();
    render();
    feedback("Tarefas fictícias restauradas.");
  });
  $("theme").addEventListener("click", () => {
    const light = document.documentElement.dataset.theme !== "light";
    document.documentElement.dataset.theme = light ? "light" : "dark";
    $("theme").textContent = light ? "Usar tema escuro" : "Usar tema claro";
  });
  render();
})();
