import ImageResizer from './components/tools/ImageResizer';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <ImageResizer onClose={() => { window.location.href = '/'; }} />
    </div>
  );
}

export default App;
