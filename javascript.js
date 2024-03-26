document.addEventListener("DOMContentLoaded", function () {
  const list_task = document.getElementById("list-task");
  const totalTaskElement = document.getElementById("totalTaskElement");
  const taskForm = document.getElementById("taskForm");
  const btnAddTask = document.getElementById("btnAddTask");
  const inputTaskname = document.getElementById("inputTaskname");
  const inputDescription = document.getElementById("inputDescription");
  const btnCancel = document.getElementById("btnCancel");
  const btnConfirmAddTask = document.getElementById("btnConfirmAddTask");
  const addForm = document.getElementById("addForm");
  const btnClose = document.getElementById("btnClose");
  const backdrop = document.getElementById("backdrop");
  const editableContent = document.getElementById("editableContent");
  const btnEditCancel = document.getElementById("btnEditCancel");
  const btnSave = document.getElementById("btnSave");

  // hien thi va khong hien thi form
  btnAddTask.addEventListener("click", function () {
    taskForm.style.display = "block";
    addForm.style.display = "none";
  });

  btnCancel.addEventListener("click", function () {
    taskForm.style.display = "none";
    addForm.style.display = "block";
  });

  // Hàm render ra Task List
  function renderNewTask(taskName, description) {
    const newTaskHTML = `
        <div class="flex items-start pb-6 border-b-2 w-full">
        <input type="checkbox" class="form-checkbox mt-2 rounded-full w-5 h-5">

          <div class=" task-item flex-grow ms-3">
              <label for="form-checkbox" class="text-[10px]">${taskName}</label>
              <p class="text-[#8f9eb4] text-[10px] mt-1">${description}</p>
          </div>
          <div class="dropdown-menu hidden">
              <ul>
                  <li class="border-b-2 px-2"><i class="fa-solid fa-pen fa-2xs" style="color: #a0aec0;" ></i><a href="#" class="update-task font-bold ml-2 text-[10px]">Update</a></li>
                  <li class="px-2 "><i class="fa-solid fa-trash fa-2xs" style="color: #e53e3e;"></i><a href="#" class="delete-task text-[#e53e3e] font-bold ml-2 text-[10px] ">Delete</a></li>
              </ul>
          </div>
          <div class="flex justify-end mt-3">
              <i class="fa-solid fa-ellipsis-vertical fa-xs" style="color: #a0aec0;"></i>
          </div>
        </div>
    `;
    list_task.innerHTML += newTaskHTML;
    updateTotalTasks();

    const ellipsisIcons = document.querySelectorAll(".fa-ellipsis-vertical");

    ellipsisIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const dropdownMenu = this.parentElement.previousElementSibling;
        dropdownMenu.classList.toggle("hidden");
      });
    });

    //xoa task
    const deleteTaskButtons = document.querySelectorAll(".delete-task");
    deleteTaskButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        const taskItem =
          this.parentElement.parentElement.parentElement.parentElement;
        taskItem.remove();
        updateTotalTasks();
      });
    });

    const taskItem = document.querySelectorAll(".task-item");
    taskItem.forEach((click) => {
      click.addEventListener("click", function (event) {
        const clickedElement = event.target;
        const isCheckbox = clickedElement.classList.contains("form-checkbox");
        const isUpdateButton = clickedElement.classList.contains("update-task");

        // Kiểm tra nếu không phải là checkbox hoặc nút Update trong menu
        if (!isCheckbox && !isUpdateButton) {
          // Lấy dropdown-menu để kiểm tra nếu nó đang được hiển thị
          const dropdownMenu = this.querySelector(".dropdown-menu");
          const isDropdownMenuVisible =
            dropdownMenu && !dropdownMenu.classList.contains("hidden");

          // Kiểm tra xem dropdown-menu có đang được hiển thị hay không
          if (!isDropdownMenuVisible) {
            const modal = document.getElementById("modal-container");
            modal.classList.add("show");
          }
        }
        const taskName = this.querySelector("label").textContent;
        const taskDescription = this.querySelector("p").textContent;
        const modalTitle = modal.querySelector(".main-modal label");
        modalTitle.textContent = taskName;
        const modalDescription = modal.querySelector(".main-modal p");
        modalDescription.textContent = taskDescription;
      });
    });

    //sự kiện click cho icon "Update" trong menu
    const updateTaskButtons = document.querySelectorAll(".update-task");
    updateTaskButtons.forEach((button) => {
      button.addEventListener("click", function (event) {
        const modal = document.getElementById("modal-container");
        modal.classList.add("show");

        // hidden menu dropdown sau khi click vào nút "Update"
        const dropdownMenu = this.parentElement.parentElement;
        dropdownMenu.classList.add("hidden");

        event.stopPropagation();
      });
    });

    // close modal
    btnClose.addEventListener("click", function () {
      const modal = document.getElementById("modal-container");
      modal.classList.remove("show");
    });
    // close backdrop modal
    backdrop.addEventListener("click", function () {
      const modal = document.getElementById("modal-container");
      modal.classList.remove("show");
    });
  }

  // kiem tra trang thai checked cua checkbox
  list_task.addEventListener("click", function (event) {
    if (event.target.type === "checkbox") {
      updateTotalTasks();

      const label = event.target.nextElementSibling.querySelector("label");
      const description = event.target.nextElementSibling.querySelector("p");

      if (event.target.checked) {
        label.style.textDecoration = "line-through";
        description.style.textDecoration = "line-through";
      } else {
        label.style.textDecoration = "none";
        description.style.textDecoration = "none";
      }
    }
  });

  // kiểm tra trạng thái checkbox trong modal
  const modalLabel = document.querySelector(
    "#modal-container .main-modal label"
  );
  const modalDescription = document.querySelector(
    "#modal-container .main-modal p"
  );
  const modalCheckbox = document.querySelector(
    "#modal-container .main-modal input[type='checkbox']"
  );

  // Kiểm tra sự kiện click của checkbox trong modal
  modalCheckbox.addEventListener("click", function (event) {
    if (event.target.type === "checkbox") {
      const isChecked = event.target.checked;

      // Cập nhật trạng thái của checkbox trong modal
      modalLabel.style.textDecoration = isChecked ? "line-through" : "none";
      modalDescription.style.textDecoration = isChecked
        ? "line-through"
        : "none";
    }
  });

  //update total Task
  function updateTotalTasks() {
    let checkedTasks = list_task.querySelectorAll(
      'input[type="checkbox"]:checked'
    ).length;
    let totalTasks = list_task.children.length;
    let remainingTasks = totalTasks - checkedTasks;
    totalTaskElement.innerHTML = `${remainingTasks}/${totalTasks} tasks <i class="fa-solid fa-check me-2"></i> `;
  }

  // confirm addTask
  btnConfirmAddTask.addEventListener("click", function () {
    const taskName = inputTaskname.value;
    const description = inputDescription.value;

    if (taskName.trim() !== "" && description.trim() !== "") {
      renderNewTask(taskName, description);

      inputTaskname.value = "";
      inputDescription.value = "";
    }
    taskForm.style.display = "none";
    addForm.style.display = "block";
  });

  // Lấy nội dung ban đầu của label và description
  const getContentOriginal = () => {
    originalContent = {
      label: document.getElementById("modalLabel").textContent,
      description: document.getElementById("modalDes").textContent,
    };
  };

  // Hiển thị hoặc ẩn nút Cancel và Save
  const toggleButtons = (isVisible) => {
    const editableContent = document.getElementById("editableContent");
    if (isVisible) {
      editableContent.classList.add("editing");
      btnEditCancel.style.display = "inline-block";
      btnSave.style.display = "inline-block";
    } else {
      editableContent.classList.remove("editing");
      btnEditCancel.style.display = "none";
      btnSave.style.display = "none";
    }
  };

  // Sự kiện click vào task main để chỉnh sửa nội dung
  editableContent.addEventListener("click", function () {
    getContentOriginal();
    toggleButtons(true);
  });

  // Sự kiện click vào nút Cancel
  btnEditCancel.addEventListener("click", function () {
    document.getElementById("modalLabel").textContent = originalContent.label;
    document.getElementById("modalDes").textContent =
      originalContent.description;
    toggleButtons(false);
  });

  // Sự kiện click vào nút Save
  btnSave.addEventListener("click", function () {
    const newTaskName = modalLabel.textContent;
    const newDescription = modalDescription.textContent;

    document.querySelector(".task-item label").textContent = newTaskName;
    document.querySelector(".task-item p").textContent = newDescription;
    toggleButtons(false);
  });
});
