function carousel(){
    const carousel = document.getElementById("carousel");
    const nextBtn = document.getElementById("rightNav");
    const prevBtn = document.getElementById("leftNav");
    // const leftNav = document.getElementById("leftNav");
    // const rightNav = document.getElementById("rightNav");
    const SCROLL_AMOUNT = 160;
    let scrollPosition = 0;
    // Duplicate items for seamless looping
    // carousel.innerHTML += carousel.innerHTML;



    // Button controls
    nextBtn.addEventListener("click", () => {
    carousel.scrollLeft += SCROLL_AMOUNT;
    scrollPosition -= 1;
    normalizeScroll();
    });

    prevBtn.addEventListener("click", () => {
    carousel.scrollLeft -= SCROLL_AMOUNT;
    scrollPosition += 1;
    normalizeScroll();
    });

    // Keep looping during manual scroll
    // carousel.addEventListener("scroll", normalizeScroll);
}
function normalizeScroll() {
  const half = carousel.scrollWidth / 2;

  if (carousel.scrollLeft >= half) {
    carousel.scrollLeft -= half;
  } else if (carousel.scrollLeft <= 0) {
    carousel.scrollLeft += half;
  }
}