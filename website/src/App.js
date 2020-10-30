import './App.css';
import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense
import {Container, Button, Card, Navbar, Row, Col, Form, FormGroup, InputGroup} from 'react-bootstrap';

// https://www.youtube.com/watch?v=JvS2triCgOY
// https://www.youtube.com/watch?v=P8hT5nDai6A
// https://github.com/CodingTrain/website/blob/main/Courses/intelligence_learning/session4/toy-neural-network-js/examples/xor/sketch.js

const Doodle = () => {
    let x = 50;
    const y = 50;

    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(500, 500).parent(canvasParentRef);
    };

    const draw = (p5) => {
        p5.background(0);
        p5.ellipse(x, y, 70, 70);
        x++;
    };

    return <Sketch setup={setup} draw={draw}/>;
};

function App() {
    return <Container fluid="lg" className="p-0">
        <Navbar expand="lg" variant="light" bg="light">
            <Navbar.Brand href="#">Navbar</Navbar.Brand>
        </Navbar>

        <Row>
            <Col><Doodle/></Col>
            <Col>
                <Card>
                    <Card.Body>
                        <Form>
                            <FormGroup>
                                <Form.Label>
                                    Label
                                </Form.Label>
                                <InputGroup>
                                    <Form.Control as="textarea" rows="3" name="address" onChange={() => console.log('s')} />
                                </InputGroup>
                            </FormGroup>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
}

export default App;
