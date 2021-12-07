import React, { Component } from 'react';
import { Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { Fetcher } from '../../Helpers/fetcher.js';
import { isEmpty } from 'lodash';
import "./index.css";
class Login extends Component {
	constructor( props ) {
		super( props );
		console.log(this.props.app)
		console.log(this.props.app.userId)
		this.state = {
			username: '',
			password: '',
			showModal: false,
			modalHeading: 'Status',
			modalContent: ''
		}
	}

	setvalue = ( e ) => {
		this.setState( {
			[ e.target.name ]: e.target.value,
		} );
	}

	loginUser = ( e ) => {
		e.preventDefault();
		const username = this.state.username;
		const password = this.state.password;

		if ( username === '' || password === '' ) {
			this.setState( {
				showModal: true,
				modalHeading: 'Error',
				modalContent: 'Please enter username & password.'
			} )
		} else {
			const data = {
				username: username,
				password: password
			}
			return Fetcher.post( this.props.app.apiPath + '/login', { headers: { "Content-type": "application/json" }, method: 'POST', body: JSON.stringify( data ) } )
				.then( res => {
					console.log(res.token)
					console.log(isEmpty( res.token));
					console.log(isEmpty(res.userid));
					console.log(res.userid);
					let modalHeading;
					if ( res.message === 'Bad credentials' ) {
						modalHeading = 'Error';
						this.setState( {
							showModal: true,
							modalHeading: modalHeading,
							modalContent: 'Wrong username or password.'
						} )
					} else if ( !isEmpty( res.token ) && !isEmpty( res.userid ) ) {
						console.log(res.token)
						console.log(res.role)
						modalHeading = 'Success';
						this.props.setUserToken( res.userid, res.token, res.role )
						console.log(this.props.setUserToken)

					}else{
						console.log('Login failed:',res);
					}
				} )
				.catch( err => {
					console.log( 'Error in Login', err )
					this.setState( {
						showModal: true,
						modalHeading: 'Error',
						modalContent: err.message
					} )
				} );

		}
	}

	setMessageShow = ( status ) => {
		this.setState( {
			showModal: status,
		} );
	}


	render() {
		return (
			<div className="app flex-row align-items-center">
				<Container>
					<Row className="justify-content-center">
						<Col md="4">
							<Card className="p-4">
								<Card.Body>
									<Form method="post" onSubmit={this.loginUser}>
										<div className="login-logo text-center">
											{this.props.app.logo && <img className="navbar-brand-full" src={this.props.app.logo} alt="CoreUI Logo" /> }
										</div>

										<p className="text-muted text-center">Sign In to your account</p>
										<InputGroup className="mb-3">
											<div className="input-group-prepend"><span className="input-group-text"><i className="fa fa-user"></i></span></div>
											<Form.Control className="field-username" name="username" type="text" placeholder="Username" onChange={e => this.setvalue( e )} value={this.state.username} autoComplete="username" />
										</InputGroup>
										<InputGroup className="mb-4">
											<div className="input-group-prepend"><span className="input-group-text"><i className="fa fa-lock"></i></span></div>
											<Form.Control name="password" type="password" placeholder="Password" onChange={e => this.setvalue( e )} value={this.state.password} autoComplete="current-password" />
										</InputGroup>
										{this.state.showModal&& <div className="login-error">{this.state.modalContent}</div>}
										<Row>
											<Col xs="12 text-center">
												<Button type="submit" color="primary" className="px-4 btn btn-primary btn-round">Login</Button>
											</Col>
											{/* <Col xs="6" className="text-right">
													<Button color="link" className="px-0">Forgot password?</Button>
												</Col> */}
										</Row>
									</Form>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Container>

			</div>
		);
	}
}

export default Login;