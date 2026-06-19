const ARA_BASE_URL = window.ENV.ARA_BASE_URL;

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

function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  
  const baseClasses = "flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl transform transition-all duration-300 translate-x-[120%] opacity-0 pointer-events-auto border backdrop-blur-md max-w-[350px]";
  let typeClasses = "";
  let iconHtml = "";
  
  if (type === 'success') {
    typeClasses = "bg-[#FFFFFF] dark:bg-[#1a140e] border-[1.4px] border-[#DBE1E7] dark:border-[#FFC02E] text-[#656565] dark:text-white";
    iconHtml = `<svg class="w-6 h-6 flex-shrink-0 text-[#F7B832]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>`;
  } else if (type === 'error') {
    typeClasses = "bg-[#FFFFFF] dark:bg-[#1a140e] border-[1.4px] border-[#DBE1E7] dark:border-[#FFC02E] text-[#656565] dark:text-white";
    iconHtml = `<svg class="w-6 h-6 flex-shrink-0 text-[#F7B832]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
  }

  toast.className = `${baseClasses} ${typeClasses}`;
  toast.innerHTML = `
    ${iconHtml}
    <p class="text-[14px] font-semibold leading-snug toast-text"></p>
  `;
  
  // Safely inject text to prevent XSS
  toast.querySelector('.toast-text').textContent = message;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-x-[120%]', 'opacity-0');
    toast.classList.add('translate-x-0', 'opacity-100');
  });

  // Remove after 4 seconds
  setTimeout(() => {
    toast.classList.remove('translate-x-0', 'opacity-100');
    toast.classList.add('translate-x-[120%]', 'opacity-0');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const submitBtn = document.getElementById("submit-button");
  const email = emailInput.value.trim();
  
  if (!email) {
    showToast("Please enter your email address.", "error");
    return;
  }
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showToast("Please enter a valid email address.", "error");
    return;
  }

  const intentInput = document.querySelector('input[name="intent"]:checked');
  if (!intentInput) {
    showToast("Please select what you plan to use Ara for.", "error");
    return;
  }
  
  const intent = intentInput.value;
  
  // Set loading state
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "Joining...";
    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-75", "cursor-not-allowed");

    try {
      const response = await fetch(`${ARA_BASE_URL}/api/v1/waitlist/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, intent })
      });

      const data = await response.json().catch(() => null);

      if (response.status === 201) {
        // We can still trigger the big modal if we want, but let's use the toast for consistency.
        openModal(); // Keeping the big fancy modal for success because it has confetti
        showToast("Welcome abroad! You have successfully joined the Ara waitlist.", "success");
        emailInput.value = ""; 
        intentInput.checked = false; 
      } else if (response.status === 409) {
        showToast(data?.Message || "This email is already on the Ara waitlist!", "error");
      } else {
        showToast(data?.Message || "Something went wrong. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error joining waitlist:", error);
      showToast("Network error. Please check your connection.", "error");
    } finally {
      // Restore button state
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
      submitBtn.classList.remove("opacity-75", "cursor-not-allowed");
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
