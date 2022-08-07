import { _decorator, Component, Node } from 'cc';
import { GameManager } from './GameManager';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('StaticInstance')
export class StaticInstance  {
    static gameManager: GameManager | undefined = undefined
    static uiManager: UIManager | undefined = undefined
 
    static setGameManager(context: GameManager) {
        StaticInstance.gameManager = context
    }
 
    static setUIManager(context: UIManager) {
        StaticInstance.uiManager = context
    }
}