import "./node_modules/hacktimer/HackTimer.js";

"use strict";

let random;
let rounded;
let randX;
let randY;

function applyBackground() {
    document.body.style.backgroundImage = `url("media/pattern${rounded}.png")`;
    if (rounded == 0) {
        document.body.style.backgroundSize = "35vh"
    } else {
        document.body.style.backgroundSize = "420vh"
    };
    document.body.style.backgroundPositionX = `${randX}px`;
    document.body.style.backgroundPositionY = `${randY}px`;
};

(function setBackground() {
    random = Math.random();
    rounded = Math.round(random);
    randX = Math.random() * -1500;
    randY = Math.random() * -1000;
    applyBackground();
})();

//global scope DOM elements
const startButton = document.querySelector("#start");
startButton.setAttribute("disabled", "");
const intervalOption = document.querySelector("#interval");
const silentOption = document.querySelector("#silent");
const footer = document.querySelector("footer");
const pauseButton = document.querySelector("figure button");

//global scope color setting
let root = document.querySelector(":root");
root.style.setProperty('--varcolor', 'lightgreen');


//INPUT ACTIONS

(function optionsExclusion() {

    silentOption.addEventListener("click", function(event) {
        intervalOption.checked = false;
    })
    intervalOption.addEventListener("click", function(event) {
        silentOption.checked = false;

    })
})();

//enables start button on valid input
(function enableStart() {

    let validField = 0;
    let activeTarget;
    const inputFields = document.querySelectorAll(".timeField");

    function validInput(event) {

        if (inputFields[0].value > 24) {
            alert("Duration cannot exceed 24 hours. Sorry!");
            inputFields[0].value = "";
        }

        let completeInput = "";
        for (let inputField of inputFields) {
            completeInput = completeInput + inputField.value;
        }

        const regex = /^\d*[1-9]+\d*$/;
        let valid = regex.test(completeInput);

        if (valid == true) {
            startButton.removeAttribute("disabled");
        } else {
            startButton.setAttribute("disabled", "");
        }
    }

    for (let inputField of inputFields) {
        inputField.addEventListener("input", validInput);
    }

})();

(function detailsHandler() {
    const timerInfo = footer.querySelector(".infos");
    const navButton = footer.querySelector("nav");
    let isOpen = false;

    document.addEventListener("click", function handleDetails(e) {
        if (e.target == navButton && isOpen == false) {
            navButton.innerHTML = "close";
            isOpen = true;
            timerInfo.classList.add('footer-opened');
            navButton.classList.add('nav-opened');

        } else if (isOpen == true) {
            navButton.innerHTML = "about";
            isOpen = false;
            timerInfo.classList.remove('footer-opened');
            navButton.classList.remove('nav-opened');
        }
    })

})();


//COUNTDOWN ACTIONS
(function buttonTrigger() {
    startButton.addEventListener("click", function timerStart(event) {
        event.preventDefault();
        const startTime = new Date().getTime();
        const countdownDisplay = document.querySelector("figcaption");
        const blocks = document.querySelectorAll("progress");
        const timerDisplay = document.querySelector("figure");
        const endBox = document.querySelector("#endMessage");
        const inputBox = document.querySelector("main");
        let inputTimes = [];
        inputTimes.push(document.querySelector("#hours").value);
        inputTimes.push(document.querySelector("#minutes").value);
        inputTimes.push(document.querySelector("#seconds").value);
        let durationMS = 0;
        let paused = false;

        function timeDisplay(a, b, c) {
            let timeUnits = ["hour", "minute", "second"];
            let timeValues = [a, b, c];

            for (let i = 0; i < timeValues.length; i++) {

                if (timeValues[i] > 1) {
                    timeUnits[i] = timeUnits[i] + "s";
                } else if (timeValues[i] == 0) {
                    timeUnits[i] = "";
                    timeValues[i] = "";
                }

            }

            countdownDisplay.innerHTML = `${timeValues[0]} ${timeUnits[0]} ${timeValues[1]} ${timeUnits[1]} ${timeValues[2]} ${timeUnits[2]}`

        }

        (function setUpTimer() {

            //formats input into proper time format
            for (let i = 0; i < inputTimes.length; i++) {

                if (inputTimes[i] == false) {
                    inputTimes[i] = 0;
                }

                function calcTime() {
                    if (inputTimes[i] > 59 && i > 0) {
                        inputTimes[i] = inputTimes[i] - 60;
                        inputTimes[i - 1]++;
                        calcTime();
                    }
                }
                calcTime();
            }

            timeDisplay(inputTimes[0], inputTimes[1], inputTimes[2]);

            timerDisplay.style.display = "flex";
            timerDisplay.style.opacity = "100";
            pauseButton.style.display = "inline-block";
            for (let block of blocks) {
                block.style.display = "inline-block";
            };


        })();

        (function timeInMillisec() {
            let x = 1000;

            for (let i = inputTimes.length - 1; i >= 0; i--) {
                durationMS = durationMS + inputTimes[i] * x;
                x = x * 60;
            }
            durationMS = durationMS + 100;
        })();

        let timerEndTime = startTime + durationMS;
        let remainingTime;
        let rH;
        let rM;
        let rS;
        let bellCount = blocks.length - 1;
        let mustStop = false;

        (function hideInputBox() {
            inputBox.style.display = "none";
            footer.style.display = "none";
            document.body.style.backgroundImage = 'none';
        })();

        (function rotateBlocks() {
            let angle = 180;
            for (let block of blocks) {
                block.style.transform = `rotate(${angle}deg)`;
                angle = angle - 90;
            }
        })();

        function runTimer() {

            //actualizes countdown time
            (function countdown() {
                //calculates difference between current time and aimed end time
                let currentTime = new Date().getTime();
                remainingTime = timerEndTime - currentTime;
                rH = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                rM = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                rS = Math.floor((remainingTime % (1000 * 60)) / 1000);
                timeDisplay(rH, rM, rS);

                (function endDisplay() {
                    if (remainingTime <= 1000) {
                        for (let block of blocks) {
                            block.style.display = "none";
                        }
                        countdownDisplay.innerHTML = "time's up!";
                        countdownDisplay.classList.add("end-message");
                        pauseButton.style.display = "none";

                        if (!mustStop) {
                            mustStop = true;
                            setTimeout(function hideEndBox() {
                                let hasRun = true;
                                timerDisplay.style.transition = "all 1s ease-out"
                                timerDisplay.style.opacity = "0";
                                setTimeout(function() {
                                    countdownDisplay.classList.remove("end-message");
                                    inputBox.style.display = "block";
                                    footer.style.display = "block";
                                    applyBackground();
                                    timerDisplay.style.transition = "none"
                                }, 1200);
                            }, 2000)
                        }
                    }

                    if (remainingTime <= 0) {
                        clearInterval(runningInterval);
                        mustStop = false;
                    }

                })();

            })();

            (function progressActions() {
                let amount = (remainingTime / durationMS) * (blocks.length);
                let fAmount = Math.floor(amount);

                //controls display of the progress blocks
                function timeBlocks(i) {

                    if (amount <= 0) {
                        blocks[0].value = 0;
                        for (let block of blocks) {
                            block.value = 100;
                        };

                    } else if (fAmount == i) {

                        let newValue = (amount - fAmount) * 100;
                        blocks[fAmount].value = newValue;

                        if (fAmount < blocks.length - 1) {
                            blocks[fAmount + 1].value = 0;
                        };
                    }
                }

                for (let i = blocks.length - 1; i >= 0; i--) {

                    //control bells
                    (function invervalBell() {
                        let interBell = new Audio(`media/bell${i}.mp3`);

                        if (intervalOption.checked == true && (amount <= i && i <= bellCount)) {
                            interBell.play();
                            bellCount--;
                        } else if (mustStop && i == 0 && silentOption.checked == false) {
                            interBell.play();
                            return;
                        }
                    })();

                    timeBlocks(i);
                }
            })();

        }

        pauseButton.addEventListener("click", function playPause() {

            let restartTime;

            if (paused == false) {
                clearInterval(runningInterval);
                paused = true;
                pauseButton.innerHTML = "▶"
                pauseButton.classList.add('paused');
                countdownDisplay.classList.add('paused');
            } else {
                restartTime = new Date().getTime();
                timerEndTime = restartTime + remainingTime;
                paused = false;
                pauseButton.innerHTML = "II";
                pauseButton.classList.remove('paused');
                countdownDisplay.classList.remove('paused');
                runningInterval = setInterval(runTimer, 1000);
            }
        });

        let runningInterval = setInterval(runTimer, 1000);
    });

})();