"use strict";

var STORAGE_NAME = "toDoListItems";
var inputElement = $(".form__input");
var listElement = $("ul");
var addBtnElement = $(".form__btn");
$(addBtnElement[0]).on("click", function () {
  if (inputElement[0].value.trim()) {
    var task = {
      id: "id_" + Date.now(),
      text: inputElement[0].value.trim(),
      isChecked: false
    };
    renderLi(task);
    if (localStorage.getItem(STORAGE_NAME)) {
      var storageData = JSON.parse(localStorage.getItem(STORAGE_NAME));
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
$(listElement[0]).on("click", function (event) {
  if (event.target.className !== "todo-item__delete") {
    return;
  }
  var storageData = JSON.parse(localStorage.getItem(STORAGE_NAME));
  var result = storageData.filter(function (task) {
    return task.id !== event.target.parentElement.id;
  });
  if (result.length > 0) {
    localStorage.setItem(STORAGE_NAME, JSON.stringify(result));
  } else {
    localStorage.clear();
  }
  $(event.target.parentElement.childNodes[0]).off("click", checkboxFunc);
  event.target.parentElement.remove();
});
var checkboxFunc = function checkboxFunc(event) {
  var storageData = JSON.parse(localStorage.getItem(STORAGE_NAME));
  var result = storageData.map(function (task) {
    if (task.id === event.target.parentElement.id) {
      task.isChecked = event.target.checked;
    }
    return task;
  });
  var currentLiSpanElement = event.target.parentElement.childNodes[1];
  if (event.target.checked) {
    currentLiSpanElement.classList.add("todo-item--checked");
  } else {
    currentLiSpanElement.classList.remove("todo-item--checked");
  }
  localStorage.setItem(STORAGE_NAME, JSON.stringify(result));
};
function renderLi(task) {
  var itemElement = $("<li/>", {
    type: "li",
    "class": "todo-item",
    id: task.id
  });
  var itemCheckboxElement = $("<input/>", {
    type: "checkbox",
    "class": "checkbox-item",
    checked: task.isChecked
  });
  itemCheckboxElement.on("click", checkboxFunc);
  var itemSpanElement = $("<span/>", {
    type: "span",
    "class": "todo-item__description",
    text: task.text
  });
  if (task.isChecked) {
    itemSpanElement.addClass("todo-item--checked");
  }
  var delBtnElement = $("<button/>", {
    type: "button",
    "class": "todo-item__delete",
    text: "Delete task"
  });
  var modalBtnElement = $("<button/>", {
    type: "button",
    "class": "btn btn-primary",
    "data-bs-toggle": "modal",
    "data-bs-target": "#" + task.id,
    text: "Show modal"
  });
  var modalElement = $("<div/>", {
    "class": "modal fade",
    id: task.id,
    tabindex: "-1",
    "aria-labelledby": "exampleModalLabel",
    "aria-hidden": "true"
  }).append($("<div/>", {
    "class": "modal-dialog"
  }).append($("<div/>", {
    "class": "modal-content"
  }).append($("<div/>", {
    "class": "modal-header"
  }).append($("<h1/>", {
    "class": "modal-title fs-5",
    id: "exampleModalLabel",
    text: "Your task"
  })), $("<div/>", {
    "class": "modal-body",
    text: task.text
  }), $("<div/>", {
    "class": "modal-footer"
  }).append($("<button/>", {
    type: "button",
    "class": "btn btn-secondary",
    "data-bs-dismiss": "modal",
    text: "Close"
  })))));
  itemElement[0].append(itemCheckboxElement[0], itemSpanElement[0], delBtnElement[0], modalBtnElement[0]);
  listElement[0].append(itemElement[0]);
  $("body").prepend(modalElement[0]);
}
function init() {
  if (localStorage.getItem(STORAGE_NAME)) {
    var storageData = JSON.parse(localStorage.getItem(STORAGE_NAME));
    storageData.forEach(function (element) {
      renderLi(element);
    });
  }
}
init();
