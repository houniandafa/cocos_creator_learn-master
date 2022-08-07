import { _decorator, Component, Node, SpriteAtlas, Label, Prefab, sys, EventTouch, UITransform, v3, Vec3, Game, game, Sprite, instantiate } from 'cc';
import { Global_Date, WATERMELON_ARRAY } from '../framework/Constant';
import { FruitPoolManager } from '../framework/FruitPoolManager';
import { PoolManager } from '../framework/PoolManager';
import { UIManager } from '../framework/UIManager';
import { Util } from '../utils/Util';
import { UIBase } from './UIBase';
import { Watermelon } from './Watermelon';
const { ccclass, property } = _decorator;

@ccclass('ControlPanel')
export class ControlPanel extends UIBase {

    @property(Node) buttonBack: Node = null;
    @property(Node) buttonAgain: Node = null;
    @property(Node) deathNode: Node = null;//顶部墙刚体
    @property({ type: SpriteAtlas, tooltip: "西瓜图片" })
    spriteAtlas: SpriteAtlas = null

    @property(Node) typeNode: Node = null;//显示图片为即将下落的水果
    @property(Label) scoreLabel: Label = null;//得分

    @property
    timer: number = 1;

    @property({ type: Prefab, tooltip: "西瓜预制体" })
    watermelonPrefab: Prefab = null

    @property(Node)
    guideLineNode: Node = null;

    @property(Node) friutRoot:Node = null;

    isCanDown: boolean;

    start() {
        this.isCanDown = true;
        // this.node.emit('random-type')
        game.on("addScore", this.addScore, this);
        // this.node.on('random-type',this.randomType,this);
        game.on("game-reset",this.resetGameInit,this)
    }

    onEnable() {

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.guideLineNode.active = false;
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }


    init(uiManager: UIManager) {
        //开始游戏
        Util.addEffectBtn(this.buttonBack, () => {
            uiManager.backToStart()
        }, this)
        //退出游戏
        Util.addEffectBtn(this.buttonAgain, () => this.resetGameInit(), this)
    }

    //重新开始游戏数据重置
    resetGameInit(){
        Global_Date.fruitType = 0;
        Global_Date.Score = 0;
        this.scoreLabel.string = Global_Date.Score.toString();
        this.friutRoot.removeAllChildren();
        this.guideLineNode.active = false;
        let sprite = this.typeNode.getComponent(Sprite)
		sprite.spriteFrame = this.spriteAtlas.getSpriteFrames()[Global_Date.fruitType]
    }

    //转换图片
	randomType() {
		// random range
		let randomNum = Math.floor(Math.random() * 4) | 0
		let sprite = this.typeNode.getComponent(Sprite)
		sprite.spriteFrame = this.spriteAtlas.getSpriteFrames()[randomNum]
		Global_Date.fruitType = randomNum;
        console.log("randomType",Global_Date.fruitType)
	}

    addScore() {
        console.log("addScore",this.scoreLabel)
        if (this.scoreLabel) {
            this.scoreLabel.string = Global_Date.Score.toString();
        }
        sys.localStorage.setItem("score", Global_Date.Score.toString());//储存到本地
    }
    /********************Event点击屏幕掉水果--start************************/
    onTouchStart(event: EventTouch) {
        this.guideLineNode.active = true;
        const locat = event.getUILocation() //注意必须要在UI里面用Widget 约束 获取的坐标才是准确的
        let pos = this.guideLineNode.getComponent(UITransform).convertToNodeSpaceAR(v3(locat.x, locat.y));
        const guidePos = this.guideLineNode.position;
        this.guideLineNode.setPosition(pos.x, guidePos.y);
        // this.setGuideLineNodePos(event)
    }

    onTouchMove(event: EventTouch) {
        const locat = event.getUILocation()
        let pos = this.guideLineNode.getComponent(UITransform).convertToNodeSpaceAR(v3(locat.x, locat.y));
        const guidePos = this.guideLineNode.position;
        this.guideLineNode.setPosition(pos.x, guidePos.y);
        // this.setGuideLineNodePos(event)
    }
    onTouchEnd(event: EventTouch) {
        this.guideLineNode.active = false;
        // const locat = event.getLocation()
        const locat = event.getUILocation()
        let pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(locat.x, locat.y));
        this.watermelonDown(pos);
    }

    setGuideLineNodePos(event: EventTouch) {
        const locat = event.getUILocation()//注意必须要在UI里面用Widget 约束 获取的坐标才是准确的
        let pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(locat.x, locat.y));
        const guidePos = this.guideLineNode.position;
        this.guideLineNode.setPosition(pos.x, guidePos.y);
    }

    watermelonDown(pos: Vec3) {
        if (!this.isCanDown) {
            return;
        }
        this.isCanDown = false;
        this.scheduleOnce(() => {
            this.isCanDown = true;
        }, this.timer);

        let watermelon =instantiate(this.watermelonPrefab);
        // watermelon.x = pos.x
        // watermelon.y = this.deathNode.y - 200
        // let watermelon = FruitPoolManager.instance().getNode(this.watermelonPrefab, this.friutRoot);
        const deathPos = this.deathNode.position;
        watermelon.setPosition(pos.x, deathPos.y - 200);
        const comp = watermelon.getComponent(Watermelon)
        comp.changeType(Global_Date.fruitType);
        WATERMELON_ARRAY.push(watermelon)
        this.friutRoot.addChild(watermelon)

        this.randomType();
    }
    /********************Event点击屏幕掉水果--end************************/
}

