// Create Event Form JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const form = document.getElementById("createEventForm")
  const steps = document.querySelectorAll(".form-step")
  const progressSteps = document.querySelectorAll(".progress-step")
  const progressLines = document.querySelectorAll(".progress-line")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const submitBtn = document.getElementById("submitBtn")
  const toast = document.getElementById("toast")
  const toastMessage = document.getElementById("toastMessage")

  let currentStep = 1
  const totalSteps = 4
  let ticketTierCount = 1
  const tags = []

  // Initialize
  updateNavigation()
  initCharCounters()
  initImageUpload()
  initTagsInput()
  initLocationToggle()
  initRecurringToggle()
  initTicketTiers()
  initPublishOptions()
  initEditButtons()

  // Navigation
  prevBtn.addEventListener("click", () => goToStep(currentStep - 1))
  nextBtn.addEventListener("click", () => {
    if (validateStep(currentStep)) {
      goToStep(currentStep + 1)
    }
  })

  // Progress step clicks
  progressSteps.forEach((step) => {
    step.addEventListener("click", () => {
      const stepNum = Number.parseInt(step.dataset.step)
      if (stepNum < currentStep || validateStep(currentStep)) {
        goToStep(stepNum)
      }
    })
  })

  function goToStep(step) {
    if (step < 1 || step > totalSteps) return

    // Hide current step
    steps[currentStep - 1].classList.remove("active")
    progressSteps[currentStep - 1].classList.remove("active")
    if (currentStep < step) {
      progressSteps[currentStep - 1].classList.add("completed")
    }

    // Show new step
    currentStep = step
    steps[currentStep - 1].classList.add("active")
    progressSteps[currentStep - 1].classList.add("active")

    // Update progress lines
    progressLines.forEach((line, index) => {
      if (index < currentStep - 1) {
        line.classList.add("active")
      } else {
        line.classList.remove("active")
      }
    })

    // Update review if on step 4
    if (currentStep === 4) {
      updateReview()
    }

    updateNavigation()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function updateNavigation() {
    prevBtn.style.display = currentStep === 1 ? "none" : "flex"
    nextBtn.style.display = currentStep === totalSteps ? "none" : "flex"
    submitBtn.style.display = currentStep === totalSteps ? "flex" : "none"
  }

  function validateStep(step) {
    const currentStepEl = steps[step - 1]
    const requiredFields = currentStepEl.querySelectorAll("[required]")
    let valid = true

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        valid = false
        field.classList.add("error")
        field.addEventListener("input", () => field.classList.remove("error"), { once: true })
      }
    })

    if (!valid) {
      showToast("Please fill in all required fields", "error")
    }

    return valid
  }

  // Character counters
  function initCharCounters() {
    const titleInput = document.getElementById("eventTitle")
    const titleCount = document.getElementById("titleCount")
    const descInput = document.getElementById("eventDescription")
    const descCount = document.getElementById("descCount")

    titleInput.addEventListener("input", () => {
      titleCount.textContent = titleInput.value.length
      if (titleInput.value.length > 100) {
        titleInput.value = titleInput.value.substring(0, 100)
      }
    })

    descInput.addEventListener("input", () => {
      descCount.textContent = descInput.value.length
      if (descInput.value.length > 2000) {
        descInput.value = descInput.value.substring(0, 2000)
      }
    })
  }

  // Image upload
  function initImageUpload() {
    const uploadZone = document.getElementById("imageUploadZone")
    const fileInput = document.getElementById("eventImage")
    const placeholder = document.getElementById("uploadPlaceholder")
    const preview = document.getElementById("imagePreview")
    const previewImg = document.getElementById("previewImg")
    const removeBtn = document.getElementById("removeImage")

    uploadZone.addEventListener("click", () => fileInput.click())

    uploadZone.addEventListener("dragover", (e) => {
      e.preventDefault()
      uploadZone.classList.add("dragover")
    })

    uploadZone.addEventListener("dragleave", () => {
      uploadZone.classList.remove("dragover")
    })

    uploadZone.addEventListener("drop", (e) => {
      e.preventDefault()
      uploadZone.classList.remove("dragover")
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) {
        handleImage(file)
      }
    })

    fileInput.addEventListener("change", () => {
      if (fileInput.files[0]) {
        handleImage(fileInput.files[0])
      }
    })

    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      fileInput.value = ""
      placeholder.style.display = "block"
      preview.style.display = "none"
    })

    function handleImage(file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("Image must be less than 5MB", "error")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        previewImg.src = e.target.result
        placeholder.style.display = "none"
        preview.style.display = "block"
      }
      reader.readAsDataURL(file)
    }
  }

  // Tags input
  function initTagsInput() {
    const container = document.getElementById("tagsContainer")
    const input = document.getElementById("tagsInput")
    const hidden = document.getElementById("tagsHidden")

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        const value = input.value.trim()

        if (value && tags.length < 5 && !tags.includes(value)) {
          tags.push(value)
          renderTags()
          input.value = ""
        } else if (tags.length >= 5) {
          showToast("Maximum 5 tags allowed", "error")
        }
      }
    })

    function renderTags() {
      container.innerHTML = tags
        .map(
          (tag) => `
        <span class="tag">
          ${tag}
          <button type="button" onclick="removeTag('${tag}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </span>
      `,
        )
        .join("")
      hidden.value = tags.join(",")
    }

    window.removeTag = (tag) => {
      const index = tags.indexOf(tag)
      if (index > -1) {
        tags.splice(index, 1)
        renderTags()
      }
    }
  }

  // Location toggle
  function initLocationToggle() {
    const btns = document.querySelectorAll(".location-type-btn")
    const venueFields = document.getElementById("venueFields")
    const onlineFields = document.getElementById("onlineFields")

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")

        if (btn.dataset.type === "venue") {
          venueFields.style.display = "block"
          onlineFields.style.display = "none"
        } else {
          venueFields.style.display = "none"
          onlineFields.style.display = "block"
        }
      })
    })
  }

  // Recurring toggle
  function initRecurringToggle() {
    const toggle = document.getElementById("isRecurring")
    const options = document.getElementById("recurringOptions")

    toggle.addEventListener("change", () => {
      options.style.display = toggle.checked ? "block" : "none"
    })
  }

  // Ticket tiers
  function initTicketTiers() {
    const addBtn = document.getElementById("addTicketBtn")
    const container = document.getElementById("ticketsContainer")

    addBtn.addEventListener("click", addTicketTier)

    // Initial tier handlers
    initTierHandlers(container.querySelector(".ticket-tier"))

    function addTicketTier() {
      ticketTierCount++
      const tier = document.createElement("div")
      tier.className = "ticket-tier"
      tier.dataset.tier = ticketTierCount
      tier.innerHTML = `
        <div class="ticket-tier-header">
          <div class="tier-drag-handle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
              <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
            </svg>
          </div>
          <span class="tier-label">Tier ${ticketTierCount}</span>
          <button type="button" class="tier-collapse">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m18 15-6-6-6 6"/>
            </svg>
          </button>
          <button type="button" class="tier-delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
        <div class="ticket-tier-body">
          <div class="form-row">
            <div class="form-group flex-2">
              <label>Ticket Name <span class="required">*</span></label>
              <input type="text" name="ticket_name_${ticketTierCount}" placeholder="e.g., VIP Access" required>
            </div>
            <div class="form-group flex-1">
              <label>Price</label>
              <div class="price-input">
                <span class="currency">$</span>
                <input type="number" name="ticket_price_${ticketTierCount}" placeholder="0.00" min="0" step="0.01">
              </div>
            </div>
            <div class="form-group flex-1">
              <label>Quantity</label>
              <input type="number" name="ticket_quantity_${ticketTierCount}" placeholder="Unlimited" min="1">
            </div>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea name="ticket_description_${ticketTierCount}" rows="2" placeholder="What's included with this ticket?"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Sales Start</label>
              <input type="datetime-local" name="ticket_sales_start_${ticketTierCount}">
            </div>
            <div class="form-group">
              <label>Sales End</label>
              <input type="datetime-local" name="ticket_sales_end_${ticketTierCount}">
            </div>
          </div>
          <div class="ticket-options">
            <label class="toggle-label small">
              <input type="checkbox" name="ticket_visible_${ticketTierCount}" checked>
              <span class="toggle-switch"></span>
              <span class="toggle-text">Visible</span>
            </label>
            <label class="toggle-label small">
              <input type="checkbox" name="ticket_transferable_${ticketTierCount}">
              <span class="toggle-switch"></span>
              <span class="toggle-text">Transferable</span>
            </label>
          </div>
        </div>
      `

      container.appendChild(tier)
      initTierHandlers(tier)
      updateTicketsSummary()
    }

    function initTierHandlers(tier) {
      const collapseBtn = tier.querySelector(".tier-collapse")
      const deleteBtn = tier.querySelector(".tier-delete")

      collapseBtn.addEventListener("click", () => {
        tier.classList.toggle("collapsed")
      })

      deleteBtn.addEventListener("click", () => {
        if (container.querySelectorAll(".ticket-tier").length > 1) {
          tier.remove()
          updateTicketsSummary()
        } else {
          showToast("At least one ticket tier is required", "error")
        }
      })

      // Update summary on input change
      tier.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", updateTicketsSummary)
      })
    }

    function updateTicketsSummary() {
      const tiers = container.querySelectorAll(".ticket-tier")
      document.getElementById("totalTiers").textContent = tiers.length

      let totalCapacity = 0
      let hasUnlimited = false

      tiers.forEach((tier) => {
        const qty = tier.querySelector('input[name^="ticket_quantity"]').value
        if (qty) {
          totalCapacity += Number.parseInt(qty)
        } else {
          hasUnlimited = true
        }
      })

      document.getElementById("totalCapacity").textContent = hasUnlimited ? "Unlimited" : totalCapacity.toLocaleString()
    }
  }

  // Publish options
  function initPublishOptions() {
    const scheduleRadio = document.getElementById("schedulePublish")
    const scheduleFields = document.getElementById("scheduleFields")
    const radios = document.querySelectorAll('input[name="publish_status"]')

    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        scheduleFields.style.display = scheduleRadio.checked ? "block" : "none"
      })
    })
  }

  // Edit buttons on review
  function initEditButtons() {
    document.querySelectorAll(".edit-section-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const step = Number.parseInt(btn.dataset.goto)
        goToStep(step)
      })
    })
  }

  // Update review
  function updateReview() {
    // Basic info
    document.getElementById("reviewTitle").textContent = document.getElementById("eventTitle").value || "-"
    document.getElementById("reviewCategory").textContent =
      document.getElementById("eventCategory").selectedOptions[0]?.text || "-"
    document.getElementById("reviewType").textContent =
      document.getElementById("eventType").selectedOptions[0]?.text || "-"
    document.getElementById("reviewDescription").textContent = document.getElementById("eventDescription").value || "-"

    // Date & Location
    const startDate = document.getElementById("startDate").value
    const startTime = document.getElementById("startTime").value
    const endDate = document.getElementById("endDate").value
    const endTime = document.getElementById("endTime").value

    document.getElementById("reviewStart").textContent =
      startDate && startTime ? `${formatDate(startDate)} at ${formatTime(startTime)}` : "-"
    document.getElementById("reviewEnd").textContent =
      endDate && endTime ? `${formatDate(endDate)} at ${formatTime(endTime)}` : "-"

    const isOnline = document.querySelector(".location-type-btn.active").dataset.type === "online"
    let location = "-"

    if (isOnline) {
      const platform = document.getElementById("onlinePlatform").selectedOptions[0]?.text
      location = platform ? `Online (${platform})` : "Online Event"
    } else {
      const venue = document.getElementById("venueName").value
      const city = document.getElementById("venueCity").value
      if (venue || city) {
        location = [venue, city].filter(Boolean).join(", ")
      }
    }
    document.getElementById("reviewLocation").textContent = location

    // Tickets
    const ticketsReview = document.getElementById("reviewTickets")
    const tiers = document.querySelectorAll(".ticket-tier")

    ticketsReview.innerHTML = ""
    tiers.forEach((tier) => {
      const name = tier.querySelector('input[name^="ticket_name"]').value || "Unnamed Ticket"
      const price = tier.querySelector('input[name^="ticket_price"]').value
      const priceDisplay = price ? `$${Number.parseFloat(price).toFixed(2)}` : "Free"

      const ticketEl = document.createElement("div")
      ticketEl.className = "review-ticket"
      ticketEl.innerHTML = `
        <span class="review-ticket-name">${name}</span>
        <span class="review-ticket-price">${priceDisplay}</span>
      `
      ticketsReview.appendChild(ticketEl)
    })
  }

  // Helper functions
  function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
  }

  function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(":")
    const h = Number.parseInt(hours)
    const ampm = h >= 12 ? "PM" : "AM"
    const hour = h % 12 || 12
    return `${hour}:${minutes} ${ampm}`
  }

  function showToast(message, type = "success") {
    toastMessage.textContent = message
    toast.className = `toast show ${type}`

    setTimeout(() => {
      toast.classList.remove("show")
    }, 3000)
  }

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    if (!validateStep(currentStep)) return

    // Show loading state
    submitBtn.innerHTML = `
      <svg class="spinner" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/>
      </svg>
      Publishing...
    `
    submitBtn.disabled = true

    // Simulate submission (replace with actual form submission)
    setTimeout(() => {
      showToast("Event created successfully!")
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
        </svg>
        Published!
      `

      // Redirect after success (uncomment for production)
      // setTimeout(() => window.location.href = '/dashboard/events', 1500);
    }, 2000)
  })

  // Save draft button
  document.getElementById("saveDraftBtn").addEventListener("click", () => {
    showToast("Draft saved successfully!")
  })

  // Preview button
  document.getElementById("previewBtn").addEventListener("click", () => {
    showToast("Preview feature coming soon!")
  })
})
