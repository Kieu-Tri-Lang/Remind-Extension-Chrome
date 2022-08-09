const notifiIcon = document.querySelector(".feather");
const minusBtn = document.querySelector("#minus");
const plusBtn = document.querySelector("#plus");

chrome.storage.local.get(['RemindNotiActive'], function(result) {
  if(result.RemindNotiActive){
    notifiIcon.innerHTML = `<path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>`;
  }else{
    notifiIcon.classList.replace("feather-bell","feather-bell-off");
    notifiIcon.innerHTML = `
      <path d="M8.56 2.9A7 7 0 0 1 19 9v4m-2 4H2a3 3 0 0 0 3-3V9a7 7 0 0 1 .78-3.22M13.73 21a2 2 0 0 1-3.46 0"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    `
  }
});
function drawLineInSvg(
  target,
  from = { x: 1, y: 1 },
  to = { x: 1, y: 1 },
  step = 1,
  timing = 1000
) {
  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");

  let stepX = Math.abs(from.x - to.x) / step;
  let stepY = Math.abs(from.y - to.y) / step;
  let stepTime = stepX > stepY ? stepX : stepY;
  let prevPos = { x: from.x, y: from.y };

  const drawLine = setInterval(frame, timing / Math.abs(stepTime));

  function frame() {
    let oldLine = target.querySelector("line");
    if (prevPos.x == to.x && prevPos.y == to.y) {
      clearInterval(drawLine);
      if (step < 0) target.removeChild(oldLine);
    } else {
      if (oldLine != null) {
        target.removeChild(oldLine);
      }
      if (step > 0) {
        line.setAttribute("x1", from.x);
        line.setAttribute("y1", from.y);
        line.setAttribute("x2", prevPos.x + step);
        line.setAttribute("y2", prevPos.y + step);
      } else {
        line.setAttribute("x1", prevPos.x + step);
        line.setAttribute("y1", prevPos.y + step);
        line.setAttribute("x2", to.x);
        line.setAttribute("y2", to.y);
      }
      prevPos.x += step;
      prevPos.y += step;
      target.appendChild(line);
    }
  }
}
notifiIcon.addEventListener("click", () => {
  // console.log(notifiIcon.children);
  if (notifiIcon.classList.contains("feather-bell")) {
    notifiIcon.children[0]
      .setAttribute(
        "d",
        "M8.56 2.9A7 7 0 0 1 19 9v4m-2 4H2a3 3 0 0 0 3-3V9a7 7 0 0 1 .78-3.22M13.73 21a2 2 0 0 1-3.46 0"
      );
    let from = { x: 1, y: 1 };
    let to = { x: 23, y: 23 };
    let step = 1;
    let timing = 300;
    drawLineInSvg(notifiIcon, from, to, step, timing);
    notifiIcon.classList.replace("feather-bell", "feather-bell-off");
  } else {
    notifiIcon.children[0]
      .setAttribute(
        "d",
        "M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"
      );
    let from = { x: 23, y: 23 };
    let to = { x: 1, y: 1 };
    let step = -1;
    let timing = 300;
    drawLineInSvg(notifiIcon, from, to, step, timing);
    notifiIcon.classList.replace("feather-bell-off", "feather-bell");
  }
  setRemindNotiActive();
});


document.querySelector("#inAdvance").addEventListener('keyup',()=>{
  if(document.querySelector("#inAdvance").value < 1){
    document.querySelector("#inAdvance").value =1;
  }
  if(document.querySelector("#inAdvance").value > 365){
    document.querySelector("#inAdvance").value = 365;
  }
})

minusBtn.addEventListener("click", () => {
  let inAdvance = document.querySelector("#inAdvance");
  if (inAdvance.value > 1) {
    inAdvance.value = parseInt(inAdvance.value) - 1;
  }
  if(inAdvance.value < 1){
    inAdvance.value = 1;    
  }
});
plusBtn.addEventListener("click", () => {
  let inAdvance = document.querySelector("#inAdvance");
  if (inAdvance.value < 365) {
    inAdvance.value = parseInt(inAdvance.value) + 1;
  }
  if(inAdvance.value > 365){
    inAdvance.value = 365;    
  }
});

function setRemindNotiActive(){
  chrome.storage.local.get(['RemindNotiActive'], function(result) {
    chrome.storage.local.set({RemindNotiActive: !result.RemindNotiActive}, function() {
      // console.log('set done ');
    });
  });
}


