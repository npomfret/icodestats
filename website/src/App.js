import './App.css';
import Sketch from "react-p5";
import {Card, Col, Container, Form, FormGroup, InputGroup, Navbar, Row} from 'react-bootstrap';
import React, {useState} from 'react'

// https://www.youtube.com/watch?v=JvS2triCgOY
// https://www.youtube.com/watch?v=P8hT5nDai6A
// https://github.com/CodingTrain/website/blob/main/Courses/intelligence_learning/session4/toy-neural-network-js/examples/xor/sketch.js

const Doodle = () => {
    const [data, setData] = useState([
        // {x: 1, y: 3},
        // {x: 2, y: 5},
        // {x: 3, y: 7},
        // {x: 4, y: 9},
    ]);

    const width = 500;
    const height = 500;

    let m = 1;
    let b = 0;

    const draw = (p5) => {

        function linearRegression() {
            let xsum = 0;
            let ysum = 0;
            for (let i = 0; i < data.length; i++) {
                xsum += data[i].x;
                ysum += data[i].y;
            }

            const xmean = xsum / data.length;
            const ymean = ysum / data.length;

            let num = 0;
            let den = 0;
            for (let i = 0; i < data.length; i++) {
                const x = data[i].x;
                const y = data[i].y;
                num += (x - xmean) * (y - ymean);
                den += (x - xmean) * (x - xmean);
            }

            m = num / den;
            b = ymean - m * xmean;
        }

        function drawLine() {
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
            p5.fill(255);
            p5.stroke(255);
            p5.ellipse(x, y, 8, 8);
        }

        if (data.length > 1) {
            linearRegression();
            drawLine();
        }
    };

    return <div>
        <Sketch
            setup={(p5, canvasParentRef) => {
                p5.createCanvas(width, height).parent(canvasParentRef);
            }}
            mousePressed={p5 => {
                const x = p5.map(p5.mouseX, 0, width, 0, 1);
                const y = p5.map(p5.mouseY, 0, height, 1, 0);
                const point = p5.createVector(x, y);
                data.push(point);
                setData(data.slice())
            }}
            draw={draw}
        />
        <pre>
            {JSON.stringify(data.map(point => {
                return {x: point.x, y: point.y}
            }), null, 2)}
        </pre>
    </div>
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
                                    <Form.Control as="textarea" rows="3" name="address" onChange={() => console.log('s')}/>
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
