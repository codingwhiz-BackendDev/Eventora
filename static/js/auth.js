// ================================
// EVENTORA AUTH PAGES JAVASCRIPT
// ================================

document.addEventListener("DOMContentLoaded", () => {
    initPasswordToggles()
    initPasswordStrength()
    initFormValidation()
    initFormSubmission()
  })
  
  // ================================
  // PASSWORD VISIBILITY TOGGLE
  // ================================
  
  function initPasswordToggles() {
    const toggles = document.querySelectorAll(".password-toggle")
  
    toggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const input = toggle.parentElement.querySelector("input")
        const isPassword = input.type === "password"
  
        input.type = isPassword ? "text" : "password"
        toggle.classList.toggle("active", isPassword)
      })
    })
  }
  
  // ================================
  // PASSWORD STRENGTH INDICATOR
  // ================================
  
  function initPasswordStrength() {
    const passwordInput = document.getElementById("password")
    const strengthBars = document.querySelectorAll(".strength-bar")
    const strengthText = document.querySelector(".strength-text")
  
    if (!passwordInput || strengthBars.length === 0) return
  
    passwordInput.addEventListener("input", () => {
      const password = passwordInput.value
      const strength = calculateStrength(password)
      updateStrengthUI(strength, strengthBars, strengthText)
    })
  }
  
  function calculateStrength(password) {
    let score = 0
  
    if (password.length === 0) return { score: 0, label: "Password strength" }
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++
  
    if (score <= 2) return { score: 1, label: "Weak password" }
    if (score <= 3) return { score: 2, label: "Fair password" }
    if (score <= 4) return { score: 3, label: "Good password" }
    return { score: 4, label: "Strong password" }
  }
  
  function updateStrengthUI(strength, bars, textElement) {
    const strengthClasses = ["", "weak", "medium", "medium", "strong"]
    const colors = {
      weak: "#ef4444",
      medium: "#f59e0b",
      strong: "#22c55e",
    }
  
    bars.forEach((bar, index) => {
      bar.classList.remove("weak", "medium", "strong")
      if (index < strength.score) {
        bar.classList.add(strengthClasses[strength.score])
      }
    })
  
    if (textElement) {
      textElement.textContent = strength.label
      textElement.style.color = strength.score > 0 ? colors[strengthClasses[strength.score]] : "var(--muted-foreground)"
    }
  }
  
  // ================================
  // FORM VALIDATION
  // ================================
  
  function initFormValidation() {
    const inputs = document.querySelectorAll(".input-wrapper input")
  
    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateInput(input))
      input.addEventListener("input", () => {
        if (input.parentElement.classList.contains("error")) {
          validateInput(input)
        }
      })
    })
  
    // Confirm password validation
    const confirmPassword = document.getElementById("confirmPassword")
    const password = document.getElementById("password")
  
    if (confirmPassword && password) {
      confirmPassword.addEventListener("input", () => {
        if (confirmPassword.value && confirmPassword.value !== password.value) {
          setInputError(confirmPassword, "Passwords do not match")
        } else {
          clearInputError(confirmPassword)
        }
      })
    }
  }
  
  function validateInput(input) {
    const wrapper = input.parentElement
    const value = input.value.trim()
  
    clearInputError(input)
  
    if (input.required && !value) {
      setInputError(input, "This field is required")
      return false
    }
  
    if (input.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        setInputError(input, "Please enter a valid email")
        return false
      }
    }
  
    if (input.id === "password" && value && value.length < 8) {
      setInputError(input, "Password must be at least 8 characters")
      return false
    }
  
    if (value) {
      wrapper.classList.add("success")
    }
  
    return true
  }
  
  function setInputError(input, message) {
    const wrapper = input.parentElement
    const formGroup = wrapper.closest(".form-group")
  
    wrapper.classList.remove("success")
    wrapper.classList.add("error")
  
    // Remove existing error message
    const existingError = formGroup.querySelector(".error-message")
    if (existingError) existingError.remove()
  
    // Add new error message
    const errorEl = document.createElement("span")
    errorEl.className = "error-message"
    errorEl.textContent = message
    formGroup.appendChild(errorEl)
  }
  
  function clearInputError(input) {
    const wrapper = input.parentElement
    const formGroup = wrapper.closest(".form-group")
  
    wrapper.classList.remove("error", "success")
  
    const existingError = formGroup.querySelector(".error-message")
    if (existingError) existingError.remove()
  }
  
  // ================================
  // FORM SUBMISSION
  // ================================
  
  function initFormSubmission() {
    const loginForm = document.getElementById("loginForm")
    const signupForm = document.getElementById("signupForm")
  
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => handleFormSubmit(e, "login"))
    }
  
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => handleFormSubmit(e, "signup"))
    }
  }
  
  function handleFormSubmit(e, type) {
    e.preventDefault()
  
    const form = e.target
    const submitBtn = form.querySelector(".btn-auth")
    const inputs = form.querySelectorAll(".input-wrapper input")
  
    // Validate all inputs
    let isValid = true
    inputs.forEach((input) => {
      if (!validateInput(input)) {
        isValid = false
      }
    })
  
    // Check password confirmation for signup
    if (type === "signup") {
      const password = document.getElementById("password")
      const confirmPassword = document.getElementById("confirmPassword")
  
      if (password.value !== confirmPassword.value) {
        setInputError(confirmPassword, "Passwords do not match")
        isValid = false
      }
  
      // Check terms checkbox
      const termsCheckbox = form.querySelector('input[name="terms"]')
      if (!termsCheckbox.checked) {
        alert("Please agree to the Terms of Service and Privacy Policy")
        isValid = false
      }
    }
  
    if (!isValid) return
  
    // Show loading state
    submitBtn.classList.add("loading")
  
    // Collect form data
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)
  
    // Simulate API call
    setTimeout(() => {
      submitBtn.classList.remove("loading")
  
      // For demo purposes - show success message
      if (type === "login") {
        showSuccessMessage("Login successful! Redirecting...")
        // In real app: redirect to dashboard
        // window.location.href = '/dashboard';
      } else {
        showSuccessMessage("Account created! Please check your email to verify.")
        // In real app: redirect to verification page
        // window.location.href = '/verify-email';
      }
    }, 1500)
  }
  
  function showSuccessMessage(message) {
    // Create toast notification
    const toast = document.createElement("div")
    toast.className = "toast-notification"
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span>${message}</span>
    `
  
    // Add toast styles if not already present
    if (!document.querySelector("#toast-styles")) {
      const style = document.createElement("style")
      style.id = "toast-styles"
      style.textContent = `
        .toast-notification {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: #22c55e;
          color: white;
          font-weight: 500;
          border-radius: 0.75rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          animation: slideIn 0.3s ease-out, slideOut 0.3s ease-in 2.7s forwards;
        }
        .toast-notification svg {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }
  
    document.body.appendChild(toast)
  
    // Remove toast after animation
    setTimeout(() => toast.remove(), 3000)
  }
  
  // ================================
  // SOCIAL AUTH HANDLERS
  // ================================
  
  document.querySelectorAll(".btn-social").forEach((btn) => {
    btn.addEventListener("click", () => {
      const provider = btn.querySelector("span").textContent
      // In real app: initiate OAuth flow
      alert(`${provider} authentication would be initiated here.`)
    })
  })
  