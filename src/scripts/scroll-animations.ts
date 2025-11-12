import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  // Animate sections on scroll
  const sections = document.querySelectorAll('[data-animate="fade-up"]');
  
  sections.forEach((section) => {
    gsap.fromTo(
      section,
      {
        opacity: 0,
        y: 60,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 95%',
          end: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Animate elements that slide in from left
  const slideLeftElements = document.querySelectorAll('[data-animate="slide-left"]');
  
  slideLeftElements.forEach((element) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        x: -60,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Animate elements that slide in from right
  const slideRightElements = document.querySelectorAll('[data-animate="slide-right"]');
  
  slideRightElements.forEach((element) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        x: 60,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Animate elements that scale up
  const scaleElements = document.querySelectorAll('[data-animate="scale"]');
  
  scaleElements.forEach((element) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        scale: 0.8,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Stagger animations for children elements
  const staggerContainers = document.querySelectorAll('[data-animate="stagger"]');
  
  staggerContainers.forEach((container) => {
    const children = container.children;
    
    gsap.fromTo(
      children,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          end: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });
}

// View transitions for page navigation
export function initPageTransitions() {
  // Check if View Transitions API is supported
  if (document.startViewTransition) {
    // Add smooth transitions between pages
    window.addEventListener('astro:before-swap', (event: any) => {
      document.startViewTransition(() => {
        // The actual page swap happens here
      });
    });
  }
}

