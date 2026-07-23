document.addEventListener('DOMContentLoaded', () => {
    // Nested Environment Canada Region Mapping by Province
    const PROVINCE_MAP = {
        'AB': { 
            name: { en: 'Alberta', fr: 'Alberta' }, 
            cities: { 
                'calgary': {name: 'Calgary', rssCode: 'ab-52', frequency: '162.400 MHz', sameCode: '048060'}, 
                'edmonton': {name: 'Edmonton', rssCode: 'ab-50', frequency: '162.400 MHz', sameCode: '048110'},
                'fort-mcmurray': {name: 'Fort McMurray', rssCode: 'ab-21', frequency: '162.400 MHz', sameCode: '048160'}
            } 
        },
        'BC': { 
            name: { en: 'British Columbia', fr: 'Colombie-Britannique' }, 
            cities: { 
                'vancouver': {name: 'Vancouver', rssCode: 'bc-74', frequency: '162.400 MHz', sameCode: '059015'}, 
                'victoria': {name: 'Victoria', rssCode: 'bc-85', frequency: '162.400 MHz', sameCode: '059017'},
                'kelowna': {name: 'Kelowna', rssCode: 'bc-48', frequency: '162.550 MHz', sameCode: '059035'}
            } 
        },
        'MB': { 
            name: { en: 'Manitoba', fr: 'Manitoba' }, 
            cities: { 
                'winnipeg': {name: 'Winnipeg', rssCode: 'mb-38', frequency: '162.550 MHz', sameCode: '046110'},
                'brandon': {name: 'Brandon', rssCode: 'mb-11', frequency: '162.400 MHz', sameCode: '046070'}
            } 
        },
        'NB': { 
            name: { en: 'New Brunswick', fr: 'Nouveau-Brunswick' }, 
            cities: { 
                'fredericton': {name: 'Fredericton', rssCode: 'nb-29', frequency: '162.400 MHz', sameCode: '013030'}, 
                'moncton': {name: 'Moncton', rssCode: 'nb-36', frequency: '162.400 MHz', sameCode: '013040'} 
            } 
        },
        'NL': { 
            name: { en: 'Newfoundland and Labrador', fr: 'Terre-Neuve-et-Labrador' }, 
            cities: { 
                'st-johns': {name: "St. John's", rssCode: 'nd-46', frequency: '162.400 MHz', sameCode: '010010'},
                'corner-brook': {name: 'Corner Brook', rssCode: 'nd-20', frequency: '162.550 MHz', sameCode: '010040'}
            } 
        },
        'NS': { 
            name: { en: 'Nova Scotia', fr: 'Nouvelle-Écosse' }, 
            cities: { 
                'halifax': {name: 'Halifax', rssCode: 'ns-19', frequency: '162.550 MHz', sameCode: '012040'},
                'sydney': {name: 'Sydney', rssCode: 'ns-42', frequency: '162.400 MHz', sameCode: '012060'}
            } 
        },
        'NT': { 
            name: { en: 'Northwest Territories', fr: 'Territoires du Nord-Ouest' }, 
            cities: { 
                'yellowknife': {name: 'Yellowknife', rssCode: 'nt-24', frequency: '162.400 MHz', sameCode: '061010'} 
            } 
        },
        'NU': { 
            name: { en: 'Nunavut', fr: 'Nunavut' }, 
            cities: { 
                'iqaluit': {name: 'Iqaluit', rssCode: 'nu-21', frequency: '162.400 MHz', sameCode: '062010'} 
            } 
        },
        'ON': { 
            name: { en: 'Ontario', fr: 'Ontario' }, 
            cities: {
                'toronto': {name: 'Toronto', rssCode: 'on-143', frequency: '162.400 MHz', sameCode: '035300'},
                'ottawa': {name: 'Ottawa', rssCode: 'on-118', frequency: '162.400 MHz', sameCode: '035500'},
                'sault-ste-marie': { name: 'Sault Ste. Marie', rssCode: 'on-5', frequency: '162.550 MHz', sameCode: '035570' },
                'sudbury': { name: 'Sudbury', rssCode: 'on-40', frequency: '162.400 MHz', sameCode: '035530' },
                'thunder-bay': { name: 'Thunder Bay', rssCode: 'on-62', frequency: '162.550 MHz', sameCode: '035580' },
                'timmins': { name: 'Timmins', rssCode: 'on-121', frequency: '162.475 MHz', sameCode: '035560' },
                'north-bay': { name: 'North Bay', rssCode: 'on-107', frequency: '162.400 MHz', sameCode: '035480' },
                'kenora': { name: 'Kenora', rssCode: 'on-160', frequency: '162.400 MHz', sameCode: '035600' }
            } 
        },
        'PE': { 
            name: { en: 'Prince Edward Island', fr: 'Île-du-Prince-Édouard' }, 
            cities: { 
                'charlottetown': {name: 'Charlottetown', rssCode: 'pe-5', frequency: '162.550 MHz', sameCode: '011020'} 
            } 
        },
        'QC': { 
            name: { en: 'Quebec', fr: 'Québec' }, 
            cities: { 
                'montreal': {name: 'Montreal', rssCode: 'qc-147', frequency: '162.550 MHz', sameCode: '024060'}, 
                'quebec-city': {name: 'Quebec City', rssCode: 'qc-133', frequency: '162.400 MHz', sameCode: '024020'},
                'gatineau': {name: 'Gatineau', rssCode: 'qc-67', frequency: '162.550 MHz', sameCode: '024080'}
            } 
        },
        'SK': { 
            name: { en: 'Saskatchewan', fr: 'Saskatchewan' }, 
            cities: { 
                'regina': {name: 'Regina', rssCode: 'sk-32', frequency: '162.400 MHz', sameCode: '047060'}, 
                'saskatoon': {name: 'Saskatoon', rssCode: 'sk-40', frequency: '162.400 MHz', sameCode: '047110'} 
            } 
        },
        'YT': { 
            name: { en: 'Yukon', fr: 'Yukon' }, 
            cities: { 
                'whitehorse': {name: 'Whitehorse', rssCode: 'yt-16', frequency: '162.400 MHz', sameCode: '060010'} 
            } 
        }
    };

    // Dictionary for Bilingual UI
    const TRANSLATIONS = {
        en: {
            title: "Weatheradio Canada",
            subtitle: "National Edition",
            advisories: "Advisories",
            watches: "Watches",
            warnings: "Warnings",
            province: "Province/Territory:",
            region: "Broadcast City:",
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
            subtitle: "Édition Nationale",
            advisories: "Bulletins",
            watches: "Veilles",
            warnings: "Avertissements",
            province: "Province/Territoire :",
            region: "Ville de diffusion :",
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
    const provinceSelect = document.getElementById('province-selector');
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

    // --- Dynamic Dropdown Population ---
    function populateProvinces() {
        provinceSelect.innerHTML = '';
        for (const [code, data] of Object.entries(PROVINCE_MAP)) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = data.name[currentLang];
            // Default to Ontario since that's the origin of the project
            if (code === 'ON') option.selected = true; 
            provinceSelect.appendChild(option);
        }
        populateCities(provinceSelect.value);
    }

    function populateCities(provinceCode) {
        regionSelect.innerHTML = '';
        const cities = PROVINCE_MAP[provinceCode].cities;
        for (const [cityKey, cityData] of Object.entries(cities)) {
            const option = document.createElement('option');
            option.value = cityKey;
            option.textContent = cityData.name;
            regionSelect.appendChild(option);
        }
    }

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
        staticGainNode.gain.setValueAtTime(0.012, audioCtx.currentTime);

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

    // Generate 1053 Hz Sine Wave Tone Burst
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
        document.getElementById('ui-label-province').textContent = t.province;
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

        // Refresh dropdown text for Provinces
        const currentProv = provinceSelect.value;
        const currentCity = regionSelect.value;
        populateProvinces();
        provinceSelect.value = currentProv;
        regionSelect.value = currentCity;

        if (!isPoweredOn) {
            transcriptText.textContent = t.standbyText;
            lcdMarquee.textContent = t.standbyMarquee;
        } else {
            loadRegionData(provinceSelect.value, regionSelect.value);
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

    // Speech Synthesis
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
    async function loadRegionData(provinceKey, cityKey) {
        const province = PROVINCE_MAP[provinceKey];
        if (!province) return;
        const region = province.cities[cityKey];
        if (!region) return;

        clearLeds();
        dataFrequency.textContent = region.frequency;
        dataSameHeader.textContent = region.sameCode;

        // Environment Canada RSS feeds have been retired (404). 
        // We now use wttr.in JSON API to get reliable weather data.
        const langParam = currentLang === 'fr' ? 'fr' : 'en';
        const targetUrl = `https://wttr.in/${encodeURIComponent(region.name)}?format=j1&lang=${langParam}`;
        const apiUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
        const startTime = performance.now();

        try {
            const response = await fetch(apiUrl);
            dataApiPing.textContent = `${Math.round(performance.now() - startTime)} ms`;

            if (!response.ok) throw new Error('Network error');

            const data = await response.json();
            
            const currentCondData = data.current_condition && data.current_condition[0];
            if (!currentCondData) throw new Error('Invalid data format');

            const temp = currentCondData.temp_C;
            
            let conditionText = currentCondData.weatherDesc[0].value;
            if (currentLang === 'fr' && currentCondData.lang_fr && currentCondData.lang_fr.length > 0) {
                conditionText = currentCondData.lang_fr[0].value;
            }
            
            let currentConditions = `${conditionText}, ${temp} degrees Celsius`;

            // Forecast
            let shortForecasts = [];
            const todayWeather = data.weather && data.weather[0];
            if (todayWeather && todayWeather.hourly && todayWeather.hourly.length > 0) {
                const hourly = todayWeather.hourly[0];
                let forecastDesc = hourly.weatherDesc[0].value;
                if (currentLang === 'fr' && hourly.lang_fr && hourly.lang_fr.length > 0) {
                    forecastDesc = hourly.lang_fr[0].value;
                }
                const maxTemp = todayWeather.maxtempC;
                const minTemp = todayWeather.mintempC;
                
                if (currentLang === 'en') {
                    shortForecasts.push(`${forecastDesc} with a high of ${maxTemp} and a low of ${minTemp} degrees`);
                } else {
                    shortForecasts.push(`${forecastDesc} avec un maximum de ${maxTemp} et un minimum de ${minTemp} degrés`);
                }
            }

            let warningDetected = false;
            let watchDetected = false;
            let advisoryDetected = false;

            const marqueeText = `${region.name.toUpperCase()} | ${currentConditions.toUpperCase()} | FORECAST: ${shortForecasts.join('. ').toUpperCase()}`;
            lcdMarquee.textContent = marqueeText;

            if (currentLang === 'en') {
                currentSpeechText = `This is Weatheradio Canada, station ${region.name}. Current conditions: ${currentConditions}. `;
                currentSpeechText += `Forecast: ${shortForecasts.join('. ')}.`;
            } else {
                currentSpeechText = `Ici Météofil Canada, station ${region.name}. Conditions actuelles : ${currentConditions}. `;
                currentSpeechText += `Prévisions : ${shortForecasts.join('. ')}.`;
            }

            if (isPoweredOn) {
                speakBroadcast(currentSpeechText, warningDetected);
            }

        } catch (err) {
            console.error(err);
            dataApiPing.textContent = 'ERR';
            lcdMarquee.textContent = 'SIGNAL ERROR - UNABLE TO FETCH DATA';
        }
    }

    // Control Handlers
    provinceSelect.addEventListener('change', (e) => {
        populateCities(e.target.value);
        if (isPoweredOn) loadRegionData(provinceSelect.value, regionSelect.value);
    });

    regionSelect.addEventListener('change', () => {
        if (isPoweredOn) loadRegionData(provinceSelect.value, regionSelect.value);
    });

    btnPower.addEventListener('click', () => {
        initAudioContext();
        isPoweredOn = true;
        startVhfStatic();
        loadRegionData(provinceSelect.value, regionSelect.value);
    });

    btnStop.addEventListener('click', () => {
        isPoweredOn = false;
        stopVhfStatic();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        lcdMarquee.textContent = TRANSLATIONS[currentLang].standbyMarquee;
        transcriptText.textContent = TRANSLATIONS[currentLang].standbyText;
        transcriptStatus.textContent = 'STANDBY';
    });

    // Initialize Dropdowns
    populateProvinces();

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => console.log('SW reg failed:', err));
    }
});