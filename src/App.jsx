import { useState, useEffect } from "react";
import {
  Button,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
  Authenticator,
  Text,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient({
  authMode: "userPool",
});

// 1. Define the components object to inject the footer into the Authenticator
const components = {
  Footer() {
    return (
      <View textAlign="center" padding="1rem">
        <Text color="gray" fontSize="0.8rem">
          Edited by Jacob Gewin
        </Text>
      </View>
    );
  },
};

export default function App() {
  const [userprofiles, setUserProfiles] = useState([]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  async function fetchUserProfile() {
    try {
      const { data: profiles } = await client.models.UserProfile.list();
      setUserProfiles(profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  }

  return (
    <Flex direction="column" minHeight="100vh">
      {/* 2. Pass the components prop here */}
      <Authenticator components={components}>
        {({ signOut, user }) => (
          <View flex="1">
            <Flex
              className="App"
              justifyContent="center"
              alignItems="center"
              direction="column"
              width="70%"
              margin="0 auto"
              padding="2rem"
            >
              <Heading level={1}>My Profile</Heading>
              <Divider />

              <Grid
                margin="3rem 0"
                autoFlow="column"
                justifyContent="center"
                gap="2rem"
                alignContent="center"
              >
                {userprofiles.map((userprofile) => (
                  <Flex
                    key={userprofile.id || userprofile.email}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    gap="2rem"
                    border="1px solid #ccc"
                    padding="2rem"
                    borderRadius="5%"
                  >
                    <Heading level="3">{userprofile.email}</Heading>
                  </Flex>
                ))}
              </Grid>

              <Button onClick={signOut}>Sign Out</Button>
              
              {/* 3. This shows the text after you sign in */}
              <Text marginTop="2rem" color="gray" fontSize="0.8rem">
                Edited by Jacob Gewin
              </Text>
            </Flex>
          </View>
        )}
      </Authenticator>
    </Flex>
  );
}
