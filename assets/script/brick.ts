import { _decorator, Component, Node, SpriteAtlas, log, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('brick')
export class brick extends Component {

    @property(SpriteAtlas)
    spriteAltas: SpriteAtlas = null;

    start() {
        this.randomSprite();
    }

    //随机精灵
    randomSprite(){
        let n = 'brick' + (Math.random() * 4 | 0);
        log('random:' + n)
        let sp = this.node.getComponent(Sprite);
        sp.spriteFrame = this.spriteAltas.getSpriteFrame(n)
    }
}

