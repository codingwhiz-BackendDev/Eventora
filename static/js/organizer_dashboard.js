// ================================
// DASHBOARD JAVASCRIPT
// ================================

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const sidebar = document.getElementById("sidebar")
  const menuToggle = document.getElementById("menuToggle")
  const sidebarClose = document.getElementById("sidebarClose")
  const navLinks = document.querySelectorAll(".nav-link")
  const pageSections = document.querySelectorAll(".page-section")
  const toast = document.getElementById("toast")
  const toastClose = document.querySelector(".toast-close")

  // Create overlay
  const overlay = document.createElement("div")
  overlay.className = "sidebar-overlay"
  document.body.appendChild(overlay)

  // ================================
  // SIDEBAR TOGGLE
  // ================================

  function openSidebar() {
    sidebar.classList.add("open")
    overlay.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  function closeSidebar() {
    sidebar.classList.remove("open")
    overlay.classList.remove("show")
    document.body.style.overflow = ""
  }

  menuToggle.addEventListener("click", openSidebar)
  sidebarClose.addEventListener("click", closeSidebar)
  overlay.addEventListener("click", closeSidebar)

  // ================================
  // PAGE NAVIGATION
  // ================================

  function showPage(pageId) {
    // Update nav links
    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.dataset.page === pageId) {
        link.classList.add("active")
      }
    })

    // Show page section
    pageSections.forEach((section) => {
      section.classList.remove("active")
      if (section.id === `page-${pageId}`) {
        section.classList.add("active")
      }
    })

    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      closeSidebar()
    }
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const pageId = this.dataset.page
      showPage(pageId)
    })
  })

  // Quick links
  document.querySelectorAll("[data-goto]").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const pageId = this.dataset.goto
      showPage(pageId)
    })
  })

  // Quick create buttons
  const quickCreateBtn = document.getElementById("quickCreateBtn")
  const createEventBtn = document.getElementById("createEventBtn")

  if (quickCreateBtn) {
    quickCreateBtn.addEventListener("click", () => showPage("create"))
  }
  if (createEventBtn) {
    createEventBtn.addEventListener("click", () => showPage("create"))
  }

  // ================================
  // DATE FILTER BUTTONS
  // ================================

  const filterBtns = document.querySelectorAll(".date-filter .filter-btn")
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtns.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // ================================
  // EVENTS FILTER TABS
  // ================================

  const filterTabs = document.querySelectorAll(".filter-tab")
  const eventCards = document.querySelectorAll(".event-card")

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      filterTabs.forEach((t) => t.classList.remove("active"))
      this.classList.add("active")

      const filter = this.dataset.filter

      eventCards.forEach((card) => {
        if (filter === "all" || card.dataset.status === filter) {
          card.style.display = "block"
        } else {
          card.style.display = "none"
        }
      })
    })
  })

  // View Toggle
  const viewBtns = document.querySelectorAll(".view-btn")
  const eventsGrid = document.getElementById("eventsGrid")

  viewBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      viewBtns.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")

      if (this.dataset.view === "list") {
        eventsGrid.style.gridTemplateColumns = "1fr"
      } else {
        eventsGrid.style.gridTemplateColumns = ""
      }
    })
  })

  // ================================
  // CREATE EVENT FORM
  // ================================

  const createEventForm = document.getElementById("createEventForm")
  const formSteps = document.querySelectorAll(".form-step")
  const progressSteps = document.querySelectorAll(".progress-step")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const submitBtn = document.getElementById("submitBtn")

  let currentStep = 1
  const totalSteps = 4

  function updateFormStep() {
    formSteps.forEach((step) => {
      step.classList.remove("active")
      if (Number.parseInt(step.dataset.step) === currentStep) {
        step.classList.add("active")
      }
    })

    progressSteps.forEach((step) => {
      const stepNum = Number.parseInt(step.dataset.step)
      step.classList.remove("active", "completed")
      if (stepNum === currentStep) {
        step.classList.add("active")
      } else if (stepNum < currentStep) {
        step.classList.add("completed")
      }
    })

    prevBtn.disabled = currentStep === 1

    if (currentStep === totalSteps) {
      nextBtn.style.display = "none"
      submitBtn.style.display = "flex"
      updateReviewSection()
    } else {
      nextBtn.style.display = "flex"
      submitBtn.style.display = "none"
    }
  }

  function updateReviewSection() {
    const eventName = document.getElementById("eventName").value
    const eventDescription = document.getElementById("eventDescription").value
    const startDate = document.getElementById("startDate").value
    const venueName = document.getElementById("venueName").value
    const city = document.getElementById("city").value

    document.getElementById("reviewName").textContent = eventName || "Event Name"
    document.getElementById("reviewDescription").textContent = eventDescription || "No description provided."

    if (startDate) {
      const date = new Date(startDate)
      document.getElementById("reviewDate").textContent = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    }

    if (venueName && city) {
      document.getElementById("reviewLocation").textContent = `${venueName}, ${city}`
    }
  }

  prevBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--
      updateFormStep()
    }
  })

  nextBtn.addEventListener("click", () => {
    if (currentStep < totalSteps) {
      currentStep++
      updateFormStep()
    }
  })

  createEventForm.addEventListener("submit", (e) => {
    e.preventDefault()
    showToast("Success!", "Your event has been created.")
    setTimeout(() => {
      showPage("events")
      currentStep = 1
      updateFormStep()
      createEventForm.reset()
    }, 2000)
  })

  // Image Upload
  const imageUpload = document.getElementById("imageUpload")
  const eventImage = document.getElementById("eventImage")

  if (imageUpload && eventImage) {
    imageUpload.addEventListener("click", () => eventImage.click())

    eventImage.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          imageUpload.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 200px; border-radius: 8px;">`
          document.getElementById("reviewImage").src = e.target.result
        }
        reader.readAsDataURL(this.files[0])
      }
    })
  }

  // Add Ticket Tier
  const addTierBtn = document.getElementById("addTierBtn")
  const ticketsContainer = document.getElementById("ticketsContainer")
  let tierCount = 1

  if (addTierBtn) {
    addTierBtn.addEventListener("click", () => {
      tierCount++
      const newTier = document.createElement("div")
      newTier.className = "ticket-tier"
      newTier.innerHTML = `
        <div class="ticket-tier-header">
          <h4>Ticket Tier ${tierCount}</h4>
          <button type="button" class="btn-remove-tier">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Ticket Name *</label>
            <input type="text" placeholder="e.g., VIP Access">
          </div>
          <div class="form-group">
            <label>Price ($) *</label>
            <input type="number" min="0" step="0.01" placeholder="0.00">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Quantity Available *</label>
            <input type="number" min="1" placeholder="50">
          </div>
          <div class="form-group">
            <label>Max Per Order</label>
            <input type="number" min="1" placeholder="5">
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea rows="2" placeholder="What's included with this ticket?"></textarea>
        </div>
      `

      ticketsContainer.appendChild(newTier)

      // Enable first tier remove button
      document.querySelectorAll(".btn-remove-tier").forEach((btn) => {
        btn.disabled = false
      })

      // Add remove functionality
      newTier.querySelector(".btn-remove-tier").addEventListener("click", () => {
        newTier.remove()
        if (document.querySelectorAll(".ticket-tier").length === 1) {
          document.querySelector(".btn-remove-tier").disabled = true
        }
      })
    })
  }

  // ================================
  // TOAST
  // ================================

  function showToast(title, message) {
    document.querySelector(".toast-title").textContent = title
    document.querySelector(".toast-message").textContent = message
    toast.classList.add("show")

    setTimeout(() => {
      toast.classList.remove("show")
    }, 5000)
  }

  toastClose.addEventListener("click", () => {
    toast.classList.remove("show")
  })

  // ================================
  // CHARTS (Using Chart.js)
  // ================================

  // Revenue Chart
  const revenueCtx = document.getElementById("revenueChart")
  if (revenueCtx) {
    new window.Chart(revenueCtx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Revenue",
            data: [3200, 4100, 3800, 5200, 4800, 6100, 5800],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#a1a1aa" },
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: {
              color: "#a1a1aa",
              callback: (value) => "$" + value,
            },
          },
        },
      },
    })
  }

  // Ticket Chart
  const ticketCtx = document.getElementById("ticketChart")
  if (ticketCtx) {
    new window.Chart(ticketCtx, {
      type: "doughnut",
      data: {
        labels: ["Tech Summit", "Music Festival", "Gala", "Other"],
        datasets: [
          {
            data: [458, 1247, 312, 830],
            backgroundColor: ["#3b82f6", "#22c55e", "#8b5cf6", "#f59e0b"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#a1a1aa", padding: 15 },
          },
        },
      },
    })
  }

  // Sales Chart (Analytics)
  const salesCtx = document.getElementById("salesChart")
  if (salesCtx) {
    new window.Chart(salesCtx, {
      type: "bar",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            label: "Tickets Sold",
            data: [320, 480, 420, 580],
            backgroundColor: "#3b82f6",
            borderRadius: 6,
          },
          {
            label: "Revenue ($)",
            data: [8500, 12800, 11200, 15400],
            backgroundColor: "#22c55e",
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            align: "end",
            labels: { color: "#a1a1aa", usePointStyle: true },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#a1a1aa" },
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#a1a1aa" },
          },
        },
      },
    })
  }

  // Sources Chart (Analytics)
  const sourcesCtx = document.getElementById("sourcesChart")
  if (sourcesCtx) {
    new window.Chart(sourcesCtx, {
      type: "doughnut",
      data: {
        labels: ["Direct", "Social", "Email", "Referral"],
        datasets: [
          {
            data: [42, 28, 18, 12],
            backgroundColor: ["#3b82f6", "#22c55e", "#8b5cf6", "#f59e0b"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: { display: false },
        },
      },
    })
  }

  // Ticket Distribution Chart (Analytics)
  const ticketDistCtx = document.getElementById("ticketDistChart")
  if (ticketDistCtx) {
    new window.Chart(ticketDistCtx, {
      type: "doughnut",
      data: {
        labels: ["General", "VIP", "Premium"],
        datasets: [
          {
            data: [1450, 312, 85],
            backgroundColor: ["#3b82f6", "#22c55e", "#8b5cf6"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: { display: false },
        },
      },
    })
  }

  // ================================
  // FAVORITE TOGGLE
  // ================================

  document.querySelectorAll(".event-card-favorite").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation()
      this.classList.toggle("favorited")
    })
  })
})
