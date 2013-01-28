/// <reference path="scripts/angular/angular.d.ts" />
/// <reference path="Scripts/jquery/jquery.d.ts" />

//Game states: 
enum GameStates {
    p1turn,
    p2turn,
    paused,
    p1win,
    p2win
}

//a class that self contains mins/sec/miliseconds 
//and supports decrementing these based on passed in milliseconds
class Player {
    min = 0;
    sec = 0;
    mil = 0;

    decreaseTime(milliseconds: number) {
        //orig
        var min = this.min;
        var sec = this.sec;
        var mil = this.mil;

        var totalTime = this.totalTime();

        //new
        var minConv = 60 * 1000; //milliseconds 
        var secConv = 1000; //milliseconds 
        var milConv = 100; //milliseconds ... We store only the top two digits of milliseconds 
        totalTime = totalTime - milliseconds;
        min = Math.floor(totalTime / minConv);
        sec = Math.floor((totalTime - min * minConv) / secConv);
        mil = Math.floor((totalTime - min * minConv - sec * secConv) / milConv);

        //if total time is less than 0: 
        if (min < 0) {
            min = 0; sec = 0; mil = 0;
        }

        //Update the ui
        this.min = (min);
        this.sec = (sec);
        this.mil = (mil);
    }

    totalTime(): number {
        //orig
        var min = this.min;
        var sec = this.sec;
        var mil = this.mil;

        var minConv = 60 * 1000; //milliseconds 
        var secConv = 1000; //milliseconds 
        var milConv = 100; //milliseconds ... We store only the top two digits of milliseconds 
        return min * minConv + sec * secConv + mil * milConv;
    }

    setTime(min: number, sec: number, mil: number) {
        this.min = (min);
        this.sec = (sec);
        this.mil = (mil);
    }
}

//This seems the best way to expose member variables 
//Name 
//    your class as <ClassController> and 
//    have a corresponsding scope definition named <IClassScope>
interface IMainScope extends ng.IScope {
    p1: Player;
    p2: Player;
    gameState: GameStates;
    //For resuming 
    lastPlayer: number;

    //Variables for expressions
    GameStates: GameStates;

    //functions: 
    reset();
    p1turn();
    p2turn();
    play_pause();

}


//ViewModel class 
class MainController {
    //The miliseconds used to control key game times 
    gameTime = 100;//milliseconds 



    constructor($scope: IMainScope) {
        //players
        $scope.p1 = new Player();
        $scope.p2 = new Player();
        //Current game state
        $scope.gameState = GameStates.paused;        
        
        //Any vaiables you want exposed on expressions go here
        $scope.GameStates = GameStates;


        //setup the functions 
        $scope.p1turn = () => { $scope.gameState = (GameStates.p1turn); };
        $scope.p2turn = () => { $scope.gameState = (GameStates.p2turn); };
        $scope.reset = () => {
            $scope.lastPlayer = GameStates.p1turn;
            $scope.gameState = (GameStates.paused);
            $scope.p1.setTime(1, 15, 0);
            $scope.p2.setTime(1, 15, 0);
        }
        $scope.play_pause = () => {
            if ($scope.gameState != GameStates.paused) {
                //We need to remember the current player whose turn we are pausing on 
                $scope.lastPlayer = $scope.gameState;
                $scope.gameState = (GameStates.paused);
            }
            else {
                $scope.gameState = ($scope.lastPlayer);
            }
        };
        

        //Loop for every 100ms: 
        var self = this;
        setInterval(function () { $scope.$apply(function () { self.update($scope) }) }, this.gameTime);

        //initial setup:
        $scope.reset();

        //DEBUG for testing: 
        //for game state
        $scope.gameState = (GameStates.p1turn);
        //for timers
        $scope.p1.setTime(1, 15, 0);
        $scope.p2.setTime(0, 10, 2);

    }

    //Main loop to take actions based on current game state
    update($scope: IMainScope): any {
        switch ($scope.gameState) {
            case GameStates.paused:
                break;
            case GameStates.p1turn:
                $scope.p1.decreaseTime(this.gameTime);
                if ($scope.p1.totalTime() == 0)
                    $scope.gameState = (GameStates.p2win);
                break;
            case GameStates.p2turn:
                $scope.p2.decreaseTime(this.gameTime);
                if ($scope.p2.totalTime() == 0)
                    $scope.gameState = (GameStates.p1win);
                break;
        }
    }
}




//$(document).ready(function () {

//    // Create a newDate() object
//    var newDate = new Date();
//    // Extract the current date from Date object
//    newDate.setDate(newDate.getDate());


//    setInterval(function () {
//        // Create a newDate() object and extract the seconds of the current time on the visitor's
//        var seconds = new Date().getSeconds();
//        // Add a leading zero to seconds value
//        $("#p1sec").html((seconds < 10 ? "0" : "") + seconds);
//    }, 100);

//    setInterval(function () {
//        // Create a newDate() object and extract the minutes of the current time on the visitor's
//        var minutes = new Date().getMinutes();
//        // Add a leading zero to the minutes value
//        $("#p1min").html((minutes < 10 ? "0" : "") + minutes);
//    }, 100);

//    setInterval(function () {
//        // Create a newDate() object and extract the hours of the current time on the visitor's
//        var milliseconds = new Date().getMilliseconds();
//        var millisecondsStr =  (milliseconds / 10).toFixed(0);
//        // Add a leading zero to the hours value
//        $("#p1mil").html((millisecondsStr.length < 2 ? "0" : "") + millisecondsStr);
//    }, 100);

//});