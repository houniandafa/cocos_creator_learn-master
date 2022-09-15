import { _decorator, Component, Node, Prefab, Layout } from 'cc';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

@ccclass('brickLayout')
export class brickLayout extends Component {

    @property(Prefab)
    brickPrefab: Prefab = null;

    @property
    brickNum: number = 0

    onLoad() {
        this.node.removeAllChildren();
        for (let i = 0; i < this.brickNum; i++) {
            // let brickNode = cc.instantiate(this.brickPrefab);
            // this.node.addChild(brickNode);
            let brickNode = PoolManager.instance().getNode(this.brickPrefab, this.node)

        }
        //延迟一秒执行
        this.scheduleOnce(() => {
            //表格布局完成之后关闭自动布局
            let layout = this.node.getComponent(Layout);
            layout.type = Layout.Type.NONE;
        }, 0)
    }

    update(deltaTime: number) {

    }
}

