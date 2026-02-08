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
    const logs = [
        "Retrieving sector 7G... [OK]",
        "Indexing childhood memories... [COMPLETED]",
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
        "Holographic recall initiated."
    ];

    setInterval(() => {
        const randomLog = logs[Math.floor(Math.random() * logs.length)];
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `> ${randomLog}`;

        logContainer.appendChild(entry);

        // Auto-scroll
        logContainer.scrollTop = logContainer.scrollHeight;

        // Use Gatekeeper's sound if available? Or just visual.
    }, 1500);
}

function initStats() {
    // Simulate fluctuating stats
    setInterval(() => {
        const nodes = document.querySelectorAll('.value.warning');
        if (nodes.length > 0) {
            const current = parseInt(nodes[0].innerText.replace(/,/g, ''));
            const newVal = current + Math.floor(Math.random() * 10) - 2;
            nodes[0].innerText = newVal.toLocaleString();
        }
    }, 3000);
}
