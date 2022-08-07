import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIBase')
export class UIBase extends Component {
    @property({
        displayName: '初始显隐状态'
    })
    isShowInit: boolean = false
 
    onLoad() {
        this.isShowInit ? this.show() : this.hide()
    }
 
    show() {
        this.node.active = true
    }
 
    hide() {
        this.node.active = false
    }
}