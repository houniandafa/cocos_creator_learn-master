import { _decorator, Component, Node, IPhysics2DContact, CircleCollider2D, RigidBody2D, game, Collider2D, Contact2DType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DeathLine')
export class DeathLine extends Component {
	@property(Node)
	deathNode: Node = null

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

	//撞到后游戏结束
	onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
		const g = otherCollider.node.getComponent(RigidBody2D)
		if (g.group == 1) {
			try {
				// FruitPoolManager.instance().putNode(otherCollider.node) 
				game.emit('game-over');
			} catch (e) {
				console.log(e.stack); // print stack trace
			}

			// this.deathNode.active = true;
		}
	}
}

