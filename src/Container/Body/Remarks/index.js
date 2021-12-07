
import React, { useEffect, useRef, useState, useContext } from 'react';
import { Card, Spinner, Modal, Button, Table, Form, InputGroup, FormControl, Col, Row } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import { Fetcher } from "../../Helpers/fetcher.js";
import VirtualContaxt from "../../Helpers/VirtualContaxt";
import WhatsUp from "../../../../src/whatsapp.png";

export default function Remarks(props) {
    const { leads, setLeads } = useContext(VirtualContaxt);
    const [state, setState] = useState({
        leads: {},
        emailSent: false,
        smsSent: false,
        showSmsModel: false,
        showEmailModel: false,
        success: "",
        modalHeading: "Status",
        modalContent: "",
        feedbacks: [
            { id: 1, value: "Highly Interested", isChecked: false },
            { id: 2, value: "Medium Interest", isChecked: false },
            { id: 3, value: "Low Interest", isChecked: false },
            { id: 4, value: "Highly Priced", isChecked: false },
            { id: 5, value: "Call not picked", isChecked: false },
            { id: 6, value: "Call Later", isChecked: false }
        ],
        additionalRemarks: "",
        sub: false,
    });
    useEffect(() => {
        if (!Object.entries(leads).length) {
            const apiPath = props.app.apiPath;
            const userId = props.app.userId;

            Fetcher.get(apiPath + '/app/leads/' + userId)
                .then(res => {
                    setState({ ...state, leads: res });
                    setLeads(res)
                })
                .catch(err => { console.log('Error in fetching Leads', err) });
        } else {
            setState({ ...state, leads });
        }

    }, []);

    const emailTextRef = useRef("");
    const setSmsShow = showSmsModel => { setState({ ...state, showSmsModel }) }
    const setEmailShow = showEmailModel => { setState({ ...state, showEmailModel }) }

    const validate = (email) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

        return expression.test(String(email).toLowerCase())
    }

    const sendEmailFunCall = () => {
        const { value: email } = emailTextRef.current;

        if (validate(email)) {
            var data = { "emailId": email, "userId": props.app.userId }
            setState({ ...state, emailSent: true })
            return Fetcher.post(props.app.apiPath + '/app/sendemail', { headers: { "Content-type": "application/json" }, method: 'POST', body: JSON.stringify(data) })
                .then(res => {
                    setEmailShow(false);
                    setState({ ...state, emailSent: true, showEmailModel: false, success: res ? res.message : "Email sent  successfuly to " + email });
                })
                .catch(err => {
                    setState({
                        ...state,
                        modalHeading: 'Error',
                        modalContent: err.message,
                        emailSent: false
                    })
                });
        } else {
            alert("Please enter valid email address.")
        }
    }

    const handleCheckboxChange = ({ target: { checked, name } }) => {

        let feedbacks = [...state.feedbacks];
        if (checked) {
            feedbacks[name - 1].isChecked = checked;
            setState({ ...state, feedbacks })
        } else {
            feedbacks[name - 1].isChecked = checked;
            setState({ ...state, feedbacks });
        }
    }

    const callDispose = () => {
        let feedbacks = state.feedbacks.filter(feed => feed.isChecked).map((f) => f.id);

        if (!feedbacks.length) {
            alert("Please select a remarks.")
        } else {
            const data = {
                "remarks": feedbacks.toString(),
                "additionalRemarks": state.additionalRemarks || "",
                "leadNo": state.leads && state.leads['leadNo'],
                "userId": props.app.userId,
                "id": state.leads['leadId']
            }
            return Fetcher.post(props.app.apiPath + '/app/calldispose/', { headers: { "Content-type": "application/json" }, method: 'POST', body: JSON.stringify(data) })
                .then(res => {
                    setState({
                        ...state,
                        confirmCallNow: false,
                        leadNo: '',
                        redirectToLeadsList: false,
                        leadAdded: true,
                        sub: true,
                        success: res ? res.message : "Feedback for " + data.leadNo + " submitted   successfuly. "
                    });
                })
                .catch(err => {
                    console.log('Error in Call Now', err)
                    setState({
                        ...state,
                        showModal: true,
                        modalHeading: 'Error',
                        modalContent: err.message,
                    })
                });

        }

    }

    const smsNow = () => {
        var data = {
            "leadNo": state.leads.leadNo,
            "userId": props.app.userId,
        }
        return Fetcher.post(props.app.apiPath + '/app/sendsms/', { headers: { "Content-type": "application/json" }, method: 'POST', body: JSON.stringify(data) })
            .then(res => {
                // setSmsShow(false);
                setState({ ...state, showSmsModel: false, smsSent: true, sent: false, success: res ? res.message : "Message sent  successfuly to " + data.leadNo });

            })
            .catch(err => {
                console.log('Error in Call Now', err)

                setState({
                    ...state,
                    showModal: true,
                    modalHeading: 'Error',
                    modalContent: err.message,

                })
            });

    }

    let companyWebsiteUrl = [leads && leads["companyWebsite"] ?
        <a href={leads && leads["companyWebsite"] || ""} target="_blank">{leads && leads["companyWebsite"] || ""}</a> : "-"
    ];

    if (state.sub) {
        return <Redirect to={`/my-leads`} />
    }

    return (
        <>
            <Card>
                <Card.Header>Remarks</Card.Header>
                <Card.Body>

                    {state.success && <div style={{ display: 'flex', justifyContent: 'center', padding: '5px 0px', marginBottom: '20px' }}>
                        <span className="success"> {state.success}</span>
                    </div>}

                    <Table bordered>
                        <tbody>
                            <tr>
                                <td>Mobile Number</td>
                                <td>{state.leads && state.leads.leadNo || "-"}</td>
                            </tr>
                            <tr>
                                <td>Website</td>
                                <td>{companyWebsiteUrl || "-"}</td>
                            </tr>
                            <tr>
                                <td>City</td>
                                <td>{state.leads && state.leads.city || "-"}</td>
                            </tr>
                        </tbody>
                    </Table>

                    {/* <Row>
                        <Col xs="5" lg={{ span: 3, offset: 3 }}>
                            <div className="row firstCol">Mobile No.</div>
                        </Col>
                        <Col xs="2" lg="1">
                            <div className="row">:</div>
                        </Col>
                        <Col xs="5" lg="5">
                            <div className="row firstCol">{state.leads && state.leads.leadNo || "-"}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="5" lg={{ span: 3, offset: 3 }}>
                            <div className="row firstCol">Website</div>
                        </Col>
                        <Col xs="2" lg="1">
                            <div className="row">:</div>
                        </Col>
                        <Col xs="5" lg="5">
                            <div className="row firstCol">{companyWebsiteUrl || "-"}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="5" lg={{ span: 3, offset: 3 }}>
                            <div className="row firstCol">City</div>
                        </Col>
                        <Col xs="2" lg="1">
                            <div className="row">:</div>
                        </Col>
                        <Col xs="5" lg="5">
                            <div className="row firstCol">{state.leads && state.leads.city || "-"}</div>
                        </Col>
                    </Row> */}

                    <div style={{ display: 'flex', justifyContent: 'center', padding: '5px 0px', marginBottom: '20px' }}>
                        <Button
                            disabled={state.smsSent}
                            variant={(!state.smsSent ? 'primary' : 'danger')}
                            className="btnGAp customButton"
                            onClick={(e) => { setSmsShow(true) }}
                        >
                            {(!state.smsSent ? 'SMS' : 'SMS Sent')}
                        </Button>

                        <Button
                            disabled={state.emailSent}
                            variant={(!state.emailSent ? 'primary' : 'danger')}
                            className="btnGAp customButton"
                            onClick={(e) => { setEmailShow(true) }}
                        >
                            {(!state.emailSent ? 'EMAIL' : 'EMAIL Sent')}
                        </Button>

                        {state.leads && state.leads.leadNo &&
                            <a target="_blank" className="whatsUp" href={`https://wa.me/91${state.leads && state.leads.leadNo}/?text=Hi`} ><img style={{ height: '40px', borderRadius: '5px' }} src={WhatsUp} alt="React Logo" /></a>}

                    </div>

                    <Row xs={1} md={2}>
                        {state.feedbacks.map((item,) => {

                            return (<Col md="4">
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <InputGroup className="mb-1">
                                        <InputGroup.Prepend>
                                            <InputGroup.Checkbox
                                                checked={item.isChecked}
                                                aria-label="Checkbox for following text input"
                                                name={item.id}
                                                onChange={(evt) => handleCheckboxChange(evt)}
                                            />
                                        </InputGroup.Prepend>
                                        <FormControl aria-label="Text input with checkbox" value={item.value} />
                                    </InputGroup>
                                </div>
                            </Col>)

                        })}

                        <div style={{
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '15px',
                            paddingLeft: '15px', marginBottom: '20px', width: '100%'
                        }}>
                            <Form.Label style={{ width: '100%' }}>Additional Remark</Form.Label>
                            <FormControl as="textarea" aria-label="With textarea" value={state.additionalRemarks} onChange={({ target: { value } }) => setState({ ...state, additionalRemarks: value })} />
                        </div>
                    </Row>

                    <div style={{ display: 'flex', justifyContent: 'center', padding: '5px 0px', marginBottom: '20px' }}>
                        <Button
                            disabled={state.sub}
                            variant={(!state.sub ? 'primary' : 'danger')}
                            className="btnGAp customButton"
                            onClick={(e) => { callDispose() }}
                        >
                            {(!state.sub ? 'Submit Remark' : 'Submit Remark Done')}
                        </Button>
                    </div>

                </Card.Body>
            </Card>

            {state.showSmsModel &&
                <Modal size="lg" show={state.showSmsModel} onHide={() => setSmsShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-sm">
                            SMS Now
                        </Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <div>Do you want to SMS now ?</div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setSmsShow(false)} variant="secondary">CANCEL</Button>
                        <Button
                            onClick={() => smsNow()}
                            variant="primary"
                            disabled={state.smsSent}
                        >
                            Send Sms
                            {state.smsSent && <Spinner animation="border" size="sm" />}
                        </Button>
                    </Modal.Footer>

                </Modal>
            }

            {state.showEmailModel &&
                <Modal
                    size="lg"
                    show={state.showEmailModel}
                    onHide={() => setEmailShow(false)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title className="modal-heading" id="example-modal-sizes-title-sm">
                            Send Email
						</Modal.Title>

                    </Modal.Header>
                    <Modal.Body >
                        <Form.Group className="fullLength" style={{ width: "100 % !important" }}>
                            <Form.Label>Email address:</Form.Label>
                            <Form.Control
                                type="email"
                                required
                                placeholder="Enter email"
                                ref={emailTextRef}
                            />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setEmailShow(false)}
                        >Close</Button>
                        <Button
                            variant="primary"
                            disabled={state.emailSent}
                            onClick={sendEmailFunCall}
                        >
                            Send Email{" "}
                            {state.emailSent && <Spinner animation="border" size="sm" />}
                        </Button>
                    </Modal.Footer>

                </Modal>
            }

        </>
    )
}
