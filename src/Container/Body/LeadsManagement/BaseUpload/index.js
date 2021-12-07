import React, { Component } from 'react';
import { Form, Row, Col, Card, Button, Modal, Tabs, Tab } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import { Fetcher } from "../../../Helpers/fetcher.js";
import { cloneDeep, isEmpty } from 'lodash';
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";

class BaseUpload extends Component {
	constructor(props) {
		super(props);
		this.baseFileInput = React.createRef();
		let sitePath;
		let filePath;
		if (props.app.mode === 'dev') {
			sitePath = 'http://core-php.local';
			filePath = 'http://core-php.local/';
		} else {
			const protocol = window.location.protocol;
			const slashes = protocol.concat("//");
			sitePath = slashes.concat(window.location.hostname);
			//sitePath = 'http://crm.vl8.in';

			filePath = 'https://virtualapi.vl8.in/assets/';
		}
		this.state = {
			baseFileType: '',
			sendLater: false,
			sendDate: new Date(),
			baseFileInput: this.baseFileInput,
			userId: props.app.userId,
			apiPath: props.app.apiPath,
			sitePath: sitePath,
			filePath: filePath,
			baseUploads: [],
			showModal: false,
			modalHeading: 'Status',
			modalContent: ''
		}

	}

	componentDidMount() {
		const userId = this.state.userId;
		const apiPath = this.state.apiPath;

		toggleChange = (e, name) => {
			this.setState({
				[name]: !this.state[name],
			});
		}


		setvalue = (e) => {
			this.setState({
				[e.target.name]: e.target.value,
			});
		}

		setUploadType = (type, uploadTypeKey) => {
			this.setState({
				[uploadTypeKey]: type,
			});
		}

		setMessageShow = (status) => {
			const campaignCreated = this.state.campaignCreated;
			this.setState({
				showModal: status,
				redirectToSummary: campaignCreated
			});
		}


		onFileChangeHandler = event => {
			//if ( this.checkMimeType( event ) && this.checkFileSize( event ) ) {
			if (this.checkMimeType(event)) {

			}
		}



		// Base Upload

		handleBaseUploadSubmit = (event) => {
			event.preventDefault();
			const formData = cloneDeep(this.state);
			// console.log( formData );

			this.uploadBase(formData)
				.then(([baseId]) => {
					const data = {
						"userId": formData.userId
					}
					this.maybeUploadBasefile(data);

				})

		}

		uploadBase = (formData) => {
			return Promise.all([this.maybeUploadBasefile(formData)])
		}

		maybeUploadBasefile = (formData) => {
			if (formData.baseFileType === 'newBaseFile') {
				const baseFile = formData.baseFileInput.current.files[0];
				const sitePath = this.state.sitePath;
				const filePath = this.state.filePath;

				const fd = new FormData();
				fd.append('baseFile', baseFile);
				fd.append('fileType', 'baseFile');
				fd.append('userId', formData.userId);
				return Fetcher.post(sitePath + '/fileupload.php', { method: 'POST', body: fd })
					.then(res => {
						// console.log( res )
						const basefileInfo = res;
						// Add New base Upload to db
						if (basefileInfo.uploaded) {
							let data = {
								"userId": formData.userId,
								"baseName": filePath + basefileInfo.file_name
							}

							return Fetcher.post(formData.apiPath + '/app/baseupload', { headers: { "Content-type": "application/json" }, method: 'POST', body: JSON.stringify(data) })
								.then(res => {
									return res.baseId;

								})
								.catch(err => { console.log('Error in uploading BaseUpload Files to Server', err) });
						} else {
							return '';
						}


					})
					.catch(err => { console.log('Error in uploading BaseUpload Files', err) });
			} else {
				return '';
			}
		}

		addZero = (i) => {
			if (i < 10) {
				i = "0" + i;
			}
			return i;
		}

		getFileNameFromUrl = (url) => {
			var n = url.lastIndexOf('/');
			return url.substring(n + 1);
		}

		checkMimeType = (event) => {
			let files = event.target.files
			let allowedTypes = ['text/plain', 'text/csv'];
			if (event.target.name === 'newContactsFile') {
				allowedTypes = ['text/plain', 'text/csv'];
			} else {
				allowedTypes = ['audio/wav'];
			}
			let err = [] // create empty array

			for (var x = 0; x < files.length; x++) {
				if (allowedTypes.every(type => files[x].type !== type)) {
					err[x] = files[x].type + ' is not a supported format\n';
					// assign message to array
				}
			};
			for (var z = 0; z < err.length; z++) { // loop create toast massage
				event.target.value = null
				this.setState({
					showModal: true,
					modalHeading: 'Error',
					modalContent: err[z]
				})
				//toast.error( err[ z ] )
			}
			return true;
		}

		checkFileSize = (event) => {
			let allowedSize = 1;
			if (event.target.name === 'newContactsFile') {
				allowedSize = 20;
			}

			let files = event.target.files
			let err = [];
			for (var x = 0; x < files.length; x++) {
				if (((files[x].size / 1024 / 1024).toFixed(2)) > allowedSize) {
					err[x] = files[x].size + ' is too large, please pick a smaller file\n';
				}
			};
			for (var z = 0; z < err.length; z++) {
				//console.log( err )
				this.setState({
					showModal: true,
					modalHeading: 'Error',
					modalContent: err[z]
				})
				event.target.value = null
			}
			return true;
		}



		render() {
			// Redirect to Summary if Base Uploaded successfully.
			//if ( this.state.redirectToSummary === true ) {
			//	return <Redirect to='/campaign-summary' />
			//}
			let sendLaterDatepicker = '';
			let submitButtonlabel = 'Send Now';

			let baseUploadDropdown = '';

			if (!isEmpty(baseUploads) && (!('error' in baseUploads))) {
				baseUploadDropdown = baseUploads.map((fileObj, index) => {
					return <option value={fileObj.baseId} key={`basefile${index}`} >{this.getFileNameFromUrl(fileObj.baseName)}</option>
				})

			} else {
				baseUploadDropdown = <option value="" >No Files</option>
			}

			return (

				<Form className="add-campaign-form" onSubmit={(e) => this.handleBaseUploadSubmit(e)}>
					<Row>
						<Col sm={12}>
							<Card>
								<Card.Header>Upload Base</Card.Header>
								<Card.Body>
									<Row>
										<Col sm={8}>
											<Form.Label>Upload Contacts( Please do not prefix country code. )</Form.Label>
											<Tabs defaultActiveKey="contactList" className="" onSelect={k => this.setUploadType(k, 'baseFileType')}>
												<Tab eventKey="newBaseFile" title="Upload New Contacts File">
													<Form.Group >
														<Form.Control name="newContactsFile" onChange={this.onFileChangeHandler} ref={this.baseFileInput} type="file" />
													</Form.Group>
												</Tab>
											</Tabs>

										</Col>
									</Row>
									<Button variant="primary" type="submit">{submitButtonlabel}</Button>
								</Card.Body>
							</Card>

						</Col>
					</Row>
					<Modal size="sm" show={this.state.showModal} onHide={() => this.setMessageShow(false)}>
						<Modal.Header closeButton>
							<Modal.Title id="example-modal-sizes-title-sm">
								{this.state.modalHeading}
							</Modal.Title>

						</Modal.Header>
						<Modal.Body>{this.state.modalContent} </Modal.Body>
					</Modal>

				</Form>
			);
		}
	}

	export default BaseUpload;