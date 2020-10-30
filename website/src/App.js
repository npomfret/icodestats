import './App.css';
import Sketch from "react-p5";
import {Card, Col, Container, Form, FormGroup, InputGroup, Navbar, Row} from 'react-bootstrap';
import React, {useState} from 'react'

// https://www.youtube.com/watch?v=JvS2triCgOY
// https://www.youtube.com/watch?v=P8hT5nDai6A
// https://github.com/CodingTrain/website/blob/main/Courses/intelligence_learning/session4/toy-neural-network-js/examples/xor/sketch.js

function linearRegression(data) {
    let xSum = 0;
    let ySum = 0;

    for (let {x, y} of data) {
        xSum += x;
        ySum += y;
    }

    const sampleSize = data.length;
    const xMean = xSum / sampleSize;
    const yMean = ySum / sampleSize;

    let num = 0;
    let den = 0;

    for (let {x, y} of data) {
        num += (x - xMean) * (y - yMean);
        den += (x - xMean) * (x - xMean);
    }

    const m = num / den;
    const b = yMean - m * xMean;

    return {m, b}
}

const Doodle = () => {
    const [data, setData] = useState([
    ]);

    const width = 500;
    const height = 500;

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
            const {m, b} = linearRegression(data);
            drawLine(m, b);
        }
    };

    return <Row>
        <Col>
            <span>click to add data points</span>
            <Sketch
                setup={(p5, canvasParentRef) => {
                    p5.createCanvas(width, height).parent(canvasParentRef);
                }}

                mousePressed={p5 => {
                    const x = p5.map(p5.mouseX, 0, width, 0, 1);
                    if(x < 0 || x > 1)
                        return;

                    const y = p5.map(p5.mouseY, 0, height, 1, 0);
                    if(y < 0 || y > 1)
                        return;

                    const point = p5.createVector(x, y);
                    data.push(point);

                    setData(data.slice())
                }}

                draw={draw}
            />
        </Col>

        <Col>
            <pre>
                {JSON.stringify(data.map(point => {
                    return {x: point.x, y: point.y}
                }), null, 2)}
            </pre>
        </Col>

        <Col>
            <Card>
                <Card.Body>
                    <Form>
                        <FormGroup>
                            <Form.Label>
                                code
                            </Form.Label>
                            <InputGroup>
                                <Form.Control as="textarea" rows="3" name="address" onChange={() => console.log('s')}/>
                            </InputGroup>
                        </FormGroup>
                    </Form>
                </Card.Body>
            </Card>
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
