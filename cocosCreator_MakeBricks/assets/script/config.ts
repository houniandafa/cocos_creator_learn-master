import { _decorator, Component, Node, director, PhysicsSystem2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('config')
export class config extends Component {
    onEnable(): void {
        // let physics=director.getPhysicsManager();
        // physics.enabled=true;
        PhysicsSystem2D.instance.enable = true; //开启物理系统
    }
 
   onDisable(): void {
        // let physics=director.getPhysicsManager();
        // physics.enabled=false;
        PhysicsSystem2D.instance.enable = true; //关闭物理系统
    }
}

