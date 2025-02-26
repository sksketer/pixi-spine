import { Constants, SpineConfigPannel } from "./constants";

let fileName, spineCharacter, jsonData, animationsName;

addEventListener(Constants.SPINE_CREATED, function (event) {
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
    const animSelectorDiv = document.getElementById(SpineConfigPannel.mainDiv);
    animSelectorDiv.style.display = 'flex';
    
    const animSelector = document.getElementById('selectAnimations');
    animSelector.innerHTML = '';
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

    // Add an event listern on position property
    const xPos = document.getElementById("xPos");
    xPos.value = spineCharacter.x;
    const yPos = document.getElementById("yPos");
    yPos.value = spineCharacter.y;
    xPos.addEventListener('input', function() {
        const value = Number(xPos.value);
        console.log(spineCharacter, " position x update with value ", value, ".");
        spineCharacter.x = value;
    });
    yPos.addEventListener('input', function() {
        const value = Number(yPos.value);
        console.log(spineCharacter, " position y update with value ", value, ".");
        spineCharacter.y = value;
    });

    // Add an event listern on scale button
    const scaleInc = document.getElementById("scaleInc");
    const scaleDec = document.getElementById("scaleDec");
    scaleInc.onclick = (event) => {
        console.log("scale increase");
        spineCharacter.scale.x += 0.1;
        spineCharacter.scale.y += 0.1;
    };
    scaleDec.onclick = (event) => {
        console.log("scale decrease");
        spineCharacter.scale.x -= 0.1;
        spineCharacter.scale.y -= 0.1;
    };
}
