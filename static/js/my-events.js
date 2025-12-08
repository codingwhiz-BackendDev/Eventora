/**
 * My Events Page - JavaScript
 * Eventora Event Management Platform
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initMobileMenu()
  initFilterTabs()
  initSearch()
  initSortDropdown()
  initViewToggle()
  initFavorites()
  initPagination()
})

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle")
  const sidebar = document.getElementById("sidebar")
  const sidebarClose = document.getElementById("sidebarClose")

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.add("open")
      document.body.style.overflow = "hidden"
    })
  }

  if (sidebarClose && sidebar) {
    sidebarClose.addEventListener("click", () => {
      sidebar.classList.remove("open")
      document.body.style.overflow = ""
    })
  }

  // Close on overlay click
  document.addEventListener("click", (e) => {
    if (sidebar && sidebar.classList.contains("open")) {
      if (!sidebar.contains(e.target) && e.target !== menuToggle) {
        sidebar.classList.remove("open")
        document.body.style.overflow = ""
      }
    }
  })
}

/**
 * Filter Tabs
 */
function initFilterTabs() {
  const filterTabs = document.querySelectorAll(".filter-tab")
  const eventsGrid = document.getElementById("eventsGrid")
  const emptyState = document.getElementById("emptyState")
  const eventCards = document.querySelectorAll(".event-card")

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Update active state
      filterTabs.forEach((t) => t.classList.remove("active"))
      this.classList.add("active")

      const filter = this.dataset.filter
      let visibleCount = 0

      eventCards.forEach((card) => {
        const status = card.dataset.status

        if (filter === "all" || status === filter) {
          card.style.display = ""
          visibleCount++
        } else {
          card.style.display = "none"
        }
      })

      // Show/hide empty state
      if (visibleCount === 0) {
        eventsGrid.style.display = "none"
        emptyState.style.display = "flex"
      } else {
        eventsGrid.style.display = ""
        emptyState.style.display = "none"
      }
    })
  })
}

/**
 * Search Functionality
 */
function initSearch() {
  const searchInput = document.getElementById("eventSearch")
  const eventCards = document.querySelectorAll(".event-card")
  const eventsGrid = document.getElementById("eventsGrid")
  const emptyState = document.getElementById("emptyState")

  if (searchInput) {
    let debounceTimeout

    searchInput.addEventListener("input", function () {
      clearTimeout(debounceTimeout)

      debounceTimeout = setTimeout(() => {
        const query = this.value.toLowerCase().trim()
        let visibleCount = 0

        eventCards.forEach((card) => {
          const name = card.dataset.name.toLowerCase()
          const title = card.querySelector(".event-title").textContent.toLowerCase()
          const location = card.querySelector(".meta-item:last-child span").textContent.toLowerCase()

          if (name.includes(query) || title.includes(query) || location.includes(query)) {
            card.style.display = ""
            visibleCount++
          } else {
            card.style.display = "none"
          }
        })

        // Show/hide empty state
        if (visibleCount === 0 && query !== "") {
          eventsGrid.style.display = "none"
          emptyState.style.display = "flex"
          emptyState.querySelector("h3").textContent = "No events found"
          emptyState.querySelector("p").textContent = `No events match "${query}". Try a different search term.`
        } else {
          eventsGrid.style.display = ""
          emptyState.style.display = "none"
        }
      }, 300)
    })
  }
}

/**
 * Sort Dropdown
 */
function initSortDropdown() {
  const sortDropdown = document.querySelector(".sort-dropdown")
  const sortBtn = document.getElementById("sortBtn")
  const sortOptions = document.querySelectorAll(".sort-option")
  const eventsGrid = document.getElementById("eventsGrid")

  if (sortBtn) {
    sortBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      sortDropdown.classList.toggle("open")
    })
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
    if (sortDropdown) {
      sortDropdown.classList.remove("open")
    }
  })

  sortOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Update active state
      sortOptions.forEach((o) => o.classList.remove("active"))
      this.classList.add("active")

      // Update button text
      sortBtn.querySelector("span").textContent = this.textContent

      // Sort events
      const sortType = this.dataset.sort
      sortEvents(sortType)

      // Close dropdown
      sortDropdown.classList.remove("open")
    })
  })

  function sortEvents(sortType) {
    const cards = Array.from(document.querySelectorAll(".event-card"))

    cards.sort((a, b) => {
      switch (sortType) {
        case "date-desc":
          return new Date(b.dataset.date) - new Date(a.dataset.date)
        case "date-asc":
          return new Date(a.dataset.date) - new Date(b.dataset.date)
        case "name-asc":
          return a.dataset.name.localeCompare(b.dataset.name)
        case "name-desc":
          return b.dataset.name.localeCompare(a.dataset.name)
        case "attendees":
          return Number.parseInt(b.dataset.attendees) - Number.parseInt(a.dataset.attendees)
        case "revenue":
          return Number.parseInt(b.dataset.revenue) - Number.parseInt(a.dataset.revenue)
        default:
          return 0
      }
    })

    // Re-append sorted cards
    cards.forEach((card) => eventsGrid.appendChild(card))
  }
}

/**
 * View Toggle (Grid/List)
 */
function initViewToggle() {
  const viewButtons = document.querySelectorAll(".view-btn")
  const eventsGrid = document.getElementById("eventsGrid")

  viewButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      viewButtons.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")

      const view = this.dataset.view

      if (view === "list") {
        eventsGrid.classList.add("list-view")
      } else {
        eventsGrid.classList.remove("list-view")
      }
    })
  })
}

/**
 * Favorites Toggle
 */
function initFavorites() {
  const favoriteButtons = document.querySelectorAll(".event-favorite")

  favoriteButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()

      this.classList.toggle("favorited")

      // Update icon fill
      const svg = this.querySelector("svg")
      if (this.classList.contains("favorited")) {
        svg.setAttribute("fill", "currentColor")
        showToast("Added to favorites")
      } else {
        svg.setAttribute("fill", "none")
        showToast("Removed from favorites")
      }
    })
  })
}

/**
 * Pagination
 */
function initPagination() {
  const pageButtons = document.querySelectorAll(".page-btn")
  const prevBtn = document.querySelector(".pagination-btn.prev")
  const nextBtn = document.querySelector(".pagination-btn.next")

  pageButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      pageButtons.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")

      // Update prev/next button states
      const currentPage = Number.parseInt(this.textContent)
      prevBtn.disabled = currentPage === 1
      nextBtn.disabled = currentPage === 10

      // Scroll to top of grid
      document.querySelector(".events-controls").scrollIntoView({ behavior: "smooth" })
    })
  })

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const activeBtn = document.querySelector(".page-btn.active")
      const currentPage = Number.parseInt(activeBtn.textContent)
      if (currentPage > 1) {
        const targetBtn = document.querySelector(`.page-btn:nth-child(${currentPage - 1})`)
        if (targetBtn) targetBtn.click()
      }
    })
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const activeBtn = document.querySelector(".page-btn.active")
      const currentPage = Number.parseInt(activeBtn.textContent)
      if (currentPage < 10) {
        const targetBtn = document.querySelector(`.page-btn:nth-child(${currentPage + 1})`)
        if (targetBtn) targetBtn.click()
      }
    })
  }
}

/**
 * Toast Notification
 */
function showToast(message, type = "success") {
  // Remove existing toasts
  const existingToast = document.querySelector(".toast-notification")
  if (existingToast) {
    existingToast.remove()
  }

  const toast = document.createElement("div")
  toast.className = `toast-notification ${type}`
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${
        type === "success"
          ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
          : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
      }
    </svg>
    <span>${message}</span>
  `

  // Add toast styles if not already present
  if (!document.querySelector("#toast-styles")) {
    const styles = document.createElement("style")
    styles.id = "toast-styles"
    styles.textContent = `
      .toast-notification {
        position: fixed;
        bottom: 24px;
        right: 24px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 20px;
        background: #12121a;
        border: 1px solid #1e1e2e;
        border-radius: 10px;
        color: #ffffff;
        font-size: 14px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        z-index: 9999;
        animation: slideIn 0.3s ease;
      }
      .toast-notification.success {
        border-color: #10b981;
      }
      .toast-notification.error {
        border-color: #ef4444;
      }
      .toast-notification svg {
        width: 18px;
        height: 18px;
      }
      .toast-notification.success svg {
        color: #10b981;
      }
      .toast-notification.error svg {
        color: #ef4444;
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
      }
    `
    document.head.appendChild(styles)
  }

  document.body.appendChild(toast)

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease forwards"
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}
