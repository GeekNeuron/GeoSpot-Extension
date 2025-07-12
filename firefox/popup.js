document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('contextmenu', event => event.preventDefault());
    
    // --- SVG Icons (for the titles) ---
    const iconDns = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3V7.5a3 3 0 013-3h13.5a3 3 0 013 3v3.75a3 3 0 01-3 3m-13.5 0h13.5m-16.5 2.25h18" /></svg>`;
    const iconWebRtc = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Zm-3.75 0h.008v.015h-.008v-.015Zm5.625 0a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0Zm-3.75 0h.008v.015h-.008v-.015Z" /></svg>`;

    // --- UI Elements ---
    const ipAddressH1 = document.getElementById('ip-address');
    const locationP = document.getElementById('location');
    const dnsIconContainer = document.getElementById('dns-icon'); // Finds id="dns-icon"
    const leakStatusP = document.getElementById('leak-status');
    const dnsDetailsP = document.getElementById('dns-details');
    const webrtcIconContainer = document.getElementById('webrtc-icon'); // Finds id="webrtc-icon"
    const webrtcStatusP = document.getElementById('webrtc-status');
    const webrtcDetailsP = document.getElementById('webrtc-details');
    
    // Set the static title icons once at the beginning
    dnsIconContainer.innerHTML = iconDns;
    webrtcIconContainer.innerHTML = iconWebRtc;

    async function runAllLiveTests() {
        try {
            const ipResponse = await fetch('http://ip-api.com/json/?fields=status,message,query,country,countryCode,city');
            if (!ipResponse.ok) throw new Error(`Network Error: ${ipResponse.status}`);
            const ipData = await ipResponse.json();
            if (ipData.status !== 'success') throw new Error(`API Error: ${ipData.message}`);
            
            const mainIp = ipData.query;
            ipAddressH1.textContent = mainIp;
            locationP.textContent = `${ipData.city || 'Unknown'}, ${ipData.country || 'Unknown'}`;
            
            browser.runtime.sendMessage({ action: "updateIcon", countryCode: ipData.countryCode });

            await Promise.all([
                runDnsLeakTest(ipData.countryCode),
                runWebRtcLeakTest(mainIp)
            ]);

        } catch (error) {
            console.error("Live IP Test Error:", error);
            ipAddressH1.textContent = 'Unavailable';
            locationP.textContent = 'Could not retrieve IP data.';
            leakStatusP.textContent = 'Test Aborted.';
            webrtcStatusP.textContent = 'Test Aborted.';
        }
    }

    async function runDnsLeakTest(vpnCountryCode) {
        leakStatusP.textContent = 'Testing...';
        dnsDetailsP.textContent = '';
        try {
            const response = await fetch('https://ipleak.net/json/');
            const data = await response.json();
            const dnsResults = data.dns_servers || [];
            if (dnsResults.length === 0) { leakStatusP.textContent = 'No Servers'; return; }
            
            const leakingServer = dnsResults.find(server => server.country_code !== vpnCountryCode);
            
            if (leakingServer) {
                leakStatusP.textContent = 'Leaking';
                leakStatusP.className = 'status leaking';
                dnsDetailsP.textContent = `Found: ${leakingServer.as_name || 'Unknown ISP'}`;
            } else {
                leakStatusP.textContent = 'Protected';
                leakStatusP.className = 'status protected';
                dnsDetailsP.textContent = 'Servers match VPN';
            }
        } catch (error) { 
            console.error('DNS Leak Test Error:', error); 
            leakStatusP.textContent = 'Test Failed';
        }
    }

    async function runWebRtcLeakTest(mainIp) {
        webrtcStatusP.textContent = 'Testing...';
        webrtcDetailsP.textContent = '';
        try {
            const peerConnection = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
            const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
            let foundIps = new Set();
            
            peerConnection.onicecandidate = (event) => {
                if (event.candidate && event.candidate.candidate) {
                    const matches = event.candidate.candidate.match(ipRegex);
                    if (matches) { 
                        matches.forEach(ip => {
                            if (ip !== '0.0.0.0' && !ip.startsWith('192.168.') && !ip.startsWith('10.') && !ip.startsWith('172.')) { 
                                foundIps.add(ip); 
                            } 
                        }); 
                    }
                }
            };
            peerConnection.createDataChannel('');
            await peerConnection.createOffer().then(offer => peerConnection.setLocalDescription(offer));
            await new Promise(resolve => setTimeout(resolve, 1000));
            peerConnection.close();

            let isLeaking = false;
            let leakedIp = null;
            for (const ip of foundIps) { if (ip !== mainIp) { isLeaking = true; leakedIp = ip; break; } }
            
            if (isLeaking) {
                webrtcStatusP.textContent = 'Leaking';
                webrtcStatusP.className = 'status leaking';
                webrtcDetailsP.textContent = `Found: ${leakedIp}`;
            } else {
                webrtcStatusP.textContent = 'Protected';
                webrtcStatusP.className = 'status protected';
                if (foundIps.size > 0) { webrtcDetailsP.textContent = `IP matches VPN`; }
            }

        } catch (error) {
            console.error('WebRTC Leak Test Error:', error);
            webrtcStatusP.textContent = 'Test Failed';
        }
    }
    
    runAllLiveTests();
});
