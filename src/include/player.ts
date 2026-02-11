import { animationClips } from './animationClips'
import { AnimationPlayer } from './animationPlayer'
import { AnimationStateMachine } from './animationStateMachine'
import type { AnimationClip, AnimationClipId } from './animationTypes'
import { audioEvents } from './audioEvents'
import type { PlayerConfig, PlayerType } from './config'
import { ringInnerBounds } from './ring'
import { drawSprite, isColliding } from './utils'

export type GameState = 'playing' | 'finished' | 'demo' | 'paused' | 'menu'

export interface GameContext {
  readonly gameState: GameState
}
type Direction = 'left' | 'right'
type PlayerState = 'punchingTop' | 'punchingBottom' | 'hitFromTop' | 'hitFromBottom' | 'idle'

export class Player {
  private readonly animationPlayer = new AnimationPlayer()
  private readonly stateMachine = new AnimationStateMachine()
  private currentClipId: AnimationClipId | null = null
  private currentClip: AnimationClip | null = null
  private animationSpeedMultiplier = 1
  public isFastForwarding = false
  private facingDirection: Direction = 'right' // direction is sorted out in the first update
  private score = 0
  private opponent: Player | null = null
  protected gameContext: GameContext | null = null

  private readonly height = 110
  private readonly fullWidth = 134 // width when the arm is extended
  private readonly width = 58 // width when idle (actually a little less to allow for some overlap, real width is 63)
  private readonly actualWidth = 63
  private readonly playerSpeedX = 230
  private readonly playerSpeedY = 200
  private readonly hitPlayerSpeedX = 200
  private readonly hitPlayerSpeedY = 200
  private readonly headHeight = 36
  private readonly headWidth = 45
  private readonly gloveHeight = 25
  private readonly gloveWidth = 36

  protected x: number
  protected y: number
  protected color: string
  public state: PlayerState = 'idle'

  protected readonly initialConfig: PlayerConfig

  public get renderX() {
    return Math.trunc(this.x)
  }

  public get renderY() {
    return Math.trunc(this.y)
  }

  public readonly playerType: PlayerType

  constructor(config: PlayerConfig) {
    this.playerType = config.playerType
    this.x = config.x
    this.y = config.y
    this.color = config.color
    this.initialConfig = config
    this.stateMachine.setFacing('right')
    this.syncClipFromStateMachine(true)
  }

  public reset() {
    this.x = this.initialConfig.x
    this.y = this.initialConfig.y
    this.color = this.initialConfig.color
    this.score = 0
    this.state = 'idle'
    this.facingDirection = 'right'
    this.stateMachine.setFacing('right')
    this.stateMachine.onEvent('ClipFinished')
    this.resetAnimationSpeed()
    this.syncClipFromStateMachine(true)
  }

  public setOpponent(opponent: Player) {
    this.opponent = opponent
  }

  public setGameContext(gameContext: GameContext) {
    this.gameContext = gameContext
  }

  private getOpponent(): Player {
    if (!this.opponent) throw new Error('Opponent not set. Call setOpponent() before update().')
    return this.opponent
  }

  private syncClipFromStateMachine(force = false) {
    const clipId = this.stateMachine.getClipId()
    if (!force && this.currentClipId === clipId) return

    const clip = animationClips[clipId]
    this.currentClipId = clipId
    this.currentClip = clip
    this.animationPlayer.play(clip)
  }

  private resetAnimationSpeed() {
    this.animationSpeedMultiplier = 1
    this.isFastForwarding = false
  }

  private setAnimationSpeedMultiplier(multiplier: number) {
    this.animationSpeedMultiplier = multiplier
    this.isFastForwarding = multiplier !== 1
  }

  private emitHitBlocked() {
    this.stateMachine.onEvent('HitBlocked')
    this.reversePunch()
  }

  private updateAnimation(dt: number) {
    this.syncClipFromStateMachine()
    this.animationPlayer.update(dt * this.animationSpeedMultiplier)

    if (this.animationPlayer.isFinished()) {
      this.stateMachine.onEvent('ClipFinished')
      this.state = 'idle'
      this.resetAnimationSpeed()
      this.syncClipFromStateMachine(true)
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const frame = this.animationPlayer.getFrame()
    drawSprite(ctx, frame.sprite, this.color, this.renderX, this.renderY)
  }

  /**
   * Get the bounding box of the player's body
   */
  private getMainBoundingBox = () =>
    this.isFacingRight()
      ? {
          left: this.renderX,
          right: this.renderX + this.width,
          top: this.renderY,
          bottom: this.renderY + this.height,
        }
      : {
          left: this.renderX + this.fullWidth - this.width,
          right: this.renderX + this.fullWidth,
          top: this.renderY,
          bottom: this.renderY + this.height,
        }

  /**
   * Check if the player is punching
   */
  private isPunching = () => this.state === 'punchingTop' || this.state === 'punchingBottom'

  /**
   * Check if the player is hitting the enemy's head
   */
  private isHittingEnemyHead() {
    if (!this.isPunching()) return false

    const playerGloveBoundingBox =
      this.state === 'punchingTop'
        ? this.getTopGloveBoundingBox()
        : this.getBottomGloveBoundingBox()
    const enemyHeadBoundingBox = this.getOpponent().getHeadBoundingBox()

    return isColliding(playerGloveBoundingBox, enemyHeadBoundingBox, true)
  }

  /**
   * Check if the player is hitting the enemy's glove
   */
  private isHittingEnemyGlove() {
    if (!this.isPunching()) return false

    const playerGloveBoundingBox =
      this.state === 'punchingTop'
        ? this.getTopGloveBoundingBox()
        : this.getBottomGloveBoundingBox()

    const enemyGlovesBoundingBoxes = [
      this.getOpponent().getTopGloveBoundingBox(),
      this.getOpponent().getBottomGloveBoundingBox(),
    ]

    return enemyGlovesBoundingBoxes.some((enemyGlove) =>
      isColliding(playerGloveBoundingBox, enemyGlove, true),
    )
  }

  /**
   * Calculate the horizontal displacement of the player
   */
  public getHorizontalDisplacement = (dt: number, speed: number = this.playerSpeedX) => speed * dt

  /**
   * Calculate the vertical displacement of the player
   */
  public getVerticalDisplacement = (dt: number, speed: number = this.playerSpeedY) => speed * dt

  /**
   * Clamp the player's position so their body bounding box stays within the ring
   */
  private clampToRing() {
    const bb = this.getMainBoundingBox()

    if (bb.left < ringInnerBounds.left) {
      this.x += ringInnerBounds.left - bb.left
    } else if (bb.right > ringInnerBounds.right) {
      this.x -= bb.right - ringInnerBounds.right
    }

    if (bb.top < ringInnerBounds.top) {
      this.y += ringInnerBounds.top - bb.top
    } else if (bb.bottom > ringInnerBounds.bottom) {
      this.y -= bb.bottom - ringInnerBounds.bottom
    }
  }

  /**
   * Update the player's facing direction according to the enemy's position
   */
  private updateFacingDirection() {
    // Don't turn around if not idle
    if (this.state !== 'idle') return

    const offset = 8

    if (
      this.getMainBoundingBox().right + offset > this.getOpponent().getMainBoundingBox().right &&
      this.isFacingRight()
    ) {
      this.facingDirection = 'left'
      this.x = this.x - this.width - offset
      this.clampToRing()
      this.stateMachine.setFacing('left')
      this.resetAnimationSpeed()
      this.syncClipFromStateMachine(true)
    }

    if (
      this.getMainBoundingBox().left - offset < this.getOpponent().getMainBoundingBox().left &&
      !this.isFacingRight()
    ) {
      this.facingDirection = 'right'
      this.x = this.x + this.width + offset
      this.clampToRing()
      this.stateMachine.setFacing('right')
      this.resetAnimationSpeed()
      this.syncClipFromStateMachine(true)
    }
  }

  /**
   * What to do when the player is hit
   */
  private updateHitState(dt: number) {
    if (this.state !== 'hitFromTop' && this.state !== 'hitFromBottom') return

    this.state === 'hitFromBottom'
      ? this.moveUp(dt, this.hitPlayerSpeedY)
      : this.moveDown(dt, this.hitPlayerSpeedY)

    this.isFacingRight()
      ? this.moveLeft(dt, this.hitPlayerSpeedX)
      : this.moveRight(dt, this.hitPlayerSpeedX)
  }

  /**
   * Reverses the punch at a higher speed when the player hits something
   */
  private reversePunch() {
    if (!this.currentClip) return

    const currentFrame = this.animationPlayer.getFrame()
    if (currentFrame.tag !== 'extend') return

    const currentIndex = this.currentClip.frames.findIndex((frame) => frame === currentFrame)
    if (currentIndex === -1) return

    const matchingRetractIndex = this.currentClip.frames.findIndex(
      (frame, index) =>
        index > currentIndex && frame.tag === 'retract' && frame.sprite === currentFrame.sprite,
    )

    if (matchingRetractIndex !== -1) {
      const retractClip: AnimationClip = {
        ...this.currentClip,
        frames: this.currentClip.frames.slice(matchingRetractIndex),
      }
      this.animationPlayer.play(retractClip)
      this.currentClip = retractClip
    }

    this.setAnimationSpeedMultiplier(2)
  }

  /**
   * Check if the player is already hitting the enemy
   * this is a shitty way of testing this, but it works
   */
  private isHittingEnemy = () => {
    const enemy = this.getOpponent()
    return (
      this.isFastForwarding ||
      enemy.isFastForwarding ||
      enemy.getState() === 'hitFromTop' ||
      enemy.getState() === 'hitFromBottom'
    )
  }

  /**
   * Increase the score
   */
  private increaseScore() {
    this.score += this.getXDistanceToEnemy() <= 80 ? 2 : 1
  }

  /**
   * What to do when the player is hitting something
   */
  private updateIsHitting() {
    // If the player is already hitting the enemy's gloves or head do nothing
    if (this.isHittingEnemy()) return

    // Check if the player is hitting the enemy's glove first
    if (this.isHittingEnemyGlove()) {
      this.emitHitBlocked()

      audioEvents.emit('audio:gloveHit')

      return
    }

    if (this.isHittingEnemyHead()) {
      this.reversePunch()
      this.increaseScore()

      this.getOpponent().setState(this.state === 'punchingTop' ? 'hitFromTop' : 'hitFromBottom')

      audioEvents.emit('audio:headHit')
    }
  }

  /**
   * Check if the player is above the enemy
   */
  public isAboveEnemy = () => this.getYCenter() < this.getOpponent().getYCenter()

  /**
   * Get the X distance to the enemy
   */
  public getXDistanceToEnemy = () => Math.abs(this.getXCenter() - this.getOpponent().getXCenter())

  /**
   * Get the distance to the enemy
   */
  public getYDistanceToEnemy = () => Math.abs(this.getYCenter() - this.getOpponent().getYCenter())

  /**
   * Move the player up
   */
  public moveUp(dt: number, speed: number = this.playerSpeedY) {
    this.y -= this.getVerticalDisplacement(dt, speed)
    this.clampToRing()
  }

  /**
   * Move the player down
   */
  public moveDown(dt: number, speed: number = this.playerSpeedY) {
    this.y += this.getVerticalDisplacement(dt, speed)
    this.clampToRing()
  }

  /**
   * Move the player left
   */
  public moveLeft(dt: number, speed: number = this.playerSpeedX) {
    this.x -= this.getHorizontalDisplacement(dt, speed)
    this.clampToRing()
  }

  /**
   * Move the player right
   */
  public moveRight(dt: number, speed: number = this.playerSpeedX) {
    this.x += this.getHorizontalDisplacement(dt, speed)
    this.clampToRing()
  }

  /**
   * Punch the enemy (or at least try...)
   */
  public punch() {
    if (this.state !== 'idle') return

    if (this.isAboveEnemy()) {
      this.state = 'punchingBottom'
      this.stateMachine.onEvent('PunchRequested', { punch: 'bottom' })
    } else {
      this.state = 'punchingTop'
      this.stateMachine.onEvent('PunchRequested', { punch: 'top' })
    }

    this.resetAnimationSpeed()
    this.syncClipFromStateMachine(true)
  }

  /**
   * Check if the player's body is colliding with the enemy
   */
  public isBodyCollidingWithEnemy() {
    const playerBoundingBox = this.getMainBoundingBox()
    const enemyBoundingBox = this.getOpponent().getMainBoundingBox()

    return isColliding(playerBoundingBox, enemyBoundingBox)
  }

  /**
   * Move with axis-separated body collision resolution.
   * Moves on X, resolves overlap, then moves on Y, resolves overlap.
   * This allows sliding along the opponent instead of freezing in place.
   */
  public moveWithBodyCollision(dx: number, dy: number) {
    // Move X
    if (dx !== 0) {
      const prevX = this.x
      this.x += dx
      this.clampToRing()
      if (this.isBodyCollidingWithEnemy()) {
        this.x = prevX
      }
    }

    // Move Y
    if (dy !== 0) {
      const prevY = this.y
      this.y += dy
      this.clampToRing()
      if (this.isBodyCollidingWithEnemy()) {
        this.y = prevY
      }
    }
  }

  /**
   * Get the bounding box of the player's top glove
   */
  public getTopGloveBoundingBox() {
    const xOffset = this.animationPlayer.getFrame().gloveXOffset

    return {
      left: this.renderX + xOffset,
      right: this.renderX + xOffset + this.gloveWidth,
      top: this.renderY,
      bottom: this.renderY + this.gloveHeight,
    }
  }

  /**
   * Get the bounding box of the player's bottom glove
   */
  public getBottomGloveBoundingBox() {
    const xOffset = this.animationPlayer.getFrame().gloveXOffset

    return {
      left: this.renderX + xOffset,
      right: this.renderX + xOffset + this.gloveWidth,
      top: this.renderY + this.height - this.gloveHeight,
      bottom: this.renderY + this.height,
    }
  }

  /**
   * Get the bounding box of the player's head
   */
  public getHeadBoundingBox() {
    const top: number = this.renderY + 40
    const bottom: number = top + this.headHeight
    const horizontalDisplacement: number = 9

    return this.isFacingRight()
      ? {
          left: this.renderX + horizontalDisplacement,
          right: this.renderX + horizontalDisplacement + this.headWidth,
          top: top,
          bottom: bottom,
        }
      : {
          left: this.renderX + this.fullWidth - horizontalDisplacement - this.headWidth,
          right: this.renderX + this.fullWidth - horizontalDisplacement,
          top: top,
          bottom: bottom,
        }
  }

  /**
   * Get the center of the player along the Y axis,
   * used to decide whether the player should hit
   * with the top or bottom glove
   */
  public getYCenter = () => this.renderY + this.height / 2

  /**
   * Get the center of the player along the X axis,
   * used to decide how much each hit is worth
   */
  public getXCenter = () =>
    Math.trunc(
      this.getMainBoundingBox().left + (this.actualWidth - this.width) + this.actualWidth / 2,
    )

  /**
   * Get the player's state
   */
  public getState = () => this.state

  /**
   * Set the player's state
   */
  public setState(state: PlayerState) {
    this.state = state

    if (state === 'hitFromTop') {
      this.stateMachine.onEvent('HitTakenTop')
      this.setAnimationSpeedMultiplier(2)
      this.syncClipFromStateMachine(true)
    }

    if (state === 'hitFromBottom') {
      this.stateMachine.onEvent('HitTakenBottom')
      this.setAnimationSpeedMultiplier(2)
      this.syncClipFromStateMachine(true)
    }
  }

  /**
   * Get the player's facing direction
   */
  public isFacingRight = () => this.facingDirection === 'right'

  /**
   * Get the player's color
   */
  public getColor = () => this.color

  /**
   * Get the player's x position
   */
  public getX = () => this.renderX

  /**
   * Get the player's y position
   */
  public getY = () => this.renderY

  /**
   * Get the player's score
   */
  public getScore = () => this.score

  /**
   * Update the player
   */
  public update(dt: number) {
    this.updateFacingDirection()
    this.updateIsHitting()
    this.updateHitState(dt)
    this.updateAnimation(dt)
  }
}
