import { _decorator, Component, Node, SpriteAtlas, SpriteFrame, Sprite, CircleCollider2D, UITransform, IPhysics2DContact, RigidBody2D, AudioSource, log, Collider2D, ITriggerEvent, director, PhysicsSystem2D, Contact2DType, ERigidBody2DType, game } from 'cc';
import { Global_Date } from '../framework/Constant';
import { FruitPoolManager } from '../framework/FruitPoolManager';
const { ccclass, property } = _decorator;

@ccclass('Watermelon')
export class Watermelon extends Component {

    @property(SpriteAtlas)
    atlas: SpriteAtlas = null;

    @property([SpriteFrame])
    BoomFrame: SpriteFrame[] = []

    onLoad() {
        console.log("fruitType",Global_Date.fruitType)
        this.changeType(Global_Date.fruitType);
    }

    onEnable() {
        // 注册单个碰撞体的回调函数
        let collidertest = this.getComponent(Collider2D);
        if (collidertest) {
            collidertest.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            // collidertest.on(Contact2DType.END_CONTACT, this.onEndContact, this);
            // collidertest.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
            // collidertest.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
        }
    }
    onDisable() {
        // 注册单个碰撞体的回调函数
        let collidertest = this.getComponent(Collider2D);
        if (collidertest) {
            collidertest.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            // collidertest.off(Contact2DType.END_CONTACT, this.onEndContact, this);
            // collidertest.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
            // collidertest.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
        }
    }

    closeBeginContact() {
        // 注册单个碰撞体的回调函数
        let collidertest = this.getComponent(Collider2D);
        if (collidertest) {
            collidertest.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collidertest.off(Contact2DType.END_CONTACT, this.onEndContact, this);
            // collidertest.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
            // collidertest.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
        }
    }
    //切换水果刚体的纹理
    changeType(type: number) {
        type = this.checkType(type);
        let sprite = this.node.getComponent(Sprite);
        sprite.spriteFrame = this.atlas.getSpriteFrames()[type];

        let physics = this.node.getComponent(CircleCollider2D);
        physics.tag = type;
        physics.radius = this.node.getComponent(UITransform).width / 2;
        physics.apply();
    }

    checkType(type: number): number {
        if (type < 0) {
            return 0;
        }
        const length = this.atlas.getSpriteFrames().length;
        if (type >= length) {
            return length - 1;
        }
        return type;
    }
    //碰撞逻辑
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const other = otherCollider.node.getComponent(RigidBody2D)
        console.log("接触物体", other.group)
        if (other.group != 1) {//碰撞的其他水果是否设置了物理分组 如果设置了，说明是墙 就return
            return;
        }
        const selfTag = selfCollider.node.getComponent(Collider2D)
        const otherTag = otherCollider.node.getComponent(Collider2D)
        if (selfTag.tag == otherTag.tag && otherTag.tag != 10) {
            if (selfCollider.node.position.y < otherCollider.node.position.y) {
                console.log("碰撞", otherTag.tag)
                // setTimeout(() => {
                //     FruitPoolManager.instance().putNode(otherCollider.node)   
                // }, 0)
                try {
                    // FruitPoolManager.instance().putNode(otherCollider.node) 
                    otherCollider.node.destroy();
                  } catch(e) {
                    console.log(e.stack); // print stack trace
                  }
                this.watermelonBoom(selfTag.tag);
            } else {
                // setTimeout(() => {
                //     FruitPoolManager.instance().putNode(this.node)
                // }, 0)
                try {
                    this.node.destroy()
                    // FruitPoolManager.instance().putNode(this.node)
                  } catch(e) {
                    console.log(e.stack); // print stack trace
                  }
                return;
            }
        }
    }

    onEndContact(contact, selfCollider, otherCollider) {
        log("离开物体");
    }

    //水果爆炸
    watermelonBoom(type: number) {
        let sprite = this.node.getComponent(Sprite);
        sprite.spriteFrame = this.BoomFrame[type];
        let rigidBody = this.node.getComponent(RigidBody2D);
        rigidBody.enabledContactListener = false;//关闭了刚体的碰撞监听
        this.scheduleOnce(() => {
            rigidBody.enabledContactListener = true;//开启了刚体的碰撞监听
            this.changeType(type + 1);//水果爆炸后变成新的水果
            Global_Date.Score += (type + 1) * 2//分数公式
            game.emit('addScore');//加分数
        }, 0.2);

        // 播放音乐
        this.node.getComponent(AudioSource).play();
    }
}

