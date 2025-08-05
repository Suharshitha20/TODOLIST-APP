document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("taskInput");
  const timeInput = document.getElementById("timeInput");
  const button = document.querySelector("button");
  const formContainer = document.querySelector(".form");

  const taskList = document.createElement("div");
  taskList.className = "task-list";
  formContainer.after(taskList);

  let totalTasks = 0;
  let completedTasks = 0;

  const updateStats = () => {
    const progress = document.querySelector(".progress");
    const stats = document.querySelector(".stats-numbers p");
    const percentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    progress.style.width = `${percentage}%`;
    stats.textContent = `${completedTasks} / ${totalTasks}`;

    if (totalTasks > 0 && completedTasks === totalTasks) {
      // All tasks completed – trigger celebration!
      if (typeof confetti === "function") {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
        });

        setTimeout(() => {
          alert("🎉 Congratulations! All tasks completed!");
        }, 500);
      } else {
        console.log("⚠️ Confetti function not found.");
      }
    }
  }; // 👈 This closing brace was missing

  const createTaskElement = (text, time) => {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "check";

    const taskText = document.createElement("span");
    taskText.textContent = text;
    taskText.className = "task-text";

    const timeDisplay = document.createElement("span");
    timeDisplay.className = "task-time";
    timeDisplay.textContent = time ? `⏰ ${time}` : "";

    const editBtn = document.createElement("span");
    editBtn.className = "icon edit";
    editBtn.innerHTML = "&#9998;";

    const deleteBtn = document.createElement("span");
    deleteBtn.className = "icon delete";
    deleteBtn.innerHTML = "&#128465;";

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        taskText.classList.add("done");
        completedTasks++;
      } else {
        taskText.classList.remove("done");
        completedTasks--;
      }
      updateStats();
    });

    editBtn.addEventListener("click", () => {
      const newText = prompt("Edit task:", taskText.textContent);
      if (newText !== null) taskText.textContent = newText.trim();
    });

    deleteBtn.addEventListener("click", () => {
      if (checkbox.checked) completedTasks--;
      totalTasks--;
      taskItem.remove();
      updateStats();
    });

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(timeDisplay);
    taskItem.appendChild(editBtn);
    taskItem.appendChild(deleteBtn);

    return taskItem;
  };

  const addTask = () => {
    const taskText = input.value.trim();
    const taskTime = timeInput.value;

    if (taskText === "") return;

    const taskElement = createTaskElement(taskText, taskTime);
    taskList.appendChild(taskElement);

    input.value = "";
    timeInput.value = "";
    totalTasks++;
    updateStats();
  };

  button.addEventListener("click", addTask);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
    }
  });

  updateStats();
});
