const addBtn = document.querySelector("#add");
const cancelBtn = document.querySelector("#cancel");
const saveBtn = document.querySelector("#save");
const form = document.querySelector(".form-add");
const container = document.querySelector(".remind-list");

var remindList = null;

var data = [];
chrome.storage.sync.get("dataRemind", function (res) {
  data = res.dataRemind ? res.dataRemind : [];
  render(...data);
  resetRemindList();
});
function getDataForm() {
  let dataForm = {
    date: document.querySelector("#date").value,
    title: document.querySelector("#title").value,
    content: document.querySelector("#content").value,
    inAdvance: document.querySelector("#inAdvance").value,
    repeat: document.querySelector("#repeat").checked,
  };
  return dataForm;
}
function setDataForm(index, { date, title, content, inAdvance, repeat }) {
  document.querySelector("#index").value = index;
  document.querySelector("#date").value = date;
  document.querySelector("#title").value = title;
  document.querySelector("#content").value = content;
  document.querySelector("#inAdvance").value = inAdvance;
  document.querySelector("#repeat").checked = repeat;
}
function resetRemindList() {
  remindList = document.querySelectorAll(".remind-item");
  remindList.forEach((item, index) => {
    item.children[0].addEventListener("click", () => {
      let classArr = item.classList;
      let itemData = data[classArr[classArr.length - 1]];
      form.classList.add("active");
      setDataForm(index, itemData);
    });
    item.children[1].addEventListener("click", () => {
      remove(index);
      resetRemindList();
    });
  });
  chrome.storage.sync.set({ dataRemind: data }, function () {
    
  });
}
function render(...remindArr) {
  container.innerHTML = "";
  remindArr.forEach((item, index) => {
    container.innerHTML += `<li class="remind-item ${index}">
    <div class="content">
        <p class="time">${new Date(item.date).toJSON().slice(5, 10)}</p>
        <p class="description">${item.title}</p>
    </div>
    <button>&times;</button>
</li> `;
  });
}
function remove(index) {
  data.splice(index, 1);
  render(...data);
}
function resetForm() {
  document.querySelector("#index").value = -1;
  document.querySelector("#date").value = null;
  document.querySelector("#title").value = "";
  document.querySelector("#content").value = "";
  document.querySelector("#inAdvance").value = 1;
  document.querySelector("#repeat").checked = false;
}
var formModel = {
  date: null,
  title: null,
  content: null,
  inAdvance: null,
  repeat: false,
};

addBtn.addEventListener("click", () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.querySelector("#date").valueAsDate = tomorrow;
  document.querySelector("#index").value = -1;
  form.classList.add("active");
});

cancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  form.classList.remove("active");
  resetForm();
});

saveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let dataForm = getDataForm();
  let index = document.querySelector("#index").value;
  if (index >= 0) {
    data[index] = dataForm;
  } else {
    data = [dataForm, ...data];
  }
  render(...data);
  resetRemindList();
  cancelBtn.click();
});
