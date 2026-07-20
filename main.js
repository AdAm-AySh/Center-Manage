let teachersData = JSON.parse(localStorage.getItem("centerTeacherData")) || [];
let currentTeacherIndex = null;
let currentGroupIndex = null;

function saveToLocalStorage() {
  localStorage.setItem("centerTeacherData", JSON.stringify(teachersData));
}

document.addEventListener("DOMContentLoaded", () => {
  renderTeachers();
});

function openModal(id) {
  document.getElementById(id).classList.add("active");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

function addTeacher() {
  const nameInput = document.getElementById("teacherNameInput");
  if (nameInput.value.trim() === "") {
    alert("اكتب اسم المدرس الأول");
    return;
  }

  for (let i = 0; i < teachersData.length; i++) {
    const teacher = teachersData[i];
    if (nameInput.value.trim() === teacher.name) {
      return alert("فيه استاذ بنفس الاسم ده!");
    }
  }

  const newTeacher = {
    name: nameInput.value.trim(),
    groups: [],
  };

  teachersData.push(newTeacher);

  saveToLocalStorage();

  closeModal("teacherModal");

  nameInput.value = "";

  renderTeachers();
}

function renderTeachers() {
  const grid = document.getElementById("teachersGrid");
  grid.innerHTML = "";

  teachersData.forEach((teacher, index) => {
    const card = document.createElement("div");
    card.className = "teacher-card";
    card.onclick = () => selectTeacher(index);
    card.innerHTML = `
            <h3>👨‍🏫 أ/ <input type="text" style="width: 100px; text-align: center;" value="${teacher.name}" onchange="updateTeacherName(${index}, this.value)" /></h3>
            <p>عدد المجموعات: ${teacher.groups.length}</p>
            <button class="btn-delete" onclick="event.stopPropagation(); deleteTeacher(${index})">حذف</button>
            `;
    grid.appendChild(card);
  });
}

function selectTeacher(index) {
  currentTeacherIndex = index;
  const teacher = teachersData[index];

  const teacherNameHeading = (document.getElementById(
    "selectedTeacherName",
  ).innerText = `مجموعات المدرس: أ/ ${teacher.name}`);

  let detailsSection = document.getElementById("detailsSection");
  detailsSection.style.display = "block";

  renderGroups();

  if (window.innerWidth <= 768) {
    document.getElementById("sidebar").classList.remove("active");
  }
}

function updateTeacherName(teacherIndex, newName) {
  teachersData[currentTeacherIndex].name = newName;
  saveToLocalStorage();
  renderTeachers();
  renderGroups();
}

function deleteTeacher(teacherindex) {
  if (!confirm(`هل تريد حذف المدرس ${teachersData[teacherindex].name}?`))
    return;

  teachersData.splice(teacherindex, 1);
  saveToLocalStorage();

  if (currentTeacherIndex === teacherindex) {
    currentTeacherIndex = null;
    currentGroupIndex = null;
    const detailsSection = document.getElementById("detailsSection");
    if (detailsSection) detailsSection.style.display = "none";
  } else if (currentTeacherIndex > teacherindex) {
    currentTeacherIndex -= 1;
  }

  renderTeachers();
  if (currentTeacherIndex !== null) renderGroups();
}

function addGroup() {
  const groupNameInput = document.getElementById("groupNameInput");
  const monyMonthInput = document.getElementById("monyMonthInput");
  const selectedTimeInput = document.getElementById("selectedTime");
  if (groupNameInput.value.trim() === "")
    return alert("اكتب اسم المجموعة الأول");

  const newGroup = {
    name: groupNameInput.value.trim(),
    students: [],
    monyMonth: `${monyMonthInput.value.trim()}ج`,
    selectedTime: selectedTimeInput.value.trim(),
  };

  teachersData[currentTeacherIndex].groups.push(newGroup);
  groupNameInput.value = "";
  monyMonthInput.value = "";

  closeModal("groupModal");

  saveToLocalStorage();
  renderGroups();
  renderTeachers();
}

function deleteGroup(groupIndex) {
  const group = teachersData[currentTeacherIndex].groups[groupIndex];
  if (!confirm(`هل تريد حذف المجموعة ${group.name || groupIndex + 1}؟`)) return;

  teachersData[currentTeacherIndex].groups.splice(groupIndex, 1);
  saveToLocalStorage();

  if (currentGroupIndex === groupIndex) {
    currentGroupIndex = null;
  } else if (currentGroupIndex > groupIndex) {
    currentGroupIndex -= 1;
  }

  renderGroups();
}

function updateGroupName(groupIndex, newName) {
  teachersData[currentTeacherIndex].groups[groupIndex].name = newName;
  saveToLocalStorage();
}

function updateSelectedTime(groupIndex, newTime) {
  teachersData[currentTeacherIndex].groups[groupIndex].selectedTime = newTime;
  saveToLocalStorage();
  renderGroups();
}

function updateMonyMonth(groupIndex, newMonyMonth) {
  teachersData[currentTeacherIndex].groups[groupIndex].monyMonth = newMonyMonth;
  saveToLocalStorage();
  renderGroups();
}

function triggerAddStudent(groupIndex) {
  currentGroupIndex = groupIndex;
  openModal("studentModal");
}

function addStudent() {
  const studentNameInput = document.getElementById("studentNameInput");
  if (studentNameInput.value.trim() === "")
    return alert("اكتب اسم الطالب الأول");

  const newStudent = {
    name: studentNameInput.value.trim(),
    payments: [false, false, false, false, false],
    notes: "",
  };

  teachersData[currentTeacherIndex].groups[currentGroupIndex].students.push(
    newStudent,
  );

  studentNameInput.value = "";

  closeModal("studentModal");
  saveToLocalStorage();
  renderGroups();
}

function deleteStudent(groupIndex, studentIndex) {
  const student =
    teachersData[currentTeacherIndex].groups[groupIndex].students[studentIndex];
  if (!confirm(`هل تريد حذف الطالب ${student.name || studentIndex + 1}؟`))
    return;

  teachersData[currentTeacherIndex].groups[groupIndex].students.splice(
    studentIndex,
    1,
  );
  saveToLocalStorage();
  renderGroups();
}

function togglePayment(groupIndex, studentIndex, monthIndex) {
  const currentStatus =
    teachersData[currentTeacherIndex].groups[groupIndex].students[studentIndex]
      .payments[monthIndex];
  teachersData[currentTeacherIndex].groups[groupIndex].students[
    studentIndex
  ].payments[monthIndex] = !currentStatus;

  saveToLocalStorage(); // حفظ بـ JSON
  renderGroups();
}

function updateStudentNotes(groupIndex, studentIndex, noteText) {
  teachersData[currentTeacherIndex].groups[groupIndex].students[
    studentIndex
  ].notes = noteText;
  saveToLocalStorage();
}

function renderGroups() {
  const container = document.getElementById("groupsContainer");
  container.innerHTML = "";

  const groups = teachersData[currentTeacherIndex].groups;
  if (groups.length === 0) {
    container.innerHTML =
      '<p style="color: #64748b;">لا توجد مجموعات مضافة لهذا المدرس بعد.</p>';
    return;
  }

  groups.forEach((group, gIndex) => {
    const groupBox = document.createElement("div");
    groupBox.className = "group-box";

    let html = `
      <div class="group-title-container">
      <div>
        📁 <input type="text" value="${group.name}" onchange="updateGroupName(${gIndex}, this.value)" title="اضغط لتعديل الاسم">
        <button class="btn-primary" style="padding: 5px 10px; font-size: 13px;" onclick="triggerAddStudent(${gIndex})">➕ إضافة طالب</button>
        </div>
          <span style="background: #6795fa; padding: 5px 12px; border-radius: 4px; font-weight: 600; color: #fff;">💰 <input type="text" style="width: 50px;" value="${group.monyMonth || "لم يتم تحديثه"}" onchange="updateMonyMonth(${gIndex}, this.value)" /></span>
        </div>
        `;

    if (group.students.length === 0) {
      html +=
        '<p style="font-size: 14px; color: #94a3b8;">لا يوجد طلاب في هذه المجموعة بعد.</p>';
    } else {
      html += `
        <div class="students-table-wrapper">
          <table class="students-table">
            <thead>
              <tr>
                <th>اسم الطالب</th>
                <th>حالة دفع الحصص / الشهور (5 خانات)</th>
                <th>ملاحظات</th>
              </tr>
            </thead>
            <tbody>
      `;

      group.students.forEach((student, sIndex) => {
        html += `
          <tr>
            <td>
              <div>
                ${sIndex + 1}- 👤 ${student.name}
              </div>
              <button onclick="deleteStudent(${gIndex}, ${sIndex})">حذف</button>
            </td>
            <td>
              <div class="payment-boxes">
        `;

        student.payments.forEach((paid, pIndex) => {
          const payClass = paid ? "pay-box paid" : "pay-box";
          html += `<div class="${payClass}" onclick="togglePayment(${gIndex}, ${sIndex}, ${pIndex})">${group.monyMonth ?? "لم يتم تحديثه"}</div>`;
        });

        html += `
              </div>
            </td>
            <td>
              <input type='text' class='notes-input' value="${student.notes || ""}" onchange="updateStudentNotes(${gIndex}, ${sIndex}, this.value)" placeholder='أضف ملاحظة...'>
            </td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </div>
      `;
    }

    html += `
      <div class="group-info">
        <span>عدد الطلاب: ${group.students.length}</span>
        <span>ميعاد الحصة: <input type="text" style="border: none; color: inherit; font-size: inherit; width: 42px;" value="${group.selectedTime || "مش محدد"}" onchange="updateSelectedTime(${gIndex}, this.value)" /></span>
      </div>
      <button class="delGroup" onclick="deleteGroup(${gIndex})">حذف</button>
    `;

    groupBox.innerHTML = html;
    container.appendChild(groupBox);
  });
}

// localStorage.clear()
