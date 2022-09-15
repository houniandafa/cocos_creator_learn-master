import { _decorator, Component, Node, Prefab, JsonAsset, sys, log, instantiate } from 'cc';
import { Level } from './Level';
const { ccclass, property } = _decorator;

interface LevelType {
    level: number,                   // 第1关
    row: number,                     // 行数
    col: number,                     // 列数
    spaceX: number,                 // 列间隔
    spaceY: number,                 // 行间隔
    brickWidth: number,            // 砖块宽度
    brickHeight: number,           // 砖块高度
    levelState: string,             // 关卡状态
    transparentBricks: number[][]  // 刚开始就透明的砖块

}

@ccclass('Select')
export class Select extends Component {

    @property(Prefab)
    levelPrefab: Prefab = null;
    @property(Node)
    levelsLayout: Node = null;

    @property(JsonAsset)
    setJson: JsonAsset = null

    start() {
        this.initLevels()
    }

    initLevels() {
        let item = sys.localStorage.getItem('level_setting')
        if (item == null) {
            let settings: LevelType[] = this.setJson.json as LevelType[];
            log(settings);
            for (let i = 0; i < settings.length; i++) {
                let level = instantiate(this.levelPrefab);
                //level.attr = settings[i];
                for (let v of Object.keys(settings[i])) {
                    level.attr[v] = settings[v];
                    log(v + ' ' + settings[v])
                }
                level.getComponent(Level).changePic(settings[i]['levelState'], i + 1);
                this.levelsLayout.addChild(level);
            }
            // 将所有关卡信息存入本地(针对首次游戏)
            sys.localStorage.setItem('level_setting', JSON.stringify(settings));
        }
        else {
            // 如果玩家已经玩过，则从本地存储中获取关卡配置信息
            let newSettings: LevelType[] = JSON.parse(item);
            for (let i = 0; i < newSettings.length; i++) {
                let level = instantiate(this.levelPrefab);
                // level.settings = newSettings[i];
                for (let v of Object.keys(newSettings[i])) {
                    level.attr[v] = newSettings[v];
                    log(v + ' ' + newSettings[v])
                }
                level.getComponent(Level).changePic(newSettings[i]['levelState'], i + 1);
                this.levelsLayout.addChild(level);
            }
        }
    }
}

