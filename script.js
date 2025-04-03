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






}); // End of DOMContentLoaded listener