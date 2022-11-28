import 'regenerator-runtime/runtime';
import React from 'react';

import './assets/global.css';

import { EducationalText, SignInPrompt, SignOutButton } from './ui-components';
import { Card, ListGroup, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function App({ isSignedIn, contract, wallet }) {
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();

  const [uiPleaseWait, setUiPleaseWait] = React.useState(true);

  const [totalTokens, setTotalTokens] = React.useState(0);

  const [allTokens, setAllTokens] = React.useState([]);

  React.useEffect(() => {
    contract.get_total_tokens()
      .then(setTotalTokens)
      .catch(alert)
      .finally(() => {
        setUiPleaseWait(false)
      });
  });

  React.useEffect(() => {
    contract.get_all_tokens()
      .then(setAllTokens)
      .catch(alert)
      .finally(() => {
        setUiPleaseWait(false)
      });
  }, [allTokens]);

  /// If user not signed-in with wallet - show prompt
  if (!isSignedIn) {
    // Sign-in flow will reload the page later
    return <SignInPrompt greeting={valueFromBlockchain} onClick={() => wallet.signIn()} />;
  }

  function mint_nft(e) {
    e.preventDefault();

    let token_name = document.getElementById("token_name").value;
    let description = document.getElementById("description").value;
    let media_uri = document.getElementById("media_uri").value;
    let level = document.getElementById("level").value;

    contract.mint_nft(token_name, description, media_uri, level);
  }

  return (
    <>
      <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()} />
      <main className={uiPleaseWait ? 'please-wait' : ''}>
        <h1>
          NFT Minting Dapp
        </h1>

        <h2>Number of total NFT tokens minted: {totalTokens}</h2>

        <h2>All Tokens</h2>
        <Row xs={1} md={3}>


          {allTokens.map(function (token, token_id) {

            return (
              <div key={token_id}>
                <Card>
                  <Card.Img src={token.media_uri} />
                  <Card.Header>Owner: {token.owner_id}</Card.Header>
                  <Card.Body>
                    <Card.Title>{token.name}</Card.Title>
                    <Card.Text>
                      <Card.Header>Token ID: {token.token_id}</Card.Header>
                      <ListGroup>
                        <ListGroup.Item>Description: {token.description}</ListGroup.Item>
                        <ListGroup.Item>Level: {token.level}</ListGroup.Item>
                      </ListGroup>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            )
          })}
        </Row>
        <br />

        <h2>Mint New Token</h2>
        <Form>
          <Form.Group>
            <Form.Label>token_name</Form.Label>
            <Form.Control type="text" placeholder="token_name" id="token_name"></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>description</Form.Label>
            <Form.Control type="text" placeholder="description" id="description"></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>media_uri</Form.Label>
            <Form.Control type="text" placeholder="media_uri" id="media_uri"></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>level</Form.Label>
            <Form.Control type="number" placeholder="level" id="level"></Form.Control>
          </Form.Group>
          <Button onClick={mint_nft}>Mint NFT Token</Button>
        </Form>
        
        <br /> <br /> <br /> <br />
      </main>
    </>
  );
}
