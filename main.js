const dotsContainer = document.getElementById("dots");
const DOT_COUNT = 20;


for (let i = 0; i < DOT_COUNT; i++) {
  const dot = document.createElement("div");
  dot.classList.add("dot");

  // Random size
  const size = Math.random() * 10 + 6;
  dot.style.width = `${size}px`;
  dot.style.height = `${size}px`;

  // Random position
  dot.style.top = `${Math.random() * 100}%`;
  dot.style.left = `${Math.random() * 100}%`;

  // Random animation movement
  dot.style.setProperty("--x", `${(Math.random() - 0.5) * 60}px`);
  dot.style.setProperty("--y", `${(Math.random() - 0.5) * 60}px`);

  // Random duration & delay
  dot.style.animationDuration = `${Math.random() * 8 + 6}s`;
  dot.style.animationDelay = `${Math.random() * 5}s`;

  dotsContainer.appendChild(dot);
}
