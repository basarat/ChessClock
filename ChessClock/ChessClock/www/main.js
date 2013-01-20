ko.extenders.numeric = function (target, digits) {
    var result = ko.computed({
        read: function () {
            var value = target();
            var toret = value.toString();
            if(toret.length < digits) {
                toret = "0" + toret;
            } else {
                if(toret.length > digits) {
                    toret = toret.substring(0, digits);
                }
            }
            return toret;
        },
        write: target
    });
    result(target());
    return result;
};
var GameStates = (function () {
    function GameStates() { }
    GameStates.p1turn = 0;
    GameStates.p2turn = 1;
    GameStates.paused = 2;
    GameStates.p1win = 3;
    GameStates.p2win = 4;
    return GameStates;
})();
var Player = (function () {
    function Player() {
        this.min = ko.observable(0).extend({
            numeric: 2
        });
        this.sec = ko.observable(0).extend({
            numeric: 2
        });
        this.mil = ko.observable(0).extend({
            numeric: 1
        });
    }
    Player.prototype.decreaseTime = function (milliseconds) {
        var min = this.min();
        var sec = this.sec();
        var mil = this.mil();
        var totalTime = this.totalTime();
        var minConv = 60 * 1000;
        var secConv = 1000;
        var milConv = 100;
        totalTime = totalTime - milliseconds;
        min = Math.floor(totalTime / minConv);
        sec = Math.floor((totalTime - min * minConv) / secConv);
        mil = Math.floor((totalTime - min * minConv - sec * secConv) / milConv);
        if(min < 0) {
            min = 0;
            sec = 0;
            mil = 0;
        }
        this.min(min);
        this.sec(sec);
        this.mil(mil);
    };
    Player.prototype.totalTime = function () {
        var min = this.min();
        var sec = this.sec();
        var mil = this.mil();
        var minConv = 60 * 1000;
        var secConv = 1000;
        var milConv = 100;
        return min * minConv + sec * secConv + mil * milConv;
    };
    Player.prototype.setTime = function (min, sec, mil) {
        this.min(min);
        this.sec(sec);
        this.mil(mil);
    };
    return Player;
})();
var ViewModel = (function () {
    function ViewModel() {
        this.gameTime = 100;
        this.p1 = new Player();
        this.p2 = new Player();
        this.gameState = ko.observable(GameStates.paused);
        this.gameState(GameStates.p1turn);
        this.p1.setTime(1, 15, 0);
        this.p2.setTime(0, 10, 20);
        var self = this;
        setInterval(function () {
            self.update();
        }, this.gameTime);
    }
    ViewModel.prototype.update = function () {
        switch(this.gameState()) {
            case GameStates.paused: {
                break;

            }
            case GameStates.p1turn: {
                this.p1.decreaseTime(this.gameTime);
                if(this.p1.totalTime() == 0) {
                    this.gameState(GameStates.p2win);
                }
                break;

            }
            case GameStates.p2turn: {
                this.p2.decreaseTime(this.gameTime);
                if(this.p2.totalTime() == 0) {
                    this.gameState(GameStates.p1win);
                }
                break;

            }
        }
    };
    ViewModel.prototype.p1turn = function () {
        this.gameState(GameStates.p1turn);
    };
    ViewModel.prototype.p2turn = function () {
        this.gameState(GameStates.p2turn);
    };
    return ViewModel;
})();
//@ sourceMappingURL=main.js.map
