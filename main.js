const taskInput = document.getElementById("taskInput");
const taskDescription = document.getElementById("taskDescription");
const addTaskButton = document.querySelector(".add-btn");
const taskList = document.getElementById("taskList");

let todoList = [];

// check for invalid input
function inputValidation() {
  let isValid = true;

  let regexTask = /^[A-Z][a-z\s]{3,8}$/;
  let regexDescription = /^[a-zA-Z0-9\s]{20,40}$/;
  let existingSpan = taskInput.nextElementSibling;
  if (existingSpan && existingSpan.tagName === "SPAN") {
    existingSpan.remove();
  }

  if (!regexTask.test(taskInput.value)) {
    createErrorMessage(
      "please enter first letter capital and 5-8 small characters.",
      "span",
      taskInput
    );
    taskInput.classList.add("input-error");
    isValid = false;
  } else {
    taskInput.classList.remove("input-error");
  }

  let existingSpanDes = taskDescription.nextElementSibling;
  if (existingSpanDes && existingSpanDes.tagName === "SPAN") {
    existingSpanDes.remove();
  }

  if (!regexDescription.test(taskDescription.value)) {
    createErrorMessage(
      "please enter at lest 20 characters.",
      "span",
      taskDescription
    );
    taskDescription.classList.add("input-error");
    isValid = false;
  } else {
    taskDescription.classList.remove("input-error");
  }

  return isValid;
}
// create html element to display error message to user
function createErrorMessage(message, type, elementPosition) {
  let mySpan = document.createElement(type);
  mySpan.textContent = message;
  elementPosition.insertAdjacentElement("afterend", mySpan);
}

// create tasks and add it in (todo) array
function getTasks(e) {
  e.preventDefault();
  if (!inputValidation()) return;

  let todoData = {
    id: Math.random(),
    task: taskInput.value,
    description: taskDescription.value,
    isComplete: false,
    isEditing: false,
  };

  todoList.push(todoData);
  setToLocalStorage();
  renderTasks(todoList);
  taskInput.value = "";
  taskDescription.value = "";
}

addTaskButton.addEventListener("click", getTasks);

// render html elements
function renderTasks(list) {
  taskList.innerHTML = "";
  list.forEach((task, i) => {
    taskList.innerHTML += `
    <div class="taskList_container">
    <li class="task-container ${task.isComplete ? "complete" : ""}"
     id="${task.id}">
      <div>
        <p class="task">${task.task}</p>
        <p class="description">${task.description}</p>
      </div>
        <div class="btns">
          <button class="complete-btn" onclick="toggleComplete(${task.id})">${
      task.isComplete ? "Undo" : "Complete"
    }</button>
          <button id="edit_${task.id}" class="edit" onclick="editTask(${
      task.id
    })">Edit</button>
          <button id="delete-btn" onclick="deleteTask(${
            task.id
          })">Delete</button>
        </div>
      </li>
    </div>
    `;
  });
}

// add todo list array to local storge
function setToLocalStorage() {
  localStorage.setItem("todoList", JSON.stringify(todoList));
}

if (localStorage.getItem("todoList") != null) {
  todoList = JSON.parse(localStorage.getItem("todoList"));
  renderTasks(todoList);
}

// search input function
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", searchTasks);

function searchTasks() {
  const searchValue = searchInput.value.toLowerCase();
  const searchedList = todoList.filter((todo) => {
    return todo.task.toLowerCase().includes(searchValue);
  });

  renderTasks(searchedList);
}

function findTodoIndex(id) {
  let index = todoList.findIndex((ele) => ele.id === id);
  return index;
}

// delete tasks from the todos array and rerender the array
function deleteTask(id) {
  todoList.splice(findTodoIndex(id), 1);
  setToLocalStorage();
  renderTasks(todoList);
}

//complete task function
function toggleComplete(id) {
  const index = findTodoIndex(id);
  todoList[index].isComplete = !todoList[index].isComplete;
  setToLocalStorage();
  renderTasks(todoList);
}

// edit tasks
function editTask(id) {
  const index = findTodoIndex(id);
  todoList[index].isEditing = true;
  const listElement = document.getElementById(id);
  listElement.classList.add("active");

  const editButton = document.getElementById(`edit_${id}`);

  taskInput.value = todoList[index].task;
  taskDescription.value = todoList[index].description;
  taskInput.focus();
  editButton.textContent = "Save";
  // disabled add button
  addTaskButton.disabled = true;

  editButton.onclick = function () {
    // validate the editing inputs
    if (!inputValidation()) return;

    todoList[index].task = taskInput.value;
    todoList[index].description = taskDescription.value;

    taskInput.value = "";
    taskDescription.value = "";
    todoList[index].isEditing = false;
    listElement.classList.remove("active");

    editButton.textContent = "Edit";
    addTaskButton.disabled = false;
    setToLocalStorage();
    renderTasks(todoList);
  };
}
