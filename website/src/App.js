import './App.css';
import Sketch from "react-p5";
import {Card, Col, Container, Form, FormGroup, InputGroup, Navbar, Row} from 'react-bootstrap';
import React, {useState} from 'react'

// https://www.youtube.com/watch?v=JvS2triCgOY
// https://www.youtube.com/watch?v=P8hT5nDai6A
// https://github.com/CodingTrain/website/blob/main/Courses/intelligence_learning/session4/toy-neural-network-js/examples/xor/sketch.js

const linearRegression = global.linearRegression.toString();

const Doodle = () => {
    const [data, setData] = useState([]);
    const [functionText, setFunctionText] = useState(linearRegression);
    const [functionError, setFunctionError] = useState(undefined);
    const [functionOutput, setFunctionOutput] = useState({});

    const width = 400;
    const height = 400;

    const draw = (p5) => {

        function drawLine(m, b) {
            let x1 = 0;
            let y1 = m * x1 + b;
            let x2 = 1;
            let y2 = m * x2 + b;

            x1 = p5.map(x1, 0, 1, 0, width);
            y1 = p5.map(y1, 0, 1, height, 0);
            x2 = p5.map(x2, 0, 1, 0, width);
            y2 = p5.map(y2, 0, 1, height, 0);

            p5.stroke(255);
            p5.strokeWeight(2);
            p5.line(x1, y1, x2, y2);
        }

        p5.background(51);

        for (let i = 0; i < data.length; i++) {
            const x = p5.map(data[i].x, 0, 1, 0, width);
            const y = p5.map(data[i].y, 0, 1, height, 0);
            p5.fill("#87ff5f");
            p5.stroke("#87ff5f");
            p5.ellipse(x, y, 8, 8);
        }

        if (data.length > 1) {
            try {
                let result;
                eval(`${functionText};\nresult = linearRegression(data)`);
                setFunctionOutput(result);
                setFunctionError(undefined);

                const {m, b} = result;

                drawLine(m, b);
            } catch (e) {
                if(!functionError || e.stack !== functionError.stack)
                    setFunctionError(e);
                // console.error(`cannot draw`, e.message);
            }
        }
    };

    return <Row>
        <Col md={3}>
            <span>click to add data points</span>
            <Sketch
                setup={(p5, canvasParentRef) => {
                    p5.createCanvas(width, height).parent(canvasParentRef);
                }}

                mousePressed={p5 => {
                    const x = p5.map(p5.mouseX, 0, width, 0, 1);
                    if (x < 0 || x > 1)
                        return;

                    const y = p5.map(p5.mouseY, 0, height, 1, 0);
                    if (y < 0 || y > 1)
                        return;

                    const point = p5.createVector(x, y);
                    data.push(point);

                    setData(data.slice())
                }}

                draw={draw}
            />
        </Col>

        <Col>
            data:
            {
                data.map(({x, y}, i) => {
                    return <div key={i}>{i}:
                        x = <span title={x}>{x.toFixed(2)}</span> y = <span title={y}>{y.toFixed(2)}</span>
                    </div>
                })
            }
        </Col>

        <Col>
            <div>output:</div>
            <pre>{JSON.stringify(functionOutput, null, 2)}</pre>
        </Col>

        <Col md={5}>
            <Form>
                <FormGroup>
                    <Form.Label>
                        code
                    </Form.Label>

                    <InputGroup>
                        <Form.Control
                            as="textarea"
                            rows={functionText.split("\n").length}
                            onChange={(event) => {
                                if(functionText !== event.target.value)
                                    setFunctionText(event.target.value)
                            }}>
                            {functionText}
                        </Form.Control>
                    </InputGroup>

                    {
                        functionError && <div className="p2 mt-2 border border-danger">
                            <pre>{functionError.stack}</pre>
                        </div>
                    }
                </FormGroup>
            </Form>
        </Col>
    </Row>
};

function App() {
    return <Container fluid>
        <Navbar expand="lg" variant="light" bg="light">
            <Navbar.Brand href="#">Navbar</Navbar.Brand>
        </Navbar>

        <Doodle/>

    </Container>
}

export default App;
