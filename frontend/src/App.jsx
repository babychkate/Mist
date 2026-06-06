import AppRouter from './router/AppRouter';
import AuthInitializer from './components/AuthInitializer';

function App() {
  return (
    <AuthInitializer>
      <AppRouter />
    </AuthInitializer>
  );
}

export default App;