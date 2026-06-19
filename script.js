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
  
  const intentInput = document.querySelector('input[name="intent"]:checked');
  
  if (emailInput.value.trim() !== "" && intentInput) {
    openModal();
    emailInput.value = ""; // Clear input
    intentInput.checked = false; // Clear selection
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

// Mouse parallax effect for floating icons
document.addEventListener("mousemove", (e) => {
  const x = (window.innerWidth - e.pageX * 2) / 90;
  const y = (window.innerHeight - e.pageY * 2) / 90;
  
  const leftIcons = document.querySelector('.slide-in-left');
  const rightIcons = document.querySelector('.slide-in-right');
  
  if (leftIcons) {
    leftIcons.style.translate = `${x}px ${y}px`;
  }
  if (rightIcons) {
    rightIcons.style.translate = `${-x}px ${-y}px`;
  }
  
  const circles = document.querySelectorAll('.circle-svg');
  circles.forEach(circle => {
    circle.style.translate = `${x * 0.5}px ${y * 0.5}px`;
  });
  
  const heroText = document.querySelector('.hero-heading');
  const metaText = document.querySelector('.meta-text');
  
  if (heroText) {
    heroText.style.translate = `${x * 0.2}px ${y * 0.2}px`;
  }
  if (metaText) {
    metaText.style.translate = `${x * 0.3}px ${y * 0.3}px`;
  }
});
