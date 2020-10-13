// declare important global variables
const btnColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var keyboard_level = 0;

// test if jquery cdn is embedded
$(document).ready(function() {
  console.log("jquery-3.5.1 is ready");
});

// game-pattern part
function nextSequence() {
  let randomNum = Math.floor(Math.random() * 4);
  let randomChosenColor = btnColors[randomNum];
  gamePattern.push(randomChosenColor);
  $("#" + randomChosenColor).fadeOut(100).fadeIn(100);
  let color_audio = new Audio("sounds/" + randomChosenColor + ".mp3");
  color_audio.play();
  let game_pattern_div = "<div type=\"button\" class=\"ptn-btn " + randomChosenColor + "\"> </div>"
  $(".game").append(game_pattern_div);
  let num_ptn_btn = $(".ptn-btn").length;
  if (num_ptn_btn > 1 && num_ptn_btn < 5) {
    $(".ptn-btn").slice(0, num_ptn_btn - 1).css("visibility", "hidden");
  } else if (num_ptn_btn >= 5) {
    $(".game .ptn-btn").slice(0, num_ptn_btn - 1).remove();
  }
}

$(document).keydown(function(e) {
  let success_title_regex = /\s{1}Success\!$/;
  let title_text = $("#level-title").text();
  if (keyboard_level == 0) {
    $("#level-title").text("level " + keyboard_level++);
    nextSequence();
    $(".btn-container").addClass("game-started");
    $(".pattern-container").css("visibility", "visible");
  } else if (title_text.match(success_title_regex)) {
    $("#level-title").text("level " + keyboard_level++);
    nextSequence();
  } else {
    alert("You haven't finished this level yet!");
  }
});

// user-clicked pattern part
function playSound(color) {
  let color_audio = new Audio("sounds/" + color + ".mp3");
  color_audio.play();
}

function animatePress(current_color) {
  let initial_btn_class = $("#" + current_color).attr("class");
  // i at the end of a regex means being case-insensitive
  let btn_class_ptn = /btn\s{1}(?=[yellow|green|blue|red])/i;
  let pressed_btn_class = initial_btn_class.replace(btn_class_ptn, "btn pressed ");
  $("#" + current_color).attr("class", pressed_btn_class);
  setTimeout(function() {
    $("#" + current_color).attr("class", initial_btn_class);
  }, 100);
}

function check_pattern_match() {
  let user_clicked_len = userClickedPattern.length;
  // toString() only works if two arrays are in the same pattern. If not, add "sort()" first
  if (userClickedPattern[user_clicked_len - 1] == gamePattern[user_clicked_len - 1]) {
    return true;
  }
  return false;
}

function gameOver() {
  // remove display of game pattern
  $(".user-clicked .ptn-btn").remove();
  $(".game .ptn-btn").remove();
  // gameover notification
  $(".main-container").addClass("game-over");
  let audio_wrong = new Audio("sounds/wrong.mp3");
  audio_wrong.play();
  setTimeout(function() {
    $(".main-container").removeClass("game-over");
    $("#level-title").text("Game over! Click here to restart!");
  }, 500);
}

function restart() {
  // restart notification
  $("#level-title").click(function(e) {
    // reset the global values to default
    $(".btn-container").removeClass("game-started");
    $(".pattern-container").css("visibility", "hidden");
    gamePattern = [];
    userClickedPattern = [];
    keyboard_level = 0;
    $(this).text("Press A Key to Start");
    // turn off the click handler after clicking restart
    $(this).off('click');
  });
}

$('.btn').click(function() {
  let userChosenColor = this.id;
  if (userClickedPattern.length < gamePattern.length) {
    userClickedPattern.push(userChosenColor);
    animatePress(userChosenColor);
    console.log("game:", gamePattern);
    console.log("user", userClickedPattern);
    let game_user_match = check_pattern_match();
    // if user's answer is correct but far but incomplete
    if (game_user_match === true) {
      playSound(userChosenColor);
      let user_pattern_div = "<div type=\"button\" class=\"ptn-btn " + userChosenColor + "\"> </div>"
      $(".user-clicked").append(user_pattern_div);
      // if user's answer has been complete and correct
      if (userClickedPattern.length == gamePattern.length) {
        $(".user-clicked .ptn-btn").remove();
        userClickedPattern = [];
        let success_title_text = $("#level-title").text() + " Success!";
        $("#level-title").text(success_title_text);
      }

    } else {
      gameOver();
      restart();
    }
  }
});
