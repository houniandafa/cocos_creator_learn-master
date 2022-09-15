import { _decorator, Component, Node, Input, input, systemEvent, EventTouch, UITransform, v3, macro, KeyCode, v2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('paddle')
export class paddle extends Component {

    @property
    speed: number = 1000;

    start() {
        this.node.parent.on(Node.EventType.TOUCH_MOVE, this.touchStart, this);

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        this.node.parent.off(Node.EventType.TOUCH_MOVE, this.touchStart, this);

        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    touchStart(e: EventTouch) {
        const ePos = v3(e.getUILocation().x, e.getUILocation().y)
        let pos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(ePos);
        // this.node.x = pos.x;
        this.node.setPosition(pos.x, this.node.position.y)
    }

    moveDir: string;

    onKeyDown(event) {
        // 控制bar左右移动
        switch (event.keyCode) {
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.moveDir = 'left';
                break;

            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.moveDir = 'right';
                break;
        }
    }

    onKeyUp(event) {
        this.moveDir = '';
    }

    update(dt) {
        this.movePaddle(dt);
    }


    movePaddle(dt) {

        let pos = this.node.position;
        if (this.moveDir == 'left') {
            // pos.x -= this.speed * dt;
            this.node.setPosition(pos.y - this.speed * dt, pos.y)
        }
        else if (this.moveDir == 'right') {
            // pos.x += this.speed * dt;
            this.node.setPosition(pos.y + this.speed * dt, pos.y)
        }
        // 限制bar
        let posEnd = this.node.position;
        let parent = this.node.parent;
        if (parent.getComponent(UITransform).getBoundingBox().contains(v2(posEnd.x, posEnd.y))) {
            this.node.position = pos;
        }
    }
}

