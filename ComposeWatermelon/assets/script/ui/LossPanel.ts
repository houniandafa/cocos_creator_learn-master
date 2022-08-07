import { _decorator, Component, Node, game } from 'cc';
import { UIManager } from '../framework/UIManager';
import { Util } from '../utils/Util';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('LossPanel')
export class LossPanel extends UIBase {

    @property(Node) endBtn:Node = null;

    start() {

    }

    init(uiManager:UIManager){
        //重新开始游戏
        Util.addEffectBtn(this.endBtn, () => {
            uiManager.gameStart()
            game.emit('game-reset');
        }, this)
    }
}

