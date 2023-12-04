const inputFields = document.querySelectorAll(".timeField");
const startButton = document.querySelector("#start");
const intervalOption = document.querySelector("#interval");
const silentOption = document.querySelector("#silent");
const footer = document.querySelector("footer");
let inputH;
let inputM;
let inputS;

startButton.setAttribute("disabled", "");

//CODE CONTROLLING INPUT ACTION

//checks for valid input and activates start button.
function validInput(event) {

    empty = 0;

    let newInput = event.target.value;
    const regex = /^\d*[1-9]+\d*$/;
    let valid = regex.test(newInput);

    if (valid == true) {
        startButton.removeAttribute("disabled");
    } else {
        startButton.setAttribute("disabled", "");
    }
}

(function optionsExclusion() {
    silentOption.addEventListener("click", function(event) {
        intervalOption.checked = false;
    })
    intervalOption.addEventListener("click", function(event) {
        silentOption.checked = false;

    })
})();

//event listener for input
(function enableStart() {
    for (let i = 0; i < inputFields.length; i++) {
        inputFields[i].addEventListener("input", validInput);
    }
})();

(function detailsHandler() {
    const timerInfo = footer.querySelector("p");
    const navButton = footer.querySelector("nav");
    let isOpen = false;
    footer.addEventListener("click", function handleDetails() {
        if (isOpen == false) {
            timerInfo.style.display = "inline-block";
            navButton.innerHTML = "close";
            isOpen = true;
            navButton.style.color = "lightgreen";
        } else if (isOpen == true) {
            timerInfo.style.display = "none";
            navButton.innerHTML = "details";
            isOpen = false;
            navButton.style.color = "black";
        }
    })

})();


//CODE CONTROLLING COUNTDOWN ACTION
(function buttonTrigger() {
    startButton.addEventListener("click", function timerStart(event) {
        event.preventDefault();
        const countdownDisplay = document.querySelector("figcaption");
        const blocks = document.querySelectorAll("progress");
        const timerDisplay = document.querySelector("figure");
        const endBox = document.querySelector("#endMessage");
        const inputBox = document.querySelector("main");
        inputH = document.querySelector("#hours").value;
        inputM = document.querySelector("#minutes").value;
        inputS = document.querySelector("#seconds").value;
        const startTimeMS =
            1000 * inputS + 1000 * 60 * inputM + 1000 * 60 * 60 * inputH;

        //this initializes the timer

        (function hideInputBox() {
            inputBox.style.display = "none";
            footer.style.display = "none";

        })();

        (function setUpTimer() {
            //this gives empty fields a 0 value
            if (inputH == false) {
                inputH = 0;
            }
            if (inputM == false) {
                inputM = 0;
            }
            if (inputS == false) {
                inputS = 0;
            }

            console.log("setup function running");

            timerDisplay.style.display = "flex";
            countdownDisplay.innerHTML = `${inputH} hours ${inputM} minutes ${inputS} seconds`;

        })();

        (function rotateBlocks() {})();
        let angle = 180;
        for (block of blocks) {
            block.style.transform = `rotate(${angle}deg)`;
            angle = angle - 90;
        }

        function runTimer() {
            //actualizes countdown time
            (function countDown() {
                if (inputH > 0) {
                    if (inputM == 0) {
                        inputM = 59;
                        inputH--;
                    }
                }

                if (inputM > 0) {
                    if (inputS == 0) {
                        inputS = 59;
                        inputM--;
                    } else {
                        inputS--;
                    }
                } else {
                    inputS--;
                }

                countdownDisplay.innerHTML = `${inputH} hours ${inputM} minutes ${inputS} seconds`;

                if (inputS == 0 && inputM == 0 && inputH == 0) {
                    clearInterval(runningInterval);
                    endBox.style.display = "block";
                    setTimeout(function hideEndBox() {
                        endBox.style.display = "none";
                        inputBox.style.display = "block";
                        footer.style.display = "block";
                    }, 4000)
                }
            })();

            (function progressActions() {
                let endTimeMS =
                    1000 * inputS + 1000 * 60 * inputM + 1000 * 60 * 60 * inputH;
                let amount = (endTimeMS / startTimeMS) * (blocks.length);
                let bC = Math.ceil(amount) - 1;

                for (let i = blocks.length - 1; i >= 0; i--) {

                    (function invervalBell() {
                        //the following variables are used to prevent uneven durations from not ringing 1/4 bells
                        let oddHalf = ((endTimeMS + 500) / startTimeMS) * (blocks.length);
                        let oddQuarterMinus = ((endTimeMS + 250) / startTimeMS) * (blocks.length);
                        let oddQuarterPlus = ((endTimeMS - 250) / startTimeMS) * (blocks.length);
                        let interBell = new Audio(`media/bell${i}.mp3`);

                        if (intervalOption.checked == true && (amount == i || oddHalf == i || oddQuarterMinus == i || oddQuarterPlus == i)) {
                            interBell.play();
                        } else if (silentOption.checked == false && amount == i && i == 0) {
                            interBell.play();
                        }
                    })();

                    //this controls the display of the progress blocks
                    (function timeBlocks() {
                        if (amount == 0) {
                            blocks[0].setAttribute("value", 0);
                            var reset = setTimeout(function reset() {
                                for (block of blocks) {
                                    block.value = 100;
                                };
                                timerDisplay.style.display = "none";
                                console.log("timeblock ran");
                            }, 1000)
                        } else if (amount > i) {
                            let newValue = (amount - bC);
                            if (bC >= 0) {
                                blocks[bC].setAttribute("value", newValue * 100);
                            };

                            if (bC < blocks.length - 1) {
                                blocks[bC + 1].setAttribute("value", 0);
                            };
                            return;
                        }
                    })();
                }
            })();

        }

        let runningInterval = setInterval(runTimer, 1000);
    });

})();