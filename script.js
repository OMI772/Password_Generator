const inputSlider = document.querySelector(".slider");
const displayPassword = document.querySelector("[data-passwordDisplay]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const copyBtn = document.querySelector("[data-copy]");
const copyMessage = document.querySelector("[data-message]");
const includeUppercaseLetters = document.querySelector(".uppercase");
const includeLowercaseLetters = document.querySelector(".lowercase");
const includeNumbers = document.querySelector(".numbers");
const includeSymbols = document.querySelector(".symbols");
const indicator = document.querySelector(".strength-indicator");
const generatePassBtn = document.querySelector(".generate-password");
const allCheckBoxes = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()-_=+[{]}|:;<>?/"';

let password = "";
let passwordlength = 10;
let chkCount = 0;
handleSlider();
setIndicator("#ccc");

function handleSlider() {
  inputSlider.value = passwordlength;
  lengthDisplay.innerText = passwordlength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  // inputSlider.style.backgroundSize =
  //   ((passwordlength - min) * 100) / (max - min) + "% 100%";
  // console.log(inputSlider.value);
  inputSlider.style.backgroundSize =
    ((passwordlength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
  return getRndInteger(0, 9);
}

function getRandomUppercase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function getRandomLowercase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function getRandomSymbol() {
  return symbols.charAt(getRndInteger(0, symbols.length));
}

function calcStrength() {
  let numChk = false;
  let upperChk = false;
  let lowerChk = false;
  let symChk = false;

  if (includeUppercaseLetters.checked) upperChk = true;
  if (includeLowercaseLetters.checked) lowerChk = true;
  if (includeNumbers.checked) numChk = true;
  if (includeSymbols.checked) symChk = true;

  if (upperChk && lowerChk && (numChk || symChk) && passwordlength >= 10) {
    setIndicator("#0f0");
  } else if (
    (upperChk || lowerChk) &&
    (numChk || symChk) &&
    passwordlength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyToClickBoard() {
  try {
    await navigator.clipboard.writeText(displayPassword.value);
    copyMessage.innerText = "Copied";
  } catch (e) {
    copyMessage.innerText = "Failed";
  }

  copyMessage.classList.add("active");
  setTimeout(function () {
    copyMessage.classList.remove("active");
  }, 2000);
}

function handleChkBoxCount() {
  chkCount = 0;
  allCheckBoxes.forEach((checkbox) => {
    if (checkbox.checked) {
      chkCount++;
    }
  });
  //Special Condition
  if (chkCount > passwordlength) {
    passwordlength = chkCount;
    handleSlider();
  }
}

allCheckBoxes.forEach((checkbox) => {
  checkbox.addEventListener("change", handleChkBoxCount);
});

inputSlider.addEventListener("input", (e) => {
  passwordlength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (displayPassword.value) {
    copyToClickBoard();
  }
});

function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

generatePassBtn.addEventListener("click", () => {
  //check whether any checkbox is checked or not
  if (chkCount <= 0) {
    return;
  }
  //check the checkbox count and password length
  if (chkCount > passwordlength) {
    passwordlength = chkCount;
    handleSlider();
  }

  password = "";

  //time to generate the password
  let funcArr = [];

  if (includeUppercaseLetters.checked) {
    funcArr.push(getRandomUppercase);
  }
  if (includeLowercaseLetters.checked) {
    funcArr.push(getRandomLowercase);
  }
  if (includeNumbers.checked) {
    funcArr.push(getRandomNumber);
  }
  if (includeSymbols.checked) {
    funcArr.push(getRandomSymbol);
  }

  //compulsory password
  for (let i = 0; i < chkCount; i++) {
    password += funcArr[i]();
  }

  //remaining fields
  for (let i = 0; i < passwordlength - funcArr.length; i++) {
    let rndInd = getRndInteger(0, funcArr.length);
    password += funcArr[rndInd]();
  }

  //now we need to shuffle the password
  password = shufflePassword(Array.from(password));

  displayPassword.value = password;

  calcStrength();
});
