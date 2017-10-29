//generateWinningNumber
function generateWinningNumber() {
    let min = Math.ceil(1);
    let max = Math.floor(100);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//shuffle
function shuffle(arr) {
    var m = arr.length, t, i;

    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
    }
    return arr;
}

//Game class
function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber ? true : false;
}

Game.prototype.playersGuessSubmission = function(num) {
    let message = $('#message');
    try {
        if(100 < num || num < 1 || isNaN(num)) {
            return "That is an invalid guess.";
            // throw "That is an invalid guess.";
        }
        this.playersGuess = parseInt(num, 10);
    
        return this.checkGuess();
    }
    catch(err) {
        message.text = err;
    }
}

Game.prototype.checkGuess = function() {
    if(this.playersGuess === this.winningNumber) {
        $('#hint, #player-input, #submit').prop('disabled', true);
        $('#player-input').off();
        $('h3').text('Press the Reset button to play again!')
        return 'You Win!';
    } else if(this.pastGuesses.some(element => element === this.playersGuess)) {
        return 'You have already guessed that number.'
    } else {
        this.pastGuesses.push(this.playersGuess);
         $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
        if(this.pastGuesses.length === 5) {
            $('#hint, #player-input, #submit').prop('disabled', true);
            $('#player-input').off();
            $('h3').text('Press the Reset button to play again!')
            return 'You Lose.';
        } else {
            if(this.isLower()) {
                $('h3').text("Guess Higher!")
            } else {
                $('h3').text("Guess Lower!")
            }
            let diff = this.difference();
            if(diff < 10) {
                return `You're burning up!`;
            } else if(diff < 25) {
                return `You're lukewarm.`;
            } else if(diff < 50) {
                return `You're a bit chilly.`;
            } else {
                return `You're ice cold!`;
            }
        }
    }
}

Game.prototype.provideHint = function() {
    let hintArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(hintArr);
}

function makeAGuess(game) {
    let guess = $('#player-input').val();
    let output = game.playersGuessSubmission(guess);
    $('h1').text(output);

    $('#player-input').val('');
}

$(document).ready(function() {
    let game = new Game();

    $('#submit').click(function(e) {
        makeAGuess(game);
    })

    $('#player-input').keypress(function(event) {
        if (event.which == 13) {
            console.log('in the if')
           makeAGuess(game);
        }
    })

    $('#hint').click(e => {
        console.log(game.provideHint());
        console.log('winning# = ', game.winningNumber)
    })

    $('#reset').click(function() {
        game = new Game();
        $('h1').text('Play the Guessing Game!');
        $('h3').text('Guess a number between 1-100!')
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled", false);
        $('#player-input').keypress(function(event) {
            if (event.which == 13) {
            console.log('in the if')            
               makeAGuess(game);
            }
        })
    })
});

