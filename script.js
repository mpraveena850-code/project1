function calculateCycle() {
    const lastDateInput = document.getElementById('lastDate').value;
    const cycleLengthInput = parseInt(document.getElementById('cycleLength').value);
    const periodLengthInput = parseInt(document.getElementById('periodLength').value);

    if (!lastDateInput) {
        alert('Please select the start date of your last period.');
        return;
    }

    const lastDate = new Date(lastDateInput);
    const today = new Date();
    
    lastDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    const timeDiff = today.getTime() - lastDate.getTime();
    const daysSinceLastPeriod = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysSinceLastPeriod < 0) {
        alert('The start date cannot be in the future.');
        return;
    }

    const statusCard = document.getElementById('statusCard');
    const statusTitle = document.getElementById('statusTitle');
    const statusValue = document.getElementById('statusValue');
    const currentPhaseText = document.getElementById('currentPhase');
    const phaseDescriptionText = document.getElementById('phaseDescription');
    const nextPeriodDateText = document.getElementById('nextPeriodDate');
    const clickableCard = document.getElementById('clickablePhaseCard');

    const isIrregular = (
        cycleLengthInput < 21 || 
        cycleLengthInput > 45 || 
        daysSinceLastPeriod > 38 || 
        daysSinceLastPeriod > (cycleLengthInput + 7)
    );

    const nextPeriod = new Date(lastDate);
    nextPeriod.setDate(lastDate.getDate() + cycleLengthInput);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    nextPeriodDateText.innerText = nextPeriod.toLocaleDateString('en-US', options);

    const currentDayOfCycle = (daysSinceLastPeriod % cycleLengthInput) + 1;
    
    let phase = "";
    let description = "";
    let targetPage = "";
    const ovulationDay = cycleLengthInput - 14;

    if (isIrregular) {
        statusCard.style.display = 'block';
        statusTitle.innerText = "🚨 Cycle Warning";
        statusValue.innerText = "Irregular / Delayed Period Detected";
        
        phase = "Irregular / Delayed Cycle ⚠️";
        description = "Your period is significantly delayed. Click here to learn more about tracking irregular cycles.";
        
        targetPage = "irr.html"; 
        
        currentPhaseText.innerText = phase;
    } else {
        statusCard.style.display = 'none';
        
        if (currentDayOfCycle >= 1 && currentDayOfCycle <= periodLengthInput) {
            phase = "Menstrual Phase 🩸";
            description = "Your cycle has restarted. Estrogen and progesterone levels are low.";
            targetPage = "menstrual.html";
        } else if (currentDayOfCycle > periodLengthInput && currentDayOfCycle < ovulationDay) {
            phase = "Follicular Phase 🌱";
            description = "Your body is preparing an egg for release. Energy levels are likely rising.";
            targetPage = "follicular.html";
        } else if (currentDayOfCycle >= ovulationDay && currentDayOfCycle <= (ovulationDay + 1)) {
            phase = "Ovulation Phase ✨";
            description = "An egg is released. This is the peak fertility window of your cycle.";
            targetPage = "ovulation.html";
        } else {
            phase = "Luteal Phase 🌙";
            description = "Progesterone peaks to support a potential pregnancy. You may experience PMS symptoms.";
            targetPage = "luteal.html";
        }
        
        currentPhaseText.innerText = `Day ${currentDayOfCycle}: ${phase}`;
    }
    
    phaseDescriptionText.innerText = description;

    clickableCard.onclick = function() {
        window.location.href = targetPage; 
    };
    
    statusCard.onclick = function() {
        if (isIrregular) {
            window.location.href = targetPage; 
        }
    };

    document.getElementById('resultsBox').style.display = 'block';
}