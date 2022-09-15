import { _decorator, Component, Node, SpriteFrame, Label, Sprite, sys, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Level')
export class Level extends Component {

    @property(SpriteFrame)
    unlockedPic: SpriteFrame = null;

    @property(SpriteFrame)
    lockedPic: SpriteFrame = null;

    @property(SpriteFrame)
    greyStarPic: SpriteFrame = null;

    @property(SpriteFrame)
    yellowStarPic: SpriteFrame = null;

    start() {
        // 触摸监听
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    changePic(levelState:string, num:number) {
        // 更改图片
        if (levelState == 'UNLOCKED') {
            // 解锁关卡
            this.node.children[0].active = true;
            this.node.children[0].getComponent(Label).string = num.toString();
            this.node.getComponent(Sprite).spriteFrame = this.unlockedPic;
            this.node.children[1].getComponent(Sprite).spriteFrame = this.greyStarPic;
        }
        else if (levelState == 'PASSED') {
            // 通关
            this.node.children[0].active = true;
            this.node.children[0].getComponent(Label).string = num.toString();
            this.node.getComponent(Sprite).spriteFrame = this.unlockedPic;
            this.node.children[1].getComponent(Sprite).spriteFrame = this.yellowStarPic;
 
        }
        else if (levelState == 'LOCKED') {
            // 关卡未解锁
            this.node.getComponent(Sprite).spriteFrame = this.lockedPic;
            this.node.children[1].getComponent(Sprite).spriteFrame = this.greyStarPic;
        }     
    }
 
    onTouchStart () {        
        if (this.node.attr['levelState'] == 'LOCKED')
            return;        
        // 将目标关卡信息存入本地，在Game.js中取出
        sys.localStorage.setItem('currentLevelInfo', JSON.stringify(this.node.attr));
        director.loadScene('Game1');
    }
}

