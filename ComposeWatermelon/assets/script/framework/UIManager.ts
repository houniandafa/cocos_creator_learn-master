import { _decorator, Component, Node, Prefab, game, EventTouch, UITransform, v3 } from 'cc';
import { ControlPanel } from '../ui/ControlPanel';
import { LossPanel } from '../ui/LossPanel';
import { StartMenu } from '../ui/StartMenu';
import { UIBase } from '../ui/UIBase';
import { UIType } from './Constant';
import { PoolManager } from './PoolManager';
import { StaticInstance } from './StaticInstance';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {

    @property(Prefab) startMenuPrefab: Prefab = null;//开始游戏界面
    @property(Prefab) controlPanelPrefab: Prefab = null;//游戏界面
    @property(Prefab) lossPanelPrefab: Prefab = null;//游戏失败界面

    uiMap = new Map<UIType, UIBase>();
    start() {
        StaticInstance.setUIManager(this)
        this.initStartMenu();
        this.initControlPanel();
        this.initLossPanel();
        this.showUI([UIType.StartMenu])
        game.on('game-over', this.loseGame, this);
    }

    showUI(showTypes: UIType[]) {
        this.uiMap.forEach((ui, type) => {
            if (showTypes.indexOf(type) > -1) {
                ui.show()
            } else {
                ui.hide()
            }
        })
    }

    gameStart(level?: number) {
        this.showUI([UIType.ControlPanel]);
        (this.uiMap.get(UIType.ControlPanel) as ControlPanel).resetGameInit();
        // StaticInstance.gameManager.gameStart(level)
    }
    //返回游戏开始界面
    backToStart() {
        this.showUI([UIType.StartMenu]);
        
        (this.uiMap.get(UIType.StartMenu) as StartMenu).start();
        console.log("backToStart",this.uiMap,this.uiMap.get(UIType.StartMenu))
    }

    loseGame() {
        this.showUI([UIType.ControlPanel, UIType.LossPanel]);
    }
    //重新开始游戏
    resetGame() {
        game.restart();
    }

    private initStartMenu() {
        const node = PoolManager.instance().getNode(this.startMenuPrefab, this.node);
        node.setPosition(0, 0);
        const comp = node.getComponent(StartMenu)
        comp.init(this)
        this.uiMap.set(UIType.StartMenu, comp)
    }

    private initControlPanel() {
        const node = PoolManager.instance().getNode(this.controlPanelPrefab, this.node);
        node.setPosition(0, 0);
        const comp = node.getComponent(ControlPanel)
        comp.init(this)
        this.uiMap.set(UIType.ControlPanel, comp)
    }

    private initLossPanel() {
        // const node = cc.instantiate(this.lossPanelPrefab)
        // this.node.addChild(node)
        const node = PoolManager.instance().getNode(this.lossPanelPrefab, this.node);
        node.setPosition(0, 0)
        const comp = node.getComponent(LossPanel)
        comp.init(this)
        this.uiMap.set(UIType.LossPanel, comp)
    }
}

