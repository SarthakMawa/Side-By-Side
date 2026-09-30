document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("intro-overlay");
  const introVideo = document.getElementById("intro-video");
  const progressBar = document.getElementById("progress-bar");
  const skipBtn = document.getElementById("skip-btn");
  const nav = document.getElementById("main-nav");
  const INTRO_DURATION = 6000;

  document.body.classList.add("intro-active");

  let startTime = Date.now();
  let animationFrame;

  function updateProgress() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min((elapsed / INTRO_DURATION) * 100, 100);
    progressBar.style.width = progress + "%";

    if (elapsed < INTRO_DURATION) {
      animationFrame = requestAnimationFrame(updateProgress);
    } else {
      dismissIntro();
    }
  }

  function dismissIntro() {
    cancelAnimationFrame(animationFrame);
    overlay.classList.add("hidden");
    document.body.classList.remove("intro-active");
    nav.classList.add("visible");

    if (introVideo) {
      introVideo.pause();
    }
  }

  skipBtn.addEventListener("click", dismissIntro);

  if (introVideo) {
    introVideo.play().catch(() => {
      /* autoplay blocked — intro still works */
    });
  }

  animationFrame = requestAnimationFrame(updateProgress);

  /* Nav scroll behavior */
  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });

  /* Scroll reveal */
  const revealElements = document.querySelectorAll(
    ".coffee-card, .process-step, .story-grid, .visit-card, .section-header, .story-video-block"
  );

  revealElements.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((el) => observer.observe(el));

  /* Stagger coffee cards */
  document.querySelectorAll(".coffee-card").forEach((card, i) => {
    card.style.transitionDelay = i * 0.1 + "s";
  });

  /* Story video player */
  const storyVideo = document.getElementById("story-video-player");
  const storyOverlay = document.getElementById("story-video-overlay");
  const storyPlayBtn = document.getElementById("story-play-btn");

  function playStoryVideo() {
    if (!storyVideo) return;
    storyVideo.muted = false;
    storyVideo.controls = true;
    storyVideo.play().catch(() => {
      storyVideo.muted = true;
      storyVideo.play();
    });
    storyOverlay?.classList.add("hidden");
  }

  storyPlayBtn?.addEventListener("click", playStoryVideo);

  storyVideo?.addEventListener("ended", () => {
    storyOverlay?.classList.remove("hidden");
    storyVideo.controls = false;
    storyVideo.currentTime = 0;
  });

  document.querySelector('a[href="#story-video"]')?.addEventListener("click", () => {
    setTimeout(playStoryVideo, 600);
  });
});
