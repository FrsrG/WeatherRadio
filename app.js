document.addEventListener('DOMContentLoaded', () => {
    // Environment Canada Region Mapping
    const REGION_MAP = {
        'sault-ste-marie': { name: 'Sault Ste. Marie', rssCode: 'on-5', frequency: '162.550 MHz', sameCode: '035570 (Algoma)' },
        'sudbury': { name: 'Sudbury', rssCode: 'on-40', frequency: '162.400 MHz', sameCode: '035530 (Sudbury)' },
        'thunder-bay': { name: 'Thunder Bay', rssCode: 'on-62', frequency: '162.550 MHz', sameCode: '035580 (Thunder Bay)' },
        'timmins': { name: 'Timmins', rssCode: 'on-121', frequency: '162.475 MHz', sameCode: '035560 (Cochrane)' },
        'north-bay': { name: 'North Bay', rssCode: 'on-107', frequency: '162.400 MHz', sameCode: '035480 (Nipissing)' },
        'kenora': { name: 'Kenora', rssCode: 'on-160', frequency: '162.400 MHz', sameCode: '035600 (Kenora)' }
    };

    // Dictionary for Bilingual UI
    const TRANSLATIONS = {
        en: {
            title: "Weatheradio Canada",
            subtitle: "Northern Ontario Edition",
            advisories: "Advisories",
            watches: "Watches",
            warnings: "Warnings",
            region: "Broadcast Region:",
            powerOn: "Listen Live / Power On",
            muteStop: "Mute / Stop",
            volume: "Volume",
            diagnostics: "System Diagnostics",
            freq: "Frequency:",
            same: "SAME Header Decode:",
            tts: "TTS Voice Engine:",
            ping: "API Ping:",
            transcriptHdr: "Live Broadcast Transcript",
            standbyText: "[SYSTEM READY. CLICK POWER TO BEGIN BROADCAST]",
            standbyMarquee: "STANDBY - AWAITING USER ACTIVATION..."
        },
        fr: {
            title: "Météofil Canada",
            subtitle: "Édition du Nord de l'Ontario",
            advisories: "Bulletins",
            watches: "Veilles",
            warnings: "Avertissements",
            region: "Région de diffusion :",
            powerOn: "Écouter en direct / Marche",
            muteStop: "Muet / Arrêt",
            volume: "Volume",
            diagnostics: "Diagnostics du système",
            freq: "Fréquence :",
            same: "Décodage SAME :",
            tts: "Moteur vocal TTS :",
            ping: "Ping API :",
            transcriptHdr: "Transcription en direct",
            standbyText: "[SYSTÈME PRÊT. CLIQUEZ SUR MARCHE POUR DÉMARRER]",
            standbyMarquee: "EN ATTENTE - ACTIVATION PAR L'UTILISATEUR REQUISE..."
        }
    };

    // DOM Elements
    const btnLangEn = document.getElementById('btn-lang-en');
    const btnLangFr = document.getElementById('btn-lang-fr');
    const regionSelect = document.getElementById('region-selector');
    const btnPower = document.getElementById('btn-power');
    const btnStop = document.getElementById('btn-stop');
    const volumeSlider = document.getElementById('volume-slider');
    const lcdMarquee = document.getElementById('lcd-marquee');

    const ledAdvisory = document.getElementById('led-advisory');
    const ledWatch = document.getElementById('led-watch');
    const ledWarning = document.getElementById('led-warning');

    const dataFrequency = document.getElementById('data-frequency');
    const dataSameHeader = document.getElementById('data-same-header');
    const dataTtsEngine = document.getElementById('data-tts-engine');
    const dataApiPing = document.getElementById('data-api-ping');

    const transcriptText = document.getElementById('transcript-text');
    const transcriptStatus = document.getElementById('transcript-status');

    // System State Variables
    let currentLang = 'en';
    let isPoweredOn = false;
    let currentSpeechText = '';

    // Web Audio API Variables
    let audioCtx = null;
    let staticGainNode = null;
    let staticSourceNode = null;

    // --- Web Audio API Setup ---
    function initAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Generate Continuous Low-Volume White Noise VHF Radio Static
    function startVhfStatic() {
        if (!audioCtx) return;
        stopVhfStatic();

        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        staticSourceNode = audioCtx.createBufferSource();
        staticSourceNode.buffer = buffer;
        staticSourceNode.loop = true;

        staticGainNode = audioCtx.createGain();
        staticGainNode.gain.setValueAtTime(0.012, audioCtx.currentTime); // Low volume static

        staticSourceNode.connect(staticGainNode);
        staticGainNode.connect(audioCtx.destination);
        staticSourceNode.start();
    }

    function stopVhfStatic() {
        if (staticSourceNode) {
            try { staticSourceNode.stop(); } catch (e) {}
            staticSourceNode.disconnect();
            staticSourceNode = null;
        }
    }

    // Generate 1053 Hz Sine Wave Tone Burst (3 Seconds)
    function play1053HzAlertTone() {
        return new Promise((resolve) => {
            if (!audioCtx || !isPoweredOn) return resolve();

            const osc = audioCtx.createOscillator();
            const toneGain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(1053, audioCtx.currentTime);

            toneGain.gain.setValueAtTime(0.25, audioCtx.currentTime);

            osc.connect(toneGain);
            toneGain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 3.0);

            osc.onended = () => resolve();
        });
    }

    // --- Language Translation ---
    function setLanguage(lang) {
        currentLang = lang;
        const t = TRANSLATIONS[lang];

        if (lang === 'en') {
            btnLangEn.classList.add('active');
            btnLangFr.classList.remove('active');
        } else {
            btnLangFr.classList.add('active');
            btnLangEn.classList.remove('active');
        }

        document.getElementById('ui-title').textContent = t.title;
        document.getElementById('ui-subtitle').textContent = t.subtitle;
        document.getElementById('ui-label-advisory').textContent = t.advisories;
        document.getElementById('ui-label-watch').textContent = t.watches;
        document.getElementById('ui-label-warning').textContent = t.warnings;
        document.getElementById('ui-label-region').textContent = t.region;
        btnPower.textContent = t.powerOn;
        btnStop.textContent = t.muteStop;
        document.getElementById('ui-label-volume').textContent = t.volume;
        document.getElementById('ui-hdr-diagnostics').textContent = t.diagnostics;
        document.getElementById('ui-lbl-freq').textContent = t.freq;
        document.getElementById('ui-lbl-same').textContent = t.same;
        document.getElementById('ui-lbl-tts').textContent = t.tts;
        document.getElementById('ui-lbl-ping').textContent = t.ping;
        document.getElementById('ui-hdr-transcript').textContent = t.transcriptHdr;

        if (!isPoweredOn) {
            transcriptText.textContent = t.standbyText;
            lcdMarquee.textContent = t.standbyMarquee;
        } else {
            loadRegionData(regionSelect.value);
        }
    }

    btnLangEn.addEventListener('click', () => setLanguage('en'));
    btnLangFr.addEventListener('click', () => setLanguage('fr'));

    function clearLeds() {
        ledAdvisory.classList.remove('amber');
        ledWatch.classList.remove('orange');
        ledWarning.classList.remove('red');
    }

    function getLanguageVoice() {
        const voices = window.speechSynthesis.getVoices();
        const langPrefix = currentLang === 'fr' ? 'fr' : 'en';
        return voices.find(v => v.lang.startsWith(langPrefix + '-CA')) ||
               voices.find(v => v.lang.startsWith(langPrefix)) || null;
    }

    // Speech Synthesis & Live Transcript Generator
    async function speakBroadcast(text, hasWarning) {
        if (!('speechSynthesis' in window) || !isPoweredOn) return;

        window.speechSynthesis.cancel();

        if (hasWarning) {
            transcriptStatus.textContent = 'ALERT TONE';
            await play1053HzAlertTone();
        }

        if (!isPoweredOn) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.volume = parseFloat(volumeSlider.value) / 100;
        utterance.lang = currentLang === 'fr' ? 'fr-CA' : 'en-CA';

        const voice = getLanguageVoice();
        if (voice) {
            utterance.voice = voice;
            dataTtsEngine.textContent = voice.name;
        }

        utterance.onstart = () => {
            transcriptStatus.textContent = 'TRANSMITTING';
            transcriptText.textContent = text;
        };

        utterance.onend = () => {
            transcriptStatus.textContent = 'STANDBY';
        };

        window.speechSynthesis.speak(utterance);
    }

    // --- Fetch CAP / RSS Feed Data ---
    async function loadRegionData(regionKey) {
        const region = REGION_MAP[regionKey];
        if (!region) return;

        clearLeds();
        dataFrequency.textContent = region.frequency;
        dataSameHeader.textContent = region.sameCode;

        const rssUrl = `https://api.allorigins.win/raw?url=https://weather.gc.ca/rss/city/${region.rssCode}_${currentLang === 'fr' ? 'f' : 'e'}.xml`;
        const startTime = performance.now();

        try {
            const response = await fetch(rssUrl);
            dataApiPing.textContent = `${Math.round(performance.now() - startTime)} ms`;

            if (!response.ok) throw new Error('Network error');

            const xmlText = await response.text();
            const xmlDoc = new DOMParser().parseFromString(xmlText, 'text/xml');
            const entries = Array.from(xmlDoc.querySelectorAll('entry'));

            let currentConditions = '';
            let shortForecasts = [];
            let alerts = [];

            let warningDetected = false;
            let watchDetected = false;
            let advisoryDetected = false;

            entries.forEach(entry => {
                const title = entry.querySelector('title')?.textContent.trim() || '';
                const summary = entry.querySelector('summary')?.textContent.replace(/<[^>]*>?/gm, '').trim() || '';
                const text = `${title} ${summary}`.toLowerCase();

                if (text.includes('current conditions') || text.includes('conditions actuelles')) {
                    currentConditions = summary || title;
                } else if (text.includes('warning') || text.includes('avertissement')) {
                    warningDetected = true;
                    alerts.push(title);
                } else if (text.includes('watch') || text.includes('veille')) {
                    watchDetected = true;
                    alerts.push(title);
                } else if (text.includes('advisory') || text.includes('bulletin') || text.includes('avis')) {
                    advisoryDetected = true;
                    alerts.push(title);
                } else if (!text.includes('no short term') && !text.includes('aucun')) {
                    shortForecasts.push(title);
                }
            });

            if (warningDetected) ledWarning.classList.add('red');
            if (watchDetected) ledWatch.classList.add('orange');
            if (advisoryDetected) ledAdvisory.classList.add('amber');

            const marqueeText = `${region.name.toUpperCase()} | ${currentConditions.toUpperCase()} | FORECAST: ${shortForecasts.slice(0, 2).join('. ').toUpperCase()}`;
            lcdMarquee.textContent = marqueeText;

            if (currentLang === 'en') {
                currentSpeechText = `This is Weatheradio Canada, station ${region.name}. Current conditions: ${currentConditions}. `;
                if (alerts.length > 0) currentSpeechText += `Alert in effect: ${alerts.join('. ')}. `;
                currentSpeechText += `Forecast: ${shortForecasts.join('. ')}.`;
            } else {
                currentSpeechText = `Ici Météofil Canada, station ${region.name}. Conditions actuelles : ${currentConditions}. `;
                if (alerts.length > 0) currentSpeechText += `Alerte en vigueur : ${alerts.join('. ')}. `;
                currentSpeechText += `Prévisions : ${shortForecasts.join('. ')}.`;
            }

            if (isPoweredOn) {
                speakBroadcast(currentSpeechText, warningDetected);
            }

        } catch (err) {
            dataApiPing.textContent = 'ERR';
            lcdMarquee.textContent = 'SIGNAL ERROR - UNABLE TO FETCH DATA';
        }
    }

    // Control Handlers
    btnPower.addEventListener('click', () => {
        initAudioContext();
        isPoweredOn = true;
        startVhfStatic();
        loadRegionData(regionSelect.value);
    });

    btnStop.addEventListener('click', () => {
        isPoweredOn = false;
        stopVhfStatic();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        lcdMarquee.textContent = TRANSLATIONS[currentLang].standbyMarquee;
        transcriptText.textContent = TRANSLATIONS[currentLang].standbyText;
        transcriptStatus.textContent = 'STANDBY';
    });

    regionSelect.addEventListener('change', () => {
        if (isPoweredOn) loadRegionData(regionSelect.value);
    });

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => console.log('SW reg failed:', err));
    }
});