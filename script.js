const tabs = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab');
const toast = document.getElementById('toast');
const overlay = document.getElementById('scanner-overlay');
let latestReport = '';

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    tabPanels.forEach(panel => {
      panel.classList.remove('active');
      if (panel.id === tab.dataset.tab) panel.classList.add('active');
    });
  });
});

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function runScan(type) {
  const output = document.getElementById(`${type}-output`);
  const progress = document.getElementById(`progress-bar-${type}`);

  output.innerHTML = "🔄 Scanning, please wait...";
  progress.style.width = '0%';
  overlay.style.display = 'flex';

  let progressVal = 0;
  const interval = setInterval(() => {
    progressVal += Math.random() * 12;
    if (progressVal >= 100) {
      progressVal = 100;
      clearInterval(interval);
    }
    progress.style.width = `${progressVal.toFixed(1)}%`;
  }, 200);

  setTimeout(() => {
    const data = mockScan(type);
    latestReport = data;
    output.innerHTML = data;
    progress.style.width = '100%';
    overlay.style.display = 'none';
    showToast(`${type === 'system' ? 'System' : 'Network'} scan complete`);
  }, 2000);
}

function refresh(type) {
  document.getElementById(`${type}-output`).textContent = "Ready to scan.";
  document.getElementById(`progress-bar-${type}`).style.width = '0%';
  showToast("Cleared.");
}

function mockScan(type) {
  const system = [
    "⚠️ KB5023696 missing",
    "🚫 AMSI provider not registered",
    "⚠️ RDP port open (3389)",
    "⚠️ DotNet outdated (v4.6)"
  ];
  const network = [
    "🛰️ Port 445 open (SMB)",
    "🧿 Unknown device: 192.168.1.45",
    "🌐 Suspicious DNS: malware-x.cc",
    "🛑 RDP session from 103.89.34.1"
  ];
  const result = type === 'system' ? system : network;
  return `${type === 'system' ? '🧠 System Scan' : '🌐 Network Scan'} Results:\n\n- ${result.join('\n- ')}`;
}

function generateReport() {
  if (!latestReport) return showToast("No scan data to export");

  const blob = new Blob([latestReport], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Scan_Report_${Date.now()}.txt`;
  link.click();
  showToast("Report downloaded");
}
