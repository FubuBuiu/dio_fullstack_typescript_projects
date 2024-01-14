import { Grid, GridItem } from "@chakra-ui/react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Grid templateAreas={`"header"
      "main"
      "footer"`}
            gridTemplateRows={`60px calc(100vh - 80px - 60px) 80px`}
        >
            <GridItem>
                <Header />
            </GridItem>
            <GridItem bg={'#15161B'} overflow={'hidden'}>
                {children}
            </GridItem>
            <GridItem>
                <Footer />
            </GridItem>
        </Grid>
    );
}