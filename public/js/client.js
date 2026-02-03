// Open/close modals
document.addEventListener("click", (e) => {
  let trigger = e.target.closest(
    "[data-action='open-modal'], [data-action='close-modal']",
  );
  if (!trigger) return;

  let action = trigger.dataset.action;

  if (action === "open-modal") {
    let modal = document.querySelector(trigger.dataset.modal);
    modal?.classList.remove("hidden");
  }

  if (action === "close-modal") {
    let modal = trigger.closest(".modal");
    modal?.classList.add("hidden");
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("modal")) return;
  e.target.classList.add("hidden");
});

// Searching suggestions
let autocompleteTimeout = null;

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
  const hiddenInput = form.querySelector("[data-selected-title]");

  if (hiddenInput && !hiddenInput.value) {
    e.preventDefault();
    alert("Please select a title from the suggestions.");
  }
});

// Select sorting & order
document.addEventListener("change", (e) => {
  let form = e.target.closest("#sortForm");
  if (!form) return;

  form.submit();
});

// Card hover effects
document.addEventListener("mouseover", (e) => {
  let card = e.target.closest("[data-action='card-hover']");
  if (!card) return;

  card.querySelector(".editIcon").classList.remove("hidden");
  card.querySelector(".delIcon").classList.remove("hidden");
});

document.addEventListener("mouseout", (e) => {
  let card = e.target.closest("[data-action='card-hover']");
  if (!card) return;

  card.querySelector(".editIcon").classList.add("hidden");
  card.querySelector(".delIcon").classList.add("hidden");
});
