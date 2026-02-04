// Open/close modals
document.addEventListener("click", (e) => {
  const trigger = e.target.closest(
    "[data-action='open-modal'], [data-action='close-modal']",
  );
  if (!trigger) return;

  const action = trigger.dataset.action;

  if (action === "open-modal") {
    const modal = document.querySelector(trigger.dataset.modal);
    if (!modal) return;

    if (modal.id === "editModal") {
      modal.dataset.mode = "edit";

      console.log("dataset is");
      console.log(modal.querySelector("input[name='id']"));

      modal.querySelector("[name='id']").value = trigger.dataset.id;
      modal.querySelector("#title").value = trigger.dataset.title;
      modal.querySelector("#title").readOnly = true;
      modal.querySelector("[data-selected-title]").value =
        trigger.dataset.title;
      modal.querySelector("#date").value = trigger.dataset.date;
      modal.querySelector("#rating").value = trigger.dataset.rating;
      modal.querySelector("#review").value = trigger.dataset.review;
    }

    if (modal.id === "addModal") {
      modal.dataset.mode = "add";
    }

    modal?.classList.remove("hidden");
  }

  if (action === "close-modal") {
    const modal = trigger.closest(".modal");
    modal?.classList.add("hidden");
  }
});

// Options in mobile view
document.addEventListener("click", (e) => {
  // Toggle menu
  const menuBtn = e.target.closest("[data-action='toggle-menu']");
  if (menuBtn) {
    const card = menuBtn.closest(".card");
    const menu = card.querySelector(".card-menu");

    // Close other menus
    document.querySelectorAll(".card-menu:not(.hidden)").forEach((m) => {
      if (m !== menu) m.classList.add("hidden");
    });

    menu.classList.toggle("hidden");
    return;
  }

  // Close menus on outside click
  if (!e.target.closest(".card-menu")) {
    document
      .querySelectorAll(".card-menu")
      .forEach((m) => m.classList.add("hidden"));
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("modal")) return;
  e.target.classList.add("hidden");
});

// Searching suggestions
const autocompleteTimeout = null;

document.addEventListener("input", (e) => {
  const input = e.target.closest("input[data-autocomplete='title']");
  if (!input) return;

  const group = input.closest(".input-group");
  const hiddenInput = group.querySelector("[data-selected-title]");
  const query = input.value.trim();

  // Invalidate previously selected title
  hiddenInput.value = "";

  clearTimeout(autocompleteTimeout);

  if (query.length < 2) {
    hideSuggestions(input);
    return;
  }

  autocompleteTimeout = setTimeout(async () => {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const results = await res.json();
      showSuggestions(input, results);
    } catch (err) {
      console.error(err);
      hideSuggestions(input);
    }
  }, 300);
});

function showSuggestions(input, results) {
  const group = input.closest(".input-group");
  const list = group.querySelector(".autocomplete-list");
  const hiddenInput = group.querySelector("[data-selected-title]");

  list.innerHTML = "";

  if (!results.length) {
    list.classList.add("hidden");
    return;
  }

  results.forEach(({ title }) => {
    const li = document.createElement("li");
    li.textContent = title;
    li.tabIndex = 0; // accessibility

    li.addEventListener("click", () => {
      input.value = title; // display
      hiddenInput.value = title; // actual submitted value
      list.classList.add("hidden");
    });

    list.appendChild(li);
  });

  list.classList.remove("hidden");
}

function hideSuggestions(input) {
  const list = input
    .closest(".input-group")
    ?.querySelector(".autocomplete-list");

  list?.classList.add("hidden");
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".input-group")) {
    document
      .querySelectorAll(".autocomplete-list")
      .forEach((list) => list.classList.add("hidden"));
  }
});

document.addEventListener("submit", (e) => {
  const form = e.target;
  const modal = form.closest(".modal");
  if (modal?.dataset.mode === "edit") return;

  const hiddenInput = form.querySelector("[data-selected-title]");
  if (hiddenInput && !hiddenInput.value) {
    e.preventDefault();
    alert("Please select a title from the suggestions.");
  }
});

// Select sorting & order
document.addEventListener("change", (e) => {
  const form = e.target.closest("#sortForm");
  if (!form) return;

  form.submit();
});

// Card hover effects
document.addEventListener("mouseover", (e) => {
  const card = e.target.closest("[data-action='card-hover']");
  if (!card) return;

  card.querySelector(".editIcon").classList.remove("hidden");
  card.querySelector(".delIcon").classList.remove("hidden");
});

document.addEventListener("mouseout", (e) => {
  const card = e.target.closest("[data-action='card-hover']");
  if (!card) return;

  card.querySelector(".editIcon").classList.add("hidden");
  card.querySelector(".delIcon").classList.add("hidden");
});
