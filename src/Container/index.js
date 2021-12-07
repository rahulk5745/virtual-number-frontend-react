import React, { Component } from 'react';
import Header from './Header';
import Body from './Body';
import { Fetcher } from './Helpers/fetcher.js';
import Cookies from 'js-cookie';
import VirtualProvider from "./Helpers/VirtualProvider";

class Container extends Component {
	state = {
		mode: "production",
		//apiPath: (window.location.host === 'virtual.vl8.in') ? 'https://virtualapi.vl8.in' : 'https://virtualapi.vl8.in',
		apiPath: 'http://localhost:4000',
		recPath: 'https://cdn.vl8.in/',
		siteUrl: window.location.origin,
		userId: '',
		token: '',
		userRole: '',
		toggleSidebar: false,
		logo: false,
		company: false
	}	

	componentDidMount() {
		const userId = Cookies.get('userId');
		const token = Cookies.get('token');
		const userRole = Cookies.get('role');

		//Fetcher.get(`${this.state.apiPath}/app/branding/${window.location.hostname !== "localhost" ? window.location.hostname : "virtual.vl8.in"}`)
		Fetcher.get(`${this.state.apiPath}/app/branding/${window.location.hostname !== "localhost" ? window.location.hostname : "virtual.vl8.in"}`)	
		.then(res => {
				if (typeof res.company !== 'undefined') {
					document.title = res.company;
					//console.log(res.company)
				}

				this.setState({
					userId: userId,
					token: token,
					userRole: userRole,
					logo: (typeof res.logo !== 'undefined') ? res.logo : '',
					company: (typeof res.company !== 'undefined') ? res.company : ''
				})
			})
			.catch(err => {
				this.setState({
					userId: userId,
					token: token,
					userRole: userRole,
				})
				console.log('Error in fetching Branding', err)
			});

	}

	setUserToken = (userId, token, role) => {

		Cookies.set('userId', userId);
		Cookies.set('token', token);
		Cookies.set('role', role[0]);
		this.setState({
			userId: userId,
			token: token,
			userRole: role[0]
		})
	}

	logOutUser = () => {
		Cookies.set('userId', '');
		Cookies.set('token', '');
		Cookies.set('role', '');
		this.setState({
			userId: '',
			token: '',
			userRole: ''
		})
		window.location.href = "/";
	}
	toggleSidebar = () => {
		this.setState({
			toggleSidebar: !this.state.toggleSidebar,
		});
	}

	render() {

		// console.log(this.state);
		let urlPrefix = '';
		if (this.state.mode === 'dev') {
			urlPrefix = '/build';
		}
		const app = {
			mode: this.state.mode,
			apiPath: this.state.apiPath,
			recPath: this.state.recPath,
			urlPrefix: urlPrefix,
			siteUrl: this.state.siteUrl,
			userId: this.state.userId,
			token: this.state.token,
			role: this.state.userRole,
			logo: this.state.logo,
			company: this.state.company
		}
		const toggleSidebarClass = this.state.toggleSidebar ? 'sidebar-show sidebar-lg-show' : '';
		return (
			<VirtualProvider>
				<div className={`${toggleSidebarClass} app header-fixed sidebar-fixed aside-menu-fixed`}>
					{(this.state.userId !== '' && typeof this.state.userId !== 'undefined') && <Header logo={this.state.logo} toggleSidebar={this.toggleSidebar} logOutUser={this.logOutUser} app={app} />}

					<Body toggleSidebar={this.toggleSidebar} setUserToken={this.setUserToken} app={app} getUserCampaignList={this.getUserCampaignList} {...this.props} />

					{/* <Footer /> */}
				</div>
			</VirtualProvider>
		);
	}
}
export default Container;