document.getElementById("start-button").addEventListener("click", startGame);

let counter = 0;
const counterDisplay = document.getElementById("counter");
const potato = document.getElementById("potato");
const gameScreen = document.getElementById("game-screen");
const videoScreen = document.getElementById("video-screen");

function startGame() {
  document.getElementById("start-screen").classList.add("hidden");
  gameScreen.classList.remove("hidden");
  setupPotato();
}

function setupPotato() {
  const path = document.getElementById("hill-path");
  const pathLength = path.getTotalLength();

  // Find the flat plain starting point
  const flatPlainStart = path.getPointAtLength(400);

  potato.style.transition = "none";
  potato.style.left = `${flatPlainStart.x - potato.width / 2}px`;
  potato.style.top = `${flatPlainStart.y - potato.height / 2}px`;

  potato.onclick = () => rollPotato(path, pathLength, flatPlainStart);
}

function rollPotato(path, pathLength, startPoint) {
  potato.onclick = null; // Disable further clicks during animation
  let startTime = null;

  const animationDuration = 3000; // 3 seconds
  const audio = new Audio("./assets/wee.mp3");
  audio.play();

  function animate(time) {
    if (!startTime) startTime = time;
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / animationDuration, 1);
    const point = path.getPointAtLength(400 + progress * (pathLength - 400));

    potato.style.left = `${point.x - potato.width / 2}px`;
    potato.style.top = `${point.y - potato.height / 2}px`;
    potato.style.transform = `rotate(${progress * 1440}deg)`; // 4 full rotations

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      counter++;
      counterDisplay.textContent = counter;
      if (counter >= 3) {
        gameScreen.classList.add("hidden");
        playVideo();
      } else {
        setupPotato();
      }
    }
  }

  requestAnimationFrame(animate);
}

function playVideo() {
  videoScreen.classList.remove("hidden");
  const video = document.getElementById("surprise-video");
  if (video.canPlayType && video.canPlayType("video/mp4")) {
    video.play();
  }
}
