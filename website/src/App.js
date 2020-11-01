import './App.css';
import React, {useState} from 'react'
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import Sketch from "react-p5";
import {Button, Card, Col, Container, Form, FormControl, Navbar, NavDropdown, Row} from 'react-bootstrap';
import _ from 'lodash';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import {useExpanded, useTable} from 'react-table'

// https://www.youtube.com/watch?v=JvS2triCgOY
// https://www.youtube.com/watch?v=P8hT5nDai6A
// https://github.com/CodingTrain/website/blob/main/Courses/intelligence_learning/session4/toy-neural-network-js/examples/xor/sketch.js

function _reverse(arr) {
    const copy = arr.slice();
    copy.reverse();
    return copy;
}

const DefaultNavbar = (props) => {
    return <Router>
        <Container fluid>
            <Row>
                <Col md={12}>
                    <Navbar bg="light" expand="lg">
                        <Navbar.Brand as={Link} to="/">icodestats.org</Navbar.Brand>

                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>

                        <NavDropdown title="stats" id="basic-nav-dropdown" className="mr-auto">
                            <NavDropdown.Item as={Link} to="/sum">sum</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/mean">mean</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/standard-deviation">standard deviation</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/correlation">correlation</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/linear-regression">linear regression</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/gradient-descent">gradient descent</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            <NavDropdown.Item as={Link} to="/foo">Separated link</NavDropdown.Item>
                        </NavDropdown>

                        <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2"/>
                            <Button variant="outline-success">Search</Button>
                        </Form>
                    </Navbar>
                </Col>
            </Row>

            {props.children}
        </Container>
    </Router>
}

const FunctionOutput = ({data}) => {
    if (Array.isArray(data)) {
        const cols = [
            {
                accessor: 'id',
            }
        ];

        for(let key in data[data.length - 1]) {
            cols.push({
                Header: key,
                accessor: key,
                Cell: ({value}) => <div title={value}>{value === undefined ? '' : value.toFixed(4)}</div>
            })
        }

        const rows = data.map((item, i) => {
            return {id: i, ...item}
        })

        return rows.length ? <DataTable
            rowData={rows}
            columnData={cols}
        /> : null
    } else {
        const {m, b} = data;

        return <div>m: {m.toFixed(4)}, b: {b.toFixed(4)}</div>
    }
}

const DataTable = ({rowData, columnData, ...otherProps}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        visibleColumns,
        state: {expanded},
    } = useTable(
        {
            columns: columnData,
            data: rowData
        },
        useExpanded
    );

    return <table {...getTableProps()} className="border border-dark mt-2 mb-2 flex-fill" {...otherProps}>
        <thead>
        {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                    <th
                        {...column.getHeaderProps()}
                        className="text-center text-light p-1 border border-dark bg-secondary"
                        style={{fontSize: 14}}
                    >
                        {column.render('Header')}
                    </th>
                ))}
            </tr>
        ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {rows.map(row => {
            prepareRow(row);

            return <React.Fragment key={row.id}>
                <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                        return <td
                            {...cell.getCellProps()}
                            className="pl-1 pr-1 pt-0 pb-0"
                            style={{fontSize: 14, borderRight: '1px solid lightgrey', borderBottom: '1px solid lightgrey'}}
                        >
                            {cell.render('Cell')}
                        </td>
                    })}
                </tr>

                {row.isExpanded ? <tr>
                    <td colSpan={visibleColumns.length}>{row.original.subcomponent()}</td>
                </tr> : null}
            </React.Fragment>
        })}
        </tbody>
    </table>
};

const Doodle = ({functionName}) => {
    const [data, setData] = useState([]);
    const [functionText, setFunctionText] = useState(global[functionName].toString());
    const [functionError, setFunctionError] = useState(undefined);
    const [functionOutput, setFunctionOutput] = useState({});

    const width = 400;
    const height = 400;

    let result;
    eval(`${functionText};\nresult = ${functionName}(data)`);

    if (!_.isEqual(functionOutput, result)) {
        setFunctionOutput(result);
        setFunctionError(undefined);
    }

    function drawDataPoints(p5) {
        for (let i = 0; i < data.length; i++) {
            const x = p5.map(data[i].x, 0, 1, 0, width);
            const y = p5.map(data[i].y, 0, 1, height, 0);
            p5.fill("#87ff5f");
            p5.stroke("#87ff5f");
            p5.ellipse(x, y, 8, 8);
        }
    }

    const draw = (p5) => {

        function drawLine(m, b) {
            p5.background(51);
            drawDataPoints(p5);

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

        if (data.length > 1) {
            try {
                if (Array.isArray(result)) {
                    const item = result.shift();
                    if (item)
                        drawLine(item.m, item.b);
                } else {
                    if (result.m !== undefined && result.b !== undefined) {
                        drawLine(result.m, result.b);
                    } else if (result.x !== undefined && result.y !== undefined) {
                        drawLine(result.x, result.b);
                    }
                }
            } catch (e) {
                if (!_.isEqual(e.stack, functionError.stack))
                    setFunctionError(e);
                // console.error(`cannot draw`, e.message);
            }
        } else {
            p5.background(51);
            drawDataPoints(p5);
        }
    };

    return <Row className="pt-2">
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

        <Col md={3}>
            <Card className="mb-2">
                <Card.Body>
                    input data:

                    <div className="bg-light">
                        {
                            data.map(({x, y}, i) => {
                                return <div className="small" key={i} style={{fontVariant: 'tabular-nums'}}>{i}:
                                    x = <span title={x}>{x.toFixed(2)}</span> y = <span title={y}>{y.toFixed(2)}</span>
                                </div>
                            })
                        }
                    </div>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <div>function output:</div>
                    <div className="bg-light">
                        <FunctionOutput data={functionOutput}/>
                    </div>
                </Card.Body>
            </Card>
        </Col>

        <Col md={5}>
            <Card>
                <Card.Body>
                    code:

                    <AceEditor
                        placeholder="Placeholder Text"
                        mode="javascript"
                        theme="monokai"
                        name="blah2"
                        fontSize={14}
                        width={"auto"}
                        height={800}
                        showPrintMargin={true}
                        showGutter={true}
                        highlightActiveLine={true}
                        value={functionText}
                        onChange={(event) => {
                            if (functionText !== event.target.value)
                                setFunctionText(event.target.value)
                        }}
                        setOptions={{
                            enableBasicAutocompletion: false,
                            enableLiveAutocompletion: false,
                            enableSnippets: false,
                            showLineNumbers: true,
                            tabSize: 2,
                        }}/>
                </Card.Body>

                {
                    functionError && <div className="p2 mt-2 border border-danger">
                        <pre>{functionError.stack}</pre>
                    </div>
                }
            </Card>
        </Col>
    </Row>
};

function App() {
    return <DefaultNavbar>

        <Switch>

            <Route exact path="/mean">
                <Row className="mb-2">
                    <Col>
                        <h4>mean</h4>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col>
                        <Doodle key='mean' functionName="mean"/>
                    </Col>
                </Row>
            </Route>

            <Route exact path="/gradient-descent">
                <Row className="mb-2">
                    <Col>
                        <h4>gradient descent</h4>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col>
                        <Doodle key='gradientDescent' functionName="gradientDescent"/>
                    </Col>
                </Row>
            </Route>

            <Route exact path="/linear-regression">
                <Row className="mb-2">
                    <Col>
                        <h4>linear regression</h4>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col>
                        <Doodle key='linearRegression' functionName="linearRegression"/>
                    </Col>
                </Row>
            </Route>

            <Route exact path="/*">
                <Row className="mb-2">
                    <Col>
                        todo
                    </Col>
                </Row>
            </Route>
        </Switch>

    </DefaultNavbar>
}

export default App;
