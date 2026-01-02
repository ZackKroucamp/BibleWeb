<?php
require_once(__DIR__ . '/../includes/auth.php');
include(__DIR__ . '/../includes/header.php');
?>

<style>
    .hero {
        background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.95) 0%, 
            rgba(30, 58, 138, 0.9) 50%, 
            rgba(37, 99, 235, 0.85) 100%);
        min-height: calc(100vh - 70px);
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: white;
        position: relative;
        overflow: hidden;
        padding: 4rem 2rem;
    }

    /* Animated background patterns */
    .hero::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(147, 197, 253, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(96, 165, 250, 0.1) 0%, transparent 50%);
        animation: pulseGlow 8s ease-in-out infinite;
    }

    .hero::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: 
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        background-size: 50px 50px;
        opacity: 0.5;
    }

    .hero-content {
        max-width: 1000px;
        animation: heroFadeIn 1.2s ease-out;
        z-index: 1;
        position: relative;
    }

    /* Decorative element above title */
    .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        padding: 0.6rem 1.5rem;
        border-radius: 50px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        margin-bottom: 2rem;
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        animation: badgeSlide 1s ease-out 0.3s both;
    }

    .hero-badge::before {
        content: '✨';
        font-size: 1.2rem;
    }

    .hero h1 {
        font-size: clamp(2.5rem, 6vw, 4.5rem);
        margin-bottom: 1.5rem;
        font-weight: 900;
        line-height: 1.1;
        text-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
        background: linear-gradient(135deg, #ffffff 0%, #e0f2fe 50%, #bae6fd 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: -0.02em;
        animation: titleGlow 1s ease-out 0.5s both;
    }

    .hero p {
        font-size: clamp(1.1rem, 2vw, 1.4rem);
        margin-bottom: 3rem;
        color: #e2e8f0;
        font-weight: 400;
        line-height: 1.7;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        max-width: 750px;
        margin-left: auto;
        margin-right: auto;
        animation: textSlide 1s ease-out 0.7s both;
    }

    .cta-button {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
        color: #1e40af;
        text-decoration: none;
        padding: 1.25rem 3rem;
        border-radius: 16px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        font-size: 1rem;
        position: relative;
        overflow: hidden;
        animation: buttonPop 1s ease-out 0.9s both;
    }

    .cta-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
        transition: left 0.5s;
    }

    .cta-button:hover::before {
        left: 100%;
    }

    .cta-button:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 1);
        color: #1e3a8a;
    }

    .cta-button::after {
        content: '→';
        font-size: 1.3rem;
        transition: transform 0.3s ease;
    }

    .cta-button:hover::after {
        transform: translateX(5px);
    }

    /* Floating decorative elements */
    .hero-decoration {
        position: absolute;
        opacity: 0.15;
        pointer-events: none;
        filter: drop-shadow(0 4px 12px rgba(255, 255, 255, 0.2));
        color: rgba(255, 255, 255, 0.9);
    }

    .decoration-1 {
        top: 12%;
        left: 8%;
        width: 80px;
        height: 80px;
        animation: float 8s ease-in-out infinite;
    }

    .decoration-2 {
        bottom: 20%;
        right: 10%;
        width: 70px;
        height: 70px;
        animation: float 10s ease-in-out infinite 2s;
    }

    .decoration-3 {
        top: 55%;
        left: 5%;
        width: 60px;
        height: 60px;
        animation: float 9s ease-in-out infinite 1s;
    }

    .decoration-4 {
        top: 25%;
        right: 12%;
        width: 50px;
        height: 50px;
        animation: float 7s ease-in-out infinite 3s;
    }

    .decoration-5 {
        bottom: 35%;
        left: 15%;
        width: 55px;
        height: 55px;
        animation: float 11s ease-in-out infinite 1.5s;
    }

    .decoration-6 {
        top: 40%;
        right: 8%;
        width: 65px;
        height: 65px;
        animation: float 9.5s ease-in-out infinite 2.5s;
    }

    .decoration-7 {
        bottom: 45%;
        right: 20%;
        width: 45px;
        height: 45px;
        animation: float 8.5s ease-in-out infinite 1s;
    }

    .decoration-8 {
        top: 70%;
        left: 20%;
        width: 50px;
        height: 50px;
        animation: float 10.5s ease-in-out infinite 3.5s;
    }

    .decoration-9 {
        top: 18%;
        left: 25%;
        width: 40px;
        height: 40px;
        animation: float 7.5s ease-in-out infinite 0.5s;
    }

    .decoration-10 {
        bottom: 25%;
        left: 35%;
        width: 48px;
        height: 48px;
        animation: float 9s ease-in-out infinite 2s;
    }

    /* Scroll indicator */
    .scroll-indicator {
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        animation: scrollBounce 2s ease-in-out infinite;
    }

    .scroll-indicator::after {
        content: '↓';
        font-size: 1.5rem;
    }

    /* Animations */
    @keyframes heroFadeIn {
        from {
            opacity: 0;
            transform: translateY(40px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes titleGlow {
        from {
            opacity: 0;
            transform: translateY(20px);
            filter: blur(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
        }
    }

    @keyframes textSlide {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes buttonPop {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes badgeSlide {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes pulseGlow {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-20px);
        }
    }

    @keyframes scrollBounce {
        0%, 100% {
            transform: translateX(-50%) translateY(0);
        }
        50% {
            transform: translateX(-50%) translateY(10px);
        }
    }

    @media (max-width: 768px) {
        .hero {
            min-height: calc(100vh - 70px);
            padding: 3rem 1.5rem;
        }

        .hero-badge {
            font-size: 0.8rem;
            padding: 0.5rem 1.2rem;
        }

        .cta-button {
            padding: 1.1rem 2.5rem;
            font-size: 0.95rem;
        }

        .scroll-indicator {
            font-size: 0.75rem;
        }

        .hero-decoration {
            display: none;
        }
    }
</style>

<script src="/bibleweb/assets/js/scripts.js" defer></script>

<main id="main-content">
    <section class="hero">
        <!-- Floating decorations with cool biblical SVGs -->
        <div class="hero-decoration decoration-1">
            <!-- Better Menorah -->
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Base -->
                <rect x="52" y="95" width="16" height="8" rx="2" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.2)"/>
                <rect x="48" y="88" width="24" height="7" rx="2" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.15)"/>
                
                <!-- Center stem -->
                <rect x="57" y="30" width="6" height="58" rx="1" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.15)"/>
                
                <!-- Left branches -->
                <path d="M60 45 Q45 45 45 60" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                <path d="M60 55 Q35 55 35 70" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                <path d="M60 65 Q25 65 25 80" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                
                <!-- Right branches -->
                <path d="M60 45 Q75 45 75 60" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                <path d="M60 55 Q85 55 85 70" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                <path d="M60 65 Q95 65 95 80" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                
                <!-- Candle holders -->
                <circle cx="60" cy="30" r="5" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.25)"/>
                <circle cx="45" cy="60" r="4.5" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.25)"/>
                <circle cx="75" cy="60" r="4.5" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.25)"/>
                <circle cx="35" cy="70" r="4.5" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.25)"/>
                <circle cx="85" cy="70" r="4.5" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.25)"/>
                <circle cx="25" cy="80" r="4.5" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.25)"/>
                <circle cx="95" cy="80" r="4.5" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.25)"/>
                
                <!-- Flames -->
                <path d="M60 25 Q58 20 60 18 Q62 20 60 25 Z" fill="rgba(255,255,255,0.3)" stroke="currentColor" stroke-width="1"/>
                <path d="M45 55 Q43 50 45 48 Q47 50 45 55 Z" fill="rgba(255,255,255,0.3)" stroke="currentColor" stroke-width="1"/>
                <path d="M75 55 Q73 50 75 48 Q77 50 75 55 Z" fill="rgba(255,255,255,0.3)" stroke="currentColor" stroke-width="1"/>
                <path d="M35 65 Q33 60 35 58 Q37 60 35 65 Z" fill="rgba(255,255,255,0.3)" stroke="currentColor" stroke-width="1"/>
                <path d="M85 65 Q83 60 85 58 Q87 60 85 65 Z" fill="rgba(255,255,255,0.3)" stroke="currentColor" stroke-width="1"/>
                <path d="M25 75 Q23 70 25 68 Q27 70 25 75 Z" fill="rgba(255,255,255,0.3)" stroke="currentColor" stroke-width="1"/>
                <path d="M95 75 Q93 70 95 68 Q97 70 95 75 Z" fill="rgba(255,255,255,0.3)" stroke="currentColor" stroke-width="1"/>
            </svg>
        </div>
        
        <div class="hero-decoration decoration-2">
            <!-- Torah Scroll -->
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="15" y="25" width="8" height="50" rx="4" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.15)"/>
                <rect x="77" y="25" width="8" height="50" rx="4" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.15)"/>
                <path d="M23 30H77M23 40H77M23 50H77M23 60H77M23 70H77" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
                <path d="M23 35C23 28 23 25 50 25C77 25 77 28 77 35" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M23 65C23 72 23 75 50 75C77 75 77 72 77 65" stroke="currentColor" stroke-width="2" fill="none"/>
                <circle cx="19" cy="30" r="2" fill="rgba(255,255,255,0.4)"/>
                <circle cx="19" cy="70" r="2" fill="rgba(255,255,255,0.4)"/>
                <circle cx="81" cy="30" r="2" fill="rgba(255,255,255,0.4)"/>
                <circle cx="81" cy="70" r="2" fill="rgba(255,255,255,0.4)"/>
            </svg>
        </div>
        
        <div class="hero-decoration decoration-3">
            <!-- Olive Branch -->
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 80Q45 60 40 45Q35 30 30 20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                <ellipse cx="35" cy="25" rx="5" ry="8" transform="rotate(-30 35 25)" fill="rgba(255,255,255,0.2)" stroke="currentColor" stroke-width="1.5"/>
                <ellipse cx="42" cy="35" rx="5" ry="8" transform="rotate(20 42 35)" fill="rgba(255,255,255,0.2)" stroke="currentColor" stroke-width="1.5"/>
                <ellipse cx="38" cy="45" rx="5" ry="8" transform="rotate(-25 38 45)" fill="rgba(255,255,255,0.2)" stroke="currentColor" stroke-width="1.5"/>
                <ellipse cx="45" cy="55" rx="5" ry="8" transform="rotate(15 45 55)" fill="rgba(255,255,255,0.2)" stroke="currentColor" stroke-width="1.5"/>
                <ellipse cx="48" cy="68" rx="5" ry="8" transform="rotate(-20 48 68)" fill="rgba(255,255,255,0.2)" stroke="currentColor" stroke-width="1.5"/>
            </svg>
        </div>
        
        <div class="hero-decoration decoration-4">
            <!-- Ancient Amphora/Jar -->
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M35 30C35 25 40 20 50 20C60 20 65 25 65 30" stroke="currentColor" stroke-width="2" fill="none"/>
                <rect x="32" y="30" width="36" height="5" rx="1" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.15)"/>
                <path d="M34 35Q30 45 30 60Q30 75 50 78Q70 75 70 60Q70 45 66 35" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.1)"/>
                <path d="M38 45Q35 50 35 60M62 45Q65 50 65 60" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
                <line x1="42" y1="20" x2="40" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="58" y1="20" x2="60" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </div>
        
        <div class="hero-decoration decoration-5">
            <!-- Wheat/Grain -->
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 85L50 25" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                <ellipse cx="45" cy="30" rx="4" ry="6" fill="rgba(255,255,255,0.2)" stroke="currentColor" stroke-width="1.5"/>
                <ellipse cx="55" cy="30" rx="4" ry="6" fill="rgba(255,255,255,0.2)" stroke="currentColor" stroke-width="1.5"/>
                <ellipse cx="42" cy="38" rx="4" ry="6" fill="rgba(255,255,255,0.2)" stroke="currentColor" stroke-width="1.5"/>
                <ellipse cx="58" cy="38" rx="4" ry="6" fill="rgba(255,255,255,0.2)" stroke="currentColor" stroke-width="1.5"/>
                <ellipse cx="40" cy="46" rx="4" ry="6" fill="rgba(255,255,255,0.2)" stroke="currentColor" stroke-width="1.5"/>
                <ellipse cx="60" cy="46" rx="4" ry="6" fill="rgba(255,255,255,0.2)" stroke="currentColor" stroke-width="1.5"/>
                <ellipse cx="38" cy="54" rx="4" ry="6" fill="rgba(255,255,255,0.2)" stroke="currentColor" stroke-width="1.5"/>
                <ellipse cx="62" cy="54" rx="4" ry="6" fill="rgba(255,255,255,0.2)" stroke="currentColor" stroke-width="1.5"/>
                <path d="M50 65Q45 70 40 75M50 65Q55 70 60 75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </div>

        <div class="hero-decoration decoration-6">
            <!-- Dove -->
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="55" cy="50" rx="15" ry="10" fill="rgba(255,255,255,0.2)" stroke="currentColor" stroke-width="2"/>
                <circle cx="50" cy="48" r="8" fill="rgba(255,255,255,0.2)" stroke="currentColor" stroke-width="2"/>
                <path d="M30 55Q20 50 25 40Q30 45 35 48" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
                <path d="M70 48Q85 45 85 35Q80 40 75 43" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
                <path d="M65 55Q70 60 72 65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="48" cy="46" r="2" fill="currentColor"/>
                <path d="M52 50Q54 52 56 50" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
        </div>

        <div class="hero-decoration decoration-7">
            <!-- Shofar -->
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 50Q30 30 50 30Q70 30 80 45Q85 55 78 65Q70 75 50 70Q35 67 25 60Z" 
                      stroke="currentColor" stroke-width="2.5" fill="rgba(255,255,255,0.15)"/>
                <ellipse cx="22" cy="50" rx="5" ry="8" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.2)"/>
                <path d="M35 45Q45 40 55 42M40 55Q50 52 58 54" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
            </svg>
        </div>

        <div class="hero-decoration decoration-8">
            <!-- Oil Lamp -->
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="50" cy="55" rx="25" ry="15" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.15)"/>
                <path d="M75 55Q80 55 82 60L80 65Q78 67 75 65" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.15)"/>
                <circle cx="50" cy="52" r="8" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.1)"/>
                <path d="M50 44Q48 38 50 35Q52 38 50 44Z" fill="rgba(255,255,255,0.3)" stroke="currentColor" stroke-width="1"/>
                <path d="M35 58Q30 60 28 58" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
        </div>

        <div class="hero-decoration decoration-9">
            <!-- Grapes -->
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="45" r="6" fill="rgba(255,255,255,0.25)" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="42" cy="52" r="6" fill="rgba(255,255,255,0.25)" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="58" cy="52" r="6" fill="rgba(255,255,255,0.25)" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="50" cy="58" r="6" fill="rgba(255,255,255,0.25)" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="42" cy="64" r="6" fill="rgba(255,255,255,0.25)" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="58" cy="64" r="6" fill="rgba(255,255,255,0.25)" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="50" cy="70" r="6" fill="rgba(255,255,255,0.25)" stroke="currentColor" stroke-width="1.5"/>
                <path d="M50 35Q48 30 45 28Q42 30 45 35" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M50 35L50 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </div>

        <div class="hero-decoration decoration-10">
            <!-- Ancient Harp -->
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 70Q30 40 35 30Q40 20 50 20" stroke="currentColor" stroke-width="2.5" fill="none"/>
                <path d="M50 20Q60 20 65 30Q70 40 70 70" stroke="currentColor" stroke-width="2.5" fill="none"/>
                <rect x="28" y="70" width="44" height="8" rx="2" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.2)"/>
                <line x1="38" y1="30" x2="38" y2="70" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
                <line x1="44" y1="26" x2="44" y2="70" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
                <line x1="50" y1="24" x2="50" y2="70" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
                <line x1="56" y1="26" x2="56" y2="70" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
                <line x1="62" y1="30" x2="62" y2="70" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
            </svg>
        </div>
        
        <div class="hero-content">
            <div class="hero-badge">
                Welcome to Sacred Study
            </div>
            <h1>Shalom Scripture Study Center</h1>
            <p>Explore the depths of biblical wisdom through comprehensive study tools, interactive maps, ancient languages, and sacred traditions.</p>
            <a href="#features" class="cta-button" onclick="event.preventDefault(); document.querySelector('.features').scrollIntoView({behavior: 'smooth'});">
                Begin Your Journey
            </a>
        </div>
        
        <div class="scroll-indicator">
            Explore
        </div>
    </section>

    <section class="features" id="features">
        <div class="container">
            <h2 class="section-title">Comprehensive Bible Study Tools</h2>
            <p class="section-subtitle">Discover the richness of Scripture through our collection of study resources, from ancient languages to modern translations.</p>
            
            <div class="features-grid">
                <div class="feature-card" onclick="biblereader()">
                    <div class="feature-icon">📖</div>
                    <h3>Multiple Bible Versions</h3>
                    <p>Access various translations including KJV, NIV, ESV, NASB, and more for comprehensive understanding.</p>
                </div>
                
                <div class="feature-card" onclick="interlinear()">
                    <div class="feature-icon">🔤</div>
                    <h3>Interlinear Bible</h3>
                    <p>Study original Hebrew, Greek, and Aramaic texts with word-by-word translations and meanings.</p>
                </div>
                
                <div class="feature-card" onclick="showPage('maps')">
                    <div class="feature-icon">🗺️</div>
                    <h3>Interactive Bible Maps</h3>
                    <p>Explore biblical geography with detailed maps of ancient Israel, Paul's journeys, and key locations.</p>
                    <p style="color: #3b82f6"><b>Coming Soon...</b></p>
                </div>
                
                <div class="feature-card" onclick="familytree()">
                    <div class="feature-icon">🌳</div>
                    <h3>Biblical Family Trees</h3>
                    <p>Trace genealogies from Adam to Jesus, understanding the lineage of biblical characters.</p>
                </div>
                
                <div class="feature-card" onclick="recipes()">
                    <div class="feature-icon">🍞</div>
                    <h3>Biblical Recipes</h3>
                    <p>Experience biblical culture through authentic recipes mentioned in Scripture.</p>
                </div>
                
                <div class="feature-card" onclick="showPage('languages')">
                    <div class="feature-icon">📝</div>
                    <h3>Ancient Language Lessons</h3>
                    <p>Learn Hebrew, Greek, and Aramaic to deepen your understanding of original texts.</p>
                    <p style="color: #3b82f6"><b>Coming Soon...</b></p>
                </div>
                
                <div class="feature-card" onclick="shabbat()">
                    <div class="feature-icon">🕯️</div>
                    <h3>Weekly Shabbat Portions</h3>
                    <p>Follow the traditional Torah reading cycle with commentary and study guides.</p>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include(__DIR__ . '/../includes/footer.php'); ?>