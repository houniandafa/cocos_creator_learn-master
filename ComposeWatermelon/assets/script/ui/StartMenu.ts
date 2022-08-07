import { _decorator, Component, Node, game, sys, Label } from 'cc';
import { UIManager } from '../framework/UIManager';
import { Util } from '../utils/Util';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('StartMenu')
export class StartMenu extends UIBase {

    @property(Node) startButton: Node = null;//开始游戏按钮
    @property(Node) exitButton: Node = null;//退出游戏按钮
    @property(Label) maxScore: Label = null;
    start() {
        let score: number = Number(sys.localStorage.getItem("score"));
        if (!score) score = 0;
        this.maxScore.string = score.toString();
    }

    show() {
        super.show();
    }

    init(uiManager: UIManager) {
        //开始游戏
        Util.addEffectBtn(this.startButton, () => {
            uiManager.gameStart()
        }, this)
        //退出游戏
        Util.addEffectBtn(this.exitButton, () => game.end(), this)
    }
}

