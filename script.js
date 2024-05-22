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

  // Find the highest point of the path
  const highestPoint = getHighestPoint(path, pathLength);

  potato.style.transition = "none";
  potato.style.left = `${highestPoint.x - potato.width / 2}px`;
  potato.style.top = `${highestPoint.y - potato.height / 2}px`;

  potato.onclick = () => rollPotato(path, pathLength, highestPoint);
}

function getHighestPoint(path, pathLength) {
  let highestPoint = path.getPointAtLength(0);
  let highestY = highestPoint.y;

  for (let i = 1; i <= pathLength; i++) {
    const point = path.getPointAtLength(i);
    if (point.y < highestY) {
      highestY = point.y;
      highestPoint = point;
    }
  }

  return highestPoint;
}

function rollPotato(path, pathLength, startPoint) {
  potato.onclick = null; // Disable further clicks during animation
  let startTime = null;

  const animationDuration = 5000; // 5 seconds
  const audio = new Audio("wee.mp3");
  audio.play();

  function animate(time) {
    if (!startTime) startTime = time;
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / animationDuration, 1);
    const point = path.getPointAtLength(
      progress *
        (pathLength -
          (path.getTotalLength() * startPoint.x) / path.getTotalLength())
    );

    potato.style.left = `${point.x - potato.width / 2}px`;
    potato.style.top = `${point.y - potato.height / 2}px`;
    potato.style.transform = `rotate(${progress * 720}deg)`; // 2 full rotations

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
