class CrystalStopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.lapTimes = [];
        this.lapCounter = 0;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.updateStatus('READY');
        this.initializeAnimations();
    }
    
    initializeElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.millisecondsDisplay = document.getElementById('millisecondsDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapTimesContainer = document.getElementById('lapTimes');
        this.statusDot = document.getElementById('statusDot');
        this.statusText = document.getElementById('statusText');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.lapBtn.addEventListener('click', () => this.recordLap());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Enhanced keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.toggleTimer();
                    break;
                case 'KeyL':
                    if (this.isRunning) {
                        this.recordLap();
                    }
                    break;
                case 'KeyR':
                    this.reset();
                    break;
                case 'Escape':
                    if (this.isRunning) {
                        this.toggleTimer();
                    }
                    break;
            }
        });

        // Add mouse enter/leave effects for buttons
        [this.startBtn, this.lapBtn, this.resetBtn].forEach(btn => {
            btn.addEventListener('mouseenter', () => this.addHoverEffect(btn));
            btn.addEventListener('mouseleave', () => this.removeHoverEffect(btn));
        });
    }
    
    initializeAnimations() {
        // Add dynamic particle effects
        this.createFloatingParticles();
        
        // Initialize time display animations
        this.animateTimeDisplay();
        
        // Start background animations
        this.startBackgroundAnimations();
    }
    
    toggleTimer() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }
    
    start() {
        this.startTime = Date.now() - this.elapsedTime;
        this.isRunning = true;
        
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.updateDisplay();
        }, 10);
        
        this.updateButtons();
        this.updateStatus('RUNNING');
        this.addButtonEffect(this.startBtn, 'start');
        this.createStartEffect();
    }
    
    pause() {
        this.isRunning = false;
        clearInterval(this.timerInterval);
        this.updateButtons();
        this.updateStatus('PAUSED');
        this.addButtonEffect(this.startBtn, 'pause');
        this.createPauseEffect();
    }
    
    reset() {
        this.isRunning = false;
        clearInterval(this.timerInterval);
        this.elapsedTime = 0;
        this.lapTimes = [];
        this.lapCounter = 0;
        
        this.updateDisplay();
        this.updateButtons();
        this.updateStatus('READY');
        this.clearLapTimes();
        this.addButtonEffect(this.resetBtn, 'reset');
        this.createResetEffect();
    }
    
    recordLap() {
        if (!this.isRunning) return;
        
        this.lapCounter++;
        const currentTime = this.elapsedTime;
        
        // Calculate split time (time since last lap)
        const splitTime = this.lapTimes.length > 0 
            ? currentTime - this.lapTimes[this.lapTimes.length - 1].time
            : currentTime;
        
        const lapData = {
            number: this.lapCounter,
            time: currentTime,
            splitTime: splitTime
        };
        
        this.lapTimes.push(lapData);
        this.addLapToDisplay(lapData);
        this.addButtonEffect(this.lapBtn, 'lap');
        this.createLapEffect();
    }
    
    updateDisplay() {
        const { minutes, seconds, milliseconds } = this.formatTime(this.elapsedTime);
        
        this.timeDisplay.textContent = `${minutes}:${seconds}`;
        this.millisecondsDisplay.textContent = milliseconds;
        
        // Update time shadow and reflection
        const timeShadow = document.querySelector('.time-shadow');
        const timeReflection = document.querySelector('.time-reflection');
        if (timeShadow) {
            timeShadow.textContent = `${minutes}:${seconds}`;
        }
        if (timeReflection) {
            timeReflection.textContent = `${minutes}:${seconds}`;
        }
        
        // Add dynamic glow based on running state
        if (this.isRunning) {
            this.timeDisplay.style.animation = 'timeGlow 2s ease-in-out infinite';
        } else {
            this.timeDisplay.style.animation = 'timeGlow 4s ease-in-out infinite';
        }
    }
    
    updateButtons() {
        if (this.isRunning) {
            this.startBtn.innerHTML = `
                <span class="btn-content">PAUSE</span>
                <div class="btn-shine"></div>
                <div class="btn-glow"></div>
                <div class="btn-particles">
                    <div class="btn-particle"></div>
                    <div class="btn-particle"></div>
                    <div class="btn-particle"></div>
                </div>
                <div class="crystal-corners">
                    <div class="corner top-left"></div>
                    <div class="corner top-right"></div>
                    <div class="corner bottom-left"></div>
                    <div class="corner bottom-right"></div>
                </div>
            `;
            this.startBtn.className = 'btn btn-pause';
            this.lapBtn.disabled = false;
        } else {
            this.startBtn.innerHTML = `
                <span class="btn-content">START</span>
                <div class="btn-shine"></div>
                <div class="btn-glow"></div>
                <div class="btn-particles">
                    <div class="btn-particle"></div>
                    <div class="btn-particle"></div>
                    <div class="btn-particle"></div>
                </div>
                <div class="crystal-corners">
                    <div class="corner top-left"></div>
                    <div class="corner top-right"></div>
                    <div class="corner bottom-left"></div>
                    <div class="corner bottom-right"></div>
                </div>
            `;
            this.startBtn.className = 'btn btn-start';
            this.lapBtn.disabled = true;
        }
    }
    
    updateStatus(status) {
        this.statusText.textContent = status;
        
        // Update status dot color based on state
        switch(status) {
            case 'READY':
                this.statusDot.style.background = '#10b981';
                break;
            case 'RUNNING':
                this.statusDot.style.background = '#f59e0b';
                this.statusDot.style.animation = 'statusPulse 1s ease-in-out infinite';
                break;
            case 'PAUSED':
                this.statusDot.style.background = '#ef4444';
                this.statusDot.style.animation = 'statusPulse 2s ease-in-out infinite';
                break;
        }
    }
    
    formatTime(time) {
        const totalSeconds = Math.floor(time / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((time % 1000) / 10);
        
        return {
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
            milliseconds: milliseconds.toString().padStart(2, '0')
        };
    }
    
    addLapToDisplay(lapData) {
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        
        const { minutes: lapMinutes, seconds: lapSeconds, milliseconds: lapMs } = this.formatTime(lapData.time);
        const { minutes: splitMinutes, seconds: splitSeconds, milliseconds: splitMs } = this.formatTime(lapData.splitTime);
        
        lapItem.innerHTML = `
            <div class="lap-number">LAP ${lapData.number}</div>
            <div class="lap-time">${lapMinutes}:${lapSeconds}.${lapMs}</div>
            <div class="split-time">+${splitMinutes}:${splitSeconds}.${splitMs}</div>
        `;
        
        // Insert at the top of the list
        this.lapTimesContainer.insertBefore(lapItem, this.lapTimesContainer.firstChild);
        
        // Scroll to top
        this.lapTimesContainer.scrollTop = 0;
        
        // Add enhanced sparkle effect
        this.createEnhancedSparkleEffect(lapItem);
    }
    
    clearLapTimes() {
        // Animate out existing lap items
        const lapItems = this.lapTimesContainer.querySelectorAll('.lap-item');
        lapItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = 'slideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    if (item.parentNode) {
                        item.remove();
                    }
                }, 300);
            }, index * 50);
        });
    }
    
    addButtonEffect(button, type) {
        button.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Create enhanced ripple effect
        this.createEnhancedRippleEffect(button, type);
    }
    
    addHoverEffect(button) {
        // Add dynamic particle burst on hover
        this.createHoverParticles(button);
    }
    
    removeHoverEffect(button) {
        // Clean up hover effects if needed
    }
    
    createEnhancedRippleEffect(button, type) {
        const ripple = document.createElement('div');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        // Color based on button type
        let color = 'rgba(255, 255, 255, 0.4)';
        switch(type) {
            case 'start':
                color = 'rgba(34, 197, 94, 0.5)';
                break;
            case 'pause':
                color = 'rgba(251, 146, 60, 0.5)';
                break;
            case 'lap':
                color = 'rgba(59, 130, 246, 0.5)';
                break;
            case 'reset':
                color = 'rgba(239, 68, 68, 0.5)';
                break;
        }
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: ${color};
            transform: scale(0);
            animation: enhancedRipple 0.8s linear;
            left: 50%;
            top: 50%;
            width: ${size}px;
            height: ${size}px;
            margin-left: -${size/2}px;
            margin-top: -${size/2}px;
            pointer-events: none;
            z-index: 1;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 800);
    }
    
    createEnhancedSparkleEffect(element) {
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            const size = Math.random() * 6 + 2;
            const delay = Math.random() * 0.5;
            
            sparkle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, #ffffff, rgba(255, 255, 255, 0.5));
                border-radius: 50%;
                pointer-events: none;
                animation: enhancedSparkle 1.5s ease-out forwards;
                animation-delay: ${delay}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                z-index: 1000;
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
            `;
            
            element.style.position = 'relative';
            element.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 1500 + delay * 1000);
        }
    }
    
    createHoverParticles(button) {
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 4 + 2;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                pointer-events: none;
                animation: hoverParticle 1s ease-out forwards;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                z-index: 10;
            `;
            
            button.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
    
    createStartEffect() {
        // Create expanding ring effect
        const ring = document.createElement('div');
        ring.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            border: 2px solid rgba(34, 197, 94, 0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: expandRing 1s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(ring);
        
        setTimeout(() => {
            ring.remove();
        }, 1000);
    }
    
    createPauseEffect() {
        // Create pulse effect
        const pulse = document.createElement('div');
        pulse.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(251, 146, 60, 0.2), transparent);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: pulseEffect 0.8s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(pulse);
        
        setTimeout(() => {
            pulse.remove();
        }, 800);
    }
    
    createResetEffect() {
        // Create shockwave effect
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                width: 50px;
                height: 50px;
                border: 2px solid rgba(239, 68, 68, ${0.5 - i * 0.15});
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: shockwave 1.2s ease-out forwards;
                animation-delay: ${i * 0.1}s;
                pointer-events: none;
                z-index: 1000;
            `;
            
            document.body.appendChild(wave);
            
            setTimeout(() => {
                wave.remove();
            }, 1200 + i * 100);
        }
    }
    
    createLapEffect() {
        // Create burst effect
        for (let i = 0; i < 12; i++) {
            const burst = document.createElement('div');
            const angle = (i * 30) * Math.PI / 180;
            const distance = 100;
            
            burst.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                width: 4px;
                height: 4px;
                background: rgba(59, 130, 246, 0.8);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: burstParticle 1s ease-out forwards;
                pointer-events: none;
                z-index: 1000;
                --angle: ${angle}rad;
                --distance: ${distance}px;
            `;
            
            document.body.appendChild(burst);
            
            setTimeout(() => {
                burst.remove();
            }, 1000);
        }
    }
    
    createFloatingParticles() {
        // Add more dynamic floating particles
        setInterval(() => {
            if (Math.random() < 0.3) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: ${Math.random() * 6 + 2}px;
                    height: ${Math.random() * 6 + 2}px;
                    background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
                    border-radius: 50%;
                    left: ${Math.random() * 100}vw;
                    top: 100vh;
                    pointer-events: none;
                    z-index: 0;
                    animation: floatUp ${Math.random() * 10 + 10}s linear forwards;
                `;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 20000);
            }
        }, 2000);
    }
    
    animateTimeDisplay() {
        // Add subtle breathing animation to time display
        const timeContainer = document.querySelector('.time-container');
        if (timeContainer) {
            timeContainer.style.animation = 'breathe 4s ease-in-out infinite';
        }
    }
    
    startBackgroundAnimations() {
        // Add dynamic background color shifts
        let hue = 0;
        setInterval(() => {
            hue = (hue + 0.5) % 360;
            document.body.style.filter = `hue-rotate(${hue}deg)`;
        }, 100);
    }
}

// Enhanced CSS animations
const enhancedStyleSheet = document.createElement('style');
enhancedStyleSheet.textContent = `
    @keyframes enhancedRipple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes enhancedSparkle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 0.8;
        }
        100% {
            transform: scale(0.5) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes hoverParticle {
        0% {
            transform: scale(0) translateY(0);
            opacity: 1;
        }
        100% {
            transform: scale(1) translateY(-20px);
            opacity: 0;
        }
    }
    
    @keyframes expandRing {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(5);
            opacity: 0;
        }
    }
    
    @keyframes pulseEffect {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.8;
        }
        100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
    
    @keyframes shockwave {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(8);
            opacity: 0;
        }
    }
    
    @keyframes burstParticle {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) 
                      translateX(calc(cos(var(--angle)) * var(--distance))) 
                      translateY(calc(sin(var(--angle)) * var(--distance))) 
                      scale(0);
            opacity: 0;
        }
    }
    
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes breathe {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.02);
        }
    }
    
    @keyframes slideOut {
        0% {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateX(-100%) scale(0.8);
        }
    }
`;
document.head.appendChild(enhancedStyleSheet);

// Initialize the enhanced stopwatch when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const stopwatch = new CrystalStopwatch();
    
    // Enhanced loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Performance optimization with enhanced visibility handling
    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
        if (stopwatch.isRunning) {
            if (isVisible) {
                // Resume full animation when visible
                stopwatch.start();
            } else {
                // Reduce update frequency when not visible
                clearInterval(stopwatch.timerInterval);
                stopwatch.timerInterval = setInterval(() => {
                    stopwatch.elapsedTime = Date.now() - stopwatch.startTime;
                    stopwatch.updateDisplay();
                }, 100);
            }
        }
    });
    
    // Add window resize handler for responsive animations
    window.addEventListener('resize', () => {
        // Adjust animations based on screen size
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            document.body.style.filter = 'none'; // Disable heavy effects on mobile
        }
    });
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CrystalStopwatch;
}