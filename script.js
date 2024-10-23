
document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-countdown");
  const pauseButton = document.getElementById("pause-countdown");
  const cancelButton = document.getElementById("cancel-countdown");
  const resumeButton = document.getElementById("resume-countdown");

  let countdownTimer;
  let endTime;

  function updateDisplay(time) {
    console.log(time) ;
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / (1000));
    document.getElementById("days").textContent = days
      .toString()
      .padStart(2, "0");
    document.getElementById("hours").textContent = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").textContent = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").textContent = seconds
      .toString()
      .padStart(2, "0");
  }

  function resetDisplayAndButtons(){
    document.getElementById("target-date").value="";
    document.getElementById("days").textContent='00';
    document.getElementById("hours").textContent='00';
    document.getElementById("minutes").textContent='00';
    document.getElementById("seconds").textContent='00';
    startButton.disabled=false;
    pauseButton.disabled=true;
    cancelButton.disabled=true;
    resumeButton.disabled=true;
  }

  function StartCountdown(duration , isResuming=false) {
      if(!isResuming){
        endTime = Date.now() + duration;
      }
      countdownTimer = setInterval(() => {
          const now= Date.now();
          const timeLeft = endTime - now;
          if(timeLeft<=0){
            clearInterval(countdownTimer);
            displayMessage("Countdown has ended!");
            localStorage.removeItem("countdownTarget");
            resetDisplayAndButtons();
            return;
          }
          updateDisplay(timeLeft);
          pauseButton.disabled=false;
          cancelButton.disabled=false;
      },1000)
  }

  function displayMessage(message){
    const display = document.getElementById("timer-display");
    display.textContent=message;
  }

  startButton.addEventListener("click",function (){
    const targetDateValue = document.getElementById('target-date').value;
    if(targetDateValue){
        const targetDate= new Date(targetDateValue);
        const now = new Date();
        if(targetDate>now){
            const duration = targetDate - now;
            localStorage.setItem("countdownTarget",targetDate.toString());
            StartCountdown(duration);
            startButton.disabled=true;
            pauseButton.disabled=false;
            cancelButton.disabled=false;
            resumeButton.disabled=true;
        }else{
            alert('Please select a future date and time');
        }
    }else{
        alert('Please select a date and time');
    }
  })

  pauseButton.addEventListener("click",function(){
    clearInterval(countdownTimer);
    pauseButton.disabled=true;
    resumeButton.disabled=false;
  })

  resumeButton.addEventListener("click",function(){
      const duration = endTime-Date.now();
      StartCountdown(duration,true);
      pauseButton.disabled=false;
      resumeButton.disabled=true;
  })
  cancelButton.addEventListener("click",function(){
      clearInterval(countdownTimer);
      localStorage.removeItem("countdownTarget");
      resetDisplayAndButtons();
  })
  
  const savedDate = localStorage.getItem("countdownTarget");
  if(savedDate){
    const targetDate = new Date(savedDate);
    const now =  new Date();
    if(targetDate>now){
        const duration = targetDate - now;
        StartCountdown(duration);
        startButton.disabled=true;
        pauseButton.disabled=false;
        cancelButton.disabled=false;
    }
    else{
        localStorage.removeItem("countdownTarget");
        resetDisplayAndButtons();
    }
  }
});
