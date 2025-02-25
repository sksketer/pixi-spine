import constants from "./constants";

let fileName, spineCharacter, jsonData, animationsName;

addEventListener(constants.SPINE_CREATED, function (event) {
    fileName = event.detail.fileName;
    spineCharacter = event.detail.spineCharacter;
    jsonData = event.detail.jsonData;

    // Perform any task here with the created spine
    console.log(`Spine Created: ${fileName}`, spineCharacter);

    // Example of a custom task, such as changing scale or logging the animation name
    const animationName = spineCharacter.state.getCurrent(0)?.animation.name;
    console.log(`Animation being played: ${animationName}`);

    // You can add more custom tasks here...
    updateUIAfterSpineLoaded();
});

function updateUIAfterSpineLoaded() {
    hideInput();
    showAnimationsDropDown();
}

function hideInput() {
    const spineFileInput = document.getElementById('spineFileInput');
    spineFileInput.style.display = 'none';
}

function showAnimationsDropDown() {
    const animSelectorDiv = document.getElementById('animSelector');
    animSelectorDiv.style.display = 'flex';
    
    const animSelector = document.getElementById('selectAnimations');
    animationsName = [];
    for (let animName in jsonData.animations) {
        animationsName.push(animName);
        const option = document.createElement('option');
        option.value = animName;
        option.textContent = animName;
        animSelector.appendChild(option);
    }

    // Optionally, add a default placeholder option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select an option';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    animSelector.insertBefore(defaultOption, animSelector.firstChild);

    // Add an event listener to the select element to capture changes
    animSelector.addEventListener('change', (event) => {
        const selectedAnim = event.target.value;
        console.log("Selected value: ", selectedAnim);
        spineCharacter.state.setAnimation(0, selectedAnim, window.playAnimInLoop);
    });
}
