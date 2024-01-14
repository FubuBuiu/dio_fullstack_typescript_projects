import { Layout } from './components/Layout';
import { ChakraBaseProvider } from '@chakra-ui/react';
import { MainRoutes } from './routes';

function App() {
  return (
    <ChakraBaseProvider>
      <Layout>
        <MainRoutes />
      </Layout>
    </ChakraBaseProvider>
  );
}

export default App;
