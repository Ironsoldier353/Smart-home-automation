import { Provider } from 'react-redux';
import store from './redux/store'; 
import AppRouter from './routes/Router'; 

const App = () => {
  return (
    <Provider store={store}> 
      <AppRouter /> 
    </Provider>
  );
};

export default App;
