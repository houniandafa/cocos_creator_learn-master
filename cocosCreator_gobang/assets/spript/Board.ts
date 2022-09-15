import { _decorator, Component, Node, Graphics, UITransform, Color, EventTouch, v3, Vec2, v2, Vec3, log } from 'cc';
import { GoBand } from './Gobang';
import { GobangAI } from './GobangAI';
import { PieceColor } from './Piece';
const { ccclass, property } = _decorator;

@ccclass('Board')
export class Board extends Component {

	@property
	Size: number = 15;

	@property({ type: Graphics, tooltip: "用来画棋盘棋子" })
	chess: Graphics = null;

	@property(Graphics)
	ui: Graphics = null;

	@property(Node)
	public blackWin: Node = null;

	@property(Node)
	public whiteWin: Node = null;

	private goBand: GoBand = null;
	private ai: GobangAI = null;

	private tileSize: number; // 一个方块的宽度
	private startXY: number; // 棋盘左下角
	private boardSize: number; // 棋盘节点宽高

	private isGameOver: boolean = false;

	onLoad() {
		this.tileSize = this.node.getComponent(UITransform).width / this.Size;
		this.startXY = this.tileSize / 2;
		this.boardSize = this.tileSize * (this.Size - 1);

		this.goBand = new GoBand(this.Size);
		this.ai = new GobangAI(this.goBand.pieceMap);
		this.draw()
	}

	start() {
		this.node.on(Node.EventType.TOUCH_START, this.onTouched, this);
		this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
	}

	OnDestroy() {
		this.node.off(Node.EventType.TOUCH_START, this.onTouched, this);
		this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
	}

	private onTouched(event: EventTouch) {
		const pos = v3(event.getUILocation().x, event.getUILocation().y)
		let localPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(pos);
		let point = this.posToPoint(localPos);
		this.movePiece(point);
		this.AIMove();
	}

	private onTouchEnd(event: EventTouch) {

	}

	//输赢展示
	private winPop(type) {
		this.blackWin.active = type == PieceColor.black;
		this.whiteWin.active = type == PieceColor.white;
	}


	private AIMove() {
		let point = this.ai.getNextPoint();
		this.movePiece(point);
	}

	movePiece(point: Vec3) {
		let flag = this.goBand.place(point);
		if (flag && !this.isGameOver) {
			let color =
				this.goBand.Color == PieceColor.black
					? Color.BLACK
					: Color.WHITE;
			this.placePiece(color, point);
			if (this.goBand.checkWin()) {
				const str = this.goBand.state == PieceColor.black ? "黑棋" : "白棋"
				log(str + "胜利:" + this.goBand.state);
				this.isGameOver = true;
				this.winPop(this.goBand.state)
			}
		}
	}

	//放置棋子
	public placePiece(color: Color, point: Vec3) {
		this.chess.strokeColor = color;
		this.chess.fillColor = color;
		let pos = this.pointToPos(point);
		this.chess.circle(pos.x, pos.y, this.tileSize * 0.5);
		this.chess.fill();
		this.drawLastPieceRect(point);
	}

	//绘制上次点击的位置
	drawLastPieceRect(point: Vec3) {
		this.ui.clear();
		if (this.ui) {
			this.ui.strokeColor = Color.RED;
			let pos = this.pointToPos(point);

			this.ui.rect(
				pos.x - this.tileSize / 2,
				pos.y - this.tileSize / 2,
				this.tileSize,
				this.tileSize
			);
			this.ui.stroke();
		}
	}

	//渲染坐标转换为棋盘坐标
	private posToPoint(point: Vec3): Vec3 {
		let x = Math.round((point.x - this.startXY) / this.tileSize);
		let y = Math.round((point.y - this.startXY) / this.tileSize);
		return v3(x, y);
	}

	// 棋盘坐标转位置坐标
	private pointToPos(pos: Vec3): Vec3 {
		let x = this.startXY + pos.x * this.tileSize;
		let y = this.startXY + pos.y * this.tileSize;
		return v3(x, y);
	}

	//初始化棋盘线条
	private draw() {
		this.chess.clear();
		this.drawBoardLine();
		this.drawDot();
	}

	//画棋盘线
	private drawBoardLine() {
		////棋盘背景
		// this.chess.fillColor=cc.color(255,255,255);
		// this.chess.fillRect(0,0,this.node.width,this.node.height);
		// this.chess.fill();

		this.chess.strokeColor = Color.BLACK;
		for (let x = 0; x < this.Size; x++) {
			this.chess.moveTo(this.startXY + x * this.tileSize, this.startXY);
			this.chess.lineTo(
				this.startXY + x * this.tileSize,
				this.startXY + this.boardSize
			);
			this.chess.stroke();
		}

		for (let y = 0; y < this.Size; y++) {
			this.chess.moveTo(this.startXY, this.startXY + y * this.tileSize);
			this.chess.lineTo(
				this.startXY + this.boardSize,
				this.startXY + y * this.tileSize
			);
			this.chess.stroke();
		}
	}

	//画点
	private drawDot() {
		this.chess.fillColor = Color.BLACK;
		let center = this.tileSize * ((this.Size / 2) | 0);

		this.chess.circle(this.startXY + center, this.startXY + center, 12);

		this.chess.circle(
			this.startXY + this.tileSize * 2,
			this.startXY + this.tileSize * 2,
			12
		);
		this.chess.circle(
			this.startXY + this.tileSize * 2,
			this.startXY + this.tileSize * (this.Size - 3),
			12
		);
		this.chess.circle(
			this.startXY + this.tileSize * (this.Size - 3),
			this.startXY + this.tileSize * 2,
			12
		);
		this.chess.circle(
			this.startXY + this.tileSize * (this.Size - 3),
			this.startXY + this.tileSize * (this.Size - 3),
			12
		);
		this.chess.fill();
	}

	update(deltaTime: number) {

	}
}

