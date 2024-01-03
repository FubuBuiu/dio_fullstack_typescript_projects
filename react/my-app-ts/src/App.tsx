import { Grid, GridItem } from '@chakra-ui/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginCard } from './components/LoginCard';

function App() {
  return (
    <Grid templateAreas={`"header"
      "main"
      "footer"`}
      gridTemplateRows={`60px calc(100vh - 80px - 60px) 80px`}
    >
      <GridItem>
        <Header />
      </GridItem>
      <GridItem>
        <LoginCard></LoginCard>
      </GridItem>
      <GridItem>
        <Footer />
      </GridItem>
    </Grid>
  );
}

export default App;
