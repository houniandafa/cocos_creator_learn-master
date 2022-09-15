import { _decorator, Component, Node, AudioClip, RigidBody2D, v2, log, director, Contact2DType, Collider2D, BoxCollider2D, IPhysics2DContact } from 'cc';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ball')
export class ball extends Component {

    @property(Node)
    game: Node = null;

    @property(AudioClip)
    ballAudio: AudioClip = null

    @property(AudioClip)
    hitAudio: AudioClip = null

    @property
    moveSpeed: number = 1000;

    start() {
        // 球方向随机
        let rigidBody = this.node.getComponent(RigidBody2D)
        rigidBody.linearVelocity.x = Math.random() * -1200 + 600;
        rigidBody.linearVelocity.y = 1000;
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

    update(deltaTime: number) {
        //限制小球方向
        let rigidBody = this.node.getComponent(RigidBody2D)
        if (rigidBody.linearVelocity.length() > this.moveSpeed) {
            let div = rigidBody.linearVelocity.length() / this.moveSpeed;
            rigidBody.linearVelocity = rigidBody.linearVelocity.divide(v2(div, div));
        }
    }

    //碰撞逻辑
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const other = otherCollider.getComponent(BoxCollider2D)
        switch (other.tag) {
            case 0:
                //球撞到墙
                // cc.audioEngine.play(this.ballAudio,false,0.8);
                AudioManager.instance.playSound("ball")
                break;
            case 1:
                //球撞到砖块
                // log('球撞到砖块');
                setTimeout(() => {
                    other.node.destroy();
                    this.game.emit('add');
                }, 0)
                // cc.audioEngine.play(this.hitAudio,false,0.5);
                AudioManager.instance.playSound("hit")
                break;
            case 2:
                //球撞到底部地面
                this.gameOver();
                break;
            case 3:
                //球撞到托盘
                break;
            default:
                log('撞到未知物体');
        }
    }

    gameOver() {
        console.log('游戏结束');
        this.schedule(() => {
            director.loadScene('Game1');
        }, 1);
    }

    gameWin() {
        console.log('恭喜过关！');
    }
}

