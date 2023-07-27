const canvas = document.getElementById('canvas');
const disp = document.getElementById('display');
const ctx = canvas.getContext('2d');
const colorfulButton = document.getElementById('colorful-button');

const players = ['O', 'X'];
const imageSrc = ['zero.png', 'cross.png']
let turn = 0;

// Lines making the board
const lines = [
    [100, 175, 500, 175],
    [100, 310, 500, 310],
    [225, 50, 225, 425],
    [375, 50, 375, 425],
];

// Areas for drawing the images
const imageAreas = [
    [100, 50, 120, 120],
    [240, 50, 120, 120],
    [385, 50, 120, 120],
    [100, 180, 120, 120],
    [240, 180, 120, 120],
    [385, 180, 120, 120],
    [100, 315, 120, 120],
    [240, 315, 120, 120],
    [385, 315, 120, 120],
];

// Different winning combinations
const winStat = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
];

const areasWithImages = new Array(imageAreas.length).fill(false);   // Array to store whether current position is already filled

const playerChoices = [[], []];   // Stores moves for both players in two arrays


function drawlines(startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}
// Draw lines on the canvas
for (const line of lines) {
    drawlines(...line);
}


// Draw Images on canvas when mouse is clicked
function drawImageOnCanvas(imagePath, posX, posY, width, height) {
    const image = new Image();
    image.src = imagePath;
    image.onload = function(){
        ctx.drawImage(image, posX, posY, width, height);
    };
}
// When mouse is clicked over canvas
function handleClick(event) {
    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;

    for (let i = 0; i < imageAreas.length; i++) {
        const [posX, posY, width, height] = imageAreas[i];
        if (!areasWithImages[i] && mouseX >= posX && mouseX <= posX + width && mouseY >= posY && mouseY <= posY + height) {
            drawImageOnCanvas(imageSrc[turn], posX, posY, width, height);
            areasWithImages[i] = true;
            playerChoices[turn].push(i+1);
            changeTurn();
            break;
        }
    }
}

// Changes turn after every move
function changeTurn() {
    const isWon = checkWin();
    if (isWon) {
        disp.innerHTML = `${players[turn]} Won`;
        canvas.removeEventListener('click', handleClick);
    }
    else if (playerChoices[0].length == 5) {
        disp.innerHTML = "Match Draw";
        canvas.removeEventListener('click', handleClick);
    }
    else {
        turn = 1 - turn;
        disp.innerHTML = `${players[turn]}'s turn`;
    }
}

// Checks whether any player won
function checkWin() {
    for (const row of winStat) {
        let count = 0;
        for (const num of row) {
            if (playerChoices[turn].includes(num)) {
                count++;
            }
        }
        if (count == 3) {
            return true;
        }
    }
    return false;
}

// Clear images when play button is clicked after match overs
function clearImageAreas() {
    for (let i = 0; i < areasWithImages.length; i++) {
        if (areasWithImages[i]) {
            const [posX, posY, width, height] = imageAreas[i];
            ctx.clearRect(posX, posY, width, height);
            areasWithImages[i] = false;
        }
    }

}

// When play button is clicked
colorfulButton.addEventListener('click', function() {
    // Add the 'colorful' class to change the color
    colorfulButton.classList.add('colorful');
  
    // Remove the 'colorful' class after 1 second (1000 milliseconds)
    setTimeout(function() {
      colorfulButton.classList.remove('colorful');
    }, 200);

    clearImageAreas();

    // Empty the player choices array
    playerChoices[0].splice(0, playerChoices[0].length);
    playerChoices[1].splice(0, playerChoices[1].length);

    turn = 0;
    disp.innerHTML = `O's turn`;
    canvas.addEventListener('click', handleClick);
});