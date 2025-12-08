// ============================================
// EVENTORA - Landing Page JavaScript
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    showAllAnimatedElements()
  
    // Initialize all components
    initNavbar()
    initMobileMenu()
    initPricingToggle()
    initTestimonialSlider()
    initFAQAccordion()
    initScrollAnimations()
    initCounterAnimations()
  })
  
  function showAllAnimatedElements() {
    // Remove opacity:0 from delay classes by adding a class that overrides
    document.querySelectorAll(".delay-1, .delay-2, .delay-3").forEach((el) => {
      el.style.opacity = "1"
    })
  
    // Ensure all data-aos elements are visible
    document.querySelectorAll("[data-aos]").forEach((el) => {
      el.style.opacity = "1"
    })
  }
  
  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  function initNavbar() {
    const navbar = document.getElementById("navbar")
  
    function handleScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled")
      } else {
        navbar.classList.remove("scrolled")
      }
    }
  
    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial state
  }
  
  // ============================================
  // MOBILE MENU
  // ============================================
  function initMobileMenu() {
    const menuBtn = document.getElementById("mobileMenuBtn")
    const mobileMenu = document.getElementById("mobileMenu")
    const mobileLinks = mobileMenu.querySelectorAll("a")
  
    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("active")
      mobileMenu.classList.toggle("active")
      document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : ""
    })
  
    // Close menu when clicking a link
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuBtn.classList.remove("active")
        mobileMenu.classList.remove("active")
        document.body.style.overflow = ""
      })
    })
  }
  
  // ============================================
  // PRICING TOGGLE
  // ============================================
  function initPricingToggle() {
    const toggle = document.getElementById("pricingToggle")
    const labels = document.querySelectorAll(".toggle-label")
    const prices = document.querySelectorAll(".pricing-price .amount")
  
    let isAnnual = false
  
    toggle.addEventListener("click", () => {
      isAnnual = !isAnnual
      toggle.classList.toggle("active")
  
      // Update labels
      labels.forEach((label) => {
        if (label.dataset.plan === "annual") {
          label.classList.toggle("active", isAnnual)
        } else {
          label.classList.toggle("active", !isAnnual)
        }
      })
  
      // Update prices with animation
      prices.forEach((price) => {
        const monthly = price.dataset.monthly
        const annual = price.dataset.annual
  
        price.style.opacity = "0"
        price.style.transform = "translateY(-10px)"
  
        setTimeout(() => {
          price.textContent = isAnnual ? annual : monthly
          price.style.opacity = "1"
          price.style.transform = "translateY(0)"
        }, 150)
      })
    })
  
    // Add transition to prices
    prices.forEach((price) => {
      price.style.transition = "opacity 0.15s ease, transform 0.15s ease"
    })
  }
  
  // ============================================
  // TESTIMONIAL SLIDER
  // ============================================
  function initTestimonialSlider() {
    const track = document.querySelector(".testimonial-track")
    const cards = document.querySelectorAll(".testimonial-card")
    const prevBtn = document.getElementById("prevBtn")
    const nextBtn = document.getElementById("nextBtn")
    const dots = document.querySelectorAll(".dot")
  
    let currentIndex = 0
    let cardsPerView = 1
  
    function updateCardsPerView() {
      if (window.innerWidth >= 1024) {
        cardsPerView = 3
      } else if (window.innerWidth >= 768) {
        cardsPerView = 2
      } else {
        cardsPerView = 1
      }
    }
  
    function updateSlider() {
      const cardWidth = cards[0].offsetWidth + 24 // Including gap
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`
  
      // Update dots
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex)
      })
    }
  
    function nextSlide() {
      const maxIndex = Math.max(0, cards.length - cardsPerView)
      currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1
      updateSlider()
    }
  
    function prevSlide() {
      const maxIndex = Math.max(0, cards.length - cardsPerView)
      currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1
      updateSlider()
    }
  
    prevBtn.addEventListener("click", prevSlide)
    nextBtn.addEventListener("click", nextSlide)
  
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentIndex = index
        updateSlider()
      })
    })
  
    // Auto slide
    let autoSlide = setInterval(nextSlide, 5000)
  
    // Pause on hover
    track.addEventListener("mouseenter", () => clearInterval(autoSlide))
    track.addEventListener("mouseleave", () => {
      autoSlide = setInterval(nextSlide, 5000)
    })
  
    // Handle resize
    window.addEventListener("resize", () => {
      updateCardsPerView()
      currentIndex = 0
      updateSlider()
    })
  
    updateCardsPerView()
    updateSlider()
  }
  
  // ============================================
  // FAQ ACCORDION
  // ============================================
  function initFAQAccordion() {
    const faqItems = document.querySelectorAll(".faq-item")
  
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")
  
      question.addEventListener("click", () => {
        const isOpen = item.classList.contains("active")
  
        // Close all items
        faqItems.forEach((i) => i.classList.remove("active"))
  
        // Open clicked item if it wasn't open
        if (!isOpen) {
          item.classList.add("active")
        }
      })
    })
  }
  
  // ============================================
  // SCROLL ANIMATIONS (Simple AOS alternative)
  // ============================================
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll("[data-aos]")
  
    animatedElements.forEach((el) => {
      el.style.opacity = "1"
    })
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.aosDelay || 0
            setTimeout(() => {
              entry.target.classList.add("aos-animate")
            }, delay)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )
  
    animatedElements.forEach((el) => observer.observe(el))
  }
  
  // ============================================
  // COUNTER ANIMATIONS
  // ============================================
  function initCounterAnimations() {
    const counters = document.querySelectorAll(".counter")
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target
            const target = Number.parseInt(counter.dataset.target)
            animateCounter(counter, target)
            observer.unobserve(counter)
          }
        })
      },
      { threshold: 0.5 },
    )
  
    counters.forEach((counter) => observer.observe(counter))
  
    // Also animate hero stats
    const heroStats = document.querySelectorAll(".stat-number[data-count]")
  
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stat = entry.target
            const target = Number.parseInt(stat.dataset.count)
            animateCounter(stat, target)
            heroObserver.unobserve(stat)
          }
        })
      },
      { threshold: 0.5 },
    )
  
    heroStats.forEach((stat) => heroObserver.observe(stat))
  }
  
  function animateCounter(element, target) {
    const duration = 2000
    const step = target / (duration / 16)
    let current = 0
  
    function update() {
      current += step
      if (current < target) {
        element.textContent = Math.floor(current).toLocaleString()
        requestAnimationFrame(update)
      } else {
        element.textContent = target.toLocaleString()
      }
    }
  
    update()
  }
  
  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      if (href === "#") return
  
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
  
  // ============================================
  // PARALLAX EFFECT FOR HERO
  // ============================================
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const heroVisual = document.querySelector(".hero-visual")
    const heroGrid = document.querySelector(".hero-grid")
  
    if (heroVisual && scrolled < window.innerHeight) {
      heroVisual.style.transform = `translateY(calc(-50% + ${scrolled * 0.1}px))`
    }
  
    if (heroGrid && scrolled < window.innerHeight) {
      heroGrid.style.transform = `translateY(${scrolled * 0.05}px)`
    }
  })
  