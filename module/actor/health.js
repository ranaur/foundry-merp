export class Merp1eHealth {
    constructor(actor) {
      this.actor = actor;
    }
  
    get maximumHPDie() {
      return this.maximumHPOut + this.actor.stats.co.value;
    }
  
    get maximumHPOut() {
      return this.actor.getSkillValue(game.merp1e.Merp1eRules.skill.BODY_DEVELOPMENT);
    }
  
    get hitsTaken() {
      return this.actor.health.status.hitsTaken;
    }
  
    get hitsLeft() {
      return this.maximumHPOut - this.hitsTaken;
    }
  
    get status() {
      return this.actor.data.data.healthStatus;
    }
  
    heal(hits) {
      if(hits < 0) return;
  
      if( game.merp1e.Merp1eRules.settings.damageControlManual ) {
        this.actor.health.status.hitsTaken -= hits;
        this.update();
      } else { //game.merp1e.Merp1eRules.settings.damageControlAutomatic()
        let hitsToHeal = hits;
        let damagesToUpdate = [];
        for(let damage in this.damages) {
          let damage = this.actor.damages[damageId];
          let currentDamageData = damage.data.data.current;
          if(currentDamageData.additionalHits > 0) {
            if(currentDamageData.additionalHits >= hitsToHeal) {
                // the damage will abosrb all hits to heal
              currentDamageData.additionalHits -= hitsToHeal;
              hitsToHeal = 0;
              damagesToUpdate.push(damage.id);
              break;
            } else { // currentDamageData.additionalHits < hits
                // the healing will zero this damage, and there will be more to heal
              hitsToHeal -= currentDamageData.additionalHits;
              currentDamageData.additionalHits = 0;
              damagesToUpdate.push({ _id: damage.id, data: damage.data } );
            }
          }
        }
        this.updateEmbeddedDocuments("Item", damagesToUpdate);
      }
    }
  
    consolidateDamage() {
      if( game.merp1e.Merp1eRules.settings.damageControlManual ) return;
  
      this.status.hitsTaken = 0;
      this.status.hitsPerRound = 0;
      this.status.activityPenalty = 0;
      this.status.roundsDown = 0;
      this.status.roundsOut = 0;
      this.status.roundsUntilDeath = -1;
      this.status.roundsStunned = 0;
      this.status.roundsBlinded = 0;
      this.status.unconsciousComa = 0;
      this.status.rightArm = 0;
      this.status.leftArm = 0;
      this.status.rightLeg = 0;
      this.status.leftLeg = 0;
      this.status.paralyzed = 0;
      this.status.hearingLoss = 0;
      this.status.eyeLoss = 0;
  
      for(let damageId in this.actor.damages) {
        let damage = this.actor.damages[damageId];
        damage.apply();
        let currentDamageData = damage.data.data.current;
  
        this.status.hitsTaken += currentDamageData.additionalHits || 0;
        this.status.hitsPerRound += currentDamageData.hitsPerRound || 0;
        if(currentDamageData.roundsActivityPenalty != 0) {
          this.status.activityPenalty += currentDamageData.activityPenalty;
        }
        this.status.roundsStunned += currentDamageData.roundsStunned || 0;
        this.status.roundsDown += currentDamageData.roundsDown || 0;
        this.status.roundsOut += currentDamageData.roundsOut || 0;
        this.status.roundsBlinded += currentDamageData.roundsBlinded || 0;
        this.status.unconsciousComa += currentDamageData.unconsciousComa || 0;
        this.status.roundsWeaponStuck = max(this.status.roundsWeaponStuck, currentDamageData.roundsWeaponStuck);
        if(currentDamageData.roundsUntilDeath > 0) {
          if(this.status.roundsUntilDeath == -1) { 
            this.status.roundsUntilDeath = currentDamageData.roundsUntilDeath;
          } else {
            this.status.roundsUntilDeath = this.status.roundsUntilDeath > currentDamageData.roundsUntilDeath ? currentDamageData.roundsUntilDeath : this.status.roundsUntilDeath;
          }
        }
        this.status.rightArm = this.status.rightArm | currentDamageData.rightArm; // 01 right, 10 left, 11 both
        this.status.leftArm = this.status.leftArm | currentDamageData.leftArm; 
        this.status.rightLeg = this.status.rightLeg | currentDamageData.rightLeg;
        this.status.leftLeg = this.status.leftLeg | currentDamageData.leftLeg;
  
        this.status.paralyzed = max(this.status.paralyzed, currentDamageData.paralyzed);
        this.status.hearingLoss = this.status.hearingLoss | currentDamageData.hearingLoss;
        this.status.eyeLoss = this.status.eyeLoss | currentDamageData.eyeLoss;
      }
    }
    nextRound() {
      if( game.merp1e.Merp1eRules.settings.damageControlManual ) return;
  
      this.consolidateDamage();
      let adjustedStunDownOut = false;
      let idsToUpdate = [];
  
      for(let damageId in this.actor.damages) {
        let damage = this.actor.damages[damageId];
        let currentDamageData = damage.data.data.current;
        if(currentDamageData.hitsPerRound > 0) {
          currentDamageData.additionalHits += currentDamageData.hitsPerRound;
        }
        if(currentDamageData.activityPenaltyTemporary) {
          if(currentDamageData.roundsActivityPenalty > 0) {
            currentDamageData.roundsActivityPenalty--;
          }
        }
        if(currentDamageData.roundsUntilDeath > 0 ) {
          currentDamageData.roundsUntilDeath--;
          if( currentDamageData.roundsUntilDeath == 0 ) {
            this.die();
          }
        }
        if(currentDamageData.roundsBlinded > 0) currentDamageData.roundsBlinded--;
  
        if(!adjustedStunDownOut) {
          if(this.status.roundsOut > 0) {
            if(currentDamageData.roundsOut > 0) { currentDamageData.roundsOut--; adjustedStunDownOut = true; }
          } else if (this.status.roundsDown > 0 ){
            if(currentDamageData.roundsDown > 0) { currentDamageData.roundsDown--; adjustedStunDownOut = true; }
          } else if (this.status.roundsStunned > 0 ){
            if(currentDamageData.roundsStunned > 0) { currentDamageData.roundsStunned--; adjustedStunDownOut = true; }
          }
        }
        idsToUpdate.push({ _id: damageId, data: damage.data.data });
      }
      this.actor.updateEmbeddedDocuments("Item", idsToUpdate);
      this.consolidateDamage();
    }
    die(){
      this.status.dead = true;
      // XXX record in which round the character died?
    }
    get isDead() {
      return this.status.dead == true || this.status.hitsTaken > this.status.maximumHPDie;
    }
    get isUnconscious() {
      return !this.isDead && this.status.hourUnconscious > 0 && this.status.hitsTaken >= this.status.maximumHPOut;
    }
    get isOut() {
      return this.status.roundsOut > 0;
    }
    get isDown() {
      return (! this.isOut) && this.status.roundsDown > 0;
    }
    get isStunned() {
      return (! this.isDown) && this.status.roundsStunned > 0;
    }
    get isParalyzed() {
      return this.status.paralyzed != "0";
    }
    get isLimbOut() {
      return  this.status.rightArm != "0" ||
        this.status.leftArm != "0" ||
        this.status.rightLeg != "0" ||
        this.status.leftLeg != "0";
    }
    get isDeaf() {
      return this.status.earLoss != "3";
    }
    get isBlind() {
      return this.status.roundsBlinded > 0 && this.status.eyeLoss != "3";
    }
  }
  