"use strict";

const STORAGE_NAME = "toDoListItems";

const inputElement = $(".form__input");
const listElement = $("ul");
const addBtnElement = $(".form__btn");

$(addBtnElement[0]).on("click", () => {
  if (inputElement[0].value.trim()) {
    const task = {
      id: "id_" + Date.now(),
      text: inputElement[0].value.trim(),
      isChecked: false,
    };

    renderLi(task);

    if (localStorage.getItem(STORAGE_NAME)) {
      const storageData = JSON.parse(localStorage.getItem(STORAGE_NAME));

      storageData.push(task);
      localStorage.setItem(STORAGE_NAME, JSON.stringify(storageData));
    } else {
      localStorage.setItem(STORAGE_NAME, JSON.stringify([task]));
    }

    inputElement[0].value = "";
  } else {
    alert("Task can't be empty");
  }
});

$(listElement[0]).on("click", (event) => {
  if (event.target.className !== "todo-item__delete") {
    return;
  }

  const storageData = JSON.parse(localStorage.getItem(STORAGE_NAME));

  const result = storageData.filter(
    (task) => task.id !== event.target.parentElement.id
  );

  if (result.length > 0) {
    localStorage.setItem(STORAGE_NAME, JSON.stringify(result));
  } else {
    localStorage.clear();
  }

  $(event.target.parentElement.childNodes[0]).off("click", checkboxFunc);
  event.target.parentElement.remove();
});

const checkboxFunc = (event) => {
  const storageData = JSON.parse(localStorage.getItem(STORAGE_NAME));

  const result = storageData.map((task) => {
    if (task.id === event.target.parentElement.id) {
      task.isChecked = event.target.checked;
    }

    return task;
  });

  const currentLiSpanElement = event.target.parentElement.childNodes[1];

  if (event.target.checked) {
    currentLiSpanElement.classList.add("todo-item--checked");
  } else {
    currentLiSpanElement.classList.remove("todo-item--checked");
  }

  localStorage.setItem(STORAGE_NAME, JSON.stringify(result));
};

function renderLi(task) {
  const itemElement = $("<li/>", {
    type: "li",
    class: "todo-item",
    id: task.id,
  });

  const itemCheckboxElement = $("<input/>", {
    type: "checkbox",
    class: "checkbox-item",
    checked: task.isChecked

  });
  itemCheckboxElement.on("click", checkboxFunc);

  const itemSpanElement = $("<span/>", {
    type: "span",
    class: "todo-item__description",
    text: task.text,
  });

  if (task.isChecked) {
    itemSpanElement.addClass("todo-item--checked");
  }

  const delBtnElement = $("<button/>", {
    type: "button",
    class: "todo-item__delete",
    text: "Delete task",
  });

  const modalBtnElement = $("<button/>", {
    type: "button",
    class: "btn btn-primary",
    "data-bs-toggle": "modal",
    "data-bs-target": "#" + task.id,
    text: "Show modal",
  });

  const modalElement = $("<div/>", {
    class: "modal fade",
    id: task.id,
    tabindex: "-1",
    "aria-labelledby": "exampleModalLabel",
    "aria-hidden": "true",
  }).append(
    $("<div/>", { class: "modal-dialog" }).append(
      $("<div/>", { class: "modal-content" }).append(
        $("<div/>", { class: "modal-header" }).append(
          $("<h1/>", {
            class: "modal-title fs-5",
            id: "exampleModalLabel",
            text: "Your task",
          })
        ),
        $("<div/>", { class: "modal-body", text: task.text }),
        $("<div/>", { class: "modal-footer" }).append(
          $("<button/>", {
            type: "button",
            class: "btn btn-secondary",
            "data-bs-dismiss": "modal",
            text: "Close",
          })
        )
      )
    )
  );

  itemElement[0].append(
    itemCheckboxElement[0],
    itemSpanElement[0],
    delBtnElement[0],
    modalBtnElement[0]
  );
  listElement[0].append(itemElement[0]);

  $("body").prepend(modalElement[0]);
}

function init() {
  if (localStorage.getItem(STORAGE_NAME)) {
    const storageData = JSON.parse(localStorage.getItem(STORAGE_NAME));

    storageData.forEach((element) => {
      renderLi(element);
    });
  }
}

init();
