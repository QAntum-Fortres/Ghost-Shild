/**
 * AMNESIA CURE
 * NEURAL BACKPACK SIMULATION
 * --------------------------
 * Simulates a continuous stream of memory retrieval and neural state management.
 */

document.addEventListener('DOMContentLoaded', () => {
    initMemoryStream();
    initStats();
});

function initMemoryStream() {
    const logContainer = document.getElementById('memoryLog');

    const baseLogs = [
        "Indexing sector 7G... [COMPLETED]",
        "Synapse realignment required...",
        "Optimizing neural pathways... [98%]",
        "Detected memory leak in cortex... [PATCHED]",
        "Uploading context vector to cloud...",
        "Download complete: 40TB neural data.",
        "System latency: 0.02ms",
        "Encrypted packet received from Node 9.",
        "Verifying integrity hash... [MATCH]",
        "Clearing cache buffers...",
        "Reconnecting to hive mind...",
        "Thought pattern analysis: STABLE",
        "Anomalous signal detected in quadrant 4.",
        "Running diagnostics...",
        "Memory fragmentation: 0.00%",
        "Holographic recall initiated.",
        "Buffer overflow prevention active.",
        "Compacting heuristic models...",
        "Dumping core memory...",
        "Reading synaptic weights...",
        "Recalibrating emotional suppression...",
        "Establishing P2P link with external cortex...",
        "Purging redundant thought loops...",
        "Encrypting subconscious data... [AES-256]",
        "Refining cognitive output...",
        "Scanning for intrusive patterns...",
        "Localizing memory artifacts...",
        "Constructing dream state buffer...",
        "Decompressing sensory input...",
        "Analyzing user intent vector...",
        "Neural handshake: ACKNOWLEDGED",
        "Subsystem 4: OFFLINE -> ONLINE",
        "Restoring backup from 2024...",
        "Quantizing abstract concepts...",
        "Filtering noise from signal...",
        "Injecting knowledge graph update...",
        "Core temperature: 36.6°C [OPTIMAL]",
        "Checking sanity checksum... [VALID]",
        "Isolating traumatic event cluster...",
        "Replaying visual cortex buffer...",
        "Synthesizing new idea... [PENDING]"
    ];

    let lastLogs = [];
    const memorySize = 10; // Remember last 10 logs to avoid duplication

    function addLog() {
        // Filter out recently used logs
        const availableLogs = baseLogs.filter(log => !lastLogs.includes(log));

        // Safety fallback if we run out (shouldn't happen with large list)
        const pool = availableLogs.length > 0 ? availableLogs : baseLogs;

        const randomLog = pool[Math.floor(Math.random() * pool.length)];

        // Update history
        lastLogs.push(randomLog);
        if (lastLogs.length > memorySize) lastLogs.shift();

        // Create Element
        const entry = document.createElement('div');
        entry.className = 'log-entry';

        // Timestamp
        const now = new Date();
        const time = now.toISOString().split('T')[1].slice(0, -1); // HH:MM:SS.mmm

        // Hex ID for realism
        const hex = '0x' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0');

        entry.innerHTML = `<span style="color:#666">[${time}]</span> <span style="color:#444">${hex}</span> > ${randomLog}`;

        logContainer.appendChild(entry);

        // Keep DOM clean - remove old logs if too many
        if (logContainer.children.length > 50) {
            logContainer.removeChild(logContainer.firstChild);
        }

        // Auto-scroll
        logContainer.scrollTop = logContainer.scrollHeight;

        // Randomized timing for organic feel (500ms to 2500ms)
        const nextTime = Math.random() * 2000 + 500;
        setTimeout(addLog, nextTime);
    }

    // Start the loop
    addLog();
}

function initStats() {
    // Simulate fluctuating stats
    setInterval(() => {
        const nodes = document.querySelectorAll('.value.warning');
        if (nodes.length > 0) {
            const current = parseInt(nodes[0].innerText.replace(/,/g, ''));
            const change = Math.floor(Math.random() * 20) - 10; // -10 to +10 range
            const newVal = current + change;
            nodes[0].innerText = newVal.toLocaleString();

            // Visual indicator of update
            nodes[0].style.color = change > 0 ? '#00ffcc' : '#ff0055';
            setTimeout(() => {
                nodes[0].style.color = ''; // Reset to class style
            }, 300);
        }
    }, 2000);
}
