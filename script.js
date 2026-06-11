const form = document.getElementById("waitlist-form");
const modal = document.getElementById("success-modal");
const modalBox = modal.querySelector(".modal-box-anim");
const closeBtn = document.getElementById("close-modal-btn");
const emailInput = document.getElementById("email-input");

function openModal() {
  modal.classList.remove("opacity-0", "pointer-events-none");
  modalBox.classList.remove("scale-95");
  modalBox.classList.add("scale-100");
}

function closeModal() {
  modal.classList.add("opacity-0", "pointer-events-none");
  modalBox.classList.remove("scale-100");
  modalBox.classList.add("scale-95");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (emailInput.value.trim() !== "") {
    openModal();
    emailInput.value = ""; // Clear input
  }
});

closeBtn.addEventListener("click", closeModal);

// Close on clicking the backdrop overlay
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Close on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});
