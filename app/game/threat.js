const THREAT_TTL = 30;
const THREAT_TICK_SPEED = 1000;
const THREAT_COOLDOWN_SECONDS = 5;

const Threat = (onThreatUnresolved) => {
    let currentAge = THREAT_TTL;

    const tick = () => {
        currentAge -= 1;
        if (currentAge <= 0) {
            onThreatUnresolved();
        }
        else {
            setTimeout(tick, THREAT_TICK_SPEED);
        }
    };
    setTimeout(tick, THREAT_TICK_SPEED);
}

module.exports = { Threat, THREAT_COOLDOWN_SECONDS, THREAT_TTL }
