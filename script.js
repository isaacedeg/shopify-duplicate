"use strict";

// DOM Elements
const notificationIcon = document.querySelector(".notification-tab");
const userIcon = document.querySelector(".user-tab");
const alertBox = document.querySelector(".alerts-box");
const adminMenuBox = document.querySelector(".admin-menu-box");
const closeTrialIcon = document.querySelector(".trial-closeicon");
const trialBox = document.querySelector(".trial-section");
const progressBar = document.querySelector(".setup-progressbar");
const closeSetupIcon = document.querySelector(".setup-onclose");
const openSetupIcon = document.querySelector(".setup-open");

const setupStepsBox = document.querySelector(".setup-steps-box");
const allSetupStepBox = document.querySelectorAll(".setup-step-box");
const allSetupSteps = document.querySelectorAll(".setup__step__heading__text");
const allSetupBtn = document.querySelectorAll(".setup-step-box__button");
const allSetupCheckedIcon = document.querySelector(
  ".setup__step__checked__icon"
);
const allSetupLoadingIcon = document.querySelector(
  ".setup__step__loading__icon"
);
const allSetupSelectIcon = document.querySelector(".setup__step__select__icon");
const allSetupCheckbox = document.querySelectorAll(".setup__checkbox");
const allSetupCheckboxBoxes = document.querySelectorAll(".setup-checkbox");

// Functions

function closeSetupBox() {
  setupStepsBox.style.display = "none";
  openSetupIcon.style.display = "block";
  closeSetupIcon.style.display = "none";
  allSetupStepBox.forEach((step) => {
    step.setAttribute("aria-hidden", "true");
  });
  setupStepsBox.setAttribute("aria-hidden", "true");
}

function openSetupBox() {
  setupStepsBox.style.display = "block";
  openSetupIcon.style.display = "none";
  closeSetupIcon.style.display = "block";
  allSetupStepBox.forEach((step) => {
    step.setAttribute("aria-hidden", "false");
  });
  setupStepsBox.setAttribute("aria-hidden", "false");
}

function toggleNotificationBox() {
  alertBox.classList.toggle("alerts-box__toggle");
  notificationIcon.classList.toggle("notification__icon__hover");
  const expanded = alertBox.classList.contains("alert__box__toggle");
  alertBox.setAttribute("aria-expanded", expanded);
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    if (event.target === notificationIcon) {
      toggleNotificationBox();
    } else if (event.target === userIcon) {
      toggleAdminUserBox();
    }
  }
}

function toggleAdminUserBox() {
  adminMenuBox.classList.toggle("admin__menu__toggle");
  userIcon.classList.toggle("user__box__active");
  const expanded = adminMenuBox.classList.contains("admin__menu__toggle");
  adminMenuBox.setAttribute("aria-expanded", expanded);
}

function removeTrialBox() {
  trialBox.setAttribute("aria-hidden", "true");
  trialBox.style.display = "none";
}

function handleTrialBoxKeyPress(event) {
  if (event.key === "Enter" || event.key === " ") {
    removeTrialBox();
    event.preventDefault();
  }
}

// Checkbox Functions
function handleCheckboxToggle(checkbox, checkedIcon, selectIcon, loadingIcon) {
  checkbox.checked = !checkbox.checked;

  if (checkbox.checked) {
    loadingIcon.classList.add("setup__step__loading__icon__active");
    checkedIcon.classList.add("setup-step-ensured-active");
    setTimeout(() => {
      loadingIcon.classList.remove("setup__step__loading__icon__active");
      checkedIcon.classList.add("setup__step__checked__icon__active");
    }, 150);
    selectIcon.style.display = "none";
  } else {
    checkedIcon.classList.remove("setup-step-ensured-active");
    checkedIcon.classList.remove("setup__step__checked__icon__active");
    selectIcon.style.display = "block";
  }
}

function updateProgressBar() {
  const progressNumber = document.querySelector(".setup-completed-number");
  const completedSteps = document.querySelectorAll(
    ".setup-step-ensured-active"
  );

  progressBar.value = completedSteps.length;
  progressNumber.innerHTML = completedSteps.length;
}

function expandNextIncompleteStep(startIndex) {
  let nextUncheckedIndex = null;

  for (let i = startIndex; i < allSetupCheckboxBoxes.length; i++) {
    const checkboxBox = allSetupCheckboxBoxes[i];
    const checkbox = checkboxBox.querySelector(".setup__checkbox");

    if (!checkbox.checked) {
      nextUncheckedIndex = i;
      removeAllActiveBoxClasses();
      activateNextStepBox(checkboxBox);
      break;
    }
  }

  if (nextUncheckedIndex === null) {
    for (let i = 0; i < startIndex; i++) {
      const checkboxBox = allSetupCheckboxBoxes[i];
      const checkbox = checkboxBox.querySelector(".setup__checkbox");

      if (!checkbox.checked) {
        removeAllActiveBoxClasses();
        activateNextStepBox(checkboxBox);
        break;
      }
    }
  }
}

function removeAllActiveBoxClasses() {
  const activeSetUpBox = document.querySelectorAll(".setup-step-box__active");

  activeSetUpBox.forEach((box) => {
    box.classList.remove("setup-step-box__active");
  });
}

function activateNextStepBox(checkboxBox) {
  const nextStepBox = checkboxBox.closest(".setup-step-box");
  if (nextStepBox) {
    nextStepBox.classList.add("setup-step-box__active");
  }
}

function expandSetupStep(e) {
  removeAllActiveBoxClasses();
  const parentEl = e.target.closest(".setup-step-box");
  parentEl.classList.add("setup-step-box__active");
}

let arr = [];

// Checkbox Setup
allSetupCheckboxBoxes.forEach((checkboxBox, index) => {
  const checkbox = checkboxBox.querySelector(".setup__checkbox");
  const checkedIcon = checkboxBox.querySelector(".setup__step__checked__icon");
  const selectIcon = checkboxBox.querySelector(".setup__step__select__icon");
  const loadingIcon = checkboxBox.querySelector(".setup__step__loading__icon");

  checkboxBox.addEventListener("click", function () {
    handleCheckboxToggle(checkbox, checkedIcon, selectIcon, loadingIcon);
    updateProgressBar();
    if (progressBar.value != "0") {
      arr.push(progressBar.value);
    }
    const lastValue = Number(arr[arr.length - 1]);
    const nextLastValue = Number(arr[arr.length - 2]);
    const precedingLastValue = Number(arr[arr.length - 3]);
    console.log(arr);
    if (
      lastValue < precedingLastValue ||
      (lastValue < nextLastValue && lastValue !== nextLastValue)
    ) {
      return;
    }
    removeAllActiveBoxClasses();
    expandNextIncompleteStep(index + 1);
  });
});

// Event Listeners
notificationIcon.addEventListener("click", toggleNotificationBox);
userIcon.addEventListener("click", toggleAdminUserBox);
notificationIcon.addEventListener("keypress", handleKeyPress);
userIcon.addEventListener("keypress", handleKeyPress);

closeTrialIcon.addEventListener("click", removeTrialBox);
closeTrialIcon.addEventListener("keypress", handleTrialBoxKeyPress);
closeTrialIcon.addEventListener("keypress", (event) => {
  if (event.key === "Escape") {
    removeTrialBox();
  }
});

closeSetupIcon.addEventListener("click", closeSetupBox);
openSetupIcon.addEventListener("click", openSetupBox);
allSetupSteps.forEach((btn) => btn.addEventListener("click", expandSetupStep));
