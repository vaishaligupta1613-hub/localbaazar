import React from 'react';
import localforage from 'localforage';
import { DatabaseBackup, RefreshCw, AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Crash Detected:", error, errorInfo);
  }

  handleExportData = async () => {
    try {
      const keys = await localforage.keys();
      const exportData = {};
      
      for (const key of keys) {
        exportData[key] = await localforage.getItem(key);
      }
      
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "local_bazaar_backup_" + Date.now() + ".json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      alert("Data exported successfully!");
    } catch (err) {
      console.error("Failed to export data", err);
      alert("Failed to export data. Please try again.");
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDF9F6', color: '#3D2B1F', padding: '30px', fontFamily: 'Outfit, sans-serif'
        }}>
          <AlertCircle size={60} color="#D32F2F" style={{ marginBottom: '20px' }} />
          <h1 style={{ fontSize: '2rem', marginBottom: '10px', textAlign: 'center' }}>System Crash Detected</h1>
          <p style={{ textAlign: 'center', marginBottom: '40px', color: '#6D5B4F', maxWidth: '300px' }}>
            Don't worry, your data stays safely on your device. You can export a backup below.
          </p>
          
          <div style={{ display: 'flex', gap: '15px', flexDirection: 'column', width: '100%', maxWidth: '300px' }}>
            <button onClick={handleExportData} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              padding: '18px', backgroundColor: '#3D2B1F', color: '#FFE4E1', border: 'none', borderRadius: '40px',
              fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(61, 43, 31, 0.2)'
            }}>
              <DatabaseBackup size={24} /> Export Backup
            </button>
            
            <button onClick={() => window.location.reload()} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              padding: '15px', backgroundColor: 'white', color: '#3D2B1F', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '40px',
              fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold'
            }}>
              <RefreshCw size={20} /> Restart App
            </button>
          </div>
          
          <div style={{ marginTop: '50px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '12px', width: '100%', maxWidth: '350px', overflow: 'auto' }}>
            <pre style={{ fontSize: '0.75rem', color: '#D32F2F', whiteSpace: 'pre-wrap' }}>
              {this.state.error?.toString()}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
