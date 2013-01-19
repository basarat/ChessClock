/// <reference path="Scripts/jquery/jquery.d.ts" />
/// <reference path="Scripts/knockout/knockout.d.ts" />

//A numeric display extender for knockout: 
interface KnockoutExtenders {
    numeric(target: any, precision: number): KnockoutObservableAny;
}
interface KnockoutObservableNumber {
    extend(data: any): KnockoutObservableNumber;
}
ko.extenders.numeric = function (target: KnockoutObservableNumber, digits) {
    var result = ko.computed({
        read: function () {
            var value = target();
            var toret: string = value.toString();
            if (toret.length < digits) {
                toret = "0" + toret;
            }
            return toret;
        },
        write: target
    });

    result(target());
    return result;
};


//Game states: 
class GameStates {
    static p1turn = 0;
    static p2turn = 1;
    static paused = 2;
    static p1win = 3;
    static p2win = 4;
}

//a class that self contains mins/sec/miliseconds 
//and supports decrementing these based on passed in milliseconds
class Player {
    min = ko.observable(0).extend({ numeric: 2 });
    sec = ko.observable(0).extend({ numeric: 2 });
    mil = ko.observable(0).extend({ numeric: 1 });

    decreaseTime(milliseconds: number) {
        //orig
        var min = this.min();
        var sec = this.sec();
        var mil = this.mil();

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
        this.min(min);
        this.sec(sec);
        this.mil(mil);
    }

    totalTime(): number {
        //orig
        var min = this.min();
        var sec = this.sec();
        var mil = this.mil();

        var minConv = 60 * 1000; //milliseconds 
        var secConv = 1000; //milliseconds 
        var milConv = 100; //milliseconds ... We store only the top two digits of milliseconds 
        return min * minConv + sec * secConv + mil * milConv;
    }

    setTime(min: number, sec: number, mil: number) {
        this.min(min);
        this.sec(sec);
        this.mil(mil);
    }
}

//ViewModel class 
class ViewModel {
    //The miliseconds used to control key game times 
    gameTime = 100;//milliseconds 
    p1: Player = new Player();
    p2: Player = new Player();
    //Current game state
    gameState = ko.observable(GameStates.paused);


    constructor() {
        //DEBUG for testing: 
        //for game state
        this.gameState(GameStates.p1turn);
        //for timers
        this.p1.setTime(1, 15, 0);
        this.p2.setTime(0, 0, 20);

       
        //Loop for every 100ms: 
        var self = this;
        setInterval(function () { self.update() }, this.gameTime); 
    }

    //Main loop to take actions based on current game state
    update(): any {
        switch (this.gameState()) {
            case GameStates.paused:
                break;
            case GameStates.p1turn:
                this.p1.decreaseTime(this.gameTime);
                if (this.p1.totalTime() == 0)
                    this.gameState(GameStates.p2win);
                break;
            case GameStates.p2turn:
                this.p2.decreaseTime(this.gameTime);
                if (this.p2.totalTime() == 0)
                    this.gameState(GameStates.p1win);
                break;
        }
    }

    p1turn() {
        this.gameState(GameStates.p1turn);
    }

    p2turn() {
        this.gameState(GameStates.p2turn);      
    }

}

//Application initialization:
$(function () {
    var vm: ViewModel = new ViewModel();
    ko.applyBindings(vm);
});



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