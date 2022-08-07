import { _decorator, Component, Node, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

/** 工具类 */
export class Util {
    static addEffectBtn(node: Node | undefined, callBack: Function, thisObj: any, data?: any,
        startCallBack?: Function, outCallBack?: Function,
        isSound: boolean = true, $sx: number = 0.9, $sy: number = 0.9) {
        const { TOUCH_START, TOUCH_END, TOUCH_CANCEL } = Node.EventType;
        if (!node) {
            console.error('[Util] clickDownTween node is undefined')
            return
        }
        // AudioManager.instance().play("musicClick")
        function start(e: TouchEvent) {
            //注意v3里面的3个值都必须传，不然绑定事件会失效
            // AudioManager.instance.playSound(MuiscResUrl.Click)
            startCallBack && startCallBack.call(thisObj, data);
            tween(node).to(0.1, { scale: v3(0.9, 0.9, 0.9) }).start()
        }
        function end(e: TouchEvent) {
            //注意v3里面的3个值都必须传，不然绑定事件会失效
            tween(node).to(0.1, { scale: v3(1, 1, 1) }).call(() => {
                callBack && callBack.call(thisObj, data);
            }).start()
        }
        function out(e: TouchEvent) {
            //注意v3里面的3个值都必须传，不然绑定事件会失效
            outCallBack && outCallBack.call(thisObj, data);
            tween(node).to(0.1, { scale: v3(1, 1, 1) }).start()
        }
        node.on(TOUCH_START, start, this)

        node.on(TOUCH_END, end, this)

        node.on(TOUCH_CANCEL, out, this)
    }
}

