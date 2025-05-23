document.addEventListener('DOMContentLoaded', function() {

    const body = document.body;
    const siteHeader = document.querySelector('.site-header'); // Get header early

    // --- Mobile Menu Toggle Code ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    const searchToggle = document.getElementById('searchToggle'); // Defined early
    const darkModeToggle = document.getElementById('darkModeToggle'); // Defined early

    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent immediate closing if click propagates
            mainMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (mainMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars'); icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times'); icon.classList.add('fa-bars');
            }
        });

        // Close menu if clicking outside of it (on mobile)
        document.addEventListener('click', function(event) {
            const mainNavContainer = mainMenu.closest('.main-nav');
            if (!mainNavContainer) return;

            // Check if click is on any of the toggle buttons inside the nav
            const isClickOnSearchToggle = searchToggle && searchToggle.contains(event.target);
            const isClickOnDarkModeToggle = darkModeToggle && darkModeToggle.contains(event.target);
            const isClickOnMenuToggle = menuToggle && menuToggle.contains(event.target); // Check menu toggle itself

            const isClickInsideNavContainer = mainNavContainer.contains(event.target);
            const isClickInsideExpandedMenu = mainMenu.contains(event.target); // Specifically inside the UL

            // Close menu only if click is outside nav container AND NOT on the interactive toggles OR inside the expanded menu list
            if (mainMenu.classList.contains('active') &&
                !isClickInsideExpandedMenu &&
                !isClickOnMenuToggle &&
                !isClickOnSearchToggle &&
                !isClickOnDarkModeToggle)
             {
                // More robust check: ensure click is truly outside the whole nav area if menu is open
                 if (!mainNavContainer.contains(event.target)) {
                     mainMenu.classList.remove('active');
                     const icon = menuToggle.querySelector('i');
                     icon.classList.remove('fa-times'); icon.classList.add('fa-bars');
                 }
            }
        });
    }
    // --- End of Mobile Menu Code ---


    // --- Dark Mode Toggle Code ---
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    const setTheme = (isDark) => {
        if (isDark) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkModeEnabled', 'true');
            if (darkModeToggle) darkModeToggle.setAttribute('aria-pressed', 'true');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkModeEnabled', 'false');
             if (darkModeToggle) darkModeToggle.setAttribute('aria-pressed', 'false');
        }
    };

    const savedTheme = localStorage.getItem('darkModeEnabled');
    if (savedTheme !== null) {
        setTheme(savedTheme === 'true');
    } else {
        setTheme(prefersDarkScheme.matches);
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing menu
            const isCurrentlyDark = body.classList.contains('dark-mode');
            setTheme(!isCurrentlyDark);
        });
    }

    prefersDarkScheme.addEventListener('change', (e) => {
         const currentSavedTheme = localStorage.getItem('darkModeEnabled');
         if (currentSavedTheme === null) {
             setTheme(e.matches);
         }
    });
    // --- End of Dark Mode Toggle Code ---


    // --- Search Overlay Logic ---
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    const searchInput = document.getElementById('searchInput');

    if (searchToggle && searchOverlay && closeSearchBtn && searchInput) {
        searchToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent menu close logic
            searchOverlay.classList.add('active');
            body.classList.add('search-overlay-active'); // Prevent body scroll
            setTimeout(() => searchInput.focus(), 50); // Focus after transition starts
        });

        const closeSearch = () => {
            searchOverlay.classList.remove('active');
             body.classList.remove('search-overlay-active');
        };

        closeSearchBtn.addEventListener('click', closeSearch);

        searchOverlay.addEventListener('click', (e) => {
             if (e.target === searchOverlay) { // Only if clicking the overlay background itself
                 closeSearch();
             }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                closeSearch();
            }
        });

        const searchForm = searchOverlay.querySelector('.search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                // Replace with actual search logic or remove preventDefault if submitting normally
                // e.preventDefault();
                // console.log('Searching for:', searchInput.value);
                // closeSearch(); // Optionally close overlay on submit
            });
        }
    }
    // --- End of Search Overlay Logic ---


    // --- CTA Button Scroll Animation (Intersection Observer) ---
    const ctaButton = document.getElementById('ctaButton'); // Renamed variable for clarity

    if (ctaButton) {
        ctaButton.classList.add('cta-hidden'); // Set initial state

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.4
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => { // Small delay for smoother effect
                        entry.target.classList.add('cta-visible');
                        entry.target.classList.remove('cta-hidden');
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        };

        const intersectionObserver = new IntersectionObserver(observerCallback, observerOptions);

        // Delay observation start slightly
        setTimeout(() => {
            intersectionObserver.observe(ctaButton);
        }, 200);
    }
    // --- End of CTA Button Scroll Animation ---


    // --- Smooth Scroll for Hero CTA Button ---
    // ctaButton variable already declared above for the animation observer
    const featuresSection = document.getElementById('featuresSection');

    if (ctaButton && featuresSection && siteHeader) { // Check ctaButton again
        ctaButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor jump

            const headerHeight = siteHeader.offsetHeight; // Get current header height
            const sectionTop = featuresSection.getBoundingClientRect().top + window.scrollY; // More reliable position
            const scrollToPosition = sectionTop - headerHeight; // Adjust for header

            window.scrollTo({
                top: scrollToPosition,
                behavior: 'smooth'
            });
        });
    }
    // --- End of Smooth Scroll for Hero CTA Button ---

       // --- Scroll to Top Button Logic ---
       const scrollToTopBtn = document.getElementById('scrollToTopBtn');
       const scrollThreshold = 300; // Pixels scrolled down before button appears
   
       if (scrollToTopBtn) {
           // Function to show/hide button based on scroll position
           const checkScrollPosition = () => {
               if (window.scrollY > scrollThreshold) {
                   scrollToTopBtn.classList.add('show-scroll');
               } else {
                   scrollToTopBtn.classList.remove('show-scroll');
               }
           };
   
           // Initial check in case the page loads already scrolled down
           checkScrollPosition();
   
           // Listen for scroll events
           window.addEventListener('scroll', checkScrollPosition);
   
           // Listen for click event on the button
           scrollToTopBtn.addEventListener('click', () => {
               window.scrollTo({
                   top: 0,
                   behavior: 'smooth'
               });
           });
       }
       // --- End of Scroll to Top Button Logic ---


           // --- "Under Construction" Modal Logic ---
    const lessonsTrigger = document.getElementById('lessonsFeatureItem');
    const constructionModal = document.getElementById('constructionModalOverlay');
    const closeConstructionBtn = document.getElementById('closeConstructionModalBtn');
    const closeConstructionBtnBottom = document.getElementById('closeConstructionModalBtnBottom');

    // Function to open the modal
    const openConstructionModal = () => {
        if (constructionModal) {
            constructionModal.classList.add('active');
            body.classList.add('modal-open'); // Prevent background scroll
        }
    };

    // Function to close the modal
    const closeConstructionModal = () => {
         if (constructionModal) {
            constructionModal.classList.remove('active');
            body.classList.remove('modal-open'); // Re-enable scroll
        }
    };

    // Event listener for the trigger element
    if (lessonsTrigger) {
        lessonsTrigger.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent any default link behavior if it were a link
            openConstructionModal();
        });
    }

    // Event listeners for closing the modal
    if (closeConstructionBtn) {
        closeConstructionBtn.addEventListener('click', closeConstructionModal);
    }
     if (closeConstructionBtnBottom) {
        closeConstructionBtnBottom.addEventListener('click', closeConstructionModal);
    }

    // Close modal on clicking the overlay background
    if (constructionModal) {
        constructionModal.addEventListener('click', (e) => {
            if (e.target === constructionModal) { // Clicked on the overlay itself
                closeConstructionModal();
            }
        });
    }

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && constructionModal && constructionModal.classList.contains('active')) {
            closeConstructionModal();
        }
    });
    // --- End of "Under Construction" Modal Logic ---

    // --- Header Scroll Effect ---
    const scrollThresholdHeader = 10; // How many pixels to scroll before changing header

    if (siteHeader) {
        const handleHeaderScroll = () => {
            if (window.scrollY > scrollThresholdHeader) {
                siteHeader.classList.add('header-scrolled');
            } else {
                siteHeader.classList.remove('header-scrolled');
            }
        };

        // Initial check on load
        handleHeaderScroll();

        // Add scroll listener
        window.addEventListener('scroll', handleHeaderScroll, { passive: true }); // Use passive listener for performance
    }
    // --- End Header Scroll Effect ---






// --- Notification Bar Logic (Show Always + Animation + Autohide ONCE) ---
const notificationBar = document.getElementById('notificationBar');
const closeNotificationBtn = document.getElementById('closeNotificationBtn');
let autoHideTimer = null; // Variable to hold the timer ID

if (notificationBar && closeNotificationBtn) {

    // Function to hide the bar (reusable)
    const hideNotificationBar = () => {
        // Clear the autohide timer if it exists (prevents issues if called multiple times)
        if (autoHideTimer) {
            clearTimeout(autoHideTimer);
            autoHideTimer = null;
        }

        // Only proceed if the bar isn't already hidden
        if (!notificationBar.classList.contains('hidden')) {
             notificationBar.classList.remove('visible'); // Remove visible state first
             notificationBar.classList.add('hidden');    // Add hidden state for exit animation

             notificationBar.addEventListener('transitionend', () => {
                 if (notificationBar.classList.contains('hidden')) {
                    // Optional: Set display none after hiding completely
                    // notificationBar.style.display = 'none';
                 }
             }, { once: true });
        }
    };

    // --- Initial Setup on Page Load ---
    // Ensure bar is ready but hidden initially based on CSS defaults
    notificationBar.classList.remove('hidden'); // Remove hidden class if set from previous interaction (unlikely now, but safe)
    notificationBar.style.display = ''; // Ensure display is not none

    // Trigger the slide-in animation shortly after page load
    requestAnimationFrame(() => {
        setTimeout(() => {
            notificationBar.classList.add('visible');

            // !!! SET THE TIMER ONLY ONCE after it becomes visible !!!
            if (!autoHideTimer) { // Check if timer hasn't been set already
                 autoHideTimer = setTimeout(hideNotificationBar, 5000); // 5 seconds
            }

        }, 50); // Small delay
    });
    // --- End Initial Setup ---


    // Add click listener to the close button to manually hide
    closeNotificationBtn.addEventListener('click', () => {
         hideNotificationBar(); // Call the reusable hide function
    });

}
// --- End Notification Bar Logic (Show Always + Animation + Autohide ONCE) ---
        
function openEmail() {
    const isMobile = /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent);

    const subject = encodeURIComponent("KALEM Physics Support");
    const body = encodeURIComponent(`Dear KALEM Physics Support Team,

I am experiencing the following issue on your platform:

[Please describe the issue here]

Device: [Your Device]
Browser: [Your Browser]

Thank you for your assistance.

Best regards,
[Your Name]`);

    if (isMobile) {
      // فتح تطبيق البريد الافتراضي على الهاتف
      window.location.href = `mailto:sofianek208@gmail.com?subject=${subject}&body=${body}`;
    } else {
      // فتح Gmail في المتصفح على الحاسوب
      const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=sofianek208@gmail.com&su=${subject}&body=${body}`;
      window.open(gmailURL, '_blank');
    }
  }



    // --- Web Share API Logic for Share Buttons ---
    const shareButtons = document.querySelectorAll('.share-btn');

    if (navigator.share) { // Check if the browser supports the Web Share API
        shareButtons.forEach(button => {
            button.style.display = 'inline-flex'; // Make sure button is visible

            button.addEventListener('click', async () => {
                const title = button.dataset.shareTitle || document.title; // Get title from data attribute or page title
                const url = button.dataset.shareUrl || window.location.href; // Get URL from data attribute or current page
                const text = `KALEM Physics: ${title}`; // Optional text

                try {
                    await navigator.share({
                        title: title,
                        text: text,
                        url: url,
                    });
                    console.log('Content shared successfully');
                } catch (err) {
                    console.error('Error sharing content:', err);
                    // Optional: Implement fallback sharing links here if needed
                    // alert(`حدث خطأ أثناء المشاركة: ${err.message}`);
                }
            });
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        // Option 1: Hide the share buttons entirely
        console.warn('Web Share API not supported. Hiding share buttons.');
        shareButtons.forEach(button => {
            button.style.display = 'none';
        });

        // Option 2: (More complex) Show links for specific platforms (FB, Twitter, WhatsApp)
        // This would require modifying the HTML to include these links and showing/hiding them here.
        // Example (conceptual - would need corresponding HTML):
        // shareButtons.forEach(button => {
        //   button.style.display = 'none'; // Hide the main share button
        //   const fallbackLinks = button.closest('.document-actions').querySelector('.fallback-share-links');
        //   if(fallbackLinks) fallbackLinks.style.display = 'flex';
        // });
    }
    // --- End Web Share API Logic ---













}); // End of DOMContentLoaded listener