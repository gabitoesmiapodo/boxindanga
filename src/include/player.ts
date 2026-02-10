import { animationClips } from './animationClips'
import { AnimationPlayer } from './animationPlayer'
import { AnimationStateMachine } from './animationStateMachine'
import type { AnimationClip, AnimationClipId } from './animationTypes'
import { Overseer } from './overseer'
import { ringInnerBounds } from './ring'
import { audioEvents } from './audioEvents'
import { drawSprite, isColliding } from './utils'

export type PlayerType = 'playerOne' | 'playerTwo'
type Direction = 'left' | 'right'
type PlayerState = 'punchingTop' | 'punchingBottom' | 'hitFromTop' | 'hitFromBottom' | 'idle'

export class Player {
  private readonly animationPlayer = new AnimationPlayer()
  private readonly stateMachine = new AnimationStateMachine()
  private currentClipId: AnimationClipId | null = null
  private currentClip: AnimationClip | null = null
  private animationSpeedMultiplier = 1
  private isFastForwarding = false
  private facingDirection: Direction = 'right' // direction is sorted out in the first update
  private score = 0

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

  protected x = 0 // set in the constructor according to player type
  protected y = 0 // set in the constructor according to player type
  protected color = '#649335' // set in the constructor according to player type
  protected state: PlayerState = 'idle'

  public readonly playerType: PlayerType

  constructor(playerType: PlayerType) {
    this.playerType = playerType
    this.stateMachine.setFacing('right')
    this.syncClipFromStateMachine(true)
  }

  protected reset() {
    this.x = 0
    this.y = 0
    this.score = 0
    this.state = 'idle'
    this.facingDirection = 'right'
    this.stateMachine.setFacing('right')
    this.stateMachine.onEvent('ClipFinished')
    this.resetAnimationSpeed()
    this.syncClipFromStateMachine(true)
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

    const frame = this.animationPlayer.getFrame()
    drawSprite(frame.sprite, this.color, this.x, this.y)
  }

  /**
   * Get the bounding box of the player's body
   */
  private getMainBoundingBox = () =>
    this.isFacingRight()
      ? {
          left: this.x,
          right: this.x + this.width,
          top: this.y,
          bottom: this.y + this.height,
        }
      : {
          left: this.x + this.fullWidth - this.width,
          right: this.x + this.fullWidth,
          top: this.y,
          bottom: this.y + this.height,
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
    const enemyHeadBoundingBox = Overseer.getEnemy(this).getHeadBoundingBox()

    return isColliding(playerGloveBoundingBox, enemyHeadBoundingBox)
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
      Overseer.getEnemy(this).getTopGloveBoundingBox(),
      Overseer.getEnemy(this).getBottomGloveBoundingBox(),
    ]

    return enemyGlovesBoundingBoxes.some((enemyGlove) =>
      isColliding(playerGloveBoundingBox, enemyGlove),
    )
  }

  /**
   * Calculate the horizontal displacement of the player
   */
  private calculateHorizontalDisplacement = (dt: number, speed: number) => Math.trunc(speed * dt)

  /**
   * Calculate the vertical displacement of the player
   */
  private calculateVerticalDisplacement = (dt: number, speed: number) => Math.trunc(speed * dt)

  /**
   * Check if the player is colliding with the left of the ring
   */
  private isCollidingWithRingLeft = (dt: number, speed: number) =>
    this.getMainBoundingBox().left - this.calculateHorizontalDisplacement(dt, speed) <
    ringInnerBounds.left

  /**
   * Check if the player is colliding with the right of the ring
   */
  private isCollidingWithRingRight = (dt: number, speed: number) =>
    this.getMainBoundingBox().right + this.calculateHorizontalDisplacement(dt, speed) >
    ringInnerBounds.right

  /**
   * Check if the player is colliding with the top of the ring
   */
  private isCollidingWithRingTop = (dt: number, speed: number) =>
    this.getMainBoundingBox().top - this.calculateVerticalDisplacement(dt, speed) <
    ringInnerBounds.top

  /**
   * Check if the player is colliding with the bottom of the ring
   */
  private isCollidingWithRingBottom = (dt: number, speed: number) =>
    this.getMainBoundingBox().bottom + this.calculateVerticalDisplacement(dt, speed) >
    ringInnerBounds.bottom

  /**
   * Update the player's facing direction according to the enemy's position
   */
  private updateFacingDirection() {
    // Don't turn around if not idle
    if (this.state !== 'idle') return

    const offset = 8

    if (
      this.getMainBoundingBox().right + offset >
        Overseer.getEnemy(this).getMainBoundingBox().right &&
      this.isFacingRight()
    ) {
      this.facingDirection = 'left'
      this.x = this.x - this.width - offset
      this.stateMachine.setFacing('left')
      this.resetAnimationSpeed()
      this.syncClipFromStateMachine(true)
    }

    if (
      this.getMainBoundingBox().left - offset < Overseer.getEnemy(this).getMainBoundingBox().left &&
      !this.isFacingRight()
    ) {
      this.facingDirection = 'right'
      this.x = this.x + this.width + offset
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
  private isHittingEnemy = () =>
    this.isFastForwarding ||
    Overseer.getEnemy(this).getState() === 'hitFromTop' ||
    Overseer.getEnemy(this).getState() === 'hitFromBottom'

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

      Overseer.getEnemy(this).setState(
        this.state === 'punchingTop' ? 'hitFromTop' : 'hitFromBottom',
      )

      audioEvents.emit('audio:headHit')
    }
  }

  /**
   * Check if the player is above the enemy
   */
  protected isAboveEnemy = () => this.getYCenter() < Overseer.getEnemy(this).getYCenter()

  /**
   * Get the X distance to the enemy
   */
  protected getXDistanceToEnemy = () =>
    Math.abs(this.getXCenter() - Overseer.getEnemy(this).getXCenter())

  /**
   * Get the distance to the enemy
   */
  protected getYDistanceToEnemy = () =>
    Math.abs(this.getYCenter() - Overseer.getEnemy(this).getYCenter())

  /**
   * Move the player up
   */
  protected moveUp(dt: number, speed: number = this.playerSpeedY) {
    if (!this.isCollidingWithRingTop(dt, speed))
      this.y -= this.calculateVerticalDisplacement(dt, speed)
  }

  /**
   * Move the player down
   */
  protected moveDown(dt: number, speed: number = this.playerSpeedY) {
    if (!this.isCollidingWithRingBottom(dt, speed))
      this.y += this.calculateVerticalDisplacement(dt, speed)
  }

  /**
   * Move the player left
   */
  protected moveLeft(dt: number, speed: number = this.playerSpeedX) {
    if (!this.isCollidingWithRingLeft(dt, speed))
      this.x -= this.calculateHorizontalDisplacement(dt, speed)
  }

  /**
   * Move the player right
   */
  protected moveRight(dt: number, speed: number = this.playerSpeedX) {
    if (!this.isCollidingWithRingRight(dt, speed))
      this.x += this.calculateHorizontalDisplacement(dt, speed)
  }

  /**
   * Punch the enemy (or at least try...)
   */
  protected punch() {
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
  protected isBodyCollidingWithEnemy() {
    const playerBoundingBox = this.getMainBoundingBox()
    const enemyBoundingBox = Overseer.getEnemy(this).getMainBoundingBox()

    return isColliding(playerBoundingBox, enemyBoundingBox)
  }

  /**
   * Get the bounding box of the player's top glove
   */
  public getTopGloveBoundingBox() {
    const xOffset = this.animationPlayer.getFrame().gloveXOffset

    return {
      left: this.x + xOffset,
      right: this.x + xOffset + this.gloveWidth,
      top: this.y,
      bottom: this.y + this.gloveHeight,
    }
  }

  /**
   * Get the bounding box of the player's bottom glove
   */
  public getBottomGloveBoundingBox() {
    const xOffset = this.animationPlayer.getFrame().gloveXOffset

    return {
      left: this.x + xOffset,
      right: this.x + xOffset + this.gloveWidth,
      top: this.y + this.height - this.gloveHeight,
      bottom: this.y + this.height,
    }
  }

  /**
   * Get the bounding box of the player's head
   */
  public getHeadBoundingBox() {
    const top: number = this.y + 40
    const bottom: number = top + this.headHeight
    const horizontalDisplacement: number = 9

    return this.isFacingRight()
      ? {
          left: this.x + horizontalDisplacement,
          right: this.x + horizontalDisplacement + this.headWidth,
          top: top,
          bottom: bottom,
        }
      : {
          left: this.x + this.fullWidth - horizontalDisplacement - this.headWidth,
          right: this.x + this.fullWidth - horizontalDisplacement,
          top: top,
          bottom: bottom,
        }
  }

  /**
   * Get the center of the player along the Y axis,
   * used to decide whether the player should hit
   * with the top or bottom glove
   */
  public getYCenter = () => Math.trunc(this.y + this.height / 2)

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
  public getX = () => this.x

  /**
   * Get the player's y position
   */
  public getY = () => this.y

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
