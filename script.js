// ใช้ LocalStorage เก็บข้อมูลภายใต้ key นี้
const STORAGE_KEY = "daily_expenses_v1";

let expenses = [];

// DOM
const itemInput = document.getElementById("item");
const amountInput = document.getElementById("amount");
const addBtn = document.getElementById("addBtn");
const listEl = document.getElementById("expense-list");
const totalEl = document.getElementById("total");
const clearBtn = document.getElementById("clearBtn");

// โหลดข้อมูลตอนเริ่มหน้า
function loadExpenses() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      expenses = JSON.parse(raw);
    } catch (e) {
      expenses = [];
    }
  } else {
    expenses = [];
  }
  render();
}

// บันทึกลง LocalStorage
function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

// เพิ่มรายการใหม่
function addExpense() {
  const item = itemInput.value.trim();
  const amountVal = amountInput.value;

  if (!item || amountVal === "") {
    alert("กรุณาใส่ชื่อรายการและจำนวนเงิน");
    return;
  }

  const amount = parseFloat(amountVal);
  if (Number.isNaN(amount) || amount < 0) {
    alert("จำนวนเงินต้องเป็นตัวเลขที่ไม่ติดลบ");
    return;
  }

  // สร้าง id ง่าย ๆ ด้วยเวลา
  const id = Date.now().toString();

  expenses.push({ id, item, amount });
  saveExpenses();
  render();

  // เคลียร์ฟอร์ม
  itemInput.value = "";
  amountInput.value = "";
  itemInput.focus();
}

// ลบรายการตาม id
function deleteExpense(id) {
  if (!confirm("ต้องการลบรายการนี้หรือไม่?")) return;
  expenses = expenses.filter(e => e.id !== id);
  saveExpenses();
  render();
}

// ล้างทั้งหมด
function clearAll() {
  if (!confirm("ล้างข้อมูลทั้งหมดจริงหรือไม่?")) return;
  expenses = [];
  saveExpenses();
  render();
}

// แสดงผลในหน้า
function render() {
  // ลิสต์
  listEl.innerHTML = "";
  let total = 0;

  if (expenses.length === 0) {
    const li = document.createElement("li");
    li.textContent = "ยังไม่มีรายการ";
    li.style.background = "transparent";
    li.style.color = "#666";
    listEl.appendChild(li);
  } else {
    // แสดงรายการล่าสุดบนสุด
    [...expenses].reverse().forEach(e => {
      const li = document.createElement("li");

      const left = document.createElement("div");
      left.className = "item-left";
      const name = document.createElement("div");
      name.className = "small";
      name.textContent = e.item;
      const meta = document.createElement("div");
      meta.className = "small";
      const date = new Date(parseInt(e.id, 10));
      meta.textContent = `${date.toLocaleString()}`;

      left.appendChild(name);
      left.appendChild(meta);

      const right = document.createElement("div");
      right.style.display = "flex";
      right.style.alignItems = "center";
      right.style.gap = "10px";

      const amt = document.createElement("div");
      amt.textContent = `${e.amount.toFixed(2)} บาท`;
      amt.className = "small";

      const actions = document.createElement("div");
      actions.className = "actions";
      const delBtn = document.createElement("button");
      delBtn.className = "action-btn delete";
      delBtn.textContent = "ลบ";
      delBtn.onclick = () => deleteExpense(e.id);

      actions.appendChild(delBtn);
      right.appendChild(amt);
      right.appendChild(actions);

      li.appendChild(left);
      li.appendChild(right);
      listEl.appendChild(li);

      total += Number(e.amount);
    });
  }

  totalEl.textContent = `รวมทั้งหมด: ${total.toFixed(2)} บาท`;
}

// event listeners
addBtn.addEventListener("click", addExpense);
amountInput.addEventListener("keydown", (ev) => {
  // กด Enter ในช่องจำนวน = บันทึก
  if (ev.key === "Enter") addExpense();
});
clearBtn.addEventListener("click", clearAll);

// init
loadExpenses();
