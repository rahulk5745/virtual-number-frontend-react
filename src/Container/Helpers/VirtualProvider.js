import React, { Component } from 'react';
import VirtualContaxt from "./VirtualContaxt"

class VirtualProvider extends Component {
    state = { leads: {} };

    render() {
        return (
            <VirtualContaxt.Provider
                value={{
                    // msg: "hellloooooooooo",
                    leads: this.state.leads,
                    setLeads: leads => this.setState({ leads })
                }}
            >
                {this.props.children}
            </VirtualContaxt.Provider>
        );
    }
}

export default VirtualProvider;
