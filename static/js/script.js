function useTocLinksSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            }
        });
    });
}

function useTocSectionHighlight() {
    const tocLinks = document.querySelectorAll('nav#TableOfContents a');
    const headings = document.querySelectorAll('.post-content h1[id], .post-content h2[id], .post-content h3[id], .post-content h4[id], .post-content h5[id], .post-content h6[id]');
    
    if (tocLinks.length > 0 && headings.length > 0) {
        let isScrolling = false;
        
        function highlightTocLink() {
            // Get current scroll position
            const scrollPosition = window.scrollY + 150; // Offset for header
            
            // Check if we're at the bottom of the page
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const isAtBottom = windowHeight + window.scrollY >= documentHeight - 10;
            
            let currentHeading = null;
            
            // If at bottom, use the last heading
            if (isAtBottom && headings.length > 0) {
                currentHeading = headings[headings.length - 1];
            } else {
                // Find the current heading
                headings.forEach(heading => {
                    const headingTop = heading.getBoundingClientRect().top + window.scrollY;
                    if (scrollPosition >= headingTop) {
                        currentHeading = heading;
                    }
                });
            }
            
            tocLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to current heading's link
            if (currentHeading) {
                const id = currentHeading.getAttribute('id');
                if (id) {
                    const activeLink = document.querySelector(`nav#TableOfContents a[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                        
                        // Scroll TOC to make active link visible
                        const tocWrapper = document.querySelector('.toc-wrapper');
                        if (tocWrapper) {
                            const linkTop = activeLink.offsetTop;
                            const linkBottom = linkTop + activeLink.offsetHeight;
                            const wrapperScrollTop = tocWrapper.scrollTop;
                            const wrapperHeight = tocWrapper.clientHeight;
                            
                            if (linkTop < wrapperScrollTop) {
                                tocWrapper.scrollTop = linkTop - 20;
                            } else if (linkBottom > wrapperScrollTop + wrapperHeight) {
                                tocWrapper.scrollTop = linkBottom - wrapperHeight + 20;
                            }
                        }
                    }
                }
            }
        }
        
        window.addEventListener('scroll', function() {
            if (!isScrolling) {
                window.requestAnimationFrame(function() {
                    highlightTocLink();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
        
        highlightTocLink();
    }
}

(function() {
    'use strict';

    useTocSectionHighlight();

    useTocLinksSmoothScroll();
})();
