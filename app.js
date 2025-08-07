document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("taskInput");
  const fromTimeInput = document.getElementById("fromTimeInput");
  const toTimeInput = document.getElementById("toTimeInput");
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

    if (progress) progress.style.width = `${percentage}%`;
    if (stats) stats.textContent = `${completedTasks} / ${totalTasks}`;

    if (totalTasks > 0 && completedTasks === totalTasks) {
      setTimeout(() => {
        if (typeof confetti === "function") {
          confetti({
            particleCount: 200,
            spread: 80,
            origin: { y: 0.6 }
          });
          alert("🎉 Congratulations! All tasks completed!");
        }
      }, 500);
    }
  };

  const createTaskElement = (text, timeRange) => {
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
    timeDisplay.textContent = `⏰ ${timeRange}`;

    const countdownDisplay = document.createElement("span");
    countdownDisplay.className = "task-time";
    countdownDisplay.style.marginLeft = "10px";

    const playBtn = document.createElement("button");
    playBtn.textContent = "▶️";
    playBtn.className = "icon";

    const pauseBtn = document.createElement("button");
    pauseBtn.textContent = "⏸️";
    pauseBtn.className = "icon";

    let intervalId = null;

    const [fromTimeStr, toTimeStr] = timeRange.split(" - ");
    const fromTime = new Date();
    const toTime = new Date();
    const [fromHours, fromMinutes] = fromTimeStr.split(":").map(Number);
    const [toHours, toMinutes] = toTimeStr.split(":").map(Number);
    fromTime.setHours(fromHours, fromMinutes, 0);
    toTime.setHours(toHours, toMinutes, 0);

    function updateCountdown() {
      const now = new Date();
      const remaining = toTime - now;

      if (remaining <= 0) {
        clearInterval(intervalId);
        countdownDisplay.textContent = "⏰ Time's up!";
        countdownDisplay.style.color = "red";
        return;
      }

      const hrs = Math.floor(remaining / (1000 * 60 * 60));
      const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((remaining % (1000 * 60)) / 1000);

      countdownDisplay.textContent = `⏳ ${hrs}h ${mins}m ${secs}s`;
    }

    playBtn.addEventListener("click", () => {
      if (intervalId === null) {
        updateCountdown();
        intervalId = setInterval(updateCountdown, 1000);
      }
    });

    pauseBtn.addEventListener("click", () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    });

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
      const newFromTime = prompt("Edit start time:", fromTimeStr);
      const newToTime = prompt("Edit end time:", toTimeStr);
      if (newFromTime && newToTime) {
        timeDisplay.textContent = `⏰ ${newFromTime} - ${newToTime}`;
      }
    });

    deleteBtn.addEventListener("click", () => {
      if (checkbox.checked) completedTasks--;
      totalTasks--;
      clearInterval(intervalId);
      taskItem.remove();
      updateStats();
    });

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(timeDisplay);
    taskItem.appendChild(countdownDisplay);
    taskItem.appendChild(playBtn);
    taskItem.appendChild(pauseBtn);
    taskItem.appendChild(editBtn);
    taskItem.appendChild(deleteBtn);

    return taskItem;
  };

  const addTask = () => {
    const taskText = input.value.trim();
    const fromTime = fromTimeInput.value;
    const toTime = toTimeInput.value;

    if (taskText === "" || fromTime === "" || toTime === "") return;

    const taskElement = createTaskElement(taskText, `${fromTime} - ${toTime}`);
    taskList.appendChild(taskElement);

    input.value = "";
    fromTimeInput.value = "";
    toTimeInput.value = "";
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
