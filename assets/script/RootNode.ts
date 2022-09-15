import { _decorator, Component, Node, AudioSource, assert, game } from 'cc';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('RootNode')
export class RootNode extends Component {
    @property(AudioSource)
    public audioSource: AudioSource = null;
    onLoad() {
        const audioSource = this.node.getComponent(AudioSource)!;
        assert(audioSource);
        this.audioSource = audioSource;
        // 声明常驻根节点，该节点不会在场景切换中被销毁。目标节点必须是根节点，否则无效。
        game.addPersistRootNode(this.node);
        // 将节点封装到管理器中
        AudioManager.instance.init(this.audioSource);
    }
}

